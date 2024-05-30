import { gameState, core, playMesh } from "./config.js"
import { createScene } from "./createScene.js"
import { handlePowerUp } from "./handlePowerUps.js"
import { displayScore } from './scoreDisplay.js'
import { cameraLogic, cameraLogic2, cameraLogic2d } from './cameraLogic.js'

// window.addEventListener('keydown', onKeyDown, false);
// window.addEventListener('keyup', onKeyUp, false);

function draw() {

	// console.log("Frame is drawn")

	if (core.camera == 0)
		return;

	if (core.player_id == 1 && gameState.paddle2_powerup != 3) {
		cameraLogic();
	}
	else if (core.player_id == 2 && gameState.paddle1_powerup != 3) {
		cameraLogic2();
	}
	else if (gameState.game_mode != "remote") {
		if (gameState.paddle1_powerup == 3)
			cameraLogic();
		else if (gameState.paddle2_powerup == 3)
			cameraLogic2();
		else
			cameraLogic2d();
	}
	else {
		cameraLogic2d();
	}
	core.renderer.render(core.scene, core.camera);
}

async function setup(gameMode) {

	gameState.game_mode = gameMode;
	switch (gameState.game_mode) {
		case "remote":
			core.gameSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/remote');
			break;
		case "local":
			core.gameSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/local');
			break;
		default:
			core.gameSocket = new WebSocket('wss://' + window.location.host + '/ws/pong/tournament');
			break;
	}

	core.gameSocket.onopen = function(e) {
		console.log('Connected');
	};

	core.gameSocket.onerror = function(e) {
		console.log('Error');
	};

	core.gameSocket.onclose = function(e) {
		console.log('Closed');
	};

	core.gameSocket.onmessage = async function(event) {
		await handleServerMessage(event.data);
	}
}

async function handleServerMessage(message) {

	var map = new Map(Object.entries(JSON.parse(message)));

	for (let [key, value] of map.entries()) {
		if (key == "party" && value == 'active') {
			core.party = true;
			await createScene();
			displayScore();
			draw();
			return;
		}
		else if (key == "player") {
			core.player_id = value;
			return;
		}
		else if (key == "player1Score")
			gameState.player1Score = value;
		else if (key == "player2Score")
			gameState.player2Score = value;
		else if (key == "limitScore")
			gameState.score_limit = value;
		else if (playMesh.paddle1 && key == "paddle1.positionX")
			playMesh.paddle1.position.x = value;
		else if (playMesh.paddle1 && key == "paddle1.positionY")
			playMesh.paddle1.position.y = value;
		else if (key == "paddle1.width")
			gameState.paddle1_width = value;
		else if (key == "paddle1.powerup")
			gameState.paddle1_powerup = value;
		else if (playMesh.paddle2 && key == "paddle2.positionX")
			playMesh.paddle2.position.x = value;
		else if (playMesh.paddle2 && key == "paddle2.positionY")
			playMesh.paddle2.position.y = value;
		else if (key == "paddle2.width")
			gameState.paddle2_width = value;
		else if (key == "paddle2.powerup")
			gameState.paddle2_powerup = value;
		else if (playMesh.ball && key == "ball.positionX")
			playMesh.ball.position.x = value;
		else if (playMesh.ball && key == "ball.positionY")
			playMesh.ball.position.y = value;
		else if (key == "powerup.positionX")
			gameState.powerup_positionX = value;
		else if (key == "powerup.positionY")
			gameState.powerup_positionY = value;
		else if (key == "powerup.state")
			gameState.powerup_status = value;
		else if (key == "powerup.active")
			gameState.powerup_type = value;
		else if (key == "active")
			gameState.active = value;
	}

	handlePowerUp(); // A lancer seulement si power up actif
	displayScore();
	///////// displayend() or draw()
	draw();
}

export { setup };
