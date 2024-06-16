import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { objMesh, core, gameCustom } from './config.js'

function populateReferee() {
  var objLoader = new GLTFLoader();

  objLoader.load('../../../images/3D/Lightweight/referee.glb', function(gltf) {
    objMesh.referee = gltf.scene;
    objMesh.referee.scale.set(50, 50, 50);
    objMesh.referee.rotateX(Math.PI / 2);
    objMesh.referee.position.y = 220;
    core.scene.add(objMesh.referee);
  })
}

function populateDoll() {
  var objLoader = new GLTFLoader();

  objLoader.load('../../../images/3D/Lightweight/squid_game_doll.glb', function(gltf) {
    objMesh.firstAsset = gltf.scene;
    objMesh.firstAsset.scale.set(90, 90, 90);
    objMesh.firstAsset.position.y = 0;
    objMesh.firstAsset.position.z = -100;
    objMesh.firstAsset.rotateX(Math.PI / 2);

    if (core.player_id == 2) {
      objMesh.firstAsset.position.x = -800;
      objMesh.firstAsset.rotateY(Math.PI / 2);
    }
    else {
      objMesh.firstAsset.position.x = 800;
      objMesh.firstAsset.rotateY(Math.PI / 2);
    }

    core.scene.add(objMesh.firstAsset);
  })
}

function populateSlide() {
  var objLoader = new GLTFLoader();

  objLoader.load('../../../images/3D/Lightweight/slide.glb', function(gltf) {
    objMesh.firstAsset = gltf.scene;
    objMesh.firstAsset.scale.set(50, 50, 50);
    objMesh.firstAsset.position.y = -550;
    objMesh.firstAsset.position.z = -100;
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

function populateRowBed(count, positionX, positionY, height) {
  var dummy = new THREE.Object3D();
  var positionZ = -100;

  for (var i = 0; i < 9 * height; i++, count++) {
    if (i % height == 0) {
      positionX += 100;
      positionZ = -100;
    }
    else
      positionZ += 47.5;

    dummy.scale.set(15, 15, 15);
    dummy.position.set(positionX, positionY, positionZ);
    dummy.rotation.set(THREE.MathUtils.degToRad(180), 0, THREE.MathUtils.degToRad(90));
    dummy.updateMatrix();
    objMesh.instancedBed.setMatrixAt(count, dummy.matrix);
  }
}

function populateBeds() {
  var objLoader = new GLTFLoader();

  objLoader.load('../../../images/3D/Lightweight/bed.glb', function(gltf) {
    const loadedBed = gltf.scene;
    const bedGeometry2 = loadedBed.children[0].children[1].geometry;
    const bedMaterial2 = loadedBed.children[0].children[1].material;

    const count = 45;
    objMesh.instancedBed = new THREE.InstancedMesh(bedGeometry2, bedMaterial2, count);
    populateRowBed(0, -500, -600, 3);
    populateRowBed(27, -500, -400, 2);
    core.scene.add(objMesh.instancedBed);
  });
}


export function populateAssets() {

  switch (gameCustom.map) {
    case 0:
      populateReferee();
      populateSlide();
      break;
    case 1:
      populateReferee();
      populateDoll();
      break;
    case 2:
      populateBeds();
      break;
    default:
      break;
  }
}
