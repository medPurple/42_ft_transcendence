export default function getUsername(){
    let userId;
    let username;

    fetch('api/porfiles/get_userId', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        userId = data.id;
        console.log('User ID:', userId);
        return fetch(`/api/profiles/${userId}`, {
			method : 'GET',
		});
	})
	.then(response => response.json())
	.then(data => {
        console.log('Data:', data);
		username = data.username;
        console.log('Username:', username);
        return username;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    }); 
}