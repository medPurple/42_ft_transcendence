window.addEventListener('beforeunload', function() {
	const currentPageState = sessionStorage.getItem('currentPageSate');
	sessionStorage.setItem('previousPageState', currentPageState);
});


document.addEventListener('DOMContentLoaded', function() {

	const previousPageState = sessionStorage.getItem('previousPageState');
	if (previousPageState == "register"){
		sessionStorage.setItem('currentPageState', previousPageState);
	}
	else {
		const userServiceLink = document.getElementById('user-service-link');
		const userServiceAuthentication = document.getElementById('user-service-authentication'); // Sélectionnez l'élément avec l'ID 'user-service'
		// const pongFormElement = document.getElementById('game');

		userServiceLink.addEventListener('click', function(event) {
			event.preventDefault();
			userServiceAuthentication.innerHTML = `
					<a href="{% url 'signup' %}" id="register-link" class="button">Register</a>
					<a href="{% url 'login' %}" id="login-link" class="button">Log in</a>
						`;
			userServiceAuthentication.style.display = 'block';
			userServiceLink.style.display = 'none';
			pongFormElement.style.display = 'none';


			// Déclencher un événement personnalisé une fois que les éléments sont prêts
			  const authReadyEvent = new Event('authReady');
			  document.dispatchEvent(authReadyEvent);
		});
	}
});
