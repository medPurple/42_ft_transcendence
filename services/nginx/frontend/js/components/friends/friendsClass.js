import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"

class Friends {

	async getAllUser() {
		try {
			const data = await Iuser.getAllUsers();
			console.log(data);
		} catch (error) {
			console.error('Error:', error)
		}
	}
}

export class FriendsButtons{

	constructor(friends) {
		this.friends = friends;
	}

	viewUsers(){
		const buttonSendRequest = document.createElement('button');
		buttonSendRequest.setAttribute('class', 'button');
		buttonSendRequest.setAttribute('id', 'send-request-button');
		buttonSendRequest.textContent = 'Send Request';
		buttonSendRequest.onclick = () => {
			this.friends.getAllUser();
		}
		document.body.appendChild(buttonSendRequest);
		return buttonSendRequest;
	}

}

const friends = new Friends();
export { friends };

// const buttonSendRequest = document.createElement('button');
// buttonSendRequest.setAttribute('class', 'button');
// buttonSendRequest.setAttribute('id', 'send-request-button');
// buttonSendRequest.textContent = 'Send Request';
// this.shadowRoot.appendChild(buttonSendRequest);

// SendRequest(){
// 	// Backup info user
// 	fetch('/api/friends/send-request/', {
// 		method: 'POST',
// 		headers: {
// 			'Authorization': jwtToken,
// 			'X-CSRFToken': csrfToken
// 		}
// 	})
// 	.then(response => response.json())
// 	.then(data => {
// 		if (data.success) {
// 			console.log(data);
// 		} else {
// 			alert('Failed send request.')
// 		}
// 	})
// 	.catch(error => {
// 		console.error('Error:', error);
// 	});
// }
