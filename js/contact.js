// ============================================================
// CONTACT — sends query form submissions to Supabase
// Falls back to a clear error state if Supabase isn't configured yet.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('queryForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');
  if (!form) return;

  let supabaseClient = null;
  const configured =
    typeof SUPABASE_CONFIG !== 'undefined' &&
    SUPABASE_CONFIG.url &&
    !SUPABASE_CONFIG.url.includes('YOUR_SUPABASE') &&
    SUPABASE_CONFIG.anonKey &&
    !SUPABASE_CONFIG.anonKey.includes('YOUR_SUPABASE');

  if (configured && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    if (type) statusEl.classList.add(type);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus('Please fill in all required fields.', 'is-error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setStatus('', null);

    if (!supabaseClient) {
      // Supabase not configured yet — guide the owner, don't fail silently
      console.warn('Supabase is not configured. Add your project URL and anon key in js/config.js');
      setStatus('Form is not connected yet — see README.md to add your Supabase keys.', 'is-error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('messages')
        .insert([{ name, email, subject, message }]);

      if (error) throw error;

      setStatus('Message sent — thank you, I\'ll get back to you soon.', 'is-success');
      form.reset();
    } catch (err) {
      console.error('Error sending message:', err);
      setStatus('Something went wrong sending your message. Please try again.', 'is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
});
