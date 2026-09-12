/*
  IMPORTANT — READ THIS BEFORE LAUNCHING TO REAL USERS
  ------------------------------------------------------
  This file makes the Login/Signup forms WORK in the browser so you can
  see and test the flow. But it stores accounts in localStorage (only on
  the visitor's own device/browser). This is NOT secure and is NOT a real
  authentication system:
    - Passwords are not encrypted properly
    - There is no real database — two different people on two different
      phones will NOT see the same accounts
    - Anyone can open dev tools and see/edit the "database"

  This is fine for demoing the UI to yourself or a client. It is NOT fine
  for real users signing up with real passwords.

  TO MAKE THIS REAL (free tier available):
  1. Create a free project at https://supabase.com
  2. Enable Email/Password auth in Supabase Authentication settings
  3. Replace the functions below with Supabase's JS client calls, e.g.:

     const { data, error } = await supabase.auth.signUp({ email, password })
     const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  Supabase's own docs have a copy-paste quickstart for exactly this.
*/

const NexaAuth = (() => {
  const STORAGE_KEY = 'nexascale_demo_users';
  const SESSION_KEY = 'nexascale_demo_session';

  function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

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

  function wireSignupForm(cfg) {
    const form = document.getElementById(cfg.formId);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById(cfg.nameId).value.trim();
      const email = document.getElementById(cfg.emailId).value.trim();
      const password = document.getElementById(cfg.passwordId).value;
      const emailErrorEl = document.getElementById(cfg.emailErrorId);
      const passwordErrorEl = document.getElementById(cfg.passwordErrorId);
      const msgEl = document.getElementById(cfg.msgId);

      let valid = true;
      if (!isValidEmail(email)) { showError(emailErrorEl); valid = false; } else { hideError(emailErrorEl); }
      if (password.length < 6) { showError(passwordErrorEl); valid = false; } else { hideError(passwordErrorEl); }
      if (!valid) return;

      const users = getUsers();
      if (users.find(u => u.email === email)) {
        showMsg(msgEl, 'An account with this email already exists. Try logging in instead.', 'error');
        return;
      }

      users.push({ name, email, password });
      saveUsers(users);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name }));
      showMsg(msgEl, 'Account created. Redirecting...', 'success');
      setTimeout(() => cfg.onSuccess(), 600);
    });
  }

  function wireLoginForm(cfg) {
    const form = document.getElementById(cfg.formId);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById(cfg.emailId).value.trim();
      const password = document.getElementById(cfg.passwordId).value;
      const emailErrorEl = document.getElementById(cfg.emailErrorId);
      const passwordErrorEl = document.getElementById(cfg.passwordErrorId);
      const msgEl = document.getElementById(cfg.msgId);

      let valid = true;
      if (!isValidEmail(email)) { showError(emailErrorEl); valid = false; } else { hideError(emailErrorEl); }
      if (password.length < 6) { showError(passwordErrorEl); valid = false; } else { hideError(passwordErrorEl); }
      if (!valid) return;

      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        showMsg(msgEl, 'No matching account found. Check your details or sign up.', 'error');
        return;
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }));
      showMsg(msgEl, 'Logged in. Redirecting...', 'success');
      setTimeout(() => cfg.onSuccess(), 500);
    });
  }

  function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  return { wireSignupForm, wireLoginForm, getSession, logout };
})();
