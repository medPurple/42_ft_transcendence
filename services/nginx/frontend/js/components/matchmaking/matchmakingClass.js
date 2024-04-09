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
		let id = await this.getID();
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

	tournamentMatchmaking() {

		// Implémentez la logique de matchmaking pour le tournoi ici
	}

	pkmMatchmaking() {
		// Implémentez la logique de matchmaking pour le pkm ici
	}
}

// Pour utiliser cette classe, vous pouvez créer une nouvelle instance et appeler les méthodes appropriées
export class MatchmakingButtons {
	

	constructor(matchmaking) {
		this.matchmaking = matchmaking;
		this.buttonsCreation();
		
	}

	multipongButton(){
		const multipongbutton = document.createElement('button');
		multipongbutton.innerText = 'Pong Matchmaking';
		multipongbutton.classList.add('queue-button');
		multipongbutton.addEventListener('click', () => {
			this.removeButtons();
			this.matchmaking.pongMatchmaking()

		});
		return multipongbutton;
	}

	multipkmButton(){
		const multipkmbuttoon = document.createElement('button');
		multipkmbuttoon.innerText = 'PKM Matchmaking';
		multipkmbuttoon.classList.add('queue-button');
		multipkmbuttoon.addEventListener('click', () => {
			this.removeButtons();
			this.matchmaking.pkmMatchmaking()

		});		return multipkmbuttoon;
	}

	tournapongButton(){
		const tournapongbutton = document.createElement('button');
		tournapongbutton.innerText = 'Tournament Matchmaking';
		tournapongbutton.classList.add('queue-button');
		tournapongbutton.addEventListener('click', () => {
			this.removeButtons();
			this.matchmaking.tournamentMatchmaking()

		});		return tournapongbutton;
	}

	buttonsCreation() {
		const matchmakingbutton = document.createElement('div');
		matchmakingbutton.appendChild(this.multipongButton());
		matchmakingbutton.appendChild(this.tournapongButton());
		matchmakingbutton.appendChild(this.multipkmButton());
		document.body.appendChild(matchmakingbutton);
	}

	removeButtons() {
        const buttonsContainer = document.body.querySelector('.matchmaking-buttons');
        if (buttonsContainer) {
            buttonsContainer.remove();
        }
    }
}

const matchmaking = new Matchmaking();
export { matchmaking };
