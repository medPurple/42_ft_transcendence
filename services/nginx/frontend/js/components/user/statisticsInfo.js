import Iuser from "../../components/user/userInfo.js";
import Icookies from "../../components/cookie/cookie.js";
import { API_BASE } from "../../config.js"

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

export class Statistics {

  /* ── Main entry ────────────────────────────────────────────── */
  async displayStat() {
    const main = document.querySelector('main');

    // Style block (injected once into the light DOM)
    if (!document.getElementById('stats-style')) {
      const style = document.createElement('style');
      style.id = 'stats-style';
      style.textContent = `
        #stats { padding: 1.5rem 1rem 3rem; }

        /* Hero card */
        .stat-hero {
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 16px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.09);
          padding: 2rem 2rem 1.5rem;
          max-width: 640px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .stat-hero img {
          width: 80px; height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(0,0,0,0.07);
          flex-shrink: 0;
        }
        .stat-hero-name {
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .stat-pills {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.4rem 0.9rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.03em;
        }
        .stat-pill strong { font-size: 1.15rem; line-height: 1.2; }
        .pill-played  { background: rgba(27,27,28,0.07);  color: #1b1b1c; }
        .pill-won     { background: rgba(46,125,50,0.10); color: #2e7d32; }
        .pill-lost    { background: rgba(198,40,40,0.09); color: #c62828; }

        /* Match history */
        .history-title {
          font-family: 'Courier New', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
          max-width: 640px;
          margin: 0 auto 0.75rem;
          padding-left: 0.25rem;
        }
        .match-list {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .match-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .match-players {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        .match-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(0,0,0,0.07);
        }
        .match-player-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #1b1b1c;
        }
        .match-vs {
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
          color: #aaa;
          padding: 0 0.25rem;
        }
        .match-score {
          font-family: 'Courier New', monospace;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #1b1b1c;
          white-space: nowrap;
        }
        .match-time {
          font-size: 0.72rem;
          color: #aaa;
          white-space: nowrap;
        }
        .no-history {
          text-align: center;
          color: #aaa;
          font-size: 0.85rem;
          padding: 2rem;
        }
      `;
      document.head.appendChild(style);
    }

    const containerStats = document.createElement('div');
    containerStats.id = 'stats';
    main.appendChild(containerStats);

    const userInfo = await Iuser.getAllUserInfo();
    const stats    = await this.getStats(userInfo.user.user_id);
    const users    = await Iuser.getAllUsers();

    containerStats.innerHTML = this._renderHero(userInfo.user, stats)
      + this._renderHistory(stats, users.users);

    return containerStats;
  }

  /* ── Hero card ─────────────────────────────────────────────── */
  _renderHero(user, stats) {
    const avatar = user.profile_picture_data
      ? `data:image/jpeg;base64,${user.profile_picture_data}`
      : '/images/Favicons/PH-01extra.png';

    return `
      <div class="stat-hero">
        <img src="${avatar}" alt="avatar">
        <div>
          <div class="stat-hero-name">${escapeHtml(user.username)}</div>
          <div class="stat-pills">
            <div class="stat-pill pill-played">
              <strong>${stats.game_played ?? 0}</strong>played
            </div>
            <div class="stat-pill pill-won">
              <strong>${stats.game_won ?? 0}</strong>won
            </div>
            <div class="stat-pill pill-lost">
              <strong>${stats.game_lost ?? 0}</strong>lost
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Match history ─────────────────────────────────────────── */
  _renderHistory(stats, allUsers) {
    const history = stats?.history;
    if (!history || Object.keys(history).length === 0) {
      return `<div class="history-title">Match history</div>
              <div class="match-list"><div class="no-history">No games played yet.</div></div>`;
    }

    const cards = Object.values(history).map((game, idx) => {
      const p1data = allUsers?.find(u => u.user_id === game.player1.id) || { username: 'Guest' };
      const p2data = allUsers?.find(u => u.user_id === game.player2.id) || { username: 'Guest' };

      const av1 = p1data.profile_picture_data
        ? `data:image/jpeg;base64,${p1data.profile_picture_data}`
        : '/images/Favicons/PH-01extra.png';
      const av2 = p2data.profile_picture_data
        ? `data:image/jpeg;base64,${p2data.profile_picture_data}`
        : '/images/Favicons/PH-01extra.png';

      const elapsed = this.timerCalculation(game.date);
      const timeAgo = elapsed > 3600
        ? `${Math.floor(elapsed / 3600)}h ago`
        : elapsed > 60
          ? `${Math.floor(elapsed / 60)} min ago`
          : `${elapsed}s ago`;

      return `
        <div class="match-card">
          <div class="match-players">
            <img class="match-avatar" src="${av1}" alt="${escapeHtml(p1data.username)}">
            <div class="match-player-name">${escapeHtml(p1data.username)}</div>
            <span class="match-vs">vs</span>
            <img class="match-avatar" src="${av2}" alt="${escapeHtml(p2data.username)}">
            <div class="match-player-name">${escapeHtml(p2data.username)}</div>
          </div>
          <div class="match-score">${game.player1.score} – ${game.player2.score}</div>
          <div class="match-time">${timeAgo}</div>
        </div>
      `;
    }).reverse().join('');  // most recent first

    return `<div class="history-title">Match history</div>
            <div class="match-list">${cards}</div>`;
  }

  /* ── API ───────────────────────────────────────────────────── */
  async getStats(userID) {
    try {
      const response = await fetch(API_BASE + `/api/pong/match/${userID}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Icookies.getCookie('csrftoken'),
          'Authorization': Icookies.getCookie('token')
        },
      });
      const data = await response.json();
      if (data.success) return data.data;
      console.error('Failed to get stats');
      return {};
    } catch (error) {
      console.error('Error', error);
      return {};
    }
  }

  timerCalculation(date) {
    try {
      const time = new Date(date);
      if (isNaN(time.getTime())) return 0;
      return Math.floor((Date.now() - time) / 1000);
    } catch {
      return 0;
    }
  }
}
