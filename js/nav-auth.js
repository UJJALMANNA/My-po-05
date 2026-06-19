// ============================================================
// nav-auth.js
// Drop this on EVERY page (public + protected), after supabase-config.js
// Controls 3 nav elements based on login state:
//   1. #loginDropdown   -> hidden when logged in
//   2. #userInfo        -> shown when logged in, displays user's name/email
//   3. #navAuthSlot      -> shows Logout button when logged in
// ============================================================

(async function updateNavAuthState() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  const loginDropdown = document.getElementById("loginDropdown");
  const userInfo = document.getElementById("userInfo");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const navAuthSlot = document.getElementById("navAuthSlot");

  if (session) {
    // ----- LOGGED IN -----

    // Hide the Login dropdown
    if (loginDropdown) {
      loginDropdown.style.display = "none";
    }

   
   // Show the user's first name (falls back to email username if missing)
if (userInfo && userNameDisplay) {
  const displayName = session.user.user_metadata?.first_name || session.user.email.split("@")[0];
  userNameDisplay.textContent = displayName;
  userInfo.style.display = "flex";
}
    

    // Put a single Logout button in navAuthSlot
    if (navAuthSlot) {
      navAuthSlot.innerHTML = `<button id="logoutBtn" class="auth-btn">Logout</button>`;
      document.getElementById("logoutBtn").addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        window.location.href = "index.html";
      });
    }

  } else {
    // ----- LOGGED OUT -----

    // Show the Login dropdown
    if (loginDropdown) {
      loginDropdown.style.display = "";
    }

    // Hide the username
    if (userInfo) {
      userInfo.style.display = "none";
    }

    // Clear navAuthSlot (no Logout button when logged out)
    if (navAuthSlot) {
      navAuthSlot.innerHTML = "";
    }
  }
})();
