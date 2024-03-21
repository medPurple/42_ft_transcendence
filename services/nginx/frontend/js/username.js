document.addEventListener('DOMContentLoaded', function() {
	// Récupérer l'ID de l'utilisateur connecté
	const userId = getUserId(); // Vous devez implémenter cette fonction pour récupérer l'ID de l'utilisateur connecté

	// Stocker l'username dans une variable globale
	let username = '';

	// Effectuer une requête pour récupérer les informations de l'utilisateur en utilisant son ID
	fetch(`/api/profiles/${userId}/`) // Assurez-vous de remplacer '/api/user/' par l'URL correcte de votre API
		.then(response => response.json())
		.then(user => {
			// Vérifier si l'utilisateur a été trouvé
			if (user) {
				// Récupérer l'username de l'utilisateur connecté
				username = user.username;
			} else {
				// L'utilisateur n'a pas été trouvé, vous pouvez gérer cette situation
			}
		})
		.catch(error => {
			console.error('Error:', error);
			// Gérer les erreurs si la requête échoue
		});

	// Fonction pour récupérer l'username
	function getUsername() {
		return username;
	}

	// Vous pouvez maintenant utiliser la fonction getUsername() pour récupérer l'username dans d'autres parties de votre code
});
