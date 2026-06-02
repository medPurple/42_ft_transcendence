import Iuser from "../user/userInfo.js";

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

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
		if (logoImg) logoImg.src = '../../images/Logos/LogoSG-mod.png';
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

		// Construction DOM sécurisée — pas d'injection de données utilisateur dans innerHTML
		const items = [
			{ label: 'Username', value: data.username },
			{ label: 'First name', value: data.first_name },
			{ label: 'Last name', value: data.last_name },
		];
		items.forEach(({ label, value }) => {
			const li = document.createElement('li');
			li.className = 'list-group-item';
			const strong = document.createElement('strong');
			strong.textContent = label;
			li.appendChild(strong);
			li.appendChild(document.createElement('br'));
			li.appendChild(document.createTextNode(value || ''));
			cardList.appendChild(li);
		});
		const liStats = document.createElement('li');
		liStats.className = 'list-group-item';
		const aStats = document.createElement('a');
		aStats.href = `/statistics/${encodeURIComponent(data.username)}`;
		aStats.className = 'card-link';
		aStats.setAttribute('data-link', '');
		aStats.innerHTML = '<strong>Friend\'s stats</strong>';
		liStats.appendChild(aStats);
		cardList.appendChild(liStats);
		const li42 = document.createElement('li');
		li42.className = 'list-group-item';
		li42.textContent = '42 School';
		cardList.appendChild(li42);

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
