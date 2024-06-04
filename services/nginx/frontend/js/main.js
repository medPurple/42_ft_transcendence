// Initiate the router
// Import the views

import intro from "./views/intro.js";
import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";
import pongService from "./views/pong3d/pongService.js";
import game from "./views/game.js";
import pongSettings from "./views/pong3d/pongSettings.js";
import metaService from "./views/pokemon/metaService.js";
// import pokemap from "./views/pokemon/pokemap.js";
import code2FA from "./views/user/code2FA.js";
import chatService from "./views/chat/chatService.js";
import register from "./views/user/register.js";
import login from "./views/user/login.js";
import profile from "./views/user/profile.js";
import editProfile from "./views/user/editProfile.js";
import updatePassword from "./views/user/updatePassword.js";
import deleteAccount from "./views/user/deleteAccount.js";
import friendsRequest from "./views/friends/friendsRequest.js";
import friendsProfile from "./views/friends/friendsProfile.js";
import friendsStatistics from "./views/friends/friendsStatistics.js";
import { pong_remoteplay, pong_tournamentplay, pkm_remoteplay, pokemap_interactive} from "./views/play.js";
import p404 from "./views/p404.js";
import Icookies from "./components/cookie/cookie.js";
import statistics from "./views/user/statistics.js";
import "./components/user/logoutForm.js";

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
	'/pongService': {
		title: "Pong Service",
		render: pongService
	},
	'/gameService': {
		title: "Game Service",
		render: game
	},
	'/pongSettings': {
		title: "Pong Settings",
		render: pongSettings
	},
	'/pongEnd/:player': {
		title: "Pong End",
		render: async (params) => {
			let winner = params.player;
			return await pongEnd(winner);
		}
	},
	'/metaService': {
		title: "Meta Service",
		render: metaService
	},
	'/register': {
		title: "Register",
		render: register
	},
	'/login': {
		title: "Log In",
		render: login
	},
	'/code2FA': {
		title: "2FA",
		render: code2FA
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
	'/statistics': {
		title: "Statistics",
		render: statistics
	},
	'/statistics/:username': {
		title: "Friends statistics",
		render: async (params) => {
            // params.username contiendra le nom d'utilisateur
            let username = params.username;
            return await friendsStatistics(username);
        }
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
	'/play_pl': {
		title: "Pong Local Play",
		render: pong_localplay
	},
	'/play_pr': {
		title: "Pong Remote Play",
		render: pong_remoteplay
	},
	'/play_pt': {
		title: "Pong Tournament Play",
		render: pong_tournamentplay
	},
	'/play_pkr': {
		title: "Pokemon Remote Play",
		render: pkm_remoteplay
	},
	'/pokemap': {
		title: "Pokemon Map",
		render: pokemap_interactive
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

function NavbarFooterVisibility() {
	const path = location.pathname;
	const showInRoute = ['/home', '/about', '/contact', '/login', '/register', '/404', '/profile', '/edit-profile', '/update-password', '/delete-account', '/friends', '/friend-profile', '/chat', '/play', '/pongService', '/pongSettings', '/metaService', '/pokemap', '/play_pr', '/play_pkr'];
	const showNavbarFooter = showInRoute.includes(path);

	const footer = document.getElementById('custom-footer');
	const navbar = document.getElementById('navbar');

	if (showNavbarFooter) {
		footer.classList.remove('hidden');
		navbar.classList.remove('hidden');
	}
}

function updateNavbarDropdown() {
	var dropdownMenu = document.getElementById("navbar-dropdown-menu");

	var condition = checkConnected();

	if (condition) {
		dropdownMenu.innerHTML = `
			<li><a class="dropdown-item" href="/profile">settings</a></li>
			<li><a class="dropdown-item" href="/friends">friends</a></li>
			<li><a class="dropdown-item" href="/chat">chat</a></li>
			<li><a class="dropdown-item" href="/play">play</a></li>
			<li><hr class="dropdown-divider"></li>
			<li><logout-form></logout-form></li>
			<li><a class="dropdown-item" href="/delete-account">delete profile</a></li>
			`;
	} else {
		dropdownMenu.innerHTML = `
			<li><a class="dropdown-item" href="/login">log in</a></li>
			<li><a class="dropdown-item" href="/register">register</a></li>
			`;
	}
}
		// <li><a class="dropdown-item" href="/logout">log out</a></li>

function checkConnected() {

	if (Icookies.getCookie('token')) {
		return true;
	}
	return false;
}


async function checkValidToken() {
	const token = Icookies.getCookie('token');
	if (token){
		try {
			const response = await fetch('/api/token/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': Icookies.getCookie('csrftoken'),
					'Authorization': token
				}
			});

			if (response.ok){
				return true
			} else {
				throw new Error('Failed to get user info');
			}
		} catch (error) {
			return false;
		}
	}
	return true;
} 

async function router() {
	let path = location.pathname;
	let view = null;
	if (!(await checkValidToken())){
		alert('Invalid token, please reload');
		Icookies.clearAllCookies();

	}
	else{
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
		
		NavbarFooterVisibility();
		updateNavbarDropdown();
		
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
			
		} else {
			history.replaceState("", "", "/404");
			router();
		}
		// Handle navigation
		window.addEventListener("click", (e) => {
			if (e.target.matches("[data-link]")) {
				e.preventDefault();
				history.pushState("", "", e.target.href);
				router();
			}
		});
	}
}
	
// Update router
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);

