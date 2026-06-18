// ============================================================
// BLOG — public page logic
// Reads approved posts from Supabase, lets visitors submit new
// posts (always created as 'pending' — invisible until approved
// by the admin via admin.html).
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.blog-tabs .news__tab');
  const panels = {
    read: document.getElementById('panelRead'),
    write: document.getElementById('panelWrite')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      Object.values(panels).forEach(p => p.classList.remove('is-active'));
      panels[tab.dataset.panel].classList.add('is-active');
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let supabaseClient = null;
  const configured =
    typeof SUPABASE_CONFIG !== 'undefined' &&
    SUPABASE_CONFIG.url &&
    !SUPABASE_CONFIG.url.includes('YOUR_SUPABASE') &&
    SUPABASE_CONFIG.anonKey &&
    !SUPABASE_CONFIG.anonKey.includes('YOUR_SUPABASE');

  if (configured && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }

  const postsList = document.getElementById('postsList');

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadPosts() {
    if (!supabaseClient) {
      postsList.innerHTML = '<p class="news__loading">Blog isn\'t connected yet — add Supabase keys in js/config.js.</p>';
      return;
    }
    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('id, author, title, content, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        postsList.innerHTML = '<p class="news__loading">No posts published yet — be the first to write one.</p>';
        return;
      }

      postsList.innerHTML = data.map(p => `
        <article class="post-card">
          <h3 class="post-card__title">${escapeHtml(p.title)}</h3>
          <div class="post-card__meta">by ${escapeHtml(p.author)} · ${new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div class="post-card__body">${escapeHtml(p.content)}</div>
        </article>
      `).join('');
    } catch (err) {
      console.error('Error loading posts:', err);
      postsList.innerHTML = '<p class="news__loading">Could not load posts right now.</p>';
    }
  }

  loadPosts();

  // ---- Submission form ----
  const form = document.getElementById('postForm');
  const statusEl = document.getElementById('postStatus');
  const submitBtn = document.getElementById('postSubmit');

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    if (type) statusEl.classList.add(type);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const author = document.getElementById('pAuthor').value.trim();
    const title = document.getElementById('pTitle').value.trim();
    const content = document.getElementById('pContent').value.trim();

    if (!author || !title || !content) {
      setStatus('Please fill in all fields.', 'is-error');
      return;
    }

    if (!supabaseClient) {
      setStatus('Blog submissions are not connected yet — see README.', 'is-error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    setStatus('', null);

    try {
      const { error } = await supabaseClient
        .from('posts')
        .insert([{ author, title, content, status: 'pending' }]);

      if (error) throw error;

      setStatus('Submitted! Your post will appear here once reviewed.', 'is-success');
      form.reset();
    } catch (err) {
      console.error('Error submitting post:', err);
      setStatus('Something went wrong submitting your post. Please try again.', 'is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit for review';
    }
  });
});
