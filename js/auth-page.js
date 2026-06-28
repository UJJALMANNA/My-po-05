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

  const firstName  = document.getElementById("signFirstname").value.trim();
  const lastName   = document.getElementById("signLastname").value.trim();
  const email      = document.getElementById("signupEmail").value.trim();
  const mobile     = document.getElementById("signupMobile").value.trim();
  const age        = document.getElementById("signupAge").value.trim();
  const profession = document.getElementById("signupProfession").value;
  const password   = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const submitBtn  = document.getElementById("signupSubmitBtn");

  // Validate first name
  if (!firstName) {
    showMessage("Please enter your first name.", "error");
    return;
  }

  // Check passwords match
  if (password !== confirmPassword) {
    showMessage("Passwords do not match! Please re-enter.", "error"); // ✅ fixed: was "red"
    return;
  }

  // Check profession was selected
  if (!profession) {
    showMessage("Please select your profession.", "error"); // ✅ fixed: was "red"
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
        full_name: firstName + " " + lastName, // ✅ added: used by dashboard & email template
        mobile_number: mobile,
        age: parseInt(age),
        profession: profession
      }
    }
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "Create Account";

  if (error) {
    // ✅ Show human-readable error message (not raw object)
    showMessage(error.message || "Signup failed. Please try again.", "error");
    return;
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    showMessage(
      "🎉 Account created! A welcome email has been sent to " + email + " — please confirm it to log in.",
      "success"
    );
  } else {
    showMessage("Account created! Redirecting...", "success");
    setTimeout(redirectAfterLogin, 1000);
  }

  signupForm.reset();
});

// --- LOGIN ---
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  const email     = document.getElementById("loginEmail").value.trim();
  const password  = document.getElementById("loginPassword").value;
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
    showMessage(error.message || "Login failed. Please check your email and password.", "error");
    return;
  }

  showMessage("✅ Login successful! Redirecting...", "success");
  setTimeout(redirectAfterLogin, 800);
});

// --- If already logged in, skip straight to redirect ---
(async function checkExistingSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    redirectAfterLogin();
  }
})();
