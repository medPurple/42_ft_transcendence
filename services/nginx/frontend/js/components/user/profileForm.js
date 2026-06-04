import Iuser from "./userInfo.js"

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

export default class profileForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const container = document.createElement('div');
    container.id = 'profile-container';
    this.shadowRoot.appendChild(container);
    await this.initUserInfo();
  }

  async initUserInfo() {
    try {
      const data = await Iuser.getAllUserInfo();
      const statut = this.checkStatut(data.user.is_online);
      this.displayUserProfile(data, data.user.profile_picture_data, statut);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  checkStatut(is_online) {
    if (is_online === 0) return { text: 'Offline',  color: '#9e9e9e', bg: 'rgba(158,158,158,0.12)' };
    if (is_online === 1) return { text: 'Online',   color: '#2e7d32', bg: 'rgba(46,125,50,0.1)'   };
    return                       { text: 'Playing',  color: '#f57c00', bg: 'rgba(245,124,0,0.1)'   };
  }

  displayUserProfile(data, profilePictureData, statut) {
    const u = data.user;
    this.shadowRoot.querySelector('#profile-container').innerHTML = `
      <link rel="stylesheet" href="/css/style.css" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

      <style>
        .profile-card {
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 16px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
          padding: 2rem 2rem 1.5rem;
          max-width: 360px;
          margin: 0 auto;
          text-align: center;
        }
        .avatar {
          width: 96px; height: 96px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(0,0,0,0.08);
          margin-bottom: 0.75rem;
        }
        .username {
          font-family: 'Courier New', monospace;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          padding: 3px 10px;
          border-radius: 99px;
          margin-bottom: 1.25rem;
        }
        .status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          display: inline-block;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.45rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          font-size: 0.85rem;
        }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #888; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; }
        .info-value { font-weight: 500; color: #1b1b1c; }
        .action-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.04em;
          background: rgba(27,27,28,0.06);
          border: 1px solid rgba(27,27,28,0.10);
          color: #1b1b1c !important;
          transition: background 0.2s;
          cursor: pointer;
          text-decoration: none !important;
        }
        .action-btn:hover { background: #1b1b1c; color: #fff !important; }
      </style>

      <div id="app-general-container">
        <div class="profile-card">
          <img class="avatar" src="data:image/jpeg;base64,${escapeHtml(profilePictureData)}" alt="Avatar">
          <div class="username">${escapeHtml(u.username)}</div>
          <div class="status-badge" style="background:${statut.bg};color:${statut.color};">
            <span class="status-dot" style="background:${statut.color};"></span>
            ${statut.text}
          </div>

          <div style="margin-bottom:1rem;">
            <div class="info-row">
              <span class="info-label">First name</span>
              <span class="info-value">${escapeHtml(u.first_name) || '—'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Last name</span>
              <span class="info-value">${escapeHtml(u.last_name) || '—'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">${escapeHtml(u.email)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">School</span>
              <span class="info-value">42</span>
            </div>
          </div>

          <div class="action-links">
            <a href="/statistics" data-link class="action-btn"><i class="bi bi-bar-chart-line"></i> My stats</a>
            <a href="/edit-profile" data-link class="action-btn"><i class="bi bi-pencil"></i> Edit profile</a>
            <a href="/update-password" data-link class="action-btn"><i class="bi bi-key"></i> Change password</a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('profile-form', profileForm);
