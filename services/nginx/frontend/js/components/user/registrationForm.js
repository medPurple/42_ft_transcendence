import Icookies from "../cookie/cookie.js"
import { API_BASE } from "../../config.js"

export default class RegistrationForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="css/style.css" />
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
			<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

			<div id="app-general-container">
			<div id="alert-container"></div>
			<div style="background:rgba(255,255,255,0.75);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.4);border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.12);padding:2rem 2rem;max-width:520px;margin:0 auto;">
			<h5 style="font-family:'Courier New',monospace;letter-spacing:0.1em;margin-bottom:1.5rem;">Create Account</h5>
			<form id="signup-form" method="post" action="" class="container" style="padding:0;">
			<div class="mb-4 row align-items-end">
				<div class="col">
					<label style="font-size:0.8rem;color:#555;margin-bottom:4px;display:block;">Profile picture</label>
					<input type="file" class="form-control" name="profile_picture" accept="images/*" />
				</div>
				<div class="col">
					<label style="font-size:0.8rem;color:#555;margin-bottom:4px;display:block;">Username</label>
					<input type="text" class="form-control" name="username" placeholder="Username">
				</div>
			</div>

			<div class="mb-4">
				<input type="text" class="form-control" name="first_name" placeholder="Firstname">
			</div>

			<div class="mb-4">
				<input type="text" class="form-control" name="last_name" placeholder="Lastname">
			</div>

			<div class="mb-4">
				<input type="email" class="form-control"  name="email" placeholder="Email" autocomplete="username">
			</div>

			<div class="mb-4">
				<input type="password" class="form-control" name="password1" placeholder="Password" autocomplete="new-password">
			</div>

			<div class="mb-4">
				<input type="password" class="form-control" name="password2" placeholder="Confirm Password" autocomplete="new-password">
			</div>

			<input type="hidden" class="form-control" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
			<button type="submit" class="btn btn-dark">Register</button>
			</form>
			</div>
			</div>`;
	}

	showAlert(message, type = 'danger') {
		const alertContainer = this.shadowRoot.getElementById('alert-container');
		alertContainer.innerHTML = `
				<div class="alert alert-${type} alert-dismissible fade show" role="alert">
					${message}
				</div>`;

	}

	validateForm(formData) {
		const username = formData.get('username');
		const email = formData.get('email');
		const password1 = formData.get('password1');
		const password2 = formData.get('password2');
		const img = formData.get('profile_picture');

		if (!username || !email || !password1 || !password2) {
		this.showAlert('All fields must be filled');
		return false;
		}

		if (password1 !== password2) {
		this.showAlert('Passwords do not match');
		return false;
		}

		if (!/^[a-zA-Z]+$/.test(username)) {
		this.showAlert('Username should contain only alphanumeric characters');
		return false;
		}

		if (password1.includes(username)) {
		this.showAlert('Password should not be similar to the username');
		return false;
		}

		if (password1.length < 8) {
		this.showAlert('Password should be at least 8 characters long');
		return false;
		}

		if (img && img.size > 1048576) {
		this.showAlert('Image too large');
		return false;
		}

		return true;
	}

	connectedCallback() {
		const signupForm = this.shadowRoot.getElementById('signup-form');
		const showAlert = this.showAlert.bind(this);
		const validateForm = this.validateForm.bind(this);
		signupForm.addEventListener('submit', async function(event) {
		event.preventDefault();



		try {
			const formData = new FormData(signupForm);
			if (!validateForm(formData)) {
			return;
			}

			const response = await fetch(API_BASE + '/api/profiles/register/', {
			method: 'POST',
			body: formData,
			headers: {
				'X-CSRFToken': formData.get('csrfmiddlewaretoken')
			}
			});
			const data = await response.json();
			if (data.success) {
			Icookies.setCookie('token', data.token, 7);
			window.location.href = `/home`;

			} else {
			if (data.password2) {
				showAlert(data.password2[0]);
				return;
			}
			else if (data.username) {
				showAlert(data.username);
				return;
			}
			else if (data.email) {
				showAlert(data.email);
				return;
			}
			showAlert('Registration failed. Please check the form and try again.');
			}

		} catch (error) {
			showAlert('Error:', error);
		}
		});
	}
}

customElements.define('registration-form', RegistrationForm);
