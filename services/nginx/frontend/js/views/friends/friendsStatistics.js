import { FriendsStatistics } from "../../components/friends/friendsStatisticsForm.js";
import Icookies from "../../components/cookie/cookie.js"


export default async function friendsStatistics(username) {
	const logdiv = document.createElement('div');
	if (Icookies.getCookie('token')) {
		logdiv.appendChild(await new FriendsStatistics(username).initFriendsStatistics());
	} else {
		logdiv.classList.add('not-logged');
		logdiv.innerText = "You need to be logged in to see your friends"
		document.body.appendChild(logdiv);
	}
	return logdiv;
}
