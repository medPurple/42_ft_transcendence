import Icookies from "../cookie/cookie.js"

export default class userInfo {

	async getID() {
		let jwtToken = Icookies.getCookie('token');
		let csrfToken = Icookies.getCookie('csrftoken');

		console.log("TOKEN BEFORE : " + jwtToken);

		try {
			const response = await fetch('/api/token/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
					'Authorization': jwtToken
				}
			});

			if (!response.ok) {
				throw new Error('identification failed');
			}

			const data = await response.json();
			console.log(data.user_id);
			return data.user_id;
		} catch (error) {
			console.error('Error:', error);
			throw error; // Propager l'erreur
		}
	}

	async getUsername() {
		try {
			const userID = await this.getID();
			console.log(userID);
			const response = await fetch(`api/profiles/${userID}`, {
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error('Failed to get username');
			}

			const data = await response.json();
			console.log("data : ", data);
			return data.username;
		} catch (error) {
			console.error('Error:', error);
			throw error; // Propager l'erreur
		}
	}
}
