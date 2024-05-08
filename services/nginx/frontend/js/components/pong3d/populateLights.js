export function populatePointLight(color, posX, posY, posZ, intensity, distance) {

  var pointLight = new THREE.PointLight(color);

  pointLight.position.x = posX;
  pointLight.position.y = posY;
  pointLight.position.z = posZ;
  pointLight.intensity = intensity;
  pointLight.distance = distance;

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
