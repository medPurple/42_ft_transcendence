import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"
import Ifriends from "../friends/friendsInfo.js";

export class chat {

	initChat() {
		const chatContainer = document.createElement('div');
		chatContainer.id = 'chat-container';

		const chatSocket = new WebSocket(
			'ws://'
			+ window.location.host
			+ '/api/wschat/'
		);

		// receive msg from server
		chatSocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			console.log(data);
			let message = "salut";
			chatSocket.send(JSON.stringify({
				"message": message,
			}));
		};

		// loosed connection with wbs
		chatSocket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly');
		};

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
