import { gameState, gameCustom, core, playMesh } from "./config.js"
import { createScene } from "./createScene.js"
import { handlePowerUp } from "./handlePowerUps.js"
import { displayScore } from './scoreDisplay.js'
import { cameraPlayer1, cameraLocalPlayer1, cameraPlayer2, cameraLocalPlayer2, cameraMalusRemote } from './cameraLogic.js'
import Iuser from "../user/userInfo.js";

function draw() {
  if (core.scene == 0 || core.camera == 0 || core.renderer == 0)
    return;

  if (gameState.game_mode == "remote") {
    if (core.player_id == 1 && gameState.paddle2_powerup != 3)
      cameraPlayer1();
    else if (core.player_id == 2 && gameState.paddle1_powerup != 3)
      cameraPlayer2();
    else
      cameraMalusRemote();
  }
  else if ((gameState.game_mode == "local" || gameState.game_mode == "tournament") && gameCustom.powerup == 1) {
    if (gameState.paddle1_powerup == 3) {
      cameraLocalPlayer1();
    }
    else if (gameState.paddle2_powerup == 3) {
      cameraLocalPlayer2();
    }
    else
      core.controls.reset();
  }

  core.camera.aspect = window.innerWidth / window.innerHeight;
  core.camera.updateProjectionMatrix();
  window.addEventListener('resize', function() {
    core.renderer.setSize(window.innerWidth, window.innerHeight);
    core.camera.aspect = window.innerWidth / window.innerHeight;
    core.camera.updateProjectionMatrix();
  });

  core.renderer.render(core.scene, core.camera);
}

async function setup(gameMode, players) {
  gameState.game_mode = gameMode;
  const user_id = await Iuser.getID();
  const user_name = await Iuser.getUsername();

  switch (gameState.game_mode) {
    case "remote":
      core.gameSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/remote/' + user_id + '/' + user_name + '/');
      break;
    case "local":
      core.gameSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/local/' + user_id + '/' + user_name + '/' + players.player2 + '/');
      break;
    default:
      core.gameSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/tournament/' + user_id + '/' + players.player1 + '/' + players.player2 + '/' + players.player3 + '/' + players.player4 + '/');
      break;
  }

  core.gameSocket.onopen = async function(e) {

    if (gameState.game_mode == "tournament" || gameState.game_mode == "local")
      removeForm();
    await createScene();
    console.log('Connected');
  };

  core.gameSocket.onerror = function(e) {
    console.log('Error');
  };

  core.gameSocket.onclose = function(e) {
    console.log('Closed');
  };

  core.gameSocket.onmessage = function(event) {
    handleServerMessage(event.data);
  }
}

const actions = new Map([
  ["party", (value) => { if (value === 'active') { core.party = true; } }],
  ["player", (value) => { core.player_id = value; console.log("Player_id :", core.player_id) }],
  ["player1_user_id", (value) => { core.player1_userid = value }],
  ["player2_user_id", (value) => { core.player2_userid = value }],
  ["player1_user_name", (value) => { core.player1_user_name = value }],
  ["player2_user_name", (value) => { core.player2_user_name = value }],
  ["player1Score", (value) => { gameState.player1Score = value; }],
  ["player2Score", (value) => { gameState.player2Score = value; }],
  ["limitScore", (value) => { gameState.score_limit = value; }],
  ["paddle1.positionX", (value) => { if (playMesh.paddle1) { playMesh.paddle1.position.x = value }; }],
  ["paddle1.positionY", (value) => { if (playMesh.paddle1) { playMesh.paddle1.position.y = value }; }],
  ["paddle1.width", (value) => { gameState.paddle1_width = value; }],
  ["paddle1.powerup", (value) => { gameState.paddle1_powerup = value; }],
  ["paddle2.positionX", (value) => { if (playMesh.paddle2) { playMesh.paddle2.position.x = value }; }],
  ["paddle2.positionY", (value) => { if (playMesh.paddle2) { playMesh.paddle2.position.y = value }; }],
  ["paddle2.width", (value) => { gameState.paddle2_width = value; }],
  ["paddle2.powerup", (value) => { gameState.paddle2_powerup = value; }],
  ["ball.positionX", (value) => { if (playMesh.ball) { playMesh.ball.position.x = value }; }],
  ["ball.positionY", (value) => { if (playMesh.ball) { playMesh.ball.position.y = value }; }],
  ["powerup.positionX", (value) => { gameState.powerup_positionX = value; }],
  ["powerup.positionY", (value) => { gameState.powerup_positionY = value; }],
  ["powerup.state", (value) => { gameState.powerup_status = value; }],
  ["powerup.active", (value) => { gameState.powerup_type = value; }],
  ["powerup.shouldHandle", (value) => { gameCustom.powerup = value; }],
  ["status", (value) => { gameState.status = value; }],
]);

