// ============================================================
// auth-page.js
// Powers auth.html — signup, login, tab switching
// ============================================================

const loginTabBtn = document.getElementById("loginTabBtn");
const signupTabBtn = document.getElementById("signupTabBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const messageBox = document.getElementById("messageBox");

// --- Tab switching ---
loginTabBtn.addEventListener("click", () => {
  loginTabBtn.classList.add("active");
  signupTabBtn.classList.remove("active");
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
  clearMessage();
});

signupTabBtn.addEventListener("click", () => {
  signupTabBtn.classList.add("active");
  loginTabBtn.classList.remove("active");
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
  clearMessage();
});

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message " + type;
}

function clearMessage() {
  messageBox.className = "message";
  messageBox.textContent = "";
}

function redirectAfterLogin() {
  const target = sessionStorage.getItem("redirectAfterLogin");
  sessionStorage.removeItem("redirectAfterLogin");
  window.location.href = target || "index.html";
}

// --- SIGN UP ---
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("signupEmail").value.trim();
  const mobile = document.getElementById("signupMobile").value.trim();
  const password = document.getElementById("signupPassword").value;
  const submitBtn = document.getElementById("signupSubmitBtn");

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account...";

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        mobile_number: mobile
      }
    }
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "Create Account";

  if (error) {
    showMessage(error.message, "error");
    return;
  }

  showMessage(
    "Account created! Please check your email (" + email + ") to confirm your signup, then log in.",
    "success"
  );
  signupForm.reset();
});

// --- LOGIN ---
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const submitBtn = document.getElementById("loginSubmitBtn");

  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "Login";

  if (error) {
    showMessage(error.message, "error");
    return;
  }

  showMessage("Login successful! Redirecting...", "success");
  setTimeout(redirectAfterLogin, 800);
});

// --- If already logged in, skip straight to redirect ---
(async function checkExistingSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    redirectAfterLogin();
  }
})();
