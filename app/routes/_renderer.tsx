import { jsxRenderer } from "hono/jsx-renderer";
import { Script } from "honox/server";
import { LINK } from "../constants";
import Navigation from "../components/Navigation";

export default jsxRenderer(({ children, title, description }) => {
  const _title = title ?? "3kz Blog";
  const _description = description ?? "3kz Blog: いろいろ書き残し";
  const _image = "/static/profile-image.png";

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="3kz Blog RSS Feed"
          href="/feed.xml"
        />
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
          <div class="max-w-screen-2xl mx-auto flex flex-wrap md:flex-nowrap h-auto md:h-14 items-center px-4 py-2 md:py-0 md:px-6">
            {/* Blog title with logo - 小さい画面では大きく表示 */}
            <a
              href="/"
              class="flex items-center text-jade text-2xl md:text-3xl whitespace-nowrap mr-auto md:mr-0"
            >
              {/* Logo SVG */}
              <img
                src="/static/logo.svg"
                alt="3kz Logo"
                class="h-8 md:h-9 w-auto mr-2"
              />
            </a>

            {/* モバイル用のスペーサー - フレックスボックスの折り返し制御用 */}
            <div class="w-full md:hidden"></div>

            {/* 小さい画面では非表示、中サイズ以上で表示 */}
            <div class="hidden md:block text-jade-dark mx-5">|</div>

            {/* Navigation pages - モバイルでは左寄せ */}
            <div class="mt-2 md:mt-0 md:mx-4">
              <Navigation />
            </div>

            {/* 小さい画面では非表示、中サイズ以上で表示 */}
            <div class="hidden md:block text-jade-dark mx-5">|</div>

            {/* SNS icons - モバイルでは右寄せ */}
            <div class="flex items-center gap-3 ml-auto md:ml-0 md:mx-2 mt-2 md:mt-0">
              <a href={LINK.X} target={"_blank"} rel={"noreferrer"} class="p-1">
                <img
                  src="/static/twitter-alt.svg"
                  alt="x-icon"
                  class="w-6 h-6 md:w-5 md:h-5"
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
                  class="w-6 h-6 md:w-5 md:h-5"
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
                  class="w-6 h-6 md:w-5 md:h-5"
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
