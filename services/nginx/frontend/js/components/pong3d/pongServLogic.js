//Global variables for the project (scene, renderer, camera, lights)

var gameState = {
  player1Score: 0,
  player2Score: 0,
  score_limit: 7,
  paddle1_positionX: 0,
  paddle1_positionY: 0,
  paddle1_width: 0,
  paddle1_powerup: 0,
  paddle2_positionX: 0,
  paddle2_positionY: 0,
  paddle2_width: 0,
  paddle2_powerup: 0,
  ball_positionX: 0,
  ball_positionY: 0,
  powerup_positionX: 0,
  powerup_positionY: 0,
  powerup_status: 0,
  powerup_type: 0,
  active: 0
}

const gameCustom = {

  ownPaddle: 0,
  otherPaddle: 0,
  ball: 0,
  map: 0,
  table: 0,
  powerup: 0,
  score_limit: 0
}

var core = {
  scene: 0,
  renderer: 0,
  camera: 0,
  gameSocket: 0,
  party: 0,
  player_id: 0
}

var playMesh = {
  paddle1: 0,
  paddle2: 0,
  ball: 0
}

var pUpMesh = {
  triangle: 0,
  circle: 0,
  square: 0,
  star: 0
}

var decMesh = {
  ground: 0,
  plane: 0,
  table: 0,
  wall: 0
}

var objMesh = {

  referee: 0,
  firstprop: 0,
  secondprop: 0
}

var lights = {

  pointLight: 0,
  pointLight2: 0,
  spotLight: 0
}


var fieldWidth = 400, fieldHeight = 200;

var WIDTH = 640, HEIGHT = 426, VIEW_ANGLE = 75, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

var paddleWidth = 10, paddleHeight = 30, paddleDepth = 10, paddleQuality = 1;

var powerUp, pUpIsDisplayed = false, pUpEffectIsApplied = false;

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

//Functions used to create the scene

function populatePaddle(height, color, positionX, positionY) {

  var paddleMaterial = new THREE.MeshLambertMaterial({ color: color });

  var paddle = new THREE.Mesh(new THREE.BoxGeometry(paddleWidth, height, paddleDepth, paddleQuality, paddleQuality, paddleQuality), paddleMaterial);

  paddle.position.x = positionX;
  paddle.position.y = positionY;
  paddle.position.z = paddleDepth;
  paddle.receiveShadow = true;
  paddle.castShadow = true;

  return paddle;
}

