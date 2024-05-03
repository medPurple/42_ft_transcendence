// Initiate the router
// Import the views

import intro from "./views/intro.js";
import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";
import gameService from "./views/gameService.js";
import userService from "./views/user/userService.js";
import register from "./views/user/register.js";
import login from "./views/user/login.js";
import profile from "./views/user/profile.js";
import editProfile from "./views/user/editProfile.js";
import updatePassword from "./views/user/updatePassword.js";
import deleteAccount from "./views/user/deleteAccount.js";
import friends from "./views/friends/friends.js";
import friendsProfile from "./views/friends/friendsProfile.js";
import play from "./views/play.js";
import p404 from "./views/p404.js";
import { setup } from "./components/pong3d/pongLogic.js";

// Define the routes
const routes = {
	'/': {
		title: "Intro",
		render: intro
	},
	'/home': {
		title: "Home",
		render: home
	},
	'/about': {
		title: "About",
		render: about
	},
	'/contact': {
		title: "Contact",
		render: contact
	},
	'/userService': {
		title: "User Service",
		render: userService
	},
	'/gameService': {
		title: "Game Service",
		render: gameService
	},
	'/register': {
		title: "Register",
		render: register
	},
	'/login': {
		title: "Log In",
		render: login
	},
	'/profile': {
		title: "Profile",
		render: profile
	},
	'/edit-profile': {
		title: "Edit profile",
		render: editProfile
	},
	'/update-password': {
		title: "Update password",
		render: updatePassword
	},
	'/delete-account': {
		title: "Delete account",
		render: deleteAccount
	},
	'/friends': {
		title: "Friends",
		render: friends
	},
	'/friend-profile': {
		title: "Friends profile",
		render: friendsProfile
	},
	'/play' : {
		title: "Play",
		render: play
	},
	'/404' : {
		title: "404",
		render: p404
	}
};

function NavbarFooterVisibility() {
	const path = location.pathname;
	const showInRoute = ['/home', '/about', '/contact'];
	const showNavbarFooter = showInRoute.includes(path);

	const footer = document.getElementById('custom-footer');
	const navbar = document.getElementById('navbar');

	if (showNavbarFooter) {
		footer.classList.remove('hidden');
		navbar.classList.remove('hidden');
	}
}

async function router() {
	let path = location.pathname;
	let view = routes[path];
	const pageTitle = "Transcendence";

	NavbarFooterVisibility();

	if (view) {
		document.title = pageTitle + " | " + view.title;
		let result = await view.render();
		// console.log('route', result);
		
		if (result.includes("pong-renderer")) {
			setup();
		}
		
		//Clear the app content
		app.innerHTML = '';
		if (typeof result === 'string') {
			// If it's a string, user innerHTML
			app.innerHTML = result;
		} else if (result instanceof Node) {
            // If it's a Node, use appendChild
            app.appendChild(result);
        } else {
            // If it's neither, create a text node and append it
            let textNode = document.createTextNode(String(result));
            app.appendChild(textNode);
        }

	} else {
		history.replaceState("", "", "/404");
		router();
	}
}
// Handle navigation
window.addEventListener("click", (e) => {
	if (e.target.matches("[data-link]")) {
		e.preventDefault();
		history.pushState("", "", e.target.href);
		router();
	}
});

// Update router
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);