
document.addEventListener('userRegister', function()  {

	const homeContent = document.getElementById('home-content'); // Ajout de l'élément du contenu de la page d'accueil
	const signupFormElement = document.getElementById('user-service-register');
	const userServiceAuthentication = document.getElementById('user-service-authentication');
	const loginFormElement = document.getElementById('user-service-login');
	// const pongFormElement = document.getElementById('game');

	let userId;
	fetch ('api/profiles/get_userId', {
		method: 'GET',
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		userId = data.id;

		return fetch(`/api/profiles/${userId}`, {
			method : 'GET',
		});
	})
	.then(response => response.json())
	.then(data => {
		const username = data.username;
		homeContent.innerHTML = `
						<h1>Welcome to our website</h1>
						<p>This is the content of our home page.</p>
						<p> You are logged in as ${username}</p>
						<button id="logout-button" class="button">Logout</button>
						`;
		userServiceAuthentication.style.display = 'none';
		signupFormElement.style.display = 'none';
		loginFormElement.style.display = 'none';
		// pongFormElement.style.display = 'none';
		homeContent.style.display = 'block';
		const userLogout = new Event('userLogout');
		document.dispatchEvent(userLogout);
	})
	.catch(error => {
		console.error('Error:', error);
	});
});
