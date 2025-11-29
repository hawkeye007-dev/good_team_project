import re
from urllib.parse import urljoin
from typing import List, Optional

import httpx
from bs4 import BeautifulSoup


async def fetch_html(url: str, timeout: int = 20) -> Optional[str]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }
    try:
        async with httpx.AsyncClient(timeout=timeout, headers=headers, follow_redirects=True) as client:
            r = await client.get(url)
            r.raise_for_status()
            return r.text
    except Exception as e:
        print(f"Fetch error for {url}: {e}")
        return None


def extract_title(soup: BeautifulSoup) -> Optional[str]:
    if soup.title and soup.title.string:
        return soup.title.string.strip()
    og = soup.find("meta", property="og:title")
    if og and og.get("content"):
        return og.get("content").strip()
    h1 = soup.find("h1")
    if h1 and h1.get_text(strip=True):
        return h1.get_text(strip=True)
    return None


def extract_description(soup: BeautifulSoup) -> Optional[str]:
    d = soup.find("meta", attrs={"name": "description"})
    if d and d.get("content"):
        return d.get("content").strip()
    og = soup.find("meta", property="og:description")
    if og and og.get("content"):
        return og.get("content").strip()
    return None


def extract_images(soup: BeautifulSoup, base_url: str, limit: int = 5) -> List[str]:
    urls = []
    # og:image
    og = soup.find_all("meta", property="og:image")
    for tag in og:
        c = tag.get("content")
        if c:
            urls.append(urljoin(base_url, c))

    # images from <img>
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if not src:
            continue
        full = urljoin(base_url, src)
        if full not in urls:
            urls.append(full)
        if len(urls) >= limit:
            break

    return urls[:limit]


def extract_price(soup: BeautifulSoup) -> Optional[str]:
    # Look for common meta tags
    selectors = [
        ("meta", {"itemprop": "price"}),
        ("meta", {"property": "product:price:amount"}),
        ("span", {"class": re.compile("price", re.I)}),
        ("div", {"class": re.compile("price", re.I)}),
    ]
    for tag, attrs in selectors:
        found = soup.find(tag, attrs=attrs)
        if found:
            if found.get("content"):
                return found.get("content").strip()
            text = found.get_text(strip=True)
            if text:
                return text

    # fallback: regex search for currency patterns in text
    text = soup.get_text(separator=" ", strip=True)
    m = re.search(r"(\$|€|£)\s?[0-9]+(?:[\.,][0-9]{2})?", text)
    if m:
        return m.group(0)
    return None


def extract_text(soup: BeautifulSoup, max_chars: int = 20000) -> str:
    """Extract meaningful text content from the page."""
    texts = []
    
    # 1. Try to get structured content first (article, main)
    for tagname in ("article", "main", "section"):
        candidates = soup.find_all(tagname)
        for candidate in candidates:
            paragraphs = [p.get_text(" ", strip=True) for p in candidate.find_all("p")]
            texts.extend([p for p in paragraphs if len(p) > 30])
    
    # 2. Get all paragraphs from body
    if soup.body:
        paragraphs = [p.get_text(" ", strip=True) for p in soup.body.find_all("p")]
        texts.extend([p for p in paragraphs if len(p) > 30 and p not in texts])
    
    # 3. Get headings for context
    headings = []
    for tag in ["h1", "h2", "h3"]:
        for h in soup.find_all(tag):
            ht = h.get_text(" ", strip=True)
            if ht and len(ht) > 3:
                headings.append(ht)
    
    # 4. Get list items (often contain useful info)
    list_items = []
    for li in soup.find_all("li"):
        lit = li.get_text(" ", strip=True)
        if lit and 10 < len(lit) < 500:
            list_items.append(lit)
    
    # 5. Get table data - extract structured info from tables
    table_info = []
    tables = soup.find_all("table")
    for table in tables[:3]:  # Process up to 3 tables
        rows = table.find_all("tr")
        if rows:
            # Get headers
            headers = [th.get_text(" ", strip=True) for th in rows[0].find_all(["th", "td"])]
            if headers:
                table_info.append(f"Table columns: {', '.join(headers[:10])}")
            
            # Get sample data rows (first 10 and last 5 for summary)
            data_rows = rows[1:11] + rows[-5:] if len(rows) > 15 else rows[1:]
            for row in data_rows[:15]:
                cells = [td.get_text(" ", strip=True)[:50] for td in row.find_all(["td", "th"])]
                if cells and any(c for c in cells):
                    table_info.append(" | ".join(cells[:6]))
            
            table_info.append(f"(Total rows: {len(rows) - 1})")
    
    # 6. Get div text as last resort
    div_texts = []
    if not texts:
        for div in soup.find_all("div"):
            dt = div.get_text(" ", strip=True)
            if dt and 50 < len(dt) < 1000:
                # Avoid duplicates and navigation text
                if dt not in div_texts and not any(nav in dt.lower() for nav in ["menu", "navigation", "cookie"]):
                    div_texts.append(dt)
    
    # Combine all extracted content
    all_content = []
    
    if headings:
        all_content.append("Page Headings: " + " | ".join(headings[:10]))
    
    if texts:
        all_content.append("\n\nMain Content:\n" + "\n\n".join(texts[:20]))
    
    if table_info:
        all_content.append("\n\nTable Data:\n" + "\n".join(table_info))
    
    if list_items and len(list_items) < 50:  # Only if not too many (navigation)
        all_content.append("\n\nKey Points:\n- " + "\n- ".join(list_items[:15]))
    
    if div_texts and not texts:
        all_content.append("\n\nPage Content:\n" + "\n".join(div_texts[:10]))
    
    result = "".join(all_content)
    
    # If still empty, get raw body text
    if not result.strip() and soup.body:
        result = soup.body.get_text(separator=" ", strip=True)
    
    return result[:max_chars]


async def scrape_url(url: str) -> dict:
    html = await fetch_html(url)
    if not html:
        return {"url": url, "error": "failed_fetch"}

    soup = BeautifulSoup(html, "html.parser")
    title = extract_title(soup)
    description = extract_description(soup)
    images = extract_images(soup, url, limit=5)
    price = extract_price(soup)
    text = extract_text(soup)

    return {
        "url": url,
        "title": title,
        "description": description,
        "price": price,
        "images": images,
        "text": text,
    }
