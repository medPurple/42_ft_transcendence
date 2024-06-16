import Iuser from "./userInfo.js"


export default class profileForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {

    const profileContainer = document.createElement('div');
    profileContainer.id = 'profile-container';

    this.shadowRoot.appendChild(profileContainer);
    await this.initUserInfo();

  }
  async initUserInfo() {
    try {
      const data = await Iuser.getAllUserInfo();
      let statut = this.checkStatut(data.user.is_online);
      let profilePictureData = data.user.profile_picture_data;
      this.displayUserProfile(data, profilePictureData, statut);

    } catch (error) {
      console.error('Error:', error)
    }
  }

  checkStatut(is_online) {
    if (is_online === 0)
      return { text: "Offline", color: "grey" };
    else if (is_online === 1)
      return { text: "Online", color: "green" };
    else
      return { text: "Playing", color: "yellow" };
  }


  displayUserProfile(data, profilePictureData, statut) {
    let profileContainer = this.shadowRoot.querySelector('#profile-container');
    profileContainer.innerHTML = `

		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

		<div class="d-flex justify-content-center">
			<div class="card text-center" style="width: 21rem;">
				<img src="data:image/jpeg;base64,${profilePictureData}" class="card-img-top profile-pic" alt="Profile Picture">
				<div class="card-body">
					<h5 class="card-title"><strong>${data.user.username}</strong></h5>
					<h6 class="card-text">... thinks this is an outstanding project</h6>
				</div>
				<ul id="profile-content" class="list-group list-group-flush">
					<li class="list-group-item"><strong>First name</strong><br>${data.user.first_name}</li>
					<li class="list-group-item"><strong>Last Name</strong><br>${data.user.last_name}</li>
					<li class="list-group-item"><strong>Email</strong><br>${data.user.email}</li>
					<li class="list-group-item">42 School</li>
				</ul>
				<div class="card-body">
				<a href="/statistics" class="card-link" data-link>My stats</a><br>
					<a href="/edit-profile" class="card-link" data-link >Edit profile</a><br>
					<a href="/update-password" class="card-link" data-link>Change password</a>
				</div>
				<div class="card-footer text-body-secondary">
				<h6> ${statut.text} <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${statut.color}; margin-left: 5px;"></span></h6>
				</div>
			</div>
		</div>

		`;
  }
}

customElements.define('profile-form', profileForm);
