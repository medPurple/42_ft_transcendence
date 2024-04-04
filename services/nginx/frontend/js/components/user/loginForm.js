export default class LoginForm extends HTMLElement{
	constructor() {
		super(); // Always call super first in constructor
		this.attachShadow({ mode: 'open' }); // Create a new attached DOM tree for the component
        this.shadowRoot.innerHTML = `
        <form id="login-form" method="post" action="">
            <input type="text" name="username" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
            <button type="submit" class="button">Log in</button>
        </form>
        `;
	}

	connectedCallback() {
		const signupForm = this.shadowRoot.getElementById('login-form'); // Use getElementById to find the form within the component
		signupForm.addEventListener('submit', function(event) {
			event.preventDefault();

            // Get the form data
			const formData = new FormData(signupForm);

            // Send an AJAX request to submit the form
			fetch('/api/profiles/user_login/', {
				method: 'POST',
				body: formData,
				headers: {
					'X-CSRFToken': formData.get('csrfmiddlewaretoken') // Get the CSRF token from the form data
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					 console.log(data);
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

customElements.define('login-form', LoginForm);




