import Icookies from "../cookie/cookie.js"

export default class RegistrationForm extends HTMLElement {
	constructor() {
		super(); // Always call super first in constructor
		this.attachShadow({ mode: 'open' }); // Create a new attached DOM tree for the component
        this.shadowRoot.innerHTML = `
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
			<input type="email" class="form-control"  name="email" placeholder="Email">
		</div>

		<div class="mb-4">
			<input type="password" class="form-control" name="password1" placeholder="Password">
		</div>

		<div class="mb-4">
			<input type="password" class="form-control" name="password2" placeholder="Confirm Password">
		</div>

		<input type="hidden" class="form-control" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
		<button type="submit" class="btn btn-dark">Register</button>
	</form>`;
	}

	connectedCallback() {
		const signupForm = this.shadowRoot.getElementById('signup-form'); // Use getElementById to find the form within the component
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
                    // Display validation errors or any other error message
					alert('Registration failed. Please check the form and try again.');
				}
			})
			.catch(error => {
				console.error('Error:', error);
                // Handle API errors
			});
		});
	}
}

customElements.define('registration-form', RegistrationForm);