function createScene() {

  //Render setup

  console.log("Scene is created");
  core.renderer = new THREE.WebGLRenderer();

  core.renderer.setSize(WIDTH, HEIGHT);

  var c = document.getElementById("pong-renderer");

  if (!c) {
    console.error("Game div not found !");
    return;
  }
  c.appendChild(core.renderer.domElement);

  //Scene setup

  core.scene = new THREE.Scene();

  //Camera setup

  core.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
  core.camera.position.z = 230;

  //Ball setup

  var radius = 5,
    segments = 6,
    rings = 6;

  var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xD43001 });

  playMesh.ball = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);

  playMesh.ball.position.x = 0;
  playMesh.ball.position.y = 0;
  playMesh.ball.position.z = radius;
  playMesh.ball.receiveShadow = true;
  playMesh.ball.castShadow = true;

  // PointLight setup

  lights.pointLight = new THREE.PointLight(0xF8D898);

  lights.pointLight.position.x = -1000;
  lights.pointLight.position.y = 0;
  lights.pointLight.position.z = 1000;
  lights.pointLight.intensity = 1.5;
  lights.pointLight.distance = 10000;

  lights.pointLight2 = new THREE.PointLight(0xF8D898);

  lights.pointLight2.position.x = 1000;
  lights.pointLight2.position.y = 0;
  lights.pointLight2.position.z = 1000;
  lights.pointLight2.intensity = 1.5;
  lights.pointLight2.distance = 10000;



  //Spotlight setup

  lights.spotLight = new THREE.SpotLight(0xF8D898);
  lights.spotLight.position.x = 0;
  lights.spotLight.position.y = 0;
  lights.spotLight.position.z = 460;
  lights.spotLight.intensity = 1.5;
  lights.spotLight.castShadow = true;

  //Plane setup

  var planeWidth = fieldWidth,
    planeHeight = fieldHeight,
    planeQuality = 10;

  var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x4BD121 });

  decMesh.plane = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth * 0.95, planeHeight, planeQuality, planeQuality), planeMaterial);
  decMesh.plane.receiveShadow = true;

  //Paddle Setup

  playMesh.paddle1 = populatePaddle(30, 0x1B32C0, -fieldWidth / 2 + paddleWidth, 0);
  playMesh.paddle2 = populatePaddle(30, 0xFF4045, fieldWidth / 2 + paddleWidth, 0);

  //Table Setup

  var tableWidth = planeWidth * 1.05,
    tableHeight = planeHeight * 1.03,
    tableQuality = planeQuality;

  var tableMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });

  decMesh.table = new THREE.Mesh(new THREE.BoxGeometry(tableWidth, tableHeight, tableQuality, tableQuality, 1), tableMaterial);
  decMesh.table.position.z = -7;
  decMesh.table.receiveShadow = true;

  //Ground setup

  var groundWidth = 1000,
    groundHeight = 2200,
    groundQuality = 3;

  var groundMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });

  decMesh.ground = new THREE.Mesh(new THREE.BoxGeometry(groundWidth, groundHeight, groundQuality, 1, 1, 1), groundMaterial);
  decMesh.ground.position.z = -132;
  decMesh.ground.receiveShadow = true;

  // Wall setup

  var wallHeight = 1365, wallWidth = 2048, wallQuality = 3;

  const texLoader = new THREE.TextureLoader();

  var wallMaterial = new THREE.MeshLambertMaterial({
    map: texLoader.load('../../../images/Walls/Wall-Back-Figures.png',
      function(texture) {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
      })
  });

  decMesh.wall = new THREE.Mesh(new THREE.BoxGeometry(wallWidth, wallHeight, wallQuality, 1, 1, 1), wallMaterial);

  if (core.player_id == 1) {
    decMesh.wall.position.x = 500;
  }
  else {
    decMesh.wall.position.x = -500;
  }
  decMesh.wall.position.z = 75;
  decMesh.wall.rotateY(Math.PI / 2);
  decMesh.wall.rotateZ(Math.PI / 2);
  decMesh.wall.receiveShadow = true;

  var objLoader = new THREE.GLTFLoader();

  objLoader.load('../../../images/3D/untitled.glb', function(gltf) {
    objMesh.referee = gltf.scene;
    objMesh.referee.scale.set(50, 50, 50);
    objMesh.referee.rotateX(Math.PI / 2);
    objMesh.referee.position.y = 220;
    core.scene.add(objMesh.referee);
  })

  //Add all to the scene

  core.scene.add(lights.pointLight);
  core.scene.add(lights.pointLight2);
  core.scene.add(lights.spotLight);
  core.scene.add(playMesh.paddle1);
  core.scene.add(playMesh.paddle2);
  core.scene.add(playMesh.ball);
  core.scene.add(decMesh.table);
  core.scene.add(decMesh.plane);
  core.scene.add(decMesh.wall);
  core.scene.add(decMesh.ground);
  core.scene.add(core.camera);

  //renderer.shadowMapEnabled = true;

}

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

// function changePaddle(paddle, height, color, positionX, positionY) {
//
//   scene.remove(paddle);
//   paddle = populatePaddle(height, color, positionX, positionY);
//   return paddle;
// }

function applyHeightPaddleChange() {

  if (gameState.paddle1_powerup == 1) {
    playMesh.paddle2.scale.set(1, 20 / paddleHeight, 1);
  }
  else if (gameState.paddle1_powerup == 2) {
    playMesh.paddle1.scale.set(1, 40 / paddleHeight, 1);
  }
  else if (gameState.paddle2_powerup == 1) {
    playMesh.paddle1.scale.set(1, 20 / paddleHeight, 1);
  }
  else if (gameState.paddle2_powerup == 2) {
    playMesh.paddle2.scale.set(1, 40 / paddleHeight, 1);
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
