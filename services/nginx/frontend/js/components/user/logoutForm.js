import Icookies from "../cookie/cookie.js"

export default class LogoutForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	render() {
		const button = document.createElement('button');
		button.setAttribute('id', 'logout-button');
		button.setAttribute('class', 'button');
		button.textContent = 'Logout';
		this.shadowRoot.innerHTML = '';
		this.shadowRoot.appendChild(button);
	}

	connectedCallback() {
		this.render(); // Render the component
		this.shadowRoot.getElementById('logout-button').addEventListener('click', this.handleLogout.bind(this));
	}

	async handleLogout(event) { // Rendre la méthode async
		event.preventDefault();
		let jwtToken = Icookies.getCookie('token');
		let csrfToken = Icookies.getCookie('csrftoken');
		console.log(jwtToken);
		console.log("CSRF");
		console.log(csrfToken);

		try {
			const response = await fetch('/api/profiles/logout_user/', {
				method: 'POST',
				headers: {
					'Authorization': jwtToken,
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken
				}
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				Icookies.clearAllCookies();
				window.location.href = '/'; // Change the URL to your home page URL
			} else {
				throw new Error('Logout failed');
			}
		} catch (error) {
			console.error('Error:', error);
			// Handle API errors
		}
	}
}

customElements.define('logout-form', LogoutForm);

