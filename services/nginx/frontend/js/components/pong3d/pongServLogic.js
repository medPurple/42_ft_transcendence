import { gameState, gameCustom, core, playMesh } from "./config.js"
import { createScene } from "./createScene.js"
import { handlePowerUp } from "./handlePowerUps.js"
import { displayScore, deleteForm } from './scoreDisplay.js'
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
  else if (gameState.game_mode == "local" && gameCustom.powerup == 1) {
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
	  core.gameSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/local/' + user_id + '/');
	  break;
	default:
	  core.gameSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/tournament/' + user_id + '/' + players.player1 + '/' + players.player2 + '/' + players.player3 + '/' + players.player4 + '/');
	  break;
  }

  core.gameSocket.onopen = async function(e) {
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
	if (gameState.game_mode == "tournament")
		deleteForm();

	console.log(gameState.status);

	switch (gameState.status) {
		case 0:
			if (gameState.game_mode == "remote")
				waitingForPlayer();
			else // a enlever
				welcomeScreen(); //a enlever
			break;
		// case 1: //a changer
		// 	welcomeScreen();
		// 	break;
		case 1:
			playingMode();
			break;
		case 2:
			gamePaused();
			break;
		case 3:
			endGame();
			break;
	}
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

	if (gameState.game_mode == "local")
	{
		screensdiv.innerHTML = `
		<div class="row-md-4 p-5">
			<h1 class="p-5" style="color: grey;">LOCAL CONTROLS HERE</h1>
		</div>
		<div class="row-md-4 p-5">
			<h1 class="p-5" style="color: grey;">Player VS HERE</h1>
		</div>
		<div class="row-md-4 p-5">
			<h2 class="p-5" style="color: grey;">...WELCOME SCREEN...</h2>
		</div>
		`;
	}
	else if (gameState.game_mode == "remote")
	{
		screensdiv.innerHTML = `
		<div class="row-md-4 p-5">
			<h1 class="p-5" style="color: grey;">REMOTE CONTROLS HERE</h1>
		</div>
		<div class="row-md-4 p-5">
			<h1 class="p-5" style="color: grey;">Player VS HERE</h1>
		</div>
		<div class="row-md-4 p-5">
			<h2 class="p-5" style="color: grey;">...WELCOME SCREEN...</h2>
		</div>
		`;
	}
	else if (gameState.game_mode == "tournament")
	{
		screensdiv.innerHTML = `
		<div class="row-md-4 p-5">
			<h1 class="p-5" style="color: grey;">Tournament CONTROLS HERE</h1>
		</div>
		<div class="row-md-4 p-5">
			<h1 class="p-5" style="color: grey;">Player VS HERE</h1>
		</div>
		<div class="row-md-4 p-5">
			<h2 class="p-5" style="color: grey;">...WELCOME SCREEN...</h2>
		</div>
		`;
	}
	for (let i = 0; i < 5; i++) {
        console.log(`Waiting ${i} seconds...`);
        sleep(i * 1000);
    }
    console.log('Done');
	sleep(10000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

	screensdiv.classList.add('hidden');
	pongscore.classList.add('hidden');
	pongrender.classList.remove('hidden');

	if (gameState.player1Score == gameState.score_limit || gameState.player2Score == gameState.score_limit) {
		pongscore.innerHTML = '';
		screensdiv.innerHTML = '';
		pongrender.innerHTML = '';
		if (gameState.player1Score == gameState.score_limit) {
			pongrender.innerHTML = `
				<div id="custom-endgame">
					<img src="../../../images/Game/P1-WINS.jpeg" class="img-fluid" alt="Display Image">
				</div>
				`;
		}
		else if (gameState.player2Score == gameState.score_limit) {
			pongrender.innerHTML = `
				<div id="custom-endgame">
					<img src="../../../images/Game/P2-WINS.jpeg" class="img-fluid" alt="Display Image">
				</div>
				`;
		}
		else {
			pongrender.innerHTML = `
				<div class="row-md-4 p-5">
					<img src="../../../images/Game/GameEnded.gif" class="img-fluid" alt="Display Image">
					<h6 class="p-5" style="color: grey;">...game ended by another player...</h6>
				</div>`;
		}
	}
}

export { setup };
