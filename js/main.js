// ============================================================
// MAIN — nav behavior, small global interactions
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  const navToggle = document.getElementById('navToggle');
  const navClose  = document.getElementById('navClose');
  const navLinks  = document.getElementById('navLinks');
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

  if (navToggle) navToggle.addEventListener('click', openMenu);
  if (navClose)  navClose.addEventListener('click', closeMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  // close menu after clicking any link
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
  const userInfo = document.getElementById('userInfo');
  if (profileToggle && userInfo) {
    profileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      userInfo.classList.toggle('is-open');
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', function() {
    if (loginDropdown) loginDropdown.classList.remove('is-open');
    if (userInfo) userInfo.classList.remove('is-open');
  });

  // LOGOUT
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      try {
        // works with Supabase
        const { supabase } = window;
        if (supabase) await supabase.auth.signOut();
      } catch(err) {
        console.error('Logout error:', err);
      }
      // clear any local session data
      localStorage.clear();
      sessionStorage.clear();
      // redirect to home
      window.location.href = 'index.html';
    });
  }

  // Active tab highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__tab').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // MOBILE: hide/show nav__right based on login state
  const navRight = document.querySelector('.nav__right');
  function updateNavRightMobile() {
    if (window.innerWidth <= 900 && navRight) {
      const isLoggedIn = userInfo && userInfo.style.display !== 'none';
      navRight.style.display = isLoggedIn ? 'flex' : 'none';
    } else if (navRight) {
      navRight.style.display = 'flex';
    }
  }
  updateNavRightMobile();
  window.addEventListener('resize', updateNavRightMobile);
});
