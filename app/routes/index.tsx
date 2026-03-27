import type { FC } from "hono/jsx";

export default function Top() {
  return <Posts />;
}

type Frontmatter = {
  title: string;
  date: string;
  published: boolean;
  tags?: string[];
  category?: string;
};

type PostEntry = [string, { frontmatter: Frontmatter }];

const POSTS_PER_PAGE = 20;
const DEFAULT_TAB = "cve";

const TAB_ACTIVE =
  "tab-btn block w-full text-left px-4 py-3 text-jade font-bold border border-jade-dark bg-jade-dark/30 border-r-0";
const TAB_INACTIVE =
  "tab-btn block w-full text-left px-4 py-3 text-jade-dark border border-jade-dark bg-transparent hover:bg-jade-dark/10 border-r-0";

const isCvePost = (m: PostEntry[1]) =>
  m.frontmatter.tags?.includes("CVE") ?? false;

const PostItem: FC<{ entry: PostEntry; page: number; tab: string }> = ({
  entry: [id, { frontmatter }],
  page,
  tab,
}) => (
  <li class="text-xl mt-2 md:mt-1 post-item" data-page={page} data-tab={tab}>
    <span class="tabular-nums tnum text-jade-dark">{frontmatter.date}: </span>
    <br class="block md:hidden" />
    <a class="text-jade hover:underline" href={id.replace(/\.mdx$/, "")}>
      {frontmatter.title}
    </a>
    {frontmatter.tags && frontmatter.tags.length > 0 && (
      <span class="ml-2 inline-flex gap-1">
        {frontmatter.tags.map((tag) => (
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

const Posts: FC = () => {
  const posts = import.meta.glob<{ frontmatter: Frontmatter }>(
    "./posts/*.mdx",
    { eager: true },
  );

  const allEntries: PostEntry[] = Object.entries(posts)
    .filter(([, m]) => m.frontmatter.published)
    .sort(
      ([, a], [, b]) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );

  const cveEntries = allEntries.filter(([, m]) => isCvePost(m));
  const blogEntries = allEntries.filter(([, m]) => !isCvePost(m));

  const totalPages = {
    cve: Math.ceil(cveEntries.length / POSTS_PER_PAGE) || 1,
    blog: Math.ceil(blogEntries.length / POSTS_PER_PAGE) || 1,
  };

  const renderList = (entries: PostEntry[], tab: string) =>
    entries.map((entry, i) => (
      <PostItem
        key={entry[0]}
        entry={entry}
        page={Math.floor(i / POSTS_PER_PAGE) + 1}
        tab={tab}
      />
    ));

  // Only build-time integer constants are interpolated — no XSS risk.
  const script = `(function(){
  var pageCounts={cve:${totalPages.cve},blog:${totalPages.blog}};
  var tab='${DEFAULT_TAB}',page=1;
  var $=document.getElementById.bind(document);
  var tabs=document.querySelectorAll('.tab-btn');
  var items=document.querySelectorAll('.post-item');
  var info=$('page-info'),prev=$('prev-btn'),next=$('next-btn'),pag=$('pagination');
  function show(p){
    page=p;
    var t=pageCounts[tab];
    items.forEach(function(el){el.style.display=el.dataset.tab===tab&&el.dataset.page==p?'':'none'});
    info.textContent=p+' / '+t;
    prev.disabled=p===1;
    next.disabled=p===t;
    pag.style.display=t>1?'':'none';
    history.replaceState(null,'','#tab='+tab+'&page='+p);
  }
  function activate(t){
    tab=t;
    tabs.forEach(function(b){b.className=b.dataset.tab===t?'${TAB_ACTIVE}':'${TAB_INACTIVE}'});
    show(1);
  }
  tabs.forEach(function(b){b.addEventListener('click',function(){activate(b.dataset.tab);window.scrollTo({top:0,behavior:'smooth'})})});
  prev.addEventListener('click',function(){if(page>1){show(page-1);window.scrollTo({top:0,behavior:'smooth'})}});
  next.addEventListener('click',function(){if(page<pageCounts[tab]){show(page+1);window.scrollTo({top:0,behavior:'smooth'})}});
  var h=location.hash,tm=h.match(/tab=(blog|cve)/),pm=h.match(/page=(\\d+)/);
  if(tm)tab=tm[1];
  if(pm){var n=+pm[1];if(n>=1&&n<=pageCounts[tab])page=n}
  activate(tab);
  if(page>1)show(page);
})()`;

  return (
    <div class="mt-16">
      <div class="flex">
        <div class="flex flex-col shrink-0 border-r border-jade-dark" id="tabs">
          <button type="button" class={TAB_ACTIVE} data-tab="cve">
            CVEs
            <br />
            <span class="text-xs font-normal text-jade-dark">
              ({cveEntries.length})
            </span>
          </button>
          <button
            type="button"
            class={`${TAB_INACTIVE} border-t-0`}
            data-tab="blog"
          >
            Blog
            <br />
            <span class="text-xs font-normal">({blogEntries.length})</span>
          </button>
        </div>

        <div class="flex-1 min-w-0 pl-4">
          <ul id="posts-list">
            {renderList(cveEntries, "cve")}
            {renderList(blogEntries, "blog")}
          </ul>

          <div class="mt-8 flex justify-center gap-2" id="pagination">
            <button
              type="button"
              id="prev-btn"
              class="px-4 py-2 bg-jade-dark/20 text-jade border border-jade-dark rounded hover:bg-jade-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            <span id="page-info" class="px-4 py-2 text-jade">
              1 / 1
            </span>
            <button
              type="button"
              id="next-btn"
              class="px-4 py-2 bg-jade-dark/20 text-jade border border-jade-dark rounded hover:bg-jade-dark/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </div>
        </div>
      </div>

      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SSG inline script with build-time constants only */}
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  );
};
