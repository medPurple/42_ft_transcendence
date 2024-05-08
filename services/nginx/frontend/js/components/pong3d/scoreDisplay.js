import { gameState } from './config.js'

export function displayScore() {

  var scoreDiv = document.getElementById("pong-score");

  scoreDiv.innerHTML = "Player 1 : " + gameState.player1Score + " - Player 2 : " + gameState.player2Score;
  if (gameState.player1Score == gameState.score_limit || gameState.player2Score == gameState.score_limit) {
    if (gameState.player1Score == gameState.score_limit)
      scoreDiv.innerHTML = "Game Over ! Player 1 Won !"
    else
      scoreDiv.innerHTML = "Game Over ! Player 2 Won !"
  }
}
