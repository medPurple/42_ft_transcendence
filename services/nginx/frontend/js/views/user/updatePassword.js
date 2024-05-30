import "../../components/user/updatePasswordForm.js";
import Icookies from "../../components/cookie/cookie.js"

export default () => {
	let content = '';
	if (Icookies.getCookie('token')) {
		content = '<update-password-form></update-password-form>'
	} else {
		const logdiv = document.createElement('div');
		logdiv.classList.add('not-logged');
		logdiv.innerText = 'You need to be logged in to update password';
		document.body.appendChild(logdiv);
		return logdiv;
	}
	return content;
}
