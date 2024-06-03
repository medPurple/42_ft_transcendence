import Icookies from "../../components/cookie/cookie.js"

import { Statistics } from "../../components/user/statisticsInfo.js";

export default async () =>  {
	const logdiv = document.createElement('div');
	if (Icookies.getCookie('token')) {
		logdiv.appendChild(await new Statistics().displayStat());
	} else {
		logdiv.classList.add('not-logged');
		logdiv.innerText = 'You need to be logged in to edit your profile';
	}
	document.body.appendChild(logdiv);
	return logdiv;
}

