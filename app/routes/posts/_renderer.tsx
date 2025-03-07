import { jsxRenderer } from "hono/jsx-renderer";
import SnsButton from "../../islands/ShareButton";
import CategoriesList from "../../components/CategoriesList";

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  const _title = `${frontmatter?.title} | 3kz Blog`;
  const categories = frontmatter?.categories || [];

  return (
    <Layout title={_title} description={frontmatter?.description}>
      <div class="mt-16">
        <h1 class="text-jade-light text-4xl font-bold mb-8">
          {frontmatter?.title}
        </h1>
        {categories.length > 0 && (
          <div class="mb-6">
            <CategoriesList categories={categories} size="sm" />
          </div>
        )}
        <div class="border-b border-jade-dark mb-10"></div>
        <div class="markdown">{children}</div>
        <div class="mt-16">
          <SnsButton title={_title} />
        </div>
      </div>
    </Layout>
  );
});
