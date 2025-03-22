import { createRoute } from "honox/factory";
import { generateRSSFeed, type RSSItem } from "../libs/rss";

// サイトの基本情報
const SITE_TITLE = "3kz Blog";
const SITE_DESCRIPTION = "3kzのブログです。技術や趣味について書いています。";
const SITE_URL = "https://3kz.tech";
const FEED_URL = "https://3kz.tech/feed.xml";

export const GET = createRoute(async (c) => {
  // 記事データを取得
  const posts = import.meta.glob<{
    frontmatter: {
      title: string;
      date: string;
      description?: string;
      published: boolean;
      categories?: string[];
    };
  }>("/app/routes/posts/*.mdx", { eager: true });

  // 公開済みの記事のみをフィルタリングし、日付でソート
  const rssItems: RSSItem[] = Object.entries(posts)
    .filter(([, module]) => module.frontmatter.published)
    .sort(([, a], [, b]) => {
      return (
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
      );
    })
    .map(([path, module]) => {
      // 記事のURLを生成
      const slug = path.replace("/app/routes/", "/").replace(/\.mdx$/, "");

      return {
        title: module.frontmatter.title,
        description: module.frontmatter.description || "",
        url: `${SITE_URL}${slug}`,
        date: module.frontmatter.date,
        categories: module.frontmatter.categories || [],
      };
    });

  // RSSフィードを生成
  const feed = generateRSSFeed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteUrl: SITE_URL,
    feedUrl: FEED_URL,
    items: rssItems,
  });

  // XMLとしてレスポンスを返す
  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
});
