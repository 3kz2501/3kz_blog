import type { FC } from "hono/jsx";

export default function Top() {
  return (
    <>
      <Posts />
    </>
  );
}

const Posts: FC = () => {
  const posts = import.meta.glob<{
    frontmatter: { title: string; date: string; published: boolean };
  }>("./posts/*.mdx", { eager: true });

  // フィルタリングとソートを一緒に行う
  const entries = Object.entries(posts)
    .filter(([, module]) => module.frontmatter.published)
    .sort(([, moduleA], [, moduleB]) => {
      // 日付を比較して新しい順（降順）にソート
      const dateA = new Date(moduleA.frontmatter.date);
      const dateB = new Date(moduleB.frontmatter.date);
      return dateB.getTime() - dateA.getTime(); // 降順ソート
    });

  return (
    <div class="mt-16">
      <ul class="mt-10">
        {entries.map(([id, module]) => (
          <li key={id} class="text-lg mt-2 md:mt-1">
            <span class="tabular-nums tnum text-jade-dark">
              {module.frontmatter.date}:{" "}
            </span>
            <br class="block md:hidden" />
            <a class="text-jade underline" href={`${id.replace(/\.mdx$/, "")}`}>
              {module.frontmatter.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
