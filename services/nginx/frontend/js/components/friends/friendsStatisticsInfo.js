import Iuser from "../user/userInfo.js";
import Icookies from "../../components/cookie/cookie.js";

export class FriendsStatistics {

	constructor(username){
		this.username = username;

	}

	createUserCardStats(containerStats, userInfo, stats){

		let rowUser = document.createElement('div');
		rowUser.classList.add('row');
		rowUser.id = 'row-profile-user';
		containerStats.appendChild(rowUser);

		let profileUser = document.createElement('div');
		profileUser.classList.add('d-flex')
		profileUser.classList.add('justify-content-center');
		profileUser.id = 'profile-user-flex';
		rowUser.appendChild(profileUser);

		const cardDivUser = document.createElement('div');
		cardDivUser.classList.add('card');
		cardDivUser.classList.add('mb-3');
		cardDivUser.id = 'user_';
		profileUser.appendChild(cardDivUser);

		const rowCard = document.createElement('div');
		rowCard.classList.add('row', 'g-0');
		cardDivUser.appendChild(rowCard);

		let cardImage = document.createElement('img');
		cardImage.src = `data:image/jpeg;base64,${userInfo.profile_picture_data}`;
		cardImage.classList.add('rounded-circle');
		cardImage.classList.add('mb-3');
		cardImage.width = 80;
		cardImage.width = 80;
		cardImage.alt = 'Profile Picture';

		for (let i = 0; i < 4; i++) {

			let divCol = document.createElement('div');
			divCol.classList.add('col-md-3');
			rowCard.appendChild(divCol);

			let divCardBody = document.createElement('div');
			divCardBody.classList.add('card-body');
			divCol.appendChild(divCardBody);

			let divCardText = document.createElement('div');
			divCardText.classList.add('card-text');
			divCardBody.appendChild(divCardText);

			this.generateCardTitle(userInfo, divCardBody, i);
			this.generateCardText(divCardBody, cardImage, i, stats);


		}
		return rowUser;
	}

	generateCardTitle(userInfo, divCardBody, i){

		let divCardTitle = document.createElement('div');
		divCardTitle.classList.add('card-title', 'text-nowrap');
		divCardBody.appendChild(divCardTitle);

		let strong = document.createElement('strong');
		divCardTitle.appendChild(strong);

		switch(i) {
			case 0:
				strong.textContent = userInfo.username;
				break;
			case 1:
				strong.textContent = 'Played games';
				break;
			case 2:
				strong.textContent = 'Won games';
				break;
			case 3:
				strong.textContent = 'Lost games';
				break;
			default:
				break;
		}
		return divCardTitle;
	}

	generateCardText(divCardBody, cardImage, i, stats){


		let divCardText = document.createElement('div');
		divCardText.classList.add('card-text', 'text-center');
		divCardBody.appendChild(divCardText);

		switch(i) {
			case 0:
				divCardText.appendChild(cardImage);
				break;
			case 1:
				divCardText.textContent = `${stats.game_played}`;
				break;
			case 2:
				divCardText.textContent = `${stats.game_won}`;
				break;
			case 3:
				divCardText.textContent = `${stats.game_lost}`;
				break;
			default:
				break;
		}

		return divCardText

	}


