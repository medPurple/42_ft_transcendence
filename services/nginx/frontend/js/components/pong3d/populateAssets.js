import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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

  var objLoader = new GLTFLoader();

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

  var objLoader = new GLTFLoader();

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

function populateRowBed(count, positionX, positionY, height) {

  var dummy = new THREE.Object3D();
  var positionZ = -130;
  for (var i = 0; i < 9 * height; i++, count++) {
    if (i % height == 0) {
      positionX += 100;
      positionZ = -130;
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
    //
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
	populateReferee();

	switch (gameCustom.map) {
		case 0:
			populateSlide();
			break;
		case 1:
			populateDoll();
			populateTree();
			break;
		default:
			populateBeds();
			break;
	}
}
