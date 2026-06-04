import Icookies from "../cookie/cookie.js"
import { API_BASE } from "../../config.js"

export default class RegistrationForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="/css/style.css" />
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

			<style>
				.req-list { list-style: none; padding: 0; margin: 0.5rem 0 0; }
				.req-list li { font-size: 0.78rem; padding: 2px 0; color: #888; transition: color 0.2s; }
				.req-list li::before { content: "○ "; }
				.req-list li.ok { color: #2e7d32; }
				.req-list li.ok::before { content: "✓ "; }
				.req-list li.fail { color: #c62828; }
				.req-list li.fail::before { content: "✗ "; }
				.form-control { border-radius: 8px !important; border: 1px solid #ddd !important; transition: border-color 0.2s, box-shadow 0.2s !important; }
				.form-control:focus { border-color: #1b1b1c !important; box-shadow: 0 0 0 3px rgba(27,27,28,0.1) !important; }
				.btn-dark { border-radius: 8px !important; padding: 0.5rem 1.5rem !important; font-family: 'Courier New', monospace !important; letter-spacing: 0.05em !important; }
				.form-label { font-size: 0.8rem; color: #555; margin-bottom: 3px; }
				.alert { border-radius: 8px; font-size: 0.875rem; }
			</style>

			<div id="app-general-container">
			<div id="alert-container"></div>
			<div style="background:rgba(255,255,255,0.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.4);border-radius:14px;box-shadow:0 4px 32px rgba(0,0,0,0.10);padding:2rem 2rem;max-width:520px;margin:0 auto;">
			<h5 style="font-family:'Courier New',monospace;letter-spacing:0.08em;margin-bottom:1.5rem;font-size:1rem;">Create Account</h5>
			<form id="signup-form" method="post" action="" class="container" style="padding:0;">

				<div class="mb-3 row">
					<div class="col">
						<label class="form-label">Profile picture <span style="color:#aaa">(optional)</span></label>
						<input type="file" class="form-control form-control-sm" name="profile_picture" accept="image/*" />
					</div>
					<div class="col">
						<label class="form-label">Username <span style="color:#c62828">*</span></label>
						<input type="text" class="form-control" name="username" placeholder="letters only" autocomplete="username">
					</div>
				</div>

				<div class="mb-3 row">
					<div class="col">
						<label class="form-label">First name</label>
						<input type="text" class="form-control" name="first_name" placeholder="Firstname">
					</div>
					<div class="col">
						<label class="form-label">Last name</label>
						<input type="text" class="form-control" name="last_name" placeholder="Lastname">
					</div>
				</div>

				<div class="mb-3">
					<label class="form-label">Email <span style="color:#c62828">*</span></label>
					<input type="email" class="form-control" name="email" placeholder="you@example.com" autocomplete="email">
				</div>

				<div class="mb-2">
					<label class="form-label">Password <span style="color:#c62828">*</span></label>
					<input type="password" class="form-control" name="password1" placeholder="Create a password" autocomplete="new-password" id="pwd1">
					<ul class="req-list" id="pwd-reqs">
						<li id="req-len">At least 8 characters</li>
						<li id="req-user">Not similar to username</li>
						<li id="req-match">Passwords match</li>
					</ul>
				</div>

				<div class="mb-3">
					<label class="form-label">Confirm password <span style="color:#c62828">*</span></label>
					<input type="password" class="form-control" name="password2" placeholder="Repeat password" autocomplete="new-password" id="pwd2">
				</div>

				<input type="hidden" class="form-control" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
				<div class="d-flex justify-content-between align-items-center mt-1">
					<small style="color:#888">Already have an account? <button type="button" id="switch-to-login" style="background:none;border:none;padding:0;color:#1b1b1c;font-weight:600;font-size:inherit;cursor:pointer;text-decoration:underline;">Sign in</button></small>
					<button type="submit" class="btn btn-dark">Register →</button>
				</div>

			</form>
			</div>
			</div>`;
	}

	connectedCallback() {
		// Live password requirements checker
		const pwd1 = this.shadowRoot.getElementById('pwd1');
		const pwd2 = this.shadowRoot.getElementById('pwd2');
		const reqLen   = this.shadowRoot.getElementById('req-len');
		const reqUser  = this.shadowRoot.getElementById('req-user');
		const reqMatch = this.shadowRoot.getElementById('req-match');
		const usernameInput = this.shadowRoot.querySelector('input[name="username"]');

		const updateReqs = () => {
			const p1 = pwd1.value;
			const p2 = pwd2.value;
			const u  = usernameInput.value;

			setReq(reqLen,   p1.length >= 8);
			setReq(reqUser,  p1.length === 0 || !p1.toLowerCase().includes(u.toLowerCase()) || u.length === 0);
			setReq(reqMatch, p1.length > 0 && p1 === p2);
		};

		function setReq(el, ok) {
			el.className = ok ? 'ok' : (el.className === 'ok' ? 'fail' : '');
		}

		pwd1.addEventListener('input', updateReqs);
		pwd2.addEventListener('input', updateReqs);
		usernameInput.addEventListener('input', updateReqs);

		// Switch to login tab
		this.shadowRoot.getElementById('switch-to-login')?.addEventListener('click', () => {
			document.querySelector('.auth-tab[data-tab="login"]')?.click();
		});

		// Form submit
		const signupForm = this.shadowRoot.getElementById('signup-form');
		const showAlert = this.showAlert.bind(this);
		const validateForm = this.validateForm.bind(this);

		signupForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const formData = new FormData(signupForm);

			if (!validateForm(formData)) return;

			const btn = signupForm.querySelector('button[type=submit]');
			btn.disabled = true;
			btn.textContent = 'Creating…';

			try {
				const response = await fetch(API_BASE + '/api/profiles/register/', {
					method: 'POST',
					body: formData,
					headers: { 'X-CSRFToken': formData.get('csrfmiddlewaretoken') }
				});
				const data = await response.json();

				if (data.success) {
					Icookies.setCookie('token', data.token, 7);
					window.location.href = '/home';
				} else {
					const msg = data.password2?.[0]
						|| data.password1?.[0]
						|| data.username?.[0]
						|| data.email?.[0]
						|| data.error
						|| data.detail
						|| 'Registration failed — please check your details.';
					showAlert(msg);
				}
			} catch (error) {
				showAlert('Network error — please try again.');
			} finally {
				btn.disabled = false;
				btn.textContent = 'Register →';
			}
		});
	}

	showAlert(message, type = 'danger') {
		const alertContainer = this.shadowRoot.getElementById('alert-container');
		alertContainer.innerHTML = `
			<div class="alert alert-${type} d-flex align-items-center gap-2" role="alert" style="margin-bottom:1rem;">
				<i class="bi bi-exclamation-circle-fill"></i>
				<span>${message}</span>
			</div>`;
	}

	validateForm(formData) {
		const username  = formData.get('username');
		const email     = formData.get('email');
		const password1 = formData.get('password1');
		const password2 = formData.get('password2');
		const img       = formData.get('profile_picture');

		if (!username || !email || !password1 || !password2) {
			this.showAlert('All fields marked with <strong>*</strong> are required.');
			return false;
		}
		if (!/^[a-zA-Z]+$/.test(username)) {
			this.showAlert('Username must contain letters only (no numbers or special characters).');
			return false;
		}
		if (password1 !== password2) {
			this.showAlert('Passwords don\'t match — please re-enter.');
			return false;
		}
		if (password1.toLowerCase().includes(username.toLowerCase())) {
			this.showAlert('Password must not contain your username.');
			return false;
		}
		if (password1.length < 8) {
			this.showAlert('Password must be at least 8 characters.');
			return false;
		}
		if (img && img.size > 1048576) {
			this.showAlert('Profile picture must be under 1 MB.');
			return false;
		}
		return true;
	}
}

customElements.define('registration-form', RegistrationForm);
