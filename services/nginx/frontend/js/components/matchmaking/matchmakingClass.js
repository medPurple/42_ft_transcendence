import Icookies from "../cookie/cookie.js"

class Matchmaking {

	getID(){
		fetch('/api/token/authenticate/', {
			method: 'POST',
			headers: {
				'X-CSRFToken': Icookies.getCookie('csrftoken'), // Get the CSRF token from the form data
				'Authorization': 'Bearer ' + Icookies.getCookie('token')
			}
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				console.log("user id is : " + data.get);
				return 
			} else {
				// Display validation errors or any other error message
				alert('No such user');
			}
		})
		.catch(error => {
			console.error('Error:', error);
			// Handle API errors
		});
	}
	
	pongMatchmaking() {
		id = getID();
		fetch('/api/queue/', {
			method: 'POST',
			headers: {
				'X-CSRFToken': Icookies.getCookie('csrftoken'),
				'Authorization': 'Bearer ' + Icookies.getCookie('token')
			},
			body: JSON.stringify({
				"userID": id,
				"game": "pong_multiplayer"
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				console.log("Added to queue for pong multiplayer");
				return 
			} else {
				alert('No such user');
			}
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}

	tournamentMatchmaking() {
		
		// Implémentez la logique de matchmaking pour le tournoi ici
	}

	pkmMatchmaking() {
		// Implémentez la logique de matchmaking pour le pkm ici
	}
}

// Pour utiliser cette classe, vous pouvez créer une nouvelle instance et appeler les méthodes appropriées
class MatchmakingButtons {
	constructor(matchmaking) {
		this.matchmaking = matchmaking;
	}
	
	insertButtons() {
		const matchmakingbutton = document.createElement('div');
		
		const multipongbutton = document.createElement('button');
		multipongbutton.innerText = 'Pong Matchmaking';
		multipongbutton.addEventListener('click', () => this.matchmaking.pongMatchmaking());
		
		const tournapongbutton = document.createElement('button');
		tournapongbutton.innerText = 'Tournament Matchmaking';
		tournapongbutton.addEventListener('click', () => this.matchmaking.tournamentMatchmaking());
		
		const multipkmbuttoon = document.createElement('button');
		multipkmbuttoon.innerText = 'PKM Matchmaking';
		multipkmbuttoon.addEventListener('click', () => this.matchmaking.pkmMatchmaking());
		
		matchmakingbutton.appendChild(multipongbutton);
		matchmakingbutton.appendChild(tournapongbutton);
		matchmakingbutton.appendChild(multipkmbuttoon);
		
		document.body.appendChild(matchmakingbutton);
	}
}

const matchmaking = new Matchmaking();
const matchmakingButtons = new MatchmakingButtons(matchmaking);
