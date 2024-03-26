


document.addEventListener('userLogout', function()  {
	const logoutButton = document.getElementById('logout-button');
	const userServiceLink = document.getElementById('user-service-link');
	const homeContent = document.getElementById('home-content'); // Ajout de l'élément du contenu de la page d'accueil


	// Ajoutez un gestionnaire d'événements pour le clic sur le bouton de déconnexion
	logoutButton.addEventListener('click', function(event) {

		event.preventDefault();

	// The getCookie function you provided is used to retrieve the CSRF token from the "csrftoken" cookie.
	// This CSRF token is necessary to protect POST requests against Cross-Site Request Forgery (CSRF) attacks.
		function getCookie(name) {
			let cookieValue = null;
			if (document.cookie && document.cookie !== '') {
				const cookies = document.cookie.split(';');
				for (let i = 0; i < cookies.length; i++) {
					let cookie = cookies[i].trim();
					if (cookie.substring(0, name.length + 1) === (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
		let csrfToken = getCookie('csrftoken');

		const loginForm = document.getElementById('login-form');
		const signupForm = document.getElementById('signup-form');
		let formData;
		if (loginForm) {
			formData = new FormData(loginForm);
		} else if (signupForm) {
			formData = new FormData(signupForm);
		} else {
			return console.error('No login form found');
		}

	// Ajoutez le jeton CSRF à l'objet FormData
	formData.append('csrfmiddlewaretoken', csrfToken);

	// Envoyez la demande de déconnexion à l'API Django
	fetch('/api/profiles/user_logout/', {
		method: 'POST',
		body: formData,
		credentials: 'same-origin',
		headers: {
			'X-CSRFToken': csrfToken
		}
	})
		.then(response => {
			if (response.ok) {
				// Redirigez l'utilisateur vers la page de connexion ou effectuez toute autre action nécessaire après la déconnexion
				userServiceLink.style.display = 'block'; // Redirection vers la page de connexion
				homeContent.style.display = 'none'
			} else {
				// Gérez les erreurs de déconnexion
				console.error('Logout failed:', response.statusText);
			}
		})
		.catch(error => {
			console.error('Error during logout:', error);
		});
	});
});
