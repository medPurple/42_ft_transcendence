import Icookies from "../cookie/cookie.js";
import { API_BASE } from "../../config.js"

export default class updatePasswordForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/css/style.css" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

      <style>
        .req-list { list-style: none; padding: 0; margin: 0.5rem 0 0; }
        .req-list li { font-size: 0.78rem; padding: 2px 0; color: #888; transition: color 0.2s; }
        .req-list li::before { content: "○ "; }
        .req-list li.ok  { color: #2e7d32; }
        .req-list li.ok::before  { content: "✓ "; }
        .req-list li.fail { color: #c62828; }
        .req-list li.fail::before { content: "✗ "; }
        .form-control { border-radius: 8px !important; border: 1px solid #ddd !important; transition: border-color 0.2s, box-shadow 0.2s !important; }
        .form-control:focus { border-color: #1b1b1c !important; box-shadow: 0 0 0 3px rgba(27,27,28,0.1) !important; }
        .btn-dark { border-radius: 8px !important; padding: 0.5rem 1.5rem !important; font-family: 'Courier New', monospace !important; letter-spacing: 0.05em !important; }
        .form-label { font-size: 0.8rem; color: #555; margin-bottom: 3px; }
        .alert { border-radius: 8px; font-size: 0.875rem; }
      </style>

      <div id="app-general-container">
        <div style="background:rgba(255,255,255,0.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.4);border-radius:14px;box-shadow:0 4px 32px rgba(0,0,0,0.10);padding:2rem;max-width:400px;margin:0 auto;">
          <h5 style="font-family:'Courier New',monospace;letter-spacing:0.08em;margin-bottom:1.5rem;font-size:1rem;">Change Password</h5>
          <div id="alert-container"></div>
          <form id="update-password-form" method="post">
            <input type="text" style="display:none;" name="username" autocomplete="username">

            <div class="mb-2">
              <label class="form-label">New password <span style="color:#c62828">*</span></label>
              <input type="password" class="form-control" name="new_password1" id="pwd1" placeholder="Create a new password" autocomplete="new-password">
              <ul class="req-list" id="pwd-reqs">
                <li id="req-len">At least 8 characters</li>
                <li id="req-match">Passwords match</li>
              </ul>
            </div>

            <div class="mb-4">
              <label class="form-label">Confirm new password <span style="color:#c62828">*</span></label>
              <input type="password" class="form-control" name="new_password2" id="pwd2" placeholder="Repeat new password" autocomplete="new-password">
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <a href="/profile" data-link style="font-size:0.82rem;color:#888;">← Cancel</a>
              <button type="submit" class="btn btn-dark">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const pwd1     = this.shadowRoot.getElementById('pwd1');
    const pwd2     = this.shadowRoot.getElementById('pwd2');
    const reqLen   = this.shadowRoot.getElementById('req-len');
    const reqMatch = this.shadowRoot.getElementById('req-match');

    const updateReqs = () => {
      const p1 = pwd1.value, p2 = pwd2.value;
      setReq(reqLen,   p1.length >= 8);
      setReq(reqMatch, p1.length > 0 && p1 === p2);
    };
    function setReq(el, ok) {
      el.className = ok ? 'ok' : (el.className === 'ok' ? 'fail' : '');
    }
    pwd1.addEventListener('input', updateReqs);
    pwd2.addEventListener('input', updateReqs);

    const form = this.shadowRoot.getElementById('update-password-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      if (!this.validateForm(formData)) return;

      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Saving…';

      try {
        const response = await fetch(API_BASE + '/api/profiles/update-password/', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': Icookies.getCookie('token'),
            'X-CSRFToken': Icookies.getCookie('csrftoken')
          }
        });
        const data = await response.json();
        if (data.success) {
          window.location.href = '/profile';
        } else {
          const msg = data.new_password2?.[0] || data.new_password1?.[0]
            || data.error || data.detail || 'Password update failed — please try again.';
          this.showAlert(msg);
        }
      } catch (error) {
        this.showAlert('Network error — please try again.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save changes';
      }
    });
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

  validateForm(formData) {
    const p1 = formData.get('new_password1');
    const p2 = formData.get('new_password2');
    if (!p1 || !p2) {
      this.showAlert('Both password fields are required.');
      return false;
    }
    if (p1.length < 8) {
      this.showAlert('New password must be at least 8 characters.');
      return false;
    }
    if (p1 !== p2) {
      this.showAlert('Passwords don\'t match — please re-enter.');
      return false;
    }
    return true;
  }
}

customElements.define('update-password-form', updatePasswordForm);
