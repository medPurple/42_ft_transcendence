import { gameState, gameCustom, core, playMesh, pUpMesh, decMesh, objMesh, lights, constants } from "./config.js"
import { createScene } from "./createScene.js"

var powerUp, pUpIsDisplayed = false, pUpEffectIsApplied = false;

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

//Functions used to create the scene

function displayScore() {

  var scoreDiv = document.getElementById("pong-score");

  scoreDiv.innerHTML = "Player 1 : " + gameState.player1Score + " - Player 2 : " + gameState.player2Score;
  if (gameState.player1Score == gameState.score_limit || gameState.player2Score == gameState.score_limit) {
    if (gameState.player1Score == gameState.score_limit)
      scoreDiv.innerHTML = "Game Over ! Player 1 Won !"
    else
      scoreDiv.innerHTML = "Game Over ! Player 2 Won !"
  }
}

function cameraLogic() {

  core.camera.position.x = playMesh.paddle1.position.x - 60;
  core.camera.position.y += (playMesh.paddle1.position.y - core.camera.position.y) * 0.05;
  core.camera.position.z = playMesh.paddle1.position.z + 100;
  core.camera.rotation.z = -90 * Math.PI / 180;
  core.camera.rotation.y = -60 * Math.PI / 180;
}

function cameraLogic2() {

  core.camera.position.x = playMesh.paddle2.position.x + 60;
  core.camera.position.y += (playMesh.paddle2.position.y - core.camera.position.y) * 0.05;
  core.camera.position.z = playMesh.paddle2.position.z + 100;
  core.camera.rotation.z = 90 * Math.PI / 180;
  core.camera.rotation.y = 60 * Math.PI / 180;
}

function cameraLogic2d() {

  core.camera.position.x = 0;
  core.camera.position.y = 0;
  core.camera.position.z = 230;
  core.camera.rotation.z = 0;
  core.camera.rotation.y = 0;
}

function populateCircleShape(color) {

  // Define the radius of the circle and the number of segments
  var radius = 10; // Adjust as needed
  var segments = 64; // Adjust as needed

  // Create an array to hold the vertices of the circle
  var vertices = [];

  // Calculate the angle between each segment
  var angleIncrement = (Math.PI * 2) / segments;

  // Generate vertices for the circle border
  for (var i = 0; i <= segments; i++) {
    var angle = angleIncrement * i;
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    vertices.push(new THREE.Vector3(x, y, 0));
  }

  // Create a geometry to hold the vertices
  var geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  // Create a material for the border
  var material = new THREE.LineBasicMaterial({ color: color });

  // Create the circle border mesh
  var circleMesh = new THREE.LineLoop(geometry, material);
  circleMesh.rotateX(Math.PI / 2);
  circleMesh.rotateY(Math.PI / 2);
  circleMesh.position.z = 20;
  return circleMesh;
}

function populateTriangleShape(color) {

  // Define the size of the triangle
  var size = 15; // Adjust as needed
  // Define the vertices of the triangle
  var vertices = [
    new THREE.Vector3(0, size / Math.sqrt(3), 0),
    new THREE.Vector3(-size / 2, -size / (2 * Math.sqrt(3)), 0),
    new THREE.Vector3(size / 2, -size / (2 * Math.sqrt(3)), 0)
  ];

  // Create a geometry to hold the vertices
  var geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  // Create a material for the border
  var material = new THREE.LineBasicMaterial({ color: color });

  // Create the triangle border mesh
  var triangleMesh = new THREE.LineLoop(geometry, material);

  triangleMesh.rotateX(Math.PI / 2);
  triangleMesh.rotateY(Math.PI / 2);
  triangleMesh.position.z = 20;
  return triangleMesh;
}

function populateStarShape(color) {

  // Define the size of the star
  var size = 10; // Adjust as needed

  // Define the number of points for the star
  var numPoints = 5; // Adjust as needed

  // Define an array to hold the vertices of the star
  var vertices = [];

  // Calculate the angles for the outer and inner points of the star
  for (var i = 0; i < numPoints * 2; i++) {
    var angle = (i / numPoints) * Math.PI;
    var r = (i % 2 === 0) ? size : size / 2; // Alternate between outer and inner radius
    var x = r * Math.cos(angle);
    var y = r * Math.sin(angle);
    vertices.push(new THREE.Vector3(x, y, 0));
  }

  // Create a geometry to hold the vertices
  var geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  // Create a material for the border
  var material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the star border mesh
  var starMesh = new THREE.LineLoop(geometry, material);

  starMesh.rotateX(Math.PI / 2);
  starMesh.rotateY(Math.PI / 2);
  starMesh.rotateZ(Math.PI / 10);
  starMesh.position.z = 20;
  return starMesh;
}

