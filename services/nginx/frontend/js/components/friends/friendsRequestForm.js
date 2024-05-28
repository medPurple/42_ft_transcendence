import Icookies from "../cookie/cookie.js";
import Iuser from "../user/userInfo.js";
import Ifriends from "./friendsInfo.js";

class FriendsButton {
	sendRequestButton() {
		const buttonSendRequest = document.createElement('button');
		buttonSendRequest.setAttribute('id', 'send-request-button');
		buttonSendRequest.classList.add('btn', 'btn-dark');
		buttonSendRequest.textContent = 'Add Friend';
		return buttonSendRequest;
	}

	acceptRequestButton() {
		const buttonAcceptRequest = document.createElement('button');
		buttonAcceptRequest.setAttribute('id', 'accept-request-button');
		buttonAcceptRequest.classList.add('btn', 'btn-dark');
		buttonAcceptRequest.textContent = 'Accept Request';
		return buttonAcceptRequest;
	}

	rejectRequestButton() {
		const buttonRejectRequest = document.createElement('button');
		buttonRejectRequest.setAttribute('id', 'reject-request-button');
		buttonRejectRequest.classList.add('btn', 'btn-light');
		buttonRejectRequest.textContent = 'Reject Request';
		return buttonRejectRequest;
	}

	requestSentButton() {
		const buttonRequestSent = document.createElement('button');
		buttonRequestSent.setAttribute('id', 'request-sent-button');
		buttonRequestSent.classList.add('btn', 'btn-light');
		buttonRequestSent.textContent = 'Request Sent';
		buttonRequestSent.disabled = true;
		return buttonRequestSent;
	}

	deleteFriendButton() {
		const buttonDeleteFriend = document.createElement('button');
		buttonDeleteFriend.setAttribute('id', 'delete-friend-button');
		buttonDeleteFriend.classList.add('btn', 'btn-dark');
		buttonDeleteFriend.textContent = 'Delete friend';
		return buttonDeleteFriend;
	}
}

export class Friends {
	constructor() {
		this.friendsButton = new FriendsButton();
		this.socket = this.connect();
		this.usersList = document.createElement('div');
		this.usersList.id = 'users';
		this.usersList.classList.add('container'); // Ajouter la classe Bootstrap pour créer un conteneur

		this.pUsers = document.createElement('p');
		this.pUsers.id = 'users-title';
		this.pUsers.classList.add('h3'); // Utiliser la classe Bootstrap pour définir la taille de la police
		// this.pUsers.textContent = 'Users';
		this.usersList.appendChild(this.pUsers);

		this.ulElement = document.createElement('div');
		this.ulElement.id = 'users-list';
		this.ulElement.classList.add('row');

		this.variablesArray = [];
		this.lastusernumber = 0;

		this.addEventListeners();
	}

