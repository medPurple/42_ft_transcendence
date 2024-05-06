import Icookies from "../cookie/cookie.js"

export default class deleteAccountForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `

		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

		<form id="delete-account-form" method="delete" action="" class="container">
			<div class="mb-4">
				<h5>Do you really want to delete your account?</h5>
			</div>
			<div class="mb-4">
				<button type="submit" class="btn btn-dark">Absolutely</button>
			</div>
			<div class="mb-4">
				<button type="submit" class="btn btn-outline-dark" onclick="history.back()">No, please take me back</button>
			</div>
		</form>
			
		`;
	}

	connectedCallback(){
		const deleteForm = this.shadowRoot.getElementById('delete-account-form');
		deleteForm.addEventListener('submit', function(event){
			event.preventDefault();
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');
			const formData = new FormData(deleteForm);
			fetch('api/profiles/delete-account/', {
				method: 'DELETE',
				body: formData,
				headers: {
					'Authorization': jwtToken,
					'X-CSRFToken': csrfToken
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.success){
					console.log('Account deleted successfully');
					Icookies.clearAllCookies();
					window.location.href = '/home';
				} else {
					alert('An error occurred. Please try again.')
				}
			})
			.catch(error => {
				console.error('Error:', error);
			})
		})
	}
}

customElements.define('delete-account-form', deleteAccountForm);
