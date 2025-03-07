import { jsxRenderer } from "hono/jsx-renderer";

export default jsxRenderer(({ children, Layout }) => {
  return (
    <Layout>
      <div>{children}</div>
    </Layout>
  );
});
