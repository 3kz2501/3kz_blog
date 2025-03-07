import type { FC } from "hono/jsx";

export default function Category({ params }: { params: { category: string } }) {
  const { category } = params;
  const decodedCategory = decodeURIComponent(category);

  return (
    <>
      <div class="mt-16">
        <h1 class="text-3xl text-jade-light font-bold mb-8">
          Category: {decodedCategory}
        </h1>
        <CategoryPosts category={decodedCategory} />
      </div>
    </>
  );
}

const CategoryPosts: FC<{ category: string }> = ({ category }) => {
  const posts = import.meta.glob<{
    frontmatter: {
      title: string;
      date: string;
      published: boolean;
      categories?: string[];
    };
  }>("../posts/*.mdx", { eager: true });

  // Filter posts by category and ensure they're published
  const entries = Object.entries(posts)
    .filter(([, module]) => {
      const categories = module.frontmatter.categories || [];
      return module.frontmatter.published && categories.includes(category);
    })
    .sort(([, moduleA], [, moduleB]) => {
      // Sort by date, newest first
      const dateA = new Date(moduleA.frontmatter.date);
      const dateB = new Date(moduleB.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });

  if (entries.length === 0) {
    return <div class="text-jade mt-8">No posts found in this category.</div>;
  }

  return (
    <ul class="mt-10">
      {entries.map(([id, module]) => {
        // Fix the path by correctly handling the relative path
        const path = id.replace(/\.mdx$/, "").replace(/^\.\.\//, "");
        return (
          <li key={id} class="text-lg mt-6 pb-6 border-b border-jade-dark">
            <span class="tabular-nums tnum text-jade-dark block mb-2">
              {module.frontmatter.date}
            </span>
            <a
              class="text-jade-light text-xl font-semibold hover:underline"
              href={`/${path}`}
            >
              {module.frontmatter.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
