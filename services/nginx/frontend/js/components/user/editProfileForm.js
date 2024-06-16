import Iuser from "./userInfo.js";
import Icookies from "../cookie/cookie.js";

export default class editProfileForm extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
	}

	async connectedCallback(){
		const editProfile = document.createElement('div');
		editProfile.id = 'edit-profile';
		this.shadowRoot.appendChild(editProfile);
		await this.initUserInfo();
		this.initFormSubmit();

	}

	async initUserInfo() {
		try {
			const data = await Iuser.getAllUserInfo();
			if (data && data.user) {
                this.displayEditProfileForm(data);
            } else {
                console.error('Données utilisateur manquantes ou incorrectes');
            }
		} catch (error) {
			console.error('Error:', error)
		}
	}

	displayEditProfileForm(data){
		let editProfileContainer = this.shadowRoot.querySelector('#edit-profile');
		editProfileContainer.innerHTML = `

		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

		<div id="app-general-container">
		<div id="alert-container"></div>
		<form id="edit-profile-form" method="post" action="" class="container">
			<div class="row mb-4">
				<label class="col-sm-3 col-form-label text-start" for="profile_picture">Profile Picture</label>
				<div class="col-sm-9">
					<input type="file" class="form-control" name="profile_picture" accept="images/*" />
				</div>
			</div>
			<div class="row mb-4">
				<label class="col-sm-3 col-form-label text-start" for="username">Username</label>
				<div class="col-sm-9">
					<input type="text" class="form-control" id="username" name="username" value="${data.user.username}">
				</div>
			</div>
			<div class="row mb-4">
				<label class="col-sm-3 col-form-label text-start" for="first_name">First Name</label>
				<div class="col-sm-9">
					<input type="text" class="form-control" id="first_name" name="first_name" value="${data.user.first_name}">
				</div>
			</div>
			<div class="row mb-4">
				<label class="col-sm-3 col-form-label text-start" for="last_name">Last Name</label>
				<div class="col-sm-9">
					<input type="text" class="form-control" id="last_name" name="last_name" value="${data.user.last_name}">
				</div>
			</div>
			<div class="row mb-4">
				<label class="col-sm-3 col-form-label text-start" for="email">Email</label>
				<div class="col-sm-9">
					<input type="email" class="form-control" id="email" name="email" value="${data.user.email}">
				</div>
			</div>
			<div class="row mb-4">
				<label class="col-sm-3 col-form-label text-start" for="is_2fa">Enable 2FA</label>
				<div class="col-sm-9">
					<input type="checkbox" class="form-check-input" id="is_2fa" name="is_2fa" ${data.user.is_2fa ? 'checked' : ''}>
				</div>
			</div>

			<div class="row">
				<div class="col-sm-3"></div>
				<div class="col-sm-9">
					<button type="submit" class="btn btn-dark">Save changes</button>
				</div>
			</div>
		</form>
		</div>

		`;
	}


	showAlert(message, type = 'danger') {
		const alertContainer = this.shadowRoot.getElementById('alert-container');
		alertContainer.innerHTML = `
			<div class="alert alert-${type} alert-dismissible fade show" role="alert">
				${message}
			</div>`;

	}

	validateForm(formData) {
		// Get the form data
		const username = formData.get('username');
		const img = formData.get('profile_picture');


		// Check if password is not similar to username
		if (!/^[a-zA-Z]+$/.test(username)) {
			this.showAlert('Username should contain only alphanumeric characters');
			return false;
		}

		if (img && img.size > 1048576) {
			this.showAlert('Image too large');
			return false;
		}

		return true;
	}

	initFormSubmit() {
		const editForm = this.shadowRoot.getElementById('edit-profile-form'); // Use getElementById to find the form within the component
		const showAlert = this.showAlert.bind(this);
		const validateForm = this.validateForm.bind(this);
		editForm.addEventListener('submit', async function(event) {
			event.preventDefault();

			try {
				const formData = new FormData(editForm);
				if (!validateForm(formData)) {
					return;
				}

				let jwtToken = Icookies.getCookie('token');
				let csrfToken = Icookies.getCookie('csrftoken');
				const response = await fetch('/api/profiles/edit-profile/', {
					method: 'POST',
					body: formData,
					headers: {
						'Authorization': jwtToken,
						'X-CSRFToken': csrfToken
					}
				});
				const data = await response.json();
				if (data.success) {
					window.location.href = '/home'; // Change the URL to your home page URL

				} else {
					// Display validation errors or any other error message
					showAlert('Update profile failed. Please check the form and try again.');
					return;
				}

			} catch(error) {
				showAlert('Error:', error);
				// Handle API errors
			}
		});
	}
}

customElements.define('edit-profile-form', editProfileForm);
