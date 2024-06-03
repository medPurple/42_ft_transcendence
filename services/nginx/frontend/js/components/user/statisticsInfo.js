import Iuser from "../../components/user/userInfo.js";

export class Statistics {

	constructor(){
		this.games = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	}

	createUserCardStats(containerStats, userInfo){

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
		cardDivUser.classList.add('card', 'mb-3', 'mx-3');
		cardDivUser.id = 'user_';
		profileUser.appendChild(cardDivUser);

		const rowCard = document.createElement('div');
		rowCard.classList.add('row', 'g-0');
		cardDivUser.appendChild(rowCard);

		let cardImage = document.createElement('img');
		cardImage.src = `data:image/jpeg;base64,${userInfo.user.profile_picture_data}`;
		cardImage.classList.add('rounded-circle');
		cardImage.classList.add('mb-3');
		cardImage.width = 80;
		cardImage.width = 80;
		cardImage.alt = 'Profile Picture';

		for (let i = 0; i < 4; i++) {

			let divCol = document.createElement('div');
			divCol.classList.add('col-md-3', 'col-sm-6', 'col-12');
			rowCard.appendChild(divCol);

			let divCardBody = document.createElement('div');
			divCardBody.classList.add('card-body');
			divCol.appendChild(divCardBody);

			let divCardText = document.createElement('div');
			divCardText.classList.add('card-text');
			divCardBody.appendChild(divCardText);

			this.generateCardTitle(userInfo, divCardBody, i);
			this.generateCardText(divCardBody, cardImage, i);


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
				strong.textContent = userInfo.user.username;
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

	generateCardText(divCardBody, cardImage, i){


		let divCardText = document.createElement('div');
		divCardText.classList.add('card-text', 'text-center');
		divCardBody.appendChild(divCardText);

		switch(i) {
			case 0:
				divCardText.appendChild(cardImage);
				break;
			case 1:
				divCardText.textContent = ` ${i + 1}  ${i - 1}`;
				break;
			case 2:
				divCardText.textContent = ` ${i - 1}  ${i + 1}`;
				break;
			case 3:
				divCardText.textContent = ` ${i + 1}  ${i - 1}`;
				break;
			default:
				break;
		}

		return divCardText

	}

	createPartyStats(containerStats, userInfo){

		let rowOther = document.createElement('div');
		rowOther.classList.add('row');
		containerStats.appendChild(rowOther);

		let profileContainer = document.createElement('div');
		profileContainer.classList.add('d-flex', 'flex-wrap', 'justify-content-center');
		profileContainer.id = 'profile-friends-container';
		rowOther.appendChild(profileContainer);

		let party = 0;
		this.games.forEach((game) => {
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
			playerOneText.innerHTML = `<strong>${userInfo.user.username} </strong>`;
			playerOneCol.appendChild(playerOneText);

			let playerTwoText = document.createElement('div');
			playerTwoText.innerHTML = `<strong>raph </strong>`;
			playerTwoCol.appendChild(playerTwoText);

			let playerOneImage = document.createElement('img');
			playerOneImage.src = `data:image/jpeg;base64,${userInfo.user.profile_picture_data}`;
			playerOneImage.classList.add('rounded-circle', 'mt-2');
			playerOneImage.width = 80;
			playerOneImage.alt = 'Player one picture';
			playerOneCol.appendChild(playerOneImage);

			let playerTwoImage = document.createElement('img');
			playerTwoImage.src = `data:image/jpeg;base64,${userInfo.user.profile_picture_data}`; // Remplacer par l'URL de l'image de Player two
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
			resultText.innerHTML = `<strong>Result: </strong> ${party + 1} - ${party - 1}`;
			resultCol.appendChild(resultText);
		});

		return rowOther;
	}

	async displayStat(){

		const containerStats = document.createElement('div');
		containerStats.classList.add('container');
		containerStats.id = 'stats';
		document.querySelector('main').appendChild(containerStats);
		const userInfo = await Iuser.getAllUserInfo();

		this.createUserCardStats(containerStats, userInfo);
		this.createPartyStats(containerStats, userInfo);

		return containerStats;
	}
}

