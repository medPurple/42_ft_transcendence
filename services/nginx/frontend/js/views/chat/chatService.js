import { chat } from "../../components/chat/chatClass.js"
import Icookies from "../../components/cookie/cookie.js"

export default () => {
    if (Icookies.getCookie('token')) {
        new chat().initChat();
    } else {
		alert("You need to be logged in to see your friends");
        window.location.href = '/home';
	}
}
