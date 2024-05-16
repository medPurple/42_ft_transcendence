import Icookies from "../../components/cookie/cookie.js"
import Iuser from "../../components/user/userInfo.js"
import "../../components/user/logoutForm.js";

export default async function userService() {
	let welcomeMessage = '';
	let content = '';

	if (Icookies.getCookie('token')) {
		try {
			const id = await Iuser.getID();
			welcomeMessage = `Welcome, ${id} !`;
			content = `
				<h1>User Service</h1>
				<p>${welcomeMessage}</p>
				<a href="/profile" data-link>See my profile</a><br>
				<logout-form></logout-form>
				`;
			} catch (error) {
				console.error('Error:', error);
			}
	} else {
		content = `
			<h1>User Service</h1>
			<a href="/register" data-link>Register</a> <!-- New link -->
			<a href="/login" data-link>Log in</a> <!-- New link -->
		`;
	}
	return content;
}
