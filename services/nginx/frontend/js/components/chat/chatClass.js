import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"
import Ifriends from "../friends/friendsInfo.js";
import { API_BASE, WS_BASE } from "../../config.js"

// Inject chat styles once
function injectChatStyles() {
	if (document.getElementById('chat-styles')) return;
	const style = document.createElement('style');
	style.id = 'chat-styles';
	style.textContent = `
		#chatDiv {
			display: flex;
			height: calc(100vh - 80px);
			gap: 0;
			padding: 1rem;
		}
		#usersDiv {
			width: 240px;
			flex-shrink: 0;
			background: rgba(255,255,255,0.78);
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
			border: 1px solid rgba(255,255,255,0.4);
			border-radius: 14px 0 0 14px;
			box-shadow: 0 4px 24px rgba(0,0,0,0.09);
			overflow-y: auto;
			padding: 1rem 0.75rem;
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
		}
		#usersDiv .users-title {
			font-family: 'Courier New', monospace;
			font-size: 0.72rem;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: #aaa;
			padding: 0.25rem 0.5rem 0.5rem;
		}
		#usersDiv .user-btn {
			background: transparent;
			border: none;
			border-radius: 8px;
			padding: 0.5rem 0.75rem;
			text-align: left;
			font-size: 0.85rem;
			color: #1b1b1c;
			cursor: pointer;
			transition: background 0.15s;
			width: 100%;
		}
		#usersDiv .user-btn:hover,
		#usersDiv .user-btn.active { background: rgba(27,27,28,0.08); }

		.interactionDiv {
			flex: 1;
			display: flex;
			flex-direction: column;
			background: rgba(255,255,255,0.72);
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
			border: 1px solid rgba(255,255,255,0.4);
			border-left: none;
			border-radius: 0 14px 14px 0;
			box-shadow: 0 4px 24px rgba(0,0,0,0.09);
			overflow: hidden;
		}
		#titleDiv {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			padding: 0.75rem 1.25rem;
			border-bottom: 1px solid rgba(0,0,0,0.07);
			background: rgba(255,255,255,0.6);
			flex-shrink: 0;
		}
		#titleDiv h4 {
			font-family: 'Courier New', monospace;
			font-size: 0.9rem;
			font-weight: 700;
			margin: 0;
			flex: 1;
		}
		#titleDiv button {
			font-size: 0.75rem;
			padding: 0.3rem 0.75rem;
			border-radius: 6px;
			border: 1px solid rgba(27,27,28,0.15);
			background: rgba(27,27,28,0.06);
			color: #1b1b1c;
			cursor: pointer;
			transition: background 0.15s;
		}
		#titleDiv button:hover:not(:disabled) { background: #1b1b1c; color: #fff; }
		#titleDiv button:disabled { opacity: 0.4; cursor: default; }

		#messagesDiv {
			flex: 1;
			overflow-y: auto;
			padding: 1rem 1.25rem;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
		}
		.msg-bubble {
			max-width: 55%;
			padding: 0.5rem 0.85rem;
			border-radius: 12px;
			font-size: 0.85rem;
			line-height: 1.4;
			word-break: break-word;
		}
		.msg-bubble.mine {
			align-self: flex-end;
			background: #1b1b1c;
			color: #fff;
			border-bottom-right-radius: 4px;
		}
		.msg-bubble.theirs {
			align-self: flex-start;
			background: rgba(27,27,28,0.08);
			color: #1b1b1c;
			border-bottom-left-radius: 4px;
		}
		.msg-meta {
			font-size: 0.68rem;
			color: #aaa;
			margin-bottom: 0.15rem;
		}
		.msg-meta.mine { align-self: flex-end; }
		.msg-meta.theirs { align-self: flex-start; }

		#inputDiv {
			padding: 0.75rem 1.25rem;
			border-top: 1px solid rgba(0,0,0,0.07);
			background: rgba(255,255,255,0.6);
			display: flex;
			gap: 0.5rem;
			align-items: flex-end;
			flex-shrink: 0;
		}
		#messageInput {
			flex: 1;
			border-radius: 8px;
			border: 1px solid #ddd;
			padding: 0.5rem 0.75rem;
			font-size: 0.85rem;
			resize: none;
			outline: none;
			transition: border-color 0.2s;
			font-family: inherit;
		}
		#messageInput:focus { border-color: #1b1b1c; }
		#sendButton {
			background: #1b1b1c;
			color: #fff;
			border: none;
			border-radius: 8px;
			padding: 0.5rem 1rem;
			font-family: 'Courier New', monospace;
			font-size: 0.78rem;
			cursor: pointer;
			transition: opacity 0.15s;
			white-space: nowrap;
		}
		#sendButton:hover { opacity: 0.85; }

		#inviteButton { }
		#acceptButton { background: rgba(46,125,50,0.1); color: #2e7d32; border-color: rgba(46,125,50,0.3); }
		#acceptButton:hover { background: #2e7d32; color: #fff; }
		#refuseButton { background: rgba(198,40,40,0.08); color: #c62828; border-color: rgba(198,40,40,0.25); }
		#refuseButton:hover { background: #c62828; color: #fff; }

		.Nonediv {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255,255,255,0.72);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(255,255,255,0.4);
			border-left: none;
			border-radius: 0 14px 14px 0;
			box-shadow: 0 4px 24px rgba(0,0,0,0.09);
		}
		.Nonediv img { max-width: 320px; opacity: 0.7; }
	`;
	document.head.appendChild(style);
}

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
		injectChatStyles();
		const chatDiv = document.createElement('div');
		chatDiv.id = 'chatDiv';
		return chatDiv;
	}

	async createUsersDiv() {
		const usersDiv = document.createElement('div');
		usersDiv.id = 'usersDiv';

		const title = document.createElement('div');
		title.className = 'users-title';
		title.textContent = 'Conversations';
		usersDiv.appendChild(title);

		const response = await Iuser.getAllUsers();
		const id = await Iuser.getID();

		response.users.forEach(user => {
			if (user.user_id != id) {
				const userButton = document.createElement('button');
				userButton.className = 'user-btn';
				userButton.textContent = user.username;
				usersDiv.appendChild(userButton);
				userButton.onclick = async (e) => {
					usersDiv.querySelectorAll('.user-btn').forEach(b => b.classList.remove('active'));
					userButton.classList.add('active');
					this.targetid = user.user_id;
					const interactiondiv = document.querySelector('.interactionDiv');
					const Nonediv = document.querySelector('.Nonediv');
					if (Nonediv) {
						Nonediv.remove();
					} else {
						this.websocket.send(JSON.stringify({ 'message': '@refuse@', 'user_id': await Iuser.getID() }));
						this.player1 = null;
						this.player2 = null;
						this.websocket.close();
						interactiondiv.remove();
					}
					const newinteractiondiv = await this.createInteractionDiv();
					document.querySelector('#chatDiv').appendChild(newinteractiondiv);
					this.createChat();
				};
			}
		});
		return usersDiv;
	}

	async createMessagesDiv() {
		const messagesDiv = document.createElement('div');
		messagesDiv.id = 'messagesDiv';
		return messagesDiv;
	}

	createInputDiv() {
		const inputDiv = document.createElement('div');
		inputDiv.id = 'inputDiv';

		const input = document.createElement('textarea');
		input.id = 'messageInput';
		input.name = 'message';
		input.placeholder = 'Write a message…';
		input.rows = 1;

		const sendButton = document.createElement('button');
		sendButton.id = 'sendButton';
		sendButton.textContent = 'Send →';

		inputDiv.appendChild(input);
		inputDiv.appendChild(sendButton);
		return inputDiv;
	}

	async createTitleDiv() {
		const response = await Iuser.getAllUsers();
		let user = response.users.find(user => user.user_id === parseInt(this.targetid));

		const titleDiv = document.createElement('div');
		titleDiv.id = 'titleDiv';

		const titleElement = document.createElement('h4');
		titleElement.textContent = user.username;
		titleDiv.appendChild(titleElement);

		const inviteButton = document.createElement('button');
		inviteButton.id = 'inviteButton';
		inviteButton.textContent = 'Invite to play';
		titleDiv.appendChild(inviteButton);

		const getUserBlockStatut = await Ifriends.getUserBlock(user.username);
		if (getUserBlockStatut.user_blocked_other) {
			const unblockButton = document.createElement('button');
			unblockButton.id = 'unblockButton';
			unblockButton.textContent = 'Unblock';
			this.unblockExec(unblockButton, user.username);
			titleDiv.appendChild(unblockButton);
		} else if (getUserBlockStatut.other_user_blocked_user) {
			const blockedButton = document.createElement('button');
			blockedButton.textContent = 'Blocked';
			blockedButton.disabled = true;
			titleDiv.appendChild(blockedButton);
		} else {
			const blockButton = document.createElement('button');
			blockButton.id = 'blockButton';
			blockButton.textContent = 'Block';
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
					blockButton.textContent = 'Blocked';
					blockButton.disabled = true;
				}
			} catch (error) { console.log('Error:', error); }
		};
	}

	async unblockExec(unblockButton, username) {
		unblockButton.onclick = async () => {
			try {
				const res = await Ifriends.unblockUser(username);
				if (res.success) {
					unblockButton.textContent = 'Unblocked';
					unblockButton.disabled = true;
				}
			} catch (error) { console.log('Error:', error); }
		};
	}

	async checkBlockStatus(id) {
		const username = await this.getusername(id);
		try {
			const blockStatus = await Ifriends.getUserBlock(username);
			return !!blockStatus.success;
		} catch (error) { return false; }
	}

	async createInteractionDiv() {
		const interactiondiv = document.createElement('div');
		interactiondiv.classList.add('interactionDiv');

		const titleDiv  = await this.createTitleDiv();
		const messagesDiv = await this.createMessagesDiv();
		const inputDiv  = this.createInputDiv();

		interactiondiv.appendChild(titleDiv);
		interactiondiv.appendChild(messagesDiv);
		interactiondiv.appendChild(inputDiv);
		return interactiondiv;
	}

	createNonediv() {
		const Nonediv = document.createElement('div');
		Nonediv.classList.add('Nonediv');
		const img = new Image();
		img.src = '../images/Site/AloneAgain.gif';
		Nonediv.appendChild(img);
		return Nonediv;
	}

	async initChat() {
		const chatDiv  = this.createChatDiv();
		const usersDiv = await this.createUsersDiv();
		chatDiv.appendChild(usersDiv);
		chatDiv.appendChild(this.targetid ? await this.createInteractionDiv() : this.createNonediv());
		document.body.appendChild(chatDiv);
		return chatDiv;
	}

	async addMessage(user_id, message, timestamp) {
		const userID   = await Iuser.getID();
		const userName = await this.getusername(user_id);
		const mine     = user_id == userID;
		const messagediv = document.querySelector('#messagesDiv');

		const meta = document.createElement('div');
		meta.className = `msg-meta ${mine ? 'mine' : 'theirs'}`;
		meta.textContent = `${userName} · ${this.timerCalculation(timestamp)}`;
		messagediv.appendChild(meta);

		const bubble = document.createElement('div');
		bubble.className = `msg-bubble ${mine ? 'mine' : 'theirs'}`;
		bubble.textContent = message;
		messagediv.appendChild(bubble);

		messagediv.scrollTop = messagediv.scrollHeight;
	}

	timerCalculation(date) {
		try {
			const time = new Date(date);
			if (isNaN(time.getTime())) return '';
			return time.toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
		} catch { return ''; }
	}

	async checkInvite(data) {
		return data === '@invite@';
	}

	createInviteButton() {
		const messagediv = document.querySelector('#messagesDiv');
		const notice = document.createElement('div');
		notice.style.cssText = 'text-align:center;font-size:0.82rem;color:#2e7d32;padding:0.5rem;';
		notice.textContent = '🎮 Game invitation — accept or refuse below';
		messagediv.appendChild(notice);
		messagediv.scrollTop = messagediv.scrollHeight;

		const inputdiv = document.querySelector('#inputDiv');
		inputdiv.appendChild(this.createAcceptButton());
		inputdiv.appendChild(this.createRefuseButton());
	}

	createAcceptButton() {
		const btn = document.createElement('button');
		btn.id = 'acceptButton';
		btn.textContent = '✓ Accept';
		btn.onclick = async () => {
			this.websocket.send(JSON.stringify({ 'message': '@accept@', 'user_id': await Iuser.getID() }));
			btn.remove();
			document.querySelector('#refuseButton')?.remove();
		};
		return btn;
	}

	createRefuseButton() {
		const btn = document.createElement('button');
		btn.id = 'refuseButton';
		btn.textContent = '✗ Refuse';
		btn.onclick = async () => {
			this.websocket.send(JSON.stringify({ 'message': '@refuse@', 'user_id': await Iuser.getID() }));
			btn.remove();
			document.querySelector('#acceptButton')?.remove();
		};
		return btn;
	}

	async checkInviteStatus(data, id) {
		if (data === '@accept@') {
			if (this.player1 === null) this.player1 = id;
			else if (this.player2 === null) this.player2 = id;
			return true;
		} else if (data === '@refuse@') {
			this.player1 = null;
			this.player2 = null;
			document.querySelector('#inviteButton').disabled = false;
			document.querySelector('#acceptButton')?.remove();
			document.querySelector('#refuseButton')?.remove();
			return true;
		}
		return false;
	}

	async createChat() {
		let myid = await Iuser.getID();
		const roomName = myid > this.targetid
			? `${myid}_${this.targetid}`
			: `${this.targetid}_${myid}`;

		const blockstatus = await this.checkBlockStatus(this.targetid);

		if (!blockstatus) {
			const response = await fetch(`${API_BASE}/api/chat/history/${roomName}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': Icookies.getCookie('token'),
					'X-CSRFToken': Icookies.getCookie('csrftoken')
				},
				credentials: 'include',
			});
			const data = await response.json();
			if (data.success && data.data) {
				for (const msg of data.data) {
					if (msg.message[0] !== '@')
						await this.addMessage(msg.user_id, msg.message, msg.timestamp);
				}
			}
		}

		const token = Icookies.getCookie('token').replace('Bearer ', '');
		this.websocket = new WebSocket(`${WS_BASE}/ws/chat/${roomName}/?token=${token}`);

		const interactiondiv = document.querySelector('.interactionDiv');
		const inputDiv   = interactiondiv.querySelector('#inputDiv');
		const input      = inputDiv.querySelector('#messageInput');
		const sendButton = inputDiv.querySelector('#sendButton');
		const inviteButton = document.querySelector('#inviteButton');

		this.websocket.onmessage = async (e) => {
			const data      = JSON.parse(e.data);
			const id        = data['user_id'];
			const message   = data['message'];
			const timestamp = data['time'];
			const invite      = await this.checkInvite(message);
			const invitestatus = await this.checkInviteStatus(message, id);
			const bs          = await this.checkBlockStatus(id);

			if (invite) {
				inviteButton.disabled = true;
				this.createInviteButton();
			} else if (invitestatus) {
				if (!this.player1 && !this.player2) inviteButton.disabled = false;
			} else if (!bs) {
				await this.addMessage(id, message, timestamp);
			}

			if (this.player1 && this.player2) {
				if (id == this.player1) window.location.href = '/play_pc';
				else setTimeout(() => { window.location.href = '/play_pc'; }, 500);
			}
		};

		input.focus();
		input.onkeyup = (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				sendButton.click();
			}
		};

		sendButton.onclick = async () => {
			const message = input.value.trim();
			if (!message) return;
			this.websocket.send(JSON.stringify({ 'message': message, 'user_id': await Iuser.getID() }));
			input.value = '';
		};

		inviteButton.onclick = async () => {
			this.websocket.send(JSON.stringify({ 'message': '@invite@', 'user_id': await Iuser.getID() }));
		};
	}
}
