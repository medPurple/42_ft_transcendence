import Icookies from "../cookie/cookie.js"

export default class RegistrationForm extends HTMLElement{
	constructor() {
		super(); // Always call super first in constructor
		this.attachShadow({ mode: 'open' }); // Create a new attached DOM tree for the component
        this.shadowRoot.innerHTML = `
		<form id="signup-form" method="post" action="">
			<input type="file" name="profile_picture" accept="images/*" />
			<input type="text" name="username" placeholder="Username">
			<input type="text" name="first_name" placeholder="Firstname">
			<input type="text" name="last_name" placeholder="Lastname">
			<input type="email" name="email" placeholder="Email">
			<input type="password" name="password1" placeholder="Password">
			<input type="password" name="password2" placeholder="Confirm Password">
			<input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
			<button type="submit" class="button">Register</button>
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
					console.log("Token de merde");
					console.log(data.token);
					Icookies.setCookie('token', data.token, 90);
					console.log(Icookies.getCookie('token'));
					// Redirect to the home page
					 window.location.href = '/'; // Change the URL to your home page URL

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
