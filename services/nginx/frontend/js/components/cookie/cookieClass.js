// The getCookie function you provided is used to retrieve the CSRF token from the "csrftoken" cookie.
// This CSRF token is necessary to protect POST requests against Cross-Site Request Forgery (CSRF) attacks.
export default class Cookies{

	getCookie(name) {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				let cookie = cookies[i].trim();
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}


	setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		var encodedValue = encodeURIComponent(value || "");
		document.cookie = name + "=" + encodedValue + expires + "; path=/; SameSite=None";

	}
}

