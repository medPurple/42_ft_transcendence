import Icookies from "../cookie/cookie.js"

export default class userInfo {

	async connectedCallback() {
		try {
			const username = await this.getUsername();
			console.log(username);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async getUsername() {
		let jwtToken = Icookies.getCookie('token');
		let csrfToken = Icookies.getCookie('csrftoken');
		try {
			const response = await fetch('api/profiles/user/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
					'Authorization': jwtToken
				}
			});
			const data = await response.json();
			if (data.success) {
				return data.user.username;
			} else {
				throw new Error('Failed to get username');
			}
		} catch (error) {
			console.error('Error:', error);
			throw error; // share the error
		}
	}
}


	// async getID() {
	// 	let jwtToken = Icookies.getCookie('token');
	// 	let csrfToken = Icookies.getCookie('csrftoken');

	// 	try {
	// 		const response = await fetch('/api/token/', {
	// 			method: 'GET',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				'X-CSRFToken': csrfToken,
	// 				'Authorization': jwtToken
	// 			}
	// 		}); 
	// 		if (!response.ok) {
	// 			throw new Error('identification failed');
	// 		}
	// 		const data = await response.json();
	// 		return data.user_id;
	// 	} catch (error) {
	// 		console.error('Error:', error);
	// 		throw error; // share the error
	// 	}
	// }

