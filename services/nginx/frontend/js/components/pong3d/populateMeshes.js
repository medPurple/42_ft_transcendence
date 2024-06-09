import * as THREE from 'three';
import { constants, gameCustom, palette } from "./config.js"

function setPhysicalMaterial(color, metalness, roughness, iridescence, iridescenceIOR, transmission) {

	var physMaterial = new THREE.MeshPhysicalMaterial({
		color: color, roughness: roughness,
		metalness: metalness, iridescence: iridescence,
		iridescenceIOR: iridescenceIOR
	})
	physMaterial.transmission = transmission;
	return physMaterial;
}

function setStandardMaterial(color, metalness, roughness) {

	var stanMaterial = new THREE.MeshStandardMaterial({
		color: color, roughness: roughness,
		metalness: metalness
	})
	return stanMaterial;
}

function setLambertMaterial(color) {

	var lambMaterial = new THREE.MeshLambertMaterial({
		color: color
	})
	return lambMaterial;
}

export function populateSelfPaddle(posX, posY) {

	var paddleMaterial;

	// console.log('PADDLE SELF in populate my paddle: ',gameCustom.ownPaddle);/////////

	switch (gameCustom.ownPaddle) {
		case 0:
			paddleMaterial = setPhysicalMaterial(palette.rose01, 1, 0.5, 0, 0, 0);
			break;
		case 1:
			paddleMaterial = setPhysicalMaterial(palette.rose02, 1, 0.5, 0, 0, 0);
			break;
		case 2:
			paddleMaterial = setPhysicalMaterial(palette.blue03, 1, 0.2, 0, 0, 0);
			break;
		case 3:
			paddleMaterial = setPhysicalMaterial(palette.blue04, 1, 0.5, 1, 1.7, 0);
			break;
		default:
			paddleMaterial = setStandardMaterial(palette.black, 1, 0.7);
			break;
	}

	var paddle = new THREE.Mesh(new THREE.BoxGeometry(constants.paddleWidth, constants.paddleHeight, constants.paddleDepth, constants.paddleQuality, constants.paddleQuality, constants.paddleQuality), paddleMaterial);

	paddle.position.x = posX;
	paddle.position.y = posY;
	paddle.position.z = constants.paddleDepth;
	paddle.receiveShadow = true;
	paddle.castShadow = true;

	return paddle;
}

export function populateOtherPaddle(posX, posY) {

	var paddleMaterial;

	if (gameCustom.otherPaddle == gameCustom.ownPaddle) {
		if (gameCustom.ownPaddle == 4)
			gameCustom.otherPaddle = 1;
		else
			gameCustom.otherPaddle = 4;
	}

	// console.log('PADDLE ENEMY in populate other paddle: ', gameCustom.otherPaddle);/////////

	switch (gameCustom.otherPaddle) {
		case 0:
			paddleMaterial = setPhysicalMaterial(palette.rose01, 1, 0.5, 0, 0, 0);
			break;
		case 1:
			paddleMaterial = setPhysicalMaterial(palette.rose02, 1, 0.5, 0, 0, 0);
			break;
		case 2:
			paddleMaterial = setPhysicalMaterial(palette.blue03, 1, 0.2, 0, 0, 0);
			break;
		case 3:
			paddleMaterial = setPhysicalMaterial(palette.blue04, 1, 0.5, 1, 1.7, 0);
			break;
		default:
			paddleMaterial = setStandardMaterial(palette.black, 1, 0.7);
			break;
	}

	var paddle = new THREE.Mesh(new THREE.BoxGeometry(constants.paddleWidth, constants.paddleHeight, constants.paddleDepth, constants.paddleQuality, constants.paddleQuality, constants.paddleQuality), paddleMaterial);

	paddle.position.x = posX;
	paddle.position.y = posY;
	paddle.position.z = constants.paddleDepth;
	paddle.receiveShadow = true;
	paddle.castShadow = true;

	return paddle;
}

export function populateBall(posX, posY) {

	var radius = 5, segments = 6, rings = 6;
	var ballMaterial;

	// console.log('BALL in populate ball: ',gameCustom.ball);///////////////

	switch (gameCustom.ball) {
		case 0:
			ballMaterial = setLambertMaterial(palette.yellow);
			break;
		case 1:
			ballMaterial = setLambertMaterial(palette.white);
			break;
		default:
			ballMaterial = setLambertMaterial(palette.blue01);
			break;
	}

	var ball = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), ballMaterial);

	ball.position.x = posX;
	ball.position.y = posY;
	ball.position.z = radius;
	ball.receiveShadow = true;
	ball.castShadow = true;

	return ball;
}

export function populatePlane(posX, posY) {

	var planeMaterial = setPhysicalMaterial(palette.white, 1, 0.7, 0, 0, 0);
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(constants.planeWidth, constants.planeHeight * 0.95, constants.planeQuality, constants.planeQuality), planeMaterial);

	plane.position.x = posX;
	plane.position.y = posY;
	plane.receiveShadow = true;

	return plane;
}

