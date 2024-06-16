import { chat } from "../../components/chat/chatClass.js"
import Icookies from "../../components/cookie/cookie.js"

export default async () => {
	const div = document.createElement('div');
	if (Icookies.getCookie('token')) {
		div.appendChild(await new chat().initChat());
	} else {
		alert("You need to be logged in to see your friends");
		window.location.href = '/home';
	}
	return div;
}

