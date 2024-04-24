import "../../components/friends/friendsProfile.js";
import Icookies from "../../components/cookie/cookie.js"

export default async function friendsProfile() {

	let username =  'wil';
	let content = '<p> salut </p>'
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
			content = '<p> success </p>';
		} else {
			alert('Failed to get friends');
		}
	} catch (error) {
		console.error('Error', error);
	}
	return content;

}
