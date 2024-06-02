import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"
import Ifriends from "../friends/friendsInfo.js";

export class chat {
	createChatDiv() {
		const chatDiv = document.createElement('div');
		chatDiv.style.backgroundColor = 'lightgray';
		chatDiv.classList.add('m-3', 'rounded', 'border', 'border-dark', 'd-flex');;
		chatDiv.style.height = 'calc(100vh - 2rem)';
		chatDiv.id = 'chatDiv';
		return chatDiv;
	}

	async createUsersDiv() {
		const usersDiv = document.createElement('div');
		usersDiv.classList.add('d-flex', 'flex-column', 'border', 'border-dark', 'rounded');
		usersDiv.style.flex = '1'; // Ajoute la propriété flex
		usersDiv.id = 'usersDiv';

		const title = document.createElement('h2'); // Crée un nouvel élément de titre
		title.textContent = 'User List'; // Ajoute du texte au titre
		title.classList.add('text-underline', 'mt-3'); // Ajoute une marge en haut et souligne le texte
		usersDiv.appendChild(title); // Ajoute le titre à usersDiv


		// const response = await Iuser.getAllUsers();
		// console.log(response);
		// response.users.forEach(user => {
		// 	const userButton = document.createElement('button');
		// 	userButton.classList.add('btn', 'btn-lg', 'w-100', 'rounded', 'bg-light');
		// 	userButton.textContent = "name";
		// 	usersDiv.appendChild(userButton);
		// });
		for (let i = 0; i < 5; i++) {
			const userButton = document.createElement('button');
			userButton.classList.add('btn', 'btn-lg', 'w-100', 'rounded', 'bg-light', 'border', 'border-dark', 'mb-1');
			userButton.textContent = "name";
			usersDiv.appendChild(userButton);
		}

		return usersDiv;
	}

	createMessagesDiv() {
		const messagesDiv = document.createElement('div');
		messagesDiv.style.backgroundColor = 'blue';
		
		messagesDiv.id = 'messagesDiv';
		messagesDiv.textContent = 'messages';
		return messagesDiv;
	}

	createInputDiv() {
		const inputDiv = document.createElement('div');
		inputDiv.id = 'inputDiv';
		inputDiv.style.backgroundColor = 'green';

		const input = document.createElement('input');
		input.type = 'text';
		input.id = 'messageInput';

		const sendButton = document.createElement('button');
		sendButton.textContent = 'Send';

		const inviteButton = document.createElement('button');
		inviteButton.textContent = 'Invite';

		inputDiv.appendChild(input);
		inputDiv.appendChild(sendButton);
		inputDiv.appendChild(inviteButton);

		return inputDiv;
	}

	createTitleDiv() {
		const titleDiv = document.createElement('div');
		titleDiv.id = 'titleDiv';
		titleDiv.style.backgroundColor = 'yellow';

		const titleElement = document.createElement('h1');
		titleElement.textContent = "title";

		const imageElement = document.createElement('img');
		imageElement.src = "./images/Favicons/PH-01extra.png";

		titleDiv.appendChild(titleElement);
		titleDiv.appendChild(imageElement);

		return titleDiv;
	}

	createInteractionDiv() {
		const interactiondiv = document.createElement('div');
		interactiondiv.style.backgroundColor = 'purple';
		interactiondiv.style.flex = '3'; // Ajoute la propriété flex

		const messagesDiv = this.createMessagesDiv();
		const inputDiv = this.createInputDiv();
		const titleDiv = this.createTitleDiv();

		interactiondiv.appendChild(titleDiv);
		interactiondiv.appendChild(messagesDiv);
		interactiondiv.appendChild(inputDiv);

		return	interactiondiv;
	}

	async initChat() {
		const chatDiv = this.createChatDiv();
		

		const usersDiv = await this.createUsersDiv();
		const interactiondiv = this.createInteractionDiv();

		chatDiv.appendChild(usersDiv);
		chatDiv.appendChild(interactiondiv);

		document.body.appendChild(chatDiv);
		return chatDiv;
	}
}
