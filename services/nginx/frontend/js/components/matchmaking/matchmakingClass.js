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
		}

		this.matchsocket.onmessage = async (event) => {
			const data = JSON.parse(event.data);
			this.status = data.status;
			this.timer = data.waitingTime;
			this.game = data.game;
			console.log("Matchmaking socket received data:", data);
			if (this.status === 'game') {
				console.log("already in game");
				this.removeWaitingPage();
				window.location.href = "/gameService"

			}
			this.updateData();
			console.log("Data updated.");
			await this.checkstatus(data);
			console.log("Status checked.");
			const msg = {
				"action": "queue_status",
				"game": this.game,
				"id": await Iuser.getID(),
			}
			this.matchsocket.send(JSON.stringify(msg));
			console.log("Status sent.");
		}

	}

	timerCalculation() {

		try{
			let time = new Date(this.timer);
			if (isNaN(time.getTime())) {
				return 0;
			}
			let now = new Date(); // Date actuelle
			let elapsedTimeMillis = now - time; // Temps écoulé en millisecondes
			return (Math.floor(elapsedTimeMillis / 1000));
		}
		catch (error) {
			return (0);
		}
	}

	async removeUser() {
		console.log("Removing user from queue.");
		const id = await Iuser.getID();
		const body = {
			"userID": id}
		const response = await fetch('https://localhost:4430/api/matchmaking/', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': Icookies.getCookie('token'),
				'X-CSRFToken': Icookies.getCookie('csrftoken')
			},
			credentials: 'include',
			body: JSON.stringify(body)
		});
		console.log(response);

	}
	
	waitingPage() {
		const waitingpage = document.createElement('div');
		waitingpage.id = 'waiting-page';

		const waitingtitle = document.createElement('p');
		waitingtitle.id = 'waiting-title';
		waitingtitle.innerText = "status = " + this.status;

		const timer = document.createElement('p');
		timer.id = 'timer';
		timer.innerText = "timer : " + this.timerCalculation();

		const game = document.createElement('p');
		game.id = 'game';
		game.innerText = "game : " + this.game;

		const cancelbutton = document.createElement('button');
		cancelbutton.classList.add('cancel-button');
		cancelbutton.innerText = 'Cancel';
		cancelbutton.onclick = async () => {
			await this.removeUser();
			this.removeWaitingPage();
			window.location.href = '/home';
		}

		waitingpage.appendChild(waitingtitle);
		waitingpage.appendChild(timer);
		waitingpage.appendChild(game);
		waitingpage.appendChild(cancelbutton);

		return waitingpage;
	}

	removeWaitingPage() {
		const waitingpage = document.querySelector('#waiting-page');
		waitingpage.remove();
	}

	updateData() {
		const waitingtitle = document.querySelector('#waiting-title');
		const timer = document.querySelector('#timer');
		const game = document.querySelector('#game');

		if (waitingtitle)
			waitingtitle.innerText = "status = " + this.status;
		if (timer){
			const time = this.timerCalculation();
			if (time > 60) {
				timer.innerText = "timer : " + Math.floor(time / 60) + "m " + time % 60 + "s";
			}
			else {
				timer.innerText = "timer : " + time;
			}
		}
		if (game)
			game.innerText = "game : " + this.game;
	}

	async createParty(data) {
		console.log("Creating party with data:", data);
		const users = await Iuser.getAllUsers();
		let username1 = users.users.find(user => user.user_id === parseInt(data.player1)).username;
		let username2 = users.users.find(user => user.user_id === parseInt(data.player2)).username;
		const party = {
			"player1": {
				id : data.player1,
				username : username1
			},
			"player2": {
				id : data.player2,
				username : username2
			},
		}
		const response = await fetch('https://localhost:4430/api/pong/match/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': Icookies.getCookie('token'),
				'X-CSRFToken': Icookies.getCookie('csrftoken')
			},
			credentials: 'include',
			body: JSON.stringify(party)
		});
		console.log(response);
	}

	async changeStatus() {
		console.log("Changing status to game.");
		const id = await Iuser.getID();
		const body = {
			"userID": id,
			"status": "game"
		}
		const response = await fetch('https://localhost:4430/api/matchmaking/', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': Icookies.getCookie('token'),
				'X-CSRFToken': Icookies.getCookie('csrftoken')
			},
			credentials: 'include',
			body: JSON.stringify(body)
		});
		console.log(response);
	}

	async checkstatus(data) {
		if (this.status === 'found') {
			this.removeWaitingPage();
			await this.createParty(data);
			await this.changeStatus();
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

		const waitForOpenConnection = new Promise(resolve => {
			this.matchsocket.addEventListener('open', resolve);
		});
		await waitForOpenConnection;

		const waitingPage = this.waitingPage();
		if (waitingPage instanceof HTMLElement) {
			this.maindiv.appendChild(waitingPage);
		} else {
			console.error("waitingPage did not return a valid DOM node.");
		}
		this.matchsocket.send(JSON.stringify(msg));

		document.body.appendChild(this.maindiv);
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



// Creating party with data: 
// Object { userID: 2, waitingTime: "2024-06-04T09:54:31.971412+02:00", game: "pong_multiplayer", status: "found", player1: 1, player2: 2 }