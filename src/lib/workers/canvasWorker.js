import * as THREE from 'three';

let renderer, roadSegment1, roadSegment2, tunnelTexture;
let camera, scene, roadGroup = new THREE.Group(), cubes =[];
let roadSegments =[];

self.onmessage = function(event) {
  
    switch(event.data.method){
        case 'canvas':
          
          initCanvas(event.data)
          addCube(event.data);


        break;
        case 'add_cube':
          addCube(event.data);
        break;        
        case 'resize':
          updateRendererSize(event.data);
        break;        
    }
 
};

const initCanvas=(d)=>{
    const canvas = d.canvas;
    const innerWidth = d.width;
    const innerHeight = d.height;
    const images = d.images;
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
    createTunnel();
    // Position camera
// Position camera
camera.position.y = 1.8; // Height similar to a car
camera.position.z = 0; // Start at the beginning of the road

    addRoadSegments(images).then(()=>{
// Define the target position for the camera
var targetPosition = new THREE.Vector3();
var roadWidth = 20; // Width of the road

// Define the speed of the camera movement
var cameraSpeed = 0.01;
var rotationSpeed =  0.01;
var movementSpeed = 0.5;
var tunnelSpeed = movementSpeed/100;
const animate = function () {
  cubes.forEach((cube)=>{
    // cube.rotation.x += 0.01;
    if(cube.userData.direction === 1){
      cube.rotation.y -=rotationSpeed;
    } else {
      cube.rotation.y +=rotationSpeed;
    }

    //  cube.rotation.z += 0.01;            
  })
  
 // Move road segments
 roadSegment1.position.z += movementSpeed;
 roadSegment2.position.z += movementSpeed;
 tunnelTexture.offset.y -= tunnelSpeed;
 tunnelTexture.offset.x -= (tunnelSpeed/2);

  // Loop road segments
 if (roadSegment1.position.z > camera.position.z + 500) {
   roadSegment1.position.z = roadSegment2.position.z - 500;
 }
 if (roadSegment2.position.z > camera.position.z + 500) {
   roadSegment2.position.z = roadSegment1.position.z - 500;
 }
 

  // Generate a new target position if the camera is close to the current target
  if (camera.position.distanceTo(targetPosition) < 1) {
    targetPosition.x = (Math.random() - 0.5) * roadWidth;
    targetPosition.y = (Math.random() - 0.5) * roadWidth;
  }

  // Move the camera towards the target position
  camera.position.lerp(targetPosition, cameraSpeed);

  // Update the camera's direction
  camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - 100));

   // Update the time uniform of the shader material
 // material.uniforms.time.value = clock.getElapsedTime();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
        animate();        
    })
    

}

const addCube = () =>{
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  
  scene.add(cube);
  cubes.push(cube);
}

const addRoadSegments = async(images)=> {

  var response = await fetch('/scifi_surface.jpg');
  var blob = await response.blob();
  var bitmap = await createImageBitmap(blob);

  return new Promise((resolve,reject)=>{
   //  createRoadSegments();

    // Create texture
    var texture = new THREE.Texture(bitmap);
    texture.needsUpdate = true;
    // Create road segments and cubes
    roadSegment1 = new THREE.Group();
    roadSegment2 = new THREE.Group();

    var roadGeometry = new THREE.PlaneGeometry(10, 500);
    roadGeometry.rotateX(-Math.PI / 2); // Rotate to lie flat
    var roadMaterial1 = new THREE.MeshBasicMaterial({map:texture});
    for (var i = 0; i < 2; i++) {
        var roadSegment = i === 0 ? roadSegment1 : roadSegment2;
        var roadMaterial = i === 0 ? roadMaterial1 : roadMaterial1;

        var road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.y = -20; // Position road segments

        roadSegment.add(road);

        roadSegment.position.z = i === 0 ? 0 : -500; // Position road segments

        scene.add(roadSegment);
        roadSegments.push(roadSegment);
    }

    addCubesToSegments(images).then((textures) => {
      positionCubes(textures);
      resolve();
    })
    .catch((error) => {
      console.error('There was an error loading the images:', error);
    });  

    })
}

