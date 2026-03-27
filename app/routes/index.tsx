import type { FC } from "hono/jsx";

export default function Top() {
  return (
    <>
      <Posts />
    </>
  );
}

const isCvePost = (module: { frontmatter: { tags?: string[] } }) =>
  module.frontmatter.tags?.some((t) => t === "CVE") ?? false;

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

  const allEntries = Object.entries(posts)
    .filter(([, module]) => module.frontmatter.published)
    .sort(([, a], [, b]) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

  const cveEntries = allEntries.filter(([, m]) => isCvePost(m));
  const blogEntries = allEntries.filter(([, m]) => !isCvePost(m));

  const POSTS_PER_PAGE = 10;
  const cveTotalPages = Math.ceil(cveEntries.length / POSTS_PER_PAGE);
  const blogTotalPages = Math.ceil(blogEntries.length / POSTS_PER_PAGE) || 1;

  const renderEntries = (
    entries: typeof allEntries,
    tab: string,
  ) =>
    entries.map(([id, module], index) => {
      const page = Math.floor(index / POSTS_PER_PAGE) + 1;
      return (
        <li
          key={id}
          class="text-lg mt-2 md:mt-1 post-item"
          data-page={page}
          data-tab={tab}
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
    });

  // NOTE: The inline script below only interpolates integer constants
  // (blogTotalPages, cveTotalPages) computed at build time from the post count.
  // No user-supplied data is injected, so there is no XSS risk.
  const paginationScript = `
    (function() {
      var pageCounts = { blog: ${blogTotalPages}, cve: ${cveTotalPages} };
      var currentTab = 'cve';
      var currentPage = 1;

      var tabBtns = document.querySelectorAll('.tab-btn');
      var items = document.querySelectorAll('.post-item');
      var pageInfo = document.getElementById('page-info');
      var prevBtn = document.getElementById('prev-btn');
      var nextBtn = document.getElementById('next-btn');
      var pagination = document.getElementById('pagination');

      function showPage(page) {
        currentPage = page;
        var totalPages = pageCounts[currentTab];
        items.forEach(function(item) {
          if (item.dataset.tab === currentTab && item.dataset.page == page) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
        pageInfo.textContent = page + ' / ' + totalPages;
        prevBtn.disabled = page === 1;
        nextBtn.disabled = page === totalPages;
        pagination.style.display = totalPages > 1 ? '' : 'none';
        window.location.hash = 'tab=' + currentTab + '&page=' + page;
      }

      function switchTab(tab) {
        currentTab = tab;
        tabBtns.forEach(function(btn) {
          if (btn.dataset.tab === tab) {
            btn.className = 'tab-btn block w-full text-left px-4 py-3 text-jade font-bold border border-jade-dark bg-jade-dark/30 border-r-0';
          } else {
            btn.className = 'tab-btn block w-full text-left px-4 py-3 text-jade-dark border border-jade-dark bg-transparent hover:bg-jade-dark/10 border-r-0';
          }
        });
        showPage(1);
      }

      tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          switchTab(btn.dataset.tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });

      prevBtn.addEventListener('click', function() {
        if (currentPage > 1) showPage(currentPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', function() {
        if (currentPage < pageCounts[currentTab]) showPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      var hash = window.location.hash;
      var tabMatch = hash.match(/tab=(blog|cve)/);
      var pageMatch = hash.match(/page=(\\d+)/);
      if (tabMatch) currentTab = tabMatch[1];
      if (pageMatch) {
        var p = parseInt(pageMatch[1]);
        if (p >= 1 && p <= pageCounts[currentTab]) currentPage = p;
      }

      switchTab(currentTab);
      if (currentPage > 1) showPage(currentPage);
    })();
  `;

  return (
    <div class="mt-16">
      <div class="flex">
        {/* 左: 縦タブ */}
        <div class="flex flex-col shrink-0 border-r border-jade-dark" id="tabs">
          <button
            id="tab-cve"
            class="tab-btn block w-full text-left px-4 py-3 text-jade font-bold border border-jade-dark bg-jade-dark/30 border-r-0"
            data-tab="cve"
          >
            CVEs<br />
            <span class="text-xs font-normal text-jade-dark">({cveEntries.length})</span>
          </button>
          <button
            id="tab-blog"
            class="tab-btn block w-full text-left px-4 py-3 text-jade-dark border border-jade-dark bg-transparent hover:bg-jade-dark/10 border-r-0 border-t-0"
            data-tab="blog"
          >
            Blog<br />
            <span class="text-xs font-normal">({blogEntries.length})</span>
          </button>
        </div>

        {/* 右: 記事リスト */}
        <div class="flex-1 min-w-0 pl-4">
          <ul id="posts-list">
            {renderEntries(cveEntries, "cve")}
            {renderEntries(blogEntries, "blog")}
          </ul>

          <div class="mt-8 flex justify-center gap-2" id="pagination">
            <button
              id="prev-btn"
              class="px-4 py-2 bg-jade-dark/20 text-jade border border-jade-dark rounded hover:bg-jade-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            <span id="page-info" class="px-4 py-2 text-jade">
              1 / 1
            </span>
            <button
              id="next-btn"
              class="px-4 py-2 bg-jade-dark/20 text-jade border border-jade-dark rounded hover:bg-jade-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: paginationScript }} />
    </div>
  );
};
