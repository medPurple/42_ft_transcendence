import { gameState } from './config.js'

export function displayScore() {

	var endgame = document.getElementById("pong-renderer");
	var scoreDiv = document.getElementById("pong-score");
	scoreDiv.classList.add("scoreboard");

	scoreDiv.innerHTML = `
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-10">
				<div class="mt-4">
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
		scoreDiv.innerHTML = '';
		if (gameState.player1Score == gameState.score_limit){
			endgame.innerHTML = `
			<div id="custom-endgame">
				<img src="../../../images/Game/P1-WINS.jpeg" class="img-fluid" alt="Display Image">
			</div>
			`;
		}
		else
			endgame.innerHTML = `
			<div id="custom-endgame">
				<img src="../../../images/Game/P2-WINS.jpeg" class="img-fluid" alt="Display Image">
			</div>
			`;
	}
}
