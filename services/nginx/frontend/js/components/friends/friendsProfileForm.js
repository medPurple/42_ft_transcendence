import Ifriends from "./friendsInfo.js";

export class FriendsProfile {

	constructor(username) {
		this.username = username;
	}

	async initFriendsInfo() {
		try {
			const data = await Ifriends.getFriend(this.username);
            console.error("DATA: ", data)
			let profilePictureData = data.friends.profile_picture_data;
			const profileContainer = this.displayFriendsProfile(data, profilePictureData);
			return profileContainer;
		} catch (error) {
			console.error('Error:', error);
		}
	}

    displayFriendsProfile(data, profilePictureData) {
        let profileContainer = document.createElement('div');
        profileContainer.className = 'd-flex justify-content-center'; // Appliquer la classe Bootstrap pour centrer les éléments horizontalement
        profileContainer.id = 'profile-friends-container';
        document.querySelector('main').appendChild(profileContainer);
    
        // Créer la structure Bootstrap de la carte
        let cardDiv = document.createElement('div');
        cardDiv.className = 'card text-center';
        cardDiv.style.width = '20rem';
    
        let cardImage = document.createElement('img');
        cardImage.src = `data:image/jpeg;base64,${profilePictureData}`;
        cardImage.className = 'card-img-top profile-pic';
        cardImage.alt = 'Profile Picture';
    
        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';
    
        let cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = data.friends.username;
    
        let cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = 'Description text here to do, something funny about the student'; // Vous pouvez remplacer cela par la description réelle si vous en avez
    
        let cardList = document.createElement('ul');
        cardList.id = 'profile-content';
        cardList.className = 'list-group list-group-flush';
    
        let listItems = `
            <li class="list-group-item"><strong>Username:</strong> ${data.friends.username}</li>
            <li class="list-group-item"><strong>First Name:</strong> ${data.friends.first_name}</li>
            <li class="list-group-item"><strong>Last Name:</strong> ${data.friends.last_name}</li>
            <li class="list-group-item"><strong>Online:</strong> ${data.friends.is_online}</li>
        `;
    
        cardList.innerHTML = listItems;
    
        let cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer text-body-secondary';
        cardFooter.textContent = 'footer here';
    
        // Assemblez la structure de la carte
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
    
        cardDiv.appendChild(cardImage);
        cardDiv.appendChild(cardBody);
        cardDiv.appendChild(cardList);
        cardDiv.appendChild(cardFooter);
    
        profileContainer.appendChild(cardDiv);
    
        return profileContainer;
    }
    

}

        // <div class="d-flex justify-content-center">
        // <div class="card text-center" style="width: 20rem;">
        //     <img src="data:image/jpeg;base64,${profilePictureData}" class="card-img-top profile-pic" alt="Profile Picture">
        //     <div class="card-body">
        //         <h5 class="card-title">${data.user.username}</h5>
        //         <p class="card-text">Description text here to do, something funny about the student</p>
        //     </div>
        //     <ul id="profile-content" class="list-group list-group-flush">
        //         <li class="list-group-item">${data.user.first_name}</li>
        //         <li class="list-group-item">${data.user.last_name}</li>
        //         <li class="list-group-item">${data.user.email}</li>
        //         <li class="list-group-item">online: ${data.user.is_online}</li>	
        //     </ul>
        //     <div class="card-footer text-body-secondary">
        //         footer here
        //     </div>
        // </div>
        // </div>


// import Ifriends from "./friendsInfo.js";

// export class FriendsProfile {

// 	constructor(username) {
// 		this.username = username;
// 	}

// 	async initFriendsInfo() {
// 		try {
// 			const data = await Ifriends.getFriend(this.username);
//             console.error("DATA: ", data)
// 			let profilePictureData = data.friends.profile_picture_data;
// 			const profileContainer = this.displayFriendsProfile(data, profilePictureData);
// 			return profileContainer;
// 		} catch (error) {
// 			console.error('Error:', error);
// 		}
// 	}

//     displayFriendsProfile(data, profilePictureData){
//         let profileContainer = document.createElement('div');
//         profileContainer.id = 'profile-friends-container'; //needed?? check classes and ids
//         document.querySelector('main').appendChild(profileContainer);
//         profileContainer.innerHTML = `
//         <div id="profile-content">
//             <p> My friend ${data.friends.username} </p>
//             <img src="data:image/jpeg;base64,${profilePictureData}" alt="Profile Picture" class="profile-pic">
//             <p><strong>Username:</strong> ${data.friends.username}</p>
//             <p><strong>First Name:</strong> ${data.friends.first_name}</p>
//             <p><strong>Last Name:</strong> ${data.friends.last_name}</p>
//             <p><strong>Online:</strong> ${data.friends.is_online}</p>
//         </div>
        
//         `;
//         return profileContainer;
//     }

// }

//         // <div class="d-flex justify-content-center">
//         // <div class="card text-center" style="width: 20rem;">
//         //     <img src="data:image/jpeg;base64,${profilePictureData}" class="card-img-top profile-pic" alt="Profile Picture">
//         //     <div class="card-body">
//         //         <h5 class="card-title">${data.user.username}</h5>
//         //         <p class="card-text">Description text here to do, something funny about the student</p>
//         //     </div>
//         //     <ul id="profile-content" class="list-group list-group-flush">
//         //         <li class="list-group-item">${data.user.first_name}</li>
//         //         <li class="list-group-item">${data.user.last_name}</li>
//         //         <li class="list-group-item">${data.user.email}</li>
//         //         <li class="list-group-item">online: ${data.user.is_online}</li>	
//         //     </ul>
//         //     <div class="card-footer text-body-secondary">
//         //         footer here
//         //     </div>
//         // </div>
//         // </div>