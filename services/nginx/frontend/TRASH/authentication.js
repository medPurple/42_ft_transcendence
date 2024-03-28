// window.addEventListener('beforeunload', function() {
// 	const currentPageState = sessionStorage.getItem('currentPageSate');
// 	sessionStorage.setItem('previousPageState', currentPageState);
// });


document.addEventListener('DOMContentLoaded', function() {

	// Check if the user is authenticated
	const userServiceLink = document.getElementById('user-service-link');
	const userServiceAuthentication = document.getElementById('user-service-authentication'); // Pick the user-service-authentication element
	// const pongFormElement = document.getElementById('game');

	userServiceLink.addEventListener('click', function(event) {
		event.preventDefault();
		userServiceAuthentication.innerHTML = `
				<a href="{% url 'signup' %}" id="register-link" class="button">Register</a>
				<a href="{% url 'login' %}" id="login-link" class="button">Log in</a>
					`;
		userServiceAuthentication.style.display = 'block';
		userServiceLink.style.display = 'none';
		// pongFormElement.style.display = 'none';


		// Déclencher un événement personnalisé une fois que les éléments sont prêts
			const authReadyEvent = new Event('authReady');
			document.dispatchEvent(authReadyEvent);
	});
});
