import "../../components/user/loginForm.js";
import "../../components/user/registrationForm.js";

export default function login() {
  return authPage('login');
}

export function authPage(initialTab = 'login') {
  const el = document.createElement('div');
  el.id = 'auth-page';
  el.innerHTML = `
    <style>
      #auth-page { padding-top: 5rem; padding-bottom: 3rem; }
      .auth-toggle {
        display: flex;
        background: rgba(255,255,255,0.55);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 99px;
        padding: 4px;
        max-width: 260px;
        margin: 0 auto 1.75rem;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      }
      .auth-tab {
        flex: 1;
        border: none;
        background: transparent;
        border-radius: 99px;
        padding: 0.4rem 0;
        font-family: 'Courier New', monospace;
        font-size: 0.82rem;
        letter-spacing: 0.05em;
        color: #888;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
      }
      .auth-tab.active {
        background: #1b1b1c;
        color: #fff;
      }
      .auth-panel { display: none; }
      .auth-panel.active { display: block; }
    </style>

    <div class="auth-toggle">
      <button class="auth-tab ${initialTab === 'login' ? 'active' : ''}" data-tab="login">Sign in</button>
      <button class="auth-tab ${initialTab === 'register' ? 'active' : ''}" data-tab="register">Register</button>
    </div>

    <div id="panel-login" class="auth-panel ${initialTab === 'login' ? 'active' : ''}">
      <login-form></login-form>
    </div>
    <div id="panel-register" class="auth-panel ${initialTab === 'register' ? 'active' : ''}">
      <registration-form></registration-form>
    </div>
  `;

  el.querySelectorAll('.auth-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      el.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      el.querySelector(`#panel-${btn.dataset.tab}`).classList.add('active');
      // Met à jour l'URL sans navigation
      history.replaceState('', '', btn.dataset.tab === 'login' ? '/login' : '/register');
    });
  });

  return el;
}
