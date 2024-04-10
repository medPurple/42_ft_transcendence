import Icookies from "../../components/cookie/cookie.js"
import userInfo from "../../components/user/userInfo.js"
import "../../components/user/logoutForm.js";

export default async function userService() {
	const userInfoInstance = new userInfo();
	let welcomeMessage = '';
	let content = '';

	if (Icookies.getCookie("token")) {
		try {
			const username = await userInfoInstance.getUsername(); // Appel synchrone
			welcomeMessage = `Welcome, ${username} !`;
			content = `
				<h1>User Service</h1>
				<p>${welcomeMessage}</p>
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
