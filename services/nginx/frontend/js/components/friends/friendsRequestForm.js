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

	requestSentButton() {
		const buttonRequestSent = document.createElement('button');
		buttonRequestSent.setAttribute('id', 'request-sent-button');
		buttonRequestSent.textContent = 'Request Sent';
		buttonRequestSent.disabled = true;
		return buttonRequestSent;
	}



	deleteFriendButton(){
			const buttonDeleteFriend = document.createElement('button');
			buttonDeleteFriend.setAttribute('id', 'delete-friend-button');
			buttonDeleteFriend.textContent = 'Delete friend';
			return buttonDeleteFriend;
	}

	seeFriend(username){
		const linkToFriendsProfile = document.createElement('a');
		linkToFriendsProfile.textContent = 'See profile';
		linkToFriendsProfile.href = `/friend-profile/${username}`;
		linkToFriendsProfile.setAttribute('data-link', '');
		return linkToFriendsProfile;
	}

}

export class Friends {

	constructor() {
		this.friendsButton = new FriendsButton();
		this.socket = this.connect();
		this.usersList = document.createElement('div');
		this.usersList.id = 'users';
		this.pUsers = document.createElement('p');
		this.pUsers.id = 'users-title';
		this.pUsers.textContent = 'Users';
		this.usersList.appendChild(this.pUsers);
		this.ulElement = document.createElement('ul');
		this.ulElement.id = 'users-list';

		this.variablesArray = [];
		this.lastusernumber = 0;
	}

