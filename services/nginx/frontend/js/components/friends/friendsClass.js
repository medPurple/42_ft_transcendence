import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"

// Est ce que l'ajout d'un ami fonctionne ou non ? A verifier dans le back. 

class Friends {

	async getAllUser() {
		try {
			const data = await Iuser.getAllUsers();
			return data;
		} catch (error) {
			console.error('Error:', error)
		}
	}

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
		const dataUsers = await this.friends.getAllUser();
		const currentUser = await Iuser.getUsername();
		const requestFriend = await this.friends.getFriendsRequest();

		if (dataUsers.users.length > 1) {
			dataUsers.users.forEach(users => {
					if (currentUser != users.username) {
						const liElement = document.createElement('li');
						liElement.id = 'user';
						liElement.textContent = users.username;
						const hasFriendRequest = requestFriend.friend_requests.some(request => {
							return request.from_user === users.user_id || request.to_user === users.user_id;
						});
						if (!hasFriendRequest) {
							this.sendFriendRequestButton(liElement, users.username);
						} else {
							this.acceptFriendRequestButton(liElement, users.username);
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

	async acceptFriendRequestButton(liElement, username){
		const buttonAcceptRequest = document.createElement('button');
		buttonAcceptRequest.setAttribute('id', 'accept-request-button');
		buttonAcceptRequest.textContent = 'Accept Friend';
		buttonAcceptRequest.onclick = async () => {
			try {
				const acceptIsValid = await this.friends.acceptFriendRequest(username);
				if (acceptIsValid === 'Request accepted') {
					buttonAcceptRequest.textContent = 'Request Accepted';
					buttonAcceptRequest.disabled = true;
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};
		liElement.appendChild(buttonAcceptRequest);
		return buttonAcceptRequest;
	}
}

const friends = new Friends();
export { friends };

