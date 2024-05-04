import Ifriends from "./friendsInfo.js";

export class FriendsProfile {
    
    constructor(username) {
        this.username = username;
    }

    async initFriendsInfo() {
        try {
            const data = await Ifriends.getFriend(this.username);
            let profilePictureData = data.friends.profile_picture_data;
            this.displayFriendsProfile(data, profilePictureData); 
            
        } catch (error) {
            console.error('Error:', error);
        }
    }

    displayFriendsProfile(data, profilePictureData){
        let profileContainer = document.createElement('div');
        profileContainer.id = 'profile-friends-container'; //needed?? check classes and ids
        document.querySelector('main').appendChild(profileContainer);
        profileContainer.innerHTML = `
            <div id="profile-content"> 
                <p> My friend ${data.friends.username} </p>
                <img src="data:image/jpeg;base64,${profilePictureData}" alt="Profile Picture" class="profile-pic">
                <p><strong>Username:</strong> ${data.friends.username}</p>
                <p><strong>First Name:</strong> ${data.friends.first_name}</p>
                <p><strong>Last Name:</strong> ${data.friends.last_name}</p>
                <p><strong>Online:</strong> ${data.friends.is_online}</p>
            </div>
        `;
        return profileContainer;
    }

}
