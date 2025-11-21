import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reading List Application',
  description: 'Scrape and summarize URLs asynchronously',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
