
import Icookies from "../cookie/cookie.js";

export default class updatePasswordForm extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `
			<form id="update-password-form" method="post" action="/api/profiles/update-password">
				<label for="new_password"> New Password:</label>
				<input type="password" name="new_password1">
				<label for="confirm_password"> Confirm Password:</label>
				<input type="password" name="new_password2">
				<button type="submit" class="button">Save changes</button>
			</form>
		`;
	}
	connectedCallback() {
		const pwdForm = this.shadowRoot.getElementById('update-password-form');
		pwdForm.addEventListener('submit', function(event) {
			event.preventDefault();
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');
			const formData = new FormData(pwdForm);
			fetch('api/profiles/update-password/', {
				method: 'POST',
				body: formData,
				headers: {
					'Authorization': jwtToken,
					'X-CSRFToken': csrfToken
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					console.log('Password updated successfully');
					window.location.href = '/';
				} else {
					alert('An error occurred. Please try again.');
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
		});
	}
}

customElements.define('update-password-form', updatePasswordForm);