	connect() {
		let token = Icookies.getCookie('token');
		const socket = new WebSocket(`wss://` + window.location.host +`:4430/ws/friends/?token=${token}`);
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


	async updateView(){
		const dataUsers = await Iuser.getAllUsers();
		console.log("Fetched users:", dataUsers);
		const currentUser = await Iuser.getUsername();
		console.log("Current user:", currentUser);
		const requestFriend = await this.getRequests();
		console.log("Friend requests:", requestFriend);
		const friendsList = await Ifriends.getFriendsList();
		console.log("Friends list:", friendsList);

		if (dataUsers.users.length != this.lastusernumber){
			while (this.ulElement.firstChild) {
				this.ulElement.removeChild(this.ulElement.firstChild);
			}
			await this.viewUsers();
		}
		else if (dataUsers.users.length > 1) {
			console.log("array Updateview", this.variablesArray);
			dataUsers.users.forEach(async (users) => {
				if (currentUser != users.username) {
					const bob = this.variablesArray.find(user => user.name === users.username)
					const liElement = document.querySelector('#user_' + users.username);

					const hasFriendRequest = requestFriend.received_requests.some(request => {
						return request.from_user === users.user_id || request.to_user === users.user_id;
					});

					const hasSendRequest = requestFriend.sent_requests.some(request => {
						return request.from_user === users.user_id || request.to_user === users.user_id;
					});

					const isFriends = friendsList.friends.some(friend => friend.user_id === users.user_id);
					console.warn("request friend ", requestFriend);
					console.warn("friend list", friendsList);
					console.warn("previous ", bob);
					console.warn("friends now", isFriends)
					console.warn("hasFriendRequest now", hasFriendRequest)
					console.warn("hasSendRequest now", hasSendRequest)

					if (isFriends != bob.isFriends) {
						console.log(liElement)
						if (isFriends){
							while (liElement.firstChild) {
								liElement.removeChild(liElement.firstChild);
							}
							liElement.id = 'user_' + users.username;
							liElement.textContent = users.username;
							this.manageFriend(liElement, users.username);
						}
						bob.isFriends = isFriends;
						bob.addFriend = false;

					} else if (hasFriendRequest != bob.hasFriendRequest) {
						console.log(liElement)

						if (hasFriendRequest){
							while (liElement.firstChild) {
								liElement.removeChild(liElement.firstChild);
							}
							liElement.id = 'user_' + users.username;
							liElement.textContent = users.username;
							this.manageFriendRequest(liElement, users.username);
						}
						bob.hasFriendRequest = hasFriendRequest;
						bob.addFriend = false;

					} else if (hasSendRequest != bob.hasSendRequest) {
						console.log(liElement)
						if (hasSendRequest){
							while (liElement.firstChild) {
								liElement.removeChild(liElement.firstChild);
							}
							liElement.id = 'user_' + users.username;
							liElement.textContent = users.username;
							liElement.appendChild(this.friendsButton.requestSentButton());
						}
						bob.hasSendRequest = hasSendRequest;
						bob.addFriend = false;

					} else {
						if (!bob.addFriend &&
							!hasSendRequest &&
							!hasFriendRequest &&
							!isFriends
							){
							while (liElement.firstChild) {
								liElement.removeChild(liElement.firstChild);
							}
							liElement.id = 'user_' + users.username;
							liElement.textContent = users.username;
							this.sendFriendRequest(liElement, users.username);
							bob.addFriend = true
						}

					}
				}
			});
		}
		this.lastusernumber = dataUsers.users.length;
	}


	async viewUsers(){



		const dataUsers = await Iuser.getAllUsers();
		this.lastusernumber = dataUsers.users.length;

		console.log("Fetched users:", dataUsers);
		const currentUser = await Iuser.getUsername();
		console.log("Current user:", currentUser);
		const requestFriend = await this.getRequests();
		console.log("Friend requests:", requestFriend);
		const friendsList = await Ifriends.getFriendsList();
		console.log("Friends list:", friendsList);

		if (dataUsers.users.length > 1) {
			dataUsers.users.forEach(users => {
				if (currentUser != users.username) {
					const liElement = document.createElement('li');
					liElement.id = 'user_' + users.username;
					liElement.textContent = users.username;

					const hasFriendRequest = requestFriend.received_requests.some(request => {
						return request.from_user === users.user_id || request.to_user === users.user_id;
					});
					console.log("HAS FRIEND REQUEST : "+ hasFriendRequest);
					const hasSendRequest = requestFriend.sent_requests.some(request => {
						return request.from_user === users.user_id || request.to_user === users.user_id;
					});
					console.log("HAS SEND REQUEST : "+ hasSendRequest);
					const isFriends = friendsList.friends.some(friend => friend.user_id === users.user_id);
					console.log("IS FRIENDS : "+ isFriends);
					if (isFriends) {
						this.manageFriend(liElement, users.username);
					} else if (hasFriendRequest) {
						this.manageFriendRequest(liElement, users.username);
					} else if (hasSendRequest) {
						liElement.appendChild(this.friendsButton.requestSentButton());
					} else {
						this.sendFriendRequest(liElement, users.username);
					}
					this.variablesArray.push({
						name: users.username,
						hasFriendRequest: hasFriendRequest,
						hasSendRequest: hasSendRequest,
						isFriends:isFriends,
						addFriend:true
					});

					this.ulElement.appendChild(liElement);
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

	async sendFriendRequest(liElement, username){
		const buttonSendRequest = this.friendsButton.sendRequestButton()
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
		liElement.appendChild(buttonSendRequest);
		return buttonSendRequest;
	}

	manageFriend(liElement, username) {
		const buttonDeleteFriend = this.friendsButton.deleteFriendButton();
		const linkToFriendsProfile = this.friendsButton.seeFriend(username);
		liElement.appendChild(buttonDeleteFriend);
		liElement.appendChild(linkToFriendsProfile);
		// this.seeFriend(liElement, username);
		this.deleteFriend(liElement, username, buttonDeleteFriend, linkToFriendsProfile);
	}


	async deleteFriend(liElement, username, buttonDeleteFriend, linkToFriendsProfile) {

		buttonDeleteFriend.onclick = async () => {
			try {
				const deleteIsValid = await this.deleteFriendSoc(username);
				console.log(deleteIsValid);
				if (deleteIsValid.success === true) {
					buttonDeleteFriend.textContent = 'Friend deleted';
					// buttonDeleteFriend.style.display = 'none';
					// linkToFriendsProfile.style.display = 'none';
					// this.sendFriendRequest(liElement, username);

				}
			} catch (error) {
				console.error('Error', error);
			}
		};
		return buttonDeleteFriend;
	}

	manageFriendRequest(liElement, username) {
		const buttonAcceptRequest = this.friendsButton.acceptRequestButton();
		const buttonRejectRequest = this.friendsButton.rejectRequestButton()
		liElement.appendChild(buttonAcceptRequest);
		liElement.appendChild(buttonRejectRequest);
		this.acceptFriendRequest(liElement, username, buttonAcceptRequest);
		this.rejectFriendRequest(liElement, username, buttonRejectRequest);

	}


	async acceptFriendRequest(liElement, username, buttonAcceptRequest){
		buttonAcceptRequest.onclick = async () => {
			try {
				const acceptIsValid = await this.acceptRequest(username);
				if (acceptIsValid.success === true) {
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

	async rejectFriendRequest(liElement, username, buttonRejectRequest){
		buttonRejectRequest.onclick = async () => {
			try {
				const rejectIsValid = await this.deleteRequest(username);
				if (rejectIsValid.success === true){
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

}


// const friends = new Friends();
// const socket = await friends.connect();
// friends.viewUsers(socket);
// export { Friends };
