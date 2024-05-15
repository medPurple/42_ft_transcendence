import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";


export class MatchmakingButtons {


	constructor() {
		this.matchsocket = new WebSocket("wss://localhost:4430/api/wsqueue/");
		this.matchmakingsocketaction();
		this.maindiv = document.createElement('div');
		this.maindiv.classList.add('main-matchmaking-div');
		this.status = null;
		this.timer = 0;
		this.game = null;
	}

	matchmakingsocketaction() {
		this.matchsocket.onopen = (event) => {
			console.log("Matchmaking socket opened.");
		}

		this.matchsocket.onclose = (event) => {
			console.log("Matchmaking socket closed.", event.data);
			this.maindiv.remove();
		}
		
		this.matchsocket.onmessage = async (event) => {
			console.log("Matchmaking socket message: ", event.data);
			const data = JSON.parse(event.data);
			this.status = data.status;
			this.timer = data.waitingTime;
			this.game = data.game;
			this.updateData();
			const msg = {
				"action": "queue_status",
				"game": this.game,
				"id": await Iuser.getID(),
			}
			this.matchsocket.send(JSON.stringify(msg));
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
				this.maindiv.appendChild(this.waitingPage());
				// return waitingpage;
				
			}
		}
		return startbutton;
	}
	
	timerCalculation(){

		let time = new Date(this.timer);
		if (isNaN(time.getTime())) {
			// this.timer was not a valid date
			console.error('Invalid date:', this.timer);
			return;
		}
		let now = new Date(); // Date actuelle
		let elapsedTimeMillis = now - time; // Temps écoulé en millisecondes
		return (Math.floor(elapsedTimeMillis / 1000));
	}

	waitingPage(){
		const waitingpage = document.createElement('div');
		waitingpage.classList.add('waiting-page');

		const waitingtitle = document.createElement('p');
		waitingtitle.classList.add('waiting-title');
		waitingtitle.innerText = "status = " + this.status;

		const timer = document.createElement('p');
		timer.classList.add('timer');
		timer.innerText = "timer : " + this.timerCalculation();

		const game = document.createElement('p');
		game.classList.add('game');
		game.innerText = "game : " + this.game;

		const cancelbutton = document.createElement('button');
		cancelbutton.classList.add('cancel-button');
		cancelbutton.innerText = 'Cancel';
		cancelbutton.onclick = () => {
			const msg = {
				"action": "queue_remove",
				"game": this.game,
				"id": Iuser.getID(),
			}
			this.matchsocket.send(JSON.stringify(msg));
			this.removeWaitingPage();
		}

		waitingpage.appendChild(waitingtitle);
		waitingpage.appendChild(timer);
		waitingpage.appendChild(game);
		waitingpage.appendChild(cancelbutton);
	
		return waitingpage;
	}

	removeWaitingPage(){
		const waitingpage = document.querySelector('.waiting-page');
		waitingpage.remove();
		this.maindiv.appendChild(this.buttonsCreation());
	}

	updateData(){
		const waitingpage = document.querySelector('.waiting-page');
		const waitingtitle = document.querySelector('.waiting-title');
		const timer = document.querySelector('.timer');
		const game = document.querySelector('.game');

		waitingtitle.innerText = "status = " + this.status;
		const time = this.timerCalculation();
		if (time > 60){
			timer.innerText = "timer : " + Math.floor(time/60) + "m " + time % 60 + "s";
		}
		else {
			timer.innerText = "timer : " + time;
		}
		game.innerText = "game : " + this.game;
	}

	mainMatchmakingDiv(){
		this.maindiv.appendChild(this.buttonsCreation());
		return this.maindiv;
	}	
}

