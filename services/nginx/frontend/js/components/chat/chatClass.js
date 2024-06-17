import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"
import Ifriends from "../friends/friendsInfo.js";

export class chat {

	constructor() {
		this.targetid = null;
		this.websocket = null;
		this.player1 = null;
		this.player2 = null;
	}

	async getusername(id) {
		const users = await Iuser.getAllUsers();
		let username = users.users.find(user => user.user_id === parseInt(id)).username;
		return username;
	}

	createChatDiv() {
		const chatDiv = document.createElement('div');
		chatDiv.classList.add('row', 'p-3');
		chatDiv.id = 'chatDiv';
		return chatDiv;
	}

	async createUsersDiv() {
		const usersDiv = document.createElement('div');
		usersDiv.classList.add('col-4', 'p-3');
		usersDiv.style.flex = 'flex';
		usersDiv.style.flexDirection = 'column';
		usersDiv.id = 'usersDiv';

		const title = document.createElement('button');
		title.classList.add('btn', 'btn-lg', 'w-100', 'rounded', 'bg-dark', 'mb-2');
		title.style.color = 'white';
		title.textContent = 'Add friend: ';
		usersDiv.appendChild(title);

		const response = await Iuser.getAllUsers();
		const id = await Iuser.getID()

		response.users.forEach(user => {
			if (user.user_id != id) {
				const userButton = document.createElement('button');
				userButton.classList.add('btn', 'btn-lg', 'w-100', 'rounded', 'bg-light');
				userButton.textContent = user.username;
				usersDiv.appendChild(userButton);
				userButton.onclick = async (e) => {
					this.targetid = user.user_id;
					const interactiondiv = document.querySelector('.interactionDiv');
					const Nonediv = document.querySelector('.Nonediv');
					if (Nonediv)
						Nonediv.remove();
					else {
						this.websocket.send(JSON.stringify({
							'message': '@refuse@',
							'user_id': await Iuser.getID()
						}));
						this.player1 = null;
						this.player2 = null;
						this.websocket.close();
						interactiondiv.remove();
					}
					const newinteractiondiv = await this.createInteractionDiv();
					document.querySelector('#chatDiv').appendChild(newinteractiondiv);
					this.createChat();
				}
			}
		});
		return usersDiv;
	}

	async createMessagesDiv() {
		const messagesDiv = document.createElement('div');
		messagesDiv.classList.add('p-3', 'mt-auto', 'bg-white', 'rounded');
		messagesDiv.id = 'messagesDiv';
		messagesDiv.textContent = '';
		messagesDiv.style.overflowY = 'scroll';
		return messagesDiv;
	}

	createInputDiv() {
		const inputDiv = document.createElement('div');
		inputDiv.id = 'inputDiv';
		inputDiv.classList.add('mt-3');

		const input = document.createElement('textarea');
		input.id = 'messageInput';
		input.classList.add('form-control');
		input.placeholder = 'Write here...';
		input.rows = 3;
		input.style.resize = 'none';

		const sendButton = document.createElement('button');
		sendButton.id = 'sendButton';
		sendButton.textContent = 'Send';
		sendButton.classList.add('btn', 'btn-dark', 'mt-3', 'm-2');

		inputDiv.appendChild(input);
		inputDiv.appendChild(sendButton);

		return inputDiv;
	}

	async createTitleDiv() {
		const response = await Iuser.getAllUsers();
		let user = response.users.find(user => user.user_id === parseInt(this.targetid));

		const titleDiv = document.createElement('div');
		titleDiv.id = 'titleDiv';
		titleDiv.classList.add('bg-light', 'mb-3', 'align-items-center', 'w-100', 'p-3', 'border', 'rounded');

		const titleElement = document.createElement('h4');
		titleElement.textContent = user.username;
		titleElement.href = `/friend-profile/${user.username}`;
		titleElement.setAttribute('data-link', '');
		titleElement.classList.add('text-center', 'font-italic', 'mr-3');

		const inviteButton = document.createElement('button');
		inviteButton.id = 'inviteButton';
		inviteButton.textContent = 'Invite';
		inviteButton.classList.add('btn', 'btn-light', 'm-2', 'border-dark');

		titleDiv.appendChild(titleElement);
		titleDiv.appendChild(inviteButton);

		const getUserBlockStatut = await Ifriends.getUserBlock(user.username);
		if (getUserBlockStatut.user_blocked_other) {
			const unblockButton = document.createElement('button');
			unblockButton.id = 'unblockButton';
			unblockButton.textContent = 'Unblock';
			unblockButton.classList.add('btn', 'btn-secondary', 'm-2');
			this.unblockExec(unblockButton, user.username);
			titleDiv.appendChild(unblockButton);

		}
		else if (getUserBlockStatut.other_user_blocked_user) {
			const blockedButton = document.createElement('button');
			blockedButton.id = 'blockedButton';
			blockedButton.textContent = 'Blocked';
			blockedButton.classList.add('btn', 'btn-secondary', 'm-2');
			blockedButton.disabled = true;
			titleDiv.appendChild(blockedButton);

		} else {
			const blockButton = document.createElement('button');
			blockButton.id = 'blockButton';
			blockButton.textContent = 'Block';
			blockButton.classList.add('btn', 'btn-secondary', 'm-2');
			this.blockExec(blockButton, user.username);
			titleDiv.appendChild(blockButton);
		}
		return titleDiv;
	}

