export interface RSSItem {
  title: string;
  description: string;
  url: string;
  date: string;
  categories?: string[];
}

export interface RSSFeedOptions {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  language?: string;
  items: RSSItem[];
}

export function generateRSSFeed(options: RSSFeedOptions): string {
  const {
    title,
    description,
    siteUrl,
    feedUrl,
    language = "ja",
    items,
  } = options;

  // 現在の日時をRFC822形式で取得
  const pubDate = new Date().toUTCString();

  // RSSヘッダー部分を生成
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${siteUrl}</link>
  <description>${escapeXml(description)}</description>
  <language>${language}</language>
  <lastBuildDate>${pubDate}</lastBuildDate>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
`;

  // 各アイテムを追加
  items.forEach((item) => {
    const itemDate = new Date(item.date).toUTCString();

    rss += `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${item.url}</link>
    <guid>${item.url}</guid>
    <pubDate>${itemDate}</pubDate>
    <description>${escapeXml(item.description)}</description>
`;

    rss += `  </item>\n`;
  });

  // RSSフッター部分を追加
  rss += `</channel>
</rss>`;

  return rss;
}

// XMLエスケープ用のヘルパー関数
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
