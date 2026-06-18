// ============================================================
// NEWS / SIGNAL FEED
// Sources:
//   - "mine"  -> data/notes.json (curated by site owner)
//   - "hn"    -> Hacker News Algolia API (no key required)
//   - "devto" -> Dev.to public API (no key required)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('newsList');
  const loadingEl = document.getElementById('newsLoading');
  const tabs = document.querySelectorAll('.news__tab');
  if (!listEl) return;

  const cache = {};

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 36e5);
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }

  function renderItems(items) {
    if (!items.length) {
      listEl.innerHTML = '<p class="news__loading">No items found right now.</p>';
      return;
    }
    listEl.innerHTML = items.map(item => `
      <article class="news-item">
        <div class="news-item__meta">${item.meta}</div>
        <div>
          <h3 class="news-item__title"><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
          ${item.sub ? `<p class="news-item__sub">${item.sub}</p>` : ''}
          <span class="news-item__source">${item.source}</span>
        </div>
      </article>
    `).join('');
  }

  function showLoading() {
    listEl.innerHTML = '<div class="news__loading">Tuning in…</div>';
  }

  async function loadMine() {
    if (cache.mine) return renderItems(cache.mine);
    showLoading();
    try {
      const res = await fetch('data/notes.json');
      const notes = await res.json();
      const items = notes.map(n => ({
        meta: n.date,
        title: n.title,
        sub: n.summary,
        url: n.url || '#',
        source: 'My Notes'
      }));
      cache.mine = items;
      renderItems(items);
    } catch (err) {
      console.error('Error loading notes:', err);
      listEl.innerHTML = '<p class="news__loading">Could not load notes right now.</p>';
    }
  }

  async function loadHN() {
    if (cache.hn) return renderItems(cache.hn);
    showLoading();
    try {
      const res = await fetch('https://hn.algolia.com/api/v1/search?tags=story&query=engineering%20OR%20software%20OR%20systems&hitsPerPage=12');
      const data = await res.json();
      const items = data.hits
        .filter(h => h.title)
        .map(h => ({
          meta: timeAgo(h.created_at),
          title: h.title,
          sub: `${h.points || 0} points · ${h.num_comments || 0} comments`,
          url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
          source: 'Hacker News'
        }));
      cache.hn = items;
      renderItems(items);
    } catch (err) {
      console.error('Error loading Hacker News:', err);
      listEl.innerHTML = '<p class="news__loading">Could not reach Hacker News right now.</p>';
    }
  }

  async function loadDevto() {
    if (cache.devto) return renderItems(cache.devto);
    showLoading();
    try {
      const res = await fetch('https://dev.to/api/articles?tag=programming&top=7&per_page=12');
      const data = await res.json();
      const items = data.map(a => ({
        meta: timeAgo(a.published_at),
        title: a.title,
        sub: a.description ? a.description.slice(0, 110) + '…' : '',
        url: a.url,
        source: `Dev.to · ${a.user?.name || 'community'}`
      }));
      cache.devto = items;
      renderItems(items);
    } catch (err) {
      console.error('Error loading Dev.to:', err);
      listEl.innerHTML = '<p class="news__loading">Could not reach Dev.to right now.</p>';
    }
  }

  const loaders = { mine: loadMine, hn: loadHN, devto: loadDevto };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      loaders[tab.dataset.source]();
    });
  });

  // initial load
  loadMine();
});
