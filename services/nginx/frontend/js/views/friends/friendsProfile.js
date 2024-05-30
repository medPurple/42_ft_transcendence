// import "../../components/friends/friendsProfileForm.js";
import { FriendsProfile } from "../../components/friends/friendsProfileForm.js";
import Icookies from "../../components/cookie/cookie.js"


export default async function friendsProfile(username) {
	if (Icookies.getCookie('token')) {
		return new FriendsProfile(username).initFriendsInfo();
	} else {
		const logdiv = document.createElement('div');
		logdiv.classList.add('not-logged');
		logdiv.innerText = "You need to be logged in to see your friends"
		document.body.appendChild(logdiv);
		return logdiv;
	}
}