	addEventListeners() {
		window.addEventListener('beforeunload', () => {
			this.disconnect();
		});

		window.addEventListener('popstate', () => {
			this.disconnect();
		});

		document.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				this.disconnect();
			});
		});
	}

	connect() {
		let token = Icookies.getCookie('token');
		const socket = new WebSocket(`wss://${window.location.host}/ws/friends/?token=${token}`);
		socket.onopen = function(e) {
			console.log("[open] Connection established");
		};

		socket.onmessage = async (event) => {
			console.log(`[message] Data received from server: ${event.data}`);
			let data = JSON.parse(event.data);
			if (data.error) {
				console.error(data.error);
			} else if (data.success) {
				console.log(data);
				if (socket.onmessagecallback) {
					socket.onmessagecallback(data);
					socket.onmessagecallback = null;
				}
			}
			await this.updateView();
		};

		socket.onclose = function(event) {
			if (event.wasClean) {
				console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
			} else {
				console.log('[close] Connection died');
			}
		};

		socket.onerror = function(error) {
			console.log(`[error] ${error.message}`);
		};

		return socket;
	}

	disconnect() {
		if (this.socket) {
			this.socket.close();
			console.log("[close] WebSocket connection closed");
		}const cardBody = this.createCardBody(user, isFriends);
	}

	async sendRequest(friend_username) {
		let message = JSON.stringify({
			command: "send_request",
			friend_username: friend_username
		});
		this.socket.send(message);

		return new Promise((resolve, reject) => {
			this.socket.onmessagecallback = resolve;
		});
	}

	async acceptRequest(friend_username) {
		let message = JSON.stringify({
			command: "accept_request",
			friend_username: friend_username
		});
		this.socket.send(message);

		return new Promise((resolve, reject) => {
			this.socket.onmessagecallback = resolve;
		});
	}

	async deleteRequest(friend_username) {
		let message = JSON.stringify({
			command: "delete_request",
			friend_username: friend_username
		});
		this.socket.send(message);

		return new Promise((resolve, reject) => {
			this.socket.onmessagecallback = resolve;
		});
	}

	async getRequests() {
		let message = JSON.stringify({
			command: "get_requests"
		});
		this.socket.send(message);

		return new Promise((resolve, reject) => {
			this.socket.onmessagecallback = resolve;
		});
	}

	async deleteFriendSoc(friend_username) {
		let message = JSON.stringify({
			command: "delete_friend",
			friend_username: friend_username
		});
		this.socket.send(message);

		return new Promise((resolve, reject) => {
			this.socket.onmessagecallback = resolve;
		});
	}

	async updateView() {
		const dataUsers = await Iuser.getAllUsers();
		const currentUser = await Iuser.getUsername();
		const requestFriend = await this.getRequests();
		const friendsList = await Ifriends.getFriendsList();

		if (dataUsers.users.length != this.lastusernumber) {
			this.ulElement.innerHTML = ''; // Clear the list before populating it
			await this.viewUsers();
		} else if (dataUsers.users.length > 1) {
			dataUsers.users.forEach(async (user) => {
				if (currentUser != user.username) {
					const bob = this.variablesArray.find(u => u.name === user.username);
					const cardElement = document.querySelector('#user_' + user.username);

					const hasFriendRequest = requestFriend.received_requests.some(request => {
						return request.from_user === user.user_id || request.to_user === user.user_id;
					});

					const hasSendRequest = requestFriend.sent_requests.some(request => {
						return request.from_user === user.user_id || request.to_user === user.user_id;
					});

					const isFriends = friendsList.friends.some(friend => friend.user_id === user.user_id);

					if (isFriends != bob.isFriends) {
						if (isFriends) {
							cardElement.innerHTML = ''; // Clear card content
							const cardBody = this.createCardBody(user, isFriends);
							this.manageFriend(cardBody.querySelector('.card-footer'), user.username);
							cardElement.appendChild(cardBody);
						}
						bob.isFriends = isFriends;
						bob.addFriend = false;
					} else if (hasFriendRequest != bob.hasFriendRequest) {
						if (hasFriendRequest) {
							cardElement.innerHTML = ''; // Clear card content
							const cardBody = this.createCardBody(user, isFriends);
							this.manageFriendRequest(cardBody.querySelector('.card-footer'), user.username);
							cardElement.appendChild(cardBody);
						}
						bob.hasFriendRequest = hasFriendRequest;
						bob.addFriend = false;
					} else if (hasSendRequest != bob.hasSendRequest) {
						if (hasSendRequest) {
							cardElement.innerHTML = ''; // Clear card content
							const cardBody = this.createCardBody(user, isFriends);
							cardBody.querySelector('.card-footer').appendChild(this.friendsButton.requestSentButton());
							cardElement.appendChild(cardBody);
						}
						bob.hasSendRequest = hasSendRequest;
						bob.addFriend = false;
					} else {
						if (!bob.addFriend && !hasSendRequest && !hasFriendRequest && !isFriends) {
							cardElement.innerHTML = ''; // Clear card content
							const cardBody = this.createCardBody(user, isFriends);
							this.sendFriendRequest(cardBody.querySelector('.card-footer'), user.username);
							cardElement.appendChild(cardBody);
							bob.addFriend = true;
						}
					}
				}
			});
		}
		this.lastusernumber = dataUsers.users.length;
	}


	async viewUsers() {
		const dataUsers = await Iuser.getAllUsers();
		this.lastusernumber = dataUsers.users.length;
		const currentUser = await Iuser.getUsername();
		const requestFriend = await this.getRequests();
		const friendsList = await Ifriends.getFriendsList();
		console.error(dataUsers);

		this.ulElement.innerHTML = ''; // Clear the list before populating it

		if (dataUsers.users.length > 1) {
			dataUsers.users.forEach(users => {
				if (currentUser != users.username) {

					// Add buttons based on friend status
					const hasFriendRequest = requestFriend.received_requests.some(request => {
						return request.from_user === users.user_id || request.to_user === users.user_id;
					});

					const hasSendRequest = requestFriend.sent_requests.some(request => {
						return request.from_user === users.user_id || request.to_user === users.user_id;
					});

					const isFriends = friendsList.friends.some(friend => friend.user_id === users.user_id);
					const cardElement = this.createCardBody(users, isFriends);
					const cardFooter = cardElement.querySelector('.card-footer');

					if (isFriends) {
						this.manageFriend(cardFooter, users.username);
					} else if (hasFriendRequest) {
						this.manageFriendRequest(cardFooter, users.username);
					} else if (hasSendRequest) {
						cardFooter.appendChild(this.friendsButton.requestSentButton());
					} else {
						this.sendFriendRequest(cardFooter, users.username);
					}

					this.ulElement.appendChild(cardElement);

					const column = document.createElement('div');
					column.classList.add('col-md-4'); // Définir la taille de la colonne Bootstrap
					column.appendChild(cardElement);

					this.ulElement.appendChild(column);

					this.variablesArray.push({
						name: users.username,
						hasFriendRequest: hasFriendRequest,
						hasSendRequest: hasSendRequest,
						isFriends: isFriends,
						addFriend: true
					});

					console.log(this.variablesArray);
				}
			});
		} else {
			const liElement = document.createElement('li');
			liElement.textContent = 'There are no other users. You are alone.';
			this.ulElement.appendChild(liElement);
		}
		this.usersList.appendChild(this.ulElement);
		document.body.appendChild(this.usersList);
		return this.usersList;
	}

	createCardBody(user, isFriend) {
		const cardElement = document.createElement('div');
		cardElement.className = 'card mb-3';
		cardElement.id = 'user_' + user.username;

		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';

		const userImage = document.createElement('img');
		userImage.src = `data:image/jpeg;base64,${user.profile_picture_data}`;
		userImage.alt = '';
		userImage.className = 'rounded-circle mb-3';
		userImage.width = 80;
		userImage.height = 80;

		const userName = document.createElement('h5');
		userName.className = 'card-title';
		userName.textContent = user.username;

		cardBody.appendChild(userImage);
		cardBody.appendChild(userName);

		cardElement.appendChild(cardBody);


		const cardFooter = document.createElement('div');
		cardFooter.className = 'card-footer';

		if (isFriend) {
			const linkToProfile = this.seeFriend(user.username);
			cardBody.appendChild(linkToProfile);
		} else {
			const message = this.createMessage();
			cardBody.appendChild(message);
		}

		cardElement.appendChild(cardFooter);

		return cardElement;
	}

	async sendFriendRequest(cardFooter, username) {
		const buttonSendRequest = this.friendsButton.sendRequestButton();
		buttonSendRequest.onclick = async () => {
			try {
				const requestIsValid = await this.sendRequest(username);
				console.log(requestIsValid);
				if (requestIsValid.success === true) {
					buttonSendRequest.textContent = 'Request Sent';
					buttonSendRequest.disabled = true;
				}
				console.log('Send request to: ' + username);
			} catch (error) {
				console.error('Error:', error);
			}
		};
		cardFooter.appendChild(buttonSendRequest);
		return buttonSendRequest;
	}

	async manageFriend(cardFooter, username) {
		const buttonDeleteFriend = this.friendsButton.deleteFriendButton();
		buttonDeleteFriend.onclick = async () => {
			try {
				const deleteFriend = await this.deleteFriendSoc(username);
				console.log(deleteFriend);
				if (deleteFriend.success === true) {
					cardFooter.innerHTML = ''; // Clear footer content
					this.sendFriendRequest(cardFooter, username);
				}
				console.log('Delete friend: ' + username);
			} catch (error) {
				console.error('Error:', error);
			}
		};
		cardFooter.appendChild(buttonDeleteFriend);
		return buttonDeleteFriend;
	}

	seeFriend(username){
		const linkToFriendsProfile = document.createElement('a');
		linkToFriendsProfile.textContent = 'See profile';
		linkToFriendsProfile.href = `/friend-profile/${username}`;
		linkToFriendsProfile.setAttribute('data-link', '');
		linkToFriendsProfile.addEventListener('click', () => {
			this.disconnect();
		});
		return linkToFriendsProfile;
	}


	getRandomSquidGamePhrase() {
		const phrases = [
			"Red Light, Green Light",
			"Deadly children's games",
			"Fight for survival",
			"Trust is rare",
			"Desperate for money",
			"Masked game masters",
			"High stakes competition",
			"Terrifying playground games",
			"Ultimate moral test",
			"Dangerous alliances form",
			"Debt-driven desperation",
			"Brutal elimination rounds",
			"Haunting, eerie masks",
			"Unexpected betrayals unfold",
			"Mind and strength tested"
		];

		const randomIndex = Math.floor(Math.random() * phrases.length);
		return phrases[randomIndex];
	}


	createMessage() {
		const messageLink = document.createElement('a');
		messageLink.textContent = this.getRandomSquidGamePhrase();
		messageLink.href = '#';
		messageLink.className = 'card-link';
		messageLink.setAttribute('data-link', '');
		messageLink.addEventListener('click', (event) => {
			event.preventDefault();
		});
		return messageLink;
	}


	async manageFriendRequest(cardFooter, username) {
		const buttonAcceptRequest = this.friendsButton.acceptRequestButton();
		buttonAcceptRequest.onclick = async () => {
			try {
				const acceptRequest = await this.acceptRequest(username);
				console.log(acceptRequest);
				if (acceptRequest.success === true) {
					cardFooter.innerHTML = ''; // Clear footer content
					this.manageFriend(cardFooter, username);
				}
				console.log('Accept request: ' + username);
			} catch (error) {
				console.error('Error:', error);
			}
		};

		const buttonRejectRequest = this.friendsButton.rejectRequestButton();
		buttonRejectRequest.onclick = async () => {
			try {
				const deleteRequest = await this.deleteRequest(username);
				console.log(deleteRequest);
				if (deleteRequest.success === true) {
					cardFooter.innerHTML = ''; // Clear footer content
					this.sendFriendRequest(cardFooter, username);
				}
				console.log('Reject request: ' + username);
			} catch (error) {
				console.error('Error:', error);
			}
		};

		cardFooter.appendChild(buttonAcceptRequest);
		cardFooter.appendChild(buttonRejectRequest);
		return cardFooter;
	}
}
