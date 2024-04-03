export default class LogoutForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
		<button id="logout-button" class="button">Logout</button>
		`;
	}

	connectedCallback() {
		const logoutButton = this.shadowRoot.getElementById('logout-button');
		logoutButton.addEventListener('click', function(event) {
			event.preventDefault();
			// The getCookie function you provided is used to retrieve the CSRF token from the "csrftoken" cookie.
			// This CSRF token is necessary to protect POST requests against Cross-Site Request Forgery (CSRF) attacks.
				function getCookie(name) {
					let cookieValue = null;
					if (document.cookie && document.cookie !== '') {
						const cookies = document.cookie.split(';');
						for (let i = 0; i < cookies.length; i++) {
							let cookie = cookies[i].trim();
							if (cookie.substring(0, name.length + 1) === (name + '=')) {
								cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
								break;
							}
						}
					}
					return cookieValue;
				}
				// Get the CSRF token from the cookie
				let csrfToken = getCookie('csrftoken');
				// Create a new FormData object
				const formData = new FormData();
			
			
				// Add the CSRF token to the form data
				formData.append('csrfmiddlewaretoken', csrfToken);

	
				// Send the logout request to the Django API
				fetch('/api/profiles/user_logout/', {
					method: 'POST',
					body: formData,
					credentials: 'same-origin',
					headers: {
						'X-CSRFToken': csrfToken
					}
				})
				.then(response => {
					if (response.ok) {
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
			
	customElements.define('logout-form', LogoutForm);







	

