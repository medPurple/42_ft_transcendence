import Icookies from "../cookie/cookie.js"

export default class code2FA extends HTMLElement {
	constructor(){
	super(); // Always call super first in constructor
	this.innerHTML = `
	<div id="alert-container"></div>
	<form method="post" action="" class="container">
		<div class="mb-4">
			<h5>Two Factor Authentication</h5>
			<h6>A verification code has been sent to your email.</h6>
		</div>
		<div class="mb-4">
			<input type="text" id="otp-input" class="form-control" placeholder="Enter code confirmation">
		</div>
		<button type="submit" id="submit-btn" class="btn btn-dark">Confirm</button>
	</form>
	`;
	}

	showAlert(message, type = 'danger') {
	const alertContainer = document.getElementById('alert-container');
	alertContainer.innerHTML = `
		<div class="alert alert-${type} alert-dismissible fade show" role="alert">
			${message}
		</div>`;
	}

	connectedCallback() {
	const submitBtn = document.getElementById('submit-btn');
	const otpInput = document.getElementById('otp-input');
	const showAlert = this.showAlert.bind(this);

	submitBtn.addEventListener('click', function(event) {
		event.preventDefault();

		const otp = otpInput.value;
		// const csrfToken = '{{ csrf_token }}'; // Ensure you have the CSRF token

		fetch('/api/profiles/login_2FA/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': Icookies.getCookie('csrftoken')
			},
			body: JSON.stringify({ otp: otp })
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				Icookies.setCookie('token', data.token, 90);
				window.location.href = '/home';
			} else {
				// Display validation errors or any other error message
				showAlert('Wrong code. Please check the code and try again.');
			}
		})
		.catch(error => {
			console.error('Error:', error);
			// Handle API errors
		});
	});
	}
}

customElements.define('code-form', code2FA);
