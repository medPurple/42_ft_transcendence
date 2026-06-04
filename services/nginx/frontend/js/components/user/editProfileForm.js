import Iuser from "./userInfo.js";
import Icookies from "../cookie/cookie.js";
import { API_BASE } from "../../config.js"

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

export default class editProfileForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const div = document.createElement('div');
    div.id = 'edit-profile';
    this.shadowRoot.appendChild(div);
    await this.initUserInfo();
    this.initFormSubmit();
  }

  async initUserInfo() {
    try {
      const data = await Iuser.getAllUserInfo();
      if (data && data.user) this.displayEditProfileForm(data);
      else console.info('Missing user data. Please login.');
    } catch (error) {
      console.info('Error:', error);
    }
  }

  displayEditProfileForm(data) {
    const u = data.user;
    this.shadowRoot.querySelector('#edit-profile').innerHTML = `
      <link rel="stylesheet" href="/css/style.css" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

      <style>
        .form-control { border-radius: 8px !important; border: 1px solid #ddd !important; transition: border-color 0.2s, box-shadow 0.2s !important; }
        .form-control:focus { border-color: #1b1b1c !important; box-shadow: 0 0 0 3px rgba(27,27,28,0.1) !important; }
        .form-label { font-size: 0.8rem; color: #555; margin-bottom: 3px; }
        .btn-dark { border-radius: 8px !important; padding: 0.5rem 1.5rem !important; font-family: 'Courier New', monospace !important; letter-spacing: 0.05em !important; }
        .alert { border-radius: 8px; font-size: 0.875rem; }
        .toggle-2fa { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; }
        .form-check-input { width: 2.5em !important; height: 1.25em !important; cursor: pointer; }
      </style>

      <div id="app-general-container">
        <div style="background:rgba(255,255,255,0.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.4);border-radius:14px;box-shadow:0 4px 32px rgba(0,0,0,0.10);padding:2rem;max-width:480px;margin:0 auto;">
          <h5 style="font-family:'Courier New',monospace;letter-spacing:0.08em;margin-bottom:1.5rem;font-size:1rem;">Edit Profile</h5>
          <div id="alert-container"></div>
          <form id="edit-profile-form" method="post">

            <div class="mb-3">
              <label class="form-label">Profile picture <span style="color:#aaa">(optional, max 1 MB)</span></label>
              <input type="file" class="form-control form-control-sm" name="profile_picture" accept="image/*" />
            </div>

            <div class="mb-3">
              <label class="form-label">Username <span style="color:#c62828">*</span></label>
              <input type="text" class="form-control" name="username" value="${escapeHtml(u.username)}" autocomplete="username">
            </div>

            <div class="row mb-3">
              <div class="col">
                <label class="form-label">First name</label>
                <input type="text" class="form-control" name="first_name" value="${escapeHtml(u.first_name)}">
              </div>
              <div class="col">
                <label class="form-label">Last name</label>
                <input type="text" class="form-control" name="last_name" value="${escapeHtml(u.last_name)}">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Email <span style="color:#c62828">*</span></label>
              <input type="email" class="form-control" name="email" value="${escapeHtml(u.email)}" autocomplete="email">
            </div>

            <div class="mb-4">
              <label class="form-label">Two-factor authentication</label>
              <div class="toggle-2fa">
                <input type="checkbox" class="form-check-input" role="switch" id="is_2fa" name="is_2fa" ${u.is_2fa ? 'checked' : ''}>
                <label for="is_2fa" style="font-size:0.85rem;color:#555;">Enable 2FA via email</label>
              </div>
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

  showAlert(message, type = 'danger') {
    const c = this.shadowRoot.getElementById('alert-container');
    if (!c) return;
    c.innerHTML = `
      <div class="alert alert-${type} d-flex align-items-center gap-2" role="alert" style="margin-bottom:1rem;">
        <i class="bi bi-${type === 'danger' ? 'exclamation-circle-fill' : 'check-circle-fill'}"></i>
        <span>${message}</span>
      </div>`;
  }

  validateForm(formData) {
    const username = formData.get('username');
    const img      = formData.get('profile_picture');

    if (!username || !username.trim()) {
      this.showAlert('Username is required.');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      this.showAlert('Username can only contain letters, numbers and underscores.');
      return false;
    }
    if (img && img.size > 1048576) {
      this.showAlert('Profile picture must be under 1 MB.');
      return false;
    }
    return true;
  }

  initFormSubmit() {
    const form = this.shadowRoot.getElementById('edit-profile-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      if (!this.validateForm(formData)) return;

      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Saving…';

      try {
        const response = await fetch(API_BASE + '/api/profiles/edit-profile/', {
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
          const msg = data.username?.[0] || data.email?.[0] || data.error || data.detail
            || 'Update failed — please check your details.';
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
}

customElements.define('edit-profile-form', editProfileForm);
