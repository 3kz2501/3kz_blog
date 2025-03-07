import type { FC } from "hono/jsx";
import CategoryLabel from "../components/CategoryLabel";

export default function Top() {
  return (
    <>
      <div class="mt-16">
        <Posts />
      </div>
    </>
  );
}

const Posts: FC = () => {
  const posts = import.meta.glob<{
    frontmatter: {
      title: string;
      date: string;
      published: boolean;
      categories?: string[];
    };
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
    <>
      <h2 class="text-jade-light text-2xl mb-8">All Posts</h2>
      <ul>
        {entries.map(([id, module]) => (
          <li key={id} class="mt-6 pb-6 border-b border-jade-dark">
            <span class="tabular-nums tnum text-jade-dark block mb-2">
              {module.frontmatter.date}
            </span>
            <a
              class="text-jade-light text-xl font-semibold hover:underline"
              href={`${id.replace(/\.mdx$/, "")}`}
            >
              {module.frontmatter.title}
            </a>
            {module.frontmatter.categories &&
              module.frontmatter.categories.length > 0 && (
                <div class="mt-3">
                  {module.frontmatter.categories.map((cat) => (
                    <CategoryLabel
                      key={cat}
                      category={cat}
                      size="sm"
                      className="mr-2 mb-1"
                    />
                  ))}
                </div>
              )}
          </li>
        ))}
      </ul>
    </>
  );
};
