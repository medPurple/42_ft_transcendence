//Global variables for the project (scene, renderer, camera, lights)

var gameState = {
  player1Score: 0,
  player2Score: 0,
  paddle1_positionX: 0,
  paddle1_positionY: 0,
  paddle1_width: 0,
  paddle2_positionX: 0,
  paddle2_positionY: 0,
  paddle2_width: 0,
  ball_positionX: 0,
  ball_positionY: 0,
  active: 0
}

var party = false;

var gameSocket;

var player_id = 0;

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

var camera, scene, renderer, pointLight, spotLight;

var fieldWidth = 400, fieldHeight = 200;

var WIDTH = 640, HEIGHT = 360, VIEW_ANGLE = 75, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

var paddleWidth = 10, paddleHeight = 30, paddleDepth = 10, paddleQuality = 1;

var ball, paddle1, paddle2;

var ballStartDirection;

function createScene() {

  //Render setup

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(WIDTH, HEIGHT);

  var c = document.getElementById("pong-renderer");

  if (!c) {
    console.error("Game div not found !");
    return;
  }
  c.appendChild(renderer.domElement);

  //Scene setup

  scene = new THREE.Scene();

  //Camera setup

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
  camera.position.z = 230;

  //Ball setup

  var radius = 5,
    segments = 6,
    rings = 6;

  var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xD43001 });

  ball = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);

  ball.position.x = 0;
  ball.position.y = 0;
  ball.position.z = radius;
  ball.receiveShadow = true;
  ball.castShadow = true;

  // PointLight setup

  pointLight = new THREE.PointLight(0xF8D898);

  pointLight.position.x = -1000;
  pointLight.position.y = 0;
  pointLight.position.z = 1000;
  pointLight.intensity = 2.9;
  pointLight.distance = 10000;

  //Spotlight setup

  spotLight = new THREE.SpotLight(0xF8D898);
  spotLight.position.x = 0;
  spotLight.position.y = 0;
  spotLight.position.z = 460;
  spotLight.intensity = 1.5;
  spotLight.castShadow = true;

  //Plane setup

  var planeWidth = fieldWidth,
    planeHeight = fieldHeight,
    planeQuality = 10;

  var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x4BD121 });

  var plane = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth * 0.95, planeHeight, planeQuality, planeQuality), planeMaterial);
  plane.receiveShadow = true;

  //Paddle Setupjs

  var paddle1Material = new THREE.MeshLambertMaterial({ color: 0x1B32C0 });

  paddle1 = new THREE.Mesh(new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth, paddleQuality, paddleQuality, paddleQuality), paddle1Material);

  var paddle2Material = new THREE.MeshLambertMaterial({ color: 0xFF4045 });

  paddle2 = new THREE.Mesh(new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth, paddleQuality, paddleQuality, paddleQuality), paddle2Material);

  paddle1.position.x = -fieldWidth / 2 + paddleWidth;
  paddle2.position.x = fieldWidth / 2 - paddleWidth;

  paddle1.position.z = paddleDepth;
  paddle2.position.z = paddleDepth;
  paddle1.receiveShadow = true;
  paddle1.castShadow = true;
  paddle2.receiveShadow = true;
  paddle2.castShadow = true;

  //Table Setup

  var tableWidth = planeWidth * 1.05,
    tableHeight = planeHeight * 1.03,
    tableQuality = planeQuality;

  var tableMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });

  var table = new THREE.Mesh(new THREE.BoxGeometry(tableWidth, tableHeight, tableQuality, tableQuality, 1), tableMaterial);
  table.position.z = -7;
  table.receiveShadow = true;

  //Pillar Setup

  var pillarMaterial = new THREE.MeshLambertMaterial({ color: 0x534d0d });

  for (var i = 0; i < 5; i++) {

    var pillar = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 500, 1, 1, 1), pillarMaterial);

    pillar.position.x = -50 + i * 100;
    pillar.position.y = -230;
    pillar.position.z = -30;
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    scene.add(pillar);
  }

  for (var i = 0; i < 5; i++) {

    var pillar = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 500, 1, 1, 1), pillarMaterial);

    pillar.position.x = -50 + i * 100;
    pillar.position.y = 230;
    pillar.position.z = -30;
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    scene.add(pillar);
  }

  //Ground setup

  var groundWidth = 1000,
    groundHeight = 1000,
    groundQuality = 3;

  var groundMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });

  var ground = new THREE.Mesh(new THREE.BoxGeometry(groundWidth, groundHeight, groundQuality, 1, 1, 1), groundMaterial);
  ground.position.z = -132;
  ground.receiveShadow = true;

  //Add all to the scene

  scene.add(pointLight);
  scene.add(spotLight);
  scene.add(paddle1);
  scene.add(paddle2);
  scene.add(ball);
  scene.add(table);
  scene.add(plane);
  scene.add(ground);
  scene.add(camera);

  //renderer.shadowMapEnabled = true;

}