function handleServerMessage(message) {
  const map = new Map(Object.entries(JSON.parse(message)));

  for (let [key, value] of map.entries()) {
    const action = actions.get(key);
    if (action) {
      action(value);
    }
  }
  console.log(gameState.status);

  switch (gameState.status) {
    case 0:
      if (gameState.game_mode == "remote")
        waitingForPlayer();
      break;
    case 1:
      welcomeScreen();
      break;
    case 2:
      playingMode();
      break;
    case 3:
      gamePaused();
      break;
    case 4:
      endGame();
      break;
  }
}

function removeForm() {
  console.log("Je veux virer le form")
  const divToRemove = document.getElementById('app-general-container');
  divToRemove.classList.add('hidden');
}

function waitingForPlayer() {
  const screensdiv = document.getElementById('pong-screens');
  const pongrender = document.getElementById('pong-renderer');
  const pongscore = document.getElementById('pong-score');

  pongrender.classList.add('hidden');
  pongscore.classList.add('hidden');
  screensdiv.classList.remove('hidden');

  screensdiv.innerHTML = `
		<div class="row-md-4 p-5">
			<img src="../../../images/Game/GameWaiting.gif" class="img-fluid" alt="Display Image">
			<h6 class="p-5" style="color: grey;">...waiting for someone to join...</h6>
		</div>
	`;
}

function welcomeScreen() {
  const screensdiv = document.getElementById('pong-screens');
  const pongrender = document.getElementById('pong-renderer');
  const pongscore = document.getElementById('pong-score');

  pongrender.classList.add('hidden');
  pongscore.classList.add('hidden');
  screensdiv.classList.remove('hidden');

  let player1 = core.player1_user_name
  let player2 = core.player2_user_name

  if (gameState.game_mode == "local") {
    screensdiv.innerHTML = `
		<div id="welcome" class="row justify-content-center p-5">
		<h4 class="text-center" style="color: #4d544c;">LOCAL GAME CONTROLS</h4>
		<div class="row">
			<div class="col-md-6 d-grid gap-2 mb-4 mt-3">
				<button class="btn btn-dark text-start" type="button" style="background: #333;"><strong>🡸 W S</strong></button>
			</div>
			<div class="col-md-6 d-grid gap-2 mb-4 mt-3">
				<button class="btn btn-secondary text-end" type="button" style="background: #333;"><strong>8 5 🡺</strong></button>
			</div>
		</div>
	
		<h2 class="text-center mb-4 mt-3">${player1} VS ${player2}</h2>
	
		<div class="spinner-border text-dark mb-4 mt-3" role="status"></div>
		<h6 style="color: grey;"> PRESS ENTER </h6>
		</div>
		`;
  }
  else if (gameState.game_mode == "remote") {
    screensdiv.innerHTML = `
		<div id="welcome" class="row justify-content-center p-5">
		<h4 class="text-center" style="color: #4d544c;">REMOTE GAME CONTROLS</h4>
		<div class="col-sm-6 d-grid gap-2 mb-4 mt-3">
			<button class="btn btn-dark" type="button" style="background: #333;"><strong>🡸 A D 🡺</strong></button>
		</div>
		<h2 class="text-center mb-4 mt-3">${player1} VS ${player2}</h2>
	
		<div class="spinner-border text-dark mb-4 mt-3" role="status"></div>
		<h6 style="color: grey;"> PRESS ENTER </h6>
		</div>
		`;
  }
  else if (gameState.game_mode == "tournament") {
    screensdiv.innerHTML = `
		<div id="welcome" class="row justify-content-center p-5">
		<h4 class="text-center" style="color: #4d544c;">TOURNAMENT GAME CONTROLS</h4>
		<div class="row">
			<div class="col-md-6 d-grid gap-2 mb-4 mt-3">
				<button class="btn btn-dark text-start" type="button" style="background: #333;"><strong>🡸 W S</strong></button>
			</div>
			<div class="col-md-6 d-grid gap-2 mb-4 mt-3">
				<button class="btn btn-secondary text-end" type="button" style="background: #333;"><strong>8 5 🡺</strong></button>
			</div>
		</div>
	
		<h2 class="text-center mb-4 mt-3">${player1} VS ${player2}</h2>
	
		<div class="spinner-border text-dark mb-4 mt-3" role="status"></div>
		<h6 style="color: grey;"> PRESS ENTER </h6>
		</div>
		`;
  }
}

