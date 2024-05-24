import gamer from "./gamerInfo.js"
import Icookies from "../cookie/cookie.js";
import Iuser from "../user/userInfo.js";


export default class pongSettingsForm extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
	}

	async connectedCallback(){
		const editSettings = document.createElement('div');
		editSettings.id = 'pong-settings';
		this.shadowRoot.appendChild(editSettings);
		await this.initGamerInfo();
		await this.initFormSubmit();

	}

	async initGamerInfo() {
		try {
			const data = await gamer.getGamerSettings();
			this.displaypongSettingsForm(data);
		} catch (error) {
			console.error('Error: initGamerInfo', error)
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

		<form id="settings-form" method="put" action="" class="container">
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="username">User</label>
			<div class="col-sm-3">
				<input type="text" class="form-control" placeholder="${data.user.userName}" disabled readonly>
			</div>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="first_name">Scene</label>
			<select class="form-control" id="scene" name="scene">
				<option value="P" ${data.scene === 'Playground' ? 'selected' : ''}>Playground</option>
				<option value="C" ${data.scene === 'Cornfield' ? 'selected' : ''}>Cornfield</option>
				<option value="D" ${data.scene === 'Dorm' ? 'selected' : ''}>Dorm</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">Ball</label>
			<select class="form-control" id="ball" name="ball">
				<option value="0" ${data.ball === 0 ? 'selected' : ''}>Type 0</option>
				<option value="1" ${data.ball === 1 ? 'selected' : ''}>Type 1</option>
				<option value="2" ${data.ball === 2 ? 'selected' : ''}>Type 2</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">Paddle</label>
			<select class="form-control" id="paddle" name="paddle">
				<option value="0" ${data.paddle === 0 ? 'selected' : ''}>Type 0</option>
				<option value="1" ${data.paddle === 1 ? 'selected' : ''}>Type 1</option>
				<option value="2" ${data.paddle === 2 ? 'selected' : ''}>Type 2</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">Table</label>
			<select class="form-control" id="table" name="table">
				<option value="0" ${data.table === 0 ? 'selected' : ''}>Type 0</option>
				<option value="1" ${data.table === 1 ? 'selected' : ''}>Type 1</option>
				<option value="2" ${data.table === 2 ? 'selected' : ''}>Type 2</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">Score</label>
			<select class="form-control" id="score" name="score">
				<option value="7" ${data.score === 7 ? 'selected' : ''}>7</option>
				<option value="11" ${data.score === 11 ? 'selected' : ''}>11</option>
				<option value="17" ${data.score === 17 ? 'selected' : ''}>17</option>
			</select>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start" for="last_name">PowerUps Enabled</label>
			<select class="form-control" id="powerups" name="powerups">
				<option value="True" ${data.powerups === true ? 'selected' : ''}>Yes</option>
				<option value="False" ${data.powerups === false ? 'selected' : ''}>No</option>
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

	async initFormSubmit() {
		const editSettings = this.shadowRoot.getElementById('settings-form'); // Use getElementById to find the form within the component
		const userId = await Iuser.getID();
		console.log(userId);

		if (!editSettings) {
			console.error('Could not find the settings form');
			return;
		}
		editSettings.addEventListener('submit', function(event) {
			event.preventDefault();
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');

			const formData = new FormData(editSettings);
			fetch(`api/pong/${userId}/`, {
				method: 'PUT',
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
					console.log('Something went wrong updating the settings');
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
