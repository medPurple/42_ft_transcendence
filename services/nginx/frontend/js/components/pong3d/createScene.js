import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gamer from "./gamerInfo.js"
import { core, playMesh, decMesh, gameCustom, gameState, lights, constants } from "./config.js"
import { populateAmbientLight, populatePointLight, populateSpotLight } from "./populateLights.js";
import { populateBall, populateSelfPaddle, populateOtherPaddle, populatePlane, populateTable, populateSkybox, populateLine, populateHorizontalLine } from "./populateMeshes.js"
import { onKeyUpRemote, onKeyDownRemote, onKeyUpLocal, onKeyDownLocal } from './inputEvents.js'
import { populateAssets } from './populateAssets.js'
import { populatePowerUps } from "./populatePowerUps.js";
import { cameraLocal } from './cameraLogic.js'

async function setupSettings() {
  try {
    const data = await gamer.getGamerSettings();
    gameCustom.ownPaddle = data.paddle;
    gameCustom.otherPaddle = 4;
    gameCustom.ball = data.ball;
    gameCustom.map = data.scene;
    gameCustom.table = data.table;
    gameCustom.powerup = data.powerups;
    gameCustom.score_limit = data.score;
  } catch (error) {
    alert('You should be logged to play');
    window.location.href = '/pongService';
  }
}

export async function createScene() {
  await setupSettings();

  core.renderer = new THREE.WebGLRenderer();
  core.renderer.setSize(window.innerWidth, window.innerHeight);
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
    console.log("je mets les event du local");
    window.addEventListener('keydown', onKeyDownLocal, false);
    window.addEventListener('keyup', onKeyUpLocal, false);
  }

  //Camera setup
  core.camera = new THREE.PerspectiveCamera(constants.VIEW_ANGLE, window.innerWidth / window.innerHeight, constants.NEAR, constants.FAR)

  if (gameState.game_mode == "local" || gameState.game_mode == "tournament") {
    cameraLocal();
    core.controls = new OrbitControls(core.camera, c);
    core.controls.minDistance = 200;
    core.controls.maxDistance = 1250;
  }

  //Scene setup
  core.scene = new THREE.Scene();

  //Ball setup
  playMesh.ball = populateBall(0, 0);

  // PointLight setup
  lights.pointLight = populatePointLight(0xffffff, 1000, 0, 500, 0.75, 10000);
  lights.pointLight2 = populatePointLight(0xffffff, -1000, 0, 500, 0.75, 10000);
  lights.pointLight3 = populatePointLight(0xffffff, 0, 0, 500, 0.75, 10000);

  // AmbientLight setup
  lights.ambientLight = populateAmbientLight(0x404040, 2);

  //Spotlight setup
  lights.spotLight = populateSpotLight(0xffffff, 0, 0, 700, 0.7);

  //Skybox setup
  let skybox = populateSkybox();

  //Paddle Setup
  if (core.player_id == 1) {
    playMesh.paddle1 = populateSelfPaddle(-constants.fieldWidth / 2 + constants.paddleWidth, 0);
    playMesh.paddle2 = populateOtherPaddle(constants.fieldWidth / 2 + constants.paddleWidth, 0);
  }
  else {
    playMesh.paddle2 = populateSelfPaddle(-constants.fieldWidth / 2 + constants.paddleWidth, 0);
    playMesh.paddle1 = populateOtherPaddle(constants.fieldWidth / 2 + constants.paddleWidth, 0);
  }

  decMesh.table = populateTable(0, 0, -7);
  decMesh.plane = populatePlane(0, 0);
  decMesh.lineA = populateLine(-190, 0);
  decMesh.lineB = populateLine(190, 0);
  decMesh.lineUp = populateHorizontalLine(0, 95);
  decMesh.lineDown = populateHorizontalLine(0, -95);

  // Props setup
  populateAssets();

  // Powerups setup
  populatePowerUps();

  //Add all to the scene
  core.scene.add(skybox);
  core.scene.add(lights.pointLight);
  core.scene.add(lights.pointLight2);
  core.scene.add(lights.pointLight3);
  core.scene.add(lights.ambientLight);
  core.scene.add(playMesh.paddle1);
  core.scene.add(playMesh.paddle2);
  core.scene.add(playMesh.ball);
  core.scene.add(decMesh.table);
  core.scene.add(decMesh.plane);
  core.scene.add(decMesh.lineA);
  core.scene.add(decMesh.lineB);
  core.scene.add(decMesh.lineUp);
  core.scene.add(decMesh.lineDown);

  core.scene.add(core.camera);
  core.renderer.shadowMapEnabled = true;

}
