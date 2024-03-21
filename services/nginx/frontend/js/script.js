document.addEventListener("DOMContentLoaded", function() {
    // URL de l'API
    const apiUrl = '/api/profiles/';

    // Faire une requête à l'API
    fetch(apiUrl)
        .then(response => {
            // Vérifier si la réponse est OK (statut 200)
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données de l\'API');
            }
            // Convertir la réponse en JSON
            return response.json();
        })
        .then(data => {
            // Manipuler les données
            afficherContenu(data);
        })
        .catch(error => {
            console.error('Erreur:', error);
        });

        function afficherContenu(data) {
            const apiDataElement = document.getElementById('api-data');
            // Supprimer le contenu existant
            apiDataElement.innerHTML = '';

            // Parcourir les données et les afficher
            for (const item of data) {
                const itemElement = document.createElement('div');

                // Parcourir les propriétés de l'objet item
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const fieldValue = item[key];
                        const fieldElement = document.createElement('p');
                        fieldElement.textContent = `${key}: ${fieldValue}`;
                        itemElement.appendChild(fieldElement);
                    }
                }

                apiDataElement.appendChild(itemElement);
            }
        }
});
