import { gameState, pUpMesh } from './config.js'

function populateCircleShape(color) {

  var radius = 10;
  var segments = 64;

  var vertices = [];

  var angleIncrement = (Math.PI * 2) / segments;

  for (var i = 0; i <= segments; i++) {
    var angle = angleIncrement * i;
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    vertices.push(new THREE.Vector3(x, y, 0));
  }

  var geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  var material = new THREE.LineBasicMaterial({ color: color });

  var circleMesh = new THREE.LineLoop(geometry, material);

  if (gameState.game_mode == "remote") {
    circleMesh.rotateX(Math.PI / 2);
    circleMesh.rotateY(Math.PI / 2);
  }
  circleMesh.position.z = 20;
  return circleMesh;
}

function populateTriangleShape(color) {

  var size = 15;
  var vertices = [
    new THREE.Vector3(0, size / Math.sqrt(3), 0),
    new THREE.Vector3(-size / 2, -size / (2 * Math.sqrt(3)), 0),
    new THREE.Vector3(size / 2, -size / (2 * Math.sqrt(3)), 0)
  ];

  var geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  var material = new THREE.LineBasicMaterial({ color: color });

  var triangleMesh = new THREE.LineLoop(geometry, material);

  if (gameState.game_mode == "remote") {
    triangleMesh.rotateX(Math.PI / 2);
    triangleMesh.rotateY(Math.PI / 2);
  }
  triangleMesh.position.z = 20;
  return triangleMesh;
}

function populateStarShape(color) {

  var size = 10;

  var numPoints = 5;

  var vertices = [];

  for (var i = 0; i < numPoints * 2; i++) {
    var angle = (i / numPoints) * Math.PI;
    var r = (i % 2 === 0) ? size : size / 2;
    var x = r * Math.cos(angle);
    var y = r * Math.sin(angle);
    vertices.push(new THREE.Vector3(x, y, 0));
  }

  var geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  var material = new THREE.LineBasicMaterial({ color: color });

  var starMesh = new THREE.LineLoop(geometry, material);

  if (gameState.game_mode == "remote") {
    starMesh.rotateX(Math.PI / 2);
    starMesh.rotateY(Math.PI / 2);
    starMesh.rotateZ(Math.PI / 10);
  }
  starMesh.position.z = 20;
  return starMesh;
}

function populateSquareShape(color) {

  var size = 15;

  var vertices = [
    new THREE.Vector3(-size / 2, size / 2, 0),
    new THREE.Vector3(size / 2, size / 2, 0),
    new THREE.Vector3(size / 2, -size / 2, 0),
    new THREE.Vector3(-size / 2, -size / 2, 0),
    new THREE.Vector3(-size / 2, size / 2, 0)
  ];

  var geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  var material = new THREE.LineBasicMaterial({ color: color });

  var squareMesh = new THREE.LineLoop(geometry, material);

  if (gameState.game_mode == "remote") {
    squareMesh.rotateX(Math.PI / 2);
    squareMesh.rotateY(Math.PI / 2);
  }
  squareMesh.position.z = 20;
  return squareMesh;
}

export function populatePowerUps() {

  pUpMesh.triangle = populateTriangleShape(0xff0000);
  pUpMesh.circle = populateCircleShape(0x22ff00);
  pUpMesh.square = populateSquareShape(0x004ff);
  pUpMesh.star = populateStarShape(0xfbff00);
}
