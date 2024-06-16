import Icookies from "../cookie/cookie.js"

export default class RegistrationForm extends HTMLElement {
	constructor() {
		super(); // Always call super first in constructor
		this.attachShadow({ mode: 'open' }); // Create a new attached DOM tree for the component
        this.shadowRoot.innerHTML = `
		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

		<div id="app-general-container">
		<div id="alert-container"></div>
		<form id="signup-form" method="post" action="" class="container">
		<div class="mb-4 row">
			<div class="col">
				<input type="file" class="form-control" name="profile_picture" accept="images/*" />
			</div>
			<div class="col">
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
		// Get the form data
		const username = formData.get('username');
		const email = formData.get('email');
		const password1 = formData.get('password1');
		const password2 = formData.get('password2');
		const img = formData.get('profile_picture');

		// Check if all fields are filled
		if (!username || !email || !password1 || !password2) {
			this.showAlert('All fields must be filled');
			return false;
		}

		// Check if passwords match
		if (password1 !== password2) {
			this.showAlert('Passwords do not match');
			return false;
		}

		// Check if password is not similar to username
		if (!/^[a-zA-Z]+$/.test(username)) {
			this.showAlert('Username should contain only alphanumeric characters');
			return false;
		}

		// Check if password should not be similar to the username
		if (password1.includes(username)) {
			this.showAlert('Password should not be similar to the username');
			return false;
		}

		// Check if password has at least 8 characters
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
		const signupForm = this.shadowRoot.getElementById('signup-form'); // Use getElementById to find the form within the component
		const showAlert = this.showAlert.bind(this);
		const validateForm = this.validateForm.bind(this);
		signupForm.addEventListener('submit', async function(event) {
			event.preventDefault();



            // Get the form data
			try {
				const formData = new FormData(signupForm);
				if (!validateForm(formData)) {
					return;
				}

            // Send an AJAX request to submit the form
				const response = await 	fetch('/api/profiles/register/', {
					method: 'POST',
					body: formData,
					headers: {
						'X-CSRFToken': formData.get('csrfmiddlewaretoken') // Get the CSRF token from the form data
					}
				});
				const data = await response.json();
				if (data.success) {
					Icookies.setCookie('token', data.token, 90);
					// Redirect to the home page
					window.location.href = `/home`; // Change the URL to your home page URL

				} else {
					// console.log(data);
					if (data.password2){
						showAlert(data.password2[0]);
						return;
					}
					else if (data.username){
						showAlert(data.username);
						return;
					}
					else if (data.email){
						showAlert(data.email);
						return;
					}
                    // Display validation errors or any other error message
					showAlert('Registration failed. Please check the form and try again.');
				}

			} catch(error) {
				showAlert('Error:', error);
			}
		});
	}
}

customElements.define('registration-form', RegistrationForm);
