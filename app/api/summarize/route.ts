import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = "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";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

interface SummarizeResponse {
  success: boolean;
  summary?: string;
  topics?: string[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SummarizeResponse>> {
  try {
    const { content, url } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Valid content is required" },
        { status: 400 }
      );
    }

    // Call OpenRouter API for summarization and topic classification
    // Using openai/gpt-3.5-turbo which is widely available on OpenRouter
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://reading-list.app",
        "X-Title": "Reading List AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Analyze the following content and provide:
1. A concise summary (2-3 sentences)
2. 3-5 relevant topic tags

Content to analyze:
${content.slice(0, 5000)}

Please respond in this exact JSON format:
{
  "summary": "Your summary here",
  "topics": ["topic1", "topic2", "topic3"]
}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to summarize content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      return NextResponse.json(
        { success: false, error: "Invalid API response" },
        { status: 500 }
      );
    }

    // Parse JSON response from AI
    let summary = "";
    let topics: string[] = [];

    try {
      const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        summary = parsed.summary || "";
        topics = Array.isArray(parsed.topics) ? parsed.topics : [];
      } else {
        summary = messageContent;
        topics = [];
      }
    } catch {
      summary = messageContent;
      topics = [];
    }

    return NextResponse.json({
      success: true,
      summary: summary.slice(0, 500),
      topics: topics.slice(0, 5),
    });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process summarization" },
      { status: 500 }
    );
  }
}
