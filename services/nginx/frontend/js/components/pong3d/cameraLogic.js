import { playMesh, core } from './config.js'

export function cameraPlayer1() {
	core.camera.position.x = playMesh.paddle1.position.x - 80;
	core.camera.position.y += (playMesh.paddle1.position.y - core.camera.position.y) * 0.05;
	core.camera.position.z = playMesh.paddle1.position.z + 100;
	core.camera.rotation.z = -90 * Math.PI / 180;
	core.camera.rotation.y = -60 * Math.PI / 180;
}

export function cameraPlayer2() {
	core.camera.position.x = playMesh.paddle2.position.x + 80;
	core.camera.position.y += (playMesh.paddle2.position.y - core.camera.position.y) * 0.05;
	core.camera.position.z = playMesh.paddle2.position.z + 100;
	core.camera.rotation.z = 90 * Math.PI / 180;
	core.camera.rotation.y = 60 * Math.PI / 180;
}

export function cameraLocal() {
	core.camera.position.z = 230;
	core.camera.position.y = -230;
}

export function cameraMalus() {
	core.camera.position.x = 0;
	core.camera.position.y = 0;
	core.camera.position.z = 230;
	core.camera.rotation.z = 0;
	core.camera.rotation.y = 0;
}
