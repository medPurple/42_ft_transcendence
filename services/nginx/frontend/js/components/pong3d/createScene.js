import { core, gameCustom, playMesh, pUpMesh, decMesh, objMesh, lights, constants } from "./config.js"
import { populatePointLight, populateSpotLight } from "./populateLights.js";
import { populateBall, populatePaddle, populatePlane, populateTable, populateFloor, populateWall } from "./populateMeshes.js"
import { populateAssets } from './populateAssets.js'
import { populatePowerUps } from "./populatePowerUps.js";

export function createScene() {

  //Render setup

  console.log("Scene is created");
  core.renderer = new THREE.WebGLRenderer();

  core.renderer.setSize(constants.WIDTH, constants.HEIGHT);

  var c = document.getElementById("pong-renderer");

  if (!c) {
    console.error("Game div not found !");
    return;
  }
  c.appendChild(core.renderer.domElement);

  //Scene setup

  core.scene = new THREE.Scene();

  //Camera setup

  core.camera = new THREE.PerspectiveCamera(constants.VIEW_ANGLE, constants.ASPECT, constants.NEAR, constants.FAR)
  core.camera.position.z = 230;

  //Ball setup

  playMesh.ball = populateBall(0xD43001, 0, 0);

  // PointLight setup

  lights.pointLight = populatePointLight(0xF8D898, -1000, 0, 1000, 1.5, 10000);
  lights.pointLight2 = populatePointLight(0xF8D898, 1000, 0, 1000, 1.5, 10000);

  //Spotlight setup

  lights.spotLight = populateSpotLight(0xF8D898, 0, 0, 460, 1.5)

  //Plane setup

  decMesh.plane = populatePlane(0x4BD121, 0, 0);

  //Paddle Setup

  playMesh.paddle1 = populatePaddle(0x1B32C0, -constants.fieldWidth / 2 + constants.paddleWidth, 0);
  playMesh.paddle2 = populatePaddle(0xFF4045, constants.fieldWidth / 2 + constants.paddleWidth, 0);

  //Table Setup

  decMesh.table = populateTable(0x111111, 0, 0, -7);

  //Ground setup

  decMesh.ground = populateFloor();

  // Wall setup

  decMesh.wall = populateWall(core.player_id);

  // Props setup

  populateAssets();

  // Powerups setup

  populatePowerUps();

  //Add all to the scene

  core.scene.add(lights.pointLight);
  core.scene.add(lights.pointLight2);
  core.scene.add(lights.spotLight);
  core.scene.add(playMesh.paddle1);
  core.scene.add(playMesh.paddle2);
  core.scene.add(playMesh.ball);
  core.scene.add(decMesh.table);
  core.scene.add(decMesh.plane);
  core.scene.add(decMesh.wall);
  core.scene.add(decMesh.ground);
  core.scene.add(core.camera);

  //renderer.shadowMapEnabled = true;

}
