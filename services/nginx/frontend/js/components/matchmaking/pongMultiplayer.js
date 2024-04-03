// document.getElementById('pong_multiplayer_queue').addEventListener('click', function() {
//     const url = '/api/queue/';
//     const data = {
//         userID: 1,
//         game: 'pong_multiplayer'
//     };

//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// });