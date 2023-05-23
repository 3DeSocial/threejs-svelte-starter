import * as THREE from 'three';

let renderer,road1, road2, roadSegment1, roadSegment2;
let camera, scene, roadGroup = new THREE.Group(), cubes =[];
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
  console.log('initCanvas');
    const canvas = d.canvas;
    const innerWidth = d.width;
    const innerHeight = d.height;
    const images = d.images;
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
    // Position camera
// Position camera
camera.position.y = 1.8; // Height similar to a car
camera.position.z = 0; // Start at the beginning of the road

    addRoadSegments(images).then(()=>{
      const animate = function () {
          cubes.forEach((cube)=>{
         //   cube.rotation.x += 0.01;
        //    cube.rotation.y += 0.01;
          })
          
          // Move road segments
          roadSegment1.position.z += 0.5;
          roadSegment2.position.z += 0.5;
          
          // Loop road segments
          if (roadSegment1.position.z > camera.position.z + 500) {
            roadSegment1.position.z = roadSegment2.position.z - 500;
          }
          if (roadSegment2.position.z > camera.position.z + 500) {
            roadSegment2.position.z = roadSegment1.position.z - 500;
          }
          
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };

        console.log('animate');

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


    // Create texture
    var texture = new THREE.Texture(bitmap);
    texture.needsUpdate = true;
    // Create road segments and cubes
    roadSegment1 = new THREE.Group();
    roadSegment2 = new THREE.Group();

    var roadGeometry = new THREE.PlaneGeometry(10, 500);
    roadGeometry.rotateX(-Math.PI / 2); // Rotate to lie flat
    var roadMaterial1 = new THREE.MeshBasicMaterial({map:texture});
    var roadMaterial2 = new THREE.MeshBasicMaterial({color:0x00cc00});
    var cubeGeometry = new THREE.BoxGeometry(texture.image.width, texture.image.height, texture.image.width);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let roadSegments =[]
    for (var i = 0; i < 2; i++) {
        var roadSegment = i === 0 ? roadSegment1 : roadSegment2;
        var roadMaterial = i === 0 ? roadMaterial1 : roadMaterial1;

        var road = new THREE.Mesh(roadGeometry, roadMaterial);
        roadSegment.add(road);

        roadSegment.position.z = i === 0 ? 0 : -500; // Position road segments
        scene.add(roadSegment);
        roadSegments.push(roadSegment);
    }

      let promises = images.map((image) => {
        return loadImage(image)
      });

      Promise.all(promises)
      .then((textures) => {
        console.log('All images loaded and cubes added');
        let segment = 0;
        textures.forEach((texture)=>{
          let roadSegment = roadSegments[segment];
          segment = (segment===0)?1:0;
          var cubeMaterial = new THREE.MeshBasicMaterial({map:texture});        

        // Calculate scale factor
        let scaleFactor = 3 / texture.image.height;

        // Calculate new dimensions
        let newWidth = texture.image.width * scaleFactor;
        let newHeight =3; // Maximum height is 4
        let newDepth = newWidth; // Assuming depth is the same as width
        var cubeGeometry = new THREE.BoxGeometry(newWidth, newHeight, newDepth);
        // Create materials for each face of the cube
        var cubeMaterials = [
          cubeMaterial, // Right side
          cubeMaterial, // Left side
          new THREE.MeshBasicMaterial(), // Top side
          new THREE.MeshBasicMaterial(), // Bottom side
          cubeMaterial, // Front side
          cubeMaterial  // Back side
        ];
        
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
        cube.rotation.x = Math.PI;
          cube.position.z = -Math.random() * 500; // Position at random intervals along the road
          cube.position.x = (Math.random() - 0.5) * 20; // Random x position within the road width
          cube.position.y = (Math.random() - 0.5) * 20; // Random y position for variation
          roadSegment.add(cube);
          cubes.push(cube);
        })
        resolve();
      })
      .catch((error) => {
        console.error('There was an error loading the images:', error);
        reject();
      });

    })
}

const loadImage = async (image)=>{
  var response = await fetch('/api/image-proxy?url='+image.url);
  var blob = await response.blob();
  let bitmap = await createImageBitmap(blob);
  var texture = new THREE.Texture(bitmap);
  texture.needsUpdate = true;
         // Flip the texture vertically
         texture.flipY = true;
  return texture;
}

const updateRendererSize = (d)=> {
  const canvas = renderer.domElement;
  const width = d.width;
  const height = d.height;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    console.log('resizing');
    camera.aspect =width /height;
    camera.updateProjectionMatrix();    
    renderer.setSize(width, height, false);
  }
  return needResize;
}
