import Icookies from "../cookie/cookie.js"

export default class deleteAccountForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `
			<form id="delete-account-form" method="delete" action="">
				<p> Would you really delete your account ?</p>
				<button type="submit" class="button"> Yes </button>
					<form>
						<input type="button" value="No" onclick="history.back()">
					</form>
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
