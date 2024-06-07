import "../../components/user/profileForm.js";
import Icookies from "../../components/cookie/cookie.js"

export default () => {
	let content = '';
	if (Icookies.getCookie('token')) {
		content = '<profile-form></profile-form>'
	} else {
		alert("You need to be logged in to see your profile");
		window.location.href = '/home';
	}
	return content;
}


