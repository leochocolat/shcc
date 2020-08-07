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
  camera.position.set(0,0,1.5);
  camera.lookAt(0,0,0);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enabled = false;
  controls.enableDamping = true;
  controls.zoomSpeed = .2;
  controls.panSpeed = .2;

  camera.position.x = 0.0000771636378029721;
  camera.position.y = 77.07585887458013
  camera.position.z = 0.0000012244296085471262;

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
  scene.add( light );

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

      var b = 0;

      for(var i = 0; i <= 50; i++) {

        instance = object.clone();
        // instance.children[0].material.opacity = 0;
        // instance.children[1].material.opacity = 0;
        // instance.children[0].material.transparent = true;
        // instance.children[1].material.transparent = true;
        // instance.children[0].material.color = new THREE.Color("rgb(255, " + i + ", 255)");
        instance.position.x = 0;
        instance.position.y = i * 1.5;
        instance.position.z = 0;
        instance.rotation.y = Math.random() * 2;
        scene.add(instance);

      }

      var instancesPos = [];
      var instancesColor = [];
      var instancesColor1 = [];


      for(var i = 4; i < scene.children.length; i++) {
        instancesPos.push(scene.children[i].position);
        instancesColor.push(scene.children[i].children[0].material);
        instancesColor1.push(scene.children[i].children[1].material);
      }

      // console.log(instances);

      setTimeout(function(){

        TweenMax.to(camera.position, 20, {y: .1, ease: Power0.easeNone});

        // TweenMax.staggerTo(instancesColor, 1, {opacity: 1}, -.5);
        // TweenMax.staggerTo(instancesColor1, 1, {opacity: 1}, -.5);

        //MOVING DONUTS LINE

        // window.addEventListener("mousemove", function(e) {
        //
        //   mouseX = (e.clientX - width/2) * 0.002 ;
        //   mouseY = (e.clientY - height/2) * 0.002;
        //
        //   let waww = new TimelineMax();
        //   waww.add([
        //     TweenMax.staggerTo(instancesPos, .2, {x: mouseY, z: -mouseX}, .05),
        //   ])
        // });


      }, 1000);



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
