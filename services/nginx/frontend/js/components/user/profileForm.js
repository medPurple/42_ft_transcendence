import Iuser from "./userInfo.js"
import Icookies from "../cookie/cookie.js"

export default class profileForm extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}
	
	async connectedCallback() {
        await this.initUserInfo();
		this.initFormSubmit();
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
			<div id="profile-container">
				<div id="profile-content">
					<img src="${profilePictureUrl}" alt="Profile Picture" class="profile-pic">
					<p><strong>Username:</strong> ${data.user.username}</p>
					<p><strong>Email:</strong> ${data.user.email}</p>
					<p><strong>First Name:</strong> ${data.user.first_name}</p>
					<p><strong>Last Name:</strong> ${data.user.last_name}</p>
					<p><strong>Online:</strong> ${data.user.is_online}</p>
					<button id="edit-profile-button" type="button" >Edit Profile</button>
				</div>
				<div id="edit-profile" style="display:none;">
					<form id="edit-profile-form">
					<label for="profile_picture">Profile Picture:</label>
					<input type="file" id="profile_picture" name="profile_picture">
						<label for="username">Username:</label>
						<input type="text" id="username" name="username" value="${data.user.username}">
						<label for="email">Email:</label>
						<input type="email" id="email" name="email" value="${data.user.email}">
						<label for="first_name">First Name:</label>
						<input type="text" id="first_name" name="first_name" value="${data.user.first_name}">
						<label for="last_name">Last Name:</label>
						<input type="text" id="last_name" name="last_name" value="${data.user.last_name}">
						<label for="password">Password:</label>
						<input type="password" id="password" name="password">					
						<input type="submit" value="Save Changes">
					</form>
				</div>
			</div>	
			` ;
		
			this.shadowRoot.querySelector('#edit-profile-button').addEventListener('click', () => {
                this.shadowRoot.querySelector('#profile-content').style.display = 'none';
                this.shadowRoot.querySelector('#edit-profile').style.display = 'block';
			
			});
		
		} catch (error) {
			console.error('Error:', error)
		}
	}
	initFormSubmit() {
		const editForm = this.shadowRoot.getElementById('edit-profile-form'); // Use getElementById to find the form within the component
		editForm.addEventListener('submit', function(event) {
			event.preventDefault();
			let jwtToken = Icookies.getCookie('token');
			let csrfToken = Icookies.getCookie('csrftoken');
			let formData = new FormData(editForm);
			// Send an AJAX request to submit the form
			fetch('/api/profiles/edit-profile/', {
				method: 'POST',
				body: formData,
				headers: {
					'Authorization': jwtToken,
					'X-CSRFToken': csrfToken
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					console.log('Profile updated successfully');
					// Redirect to the home page
						window.location.href = '/'; // Change the URL to your home page URL

				} else {
					// Display validation errors or any other error message
					alert('An error occurred. Please try again.');
				}
			})
			.catch(error => {
				console.error('Error:', error);
				// Handle API errors
			});
		});
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