const addCubesToSegments = (images) =>{
  let promises = images.map((image) => {
    return loadImage(image)
  });

  return Promise.all(promises)

}
const positionCubes = (textures)=>{
  let segment = 0;
  var cubeSize = 8; // Size of the cube
  var minDistance = 10; // Minimum distance between cubes  
  var gridSize = cubeSize + minDistance; // Size of each grid cell
  var roadWidth = 50; // Width of the road
  var roadLength = 500; // Length of the road
  var grid = new Array(Math.ceil(roadWidth / gridSize) * Math.ceil(roadLength / gridSize)).fill(false);
  var maxAttempts = 100; // Maximum number of attempts to find an unoccupied cell
  
  textures.forEach((texture, idx)=>{
    let roadSegment = roadSegments[segment];
    segment = (segment===0)?1:0;

    let cube = createCube(texture, cubeSize);
    var cellIndex;
    var attempts = 0;
    // Try to find an unoccupied cell
    do {
        cellIndex = Math.floor(Math.random() * grid.length);
        attempts++;
    } while (grid[cellIndex] && attempts < maxAttempts);

    if (!grid[cellIndex]) {
        var cellX = (cellIndex % Math.ceil(roadWidth / gridSize)) * gridSize + gridSize / 2 - roadWidth / 2;
        var cellZ = Math.floor(cellIndex / Math.ceil(roadWidth / gridSize)) * gridSize - roadLength / 2;

        cube.position.x = cellX;
        cube.position.y = (Math.random() - 0.5) * roadWidth; // Random y position for variation
        cube.position.z = cellZ;
        cube.rotation.x = Math.PI;

        grid[cellIndex] = true;
        var randomInt = Math.floor(Math.random() * 2) + 1;

        cube.userData = {direction: randomInt};
        cubes.push(cube);
        roadSegment.add(cube);
      }
  })
}

const createCube = (texture,cubeSize)=>{
  let imgTexture = texture[0];
  let userTexture = texture[1];
   var cubeMaterial = new THREE.MeshBasicMaterial({map:imgTexture});        
   var userMaterial = new THREE.MeshBasicMaterial({map:userTexture});        

        // Calculate scale factor
        let scaleFactor = cubeSize / imgTexture.image.height;

        // Calculate new dimensions
        let newWidth = imgTexture.image.width * scaleFactor;
        let newHeight =cubeSize; // Maximum height is 4
        let newDepth = newWidth; // Assuming depth is the same as width
        var cubeGeometry = new THREE.BoxGeometry(newWidth, newHeight, newDepth);
        
        // Get the array of UVs.
        var uvs = cubeGeometry.attributes.uv.array;

        // Loop through the UVs and flip the x-coordinate.
        for (var i = 0; i < uvs.length; i += 2) {
            uvs[i] = 1 - uvs[i];
        }

        // Tell Three.js to update the UVs on the GPU.
        cubeGeometry.attributes.uv.needsUpdate = true;

        // Create materials for each face of the cube
        var cubeMaterials = [
          cubeMaterial, // Right side
          cubeMaterial, // Left side
          userMaterial, // Top side
          userMaterial, // Bottom side
          cubeMaterial, // Front side
          cubeMaterial  // Back side
        ];
        
        return new THREE.Mesh(cubeGeometry, cubeMaterials);

}

const loadImage = async (image)=>{
  var response = await fetch('/api/image-proxy?url='+image.url);
  var blob = await response.blob();
  let bitmap = await createImageBitmap(blob);
  var imgTexture = new THREE.Texture(bitmap);
  imgTexture.needsUpdate = true;

  var userResponse = await fetch('/api/image-proxy?url='+image.userProfileImgUrl);
  var userBlob = await userResponse.blob();
  let userBitmap = await createImageBitmap(userBlob);
  var userTexture = new THREE.Texture(userBitmap);
  userTexture.needsUpdate = true;  
  return [imgTexture, userTexture];
}

const createTunnel =async () =>{


  var response = await fetch('/textures/17266.jpg');
  var blob = await response.blob();
  var bitmap = await createImageBitmap(blob);
      tunnelTexture = new THREE.Texture(bitmap);
      tunnelTexture.needsUpdate = true;
      tunnelTexture.wrapS = tunnelTexture.wrapT = THREE.RepeatWrapping;
  var material = new THREE.MeshBasicMaterial({map:tunnelTexture, side: THREE.BackSide });        

var geometry = new THREE.CylinderGeometry(40, 40, 500, 32, 1, true);
var mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = Math.PI/2;
mesh.position.z = -250;
scene.add(mesh);

}


const updateRendererSize = (d)=> {
  const canvas = renderer.domElement;
  const width = d.width;
  const height = d.height;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    camera.aspect =width /height;
    camera.updateProjectionMatrix();    
    renderer.setSize(width, height, false);
  }
  return needResize;
}
