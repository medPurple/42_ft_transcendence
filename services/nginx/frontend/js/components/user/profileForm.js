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
		
		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

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
