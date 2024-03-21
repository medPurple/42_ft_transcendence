document.addEventListener('authReady', function()  {
	const registerLink = document.getElementById('register-link');
	const userServiceAuthentication = document.getElementById('user-service-authentication');
	const signupFormElement = document.getElementById('user-service-register');
	const homeContent = document.getElementById('home-content'); // Ajout de l'élément du contenu de la page d'accueil

	registerLink.addEventListener('click', function(event) {
		event.preventDefault();
		signupFormElement.innerHTML = `
		<form id="signup-form" method="post" action="">
		<input type="file" name="profile_picture" accept="images/*" />
		<input type="text" name="username" placeholder="Username">
		<input type="text" name="first_name" placeholder="Firstname">
		<input type="text" name="last_name" placeholder="Lastname">
		<input type="email" name="email" placeholder="Email">
		<input type="password" name="password1" placeholder="Password">
		<input type="password" name="password2" placeholder="Confirm Password">
		<input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
		<button type="submit" class="button">Register</button>
		</form>`;
		userServiceAuthentication.style.display = 'none'; // Masquer le lien "User Authentication"
		signupFormElement.style.display = 'block'; // Afficher le formulaire d'inscription

		const signupForm = document.getElementById('signup-form');
		signupForm.addEventListener('submit', function(event) {
			event.preventDefault();

			// Récupérer les données du formulaire
			const formData = new FormData(signupForm);

			// Envoyer une requête AJAX pour soumettre le formulaire
			fetch('/api/signup/', {
				method: 'POST',
				body: formData,
				headers: {
					'X-CSRFToken': formData.get('csrfmiddlewaretoken') // Récupérer le jeton CSRF à partir des données du formulaire
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					// Afficher le contenu de la page d'accueil
					homeContent.innerHTML = `
						<h1>Welcome to our website</h1>
						<p>This is the content of our home page.</p>
						`;
					userServiceAuthentication.style.display = 'none';
					signupFormElement.style.display = 'none';
					homeContent.style.display = 'block';
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
