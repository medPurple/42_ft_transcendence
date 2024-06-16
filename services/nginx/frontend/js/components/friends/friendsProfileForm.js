import Iuser from "../user/userInfo.js";

export class FriendsProfile {

	constructor(username) {
		this.username = username;
	}

	async initFriendsInfo() {
		try {
			const users = await Iuser.getAllUsers();
			let data = users.users.find(user => user.username === this.username);
			let profilePictureData = data.profile_picture_data;
			let statut = this.checkStatut(data.is_online);
			const profileContainer = this.displayFriendsProfile(data, profilePictureData, statut);
			return profileContainer;
		} catch (error) {
			let tmpdiv = document.createElement('div');
			return tmpdiv;
		}
	}

	checkStatut(is_online) {
		if(is_online === 0)
			return {text: "Offline", color: "grey"};
		else if (is_online === 1)
			return {text: "Online", color: "green"};
		else
			return {text: "Playing", color: "yellow"};
	}

	displayFriendsProfile(data, profilePictureData, statut) {
		const logoImg = document.querySelector('img[src="./images/Logos/LogoSG-mod.png"]');
		logoImg.src = '../../images/Logos/LogoSG-mod.png'
		let profileContainer = document.createElement('div');
		profileContainer.className = 'd-flex justify-content-center';
		profileContainer.id = 'profile-friends-container';
		let mainElement = document.querySelector('main');
		if (mainElement) {
			mainElement.appendChild(profileContainer);
		} else {
			console.error('No <main> element found in the document.');
		}

		let cardDiv = document.createElement('div');
		cardDiv.className = 'card text-center';
		cardDiv.style.width = '20rem';

		let cardImage = document.createElement('img');
		cardImage.src = `data:image/jpeg;base64,${profilePictureData}`;
		cardImage.className = 'card-img-top profile-pic';
		cardImage.alt = 'Profile Picture';

		let cardBody = document.createElement('div');
		cardBody.className = 'card-body';

		let cardTitle = document.createElement('h5');
		cardTitle.className = 'card-title';
		let usernameStrong = document.createElement('strong');
		usernameStrong.textContent = data.username;
		cardTitle.appendChild(usernameStrong);

		let cardText = document.createElement('h6');
		cardText.className = 'card-text';
		cardText.textContent = '... thinks this is an outstanding project';

		let cardList = document.createElement('ul');
		cardList.id = 'profile-content';
		cardList.className = 'list-group list-group-flush';

		let listItems = `
			<li class="list-group-item"> <strong> Username  </strong> <br> ${data.username}</li>
			<li class="list-group-item"> <strong> First name  </strong> <br> ${data.first_name}</li>
			<li class="list-group-item"> <strong> Last name  </strong> <br> ${data.last_name}</li>
			<li class="list-group-item"><a href="/statistics/${data.username}" class="card-link" data-link><strong>Friend's stats</strong></a></li>
			<li class="list-group-item"> 42 School</li>

		`;

		cardList.innerHTML = listItems;

		let cardFooter = document.createElement('div');
		cardFooter.className = 'card-footer text-body-secondary';

		let statusText = document.createTextNode(statut.text);
		cardFooter.appendChild(statusText);

		let statusSpan = document.createElement('span');
		statusSpan.style.display = 'inline-block';
		statusSpan.style.width = '10px';
		statusSpan.style.height = '10px';
		statusSpan.style.borderRadius = '50%';
		statusSpan.style.backgroundColor = statut.color;
		statusSpan.style.marginLeft = '5px';

		cardFooter.appendChild(statusSpan);

		cardBody.appendChild(cardTitle);
		cardBody.appendChild(cardText);

		cardDiv.appendChild(cardImage);
		cardDiv.appendChild(cardBody);
		cardDiv.appendChild(cardList);
		cardDiv.appendChild(cardFooter);

		profileContainer.appendChild(cardDiv);

		return profileContainer;
	}
}
