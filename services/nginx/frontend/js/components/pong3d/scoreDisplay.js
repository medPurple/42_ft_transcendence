import { gameState } from './config.js'

/// CHNAGEr AFICHAGE SCORE / endgame

// async function removeUser() {
// 	console.log("Removing user from queue.");
// 	const id = await Iuser.getID();
// 	const body = {
// 		"userID": id}
// 	const response = await fetch('https://localhost:4430/api/matchmaking/', {
// 		method: 'DELETE',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Authorization': Icookies.getCookie('token'),
// 			'X-CSRFToken': Icookies.getCookie('csrftoken')
// 		},
// 		credentials: 'include',
// 		body: JSON.stringify(body)
// 	});
// 	console.log(response);

// }

export async function displayScore() {

	var scoreDiv = document.getElementById("pong-score");

	scoreDiv.innerHTML = "Player 1 : " + gameState.player1Score + " - Player 2 : " + gameState.player2Score;
	if (gameState.player1Score == gameState.score_limit || gameState.player2Score == gameState.score_limit) {
		await removeUser();
		if (gameState.player1Score == gameState.score_limit)
			scoreDiv.innerHTML = "Game Over ! Player 1 Won !"
		else
			scoreDiv.innerHTML = "Game Over ! Player 2 Won !"
	}
}
