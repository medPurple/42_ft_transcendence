import Iuser from "../user/userInfo.js";
import Icookies from "../cookie/cookie.js";

export default class pongSettingsForm extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
	}

	async connectedCallback(){
		const editSettings = document.createElement('div');
		editSettings.id = 'pong-settings';
		this.shadowRoot.appendChild(editSettings);
		await this.initUserInfo();
		this.initFormSubmit();

	}

	async initUserInfo() {
		try {
			const data = await Iuser.getAllUserInfo();
			this.displaypongSettingsForm(data);
		} catch (error) {
			console.error('Error: initUserInfo', error)
			alert('You should be logged in to change the settings');
			window.location.href = '/pongService';
		}
	}

	displaypongSettingsForm(data){
		let settingsContainer = this.shadowRoot.querySelector('#pong-settings');
		settingsContainer.innerHTML = `

		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

		<form id="settings-form" method="post" action="" class="container">
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="username">User</label>
			<div class="col-sm-3">
				<input type="text" class="form-control" placeholder="${data.user.username}" disabled readonly>
			</div>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="first_name">Scene</label>
			<select class="form-control" id="scene" name="scene" value="${settings.scene}">
				<option value="P">Playground</option>
				<option value="C">Cornfield</option>
				<option value="D">Dorm</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">Ball</label>
			<select class="form-control" id="ball" name="ball" value="${settings.ball}">
				<option value="0">Type 0</option>
				<option value="1">Type 1</option>
				<option value="2">Type 2</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">Paddle</label>
			<select class="form-control" id="paddle" name="paddle" value="${settings.paddle}">
				<option value="0">Type 0</option>
				<option value="1">Type 1</option>
				<option value="2">Type 2</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">Table</label>
			<select class="form-control" id="table" name="table" value="${settings.table}">
				<option value="0">Type 0</option>
				<option value="1">Type 1</option>
				<option value="2">Type 2</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">Score</label>
			<select class="form-control" id="score" name="score" value="${settings.score}">
				<option value="7">7</option>
				<option value="11">11</option>
				<option value="17">17</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">PowerUps Enabled</label>
			<select class="form-control" id="powerups" name="powerups" value="${settings.powerups}">
				<option value="True">Yes</option>
				<option value="False">No</option>
			</select>
		</div>

		<div class="row">
			<div class="col">
				<button type="submit" class="btn btn-dark">Save changes</button>
			</div>
		</div>
		</form>

	`;
	}

	initFormSubmit() {
		const editSettings = this.shadowRoot.getElementById('settings-form'); // Use getElementById to find the form within the component
		if (!editSettings) {
			console.error('Could not find the settings form');
			return;
		}
		editSettings.addEventListener('submit', function(event) {
			event.preventDefault();
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');
			const formData = new FormData(editSettings);
			fetch('/api/pong/', {
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
					console.log('Settings updated successfully');
						window.location.href = '/pongService';

				} else {
					alert('An error occurred submitting the settings. Please try again.');
				}
			})
			.catch(error => {
				console.error('Error initFormSubmit:', error);
			});
		});
	}
}

customElements.define('settings-form', pongSettingsForm);
