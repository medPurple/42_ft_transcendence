import Iuser from "../../components/user/userInfo.js";

export class Statistics {

	constructor(){
		this.games = [0, 1, 2, 3, 4, 5, 6];
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
		cardDivUser.classList.add('card');
		cardDivUser.classList.add('mb-3');
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
			divCol.classList.add('col-md-3');
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
		profileContainer.classList.add('d-flex') 
		profileContainer.classList.add('justify-content-center');// Appliquer la classe Bootstrap pour centrer les éléments horizontalement
		profileContainer.id = 'profile-friends-container';
		rowOther.appendChild(profileContainer);
	
		let party = 0
		this.games.forEach((game) => {
			party++;
	
			const cardDiv = document.createElement('div');
			cardDiv.classList.add('card')
			cardDiv.classList.add('mb-3');
			cardDiv.id = 'user_';
			profileContainer.appendChild(cardDiv);
	
	
			let cardList = document.createElement('ul');
			cardList.id = 'profile-content';
			cardList.classList.add( 'list-group');
			cardList.classList.add('list-group-flush');
			cardDiv.appendChild(cardList);
	
			let listItems = `
				<li class="list-group-item"><strong>Squid Game ${party}</strong></li>
				<li class="list-group-item"><strong>Player one: </strong>${userInfo.user.username}</li>
				<li class="list-group-item"><strong>Player two: </strong> raph </li>
				<li class="list-group-item"><strong>Result: </strong> ${party + 1} - ${party - 1} </li>
			`;
	
			cardList.innerHTML = listItems;
	
	
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

