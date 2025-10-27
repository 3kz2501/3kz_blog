import type { FC } from "hono/jsx";

export default function Top() {
  return (
    <>
      <Posts />
    </>
  );
}

const Posts: FC = () => {
  const posts = import.meta.glob<{
    frontmatter: {
      title: string;
      date: string;
      published: boolean;
      tags?: string[];
      category?: string;
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

  const POSTS_PER_PAGE = 10;
  const totalPages = Math.ceil(entries.length / POSTS_PER_PAGE);

  return (
    <div class="mt-16">
      <ul class="mt-10" id="posts-list">
        {entries.map(([id, module], index) => {
          const page = Math.floor(index / POSTS_PER_PAGE) + 1;
          return (
            <li
              key={id}
              class="text-lg mt-2 md:mt-1 post-item"
              data-page={page}
            >
              <span class="tabular-nums tnum text-jade-dark">
                {module.frontmatter.date}:{" "}
              </span>
              <br class="block md:hidden" />
              <a
                class="text-jade hover:underline"
                href={`${id.replace(/\.mdx$/, "")}`}
              >
                {module.frontmatter.title}
              </a>
              {module.frontmatter.tags && module.frontmatter.tags.length > 0 && (
                <span class="ml-2 inline-flex gap-1">
                  {module.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      class="text-xs px-2 py-0.5 rounded bg-jade-dark/20 text-jade border border-jade-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div class="mt-8 flex justify-center gap-2" id="pagination">
          <button
            id="prev-btn"
            class="px-4 py-2 bg-jade-dark/20 text-jade border border-jade-dark rounded hover:bg-jade-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前へ
          </button>
          <span id="page-info" class="px-4 py-2 text-jade">
            1 / {totalPages}
          </span>
          <button
            id="next-btn"
            class="px-4 py-2 bg-jade-dark/20 text-jade border border-jade-dark rounded hover:bg-jade-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </div>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const totalPages = ${totalPages};
              let currentPage = 1;

              function showPage(page) {
                const items = document.querySelectorAll('.post-item');
                items.forEach(item => {
                  item.style.display = item.dataset.page == page ? '' : 'none';
                });

                document.getElementById('page-info').textContent = page + ' / ' + totalPages;
                document.getElementById('prev-btn').disabled = page === 1;
                document.getElementById('next-btn').disabled = page === totalPages;

                window.location.hash = 'page=' + page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }

              document.getElementById('prev-btn').addEventListener('click', () => {
                if (currentPage > 1) {
                  currentPage--;
                  showPage(currentPage);
                }
              });

              document.getElementById('next-btn').addEventListener('click', () => {
                if (currentPage < totalPages) {
                  currentPage++;
                  showPage(currentPage);
                }
              });

              // URLハッシュから初期ページを復元
              const hash = window.location.hash.match(/page=(\\d+)/);
              if (hash) {
                const page = parseInt(hash[1]);
                if (page >= 1 && page <= totalPages) {
                  currentPage = page;
                }
              }

              showPage(currentPage);
            })();
          `,
        }}
      />
    </div>
  );
};
