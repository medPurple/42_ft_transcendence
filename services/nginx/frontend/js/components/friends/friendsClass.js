import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"

class Friends {

	async sendFriendRequest(username) {
		try {
			const response = await fetch('api/friends/send-request/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': Icookies.getCookie('token')

				},
				body: JSON.stringify({friend_username: username})
			});
			const data = await response.json();
			if (data.success) {
				return 'Request sent';
			} else {
				alert('Failed to send request');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async getFriendsRequest() {
		try {
			const response = await fetch('api/friends/friend-request/', {
				method: 'GET',
				headears: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': Icookies.getCookie('token')
				},
			});
			const data = await response.json();
			if (data.success) {
				return data;
			} else {
				alert('Failed to get friends');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async acceptFriendRequest(username) {
		try {
			const response = await fetch('api/friends/friend-request/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': Icookies.getCookie('token')
				},
				body: JSON.stringify({friend_username: username})
			});
			const data = await response.json();
			if (data.success) {
				return 'Request accepted';
			} else {
				alert('Failed to accept friend request');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async rejectFriendRequest(username){
		try {
			const response = await fetch('api/friends/friend-request/', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': Icookies.getCookie('token')
				},
				body: JSON.stringify({friend_username: username})
			});
			const data = await response.json();
			if (data.success) {
				return 'Request rejected';
			} else {
				alert('Failed to reject friend request');
			} 
		} catch (error) {
			console.error('Error', error); 
		}
	}

	async getFriendsList() {
		try {
			const response = await fetch('api/friends/friends-list/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': Icookies.getCookie('token')
				}
			});
			const data = await response.json();
			if (data.success) {
				return data;
			} else {
				alert('Failed to get friends');
			}
		} catch (error) {
			console.error('Error', error);
		}
	}
}

export class FriendsButtons{

	constructor(friends) {
		this.friends = friends;
	}

	async viewUsers(){
		const usersList = document.createElement('div');
		usersList.id = 'users';
		const pUsers = document.createElement('p');
		pUsers.id = 'users-title';
		pUsers.textContent = 'Users';
		usersList.appendChild(pUsers);
		const ulElement = document.createElement('ul');
		ulElement.id = 'users-list';
		const dataUsers = await Iuser.getAllUsers();
		const currentUser = await Iuser.getUsername();
		const requestFriend = await this.friends.getFriendsRequest();
		const friendsList = await this.friends.getFriendsList();

		if (dataUsers.users.length > 1) {
			dataUsers.users.forEach(users => {
					if (currentUser != users.username) {
						const liElement = document.createElement('li');
						liElement.id = 'user';
						liElement.textContent = users.username;
						const hasFriendRequest = requestFriend.friend_requests.some(request => {
							return request.from_user === users.user_id || request.to_user === users.user_id;
						});
						const hasSendRequest = requestFriend.send_requests.some(request => { 
							return request.from_user === users.user_id || request.to_user === users.user_id;
						});
						const isFriends = friendsList.friends.some(friend => friend.user_id === users.user_id);
						if (isFriends) {
							this.isFriends(liElement);
						} else if (hasFriendRequest) {
							this.acceptOrRejectFriendRequest(liElement, users.username);
						} else if (hasSendRequest) {
							this.requestSent(liElement);
						} else {
							this.sendFriendRequestButton(liElement, users.username);
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

	async sendFriendRequestButton(liElement, username){
		const buttonSendRequest = document.createElement('button');
		buttonSendRequest.setAttribute('id', 'send-request-button');
		buttonSendRequest.textContent = 'Add Friend';
		buttonSendRequest.onclick = async () => {
			try {
				const requestIsValid = await this.friends.sendFriendRequest(username);
				console.log(requestIsValid);
				if (requestIsValid === 'Request sent') {
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

	acceptOrRejectFriendRequest(liElement, username){
		const buttonAcceptRequest = document.createElement('button');
		buttonAcceptRequest.setAttribute('id', 'accept-request-button');
		buttonAcceptRequest.textContent = 'Accept Request';

		const buttonRejectRequest = document.createElement('button');
		buttonRejectRequest.setAttribute('id', 'reject-request-button');
		buttonRejectRequest.textContent = 'Reject Request';
		this.acceptFriendRequestButton(buttonAcceptRequest, buttonRejectRequest, liElement, username);
		this.rejectFriendRequestButton(buttonAcceptRequest, buttonRejectRequest, liElement, username);
	}

	async acceptFriendRequestButton(buttonAcceptRequest, buttonRejectRequest, liElement, username){

		buttonAcceptRequest.onclick = async () => {
			try {
				const acceptIsValid = await this.friends.acceptFriendRequest(username);
				if (acceptIsValid === 'Request accepted') {
					buttonAcceptRequest.textContent = 'Request Accepted';
					buttonAcceptRequest.disabled = true;
					buttonRejectRequest.disabled = true;
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		liElement.appendChild(buttonAcceptRequest);
		return buttonAcceptRequest;
	}

	async rejectFriendRequestButton(buttonAcceptRequest, buttonRejectRequest,liElement, username){

		buttonRejectRequest.onclick = async () => {
			try {
				const rejectIsValid = await this.friends.rejectFriendRequest(username);
				if (rejectIsValid === 'Request rejected'){
					buttonRejectRequest.textContent = 'Request rejected';
					buttonRejectRequest.disabled = true;
					buttonAcceptRequest.disabled = true;
				} 
			} catch (error) {
				console.error('Error', error);
			}
		};
		liElement.appendChild(buttonRejectRequest);
		return buttonRejectRequest;
	}

	requestSent(liElement){
		const buttonRequestSent = document.createElement('button');
		buttonRequestSent.textContent = 'Request Sent';
		buttonRequestSent.disabled = true;
		liElement.appendChild(buttonRequestSent);
		return buttonRequestSent;
	}
	
	isFriends (liElement) {
		const buttonIsFriends = document.createElement('button');
		buttonIsFriends.textContent = 'See profile';
		buttonIsFriends.disabled = true;
		liElement.appendChild(buttonIsFriends);
		return buttonIsFriends;
	
	}
}


const friends = new Friends();
export { friends };

