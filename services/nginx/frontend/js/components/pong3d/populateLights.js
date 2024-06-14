import * as THREE from 'three';

export function populatePointLight(color, posX, posY, posZ, intensity, distance) {
	var pointLight = new THREE.PointLight(color);

	pointLight.position.x = posX;
	pointLight.position.y = posY;
	pointLight.position.z = posZ;
	pointLight.intensity = intensity;
	pointLight.distance = distance;
	pointLight.castShadow = true;

	return pointLight;
}

export function populateSpotLight(color, posX, posY, posZ, intensity) {
	var spotLight = new THREE.SpotLight(color);

	spotLight.position.x = posX;
	spotLight.position.y = posY;
	spotLight.position.z = posZ;
	spotLight.intensity = intensity;
	spotLight.castShadow = true;

	return spotLight;
}

export function populateAmbientLight(color, intensity) {
	var ambientLight = new THREE.AmbientLight(color);

	ambientLight.intensity = intensity;

	return ambientLight;
}
