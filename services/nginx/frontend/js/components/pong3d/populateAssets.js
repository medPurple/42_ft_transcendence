import { objMesh, core, gameCustom, gameState } from './config.js'

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
      objMesh.firstAsset.rotateY(THREE.Math.degToRad(135));
    }
    else {
      objMesh.firstAsset.position.x = 200;
      objMesh.firstAsset.rotateY(THREE.Math.degToRad(225));
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
      objMesh.secondAsset.rotateY(THREE.Math.degToRad(135));
    }
    else {
      objMesh.secondAsset.position.x = 400;
      objMesh.secondAsset.rotateY(THREE.Math.degToRad(250));

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
      objMesh.firstAsset.rotateY(THREE.Math.degToRad(340));
    }
    else {
      objMesh.firstAsset.position.x = 350;
      objMesh.firstAsset.rotateY(THREE.Math.degToRad(30));

    }
    core.scene.add(objMesh.firstAsset);
  })
}

// function populateBeds() {
//
//   //THREE.Cache.enabled = true;
//
//   console.log("Je vais faire pop un plumard")
//   var objLoader = new THREE.GLTFLoader();
//
//   objLoader.load('../../../images/3D/Original/bed_squid_game_multiple_slots.glb', function(gltf) {
//     objMesh.beds[0] = gltf.scene;
//     objMesh.beds[0].scale.set(20, 20, 20);
//     objMesh.beds[0].position.y = -650;
//     objMesh.beds[0].position.z = -130;
//     objMesh.beds[0].rotateX(Math.PI / 2);
//     if (core.player_id == 2) {
//       objMesh.beds[0].position.x = -500;
//       objMesh.beds[0].rotateY(THREE.Math.degToRad(180));
//     }
//     else {
//       objMesh.beds[0].position.x = 500;
//
//     }
//     core.scene.add(objMesh.beds[0]);
//   })
//   for (var i = 1; i <= 10; i++) {
//     objMesh.beds[i] = objMesh.beds[0].clone();
//     objMesh.beds[i].position.x = objMesh.beds[0].position.x;
//     if (i % 3 == 0) {
//       objMesh.beds[i].position.y = objMesh.beds[i - 1].position.y + 125;
//     }
//     else
//       objMesh.beds[i].position.y = objMesh.beds[i - 1].position.y;
//     objMesh.beds[i].position.z = objMesh.beds[i - 1].position.z + 125;
//     core.scene.add(objMesh.beds[i]);
//   }
// }

// function populateBeds() {
//
//   THREE.Cache.enabled = true;
//
//   console.log("Je vais faire pop un plumard")
//   var objLoader = new THREE.GLTFLoader();
//
//   for (var i = 0; i < 10; i++) {
//
//     objLoader.load('../../../images/3D/Original/bed_squid_game_multiple_slots.glb', function(gltf) {
//       objMesh.beds.push(gltf.scene);
//     })
//   }
//   objMesh.beds[0].scale.set(20, 20, 20);
//   objMesh.beds[0].position.y = -650;
//   objMesh.beds[0].position.z = -130;
//   objMesh.beds[0].rotateX(Math.PI / 2);
//   if (core.player_id == 2) {
//     objMesh.beds[0].position.x = -500;
//     objMesh.beds[0].rotateY(THREE.Math.degToRad(180));
//   }
//   else {
//     objMesh.beds[0].position.x = 500;
//   }
//   core.scene.add(objMesh.beds[0]);
//   for (var i = 1; i < 10; i++) {
//     objMesh.beds[i].scale.set(20, 20, 20);
//     objMesh.beds[i].position.x = objMesh.beds[0].position.x;
//     if (i % 3 == 0) {
//       objMesh.beds[i].position.y = objMesh.beds[i - 1].position.y + 125;
//     }
//     else
//       objMesh.beds[i].position.y = objMesh.beds[i - 1].position.y;
//     objMesh.beds[i].position.z = objMesh.beds[i - 1].position.z + 125;
//     core.scene.add(objMesh.beds[i]);
//   }
// }


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
    //populateBeds();
  }
}
