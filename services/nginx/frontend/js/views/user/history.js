import Icookies from "../../components/cookie/cookie.js"

export default () => {
	// let content = '';
	if (Icookies.getCookie('token')) {

		let Games = [0, 1, 2, 3];

		let rowUser = document.createElement('div');
		rowUser.className = 'row';
		document.querySelector('main').appendChild(rowUser);


		let profileUser = document.createElement('div');
		profileUser.className ='d-flex justify-content-center';
		profileUser.id = 'profile-user-container';
		rowUser.appendChild(profileUser);
		// document.querySelector('main').appendChild(profileUser);

		const cardDivUser = document.createElement('div');
		cardDivUser.className = 'card mb-3';
		cardDivUser.id = 'user_';

		let cardBodyUser = document.createElement('div');
		cardBodyUser.className = 'card-body';

		let cardTitleUser = document.createElement('h5');
		cardTitleUser.className = 'card-title';
		cardTitleUser.textContent = 'couCOUCou';

		profileUser.appendChild(cardDivUser);
		cardDivUser.appendChild(cardBodyUser);
		cardDivUser.appendChild(cardTitleUser);

			// let cardImage = document.createElement('img');
			// cardImage.src = `data:image/jpeg;base64,${profilePictureData}`;
			// cardImage.className = 'card-img-top profile-pic';
			// cardImage.alt = 'Profile Picture';

		let rowOther = document.createElement('div');
		rowOther.className = 'row';
		document.querySelector('main').appendChild(rowOther);

		let profileContainer = document.createElement('div');
		profileContainer.className = 'd-flex justify-content-center'; // Appliquer la classe Bootstrap pour centrer les éléments horizontalement
		profileContainer.id = 'profile-friends-container';
		rowOther.appendChild(profileContainer);
		// document.querySelector('main').appendChild(profileContainer);


		Games.forEach((game) => {


			// Créer la structure Bootstrap de la carte
			const cardDiv = document.createElement('div');
			cardDiv.className = 'card mb-3';
			cardDiv.id = 'user_';

			// let cardImage = document.createElement('img');
			// cardImage.src = `data:image/jpeg;base64,${profilePictureData}`;
			// cardImage.className = 'card-img-top profile-pic';
			// cardImage.alt = 'Profile Picture';

			let cardBody = document.createElement('div');
			cardBody.className = 'card-body';

			let cardTitle = document.createElement('h5');
			cardTitle.className = 'card-title';
			cardTitle.textContent = 'coucou';

			let cardText = document.createElement('p');
			cardText.className = 'card-text';
			cardText.textContent = 'Description text here to do, something funny about the student'; // Vous pouvez remplacer cela par la description réelle si vous en avez

			let cardList = document.createElement('ul');
			cardList.id = 'profile-content';
			cardList.className = 'list-group list-group-flush';

			let listItems = `
				<li class="list-group-item"><strong>Username:</strong> gamesWon</li>
				<li class="list-group-item"><strong>First Name:</strong>gamesLost</li>
				<li class="list-group-item"><strong>Last Name:</strong>gamesPlayed</li>
				<li class="list-group-item"><strong>Online:</strong> date</li>
			`;

			cardList.innerHTML = listItems;

			let cardFooter = document.createElement('div');
			cardFooter.className = 'card-footer text-body-secondary';
			cardFooter.textContent = 'footer here';

			// Assemblez la structure de la carte
			cardBody.appendChild(cardTitle);
			cardBody.appendChild(cardText);

			// cardDiv.appendChild(cardImage);
			cardDiv.appendChild(cardBody);
			cardDiv.appendChild(cardList);
			cardDiv.appendChild(cardFooter);

			profileContainer.appendChild(cardDiv);
		});
		return profileContainer;

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
