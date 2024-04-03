
import getUsername from "../../components/user/getUsername.js";
import isLoggedUser from "../../components/user/isLoggedUser.js";

export default function userService() {
    if (isLoggedUser()) {
        return `
        <h1>User Service</h1>
        <p>Welcome, ${getUsername()}!</p>
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