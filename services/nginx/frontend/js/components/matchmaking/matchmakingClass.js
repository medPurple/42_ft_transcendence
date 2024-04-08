import Icookies from "../cookie/cookie.js"

class Matchmaking {

	async getID() {
		let jwtToken = Icookies.getCookie('token');
		let csrfToken = Icookies.getCookie('csrftoken');
	
		console.log("TOKEN BEFORE : " + jwtToken);
	
		try {
			const response = await fetch('/api/token/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
					'Authorization': jwtToken
				}
			});
	
			if (!response.ok) {
				throw new Error('identification failed');
			}
	
			const data = await response.json();
			console.log(data.user_id);
			return data.user_id;
		} catch (error) {
			console.error('Error:', error);
			// Handle API errors
		}
	}
	
	async pongMatchmaking() {
		try {
			let id = await this.getID();
			console.log("id is : " + id);
		} catch (error) {
			console.error('Error:', error);
			// Handle errors
		}
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

export { matchmakingButtons };