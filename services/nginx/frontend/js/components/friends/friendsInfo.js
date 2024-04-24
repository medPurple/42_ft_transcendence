import Icookies from "../cookie/cookie.js"

class friendInfo {
	constructor(){
		this.jwtToken = Icookies.getCookie('token');
		this.csrfToken = Icookies.getCookie('csrftoken');
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

    async getFriend(username) {
        try {
			const response = await fetch(`api/friends/friends-list/${username}`, {
				method: 'GET',
				headers: {
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
			console.error('Error', error);
		}
    }

}

let Ifriends = new friendInfo();

export default Ifriends;