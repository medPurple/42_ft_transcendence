import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"

export default class pkmSettingsForm extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
	}

	async getusername(id) {
		
		const users = await Iuser.getAllUsers();
		let username = users.users.find(user => user.user_id === parseInt(id)).username;
		return username;

	}

	async connectedCallback(){
		const editSettings = document.createElement('div');
		editSettings.id = 'pkm-settings';
		this.shadowRoot.appendChild(editSettings);
		await this.initGamerInfo();
		await this.initFormSubmit();

	}

	async initGamerInfo() {
		try {
			const id = await Iuser.getID();
			const username = await this.getusername(id);
			this.displaypongSettingsForm(id, username);
		} catch (error) {
			alert('You should be logged in to change the settings');
			// window.location.href = '/home';
		}
	}

	displaypongSettingsForm(id, username){
		let settingsContainer = this.shadowRoot.querySelector('#pkm-settings');
		settingsContainer.innerHTML = `

		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

		<style>
			.image-radio {
				display: none;
			}

			.image-label img {
				opacity: 0.6;
			}

			.image-radio:checked + .image-label img {
				opacity: 1;
			}
		</style>
		<div id="app-general-container" class="container d-flex flex-column justify-content-center align-items-center vh-100">
		<form id="settings-form" method="put" action="" class="container">
		<h4 class="text-center">Welcome <strong>${username}</strong>,<br> who are you playing today ?</h3>
		<div class="row mt-5">
			<div class="col mb-4">
				<input type="radio" id="radio_jessie" name="image-radio" class="image-radio">
				<label for="radio_jessie" class="image-label">
					<img src="./images/Persos/jessie_logo.png" alt="Image 1">
				</label>
			</div>
			<div class="col mb-4">
				<input type="radio" id="radio_james" name="image-radio" class="image-radio">
				<label for="radio_james" class="image-label">
					<img src="./images/Persos/james_logo.png" alt="Image 1">
				</label>
			</div>
		</div>

		<div class="row">
			<div class="col">
				<button type="submit" class="btn btn-dark">Go</button>
			</div>
		</div>
		</form>
		</div>
	`;
	}

	async initFormSubmit() {
		const editSettings = this.shadowRoot.getElementById('settings-form'); // Use getElementById to find the form within the component
		const userId = await Iuser.getID();

		if (!editSettings) {
			console.error('Could not find the settings form');
			return;
		}
		editSettings.addEventListener('submit', async  function(event) {
			event.preventDefault();
			const formData = new FormData(editSettings);
			const selectedRadio = editSettings.querySelector('input[name="image-radio"]:checked');
			if (selectedRadio){
				console.log(selectedRadio.id);
				let skin = null
				if (selectedRadio.id === 'radio_jessie') {
					skin = 1;
				} else if (selectedRadio.id === 'radio_james') {
					skin = 2;
				}
				const json = {
                    "userID": userId,
                    "player_skin": skin,
                }
				const response = await fetch(`api/pokemap/player/`, {
					method: 'PUT',
					body: JSON.stringify(json),
					headers: {
						'Content-Type': 'application/json',
						'Authorization': Icookies.getCookie('token'),
						'X-CSRFToken': Icookies.getCookie('csrftoken')
					},
					credentials: 'include',
				});
				console.log(response);
				if (response.ok) {
					console.log('Settings updated successfully');
					window.location.href = '/metaService';
				} else {
					console.log('Something went wrong updating the settings');
					alert('An error occurred submitting the settings. Please try again.');
				}
			}
		});
	}
}

customElements.define('pkmsettings-form', pkmSettingsForm);