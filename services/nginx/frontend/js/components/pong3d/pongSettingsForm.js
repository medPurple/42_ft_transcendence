import gamer from "./gamerInfo.js"
import Icookies from "../cookie/cookie.js";
import Iuser from "../user/userInfo.js";

export default class pongSettingsForm extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
	}

	async connectedCallback(){
		if (!Icookies.getCookie('token')) {
			alert('You should be logged in to change the settings');
			window.location.href = '/home';
		}
		const editSettings = document.createElement('div');
		editSettings.id = 'pong-settings';
		this.shadowRoot.appendChild(editSettings);const userId = await Iuser.getID();
		await this.initGamerInfo();
		await this.initFormSubmit();

	}

	async initGamerInfo() {
		try {
				const data = await gamer.getGamerSettings();
				this.displaypongSettingsForm(data);
		} catch (error) {
			alert('You should be logged in to change the settings');
			window.location.href = '/home';
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
		<h4 class="text-center">Welcome <strong>${data.user.userName}</strong>,<br> Do you want to change anything today ?</h4>
		<div class="row mb-4 mt-5">
			<label class="col-sm-3 col-form-label text-start text-center" for="scene">Scene</label>
			<div id="scene" name="scene">
				<input type="radio" class="image-radio" id="playground" name="scene" value="0" ${data.scene === 0 ? 'checked' : ''}>
				<label for="playground" class="image-label border border-dark rounded"><img src="imagePath/playground.png" alt="Playground"></label>
		
				<input type="radio" class="image-radio" id="cornfield" name="scene" value="1" ${data.scene === 1 ? 'checked' : ''}>
				<label for="cornfield" class="image-label border border-dark rounded"><img src="imagePath/cornfield.png" alt="Cornfield"></label>
		
				<input type="radio" class="image-radio" id="dormitory" name="scene" value="2" ${data.scene === 2 ? 'checked' : ''}>
				<label for="dormitory" class="image-label border border-dark rounded"><img src="imagePath/dormitory.png" alt="Dormitory"></label>
			</div>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start text-center" for="ball">Ball</label>
			<div id="ball" name="ball">
				<input type="radio" class="image-radio" id="gold" name="ball" value="0" ${data.ball === 0 ? 'checked' : ''}>
				<label for="gold" class="image-label border border-dark rounded" ><img src="imagePath/gold.png" alt="Gold"></label>
		
				<input type="radio" class="image-radio" id="silver" name="ball" value="1" ${data.ball === 1 ? 'checked' : ''}>
				<label for="silver" class="image-label border border-dark rounded" ><img src="imagePath/silver.png" alt="Silver"></label>
		
				<input type="radio" class="image-radio" id="diamond" name="ball" value="2" ${data.ball === 2 ? 'checked' : ''}>
				<label for="diamond" class="image-label border border-dark rounded" ><img src="imagePath/diamond.png" alt="Diamond"></label>
			</div>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start text-center" for="paddle">Paddle</label>
			<div id="paddle" name="paddle">
				<input type="radio" class="image-radio" id="guardA" name="paddle" value="0" ${data.paddle === 0 ? 'checked' : ''}>
				<label for="guardA" class="image-label border border-dark rounded" ><img src="imagePath/guardA.png" alt="Guard A"></label>
		
				<input type="radio" class="image-radio" id="guardB" name="paddle" value="1" ${data.paddle === 1 ? 'checked' : ''}>
				<label for="guardB" class="image-label border border-dark rounded" ><img src="imagePath/guardB.png" alt="Guard B"></label>
		
				<input type="radio" class="image-radio" id="playerA" name="paddle" value="2" ${data.paddle === 2 ? 'checked' : ''}>
				<label for="playerA" class="image-label border border-dark rounded" ><img src="imagePath/playerA.png" alt="Player A"></label>
		
				<input type="radio" class="image-radio" id="playerB" name="paddle" value="3" ${data.paddle === 3 ? 'checked' : ''}>
				<label for="playerB" class="image-label border border-dark rounded" ><img src="imagePath/playerB.png" alt="Player B"></label>
		
				<input type="radio" class="image-radio" id="boss" name="paddle" value="4" ${data.paddle === 4 ? 'checked' : ''}>
				<label for="boss" class="image-label border border-dark rounded" ><img src="imagePath/boss.png" alt="Boss"></label>
			</div>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start text-center" for="table">Table</label>
			<div id="table" name="table">
				<input type="radio" class="image-radio" id="metal" name="table" value="0" ${data.table === 0 ? 'checked' : ''}>
				<label for="metal" class="image-label border border-dark rounded" ><img src="imagePath/metal.png" alt="Metal"></label>
		
				<input type="radio" class="image-radio" id="concrete" name="table" value="1" ${data.table === 1 ? 'checked' : ''}>
				<label for="concrete" class="image-label border border-dark rounded" ><img src="imagePath/concrete.png" alt="Concrete"></label>
		
				<input type="radio" class="image-radio" id="wooden" name="table" value="2" ${data.table === 2 ? 'checked' : ''}>
				<label for="wooden" class="image-label border border-dark rounded" ><img src="imagePath/wooden.png" alt="Wooden"></label>
			</div>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start text-center" for="score">Points</label>
			<div id="score" name="score">
				<input type="radio" class="image-radio" id="points7" name="score" value="7" ${data.score === 7 ? 'checked' : ''}>
				<label for="points7" class="image-label border border-dark rounded" ><img src="imagePath/sever.png" alt="Seven"></label>
		
				<input type="radio" class="image-radio" id="points11" name="score" value="11" ${data.score === 11 ? 'checked' : ''}>
				<label for="points11" class="image-label border border-dark rounded"><img src="imagePath/eleven.png" alt="eleven"></label>
		
				<input type="radio" class="image-radio" id="points17" name="score" value="17" ${data.score === 17 ? 'checked' : ''}>
				<label for="points17" class="image-label border border-dark rounded" ><img src="imagePath/seventeen.png" alt="seventeen"></label>
			</div>
		</div>
		<div class="row mb-4">
			<label class="col-sm-3 col-form-label text-start text-center" for="powerups">PowerUps Enabled</label>
			<div id="powerups" name="powerups">
				<input type="radio" class="image-radio" id="powerupsTrue" name="powerups" value="True" ${data.powerups === true ? 'checked' : ''}>
				<label for="powerupsTrue" class="image-label border border-dark rounded" ><img src="imagePath/yes.png" alt="Yes"></label>
		
				<input type="radio" class="image-radio" id="powerupsFalse" name="powerups" value="False" ${data.powerups === false ? 'checked' : ''}>
				<label for="powerupsFalse" class="image-label border border-dark rounded" ><img src="imagePath/no.png" alt="No"></label>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<button type="submit" class="btn btn-dark">Save changes</button>
			</div>
		</div>
		</form>
		</div>
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
