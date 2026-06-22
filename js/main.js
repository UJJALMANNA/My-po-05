// ============================================================
// MAIN — nav behavior, auth state, small global interactions
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {

  const navToggle  = document.getElementById('navToggle');
  const navClose   = document.getElementById('navClose');
  const navLinks   = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function openMenu() {
    navLinks.classList.add('is-open');
    if (navOverlay) navOverlay.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    navLinks.classList.remove('is-open');
    if (navOverlay) navOverlay.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle)  navToggle.addEventListener('click', openMenu);
  if (navClose)   navClose.addEventListener('click', closeMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Login dropdown (desktop)
  const loginDropdown = document.getElementById('loginDropdown');
  if (loginDropdown) {
    loginDropdown.querySelector('.nav__dropbtn').addEventListener('click', function(e) {
      e.stopPropagation();
      loginDropdown.classList.toggle('is-open');
    });
  }

  // Profile dropdown (logged in)
  const profileToggle = document.getElementById('profileToggle');
  const userInfo      = document.getElementById('userInfo');
  if (profileToggle && userInfo) {
    profileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      userInfo.classList.toggle('is-open');
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', function() {
    if (loginDropdown) loginDropdown.classList.remove('is-open');
    if (userInfo)      userInfo.classList.remove('is-open');
  });

  // ── AUTH STATE ──────────────────────────────────────────
  const navRight       = document.querySelector('.nav__right');
  const userNameEl     = document.getElementById('userNameDisplay');
  const mobileLogin    = document.getElementById('mobileLoginLinks');

  function showLoggedIn(user) {
    const email    = user.email || '';
    const meta     = user.user_metadata || {};
    const name     = meta.first_name
                     ? meta.first_name + ' ' + (meta.last_name || '')
                     : email.split('@')[0];

    if (userNameEl)  userNameEl.textContent = name.trim();
    if (loginDropdown) loginDropdown.style.display = 'none';
    if (userInfo)    userInfo.style.display = 'flex';
    if (navRight)    navRight.style.display = 'flex';
    if (mobileLogin) mobileLogin.style.display = 'none'; // hide login links in sidebar
  }

  function showLoggedOut() {
    if (loginDropdown) loginDropdown.style.display = '';
    if (userInfo)    userInfo.style.display = 'none';
    if (mobileLogin) mobileLogin.style.display = '';
    // hide nav__right on mobile
    if (navRight && window.innerWidth <= 900) {
      navRight.style.display = 'none';
    }
  }

  // Check session on page load
  if (typeof supabaseClient !== 'undefined') {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
      showLoggedIn(session.user);
    } else {
      showLoggedOut();
    }

    // Listen for login/logout changes
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        showLoggedIn(session.user);
      } else {
        showLoggedOut();
      }
    });
  }

  // ── LOGOUT ──────────────────────────────────────────────
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      if (typeof supabaseClient !== 'undefined') {
        await supabaseClient.auth.signOut();
      }
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = 'index.html';
    });
  }

  // ── ACTIVE TAB ──────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__tab').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // ── FOOTER YEAR ─────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
// ── Login dropdown toggle ──
const loginDropBtn = document.querySelector('#loginDropdown .nav__dropbtn');
const loginContent = document.querySelector('#loginDropdown .nav__dropdown-content');

if (loginDropBtn && loginContent) {
  loginDropBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    loginContent.classList.toggle('is-open');
  });

  document.addEventListener('click', function() {
    loginContent.classList.remove('is-open');
  });
}
