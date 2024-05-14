import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";


export class MatchmakingButtons {


	constructor() {
		this.matchsocket = new WebSocket("wss://localhost:4430/api/wsqueue/");
		this.matchmakingsocketaction();
		this.status = null;
		this.timer = null;
		this.game = null;
	}

	matchmakingsocketaction() {
		this.matchsocket.onopen = (event) => {
			console.log("Matchmaking socket opened.");
		}

		this.matchsocket.onclose = (event) => {
			console.log("Matchmaking socket closed.", event.data);
		}
		
		this.matchsocket.onmessage = (event) => {
			console.log("Matchmaking socket message: ", event.data);
			const data = JSON.parse(event.data);
			this.status = data.status;
			this.timer = data.timer;
			this.game = data.game;
		}

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

	displayWaitingScreen(){
		const waitingScreen = document.createElement('div');
		waitingScreen.classList.add('waiting-screen');

		let waitingText = document.createElement('p');
		waitingText.classList.add('waiting-text');

		let timertext = document.createElement('p');
		timertext.classList.add('waiting-timer');

		let gametext = document.createElement('p');
		gametext.classList.add('waiting-game');

		let cancelbutton = document.createElement('button');
		cancelbutton.classList.add('cancel-button');
		cancelbutton.innerText = 'CANCEL';


		waitingScreen.appendChild(waitingText);
		waitingScreen.appendChild(timertext);
		waitingScreen.appendChild(gametext);
		waitingScreen.appendChild(cancelbutton);
		waitingScreen.appendChild(waitingText);

		return {
			waitingScreen: waitingScreen,
			waitingText: waitingText,
			timertext: timertext,
			gametext: gametext,
			cancelbutton: cancelbutton
		};
	}

	timerCalculation(){
		let time = new Date(this.timer);
        let now = new Date(); // Date actuelle
        let elapsedTimeMillis = now - time; // Temps écoulé en millisecondes
        return (Math.floor(elapsedTimeMillis / 1000));
	}

	waitingScreen(){
		const elements = this.displayWaitingScreen();
		const waitingText = elements.waitingText;
		if (this.status === 'found') {
			waitingText.innerText = 'Match found!';
		}
		else if (this.status === 'waiting') {
			waitingText.innerText = 'Waiting for players...';
		}
		const timertext = elements.timertext;
		timertext.innerText = `Time remaining: ${this.timerCalculation()}`;
		const gametext = elements.gametext;
		gametext.innerText = `Game: ${this.game}`;
	}

	matchmakingStartButton(){
		const startbutton = document.createElement('button');
		startbutton.innerText = 'PLAY';
		startbutton.classList.add('queue-button');
		startbutton.onclick = async () => {
			const selectedGame = document.querySelector('input[name="game"]:checked');
			if (selectedGame) {
				const msg = {
					"action": "queue_add",
					"game": selectedGame.value,
					"id": await Iuser.getID(),
				}
				this.matchsocket.send(JSON.stringify(msg));
				this.removeButtons();
				const waitingpage = this.displayWaitingScreen()
				return waitingpage;
				
			}
		}
		return startbutton;
	}
	
	
}