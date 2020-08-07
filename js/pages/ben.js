var scene;
var camera;
var renderer;
var width;
var height;
var rotationSpeed;

function init() {

  width = window.innerWidth;
  height = window.innerHeight;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,0,.5);
  camera.lookAt(0,0,0);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enabled = true;

  scene.add(camera);

  // renderer.setClearColor(0x333F47);

  var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
  fillLight.position.set(100, 0, 100);
  var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();

  // scene.add(keyLight);
  scene.add(fillLight);
  scene.add(backLight);

  var light = new THREE.AmbientLight( 0x8F8F8F ); // soft white light
  scene.add(light);

  myLoader();

  window.addEventListener('resize', function() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

}


function myLoader() {

  var mtlloader = new THREE.MTLLoader();
  mtlloader.setPath("models/");
  mtlloader.load('donut.mtl', function(materials) {
    materials.preload();
    var loader = new THREE.OBJLoader();
    loader.setPath("models/");

    loader.load('donut.obj', function(object) {

      loader.setMaterials(materials);

      object.children[0].material.color = new THREE.Color(0xFF5AFF);
      object.children[1].material.color = new THREE.Color(0xFFBD72);

      scene.add(object);

    });



  });

}

function animate() {
  var random;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

init();
animate();


// STORY
