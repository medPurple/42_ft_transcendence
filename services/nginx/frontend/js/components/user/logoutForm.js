import Icookies from "../cookie/cookie.js"

export default class LogoutForm extends HTMLElement {
    constructor() {
        super();
        const link = document.createElement('a');
        link.setAttribute('id', 'logout-link');
        link.setAttribute('class', 'dropdown-item');
        link.textContent = 'log out';
        link.href = '#'; 
        this.appendChild(link);
    }

    connectedCallback() {
        const logoutLink = this.querySelector('#logout-link');
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();

            // Get the CSRF token from the cookie
            let jwtToken = Icookies.getCookie('token');
            let csrfToken = Icookies.getCookie('csrftoken');

            // Send the logout request to the Django API
            fetch('/api/profiles/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': jwtToken,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                }
            })
            .then(response =>response.json())
            .then(data => {
				if (data.success) {
                	console.log(data);
                	Icookies.clearAllCookies();
                	window.location.href = '/home'; // Change the URL to your home page URL
				} else {
					alert('An error occurred. Please try again.');

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







