import Parser from "rss-parser";
import { writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const RSS_FEEDS = [
  "https://cvefeed.io/rssfeed/latest.xml",
  "https://www.jpcert.or.jp/rss/jpcert.rdf",
];

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const POSTS_DIR = "./app/routes/posts";

// 既存記事のチェック（重複防止）
async function getExistingCVEIds() {
  try {
    const files = await readdir(POSTS_DIR);
    const cveIds = files
      .filter((f) => f.includes("CVE-") || f.includes("JPCERT"))
      .map((f) => {
        const match = f.match(/(CVE-\d{4}-\d+|JPCERT-\d+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean);
    return new Set(cveIds);
  } catch (error) {
    return new Set();
  }
}

// RSSフィード取得
async function fetchRSSFeeds() {
  const parser = new Parser();
  const allItems = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`📥 Fetching: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      allItems.push(
        ...feed.items.map((item) => ({
          ...item,
          source: feedUrl.includes("cvefeed") ? "CVEfeed.io" : "JPCERT/CC",
        })),
      );
    } catch (error) {
      console.error(`❌ Failed to fetch ${feedUrl}:`, error.message);
    }
  }

  return allItems;
}

// Claude APIで記事生成
async function generateArticleWithClaude(item) {
  const prompt = `以下のセキュリティ情報を、技術ブログ記事として日本語で構造化してください。

# 入力情報
タイトル: ${item.title}
リンク: ${item.link}
概要: ${item.contentSnippet || item.content || "情報なし"}
公開日: ${item.pubDate}
ソース: ${item.source}

# 出力形式
以下のJSON形式で出力してください：

{
  "title": "記事タイトル（日本語、簡潔に）",
  "cve_id": "CVE-2024-XXXX or JPCERT-XXX（該当する場合のみ）",
  "severity": "critical/high/medium/low（推測）",
  "category": "vulnerability/incident/alert/advisory",
  "affected_products": ["影響を受ける製品・サービスのリスト"],
  "summary": "1-2文の簡潔な概要",
  "details": "詳細説明（Markdown形式）",
  "impact": "影響範囲の説明",
  "mitigation": "対応方法・推奨事項"
}

重要：
- 必ず有効なJSONのみを出力すること
- 情報が不足している場合は「情報なし」と記載
- CVE IDが明示されていない場合はnullを設定
- 専門用語は日本語化しつつ、必要に応じて英語も併記
- 【MDX互換性】HTMLタグ（<script>, <p>, <div>等）を本文中で言及する場合は、必ずバッククォートで囲んでインラインコードとして記述すること（例: \`<script>\` タグ）。これを怠るとMDXのビルドが失敗します`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 30000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // JSONを抽出（マークダウンのコードブロックを除去）
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Claude response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("❌ Claude API error:", error.message);
    return null;
  }
}

// MDXファイル生成
async function generateMDXFile(article, originalItem) {
  // ブログ記事の公開日は生成日（今日）を使用
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "/");
  const fileDate = date.toISOString().slice(0, 10);

  const identifier = article.cve_id || `SECURITY-${Date.now()}`;
  const filename = `${fileDate}_${identifier.replace(
    /[^a-zA-Z0-9-]/g,
    "_",
  )}.mdx`;
  const filepath = join(POSTS_DIR, filename);

  const severityEmoji = {
    critical: "🔴",
    high: "🟠",
    medium: "🟡",
    low: "🟢",
  };

  const mdxContent = `---
title: "${article.title}"
description: "${article.summary}"
date: "${dateStr}"
page: false
published: true
category: "security"
severity: "${article.severity}"
${article.cve_id ? `cve_id: "${article.cve_id}"` : ""}
source: "${originalItem.source}"
original_link: "${originalItem.link}"
tags: ["CVE", "Security", "${
    article.severity.charAt(0).toUpperCase() + article.severity.slice(1)
  }"]
---

# ${severityEmoji[article.severity] || "🔒"} ${article.title}

## 概要

${article.summary}

${article.cve_id ? `**CVE ID**: ${article.cve_id}` : ""}
**深刻度**: ${article.severity.toUpperCase()}
**情報源**: [${originalItem.source}](${originalItem.link})

## 詳細

${article.details}

## 影響範囲

${article.impact}

${
  article.affected_products && article.affected_products.length > 0
    ? `
### 影響を受ける製品・サービス

${article.affected_products.map((p) => `- ${p}`).join("\n")}
`
    : ""
}

## 対応方法

${article.mitigation}

---

**参考リンク**: [元記事を確認](${originalItem.link})

この記事は自動生成されました。内容の正確性については保証されませんので、必ず公式情報をご確認ください。
`;

  await writeFile(filepath, mdxContent, "utf-8");
  console.log(`✅ Generated: ${filename}`);
}

// メイン処理
async function main() {
  console.log("🚀 Starting security news fetch...");

  if (!ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY is not set");
    process.exit(1);
  }

  const existingIds = await getExistingCVEIds();
  console.log(`📚 Found ${existingIds.size} existing articles`);

  const items = await fetchRSSFeeds();
  console.log(`📰 Fetched ${items.length} items from RSS feeds`);

  // 最新5件のみ処理（コスト削減）
  const recentItems = items.slice(0, 5);
  let processedCount = 0;

  for (const item of recentItems) {
    // CVE IDまたはJPCERT IDを抽出
    const cveMatch = item.title?.match(/CVE-\d{4}-\d+/);
    const jpcertMatch = item.title?.match(/JPCERT[A-Z]?-\d+/i);
    const id = cveMatch?.[0] || jpcertMatch?.[0];

    // 既存記事のスキップ
    if (id && existingIds.has(id)) {
      console.log(`⏭️  Skipping existing: ${id}`);
      continue;
    }

    console.log(`\n🔄 Processing: ${item.title}`);

    const article = await generateArticleWithClaude(item);
    if (article) {
      // High以上の深刻度のみ処理
      if (article.severity === "high" || article.severity === "critical") {
        await generateMDXFile(article, item);
        processedCount++;
        console.log(
          `✅ Added ${article.severity.toUpperCase()} severity article`,
        );
      } else {
        console.log(
          `⏭️  Skipping ${article.severity.toUpperCase()} severity (below threshold)`,
        );
      }

      // API rate limit対策（1秒待機）
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✨ Done! Processed ${processedCount} new articles`);
}

main().catch(console.error);
