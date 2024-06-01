import Icookies from "../../components/cookie/cookie.js"
import Iuser from "../../components/user/userInfo.js";

export default async () =>  {
	// let content = '';
	if (Icookies.getCookie('token')) {

		let Games = [0, 1, 2, 3, 4, 5, 6];

		const userInfo = await Iuser.getAllUserInfo();
		console.log(userInfo);

		let containerStats = document.createElement('div');
		containerStats.classList.add('container');
		containerStats.id = 'stats';
		document.querySelector('main').appendChild(containerStats);

		let rowUser = document.createElement('div');
		rowUser.classList.add('row');
		rowUser.id = 'row-profile-user';
		containerStats.appendChild(rowUser);
		
		
		let profileUser = document.createElement('div');
		profileUser.classList.add('d-flex') 
		profileUser.classList.add('justify-content-center');
		profileUser.id = 'profile-user-flex';
		rowUser.appendChild(profileUser);
		
		
		for (let i = 0; i < 4; i++) {
			const cardDivUser = document.createElement('div');
			cardDivUser.classList.add('card');
			cardDivUser.classList.add('mb-3');
			cardDivUser.id = 'user_';
			profileUser.appendChild(cardDivUser);
			
	
			let cardImage = document.createElement('img');
			cardImage.src = `data:image/jpeg;base64,${userInfo.user.profile_picture_data}`;
			cardImage.classList.add('rounded-circle');
			cardImage.classList.add('mb-3');
			cardImage.width = 80;
			cardImage.width = 80;
			cardImage.alt = 'Profile Picture';

			let list = document.createElement('ul');
			list.classList.add( 'list-group');
			list.classList.add('list-group-flush');
			cardDivUser.appendChild(list);
			for (let j = 0; j < 2; j++) {
				let listItem = document.createElement('li');
				listItem.classList.add('list-group-item');
				if (j === 0 && i === 0){
					// rowContent.classList.add('text-center');
					let strong = document.createElement('strong');
					strong.textContent = userInfo.user.username;
					listItem.appendChild(strong);
				} else if (j === 1 && i === 0) {
					listItem.appendChild(cardImage); 
				} else if (j === 0 && i === 1){
					let strong = document.createElement('strong');
					strong.textContent = 'Played games';
					listItem.appendChild(strong);
				} else if (j === 1 && i === 1){
					listItem.textContent = `${j + 1}  ${i + 1}`;
				} else if (j === 0 && i === 2 ){
					let strong = document.createElement('strong');
					strong.textContent = 'Won games';
					listItem.appendChild(strong);
				} else if (j === 1 && i === 2){
					listItem.textContent = ` ${j + 1}  ${i + 1}`;
				} else if (j === 0 && i === 3){
					let strong = document.createElement('strong');
					strong.textContent = 'Lost games';
					listItem.appendChild(strong);
				} else if (j === 1 && i === 3){
					listItem.textContent = ` ${j + 1} ${i + 1}`;
				}
				list.appendChild(listItem);
			}
		}

		// Stats
		let rowOther = document.createElement('div');
		rowOther.classList.add('row');
		containerStats.appendChild(rowOther);

		let profileContainer = document.createElement('div');
		profileContainer.classList.add('d-flex') 
		profileContainer.classList.add('justify-content-center');// Appliquer la classe Bootstrap pour centrer les éléments horizontalement
		profileContainer.id = 'profile-friends-container';
		rowOther.appendChild(profileContainer);

		let party = 0
		Games.forEach((game) => {
			party++;

			// Créer la structure Bootstrap de la carte
			const cardDiv = document.createElement('div');
			cardDiv.classList.add('card')
			cardDiv.classList.add('mb-3');
			cardDiv.id = 'user_';


			// let cardBody = document.createElement('div');
			// cardBody.classList.add('card-body');

			// let cardTitle = document.createElement('h5');
			// cardTitle.classList.add('card-title');
			// cardTitle.textContent = 'Squid Game ' + party;

			// let cardText = document.createElement('p');
			// cardText.classList.add('card-text');
			// cardText.classList.add('text-center'); // Ajoute la classe pour centrer le texte
			// cardText.classList.add('mx-auto');// Ajoute la classe pour rendre le texte responsive
			// cardText.textContent = 'Description'; // Vous pouvez remplacer cela par la description réelle si vous en avez

			let cardList = document.createElement('ul');
			cardList.id = 'profile-content';
			cardList.classList.add( 'list-group');
			cardList.classList.add('list-group-flush');

			let listItems = `
				<li class="list-group-item"><strong>Squid Game ${party}</strong></li>
				<li class="list-group-item"><strong>Player one: </strong>${userInfo.user.username}</li>
				<li class="list-group-item"><strong>Player two: </strong> raph </li>
				<li class="list-group-item"><strong>Result: </strong> ${party + 1} - ${party - 1} </li>
			`;

			cardList.innerHTML = listItems;



			// Assemblez la structure de la carte
			// cardBody.appendChild(cardTitle);
			// cardBody.appendChild(cardText);

			// // cardDiv.appendChild(cardImage);
			// cardDiv.appendChild(cardBody);
			cardDiv.appendChild(cardList);


			profileContainer.appendChild(cardDiv);
		});
		return containerStats;

	} else {
		const logdiv = document.createElement('div');
		logdiv.classList.add('not-logged');
		logdiv.innerText = 'You need to be logged in to edit your profile';
		document.body.appendChild(logdiv);
		return logdiv;
	}
	// return content;
}

// 	content = `<h1>hey</h1>
// 	<p>gamesWon
// gamesLost
// gamesPlayed
// date</p>
// `
