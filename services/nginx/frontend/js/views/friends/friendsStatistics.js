import { FriendsStatistics } from "../../components/friends/friendsStatisticsInfo.js";
import Icookies from "../../components/cookie/cookie.js"

export default async function friendsStatistics(username) {
	const logdiv = document.createElement('div');
	if (Icookies.getCookie('token')) {
		logdiv.appendChild(await new FriendsStatistics(username).initFriendsStatistics());
		document.body.appendChild(logdiv);
	} else {
		alert("You need to be logged in to see your friends");
		window.location.href = '/home';
	}
	return logdiv;
}
