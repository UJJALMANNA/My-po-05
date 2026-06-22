// ============================================================
// nav-auth.js
// ============================================================

(async function updateNavAuthState() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  const loginDropdown  = document.getElementById("loginDropdown");
  const userInfo       = document.getElementById("userInfo");
  const userNameDisplay= document.getElementById("userNameDisplay");
  const profileToggle  = document.getElementById("profileToggle");
  const profileMenu    = document.getElementById("profileMenu");
  const logoutBtn      = document.getElementById("logoutBtn");

  if (session) {
    // ── LOGGED IN ──

    // 1. Hide Login dropdown
    if (loginDropdown) loginDropdown.style.display = "none";

    // 2. Show user profile pill with name
    if (userInfo && userNameDisplay) {
      const rawName   = session.user.user_metadata?.full_name
                     || session.user.user_metadata?.name
                     || session.user.email.split("@")[0];
      const firstName = rawName.split(" ")[0];
      userNameDisplay.textContent = firstName;
      userInfo.style.display = "flex";
    }

    // 3. Wire up dropdown toggle click
    if (profileToggle && profileMenu) {
      profileToggle.style.cursor = "pointer";

      profileToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        profileMenu.classList.toggle("is-open");
        profileToggle.classList.toggle("is-open");
      });

      // Close when clicking anywhere outside
      document.addEventListener("click", function () {
        profileMenu.classList.remove("is-open");
        profileToggle.classList.remove("is-open");
      });

      // Stop menu clicks from closing it immediately
      profileMenu.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    // 4. Wire up Logout
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await supabaseClient.auth.signOut();
        window.location.href = "index.html";
      });
    }

  } else {
    // ── LOGGED OUT ──
    if (loginDropdown) loginDropdown.style.display = "";
    if (userInfo)      userInfo.style.display = "none";
  }
})();