	async blockExec(blockButton, username) {
		blockButton.onclick = async () => {
			try {
				const blockIsValid = await Ifriends.blockUser(username);
				if (blockIsValid.success) {
					blockButton.textContent = 'User is blocked';
					blockButton.disabled = true;
				}
			} catch (error) {
				console.log('Error:', error);
			}
		}
	}

	async unblockExec(unblockButton, username) {
		unblockButton.onclick = async () => {
			try {
				const unblockIsValid = await Ifriends.unblockUser(username);
				if (unblockIsValid.success) {
					unblockButton.textContent = 'User is unblocked';
					unblockButton.disabled = true;
				}
			} catch (error) {
				console.log('Error:', error);
			}
		}
	}

	async checkBlockStatus(id) {
		const username = await this.getusername(id)
		try {
			const blockStatus = await Ifriends.getUserBlock(username);
			if (blockStatus.success) {
				return true;
			}
			else {
				return false;
			}
		} catch (error) {
			console.log('Error:', error);
		}
	}

	async createInteractionDiv() {
		const interactiondiv = document.createElement('div');
		interactiondiv.classList.add('interactionDiv', 'd-flex', 'flex-column', 'p-3');
		interactiondiv.style.flex = '3';

		const messagesDiv = await this.createMessagesDiv();
		const inputDiv = this.createInputDiv();
		const titleDiv = await this.createTitleDiv();

		interactiondiv.appendChild(titleDiv);
		interactiondiv.appendChild(messagesDiv);
		interactiondiv.appendChild(inputDiv);

		return interactiondiv;
	}

	createNonediv() {
		const Nonediv = document.createElement('div');
		Nonediv.classList.add('col-8', 'Nonediv', 'p-3');
		Nonediv.style.height = '80vw';
		Nonediv.style.width = 'auto';
		Nonediv.style.display = 'flex';
		Nonediv.style.flexDirection = 'column';

		const img = new Image();
		img.classList.add('w-100');
		img.src = "../../../images/Site/AloneAgain.gif";

		Nonediv.appendChild(img);
		Nonediv.style.flex = '3';
		return Nonediv;
	}

	async initChat() {
		const chatDiv = this.createChatDiv();
		const usersDiv = await this.createUsersDiv();

		chatDiv.appendChild(usersDiv);
		if (this.targetid)
			chatDiv.appendChild(await this.createInteractionDiv());
		else
			chatDiv.appendChild(this.createNonediv());
		document.body.appendChild(chatDiv);
		return chatDiv;
	}

	async addMessage(user_id, message, timestamp) {
		const userID = await Iuser.getID();
		const userName = await this.getusername(user_id);

		const messagediv = document.querySelector('#messagesDiv');
		messagediv.classList.add('d-flex', 'flex-column', 'mb-2');

		const messageDiv2 = document.createElement('div');
		messageDiv2.classList.add('d-flex', 'flex-column', 'mb-2');

		if (user_id == userID)
		{
			messageDiv2.classList.add('align-self-end');
			messageDiv2.style.justifyContent = 'flex-end';
		}
		else{
			messageDiv2.classList.add('align-self-start');
			messageDiv2.style.justifyItems = 'flex-start';
		}

		const usernameColor = this.getRandomColor();
		const name = document.createElement('div');

		name.textContent = userName;
		name.style.color = usernameColor;
		name.style.fontWeight = 'bold';
		if (user_id == userID)
			name.classList.add('align-self-end');
		else
			name.classList.add('align-self-start');
		
		const time = document.createElement('div');
		let timer = this.timerCalculation(timestamp);
		time.style.color = 'gray';
		time.textContent = ' ' + timer;
		if (user_id == userID)
			time.classList.add('align-self-end');
		else
			time.classList.add('align-self-start');

		messagediv.appendChild(name);
		messagediv.appendChild(time);

		const msg = document.createElement('div');
		msg.classList.add('mb-2', 'rounded', 'p-2');
		msg.style.backgroundColor = 'grey';
		msg.style.maxWidth = '40vw';
		msg.style.overflow = 'auto';
		msg.style.overflowWrap = 'break-word';
		msg.textContent = message;
		msg.style.textAlign = 'left';
		if (user_id == userID){
			msg.style.backgroundColor = 'lightgrey';
			msg.classList.add('align-self-end');
		}
		else
			msg.classList.add('align-self-start');

		messageDiv2.appendChild(msg);
		messagediv.appendChild(messageDiv2);
	}

