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

		<div class="d-flex justify-content-center">
			<div class="card text-center" style="width: 20rem;">
				<img src="data:image/jpeg;base64,${profilePictureData}" class="card-img-top profile-pic" alt="Profile Picture">
				<div class="card-body">
					<h5 class="card-title">${data.user.username}</h5>
					<p class="card-text">He is evaluating la Pat Patrouille</p>
				</div>
				<ul id="profile-content" class="list-group list-group-flush">
					<li class="list-group-item">${data.user.first_name}</li>
					<li class="list-group-item">${data.user.last_name}</li>
					<li class="list-group-item">${data.user.email}</li>
					<li class="list-group-item">${data.user.is_online}</li>
					<li class="list-group-item">
					<div class="container text-center">
						<div class="row">
						  <div class="col">Game wins</div>
						  <div class="col">Game losses</div>
						</div>
						<div class="row">
							<div class="col">3</div>
							<div class="col">2</div>
						</div>
						<div class="row">
							<div class="progress" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
								<div class="progress-bar bg-success" style="width: 50%">One more round.</div>
							</div>
							<div class="progress" role="progressbar" aria-label="Danger example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
								<div class="progress-bar bg-danger" style="width: 100%">100%</div>
							</div>
						</div>
					<a href="/history" class="card-link" data-link>see games details</a></li>
				</ul>
				<div class="card-body">
					<a href="/edit-profile" class="card-link" data-link >Edit Profile</a><br>
					<a href="/update-password" class="card-link" data-link>Update password</a><br>
					<a href="/friends" class="card-link" data-link>See my friends</a><br>
				</div>
				<div class="card-body">
					<a href="/delete-account" class="btn btn-light">Delete Profile</a>
				</div>
				<div class="card-footer text-body-secondary">
					42 School
				</div>
			</div>
		</div>

		`;
	}
}

customElements.define('profile-form', profileForm);
