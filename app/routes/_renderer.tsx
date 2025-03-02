import { jsxRenderer } from "hono/jsx-renderer";
import { Script } from "honox/server";
import { LINK } from "../constants";

export default jsxRenderer(({ children, title, description }) => {
  const _title = title ?? "3kz Blog";
  const _description = description ?? "3kz Blog: いろいろ書き残し";
  const _image = "/static/profile-image.png";

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{_title}</title>
        <meta property="og:title" content={_title} />
        <meta property="og:description" content={_description} />
        <meta property="og:image" content={_image} />
        <Script src="/app/client.ts" />
        {import.meta.env.PROD ? (
          <link href="/static/assets/style.css" rel="stylesheet" />
        ) : (
          <link href="/app/style.css" rel="stylesheet" />
        )}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.css"
        />
        <link
          rel="preload"
          href="/fonts/PleckJP/PleckJP.woff2"
          as="font"
          type="font/woff2"
          crossorigin
        />
        <style>
          {`
            body {
              font-family: 'PleckJP', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
          `}
        </style>
      </head>
      <body class="main-container">
        <header class="bg-black border-b border-jade-dark">
          <div class="max-w-screen-2xl mx-auto flex h-14 items-center px-6">
            {/* 左側の空白スペース（バランスのため） */}
            <div class="w-1/3"></div>

            {/* ブログタイトルを中央に配置 */}
            <div class="w-1/3 flex justify-center">
              <a href="/" class="text-jade font-bold">
                3kz Blog
              </a>
            </div>

            {/* SNSアイコンを右に配置 */}
            <div class="flex items-center gap-3 w-1/3 justify-end">
              <a href={LINK.X} target={"_blank"} rel={"noreferrer"} class="p-1">
                <img
                  src="/static/twitter-alt.svg"
                  alt="x-icon"
                  class="w-6 h-6"
                />
              </a>
              <a
                href={LINK.GITHUB}
                target={"_blank"}
                rel="noreferrer"
                class="p-1"
              >
                <img
                  src="/static/github.svg"
                  alt="github-icon"
                  class="w-6 h-6"
                />
              </a>
              <a
                href={LINK.TWITCH}
                target={"_blank"}
                rel="noreferrer"
                class="p-1"
              >
                <img
                  src="/static/twitch.svg"
                  alt="twitch-icon"
                  class="w-6 h-6"
                />
              </a>
            </div>
          </div>
        </header>
        <main class="w-full px-4 lg:max-w-4xl lg:px-0 mx-auto">{children}</main>
        <footer class="mt-10 text-center py-4 border-t border-jade-dark">
          <p>&copy; 2025 3kz blog. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
});
