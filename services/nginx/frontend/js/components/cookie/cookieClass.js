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
	
		clearAllCookies() {
			// Récupérer tous les cookies
			var cookies = document.cookie.split(";");

			// Parcourir tous les cookies et les supprimer
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
			}
		}

}

