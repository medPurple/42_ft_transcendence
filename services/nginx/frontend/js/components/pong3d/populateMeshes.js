import { constants, gameCustom } from "./config.js"

function setPhysicalMaterial(color, metalness, roughness, iridescence, iridescenceIOR, transmission) {

  var physMaterial = new THREE.MeshPhysicalMaterial({
    color: color, roughness: roughness,
    metalness: metalness, iridescence: iridescence,
    iridescenceIOR: iridescenceIOR
  })
  physMaterial.transmission = transmission;
  return physMaterial;
}

function setStandardMaterial(color, metalness, roughness) {

  var stanMaterial = new THREE.MeshStandardMaterial({
    color: color, roughness: roughness,
    metalness: metalness
  })
  return stanMaterial;
}

function setLambertMaterial(color) {

  var lambMaterial = new THREE.MeshLambertMaterial({
    color: color
  })
  return lambMaterial;
}

export function populatePaddle(color, posX, posY) {

  //var paddleMaterial = setLambertMaterial(color);
  var paddleMaterial = setPhysicalMaterial(color, 1, 0.2, 0, 1);
  //var paddleMaterial = setStandardMaterial(color);

  var paddle = new THREE.Mesh(new THREE.BoxGeometry(constants.paddleWidth, constants.paddleHeight, constants.paddleDepth, constants.paddleQuality, constants.paddleQuality, constants.paddleQuality), paddleMaterial);

  paddle.position.x = posX;
  paddle.position.y = posY;
  paddle.position.z = constants.paddleDepth;
  paddle.receiveShadow = true;
  paddle.castShadow = true;

  return paddle;
}

export function populateBall(color, posX, posY) {

  var radius = 5, segments = 6, rings = 6;

  // switch (gameCustom.ball) {
  //   case 0
  // }
  var ballMaterial = new THREE.MeshLambertMaterial({ color: color });

  var ball = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), ballMaterial);

  ball.position.x = posX;
  ball.position.y = posY;
  ball.position.z = radius;
  ball.receiveShadow = true;
  ball.castShadow = true;

  return ball;
}

export function populatePlane(color, posX, posY) {

  var planeMaterial;

  switch (gameCustom.table) {
    case 0:
      planeMaterial = setPhysicalMaterial(0x9f8574, 1, 0.7, 0, 0, 0);
      //planeMaterial = setLambertMaterial(0x9f8574);
      break;
    case 1:
      planeMaterial = setPhysicalMaterial(0x3d8b97, 1, 0.7, 0, 0, 0);
      //     planeMaterial = setLambertMaterial(0x3d8b97);
      break;
    case 2:
      planeMaterial = setPhysicalMaterial(0xb32c6f, 1, 0.7, 0, 0, 0);
      //    planeMaterial = setLambertMaterial(0xb32c6f);
      break;
    case 3:
      planeMaterial = setPhysicalMaterial(0x161616, 1, 0.4, 0, 0, 0);
      //   planeMaterial = setLambertMaterial(0xffd700);
      break;
    case 4:
      planeMaterial = setPhysicalMaterial(0xf8f8ff, 0, 0, 0, 0, 1);
      //  planeMaterial = setLambertMaterial(0x000000);
      break;
    default:
      planeMaterial = setPhysicalMaterial(0x7b8787, 1, 0.7, 0, 0, 0);
      // planeMaterial = setLambertMaterial(0x7b8787);
      break;

  }
  //  var planeMaterial = new THREE.MeshLambertMaterial({ color: color });

  //var planeMaterial = setPhysicalMaterial(color, 1, 0.2, 0, 0);

  var plane = new THREE.Mesh(new THREE.PlaneGeometry(constants.planeWidth * 0.95, constants.planeHeight, constants.planeQuality, constants.planeQuality), planeMaterial);
  plane.position.x = posX;
  plane.position.y = posY;
  plane.receiveShadow = true;

  return plane;
}

export function populateTable(color, posX, posY, posZ) {

  var tableMaterial = new THREE.MeshLambertMaterial({ color: color });

  var table = new THREE.Mesh(new THREE.BoxGeometry(constants.tableWidth, constants.tableHeight, constants.tableQuality, constants.tableQuality, 1), tableMaterial);
  table.position.x = posX;
  table.position.y = posY;
  table.position.z = posZ;
  table.receiveShadow = true;

  return table;
}

export function populateFloor() {

  const groundTexLoader = new THREE.TextureLoader();

  var path = '../../../images/Floor/FL_RedCarpet.png';

  switch (gameCustom.map) {
    case 0:
      path = '../../../images/Floor/F-Cornfield.jpg';
      break;
    case 1:
      path = '../../../images/Floor/F-Playground.jpg';
      break;
    default:
      path = '../../../images/Floor/F-Concrete.jpg';
  }


  var groundMaterial = new THREE.MeshLambertMaterial({
    map: groundTexLoader.load(path,
      function(texture) {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        // const repeatX = 2200 / 512;
        // const repeatY = 2200 / 512;
        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(repeatX, repeatY);
        // texture.minFilter = THREE.LinearFilter;
        // texture.magFilter = THREE.LinearFilter;
      })
  });

  var ground = new THREE.Mesh(new THREE.BoxGeometry(constants.groundWidth, constants.groundHeight, constants.groundQuality, 1, 1, 1), groundMaterial);
  ground.position.z = -132;
  ground.receiveShadow = true;

  return ground;
}

export function populateWall(player_id) {

  const wallTexLoader = new THREE.TextureLoader();

  var path;

  switch (gameCustom.map) {
    case 0:
      path = '../../../images/Walls/final/W-Cornfield.jpg';
      break;
    case 1:
      path = '../../../images/Walls/final/W-Playground.jpg';
      break;
    case 2:
      path = '../../../images/Walls/final/W-Dorm.jpg';
      break;
    case 3:
      path = '../../../images/Walls/final/W-Tiled.png';
      break;
    default:
      path = '../../../images/Walls/final/W-Tiled2.png'
  }

  var wallMaterial = new THREE.MeshLambertMaterial({
    map: wallTexLoader.load(path,
      function(texture) {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
      })
  });

  var wall = new THREE.Mesh(new THREE.BoxGeometry(constants.wallWidth, constants.wallHeight, constants.wallQuality, 1, 1, 1), wallMaterial);

  if (player_id == 1) {
    wall.position.x = 500;
  }
  else {
    wall.position.x = -500;
  }
  if (gameCustom.map == 3) {
    wall.position.z = 100;
  }
  else
    wall.position.z = 380;
  wall.rotateY(Math.PI / 2);
  wall.rotateZ(Math.PI / 2);
  wall.receiveShadow = true;

  return wall;
}
