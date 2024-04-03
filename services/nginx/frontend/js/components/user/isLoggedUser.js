export default function isLoggedUser() {
    fetch('api/profiles/isLoggedUser/', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        return data.isLogged;
    })
}