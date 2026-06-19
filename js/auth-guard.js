// ============================================================
// auth-guard.js
// Drop this on every PROTECTED page (after supabase-config.js)
// Redirects to auth.html if the user is not logged in
// ============================================================

(async function protectPage() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    // Not logged in — save where they were trying to go, then redirect
    const currentPage = window.location.pathname.split("/").pop();
    sessionStorage.setItem("redirectAfterLogin", currentPage);
    window.location.href = "auth.html";
  }
})();
