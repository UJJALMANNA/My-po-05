// ============================================================
// nav-auth.js
// Drop this on EVERY page (public + protected), after supabase-config.js
// Updates nav bar based on login state, and wires up logout
// ============================================================

(async function updateNavAuthState() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  // Looks for an element with id="navAuthSlot" in your nav bar
  // and an optional id="userGreeting" element to show the user's email
  const navAuthSlot = document.getElementById("navAuthSlot");
  const userGreeting = document.getElementById("userGreeting");

  if (session) {
    // Logged in
    if (navAuthSlot) {
      navAuthSlot.innerHTML = `<button id="logoutBtn" class="auth-btn">Logout</button>`;
      document.getElementById("logoutBtn").addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        window.location.href = "index.html";
      });
    }
    if (userGreeting) {
      userGreeting.textContent = `Hi, ${session.user.email}`;
    }
  } else {
    // Logged out
    if (navAuthSlot) {
      navAuthSlot.innerHTML = `<a href="auth.html" class="auth-btn">Login</a>`;
    }
    if (userGreeting) {
      userGreeting.textContent = "";
    }
  }
})();
