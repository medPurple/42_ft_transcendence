import "../../components/user/editProfileForm.js";
import Icookies from "../../components/cookie/cookie.js"

export default () => {
	let content = '';
	if (Icookies.getCookie('token')) {
		content = '<edit-profile-form></edit-profile-form>'
	} else {
		alert("You need to be logged in to edit your profile");
		window.location.href = '/home';
	}
	return content;
}

