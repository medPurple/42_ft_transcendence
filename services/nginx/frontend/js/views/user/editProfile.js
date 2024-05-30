import "../../components/user/editProfileForm.js";
import Icookies from "../../components/cookie/cookie.js"

export default () => {
	let content = '';
	if (Icookies.getCookie('token')) {
		content = '<edit-profile-form></edit-profile-form>'
	} else {
		const logdiv = document.createElement('div');
		logdiv.classList.add('not-logged');
		logdiv.innerText = 'You need to be logged in to edit your profile';
		document.body.appendChild(logdiv);
		return logdiv;
	}
	return content;
}

