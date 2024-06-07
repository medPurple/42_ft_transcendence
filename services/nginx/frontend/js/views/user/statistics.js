import Icookies from "../../components/cookie/cookie.js"

import { Statistics } from "../../components/user/statisticsInfo.js";

export default async () =>  {
	const logdiv = document.createElement('div');
	if (Icookies.getCookie('token')) {
		logdiv.appendChild(await new Statistics().displayStat());
		document.body.appendChild(logdiv);
	} else {
		alert("You need to be logged in to see your statistics");
		window.location.href = '/home';
	}
	return logdiv;
}

