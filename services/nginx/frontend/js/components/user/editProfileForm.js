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
			// Access other properties from data here
			let profilePictureData = data.user.profile_picture_data;
			console.log(data.user.profile_picture);
			this.displayEditProfileForm(data);
		} catch (error) {
			console.error('Error:', error)
		}
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
						window.location.href = '/home'; // Change the URL to your home page URL

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
}

customElements.define('edit-profile-form', editProfileForm);
