//Global variables for the project (scene, renderer, camera, lights)

var moveLeft = false;

var moveRight = false;

var advMoveLeft = false;

var advMoveRight = false;

var gameSocket;

var player_id = 0;

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

var camera, scene, renderer, pointLight, spotLight;

var fieldWidth = 400, fieldHeight = 200;

var WIDTH = 640, HEIGHT = 360, VIEW_ANGLE = 75, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

var paddleWidth = 10, paddleHeight = 30, paddleDepth = 10, paddleQuality = 1;

var ball, paddle1, paddle2;

var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

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

function ballPhysics() {

  if (ball.position.x <= -fieldWidth / 2) {
    resetBall(2);
  }
  if (ball.position.x >= fieldWidth / 2) {
    resetBall(1);
  }
  if (ball.position.y <= -fieldHeight / 2) {
    ballDirY = -ballDirY;
  }
  if (ball.position.y >= fieldHeight / 2) {
    ballDirY = -ballDirY;
  }

  ball.position.x += ballDirX * ballSpeed;
  ball.position.y += ballDirY * ballSpeed;

  if (ballDirY > ballSpeed * 2) {
    ballDirY = ballSpeed * 2;
  }
  if (ballDirY < -ballSpeed * 2) {
    ballDirY = -ballSpeed * 2;
  }
}

function paddlePhysics() {

  if (ball.position.x <= paddle1.position.x + paddleWidth && ball.position.x >= paddle1.position.x) {
    if (ball.position.y <= paddle1.position.y + paddleHeight / 2 && ball.position.y >= paddle1.position.y - paddleHeight / 2) {
      if (ballDirX < 0) {
        ballDirX = -ballDirX;
        ballDirY -= paddle1DirY * 0.7;
      }
    }
  }
  if (ball.position.x <= paddle2.position.x + paddleWidth && ball.position.x >= paddle2.position.x) {
    if (ball.position.y <= paddle2.position.y + paddleHeight / 2 && ball.position.y >= paddle2.position.y - paddleHeight / 2) {
      if (ballDirX > 0) {
        ballDirX = -ballDirX;
        ballDirY -= paddle2DirY * 0.7;
      }
    }
  }
}

// function opponentPaddleMovement() {
//
//   paddle2DirY = (ball.position.y - paddle2.position.y);
//   if (Math.abs(paddle2DirY) <= paddleSpeed) {
//     paddle2.position.y += paddle2DirY;
//   }
//   else {
//     if (paddle2DirY > paddleSpeed) {
//       paddle2.position.y += paddleSpeed;
//     }
//     else if (paddle2DirY < -paddleSpeed) {
//       paddle2.position.y -= paddleSpeed;
//     }
//   }
//   paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
// }
//

function opponentPaddleMovement() {

  if (advMoveRight == true) {
    if (paddle2.position.y < fieldHeight * 0.45) {
      paddle2DirY = paddleSpeed * 0.5;
    }
    else {
      paddle2DirY = 0;
      //paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
    }
  }
  else if (advMoveLeft == true) {
    if (paddle2.position.y > -fieldHeight * 0.45) {
      paddle2DirY = -paddleSpeed * 0.5;
    }
    else {
      paddle2DirY = 0;
      //paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
    }
  }
  else {
    paddle2DirY = 0;
  }

  paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
  paddle2.scale.z += (1 - paddle2.scale.z) * 0.2;
  paddle2.position.y += paddle2DirY;
}



function resetBall(ballStartDirection) {

  ball.position.x = 0;
  ball.position.y = 0;

  if (ballStartDirection == 1) {
    ballDirX = -1;
  }
  else {
    ballDirX = 1;
  }
  ballDirY = 1;
}

function paddleMovement() {

  if (moveLeft == true) {
    if (paddle1.position.y < fieldHeight * 0.45) {
      paddle1DirY = paddleSpeed * 0.5;
    }
    else {
      paddle1DirY = 0;
      //paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
    }
  }
  else if (moveRight == true) {
    if (paddle1.position.y > -fieldHeight * 0.45) {
      paddle1DirY = -paddleSpeed * 0.5;
    }
    else {
      paddle1DirY = 0;
      //paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
    }
  }
  else {
    paddle1DirY = 0;
  }

  paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
  paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
  paddle1.position.y += paddle1DirY;
}

function cameraLogic() {

  //spotLight.position.x = ball.position.x * 2;
  //spotLight.position.y = ball.position.y * 2;
  camera.position.x = paddle1.position.x - 60;
  camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
  camera.position.z = paddle1.position.z + 100;

  camera.rotation.x = -0.01 * (ball.position.y) * Math.PI / 180;
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

  renderer.render(scene, camera);
  requestAnimationFrame(draw);

  //ballPhysics();
  paddlePhysics();
  paddleMovement();
  opponentPaddleMovement();
  //cameraLogic();
  //cameraLogic2();
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

  createScene();
  draw();
}

function handleServerMessage(message) {

  var map = new Map(Object.entries(JSON.parse(message)));
  //console.log("Message du websocket: ", map);

  for (let [key, value] of map.entries()) {
    if (key == "player") {
      player_id = value;
    }
    else if (key == "paddleMov2" || key == "paddleMov1")
      handleAdvMove(key, value)
  }
}

function handleAdvMove(key, value) {

  if ((key == "paddleMov2" && player_id == 1) || (key == "paddleMov1" && player_id == 2)) {
    if (value == "right") {
      advMoveRight = true;
      advMoveLeft = false;
    }
    else if (value == "left") {
      advMoveLeft = true;
      advMoveRight = false;
    }
    else {
      advMoveLeft = false;
      advMoveRight = false;
    }
  }
}
// if (obj.hasOwnProperty('player'))
//   //console.log("Player message detected")
//
// else if (obj.hasOwnProperty('paddleMov2')) // Rajouter la condition d identite
//   console.log("PaddleMov2 message detected")
// else if (obj.hasOwnProperty('paddleMov1')) // Rajouter la condition d identite
//   console.log("PaddleMov1 message detected")
// //if (message == )


function onKeyDown(event) {
  switch (event.keyCode) {
    case 65:
      moveLeft = true;
      gameSocket.send(JSON.stringify({ 'paddleMov': "left" }))
      break;
    case 68:
      moveRight = true;
      gameSocket.send(JSON.stringify({ 'paddleMov': "right" }))
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    case 65:
      moveLeft = false;
      gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
    case 68:
      moveRight = false;
      gameSocket.send(JSON.stringify({ 'paddleMov': "false" }))
      break;
  }
}

export { setup };

