import { gameState } from './config.js'

/// CHNAGEr AFICHAGE SCORE / endgame
export async function displayScore() {

	var scoreDiv = document.getElementById("pong-score");

	// scoreDiv.innerHTML = "Player 1 : " + gameState.player1Score + " - Player 2 : " + gameState.player2Score;

	scoreDiv.innerHTML = `
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-10">
				<div class="scoreboard mt-4">
					<div class="row">
						<div class="col-md-6">
							<h3>Player 1</h3>
								<div class="score" id="score1">${gameState.player1Score}</div>
						</div>
						<div class="col-md-6">
							<h3>Player 2</h3>
								<div class="score" id="score2">${gameState.player2Score}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`

	if (gameState.player1Score == gameState.score_limit || gameState.player2Score == gameState.score_limit) {
		if (gameState.player1Score == gameState.score_limit)
			window.location.href = '/pongEnd/1';
		else
			window.location.href = '/pongEnd/2';
	}
}