function gamePaused() {
  const screensdiv = document.getElementById('pong-screens');
  const pongrender = document.getElementById('pong-renderer');
  const pongscore = document.getElementById('pong-score');

  pongrender.classList.add('hidden');
  pongscore.classList.add('hidden');
  screensdiv.classList.remove('hidden');

  screensdiv.innerHTML = `
		<div class="row-md-4 p-5">
			<img src="../../../images/Game/GamePaused.gif" class="img-fluid" alt="Display Image">
			<h6 class="p-5" style="color: grey;">...game paused...</h6>
		</div>
	`;
}

function playingMode() {
  console.log("je passe bien dans le playing mode")
  const screensdiv = document.getElementById('pong-screens');
  const pongrender = document.getElementById('pong-renderer');
  const pongscore = document.getElementById('pong-score');

  screensdiv.classList.add('hidden');
  pongrender.classList.remove('hidden');
  pongscore.classList.remove('hidden');

  if (gameCustom.powerup)
    handlePowerUp();
  displayScore();
  draw();
}

function endGame() {
  const screensdiv = document.getElementById('pong-screens');
  const pongrender = document.getElementById('pong-renderer');
  const pongscore = document.getElementById('pong-score');

  screensdiv.classList.remove('hidden');
  pongscore.classList.add('hidden');
  pongrender.classList.add('hidden');

  console.log("Je passe dans endGame()");
  if (gameState.player1Score == gameState.score_limit || gameState.player2Score == gameState.score_limit) {
    pongscore.innerHTML = '';
    screensdiv.innerHTML = '';
    //pongrender.innerHTML = '';
    if (gameState.player1Score == gameState.score_limit) {
      screensdiv.innerHTML = `
				<div id="custom-endgame">
					<img src="../../../images/Game/P1-WINS.jpeg" class="img-fluid" alt="Display Image">
				</div>
				`;
    }
    else if (gameState.player2Score == gameState.score_limit) {
      screensdiv.innerHTML = `
				<div id="custom-endgame">
					<img src="../../../images/Game/P2-WINS.jpeg" class="img-fluid" alt="Display Image">
				</div>
				`;
    }
  }
  else {
    console.log("Je rentre dans ce cas")
    screensdiv.innerHTML = `
<div class="row-md-4 p-5">
  <img src="../../../images/Game/GameEnded.gif" class="img-fluid" alt="Display Image">
  <h6 class="p-5" style="color: grey;">...game ended by another player...</h6>
</div>`;
  }
}

export { setup };
