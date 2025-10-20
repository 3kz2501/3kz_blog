import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const POSTS_DIR = "./app/routes/posts";

async function addTagsToCVEPosts() {
  const files = await readdir(POSTS_DIR);
  const cveFiles = files.filter((f) => f.includes("CVE-") && f.endsWith(".mdx"));

  console.log(`Found ${cveFiles.length} CVE articles`);

  for (const file of cveFiles) {
    const filepath = join(POSTS_DIR, file);
    let content = await readFile(filepath, "utf-8");

    // 既にtagsが存在する場合はスキップ
    if (content.includes("tags:")) {
      console.log(`⏭️  Skipping ${file} (already has tags)`);
      continue;
    }

    // severityを抽出
    const severityMatch = content.match(/severity: "(\w+)"/);
    const severity = severityMatch ? severityMatch[1] : "medium";
    const severityCapitalized =
      severity.charAt(0).toUpperCase() + severity.slice(1);

    // original_linkの後にtagsを追加
    content = content.replace(
      /original_link: "([^"]+)"/,
      `original_link: "$1"\ntags: ["CVE", "Security", "${severityCapitalized}"]`,
    );

    await writeFile(filepath, content, "utf-8");
    console.log(`✅ Added tags to ${file}`);
  }

  console.log("\n✨ Done!");
}

addTagsToCVEPosts().catch(console.error);