	createPartyStats(containerStats, userInfo, stats, users){

		let rowOther = document.createElement('div');
		rowOther.classList.add('row');
		containerStats.appendChild(rowOther);

		let profileContainer = document.createElement('div');
		profileContainer.classList.add('d-flex', 'flex-wrap', 'justify-content-center');
		profileContainer.id = 'profile-friends-container';
		rowOther.appendChild(profileContainer);

		let party = 0;
		for (let matchId in stats.history) {
			let game = stats.history[matchId];
			let player1 = users.users.find(user => user.user_id === game.player1.id);
			let player2 = users.users.find(user => user.user_id === game.player2.id);

			if (!player1)
				player1 = {username: 'Guest'};
			if (!player2)
				player2 = {username: 'Guest'};
			party++;

			const cardDiv = document.createElement('div');
			cardDiv.classList.add('card', 'mb-3', 'mx-3');
			cardDiv.id = `user_${party}`;
			profileContainer.appendChild(cardDiv);

			const cardBody = document.createElement('div');
			cardBody.classList.add('card-body');
			cardDiv.appendChild(cardBody);

			const cardTitle = document.createElement('h5');
			cardTitle.classList.add('card-title', 'text-center');
			cardTitle.textContent = `Squid Game ${party}`;
			cardBody.appendChild(cardTitle);

			let rowPlayers = document.createElement('div');
			rowPlayers.classList.add('row', 'text-center', 'my-3');
			cardBody.appendChild(rowPlayers);

			let playerOneCol = document.createElement('div');
			playerOneCol.classList.add('col');
			rowPlayers.appendChild(playerOneCol);

			let playerTwoCol = document.createElement('div');
			playerTwoCol.classList.add('col');
			rowPlayers.appendChild(playerTwoCol);

			let playerOneText = document.createElement('div');
			playerOneText.innerHTML = `<strong>${player1.username} </strong>`;
			playerOneCol.appendChild(playerOneText);

			let playerTwoText = document.createElement('div');
			playerTwoText.innerHTML = `<strong>${player2.username} </strong>`;
			playerTwoCol.appendChild(playerTwoText);

			let playerOneImage = document.createElement('img');
			if (player1.profile_picture_data)
				playerOneImage.src = `data:image/jpeg;base64,${player1.profile_picture_data}`;
			else
				playerOneImage.src ='../../images/Favicons/PH-01extra.png';
			playerOneImage.classList.add('rounded-circle', 'mt-2');
			playerOneImage.width = 80;
			playerOneImage.alt = 'Player one picture';
			playerOneCol.appendChild(playerOneImage);

			let playerTwoImage = document.createElement('img');
			if (player2.profile_picture_data){
				playerTwoImage.src = `data:image/jpeg;base64,${player2.profile_picture_data}`;
			} else {
				console.log(player2)
				playerTwoImage.src ='../../images/Favicons/PH-01extra.png';
			}
			playerTwoImage.classList.add('rounded-circle', 'mt-2');
			playerTwoImage.width = 80;
			playerTwoImage.alt = 'Player two picture';
			playerTwoCol.appendChild(playerTwoImage);

			let resultRow = document.createElement('div');
			resultRow.classList.add('row', 'text-center', 'mt-3');
			cardBody.appendChild(resultRow);

			let resultCol = document.createElement('div');
			resultCol.classList.add('col');
			resultRow.appendChild(resultCol);

			let resultText = document.createElement('div');
			resultText.innerHTML = `<strong>Result: </strong>${game.player1.score} - ${game.player2.score}`;
			resultCol.appendChild(resultText);

			const cardFooter = document.createElement('div');
			cardFooter.className = 'card-footer';
			const date = this.timerCalculation(game.date);
			if (date > 60)
				cardFooter.textContent = `${Math.floor(date / 60)} min ago`;
			else
				cardFooter.textContent = `${date} sec ago`;
			cardDiv.appendChild(cardFooter);
		};

		return rowOther;
	}


	async initFriendsStatistics(){

		const logoImg = document.querySelector('img[src="./images/Logos/LogoSG-mod.png"]');
		logoImg.src = '../../images/Logos/LogoSG-mod.png'

		const containerStats = document.createElement('div');
		containerStats.classList.add('container');
		containerStats.id = 'stats';
		document.querySelector('main').appendChild(containerStats);
		const users = await Iuser.getAllUsers();
		const userInfo = users.users.find(user => user.username === this.username);
		const stats = await this.getStats(userInfo.user_id);


		this.createUserCardStats(containerStats, userInfo, stats);
		this.createPartyStats(containerStats, userInfo, stats, users);

		return containerStats;
	}


	async getStats(userID){
		try {
			const response = await fetch (`/api/pong/match/${userID}/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': Icookies.getCookie('token')
				},
			});
			const data = await response.json();
			if (data.success) {
				return data.data;
			} else {
				alert('Failed to get stats');
			}
		} catch (error) {
			console.error('Error', error);
		}
	}

	timerCalculation(date) {

	try {
		let time = new Date(date);
		if (isNaN(time.getTime())) {
			return 0;
		}
		let now = new Date(); // Date actuelle
		let elapsedTimeMillis = now - time; // Temps écoulé en millisecondes
		return (Math.floor(elapsedTimeMillis / 1000));
	} catch (error) {
		return (0);
		}
	}
}

