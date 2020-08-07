var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);

// SWEET LIGHTS
var keyLight = new THREE.DirectionalLight(new THREE.Color(0x00ffff), 1.0);
keyLight.position.set(-100, 0, 100);
var fillLight = new THREE.DirectionalLight(new THREE.Color(0xff00ff), 0.75);
fillLight.position.set(100, 0, 100);
var backLight = new THREE.DirectionalLight(0xffff00, 0.50);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

clock = new THREE.Clock();

var light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add(light);

var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({
  color: 0x00ff00
});

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(0x19F4F3),
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

var mouse = {
  x: undefined,
  y: undefined
}

window.addEventListener('mousemove', function(e){
  mouse.x = e.x - innerWidth/2;
  mouse.y = e.y - innerHeight/2;
});

controls = new THREE.OrbitControls(camera, renderer.domElement);

var loader = new THREE.GLTFLoader().setPath('models/');
// var loader = new THREE.ObjectLoader().setPath('models/');
loader.load('nike2.gltf', function(gltf) {

  var mesh = gltf.scene;
  var background = scene.background;

  gltf.scene.traverse( function ( node ) {
		if ( node.isMesh ) {
      meshObj = node;
      meshObj.material.color = new THREE.Color(0xffffff);
    }
	});

  meshObj.material.morphTargets = true;

	scene.add(mesh);

  console.log(gltf);

  mesh.position.z = -7.5;
  mesh.position.y = -10;

  gltf.scene.traverse( function ( child ) {
		if ( child.isMesh ) {
			child.material.envMap = background;
		}
	} );

  mixer = new THREE.AnimationMixer(mesh);
  mixer.clipAction(gltf.animations[0]).setDuration(1).play();

  function render() {
    mesh.rotation.y += .005;
    var delta = clock.getDelta();
    var prevTime = Date.now();
    if(mixer) {
			var time = Date.now();
			mixer.update( ( time - prevTime ) * 0.001 );
			prevTime = time;
		}
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();



});



camera.position.z = 10;
camera.position.x = 0;
camera.position.y = 0;
camera.lookAt(0,0,0);

var update = function() {



};

// DRAW SCENE
var render = function() {
  renderer.render(scene, camera);
};

// GAME LOOP RENDER UPDATE REPEAT
var GameLoop = function() {
  requestAnimationFrame(GameLoop);
  update();
  render();
};

GameLoop();
