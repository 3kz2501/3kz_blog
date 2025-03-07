import type { FC } from "hono/jsx";

const Navigation: FC = () => {
  const pages = import.meta.glob<{
    frontmatter: { title: string; page: boolean; published: boolean };
  }>("/app/routes/pages/*.mdx", { eager: true });

  // Filter for published pages with page: true
  const pageEntries = Object.entries(pages).filter(
    ([, module]) => module.frontmatter.published && module.frontmatter.page,
  );

  return (
    <div className="flex items-center gap-4">
      {pageEntries.map(([id, module]) => {
        const path = id.replace("/app/routes", "").replace(/\.mdx$/, "");

        return (
          <a key={path} href={path} className="text-jade-light hover:underline">
            {module.frontmatter.title}
          </a>
        );
      })}
    </div>
  );
};

export default Navigation;
