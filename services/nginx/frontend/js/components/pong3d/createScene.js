import { core, playMesh, decMesh, gameState, gameCustom, lights, constants } from "./config.js"
import { populatePointLight, populateSpotLight } from "./populateLights.js";
import { populateBall, populateSelfPaddle, populateOtherPaddle, populatePlane, populateTable, populateFloor, populateWall } from "./populateMeshes.js"
import { onKeyUpRemote, onKeyDownRemote, onKeyUpLocal, onKeyDownLocal } from './inputEvents.js'
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

  if (gameState.game_mode == "remote") {
    window.addEventListener('keydown', onKeyDownRemote, false);
    window.addEventListener('keyup', onKeyUpRemote, false);
  }
  else {
    window.addEventListener('keydown', onKeyDownLocal, false);
    window.addEventListener('keyup', onKeyUpLocal, false);
  }

  //Scene setup

  core.scene = new THREE.Scene();

  //Camera setup

  core.camera = new THREE.PerspectiveCamera(constants.VIEW_ANGLE, constants.ASPECT, constants.NEAR, constants.FAR)
  core.camera.position.z = 230;

  //Ball setup

  playMesh.ball = populateBall(0xD43001, 0, 0);

  // AmbientLight setup

  //  lights.ambientLight = new THREE.AmbientLight(0xF8d898, 0.5);

  // PointLight setup

  //lights.pointLight = populatePointLight(0xffffff, 0, 0, 500, 1.5, 10000);
  lights.pointLight = populatePointLight(0xffffff, 1000, 0, 500, 0.75, 10000);
  lights.pointLight2 = populatePointLight(0xffffff, -1000, 0, 500, 0.75, 10000);
  lights.pointLight3 = populatePointLight(0xffffff, 0, 0, 500, 0.75, 10000);
  //lights.pointLight4 = populatePointLight(0xffffff, 0, -200, 500, 0.5, 10000);
  //lights.pointLight2 = populatePointLight(0xffffff, 1000, 0, 1000, 1, 8000);

  //Spotlight setup

  lights.spotLight = populateSpotLight(0xffffff, 0, 0, 700, 0.7);

  //Plane setup

  decMesh.plane = populatePlane(0x4BD121, 0, 0);

  //Paddle Setup

  playMesh.paddle1 = populateSelfPaddle(0x1B32C0, -constants.fieldWidth / 2 + constants.paddleWidth, 0);
  playMesh.paddle2 = populateOtherPaddle(0xFF4045, constants.fieldWidth / 2 + constants.paddleWidth, 0);

  //Table Setup

  decMesh.table = populateTable(0x111111, 0, 0, -7);

  //Ground setup

  decMesh.ground = populateFloor();

  // Wall setup

  decMesh.wall = populateWall(core.player_id);
  if (gameState.game_mode == "local")
    decMesh.wall2 = populateWall(2);


  // Props setup

  //if (gameState.game_mode == "remote")
  populateAssets();

  // Powerups setup

  populatePowerUps();

  //Add all to the scene

  //core.scene.add(lights.ambientLight);
  core.scene.add(lights.pointLight);
  core.scene.add(lights.pointLight2);
  core.scene.add(lights.pointLight3);
  //core.scene.add(lights.pointLight4);
  //core.scene.add(lights.spotLight);
  core.scene.add(playMesh.paddle1);
  core.scene.add(playMesh.paddle2);
  core.scene.add(playMesh.ball);
  core.scene.add(decMesh.table);
  core.scene.add(decMesh.plane);
  core.scene.add(decMesh.wall);
  if (gameState.game_mode == "local")
    core.scene.add(decMesh.wall2);
  core.scene.add(decMesh.ground);
  core.scene.add(core.camera);

  core.renderer.shadowMapEnabled = true;

}
