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

	connectedCallback() {
		const signupForm = this.shadowRoot.getElementById('signup-form'); // Use getElementById to find the form within the component
		const showAlert = this.showAlert.bind(this);
		signupForm.addEventListener('submit', function(event) {
			event.preventDefault();

            // Get the form data
			const formData = new FormData(signupForm);

            // Send an AJAX request to submit the form
			fetch('/api/profiles/register/', {
				method: 'POST',
				body: formData,
				headers: {
					'X-CSRFToken': formData.get('csrfmiddlewaretoken') // Get the CSRF token from the form data
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					Icookies.setCookie('token', data.token, 90);
					// Redirect to the home page
					window.location.href = `/home`; // Change the URL to your home page URL

				} else {
					console.log(data);
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
			})
			.catch(error => {
				showAlert('Error:', error);
                // Handle API errors
			});
		});
	}
}

customElements.define('registration-form', RegistrationForm);
