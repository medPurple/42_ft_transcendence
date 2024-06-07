import Icookies from "../cookie/cookie.js"

class friendsInfo {
	constructor(){
		this.jwtToken = Icookies.getCookie('token');
		this.csrfToken = Icookies.getCookie('csrftoken');
	}

    async getFriendsList() {
		try {
			const response = await fetch('/api/friends/friends-list/', {
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
				return data;
			}
		} catch (error) {
			return {friends: []};
		}
	}

    async getFriend(username) {
        try {
			const response = await fetch(`/api/friends/friends-list/${username}/`, {
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

	async getUserBlock(username){
		try {
			const response = await fetch(`/api/friends/block-list/${username}/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': Icookies.getCookie('token')
				},
			});
			const data = await response.json();
			if (data.success) {
				console.log(data);
				return data;
			} else {
				return false;
			}
		} catch (error) {
			console.error('Error', error);
		}
	}

	async blockUser(username){
		try {
			const response = await fetch(`/api/friends/block-list/${username}/`, {
				method: 'POST',
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
				alert('Failed to block user');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async unblockUser(username){
		try {
			const response = await fetch(`/api/friends/block-list/${username}/`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': Icookies.getCookie('token')
				},
			});
			const data = await response.json();
			if(data.success){
				return data;
			} else {
				alert('Failed to unblock user');
			}
		} catch (error) {
			console.error('Error', error);
		}
	}

}


let Ifriends = new friendsInfo();

export default Ifriends;
