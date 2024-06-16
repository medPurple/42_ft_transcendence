import * as THREE from 'three';
import { constants, gameCustom, palette } from "./config.js"

function setPhysicalMaterial(color, metalness, roughness, iridescence, iridescenceIOR, transmission) {

  var physMaterial = new THREE.MeshPhysicalMaterial({
    color: color, roughness: roughness,
    metalness: metalness, iridescence: iridescence,
    iridescenceIOR: iridescenceIOR
  })
  physMaterial.transmission = transmission;
  return physMaterial;
}

function setMeshPhongMaterial(color, shading) {

  const phongMaterial = new THREE.MeshPhongMaterial({
    color: color,
    flatShading: shading,
  })
  return phongMaterial;
}

export function populateSelfPaddle(posX, posY) {

  var paddleMaterial;

  switch (gameCustom.ownPaddle) {
    case 0:
      paddleMaterial = setMeshPhongMaterial(palette.rose01, 1);
      break;
    case 1:
      paddleMaterial = setMeshPhongMaterial(palette.rose02, 1);
      break;
    case 2:
      paddleMaterial = setMeshPhongMaterial(palette.blue03, 1);
      break;
    case 3:
      paddleMaterial = setMeshPhongMaterial(palette.blue04, 1);
      break;
    default:
      paddleMaterial = setMeshPhongMaterial(palette.black, 1);
      break;
  }

  var paddle = new THREE.Mesh(new THREE.BoxGeometry(constants.paddleWidth, constants.paddleHeight, constants.paddleDepth, constants.paddleQuality, constants.paddleQuality, constants.paddleQuality), paddleMaterial);

  paddle.position.x = posX;
  paddle.position.y = posY;
  paddle.position.z = constants.paddleDepth;
  paddle.receiveShadow = true;
  paddle.castShadow = true;

  return paddle;
}

export function populateOtherPaddle(posX, posY) {

  var paddleMaterial;

  if (gameCustom.otherPaddle == gameCustom.ownPaddle) {
    if (gameCustom.ownPaddle == 4)
      gameCustom.otherPaddle = 1;
    else
      gameCustom.otherPaddle = 4;
  }

  switch (gameCustom.otherPaddle) {
    case 0:
      paddleMaterial = setMeshPhongMaterial(palette.rose01, 1);
      break;
    case 1:
      paddleMaterial = setMeshPhongMaterial(palette.rose02, 1);
      break;
    case 2:
      paddleMaterial = setMeshPhongMaterial(palette.blue03, 1);
      break;
    case 3:
      paddleMaterial = setMeshPhongMaterial(palette.blue04, 1);
      break;
    default:
      paddleMaterial = setMeshPhongMaterial(palette.black, 1);
      break;
  }

  var paddle = new THREE.Mesh(new THREE.BoxGeometry(constants.paddleWidth, constants.paddleHeight, constants.paddleDepth, constants.paddleQuality, constants.paddleQuality, constants.paddleQuality), paddleMaterial);

  paddle.position.x = posX;
  paddle.position.y = posY;
  paddle.position.z = constants.paddleDepth;
  paddle.receiveShadow = true;
  paddle.castShadow = true;

  return paddle;
}

export function populateBall(posX, posY) {

  var radius = 5, segments = 6, rings = 6;
  var ballMaterial;

  switch (gameCustom.ball) {
    case 0:
      ballMaterial = setPhysicalMaterial(palette.yellow, 1, 0.7, 0, 0, 0);
      break;
    case 1:
      ballMaterial = setPhysicalMaterial(palette.white, 1, 0.7, 0, 0, 0);
      break;
    default:
      ballMaterial = setPhysicalMaterial(palette.blue01, 1, 0.7, 0, 0, 0);
      break;
  }

  var ball = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), ballMaterial);

  ball.position.x = posX;
  ball.position.y = posY;
  ball.position.z = radius;
  ball.receiveShadow = true;
  ball.castShadow = true;

  return ball;
}

export function populatePlane(posX, posY) {

  var planeMaterial = setMeshPhongMaterial(palette.white, 0);
  var plane = new THREE.Mesh(new THREE.PlaneGeometry(constants.planeWidth, constants.planeHeight * 0.95, constants.planeQuality, constants.planeQuality), planeMaterial);

  plane.position.x = posX;
  plane.position.y = posY;

  return plane;
}

export function populateLine(posX, posY) {

  var lineMaterial = setMeshPhongMaterial(palette.white, 0);
  var line = new THREE.Mesh(new THREE.PlaneGeometry(constants.planeWidth * 0.95, constants.planeHeight * 0.95, constants.planeQuality, constants.planeQuality), lineMaterial);

  line.position.x = posX;
  line.position.y = posY;

  return line;
}

export function populateHorizontalLine(posX, posY) {

  var lineMaterial = setMeshPhongMaterial(palette.white, 0);
  var line = new THREE.Mesh(new THREE.PlaneGeometry(constants.tableWidth * 0.90, constants.planeWidth, constants.planeQuality, constants.planeQuality), lineMaterial);

  line.position.x = posX;
  line.position.y = posY;

  return line;
}


export function populateTable(posX, posY, posZ) {

  switch (gameCustom.table) {
    case 0:
      var texturePath = "../../../images/Textures/Metal.jpeg";
      break;
    case 1:
      var texturePath = "../../../images/Textures/Concrete.jpeg";
      break;
    default:
      var texturePath = "../../../images/Textures/Wood.jpeg";
      break;
  }

  var tableTexture = new THREE.TextureLoader().load(texturePath);
  var tableMaterial = new THREE.MeshBasicMaterial({ map: tableTexture });

  var table = new THREE.Mesh(new THREE.BoxGeometry(constants.tableWidth, constants.tableHeight, constants.tableQuality, constants.tableQuality, 1), tableMaterial);
  table.position.x = posX;
  table.position.y = posY;
  table.position.z = posZ;
  table.receiveShadow = true;
  table.castShadow = true;

  return table;
}

export function populateSkybox() {

  let materialArray = [];

  let name_file;
  switch (gameCustom.map) {
    case 0:
      name_file = "../../../images/Skybox/01/playground";
      break;
    case 1:
      name_file = "../../../images/Skybox/02/cornfield";
      break;
    case 2:
      name_file = "../../../images/Skybox/03/dormitory";
      break;
    case 3:
      name_file = "../../../images/Skybox/04/ow";
      break;
  }

  let texture_ft = new THREE.TextureLoader().load(name_file + '_ft.jpg');
  let texture_bk = new THREE.TextureLoader().load(name_file + '_bk.jpg');
  let texture_up = new THREE.TextureLoader().load(name_file + '_up.jpg');
  let texture_dn = new THREE.TextureLoader().load(name_file + '_dn.jpg');
  let texture_rt = new THREE.TextureLoader().load(name_file + '_rt.jpg');
  let texture_lf = new THREE.TextureLoader().load(name_file + '_lf.jpg');

  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

  for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;

  let skyboxGeometry;
  let position = 400;
  switch (gameCustom.map) {
    case 0:
      skyboxGeometry = new THREE.BoxGeometry(2048, 1807, 2048);
      position = 800;
      break;
    case 1:
      skyboxGeometry = new THREE.BoxGeometry(2048, 1024, 2048);
      break;
    case 2:
      skyboxGeometry = new THREE.BoxGeometry(2048, 1024, 2048);
      break;
    case 3:
      skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
      break;
  }

  let skybox = new THREE.Mesh(skyboxGeometry, materialArray);
  skybox.rotation.x = Math.PI / 2;
  skybox.position.z += position;

  return skybox;
}
