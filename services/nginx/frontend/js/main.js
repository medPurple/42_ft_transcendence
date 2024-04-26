// Initiate the router
// Import the views

import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";
import gameService from "./views/gameService.js";
import userService from "./views/user/userService.js";
import chatService from "./views/chat/chatService.js";
import register from "./views/user/register.js";
import login from "./views/user/login.js";
import profile from "./views/user/profile.js";
import editProfile from "./views/user/editProfile.js";
import updatePassword from "./views/user/updatePassword.js";
import deleteAccount from "./views/user/deleteAccount.js";
import friendsRequest from "./views/friends/friendsRequest.js";
import friendsProfile from "./views/friends/friendsProfile.js";
import play from "./views/play.js";
import p404 from "./views/p404.js";

// Define the routes
const routes = {
	'/': {
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
		render: friendsRequest
	},
    '/friend-profile/:username': {
        title: "Friends profile",
        render: async (params) => {
            // params.username contiendra le nom d'utilisateur
            let username = params.username;
            return await friendsProfile(username);
        }
	},
	'/play': {
		title: "Play",
		render: play
	},
	'/chat': {
		title: "Chat",
		render: chatService
	},
	'/404' : {
		title: "404",
		render: p404
	}
};

// Define a function to show or hide the navigation bar based on the route
function navbarVisibility() {
	const path = location.pathname;

	// Check if the current route requires hiding the navigation bar
	const hideNavbarRoutes = ['/']; // Add routes here where you want to hide the navigation bar
	const hideNavbar = hideNavbarRoutes.includes(path);

	  // Select the navigation bar
	const navbar = document.getElementById('navbar');

	 // Add or remove the 'hidden' class based on whether the navigation bar should be hidden or not
	if (hideNavbar) {
		navbar.classList.add('hidden');
	} else {
		navbar.classList.remove('hidden');
	}
}


// Define the router function that will render the view based on the route path name and update the browser history state
async function router() {
	let path = location.pathname;
	let view = null;

	for (let route in routes) {
		let params = {}
		if (route.includes(':')) {
			let routeParts = route.split('/');
			let pathParts = path.split('/');
			if (routeParts.length === pathParts.length) {
				let match = true;
				for (let i = 0; i < routeParts.length; i++) {
					if (routeParts[i].startsWith(':')) {
						params[routeParts[i].substring(1)] = pathParts[i];
					} else if (routeParts[i] !== pathParts[i]) {
						match = false;
						break;
					}
				}
				if (match) {
					view = routes[route];
					view.params = params; 
					break;
				}
			}
		} else if (route === path) {
			view = routes[route];
			view.params = params; 
			break;
		}
	}
        
	const pageTitle = "Transcendence";

	if (view) {
		document.title = pageTitle + " | " + view.title;
		let result = await view.render(view.params);

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
		navbarVisibility();

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