	timerCalculation(date) {
		try {
			let time = new Date(date);
			if (isNaN(time.getTime())) {
				return 0;
			}
			const options = { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' };
			return time.toLocaleDateString('en-US', options);
		} catch (error) {
			return (0);
		}
	}

	getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	async checkInvite(data, id) {
		if (data === '@invite@') {
			return true;
		}
		return false;
	}

	createInviteButton() {
		const inputdiv = document.querySelector('#inputDiv');

		const messagediv = document.querySelector('#messagesDiv');
		messagediv.innerHTML += '<span style="color: darkgreen;">A game can be created if you both accept the invitation</span><br>';

		inputdiv.appendChild(this.createAcceptButton());
		inputdiv.appendChild(this.createRefuseButton());
	}

	createAcceptButton() {
		const acceptButton = document.createElement('button');
		acceptButton.id = 'acceptButton';
		acceptButton.textContent = 'Accept';
		acceptButton.classList.add('btn', 'btn-light', 'mt-3', 'm-2', 'border-dark');

		acceptButton.onclick = async (e) => {
			this.websocket.send(JSON.stringify({
				'message': '@accept@',
				'user_id': await Iuser.getID()
			}));
			const inputdiv = document.querySelector('#inputDiv');
			const acceptButton = inputdiv.querySelector('#acceptButton');
			const refuseButton = inputdiv.querySelector('#refuseButton');

			acceptButton.remove();
			refuseButton.remove();
		}
		return acceptButton;
	}

	createRefuseButton() {
		const refuseButton = document.createElement('button');
		refuseButton.id = 'refuseButton';
		refuseButton.textContent = 'Refuse';
		refuseButton.classList.add('btn', 'btn-secondary', 'mt-3', 'm-2', 'border-dark');

		refuseButton.onclick = async (e) => {
			this.websocket.send(JSON.stringify({
				'message': '@refuse@',
				'user_id': await Iuser.getID()
			}));
			const inputdiv = document.querySelector('#inputDiv');
			const acceptButton = inputdiv.querySelector('#acceptButton');
			const refuseButton = inputdiv.querySelector('#refuseButton');

			acceptButton.remove();
			refuseButton.remove();
		}
		return refuseButton;
	}

	async checkInviteStatus(data, id) {
		if (data === '@accept@') {
			if (this.player1 === null)
				this.player1 = id;
			else if (this.player2 === null)
				this.player2 = id;
			return true;
		}
		else if (data === '@refuse@') {
			this.player1 = null;
			this.player2 = null;
			const inviteButton = document.querySelector('#inviteButton');
			const acceptButton = document.querySelector('#acceptButton');
			const refuseButton = document.querySelector('#refuseButton');
			inviteButton.disabled = false;

			if (acceptButton)
				acceptButton.remove();
			if (refuseButton)
				refuseButton.remove();
			return true;
		}
		return false;
	}

	async createChat() {
		let myid = await Iuser.getID()
		let roomName = ''
		const interactiondiv = document.querySelector('.interactionDiv');
		const inputDiv = interactiondiv.querySelector('#inputDiv');
		const input = inputDiv.querySelector('#messageInput');
		const sendButton = inputDiv.querySelector('#sendButton');
		const inviteButton = document.querySelector('#inviteButton');
		const blockstatus = await this.checkBlockStatus(this.targetid);
		if (myid > this.targetid)
			roomName = myid + '_' + this.targetid;
		else
			roomName = this.targetid + '_' + myid;

		if (!blockstatus){
	
			const response = await fetch(`https://${window.location.host}/api/chat/history/${roomName}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': Icookies.getCookie('token'),
					'X-CSRFToken': Icookies.getCookie('csrftoken')
				},
				credentials: 'include',
			});
			const data = await response.json();
			if (data.success) {
				if (data.data) {
					data.data.forEach(message => {
						if (message.message[0] !== '@')
							this.addMessage(message.user_id, message.message, message.timestamp);
					});
				}
			} else
				alert('Failed to get chat history');
		}


		this.websocket = new WebSocket(
			'wss://' + window.location.host + '/ws/chat/'
			+ roomName
			+ '/'
		);

		this.websocket.onmessage = async (e) => {
			const data = JSON.parse(e.data);
			const id = data['user_id'];
			const message = data['message'];
			const timestamp = data['time'];
			const invite = await this.checkInvite(message, id);
			const invitestatus = await this.checkInviteStatus(message, id);
			const blockstatus = await this.checkBlockStatus(id);
			if (invite) {
				inviteButton.disabled = true;
				this.createInviteButton();
			}
			else if (invitestatus) {
				if (!this.player1 && !this.player2)
					inviteButton.disabled = false;
			}
			else if (!blockstatus) {
				await this.addMessage(id, message, timestamp);
			}
			if (this.player1 && this.player2) {
				if (id == this.player1)
					window.location.href = "/play_pc"
				else
					setTimeout(() => { window.location.href = "/play_pc"; }, 500);
			}
		
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
			this.websocket.send(JSON.stringify({
				'message': message,
				'user_id': user_id
			}));
			input.value = '';
		}

		inviteButton.onclick = async (e) => {
			const user_id = await Iuser.getID();
			this.websocket.send(JSON.stringify({
				'message': '@invite@',
				'user_id': user_id
			}));
		}

	}
}
