import { gameState, pUpMesh, pUpState, playMesh, constants, core } from './config.js'

function popPowerUpOnScene() {

	switch (gameState.powerup_type) {
		case 0:
			pUpState.powerUp = pUpMesh.circle;
			break;
		case 1:
			pUpState.powerUp = pUpMesh.triangle;
			break;
		case 2:
			pUpState.powerUp = pUpMesh.star;
			break;
		default:
			pUpState.powerUp = pUpMesh.square;
	}

  pUpState.powerUp.position.x = gameState.powerup_positionX;
  pUpState.powerUp.position.y = gameState.powerup_positionY;
  pUpState.powerUp.castShadow = true;
  pUpState.powerUp.receiveShadow = true;
  core.scene.add(pUpState.powerUp);
  pUpState.pUpIsDisplayed = true;
}

function applyHeightPaddleChange() {

  if (gameState.paddle1_powerup == 1) {
    playMesh.paddle2.scale.set(1, 20 / constants.paddleHeight, 1);
  }
  else if (gameState.paddle1_powerup == 2) {
    playMesh.paddle1.scale.set(1, 40 / constants.paddleHeight, 1);
  }
  else if (gameState.paddle2_powerup == 1) {
    playMesh.paddle1.scale.set(1, 20 / constants.paddleHeight, 1);
  }
  else if (gameState.paddle2_powerup == 2) {
    playMesh.paddle2.scale.set(1, 40 / constants.paddleHeight, 1);
  }
}

function resetPaddles() {
  playMesh.paddle1.scale.set(1, 30 / playMesh.paddle1.geometry.parameters.height, 1);
  playMesh.paddle2.scale.set(1, 30 / playMesh.paddle2.geometry.parameters.height, 1);
}

function depopPowerUpFromScene() {

  core.scene.remove(pUpState.powerUp);
  pUpState.pUpIsDisplayed = false;
}

////HANDLEPOWERUPS IN FRONT Here
export function handlePowerUp() {
  if (gameState.powerup_status == 1 && !pUpState.pUpIsDisplayed) {
    popPowerUpOnScene();
  }
  if (gameState.powerup_status == 2 && !pUpState.pUpEffectIsApplied) {
    depopPowerUpFromScene();
    if (gameState.powerup_type == 1 || gameState.powerup_type == 2) {
      applyHeightPaddleChange();
    }
    pUpState.pUpEffectIsApplied = true;
  }
  if (gameState.powerup_status == 0 && pUpState.pUpIsDisplayed) {
    depopPowerUpFromScene();
  }
  if (gameState.powerup_status == 0 && pUpState.pUpEffectIsApplied) {
    resetPaddles();
    pUpState.pUpEffectIsApplied = false;
  }
}
