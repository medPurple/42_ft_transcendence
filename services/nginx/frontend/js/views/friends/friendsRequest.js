import { Friends } from "../../components/friends/friendsRequestForm.js";
import Icookies from "../../components/cookie/cookie.js"

export default async () => {
	const logdiv = document.createElement('div');
	if (Icookies.getCookie('token')) {
		logdiv.appendChild(await new Friends().viewUsers());
		document.body.appendChild(logdiv);
	} else {
		alert("You need to be logged in to see your friends");
		window.location.href = '/home';
	}
	return logdiv;
}
