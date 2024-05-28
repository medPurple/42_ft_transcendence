import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"

export default class gamerInfo {

	async getGamerSettings() {
		try {
			
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');
			let userId = await Iuser.getID();

			const response = await fetch(`api/pong/${userId}/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
					'Authorization': jwtToken,
				}
			});
			const data = await response.json();
	
			if (response.ok){
				return data
			} else {
				throw new Error('Failed to get gamer settings');
			}

		} catch (error) {
			console.error('Error', error);
			throw error;
		}
	}

	async getGamerInfo() {
		try {
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');
			let userId = await Iuser.getID();

			const response = await fetch(`api/pong/gamer/${userId}/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
					'Authorization': jwtToken,
				}
			});
			const data = await response.json();

			if (data.success){
				return data
			} else {
				throw new Error('Failed to get gamer info');
			}
		} catch (error) {
			console.error('Error', error);
			throw error;
		}
	
	}


	async getMatchInfo() {
		try {
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');
			let userId = await Iuser.getID();

			const response = await fetch(`api/pong/match/${userId}/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
					'Authorization': jwtToken,
				}
			});
			const data = await response.json();
			console.log(data);

			if (data.success){
				return data
			} else {
				throw new Error('Failed to get match info');
			}
		} catch (error) {
			console.error('Error', error);
			throw error;
		}
	}

}



