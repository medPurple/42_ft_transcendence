import Icookies from "../cookie/cookie.js"

export default class LogoutForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		const button = document.createElement('button');
        button.setAttribute('id', 'logout-button');
        button.setAttribute('class', 'button');
        button.textContent = 'Logout';
        // Attacher le bouton à l'ombre de l'élément
        this.shadowRoot.appendChild(button);
    }

	connectedCallback() {
		const logoutButton = this.shadowRoot.getElementById('logout-button');
		logoutButton.addEventListener('click', function(event) {
			event.preventDefault();

			// Get the CSRF token from the cookie
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');

			// Send the logout request to the Django API
			fetch('/api/profiles/logout/', {
				method: 'POST',
				//credentials: 'same-origin',
				headers: {
					'Authorization': jwtToken,
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken
				}
			})
			.then(response => {
				if (response.ok) {
					Icookies.clearAllCookies();
					window.location.href = '/'; // Change the URL to your home page URL

				} else {
					throw new Error('Logout failed');
				}
			})
			.then(data => {
				console.log(data);
				Icookies.clearAllCookies();
				window.location.href = '/home'; // Change the URL to your home page URL
			})
			.catch(error => {
				console.error('Error:', error);
				// Handle API errors
			});
		});
	}
}

customElements.define('logout-form', LogoutForm);