function populateSquareShape(color) {

  var size = 15; // Adjust as needed

  // Define the vertices of the square
  var vertices = [
    new THREE.Vector3(-size / 2, size / 2, 0),
    new THREE.Vector3(size / 2, size / 2, 0),
    new THREE.Vector3(size / 2, -size / 2, 0),
    new THREE.Vector3(-size / 2, -size / 2, 0),
    new THREE.Vector3(-size / 2, size / 2, 0) // Close the square
  ];

  // Create a geometry to hold the vertices
  var geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  // Create a material for the border
  var material = new THREE.LineBasicMaterial({ color: color });

  // Create the square border mesh
  var squareMesh = new THREE.LineLoop(geometry, material);

  squareMesh.rotateX(Math.PI / 2);
  squareMesh.rotateY(Math.PI / 2);
  squareMesh.position.z = 20;
  return squareMesh;
}


function popPowerUpOnScene() {

  var color;

  console.log("color :", gameState.powerup_type);
  switch (gameState.powerup_type) {
    case 0:
      color = 0x22ff00;
      powerUp = populateCircleShape(color);
      break;
    case 1:
      color = 0xff0000;
      powerUp = populateTriangleShape(color);
      break;
    case 2:
      color = 0xfbff00;
      powerUp = populateStarShape(color);
      break;
    default:
      color = 0x0004ff;
      powerUp = populateSquareShape(color);
  }

  powerUp.position.x = gameState.powerup_positionX;
  powerUp.position.y = gameState.powerup_positionY;
  powerUp.castShadow = true;
  powerUp.receiveShadow = true;
  core.scene.add(powerUp);
  pUpIsDisplayed = true;
}

function applyHeightPaddleChange() {

  if (gameState.paddle1_powerup == 1) {
    playMesh.paddle2.scale.set(1, 20 / constants.paddleHeight, 1);
  }
  else if (gameState.paddle1_powerup == 2) {
    playMesh.paddle1.scale.set(1, 40 / constants.paddleHeight, 1);
  }
  else if (gameState.paddle2_powerup == 1) {
    playMesh.paddle1.scale.set(1, 20 / constants.paddleHeight, 1);
  }
  else if (gameState.paddle2_powerup == 2) {
    playMesh.paddle2.scale.set(1, 40 / constants.paddleHeight, 1);
  }
}

function resetPaddles() {
  playMesh.paddle1.scale.set(1, 30 / playMesh.paddle1.geometry.parameters.height, 1);
  playMesh.paddle2.scale.set(1, 30 / playMesh.paddle2.geometry.parameters.height, 1);
}

function depopPowerUpFromScene() {

  core.scene.remove(powerUp);
  pUpIsDisplayed = false;
}

function handlePowerUp() {
  if (gameState.powerup_status == 1 && !pUpIsDisplayed) {
    popPowerUpOnScene();
  }
  if (gameState.powerup_status == 2 && !pUpEffectIsApplied) {
    depopPowerUpFromScene();
    if (gameState.powerup_type == 1 || gameState.powerup_type == 2) {
      applyHeightPaddleChange();
    }
    pUpEffectIsApplied = true;
  }
  if (gameState.powerup_status == 0 && pUpIsDisplayed) {
    depopPowerUpFromScene();
  }
  if (gameState.powerup_status == 0 && pUpEffectIsApplied) {
    resetPaddles();
    pUpEffectIsApplied = false;
  }
}

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
    //console.log("Message du websocket: ", event.data);
    handleServerMessage(event.data);
  }
}

function handleServerMessage(message) {

  var map = new Map(Object.entries(JSON.parse(message)));
  //console.log("Message du websocket: ", map);

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

function onKeyDown(event) {
  //console.log("J'envoie la touche", event.keyCode)
  switch (event.keyCode) {
    case 65:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "left" }))
      break;
    case 68:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "right" }))
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    case 65:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
    case 68:
      core.gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
  }
}

export { setup };
