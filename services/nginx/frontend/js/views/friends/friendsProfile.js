
export default function createFriendsProfile(username) {
    let friendsProfile = document.createElement('friends-profile'); // Crée une nouvelle instance de 'friends-profile'
    friendsProfile.setAttribute('username', username); // Définit l'attribut 'username', ce qui déclenche 'attributeChangedCallback' dans 'FriendsProfile'
    document.body.appendChild(friendsProfile); // Ajoute l'élément 'friends-profile' au corps du document
}