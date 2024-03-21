let accessToken = '';

document.addEventListener('userRegister', function()  {

	const homeContent = document.getElementById('home-content'); // Ajout de l'élément du contenu de la page d'accueil
	const signupFormElement = document.getElementById('user-service-register');
	const userServiceAuthentication = document.getElementById('user-service-authentication');


	fetch('/api/username/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const username = data.username;
        homeContent.innerHTML = `
						<h1>Welcome to our website</h1>
						<p>This is the content of our home page.</p>
						<p> You are logged in as ${username}</p>
						`;
		userServiceAuthentication.style.display = 'none';
		signupFormElement.style.display = 'none';
		homeContent.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });

});
