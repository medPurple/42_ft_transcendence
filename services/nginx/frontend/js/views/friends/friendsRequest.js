import {Friends} from "../../components/friends/friendsRequestForm.js";
import Icookies from "../../components/cookie/cookie.js"

export default () => {
	const logdiv = document.createElement('div');
	if (Icookies.getCookie('token')) {
		logdiv.appendChild(new Friends().viewUsers());
	} else {
		logdiv.classList.add('not-logged');
		logdiv.innerText = "You need to be logged in to see your friends"
		document.body.appendChild(logdiv);
		return logdiv;
	}
}
