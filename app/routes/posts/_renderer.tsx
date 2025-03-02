import { jsxRenderer } from "hono/jsx-renderer";
import Card from "../../components/Card";
import SnsButton from "../../islands/ShareButton";

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  const _title = `${frontmatter?.title} | 3kz Blog`;

  return (
    <Layout title={_title} description={frontmatter?.description}>
      <div class="markdown">
        {typeof children === "function"
          ? children({ components: { Card } })
          : children}
      </div>
      <SnsButton title={_title} />
    </Layout>
  );
});
