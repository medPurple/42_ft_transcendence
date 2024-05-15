// async sendFriendRequest(username) {
// 	try {
// 		const response = await fetch('api/friends/send-request/', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-CSRFToken': Icookies.getCookie('csrftoken'),
// 				'Authorization': Icookies.getCookie('token')

// 			},
// 			body: JSON.stringify({friend_username: username})
// 		});
// 		const data = await response.json();
// 		if (data.success) {
// 			return 'Request sent';
// 		} else {
// 			alert('Failed to send request');
// 		}
// 	} catch (error) {
// 		console.error('Error:', error);
// 	}
// }

// async getFriendsRequest() {
// 	try {
// 		const response = await fetch('api/friends/friend-request/', {
// 			method: 'GET',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-CSRFToken': Icookies.getCookie('csrftoken'),
// 				'Authorization': Icookies.getCookie('token')
// 			},
// 		});
// 		const data = await response.json();
// 		if (data.success) {
// 			return data;
// 		} else {
// 			alert('Failed to get friends');
// 		}
// 	} catch (error) {
// 		console.error('Error:', error);
// 	}
// }

// async acceptFriendRequest(username) {
// 	try {
// 		const response = await fetch('api/friends/friend-request/', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-CSRFToken': Icookies.getCookie('csrftoken'),
// 				'Authorization': Icookies.getCookie('token')
// 			},
// 			body: JSON.stringify({friend_username: username})
// 		});
// 		const data = await response.json();
// 		if (data.success) {
// 			return 'Request accepted';
// 		} else {
// 			alert('Failed to accept friend request');
// 		}
// 	} catch (error) {
// 		console.error('Error:', error);
// 	}
// }

// async deleteFriend(username) {
// 	try {
// 		const response = await fetch('api/friends/friends-list/', {
// 			method: 'DELETE',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-CSRFToken': Icookies.getCookie('csrftoken'),
// 				'Authorization': Icookies.getCookie('token')
// 			},
// 			body: JSON.stringify({friend_username: username})
// 		});
// 		const data = await response.json();
// 		if(data.success){
// 			return 'Friend deleted';
// 		} else {
// 			alert('Failed to delet friend');
// 		}
// 	} catch (error) {
// 		console.error('Error', error);
// 	}
// }
// async rejectFriendRequest(username){
// 	try {
// 		const response = await fetch('api/friends/friend-request/', {
// 			method: 'DELETE',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-CSRFToken': Icookies.getCookie('csrftoken'),
// 				'Authorization': Icookies.getCookie('token')
// 			},
// 			body: JSON.stringify({friend_username: username})
// 		});
// 		const data = await response.json();
// 		if (data.success) {
// 			return 'Request rejected';
// 		} else {
// 			alert('Failed to reject friend request');
// 		}
// 	} catch (error) {
// 		console.error('Error', error);
// 	}
// }

import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"
import Ifriends from "./friendsInfo.js";

class FriendsButton {

	sendRequestButton() {
		const buttonSendRequest = document.createElement('button');
		buttonSendRequest.setAttribute('id', 'send-request-button');
		buttonSendRequest.textContent = 'Add Friend';
		return buttonSendRequest;
	}

	acceptRequestButton() {
		const buttonAcceptRequest = document.createElement('button');
		buttonAcceptRequest.setAttribute('id', 'accept-request-button');
		buttonAcceptRequest.textContent = 'Accept Request';
		return buttonAcceptRequest;

	}

	rejectRequestButton() {
		const buttonRejectRequest = document.createElement('button');
		buttonRejectRequest.setAttribute('id', 'reject-request-button');
		buttonRejectRequest.textContent = 'Reject Request';
		return buttonRejectRequest;

	}

	requestSent() {
		const buttonRequestSent = document.createElement('button');
		buttonRequestSent.setAttribute('id', 'request-sent-button');
		buttonRequestSent.textContent = 'Request Sent';
		buttonRequestSent.disabled = true;
		return buttonRequestSent;
	}