function cameraLogic() {

  //spotLight.position.x = ball.position.x * 2;
  //spotLight.position.y = ball.position.y * 2;
  camera.position.x = paddle1.position.x - 60;
  camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
  camera.position.z = paddle1.position.z + 100;

  //camera.rotation.x = -0.01 * (ball.position.y) * Math.PI / 180;
  camera.rotation.z = -90 * Math.PI / 180;
  camera.rotation.y = -60 * Math.PI / 180;

}

function cameraLogic2() {

  //spotLight.position.x = ball.position.x * 2;
  //spotLight.position.y = ball.position.y * 2;
  camera.position.x = paddle2.position.x + 60;
  camera.position.y += (paddle2.position.y - camera.position.y) * 0.05;
  camera.position.z = paddle2.position.z + 100;

  camera.rotation.x = 0.01 * (ball.position.y) * Math.PI / 180;
  camera.rotation.z = 90 * Math.PI / 180;
  camera.rotation.y = 60 * Math.PI / 180;

}


function draw() {

  if (player_id == 1) {
    cameraLogic();
  }
  else {
    cameraLogic2();
  }

  renderer.render(scene, camera);
}

function setup() {

  gameSocket = new WebSocket('ws://' + window.location.host + '/ws/pong/');

  gameSocket.onopen = function(e) {
    console.log('Connected');
  };

  gameSocket.onerror = function(e) {
    console.log('Error');
  };

  gameSocket.onclose = function(e) {
    console.log('Closed');
  };

  gameSocket.onmessage = function(event) {
    //console.log("Message du websocket: ", event.data);
    handleServerMessage(event.data);
  }
}

function handleServerMessage(message) {

  var map = new Map(Object.entries(JSON.parse(message)));
  console.log("Message du websocket: ", map);

  for (let [key, value] of map.entries()) {
    if (key == "party" && value == 'active') {
      party = true;
      createScene();
      draw();
      return;
    }
    if (key == "player") {
      player_id = value;
      return;
    }
    if (key == "player1Score")
      gameState.player1Score = value;
    if (key == "player2Score")
      gameState.player2Score = value;
    if (key == "paddle1.positionX")
      paddle1.position.x = value;
    if (key == "paddle1.positionY")
      paddle1.position.y = value;
    if (key == "paddle1.width")
      gameState.paddle1_width = value;
    if (key == "paddle2.positionX")
      paddle2.position.x = value;
    if (key == "paddle2.positionY")
      paddle2.position.y = value;
    if (key == "paddle2.width")
      gameState.paddle2_width = value;
    if (key == "ball.positionX")
      ball.position.x = value;
    if (key == "ball.positionY")
      ball.position.y = value;
    if (key == "active")
      gameState.active = value;
  }
  draw();
}

function onKeyDown(event) {
  switch (event.keyCode) {
    case 65:
      gameSocket.send(JSON.stringify({ 'paddleMov': "left" }))
      break;
    case 68:
      gameSocket.send(JSON.stringify({ 'paddleMov': "right" }))
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    case 65:
      gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
    case 68:
      gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
  }
}

export { setup };
