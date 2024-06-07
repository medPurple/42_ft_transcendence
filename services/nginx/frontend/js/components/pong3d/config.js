//Global variables for the project (scene, renderer, camera, lights)

export var gameState = {
	player1Score: 0,
	player2Score: 0,
	score_limit: 7,
	paddle1_positionX: 0,
	paddle1_positionY: 0,
	paddle1_width: 0,
	paddle1_powerup: 0,
	paddle2_positionX: 0,
	paddle2_positionY: 0,
	paddle2_width: 0,
	paddle2_powerup: 0,
	ball_positionX: 0,
	ball_positionY: 0,
	powerup_positionX: 0,
	powerup_positionY: 0,
	powerup_status: 0,
	powerup_type: 0,
	game_mode: 0,
	active: 0
}

export const gameCustom = {
	ownPaddle: 3,
	otherPaddle: 1,
	ball: 1,
	map: 0,
	table: 1,
	powerup: 0,
	score_limit: 1
}


export var core = {
	scene: 3,
	renderer: 0,
	camera: 0,
	gameSocket: 0,
	party: 0,
	player_id: 0
}

export var playMesh = {
	paddle1: 0,
	paddle2: 0,
	ball: 0
}

export var pUpMesh = {
	triangle: 0,
	circle: 0,
	square: 0,
	star: 0
}

export var decMesh = {
	ground: 0,
	plane: 0,
	table: 0,
	wall: 0,
	wall2: 0
}

export var objMesh = {
	referee: 0,
	firstAsset: 0,
	secondAsset: 0,
	beds: [],
	loadedBed: 0,
	instancedBed: 0
}

export var lights = {
	pointLight: 0,
	pointLight2: 0,
	pointLight3: 0,
	//pointLight4: 0,
	spotLight: 0,
	ambientLight: 0
}

export var pUpState = {
	powerUp: 0,
	pUpIsDisplayed: false,
	pUpEffectIsApplied: false
}

export const constants = {
	// WIDTH: 1280, 
	// HEIGHT: 600,
	// ASPECT: 2 / 1,
	VIEW_ANGLE: 75,
	NEAR: 0.1,
	FAR: 10000,
	fieldWidth: 400,
	fieldHeight: 200,
	paddleWidth: 10,
	paddleHeight: 30,
	paddleDepth: 10,
	paddleQuality: 1,
	planeWidth: 400,
	planeHeight: 200,
	planeQuality: 10,
	tableWidth: 400 * 1.05,
	tableHeight: 200 * 1.03,
	tableQuality: 10,
	groundWidth: 1000,
	groundHeight: 2200,
	groundQuality: 3,
	wallHeight: 1024,
	wallWidth: 2048,
	wallQuality: 3
}

export const palette = {
	rose01: 0x620436,
	rose02: 0xb32c6f,
	blue01: 0x62bac6,
	blue02: 0x3d8b97,
	blue03: 0x075f6b,
	blue04: 0x07434e,
	black: 0x0a0f13,
	kaki: 0x4d544c,
	grey: 0x7b8787,
	brown: 0x9f8574,
	white: 0xd2f7fd,
	yellow: 0x9f9407,
	green: 0x4b5413,
	pu_green: 0x226343,
	pu_red: 0xb4352e,
	pu_blue: 0x025fac,
	pu_yellow: 0xe6a700,
}
