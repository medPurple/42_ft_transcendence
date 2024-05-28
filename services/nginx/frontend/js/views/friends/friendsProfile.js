// import "../../components/friends/friendsProfileForm.js";
import { FriendsProfile } from "../../components/friends/friendsProfileForm.js";
import Icookies from "../../components/cookie/cookie.js"


export default async function friendsProfile(username) {
	if (Icookies.getCookie('token')) {
		return new FriendsProfile(username).initFriendsInfo();
	} else {
		const logdiv = document.createElement('div');
		logdiv.classList.add('not-logged');
		logdiv.innerText = "You need to be logged in to see your friends"
		document.body.appendChild(logdiv);
		return logdiv;
	}
}



//     return `
//     <body>
//     <div class="container">
//         <h1>HEYYYY ${username}</h1>
//         <p>Sorry, the page you are looking for could not be found.</p>
//         <p><a href="/">Return to the homepage</a></p>
//     </div>
// </body>
// `;
	// console.log(username);
    // let friendProfileElement = document.createElement('friend-profile');
    // friendProfileElement.setAttribute('username', username);
	// document.body.appendChild(friendProfileElement);
    // return friendProfileElement;


// let username =  'wil';
// let content = '<p> salut </p>'
// try {
// 	const response = await fetch(`api/friends/friends-list/${username}`, {
// 		method: 'GET',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'X-CSRFToken': Icookies.getCookie('csrftoken'),
// 			'Authorization': Icookies.getCookie('token')
// 		},
// 	});
// 	const data = await response.json();
// 	if (data.success) {
// 		content = '<p> success </p>';
// 	} else {
// 		alert('Failed to get friends');
// 	}
// } catch (error) {
// 	console.error('Error', error);
// }
// return content;
