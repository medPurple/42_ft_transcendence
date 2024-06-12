import { gameState, core } from './config.js'

export async function deleteForm() {
	const formDiv = document.getElementById('app-general-container');
	formDiv.removeChild(formDiv.lastChild);
}

export async function displayScore() {
	var scoreDiv = document.getElementById("pong-score");
	scoreDiv.classList.add("scoreboard");
	var player1Name = "Player 1";
	var player2Name = "Player 2";

	if (core.player1_user_name != 0)
		player1Name = core.player1_user_name;
	if (core.player2_user_name != 0)
		player2Name = core.player2_user_name;

	scoreDiv.innerHTML = `
		<div class="row" style="color: white;">
			<div class="col-md-6">
				<h3><strong>${player1Name}</strong></h3>
				<div class="score" id="score1"><strong>${gameState.player1Score}</strong></div>
			</div>
			<div class="col-md-6">
				<h3><strong>${player2Name}</strong></h3>
				<div class="score" id="score2"><strong>${gameState.player2Score}</strong></div>
			</div>
		</div>
	`;
}
