import "../../components/user/deleteAccountForm.js";
import Icookies from "../../components/cookie/cookie.js"

export default () => {
	let content = '';
	if (Icookies.getCookie('token')) {
		content = `
		<div id="app-general-container">
			<div class="mb-4">
				<h2>Delete Profile</h2>
			</div>
			<delete-account-form></delete-account-form>
		</div>`
	} else {
		alert("You need to be logged in to delete your account");
		window.location.href = '/home';
	}
	return content;
}


