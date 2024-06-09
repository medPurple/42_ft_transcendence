import { gameState, core } from './config.js'
import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";

async function removeUser() {
  console.log("Removing user from queue.");
  const id = await Iuser.getID();
  const body = {
    "userID": id
  }
  const response = await fetch('https://localhost:4430/api/matchmaking/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Icookies.getCookie('token'),
      'X-CSRFToken': Icookies.getCookie('csrftoken')
    },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  console.log(response);

}

export async function displayScore() {

  var endgame = document.getElementById("pong-renderer");
  var scoreDiv = document.getElementById("pong-score");
  scoreDiv.classList.add("scoreboard");
  var player1Name = "Player 1";
  var player2Name = "Player 2";

  if (core.player1_user_name != 0)
    player1Name = core.player1_user_name;
  if (core.player2_user_name != 0)
    player1Name = core.player2_user_name;


  scoreDiv.innerHTML = `
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-10">
				<div class="mt-4">
					<div class="row">
						<div class="col-md-6">
							<h3>${player1Name}</h3>
								<div class="score" id="score1">${gameState.player1Score}</div>
						</div>
						<div class="col-md-6">
							<h3>${player2Name}</h3>
								<div class="score" id="score2">${gameState.player2Score}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`

  if (gameState.player1Score == gameState.score_limit || gameState.player2Score == gameState.score_limit) {
    await removeUser();
    scoreDiv.innerHTML = '';
    if (gameState.player1Score == gameState.score_limit) {
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
