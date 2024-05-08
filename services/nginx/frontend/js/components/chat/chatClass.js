import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"
import Ifriends from "../friends/friendsInfo.js";

export class chat {

	initChat() {
		const chatContainer = document.createElement('div');
		chatContainer.id = 'chat-container';

		const chatLog = document.createElement('textarea');
		chatLog.id = 'chat-log';
		chatLog.cols = '100';
		chatLog.rows = '20';
		chatContainer.appendChild(chatLog);

		const chatMessageInput = document.createElement('input');
		chatMessageInput.id = 'chat-message-input';
		chatMessageInput.type = 'text';
		chatMessageInput.size = '100';
		chatContainer.appendChild(chatMessageInput);

		const chatMessageSubmit = document.createElement('input');
		chatMessageSubmit.id = 'chat-message-submit';
		chatMessageSubmit.type = 'button';
		chatMessageSubmit.value = 'Send';
		chatContainer.appendChild(chatMessageSubmit);

		const roomName = 'myroom';
		const chatSocket = new WebSocket(
			'wss://localhost:4430/ws/chat/'
			+ roomName
			+ '/'
		);

		// receive msg from server
		chatSocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			chatLog.value += (data.message + '\n');
		};

		// loosed connection with wbs
		chatSocket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly');
		};

		chatMessageInput.focus(); // Sets the focus to the chat message input field.
		chatMessageInput.onkeyup = function(e) {
			if (e.key === 'Enter') {
				chatMessageSubmit.click();
			}
		};

		chatMessageSubmit.onclick = async function(e) {
			const message = chatMessageInput.value;
			const user_id = await Iuser.getID();
			if (user_id === '') {
				console.error("You're not logged !");
			} else {
				chatSocket.send(JSON.stringify ({
					'message': message,
					'user_id': user_id
				}));
			}
			chatMessageInput.value = '';
		}

		// connection to wbs
		chatSocket.onopen = function(e) {
			console.log('Chat connexion');
			chatSocket.send(JSON.stringify({
				"message" : "test",
			}));
		};
		return chatContainer;
	}
}
