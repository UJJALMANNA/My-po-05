// ============================================================
// GATE DESK — renders guidance cards.
// Edit data/gate-notes.json to update content without touching code.
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('gateGrid');
  if (!grid) return;

  try {
    const res = await fetch('data/gate-notes.json');
    const notes = await res.json();
    grid.innerHTML = notes.map(n => `
      <div class="gate-card">
        <span class="gate-card__tag">${n.tag}</span>
        <h3>${n.title}</h3>
        <p>${n.body}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading GATE notes:', err);
    grid.innerHTML = '<p class="news__loading">Guidance notes are being updated — check back soon.</p>';
  }
});
