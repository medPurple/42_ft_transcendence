import Iuser from "./userInfo.js"
import Icookies from "../cookie/cookie.js"

export default class profileForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	async connectedCallback() {

		const profileContainer = document.createElement('div');
		profileContainer.id = 'profile-container';
		const editProfile = document.createElement('div');
		editProfile.id = 'edit-profile';
		editProfile.style.display = 'none'; // Assurez-vous qu'il est initialement masqué
		const updatePassword = document.createElement('div');
		updatePassword.id = 'password-container';
		updatePassword.style.display = 'none';
		// Ajouter les éléments à l'ombre
		this.shadowRoot.appendChild(profileContainer);
		this.shadowRoot.appendChild(editProfile);
		this.shadowRoot.appendChild(updatePassword);
		await this.initUserInfo();
		this.initFormSubmit();
		this.initChangePasswordSubmit();
    }

	async initUserInfo() {
		try {
			const data = await Iuser.getAllUserInfo();
			// Access other properties from data here
			let profilePictureData = data.user.profile_picture_data;
			console.log(data.user.profile_picture);
			this.displayUserProfile(data, profilePictureData);
			this.displayEditProfileForm(data);
			this.initEditProfileButton();
			this.displayUpdatePassword();
		} catch (error) {
			console.error('Error:', error)
		}
	}

	displayUserProfile(data, profilePictureData){
		let profileContainer = this.shadowRoot.querySelector('#profile-container');
		profileContainer.innerHTML = `
			<div id="profile-content">
				<img src="data:image/jpeg;base64,${profilePictureData}" alt="Profile Picture" class="profile-pic">
				<p><strong>Username:</strong> ${data.user.username}</p>
				<p><strong>Email:</strong> ${data.user.email}</p>
				<p><strong>First Name:</strong> ${data.user.first_name}</p>
				<p><strong>Last Name:</strong> ${data.user.last_name}</p>
				<p><strong>Online:</strong> ${data.user.is_online}</p>
				<button id="edit-profile-button" type="button" >Edit Profile</button>
				<button id="update-password-button" type="button" >Update password</button>
				<button id="see-friends-button" type="button">See my friends</button>
				<button id="delete-account-button" type="button">Delete my account</button>
			</div>
		`;
	}

	displayEditProfileForm(data){
		let editProfileContainer = this.shadowRoot.querySelector('#edit-profile');
		editProfileContainer.innerHTML = `
			<form id="edit-profile-form" method="post" action="">
				<label for="profile_picture">Profile Picture:</label>
				<input type="file" name="profile_picture" accept="images/*" />
				<label for="username">Username:</label>
				<input type="text" id="username" name="username" value="${data.user.username}">
				<label for="email">Email:</label>
				<input type="email" id="email" name="email" value="${data.user.email}">
				<label for="first_name">First Name:</label>
				<input type="text" id="first_name" name="first_name" value="${data.user.first_name}">
				<label for="last_name">Last Name:</label>
				<input type="text" id="last_name" name="last_name" value="${data.user.last_name}">
				<button type="submit" class="button">Save changes</button>
			</form>
		`;
	}

	displayUpdatePassword(){
		let editPasswordContainer = this.shadowRoot.querySelector('#password-container');
		editPasswordContainer.innerHTML = `
			<form id="update-password-form" method="post" action="/api/profiles/update-password">
				<label for="new_password"> New Password:</label>
				<input type="password" name="new_password1">
				<label for="confirm_password"> Confirm Password:</label>
				<input type="password" name="new_password2">
				<button type="submit" class="button">Save changes</button>
			</form>
		`;
	}

	initEditProfileButton () {
		this.shadowRoot.querySelector('#edit-profile-button').addEventListener('click', () => {
			this.shadowRoot.querySelector('#profile-content').style.display = 'none';
			this.shadowRoot.querySelector('#edit-profile').style.display = 'block';

		});
		this.shadowRoot.querySelector('#update-password-button').addEventListener('click', () => {
			this.shadowRoot.querySelector('#profile-content').style.display = 'none';
			this.shadowRoot.querySelector('#password-container').style.display = 'block';
		});
	}

	initFormSubmit() {
		const editForm = this.shadowRoot.getElementById('edit-profile-form'); // Use getElementById to find the form within the component
		editForm.addEventListener('submit', function(event) {
			event.preventDefault();
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');
			const formData = new FormData(editForm);
			fetch('/api/profiles/edit-profile/', {
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
					console.log('Profile updated successfully');
					// Redirect to the home page
						window.location.href = '/'; // Change the URL to your home page URL

				} else {
					// Display validation errors or any other error message
					alert('An error occurred. Please try again.');
				}
			})
			.catch(error => {
				console.error('Error:', error);
				// Handle API errors
			});
		});
	}

	initChangePasswordSubmit() {
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

customElements.define('profile-form', profileForm);

