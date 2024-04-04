document.addEventListener('authReady', function()  {
	const loginLink = document.getElementById('login-link');
	const userServiceAuthentication = document.getElementById('user-service-authentication');
	const loginFormElement = document.getElementById('user-service-login');
	// const pongFormElement = document.getElementById('game');

	loginLink.addEventListener('click', function(event) {
		event.preventDefault();
		loginFormElement.innerHTML = `
		<form id="login-form" method="post" action="">
		<input type="text" name="username" placeholder="Username">
		<input type="password" name="password" placeholder="Password">
		<input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
		<button type="submit" class="button">Log in</button>
		</form>`;
		userServiceAuthentication.style.display = 'none'; // Masquer le lien "User Authentication"
		// pongFormElement.style.display = 'none';
		loginFormElement.style.display = 'block'; // Afficher le formulaire d'inscription

		const signupForm = document.getElementById('login-form');
		signupForm.addEventListener('submit', function(event) {
			event.preventDefault();

			// Récupérer les données du formulaire
			const formData = new FormData(signupForm);

			// Envoyer une requête AJAX pour soumettre le formulaire
			fetch('/api/profiles/user_login/', {
				method: 'POST',
				body: formData,
				headers: {
					'X-CSRFToken': formData.get('csrfmiddlewaretoken') // Récupérer le jeton CSRF à partir des données du formulaire
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					const userRegisterEvent = new Event('userRegister');
					document.dispatchEvent(userRegisterEvent);
				} else {
					// Afficher les erreurs de validation ou tout autre message d'erreur
					alert('Registration failed. Please check the form and try again.');
				}
			})
			.catch(error => {
				console.error('Error:', error);
				// Gérer les erreurs d'API
			});
		});
	});
});
