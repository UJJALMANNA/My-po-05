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
/* new update */
// Get the HTML elements
const loginDropdown = document.getElementById('loginDropdown');
const userInfo = document.getElementById('userInfo');
const userNameDisplay = document.getElementById('userNameDisplay');

// 1. Check the session as soon as the page loads
supabase.auth.getSession().then(({ data: { session } }) => {
    updateNavbar(session);
});

// 2. Listen for any login or logout events in real-time
supabase.auth.onAuthStateChange((event, session) => {
    updateNavbar(session);
});

// 3. The function that shows/hides the correct UI
function updateNavbar(session) {
    if (session) {
        // --- USER IS LOGGED IN ---
        if (loginDropdown) loginDropdown.style.display = 'none'; // Hide the Login button
        if (userInfo) userInfo.style.display = 'inline-block'; // Show the User Info container
        
        // Grab the user's email (e.g., gateujjal@gmail.com) and extract the name part
        const userEmail = session.user.email;
        const namePrefix = userEmail.split('@')[0]; 
        
        // Display a greeting
        if (userNameDisplay) userNameDisplay.textContent = 'Welcome, ' + namePrefix; 
        
    } else {
        // --- USER IS LOGGED OUT ---
        if (loginDropdown) loginDropdown.style.display = 'inline-block'; // Show the Login button
        if (userInfo) userInfo.style.display = 'none'; // Hide the User Info container
    }
}
