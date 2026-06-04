import Icookies from "../cookie/cookie.js"
import { API_BASE } from "../../config.js"

export default class code2FA extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/css/style.css" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

      <style>
        .form-control { border-radius: 8px !important; border: 1px solid #ddd !important; transition: border-color 0.2s, box-shadow 0.2s !important; text-align: center; font-size: 1.4rem; letter-spacing: 0.3em; font-family: 'Courier New', monospace; }
        .form-control:focus { border-color: #1b1b1c !important; box-shadow: 0 0 0 3px rgba(27,27,28,0.1) !important; }
        .btn-dark { border-radius: 8px !important; padding: 0.5rem 1.5rem !important; font-family: 'Courier New', monospace !important; letter-spacing: 0.05em !important; width: 100%; }
        .alert { border-radius: 8px; font-size: 0.875rem; }
      </style>

      <div id="app-general-container">
        <div style="background:rgba(255,255,255,0.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.4);border-radius:14px;box-shadow:0 4px 32px rgba(0,0,0,0.10);padding:2rem;max-width:360px;margin:0 auto;text-align:center;">
          <div style="font-size:2rem;margin-bottom:0.5rem;">🔐</div>
          <h5 style="font-family:'Courier New',monospace;letter-spacing:0.08em;margin-bottom:0.5rem;font-size:1rem;">Two-factor authentication</h5>
          <p style="font-size:0.82rem;color:#888;margin-bottom:1.5rem;">A verification code has been sent to your email.</p>
          <div id="alert-container"></div>
          <form id="otp-form">
            <div class="mb-4">
              <input type="text" id="otp-input" class="form-control" placeholder="000000" maxlength="8" autocomplete="one-time-code" inputmode="numeric">
            </div>
            <button type="submit" id="submit-btn" class="btn btn-dark">Verify →</button>
          </form>
        </div>
      </div>
    `;
  }

  showAlert(message, type = 'danger') {
    const c = this.shadowRoot.getElementById('alert-container');
    if (!c) return;
    c.innerHTML = `
      <div class="alert alert-${type} d-flex align-items-center gap-2" role="alert" style="margin-bottom:1rem;">
        <i class="bi bi-exclamation-circle-fill"></i>
        <span>${message}</span>
      </div>`;
  }

  connectedCallback() {
    const form  = this.shadowRoot.getElementById('otp-form');
    const input = this.shadowRoot.getElementById('otp-input');
    const btn   = this.shadowRoot.getElementById('submit-btn');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const otp = input.value.trim();
      if (!otp) { this.showAlert('Please enter the verification code.'); return; }

      btn.disabled = true;
      btn.textContent = 'Verifying…';

      try {
        const response = await fetch(API_BASE + '/api/profiles/login_2FA/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Icookies.getCookie('csrftoken')
          },
          body: JSON.stringify({ otp })
        });
        const data = await response.json();
        if (data.success) {
          Icookies.setCookie('token', data.token, 7);
          window.location.href = '/home';
        } else {
          const msg = data.error || data.detail || 'Wrong code — please check your email and try again.';
          this.showAlert(msg);
        }
      } catch (error) {
        this.showAlert('Network error — please try again.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Verify →';
      }
    });
  }
}

customElements.define('code-form', code2FA);
