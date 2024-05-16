import Ifriends from "./friendsInfo.js";

export class FriendsProfile {

	constructor(username) {
		this.username = username;
	}

	async initFriendsInfo() {
		try {
			const data = await Ifriends.getFriend(this.username);
			let profilePictureData = data.friends.profile_picture_data;
			const profileContainer = this.displayFriendsProfile(data, profilePictureData);
			return profileContainer;
		} catch (error) {
			console.error('Error:', error);
		}
	}

    displayFriendsProfile(data, profilePictureData){
        let profileContainer = document.createElement('div');
        profileContainer.id = 'profile-friends-container'; //needed?? check classes and ids
        document.querySelector('main').appendChild(profileContainer);
        profileContainer.innerHTML = `

        <div class="d-flex justify-content-center">
        <div class="card text-center" style="width: 20rem;">
            <img src="data:image/jpeg;base64,${profilePictureData}" class="card-img-top profile-pic" alt="Profile Picture">
            <div class="card-body">
                <h5 class="card-title">${data.user.username}</h5>
                <p class="card-text">Description text here to do, something funny about the student</p>
            </div>
            <ul id="profile-content" class="list-group list-group-flush">
                <li class="list-group-item">${data.user.first_name}</li>
                <li class="list-group-item">${data.user.last_name}</li>
                <li class="list-group-item">${data.user.email}</li>
                <li class="list-group-item">online: ${data.user.is_online}</li>	
            </ul>
            <div class="card-footer text-body-secondary">
                footer here
            </div>
        </div>
        </div>

        `;
        return profileContainer;
    }

}
