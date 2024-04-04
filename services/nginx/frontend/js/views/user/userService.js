import Icookies from "../../components/cookie/cookie.js"

export default function userService() {
    if (Icookies.getCookie("token")) {
        return `
        <h1>User Service</h1>
        <p>Welcome, Bobo !</p>
        <a href="/logout" data-link>Log out</a> <!-- New link -->
        `;
    } else {
        return `
        <h1>User Service</h1>
        <a href="/register" data-link>Register</a> <!-- New link -->
        <a href="/login" data-link>Log in</a> <!-- New link -->
        `;
    }
}
