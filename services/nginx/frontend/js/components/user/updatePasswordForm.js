
import Icookies from "../cookie/cookie.js";

export default class updatePasswordForm extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `

		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

		<div id="app-general-container">
		<div id="alert-container"></div>
			<form id="update-password-form" method="post" action="/api/profiles/update-password" class="container" style="width: 21rem; padding: 18px;">
				<div class="mb-4">
					<input type="text" style="display:none;" name="username" autocomplete="username">
				</div>
				<div class="mb-4">
					<input type="password" class="form-control" name="password1" placeholder="Password" autocomplete="current-password" required>
				</div>
				<div class="mb-4">
					<input type="password" class="form-control" name="password2" placeholder="New Password" autocomplete="new-password" required>
				</div>
				<div class="mb-4">
					<button type="submit" class="btn btn-dark">Save changes</button>
				</div>
			</form>
		</div>
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
					window.location.href = '/home';
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
