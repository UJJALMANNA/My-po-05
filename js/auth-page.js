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
const firstName = document.getElementById('signFirstname').value;
const lastName = document.getElementById('signLastname').value;
const email = document.getElementById("signupEmail").value.trim();
const mobile = document.getElementById("signupMobile").value.trim();
const age = document.getElementById("signupAge").value.trim();
const profession = document.getElementById("signupProfession").value;
const password = document.getElementById("signupPassword").value;
const confirmPassword = document.getElementById("signupConfirmPassword").value;
const submitBtn = document.getElementById("signupSubmitBtn");

// Check passwords match
if (password !== confirmPassword) {
  showMessage("Passwords do not match!", "red"); // use whatever your existing error-display function/pattern is, or swap for your messageBox code
  return;
}

// Check profession was selected
if (!profession) {
  showMessage("Please select your profession.", "red");
  return;
}

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account...";

  const { data, error } = await supabaseClient.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobile,
      age: parseInt(age),
      profession: profession
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
