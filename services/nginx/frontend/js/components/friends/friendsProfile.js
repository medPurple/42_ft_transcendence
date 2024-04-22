import Iuser from "../user/userInfo.js"
import Icookies from "../cookie/cookie.js"
import Ifriends from "./friendsInfo.js";

export class FriendsProfile extends HTMLElement{

    static get observedAttributes(){
        return ['username'];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.username_friends = this.getAttribute('username');

        const profileContainer = document.createElement('div');
        profileContainer.id = 'profile-friends-container';

        // Ajouter les éléments à l'ombre
        this.shadowRoot.appendChild(profileContainer);
        this.initFriendInfo();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'username') {
            this.username_friends = newValue;
            this.initFriendInfo();
        }
    }

    async initFriendInfo() {
        try {
            const data = await Ifriends.getFriend(this.username_friends);
            // Access other properties from data here
            let profilePictureData = data.user.profile_picture_data;
            this.displayFriendProfile(data, profilePictureData);

        } catch (error) {
            console.error('Error:', error)
        }
    }

    displayFriendProfile(data, profilePictureData){
        let profileContainer = this.shadowRoot.querySelector('#profile-friends-container');
        profileContainer.innerHTML = `
            <div id="profile-content">
                <img src="data:image/jpeg;base64,${profilePictureData}" alt="Profile Picture" class="profile-pic">
                <p><strong>Username:</strong> ${data.user.username}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>First Name:</strong> ${data.user.first_name}</p>
                <p><strong>Last Name:</strong> ${data.user.last_name}</p>
                <p><strong>Online:</strong> ${data.user.is_online}</p>
            </div>
        `;
    }
}

customElements.define('friends-profile', FriendsProfile);