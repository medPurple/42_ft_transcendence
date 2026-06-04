import Icookies from "../cookie/cookie.js"
import { API_BASE } from "../../config.js"

export default class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
		<link rel="stylesheet" href="/css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

		<style>
			.form-control { border-radius: 8px !important; border: 1px solid #ddd !important; transition: border-color 0.2s, box-shadow 0.2s !important; }
			.form-control:focus { border-color: #1b1b1c !important; box-shadow: 0 0 0 3px rgba(27,27,28,0.1) !important; }
			.btn-dark { border-radius: 8px !important; padding: 0.5rem 1.5rem !important; font-family: 'Courier New', monospace !important; letter-spacing: 0.05em !important; width: 100%; }
			.form-label { font-size: 0.8rem; color: #555; margin-bottom: 3px; }
			.alert { border-radius: 8px; font-size: 0.875rem; }
		</style>

		<div id="app-general-container">
			<div id="alert-container"></div>
			<div style="background:rgba(255,255,255,0.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.4);border-radius:14px;box-shadow:0 4px 32px rgba(0,0,0,0.10);padding:2rem 2rem;max-width:360px;margin:0 auto;">
				<h5 style="font-family:'Courier New',monospace;letter-spacing:0.08em;margin-bottom:1.5rem;font-size:1rem;">Sign In</h5>
				<form id="login-form" method="post" action="">

					<div class="mb-3">
						<label class="form-label">Username</label>
						<input type="text" class="form-control" name="username" placeholder="Your username" autocomplete="username" required>
					</div>
					<div class="mb-4">
						<label class="form-label">Password</label>
						<input type="password" class="form-control" name="password" placeholder="Your password" autocomplete="current-password" required>
						<input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
					</div>

					<button type="submit" class="btn btn-dark">Sign in →</button>

					<div class="text-center mt-3">
						<small style="color:#888">No account? <button type="button" id="switch-to-register" style="background:none;border:none;padding:0;color:#1b1b1c;font-weight:600;font-size:inherit;cursor:pointer;text-decoration:underline;">Create one</button></small>
					</div>
				</form>
			</div>
		</div>
		`;
  }

  showAlert(message, type = 'danger') {
    const alertContainer = this.shadowRoot.getElementById('alert-container');
    alertContainer.innerHTML = `
		<div class="alert alert-${type} d-flex align-items-center gap-2" role="alert" style="margin-bottom:1rem;">
			<i class="bi bi-exclamation-circle-fill"></i>
			<span>${message}</span>
		</div>`;
  }

  connectedCallback() {
    const signupForm = this.shadowRoot.getElementById('login-form');
    const showAlert = this.showAlert.bind(this);

    // Switch to register tab
    this.shadowRoot.getElementById('switch-to-register')?.addEventListener('click', () => {
      document.querySelector('.auth-tab[data-tab="register"]')?.click();
    });

    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(signupForm);
      const btn = signupForm.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Signing in…';

      try {
        const response = await fetch(API_BASE + '/api/profiles/login/', {
          method: 'POST',
          body: formData,
          headers: { 'X-CSRFToken': formData.get('csrfmiddlewaretoken') }
        });
        const data = await response.json();

        if (data.two_fa) {
          window.location.href = '/code2FA';
        } else if (data.success) {
          Icookies.setCookie('token', data.token, 7);
          window.location.href = '/home';
        } else {
          const msg = data.error || data.detail || data.non_field_errors?.[0]
            || 'Invalid username or password.';
          showAlert(msg);
        }
      } catch (error) {
        showAlert('Network error — please try again.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign in →';
      }
    });
  }
}

customElements.define('login-form', LoginForm);