export function populateTable(posX, posY, posZ) {

	switch (gameCustom.map) {
		case 0:
			var texturePath = "../../../images/Textures/Metal.jpeg";
			break;
		case 1:
			var texturePath = "../../../images/Textures/Concrete.jpeg";
			break;
		default:
			var texturePath = "../../../images/Textures/Wood.jpeg";
			break;
	}

	var tableTexture = new THREE.TextureLoader().load(texturePath);
	var tableMaterial = new THREE.MeshBasicMaterial({ map: tableTexture });

	var table = new THREE.Mesh(new THREE.BoxGeometry(constants.tableWidth, constants.tableHeight, constants.tableQuality, constants.tableQuality, 1), tableMaterial);
	table.position.x = posX;
	table.position.y = posY;
	table.position.z = posZ;
	table.receiveShadow = true;
	table.castShadow = true;

	return table;
}

export function populateSkybox() {

	let materialArray = [];
	
	let name_file;
	switch (gameCustom.map) {
		case 0:
			name_file = "../../../images/Skybox/01/playground";
			break;
		case 1:
			name_file = "../../../images/Skybox/02/cornfield";
			break;
		case 2:
			name_file = "../../../images/Skybox/03/dormitory";
			break;
		case 3:
			name_file = "../../../images/Skybox/04/ow";
			break;
	}

	let texture_ft = new THREE.TextureLoader().load(name_file + '_ft.jpg');
	let texture_bk = new THREE.TextureLoader().load(name_file + '_bk.jpg');
	let texture_up = new THREE.TextureLoader().load(name_file + '_up.jpg');
	let texture_dn = new THREE.TextureLoader().load(name_file + '_dn.jpg');
	let texture_rt = new THREE.TextureLoader().load(name_file + '_rt.jpg');
	let texture_lf = new THREE.TextureLoader().load(name_file + '_lf.jpg');

	materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

	for (let i = 0; i < 6; i++)
		materialArray[i].side = THREE.BackSide;

	let skyboxGeometry;
	switch (gameCustom.map) {
		case 0:
			skyboxGeometry = new THREE.BoxGeometry(2048, 1807, 2048);
			break;
		case 1:
			skyboxGeometry = new THREE.BoxGeometry(2048, 1024, 2048);
			break;
		case 2:
			skyboxGeometry = new THREE.BoxGeometry(2048, 1024, 2048);
			break;
		case 3:
			skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
			break;
	}
	
	let skybox = new THREE.Mesh(skyboxGeometry, materialArray);
	skybox.rotation.x = Math.PI / 2;
	skybox.position.z += 400;

	return skybox;
}

	
// export function populateFloor() {

// 	const groundTexLoader = new THREE.TextureLoader();

// 	var path;

// 	// console.log('SCENE in populate floor: ',gameCustom.map);///////////

// 	switch (gameCustom.map) {
// 		case 0:
// 			path = '../../../images/Floor/F-Playground.jpg';
// 			break;
// 		case 1:
// 			path = '../../../images/Floor/F-Cornfield.jpg';
// 			break;
// 		default:
// 			path = '../../../images/Floor/F-Concrete.jpg';
// 			break;
// 	}

// 	var groundMaterial = new THREE.MeshLambertMaterial({
// 		map: groundTexLoader.load(path,
// 		function(texture) {
// 			texture.wrapS = THREE.ClampToEdgeWrapping;
// 			texture.wrapT = THREE.ClampToEdgeWrapping;
// 			texture.minFilter = THREE.LinearFilter;
// 			texture.magFilter = THREE.LinearFilter;
// 			// const repeatX = 2200 / 512;
// 			// const repeatY = 2200 / 512;
// 			// texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
// 			// texture.repeat.set(repeatX, repeatY);
// 			// texture.minFilter = THREE.LinearFilter;
// 			// texture.magFilter = THREE.LinearFilter;
// 		})
// 	});

// 	var ground = new THREE.Mesh(new THREE.BoxGeometry(constants.groundWidth, constants.groundHeight, constants.groundQuality, 1, 1, 1), groundMaterial);
// 	ground.position.z = -132;
// 	ground.receiveShadow = true;

// 	return ground;
// }

// export function populateWall(player_id) {

// 	const wallTexLoader = new THREE.TextureLoader();

// 	var path;

// 	// console.log('SCENE in populate wall :', gameCustom.map);///////////

// 	switch (gameCustom.map) {
// 		case 0:
// 			path = '../../../images/Walls/final/W-Playground.jpg';
// 			break;
// 		case 1:
// 			path = '../../../images/Walls/final/W-Cornfield.jpg';
// 			break;
// 		default:
// 			path = '../../../images/Walls/final/W-Tiled.png';
// 			break;
// 	}

// 	var wallMaterial = new THREE.MeshLambertMaterial({
// 		map: wallTexLoader.load(path, function(texture) {
// 			texture.wrapS = THREE.ClampToEdgeWrapping;
// 			texture.wrapT = THREE.ClampToEdgeWrapping;
// 			texture.minFilter = THREE.LinearFilter;
// 			texture.magFilter = THREE.LinearFilter;
// 		})
// 	});

// 	var wall = new THREE.Mesh(new THREE.BoxGeometry(constants.wallWidth, constants.wallHeight, constants.wallQuality, 1, 1, 1), wallMaterial);

// 	if (player_id == 1) {
// 		wall.position.x = 500;
// 	}
// 	else {
// 		wall.position.x = -500;
// 	}
// 	if (gameCustom.map == 2) {
// 		wall.position.z = 100;
// 	}
// 	else
// 		wall.position.z = 380;
// 	wall.rotateY(Math.PI / 2);
// 	wall.rotateZ(Math.PI / 2);
// 	wall.receiveShadow = true;

// 	return wall;
// }
