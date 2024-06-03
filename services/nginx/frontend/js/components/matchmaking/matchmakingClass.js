import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";

class MatchmakingButtons {

	constructor() {
		this.maindiv = document.createElement('div');
		this.maindiv.classList.add('main-matchmaking-div');
		this.matchsocket = null;
		this.status = null;
		this.timer = 0;
	}

	matchmakingsocketaction() {
		this.matchsocket.onopen = (event) => {
			console.log("Matchmaking socket opened.");
		}

		this.matchsocket.onclose = (event) => {
			console.log("Matchmaking socket closed.", event.data);
			const msg = {
				"action": "queue_remove",
				"game": this.game,
				"id": Iuser.getID(),
			}
			this.matchsocket.send(JSON.stringify(msg));
			this.maindiv.remove();
		}

		this.matchsocket.onmessage = async (event) => {
			const data = JSON.parse(event.data);
			this.status = data.status;
			this.timer = data.waitingTime;
			this.game = data.game;
			this.updateData();
			this.checkstatus(data);
			const msg = {
				"action": "queue_status",
				"game": this.game,
				"id": await Iuser.getID(),
			}
			this.matchsocket.send(JSON.stringify(msg));
		}

	}

	timerCalculation() {

		let time = new Date(this.timer);
		if (isNaN(time.getTime())) {
			console.error('Invalid date:', this.timer);
			return;
		}
		let now = new Date(); // Date actuelle
		let elapsedTimeMillis = now - time; // Temps écoulé en millisecondes
		return (Math.floor(elapsedTimeMillis / 1000));
	}

	waitingPage() {
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
			window.location.href = '/home';
			this.removeWaitingPage();
		}

		waitingpage.appendChild(waitingtitle);
		waitingpage.appendChild(timer);
		waitingpage.appendChild(game);
		waitingpage.appendChild(cancelbutton);

		return waitingpage;
	}

	removeWaitingPage() {
		const waitingpage = document.querySelector('.waiting-page');
		waitingpage.remove();
	}

	updateData() {
		const waitingpage = document.querySelector('.waiting-page');
		const waitingtitle = document.querySelector('.waiting-title');
		const timer = document.querySelector('.timer');
		const game = document.querySelector('.game');

		waitingtitle.innerText = "status = " + this.status;
		const time = this.timerCalculation();
		if (time > 60) {
			timer.innerText = "timer : " + Math.floor(time / 60) + "m " + time % 60 + "s";
		}
		else {
			timer.innerText = "timer : " + time;
		}
		game.innerText = "game : " + this.game;
	}

	checkstatus(data) {
		if (this.status === 'found') {
			this.removeWaitingPage();
			window.location.href = "/gameService"
		}
	}

	async mainMatchmakingDiv() {
		this.matchsocket = new WebSocket("wss://localhost:4430/api/wsqueue/")
		this.matchmakingsocketaction();

		console.log("Matchmaking socket created.");
		const msg = {
			"action": "queue_add",
			"game": this.game,
			"id": await Iuser.getID(),
		}

		// const waitForOpenConnection = new Promise(resolve => {
		// 	this.matchsocket.addEventListener('open', resolve);
		// });
		// await waitForOpenConnection;

		this.matchsocket.send(JSON.stringify(msg));
		this.maindiv.appendChild(this.waitingPage());
		return this.maindiv;
	}
}

class Matchmaking extends MatchmakingButtons {
	constructor(game) {
		super();
		this.game = game;
	}
}

const pongRemoteMatchmaking = new Matchmaking('pong_multiplayer');
const pongTournamentMatchmaking = new Matchmaking('pong_tournament');
const pkmRemoteMatchmaking = new Matchmaking('pkm_multiplayer');
const pkmTournamentMatchmaking = new Matchmaking('pkm_tournament');

export { pongRemoteMatchmaking, pongTournamentMatchmaking, pkmRemoteMatchmaking, pkmTournamentMatchmaking };