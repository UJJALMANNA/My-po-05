// ============================================================
// ADMIN — password-gated moderation panel.
//
// Security model:
//   - The password is checked, then sent to a Supabase Edge
//     Function ("moderate-post") which verifies it server-side
//     against a secret stored in Supabase (never in this file).
//   - The Edge Function is the only thing allowed to use the
//     service role key, so it can list/approve/delete posts
//     regardless of the public RLS policies.
//   - This file NEVER contains your service role key or your
//     real password check — both live only on Supabase's server.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const lockScreen = document.getElementById('lockScreen');
  const adminPanel = document.getElementById('adminPanel');
  const unlockBtn = document.getElementById('unlockBtn');
  const passwordInput = document.getElementById('adminPassword');
  const lockError = document.getElementById('lockError');
  const postsList = document.getElementById('adminPostsList');

  let currentPassword = null;

  const configured =
    typeof SUPABASE_CONFIG !== 'undefined' &&
    SUPABASE_CONFIG.url &&
    !SUPABASE_CONFIG.url.includes('YOUR_SUPABASE');

  function functionUrl(action) {
    // Supabase Edge Functions live at: https://<project>.functions.supabase.co/<name>
    const base = SUPABASE_CONFIG.url.replace('.supabase.co', '.functions.supabase.co');
    return `${base}/moderate-post`;
  }

  async function callModerate(action, payload = {}) {
    const res = await fetch(functionUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: currentPassword, action, ...payload })
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Request failed (${res.status})`);
    }
    return res.json();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderPosts(posts) {
    if (!posts || posts.length === 0) {
      postsList.innerHTML = '<p class="news__loading">No posts yet.</p>';
      return;
    }
    postsList.innerHTML = posts.map(p => `
      <article class="admin-post" data-id="${p.id}">
        <span class="admin-post__status ${p.status}">${p.status}</span>
        <h3 class="admin-post__title">${escapeHtml(p.title)}</h3>
        <div class="admin-post__meta">by ${escapeHtml(p.author)} · ${new Date(p.created_at).toLocaleString('en-IN')}</div>
        <div class="admin-post__body">${escapeHtml(p.content)}</div>
        <div class="admin-post__actions">
          ${p.status === 'pending' ? `<button class="btn btn--approve btn--small" data-action="approve" data-id="${p.id}">Approve</button>` : ''}
          <button class="btn btn--delete btn--small" data-action="delete" data-id="${p.id}">Delete</button>
        </div>
      </article>
    `).join('');
  }

  async function loadPosts() {
    postsList.innerHTML = '<p class="news__loading">Loading…</p>';
    try {
      const data = await callModerate('list');
      renderPosts(data.posts);
    } catch (err) {
      console.error(err);
      postsList.innerHTML = `<p class="news__loading">Error loading posts: ${escapeHtml(err.message)}</p>`;
    }
  }

  postsList.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'delete' && !confirm('Delete this post permanently? This cannot be undone.')) return;

    btn.disabled = true;
    btn.textContent = action === 'approve' ? 'Approving…' : 'Deleting…';

    try {
      await callModerate(action, { id });
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert('Action failed: ' + err.message);
      btn.disabled = false;
    }
  });

  unlockBtn.addEventListener('click', async () => {
    const pw = passwordInput.value;
    if (!pw) return;
    if (!configured) {
      lockError.textContent = 'Supabase is not configured in js/config.js yet.';
      return;
    }

    unlockBtn.disabled = true;
    unlockBtn.textContent = 'Checking…';
    currentPassword = pw;

    try {
      await callModerate('list'); // also acts as the password check
      lockScreen.style.display = 'none';
      adminPanel.style.display = 'block';
      loadPosts();
    } catch (err) {
      lockError.textContent = 'Incorrect password, or the moderation function is not deployed yet.';
      currentPassword = null;
    } finally {
      unlockBtn.disabled = false;
      unlockBtn.textContent = 'Unlock';
    }
  });

  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') unlockBtn.click();
  });
});
