// import "../../components/friends/friendsProfileForm.js";
import { FriendsProfile } from "../../components/friends/friendsProfileForm.js";
import Icookies from "../../components/cookie/cookie.js"


export default async function friendsProfile(username) {
	const logdiv = document.createElement('div');
	if (Icookies.getCookie('token')) {
		logdiv.appendChild(await new FriendsProfile(username).initFriendsInfo());
	} else {
		logdiv.classList.add('not-logged');
		logdiv.innerText = "You need to be logged in to see your friends"
		document.body.appendChild(logdiv);
	}
	return logdiv;
}
