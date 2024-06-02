import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"
import Ifriends from "../friends/friendsInfo.js";

export class chat {

	constructor(){
		this.targetid = 1;
	}

	async getusername(data) {
		let message = data.message;
		let parts = message.split(':');
		let id = parts[0].trim();

		const users = await Iuser.getAllUsers();
		console.warn(users);
		let username = users.users.find(user => user.user_id === parseInt(id)).username;
		return username;

	}

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
		sendButton.id = 'sendButton';
		sendButton.textContent = 'Send';

		const inviteButton = document.createElement('button');
		inviteButton.id = 'inviteButton';
		inviteButton.textContent = 'Invite';

		inputDiv.appendChild(input);
		inputDiv.appendChild(sendButton);
		inputDiv.appendChild(inviteButton);

		return inputDiv;
	}

	async createTitleDiv() {

		const response = await Iuser.getAllUsers();
		let user = response.users.find(user => user.user_id === parseInt(this.targetid));
		console.warn(user)

		const titleDiv = document.createElement('div');
		titleDiv.id = 'titleDiv';
		titleDiv.style.backgroundColor = 'yellow';
		titleDiv.classList.add('d-flex', 'flex-row', 'justify-content-center', 'align-items-center', 'w-100'); // Ajout des classes Bootstrap

		const titleElement = document.createElement('h1');
		titleElement.textContent = user.username;
		titleElement.classList.add('text-center', 'font-italic', 'mr-3',); // Ajout des classes Bootstrap

		const imageElement = document.createElement('img');
		imageElement.src = `data:image/jpeg;base64,${user.profile_picture_data}`;
		imageElement.classList.add('rounded-circle'); // Ajout des classes Bootstrap


		titleDiv.appendChild(titleElement);
		titleDiv.appendChild(imageElement);

		return titleDiv;
	}

	async createInteractionDiv() {
		const interactiondiv = document.createElement('div');
		interactiondiv.classList.add('interactionDiv');
		interactiondiv.style.backgroundColor = 'purple';
		interactiondiv.style.flex = '3'; // Ajoute la propriété flex

		const messagesDiv = this.createMessagesDiv();
		const inputDiv = this.createInputDiv();
		const titleDiv = await this.createTitleDiv();

		interactiondiv.appendChild(titleDiv);
		interactiondiv.appendChild(messagesDiv);
		interactiondiv.appendChild(inputDiv);

		return	interactiondiv;
	}

	createNonediv(){
		const Nonediv = document.createElement('div');
		Nonediv.style.flex = '3';
		Nonediv.innerText = "Nobody selected"


		return Nonediv;
	}

	async initChat() {
		const chatDiv = this.createChatDiv();
		

		const usersDiv = await this.createUsersDiv();
		
		chatDiv.appendChild(usersDiv);
		if (this.targetid){
			chatDiv.appendChild(await this.createInteractionDiv());
			this.createChatDiv();
		}
		else
			chatDiv.appendChild(this.createNonediv());

		document.body.appendChild(chatDiv);
		return chatDiv;
	}

	async createChat(){
		let myid = await Iuser.getID()
		let roomName = ''
		const interactiondiv = document.querySelector('.interactionDiv');
		const inputDiv = interactiondiv.querySelector('#inputDiv');
		const input = inputDiv.querySelector('#messageInput');
		const sendButton = inputDiv.querySelector('#sendButton');
		const inviteButton = inputDiv.querySelector('#inviteButton');


		if (myid > this.targetid)
			roomName = myid + '_' + this.targetid;
		else
			roomName = this.targetid + '_' + myid;

		chatSocket = new WebSocket(
			'wss://' + window.location.host + '/ws/chat/'
			+ roomName
			+ '/'
		);

		chatSocket.onopen = function(e) {
			console.log('Chat socket open');
		}

		chatSocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			const message = data['message'];
			this.checkInvite(message);
			this.addMessage(message);
		};

		chatSocket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly');
		};

		input.focus();
		input.onkeyup = (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				sendButton.click();
			}
		};

		sendButton.onclick = async (e) => {
			const message = input.value;
			const user_id = await Iuser.getID();
			chatSocket.send(JSON.stringify({
				'message': message,
				'user_id': user_id
			}));
			input.value = '';
		}

		inviteButton.onclick = async (e) => {
			const user_id = await Iuser.getID();
			chatSocket.send(JSON.stringify({
				'message': '@invite@',
				'user_id': user_id
			}));
		}

	}

	async addMessage(data){
		const messagediv = interactiondiv.querySelector('#messagesDiv');
		console.log(data);
		const username = await this.getusername(data)
		const usernameColor = this.getRandomColor(); // Function to generate random color
		let parts = data.message.split(':');
		let message = parts[1].trim();
		messagediv.innerHTML += `<span style="color: ${usernameColor};">${username}</span>: ${message}<br>`;
	}

	getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	async checkInvite(){
		let message = data.message;
		let parts = message.split(':');
		let id = parts[0].trim();
		let user_message = parts[1].trim();
		if (user_message === '@invite@'){
			console.warn('INVITATION BY' + id);
		}
	}

}
