import Icookie from "../cookie/cookie.js"
import Iuser from "./userInfo.js"

// try {
// 	const username = await Iuser.getUsername();
// 	welcomeMessage = `Welcome, ${username} !`;
// 	content = `
// 		<h1>User Service</h1>
// 		<p>${welcomeMessage}</p>

export default class profileForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}
	
	async connectedCallback() {
        await this.initUserInfo();
    }
     
	async initUserInfo() {
		try {
			const data = await Iuser.getAllUserInfo();
			// Access other properties from data here
			const baseUrl = 'http://localhost:8000';
			const profilePictureUrl = `${baseUrl}${data.user.profile_picture}`;
			console.log(profilePictureUrl);
			console.log(data.user.profile_picture);
			this.shadowRoot.innerHTML = `
			<div class="profile-container">
				<div class="profile-content">
					<img src="${profilePictureUrl}" alt="Profile Picture" class="profile-pic">
					<p><strong>Username:</strong> ${data.user.username}</p>
					<p><strong>Email:</strong> ${data.user.email}</p>
					<p><strong>First Name:</strong> ${data.user.first_name}</p>
					<p><strong>Last Name:</strong> ${data.user.last_name}</p>
					<p><strong>Online:</strong> ${data.user.is_online}</p>
					<button type="editprofile" >Edit Profile</button>
				</div>
			</div>	
			`
		} catch (error) {
			console.error('Error:', error)
		}
	}
}

customElements.define('profile-form', profileForm);

/* <p><strong>Email:</strong> {{ user_profile.email }}</p>
<p><strong>First Name:</strong> {{ user_profile.first_name }}</p>
<p><strong>Last Name:</strong> {{ user_profile.last_name }}</p>
<p><strong>Token:</strong> {{ user_profile.token }}</p>
<p><strong>Online:</strong> {{user_profile.is_online }}</p>
<button type="???" >Edit Profile</button>
</div> */

			// <div class="profile-header">
			// 	<img
			// 	src={this.state.userInfo.profileImg}
			// 	alt="ProfilePicture"
			// 	class="profile-picture"/>
			// </div>


// {% block content %}
// 	<h1>User Profile</h1>
// 		<div class="user-info">
// 			<img src="{{ user_profile.profile_picture.url }}" alt="Profile Picture" class="profile-pic">
// 			<p><strong>Username:</strong> {{ user_profile.username }}</p>
// 			<p><strong>Email:</strong> {{ user_profile.email }}</p>
// 			<p><strong>First Name:</strong> {{ user_profile.first_name }}</p>
// 			<p><strong>Last Name:</strong> {{ user_profile.last_name }}</p>
// 			<p><strong>Token:</strong> {{ user_profile.token }}</p>
// 			<p><strong>Online:</strong> {{user_profile.is_online }}</p>
// 			<p><a href="{% url 'edit_profile' %}"  class="button" >Edit Profile</a></p>
// 		</div>
// 		<a href="{% url 'friends' %}" class="button">See my friends</a>

// 	<a href="{% url 'delete_account' %}"  class="button">Supprimer mon compte</a>
// {% endblock %}