	// deleteFriend(){
		// 	const buttonDeleteFriend = document.createElement('button');
		// 	buttonDeleteFriend.setAttribute('id', 'delete-friend-button');
		// 	buttonDeleteFriend.textContent = 'Delete friend';
		// 	return buttonDeleteFriend;
		// }

	}

	export class Friends {

		constructor() {
			this.friendsButton = new FriendsButton();
		}

		async connect() {
			let token = Icookies.getCookie('token');
			const socket = new WebSocket(`wss://localhost:4430/ws/friends/?token=${token}`);
			socket.onopen = function(e) {
				console.log("[open] Connection established");
			};

		socket.onmessage = function(event) {
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

	async sendRequest(socket, friend_username) {
		let message = JSON.stringify({
			command: "send_request",
			friend_username: friend_username
		});
		socket.send(message);

		return new Promise((resolve, reject) => {
			socket.onmessagecallback = resolve;
		});
	}

	async acceptRequest(socket, friend_username) {
		let message = JSON.stringify({
			command: "accept_request",
			friend_username: friend_username
		});
		socket.send(message);

		return new Promise((resolve, reject) => {
			socket.onmessagecallback = resolve;
		});
	}

	async deleteRequest(socket, friend_username) {
		let message = JSON.stringify({
			command: "delete_request",
			friend_username: friend_username
		});
		socket.send(message);

		return new Promise((resolve, reject) => {
			socket.onmessagecallback = resolve;
		});
	}

	async getRequests(socket) {
		let message = JSON.stringify({
			command: "get_requests"
		});
		socket.send(message);

		return new Promise((resolve, reject) => {
			socket.onmessagecallback = resolve;
		});
	}

	async deleteFriend(socket, friend_username) {
		let message = JSON.stringify({
			command: "delete_friend",
			friend_username: friend_username
		});
		socket.send(message);

		return new Promise((resole, reject) => {
			socket.onmessagecallback = resole;
		});
	}

	async viewUsers(){

		const socket = await this.connect();
		const usersList = document.createElement('div');
		usersList.id = 'users';
		const pUsers = document.createElement('p');
		pUsers.id = 'users-title';
		pUsers.textContent = 'Users';
		usersList.appendChild(pUsers);
		const ulElement = document.createElement('ul');
		ulElement.id = 'users-list';

		const dataUsers = await Iuser.getAllUsers();
		console.log("Fetched users:", dataUsers);
		const currentUser = await Iuser.getUsername();
		console.log("Current user:", currentUser);
		const requestFriend = await this.getRequests(socket);
		console.log("Friend requests:", requestFriend);
		const friendsList = await Ifriends.getFriendsList();
		console.log("Friends list:", friendsList);

		if (dataUsers.users.length > 1) {
			dataUsers.users.forEach(users => {
				if (currentUser != users.username) {
					const liElement = document.createElement('li');
					liElement.id = 'user';
					liElement.textContent = users.username;
					const hasFriendRequest = requestFriend.received_requests.some(request => {
						return request.from_user === users.user_id || request.to_user === users.user_id;
					});
					const hasSendRequest = requestFriend.sent_requests.some(request => {
						return request.from_user === users.user_id || request.to_user === users.user_id;
					});
					const isFriends = friendsList.friends.some(friend => friend.user_id === users.user_id);
					if (isFriends) {
						this.manageFriend(socket, liElement, users.username);
						// this.seeFriend(socket,liElement, users.username);
						// this.deleteFriend(socket, liElement, users.username);
					} else if (hasFriendRequest) {
						this.manageFriendRequest(socket, liElement, users.username);
						// this.acceptFriendRequest(socket,liElement, users.username);
						// this.rejectFriendRequest(socket, liElement, users.username);
					} else if (hasSendRequest) {
						liElement.appendChild(this.friendsButton.requestSent());
					} else {
						this.sendFriendRequest(socket, liElement, users.username);
					}
					ulElement.appendChild(liElement);
				}
			});
		} else {
					const liElement = document.createElement('li');
					liElement.textContent = 'There are no other users. You are alone.';
					ulElement.appendChild(liElement);
		}
		usersList.appendChild(ulElement);
		document.body.appendChild(usersList);
		return usersList;
	}

	async sendFriendRequest(socket, liElement, username){
		const buttonSendRequest = this.friendsButton.sendRequestButton()
		buttonSendRequest.onclick = async () => {
			try {
				const requestIsValid = await this.sendRequest(socket, username);
				console.log(requestIsValid);
				if (requestIsValid === true) {
					buttonSendRequest.textContent = 'Request Sent';
					buttonSendRequest.disabled = true;
				}
				console.log('Send request to: ' + username);
			} catch (error) {
				console.error('Error:', error);
			}
		};
		liElement.appendChild(buttonSendRequest);
		return buttonSendRequest;
	}

	manageFriend(socket, liElement, username) {
		this.seeFriend(liElement, username);
		this.deleteFriendButton(socket, liElement, username);

	}

	manageFriendRequest(socket, liElement, username) {
		const buttonAcceptRequest = this.friendsButton.acceptRequestButton();
		const buttonRejectRequest = this.friendsButton.rejectRequestButton()
		liElement.appendChild(buttonAcceptRequest);
		liElement.appendChild(buttonRejectRequest);
		this.acceptFriendRequest(socket, liElement, username, buttonAcceptRequest);
		this.rejectFriendRequest(socket, liElement, username, buttonRejectRequest);

	}


	async acceptFriendRequest(socket, liElement, username, buttonAcceptRequest){
		buttonAcceptRequest.onclick = async () => {
			try {
				const acceptIsValid = await this.acceptRequest(socket, username);
				if (acceptIsValid === true) {
					buttonAcceptRequest.textContent = 'Request Accepted';
					buttonAcceptRequest.style.display = 'none';
					const test = document.querySelector('#reject-request-button');
					test.remove();
					// this.seeFriendOrDeleteFriend(liElement, username);
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		return buttonAcceptRequest;

	}

	async rejectFriendRequest(socket, liElement, username, buttonRejectRequest){
		buttonRejectRequest.onclick = async () => {
			try {
				const rejectIsValid = await this.deleteRequest(socket, username);
				if (rejectIsValid === true){
					buttonRejectRequest.textContent = 'Request rejected';
					const buttonAcceptRequest = document.querySelector('#accept-request-button');
					buttonAcceptRequest.remove();
					// buttonRejectRequest.style.display = 'none';
					// this.sendFriendRequestButton(liElement, username);
				}
			} catch (error) {
				console.error('Error', error);
			}
		};
		liElement.appendChild(buttonRejectRequest);
		return buttonRejectRequest;

	}

	seeFriend(liElement, username) {
		const linkToFriendsProfile = document.createElement('a');
		linkToFriendsProfile.textContent = 'See profile';
		linkToFriendsProfile.href = `/friend-profile/${username}`;
		linkToFriendsProfile.setAttribute('data-link', '');
		liElement.appendChild(linkToFriendsProfile);
		return linkToFriendsProfile;
	}




	async deleteFriendButton(socket, liElement, username) {

		const buttonDeleteFriend = document.createElement('button');
		buttonDeleteFriend.setAttribute('id', 'delete-friend-button');
		buttonDeleteFriend.textContent = 'Delete friend';
		buttonDeleteFriend.onclick = async () => {
			try {
				const deleteIsValid = await this.deleteFriend(socket, username);
				if (deleteIsValid === true) {
					buttonDeleteFriend.textContent = 'Friend deleted';
					buttonDeleteFriend.style.display = 'none';
					// linkToFriendsProfile.style.display = 'none';
					// this.sendFriendRequestButton(liElement, username);

				}
			} catch (error) {
				console.error('Error', error);
			}
		};
		liElement.appendChild(buttonDeleteFriend);
		return buttonDeleteFriend;
	}
}


// const friends = new Friends();
// const socket = await friends.connect();
// friends.viewUsers(socket);
// export { Friends };

