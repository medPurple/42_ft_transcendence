import "../../components/user/updatePasswordForm.js";
import Icookies from "../../components/cookie/cookie.js"

export default () => {
	let content = '';
	if (Icookies.getCookie('token')) {
		content = '<update-password-form></update-password-form>'
	} else {
		alert("You need to be logged in to update your password");
		window.location.href = '/home';
	}
	return content;
}
