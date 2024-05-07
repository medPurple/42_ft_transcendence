import { objMesh, core } from './config.js'

export function populateReferee() {

  var objLoader = new THREE.GLTFLoader();

  objLoader.load('../../../images/3D/untitled.glb', function(gltf) {
    objMesh.referee = gltf.scene;
    objMesh.referee.scale.set(50, 50, 50);
    objMesh.referee.rotateX(Math.PI / 2);
    objMesh.referee.position.y = 220;
    core.scene.add(objMesh.referee);
  })
}

export function populateAssets() {

  // switch to popAssets according to map 
  populateReferee();
}
