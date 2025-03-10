import { jsxRenderer } from "hono/jsx-renderer";

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  const _title = `${frontmatter?.title} | 3kz Blog`;

  return (
    <Layout title={_title} description={frontmatter?.description}>
      {/* 記事タイトルを表示 */}
      <h1 class="mt-12 text-3xl font-bold text-jade-light mb-6">
        {frontmatter?.title}
      </h1>
      {/* 投稿日を表示（frontmatterに日付がある場合） */}
      {frontmatter?.date && (
        <div class="text-jade-dark mb-8">{frontmatter.date}</div>
      )}
      <div class="markdown">{children}</div>
      <div class="mt-8 mb-4">
        <a
          href="/"
          class="inline-flex items-center text-jade hover:text-jade-light transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Home
        </a>
      </div>
    </Layout>
  );
});
