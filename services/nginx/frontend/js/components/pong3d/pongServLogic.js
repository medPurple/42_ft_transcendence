import { gameState, core, playMesh } from "./config.js"
import { createScene } from "./createScene.js"
import { handlePowerUp } from "./handlePowerUps.js"
import { onKeyUp, onKeyDown } from './inputEvents.js'
import { displayScore } from './scoreDisplay.js'
import { cameraLogic, cameraLogic2, cameraLogic2d } from './cameraLogic.js'

// window.addEventListener('keydown', onKeyDown, false);
// window.addEventListener('keyup', onKeyUp, false);
//

function draw() {

  console.log("Frame is drawn")
  if (core.player_id == 1 && gameState.paddle2_powerup != 3) {
    cameraLogic();
  }
  else if (core.player_id == 2 && gameState.paddle1_powerup != 3) {
    cameraLogic2();
  }
  else {
    cameraLogic2d();
  }

  core.renderer.render(core.scene, core.camera);
}

function setup() {

  core.gameSocket = new WebSocket('ws://' + window.location.host + '/ws/pong/');

  core.gameSocket.onopen = function(e) {
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

function handleServerMessage(message) {

  var map = new Map(Object.entries(JSON.parse(message)));

  for (let [key, value] of map.entries()) {
    if (key == "party" && value == 'active') {
      core.party = true;
      displayScore();
      createScene();
      draw();
      return;
    }
    if (key == "player") {
      core.player_id = value;
      return;
    }
    if (key == "player1Score")
      gameState.player1Score = value;
    if (key == "player2Score")
      gameState.player2Score = value;
    if (key == "limitScore")
      gameState.score_limit = value;
    if (key == "paddle1.positionX")
      playMesh.paddle1.position.x = value;
    if (key == "paddle1.positionY")
      playMesh.paddle1.position.y = value;
    if (key == "paddle1.width")
      gameState.paddle1_width = value;
    if (key == "paddle1.powerup")
      gameState.paddle1_powerup = value;
    if (key == "paddle2.positionX")
      playMesh.paddle2.position.x = value;
    if (key == "paddle2.positionY")
      playMesh.paddle2.position.y = value;
    if (key == "paddle2.width")
      gameState.paddle2_width = value;
    if (key == "paddle2.powerup")
      gameState.paddle2_powerup = value;
    if (key == "ball.positionX")
      playMesh.ball.position.x = value;
    if (key == "ball.positionY")
      playMesh.ball.position.y = value;
    if (key == "powerup.positionX")
      gameState.powerup_positionX = value;
    if (key == "powerup.positionY")
      gameState.powerup_positionY = value;
    if (key == "powerup.state")
      gameState.powerup_status = value;
    if (key == "powerup.active")
      gameState.powerup_type = value;
    if (key == "active")
      gameState.active = value;
  }
  handlePowerUp();
  displayScore();
  draw();
}

export { setup };
