import { FC } from "hono/jsx";
import { createRoute } from "honox/factory";
import CategoryLabel from "../../components/CategoryLabel";

export const GET = createRoute(async (c) => {
  const category = decodeURIComponent(c.req.param("category"));

  return c.render(<CategoryPosts category={category} />, {
    title: `Category: ${category} | 3kz Blog`,
    description: `${category}カテゴリの記事一覧 | 3kz Blog`,
  });
});

const CategoryPosts: FC<{ category: string }> = ({ category }) => {
  const posts = import.meta.glob<{
    frontmatter: {
      title: string;
      date: string;
      published: boolean;
      categories?: string[];
    };
  }>("../posts/*.mdx", { eager: true });

  // カテゴリでフィルタリングしてソート
  const entries = Object.entries(posts)
    .filter(
      ([, module]) =>
        module.frontmatter.published &&
        module.frontmatter.categories?.includes(category),
    )
    .sort(([, moduleA], [, moduleB]) => {
      // 日付を比較して新しい順（降順）にソート
      const dateA = new Date(moduleA.frontmatter.date);
      const dateB = new Date(moduleB.frontmatter.date);
      return dateB.getTime() - dateA.getTime(); // 降順ソート
    });

  return (
    <>
      <div className="mt-8 mb-12">
        <h1 className="text-jade-light text-3xl mb-2">Category: {category}</h1>
        <p className="text-jade-dark">
          <a href="/" className="hover:underline">
            ← Back to all posts
          </a>
        </p>
      </div>

      {entries.length > 0 ? (
        <ul>
          {entries.map(([id, module]) => (
            <li key={id} className="mt-6 pb-6 border-b border-jade-dark">
              <span className="tabular-nums tnum text-jade-dark block mb-2">
                {module.frontmatter.date}
              </span>
              <a
                className="text-jade-light text-xl font-semibold hover:underline"
                href={`${id
                  .replace("../posts/", "/posts/")
                  .replace(/\.mdx$/, "")}`}
              >
                {module.frontmatter.title}
              </a>
              {module.frontmatter.categories &&
                module.frontmatter.categories.length > 0 && (
                  <div className="mt-3">
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
      ) : (
        <div className="text-jade-light text-center py-12">
          <p>No posts found in this category.</p>
        </div>
      )}
    </>
  );
};
import { createRoute } from "honox/factory";
import Category from "./Category";

export const route = createRoute((app) => {
  app.get("/", (c) => {
    const { category } = c.req.param();
    return c.render(<Category params={{ category }} />);
  });
});
