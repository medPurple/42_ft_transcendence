import { objMesh, core, gameCustom } from './config.js'

function populateReferee() {

  var objLoader = new THREE.GLTFLoader();

  objLoader.load('../../../images/3D/Lightweight/referee.glb', function(gltf) {
    objMesh.referee = gltf.scene;
    objMesh.referee.scale.set(50, 50, 50);
    objMesh.referee.rotateX(Math.PI / 2);
    objMesh.referee.position.y = 220;
    core.scene.add(objMesh.referee);
  })
}

function populateDoll() {

  var objLoader = new THREE.GLTFLoader();

  objLoader.load('../../../images/3D/Lightweight/squid_game_doll.glb', function(gltf) {
    objMesh.firstAsset = gltf.scene;
    objMesh.firstAsset.scale.set(90, 90, 90);
    //objMesh.referee.rotateX(Math.PI / 2);
    objMesh.firstAsset.position.y = -350;
    objMesh.firstAsset.position.z = -125;
    objMesh.firstAsset.rotateX(Math.PI / 2);
    if (core.player_id == 2) {
      objMesh.firstAsset.position.x = -200;
      objMesh.firstAsset.rotateY(THREE.MathUtils.degToRad(135));
    }
    else {
      objMesh.firstAsset.position.x = 200;
      objMesh.firstAsset.rotateY(THREE.MathUtils.degToRad(225));
    }
    core.scene.add(objMesh.firstAsset);
  })
}

function populateTree() {

  var objLoader = new THREE.GLTFLoader();

  objLoader.load('../../../images/3D/Lightweight/low_poly_dead_tree.glb', function(gltf) {
    objMesh.secondAsset = gltf.scene;
    objMesh.secondAsset.scale.set(4, 4, 4);
    objMesh.secondAsset.position.y = -350;
    objMesh.secondAsset.position.z = -125;
    objMesh.secondAsset.rotateX(Math.PI / 2);
    if (core.player_id == 2) {
      objMesh.secondAsset.position.x = -400;
      objMesh.secondAsset.rotateY(THREE.MathUtils.degToRad(135));
    }
    else {
      objMesh.secondAsset.position.x = 400;
      objMesh.secondAsset.rotateY(THREE.MathUtils.degToRad(250));

    }
    core.scene.add(objMesh.secondAsset);
  })
}

function populateSlide() {

  var objLoader = new THREE.GLTFLoader();

  objLoader.load('../../../images/3D/Lightweight/slide.glb', function(gltf) {
    objMesh.firstAsset = gltf.scene;
    objMesh.firstAsset.scale.set(50, 50, 50);
    objMesh.firstAsset.position.y = -550;
    objMesh.firstAsset.position.z = -225;
    objMesh.firstAsset.rotateX(Math.PI / 2);
    if (core.player_id == 2) {
      objMesh.firstAsset.position.x = -350;
      objMesh.firstAsset.rotateY(THREE.MathUtils.degToRad(340));
    }
    else {
      objMesh.firstAsset.position.x = 350;
      objMesh.firstAsset.rotateY(THREE.MathUtils.degToRad(30));

    }
    core.scene.add(objMesh.firstAsset);
  })
}

function populateABed(index, positionX, positionY, positionZ, rotation, scale) {

  var objLoader = new THREE.GLTFLoader();
  objLoader.load('../../../images/3D/Lightweight/bed.glb', function(gltf) {
    objMesh.beds[index] = gltf.scene;
    objMesh.beds[index].scale.set(scale, scale, scale);
    objMesh.beds[index].rotateX(Math.PI / 2);
    objMesh.beds[index].rotateY(THREE.MathUtils.degToRad(rotation));
    objMesh.beds[index].position.x = positionX;
    objMesh.beds[index].position.y = positionY;
    objMesh.beds[index].position.z = positionZ;
    core.scene.add(objMesh.beds[index]);
  });
}

function populateRowBeds(bedCounter, positionX, positionY, height) {

  var positionZ = -130;
  for (var i = 0; i < (9 * height); i++, bedCounter++) {
    if (i % height == 0) {
      positionX += 100;
      positionZ = -130;
    }
    else
      positionZ += 47.5;
    populateABed(bedCounter, positionX, positionY, positionZ, 270, 15);
  }
}

function populateBeds() {

  populateRowBeds(0, -500, -600, 3);
  populateRowBeds(27, -500, -400, 2);
}

function populateBeds2() {

  var objLoader = new THREE.GLTFLoader();
  objLoader.load('../../../images/3D/Lightweight/bed.glb', function(gltf) {
    objMesh.loadedBed = gltf.scene;
    objMesh.loadedBed.scale.set(15, 15, 15);
    objMesh.loadedBed.rotateX(Math.PI / 2);
    objMesh.loadedBed.rotateY(THREE.MathUtils.degToRad(270));

    const bedGeometry = objMesh.loadedBed.geometry;
    const bedMaterial = objMesh.loadedBed.material;

    const count = 27;
    objMesh.instancedBed = new THREE.InstancedMesh(bedGeometry, bedMaterial, count);

    var positionX = -500;
    var positionY = -600;
    var positionZ = -130;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {

      if (i % 3 == 0) {
        positionX += 100;
        positionZ = -130;
      }
      else
        positionZ += 47.5;
      dummy.position.set(positionX, positionY, positionZ);
      dummy.updateMatrix();
      objMesh.instancedBed.setMatrixAt(i, dummy.matrix);
    }
    core.scene.add(objMesh.instancedBed);
  });
}


export function populateAssets() {

  // switch to popAssets according to map 
  populateReferee();
  switch (gameCustom.map) {
    case 0:
      populateDoll();
      populateTree();
      break;
    case 1:
      populateSlide();
      break;
    default:
      populateBeds2();
  }
}
