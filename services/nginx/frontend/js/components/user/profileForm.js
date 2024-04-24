import Iuser from "./userInfo.js"


export default class profileForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	async connectedCallback() {

		const profileContainer = document.createElement('div');
		profileContainer.id = 'profile-container';

		// Ajouter les éléments à l'ombre
		this.shadowRoot.appendChild(profileContainer);
		await this.initUserInfo();

    }
	async initUserInfo() {
		try {
			const data = await Iuser.getAllUserInfo();
			// Access other properties from data here
			let profilePictureData = data.user.profile_picture_data;
			this.displayUserProfile(data, profilePictureData);

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
			</div>
		`;
	}
}

customElements.define('profile-form', profileForm);
