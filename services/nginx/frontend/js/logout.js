// Sélectionnez le bouton de déconnexion
document.addEventListener('userLogout', function()  {
	const logoutButton = document.getElementById('logout-button');
	const userServiceLink = document.getElementById('user-service-link');
	const homeContent = document.getElementById('home-content'); // Ajout de l'élément du contenu de la page d'accueil

	const csrfTokenInput = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
	const csrfToken = csrfTokenInput ? csrfTokenInput.value : null;

	// Ajoutez un gestionnaire d'événements pour le clic sur le bouton de déconnexion
	logoutButton.addEventListener('click', function(event) {
		// Empêchez le comportement par défaut du bouton (par exemple, soumettre un formulaire)
		event.preventDefault();

		if (!csrfToken) {
            console.error('CSRF token not found.');
            return;
        }
		
		const formData = new FormData();
		formData.append('csrfmiddlewaretoken', csrfToken);
		// Envoyez une demande de déconnexion à l'API Django
		fetch('/api/logout/', {
			method: 'POST',
			body: formData,  // Envoyez les données du formulaire
			headers: {
				'X-CSRFToken': csrfToken

				// Ajoutez des en-têtes d'autorisation si nécessaire
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
