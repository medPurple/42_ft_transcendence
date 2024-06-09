import * as THREE from 'three';
import { gameState, pUpMesh, palette } from './config.js'

function populateCircleShape(color) {
	var radius = 10;
	var numPoints = 20;
	var shape = new THREE.Shape();
	shape.moveTo(radius, 0);
	for (var i = 1; i <= numPoints; i++) {
		var angle = (i / numPoints) * 2 * Math.PI;
		var x = radius * Math.cos(angle);
		var y = radius * Math.sin(angle);
		shape.lineTo(x, y);
	}
	return populateShape(shape, color);
}

function populateTriangleShape(color) {
	var size = 10;
	var shape = new THREE.Shape();
	shape.moveTo(0, size);
	shape.lineTo(size, -size);
	shape.lineTo(-size, -size);
	shape.lineTo(0, size);
	return populateShape(shape, color);
}

function populateStarShape(color) {
	var size = 10;
	var numPoints = 5;
	var shape = new THREE.Shape();
	shape.moveTo(size, 0);
	for (var i = 1; i <= numPoints * 2; i++) {
		var angle = (i / numPoints) * Math.PI;
		var r = (i % 2 === 0) ? size : size / 2;
		var x = r * Math.cos(angle);
		var y = r * Math.sin(angle);
		shape.lineTo(x, y);
	}
	return populateShape(shape, color);
}

function populateSquareShape(color) {
	var size = 10;
	var shape = new THREE.Shape();
	shape.moveTo(-size, size);
	shape.lineTo(size, size);
	shape.lineTo(size, -size);
	shape.lineTo(-size, -size);
	shape.lineTo(-size, size);
	return populateShape(shape, color);
}

function populateShape(shape, color) {
	var geometry = new THREE.ShapeGeometry(shape);
	var material = new THREE.MeshBasicMaterial({ color: color });
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.z = 10;
	return mesh;
}

export function populatePowerUps() {
	pUpMesh.triangle = populateTriangleShape(palette.pu_red);
	pUpMesh.circle = populateCircleShape(palette.pu_green);
	pUpMesh.square = populateSquareShape(palette.pu_blue);
	pUpMesh.star = populateStarShape(palette.pu_yellow);
}
