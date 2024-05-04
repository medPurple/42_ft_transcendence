import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";
import {WaitingScreen} from "./WaitingScreen.js"


class Matchmaking {

	async pongMatchmaking() {
		let id = await Iuser.getID();
		console.log("id is : " + id);
		fetch('/api/queue/', {
			method: 'POST',
			headers: {
				'X-CSRFToken': Icookies.getCookie('csrftoken'),
				'Authorization': Icookies.getCookie('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
						"userID": id,
						"game": "pong_multiplayer"
					})
		})
		.then(response => response.json())
		.then(data => {
			if (data.position) {
				console.log("Added to queue for pong multiplayer");
				return;
			} else {
				alert('No such user');
			}
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}

	async tournamentMatchmaking() {
		let id = await Iuser.getID();
		console.log("id is : " + id);
		fetch('/api/queue/', {
			method: 'POST',
			headers: {
				'X-CSRFToken': Icookies.getCookie('csrftoken'),
				'Authorization': Icookies.getCookie('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
						"userID": id,
						"game": "pong_tournament"
					})
		})
		.then(response => response.json())
		.then(data => {
			if (data.position) {
				console.log("Added to queue for pong tournament");
				return;
			} else {
				alert('No such user');
			}
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}

	async pkmMatchmaking() {
		let id = await Iuser.getID();
		console.log("id is : " + id);
		fetch('/api/queue/', {
			method: 'POST',
			headers: {
				'X-CSRFToken': Icookies.getCookie('csrftoken'),
				'Authorization': Icookies.getCookie('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
						"userID": id,
						"game": "pkm_multiplayer"
					})
		})
		.then(response => response.json())
		.then(data => {
			if (data.position) {
				console.log("Added to queue for pokemon multiplayer");
				new WaitingScreen('pkm_multiplayer');
				return;
			} else {
				alert('No such user');
			}
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}
}

// Pour utiliser cette classe, vous pouvez créer une nouvelle instance et appeler les méthodes appropriées
export class MatchmakingButtons {


	constructor(matchmaking) {
		this.matchmaking = matchmaking;
	}

	multipongButton(){
		const multipongbutton = document.createElement('input');
		multipongbutton.type = 'radio';
		multipongbutton.name = 'game';

		multipongbutton.id = 'pong_multiplayer';
		multipongbutton.value = 'Pong Versus';
		multipongbutton.classList.add('queue-checkbox');

		const multiponglabel = document.createElement('label');
		multiponglabel.htmlFor = 'pong_multiplayer';
		multiponglabel.innerText = 'Pong Versus';
		multiponglabel.classList.add('queue-label');

		const container = document.createElement('div');
		container.classList.add('queue-container');
		container.appendChild(multipongbutton);
		container.appendChild(multiponglabel);

		return container;
	}

	multipkmButton(){
		const multipkmbutton = document.createElement('input');
		multipkmbutton.type = 'radio';
		multipkmbutton.id = 'pkm_multiplayer';
		multipkmbutton.name = 'game';

		multipkmbutton.value = 'Pokemon Versus';
		multipkmbutton.classList.add('queue-checkbox');

		const multipkmlabel = document.createElement('label');
		multipkmlabel.htmlFor = 'pkm_multiplayer';
		multipkmlabel.innerText = 'Pokemon Versus';
		multipkmlabel.classList.add('queue-label');

		const container = document.createElement('div');
		container.classList.add('queue-container');
		container.appendChild(multipkmbutton);
		container.appendChild(multipkmlabel);
		return container;
	}

	tournapongButton(){
		const tournapongbutton = document.createElement('input');
		tournapongbutton.type = 'radio';
		tournapongbutton.name = 'game';

		tournapongbutton.id = 'tournapong';
		tournapongbutton.value = 'Pong Tournament';
		tournapongbutton.classList.add('queue-checkbox');

		const tournaponglabel = document.createElement('label');
		tournaponglabel.htmlFor = 'tournapong';
		tournaponglabel.innerText = 'Pong Tournament';
		tournaponglabel.classList.add('queue-label');

		const container = document.createElement('div');
		container.classList.add('queue-container');
		container.appendChild(tournapongbutton);
		container.appendChild(tournaponglabel);
		return container;
	}

	matchmakingTitle(){
		const matchmakingtitle = document.createElement('p');
		matchmakingtitle.innerText = 'Select the game you want to play';
		matchmakingtitle.classList.add('matchmaking-title');
		return matchmakingtitle;

	}

	matchmakingStartButton(){
		const startbutton = document.createElement('button');
		startbutton.innerText = 'PLAY';
		startbutton.classList.add('queue-button');
		startbutton.onclick = async () => {
			const selectedGame = document.querySelector('input[name="game"]:checked');
			if (selectedGame) {
				this.removeButtons();
				if (selectedGame.value == 'Pong Versus') {
					// this.matchmaking.pongMatchmaking();
					new WaitingScreen('pong_multiplayer');
				} else if (selectedGame.value == 'Pong Tournament') {
					// this.matchmaking.tournamentMatchmaking();
					new WaitingScreen('pong_tournament');
				} else if (selectedGame.value == 'Pokemon Versus') {
					await this.matchmaking.pkmMatchmaking();
				}

			}
		}
		return startbutton;
	}

	buttonsCreation() {
		const matchmakingdiv = document.createElement('div');
		matchmakingdiv.classList.add('matchmakingdiv');


			const titleDiv = document.createElement('div');
			titleDiv.classList.add('title-div');
			titleDiv.appendChild(this.matchmakingTitle());

			const radioButtonsDiv = document.createElement('div');
			radioButtonsDiv.classList.add('radio-buttons');
			radioButtonsDiv.appendChild(this.multipongButton());
			radioButtonsDiv.appendChild(this.tournapongButton());
			radioButtonsDiv.appendChild(this.multipkmButton());

			const startButtonDiv = document.createElement('div');
			startButtonDiv.classList.add('button-div');
			startButtonDiv.appendChild(this.matchmakingStartButton());

			matchmakingdiv.appendChild(titleDiv);
			matchmakingdiv.appendChild(radioButtonsDiv);
			matchmakingdiv.appendChild(startButtonDiv);
		

		// document.body.appendChild(matchmakingdiv);
		return matchmakingdiv;
	}

	removeButtons() {
		const matchmakingdiv = document.querySelector('.matchmakingdiv');
		matchmakingdiv.remove();
    }
}

const matchmaking = new Matchmaking();
export { matchmaking };
