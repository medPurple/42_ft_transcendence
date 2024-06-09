import { gameState, gameCustom, core, playMesh } from "./config.js"
import { createScene } from "./createScene.js"
import { handlePowerUp } from "./handlePowerUps.js"
import { displayScore } from './scoreDisplay.js'
import { cameraPlayer1, cameraPlayer2 } from './cameraLogic.js'
import Iuser from "../user/userInfo.js";

function draw() {

  if (core.scene == 0 || core.camera == 0 || core.renderer == 0)
    return;

  if (gameState.game_mode == "remote") {
    if (core.player_id == 1 && gameState.paddle2_powerup != 3) {
      cameraPlayer1();
    }
    else if (core.player_id == 2 && gameState.paddle1_powerup != 3) {
      cameraPlayer2();
    }
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

const actions = new Map([
  ["party", async (value) => { if (value === 'active') { core.party = true; await createScene(); await draw() } }],
  ["player", (value) => { core.player_id = value; console.log("Player_id :", core.player_id) }],
  ["player1_user_id", (value) => { core.player1_userid = value }],
  ["player2_user_id", (value) => { core.player2_userid = value }],
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
  ["powerup.shouldHandle", (value) => { gameState.powerup_shouldHandle = value; }],
  ["status", (value) => { gameState.status = value; }],
]);

async function handleServerMessage(message) {
  const map = new Map(Object.entries(JSON.parse(message)));

  for (let [key, value] of map.entries()) {
    const action = actions.get(key);
    if (action) {
      action(value);
    }
  }
  if (gameCustom.powerup)
    handlePowerUp();
  await displayScore();
  draw();
}

export { setup };
