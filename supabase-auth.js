/*
  REAL AUTHENTICATION — powered by Supabase
  -------------------------------------------
  This replaces the old localStorage-based demo. Accounts created here
  are stored in a real database and work across any device/browser.
*/

const SUPABASE_URL = 'https://jfsercsnahtppckoayxl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_lzZ23DL9NNsjN6BinKNENg_VRmgmU4t';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NexaAuth = (() => {

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(el) { if (el) el.style.display = 'block'; }
  function hideError(el) { if (el) el.style.display = 'none'; }

  function showMsg(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = 'form-msg show ' + type;
  }

  function setLoading(button, loading, originalText) {
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? 'Please wait...' : originalText;
  }

  function wireSignupForm(cfg) {
    const form = document.getElementById(cfg.formId);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById(cfg.nameId).value.trim();
      const email = document.getElementById(cfg.emailId).value.trim();
      const password = document.getElementById(cfg.passwordId).value;
      const emailErrorEl = document.getElementById(cfg.emailErrorId);
      const passwordErrorEl = document.getElementById(cfg.passwordErrorId);
      const msgEl = document.getElementById(cfg.msgId);
      const submitBtn = form.querySelector('button[type="submit"]');

      let valid = true;
      if (!isValidEmail(email)) { showError(emailErrorEl); valid = false; } else { hideError(emailErrorEl); }
      if (password.length < 6) { showError(passwordErrorEl); valid = false; } else { hideError(passwordErrorEl); }
      if (!valid) return;

      setLoading(submitBtn, true, 'Create account');

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });

      setLoading(submitBtn, false, 'Create account');

      if (error) {
        showMsg(msgEl, error.message, 'error');
        return;
      }

      showMsg(msgEl, 'Account created. Redirecting...', 'success');
      setTimeout(() => cfg.onSuccess(), 600);
    });
  }

  function wireLoginForm(cfg) {
    const form = document.getElementById(cfg.formId);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById(cfg.emailId).value.trim();
      const password = document.getElementById(cfg.passwordId).value;
      const emailErrorEl = document.getElementById(cfg.emailErrorId);
      const passwordErrorEl = document.getElementById(cfg.passwordErrorId);
      const msgEl = document.getElementById(cfg.msgId);
      const submitBtn = form.querySelector('button[type="submit"]');

      let valid = true;
      if (!isValidEmail(email)) { showError(emailErrorEl); valid = false; } else { hideError(emailErrorEl); }
      if (password.length < 6) { showError(passwordErrorEl); valid = false; } else { hideError(passwordErrorEl); }
      if (!valid) return;

      setLoading(submitBtn, true, 'Log in');

      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

      setLoading(submitBtn, false, 'Log in');

      if (error) {
        showMsg(msgEl, error.message, 'error');
        return;
      }

      showMsg(msgEl, 'Logged in. Redirecting...', 'success');
      setTimeout(() => cfg.onSuccess(), 500);
    });
  }

  async function getSession() {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) return null;
    return {
      email: data.session.user.email,
      name: data.session.user.user_metadata?.full_name || ''
    };
  }

  async function logout() {
    await supabaseClient.auth.signOut();
  }

  return { wireSignupForm, wireLoginForm, getSession, logout };
})();
