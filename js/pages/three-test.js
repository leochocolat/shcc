var scene;
var camera;
var renderer;
var width;
var height;
var rotationSpeed;
//SOUND ENVIRONNEMENT
var audioLoader;
var listener;
var analyser;
var frequencyData;
var oscillator;

// CLICK ACTIVATION SON
// var startButton = window;
// startButton.addEventListener( 'click', function() {
//   init();
//   animate();
// });

function init() {

  width = window.innerWidth;
  height = window.innerHeight;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,0,.846);
  camera.lookAt(0,0,0);

  scene.add(camera);

  // controls = new THREE.OrbitControls(camera, renderer.domElement);

  var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
  fillLight.position.set(100, 0, 100);
  var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();
  var light = new THREE.AmbientLight( 0x8F8F8F ); // soft white light

  scene.add(fillLight);
  scene.add(backLight);
  scene.add(light);

  //SOUND ENVIRONNEMENT
  audioLoader = new THREE.AudioLoader();
  listener = new THREE.AudioListener();
	camera.add(listener);

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

      object.position.set(0,0,0);
      object.position.y = -0.2;
      object.rotation.y = .5;
      object.children[0].material.color = new THREE.Color(0xFF5AFF);
      object.children[1].material.color = new THREE.Color(0xFFBD72);
      object.children[0].material.emissive = new THREE.Color(0x3CEB73);
      object.children[0].material.emissiveIntensity = 0;

      scene.add(object);

      for(var j = 0; j <= 50; j++) {

        instance = object.clone();

        // Setting position
        instance.rotation.x = 1.5;
        instance.position.x = 0;
        instance.position.y = 0;
        instance.position.z = (- j * 1.5) - 1.5 ;
        instance.rotation.y = Math.random() * 2;

        // Setting opacity
        instance.children[0].material.transparent = true;
        instance.children[1].material.transparent = true;
        instance.children[0].material.opacity = 0;
        instance.children[1].material.opacity = 0;

        instance.traverse( function ( object ) { object.visible = false; } );

        scene.add(instance);
      }

      scene.add(instance);

      // TEST ADD SOUND
      function addSound() {
        var sound1 = new THREE.PositionalAudio( listener );
        audioLoader.load( 'sounds/dynamite.ogg', function ( buffer ) {
          sound1.setBuffer( buffer );
          sound1.setRefDistance( 1 );
          sound1.play();
        });

        analyser = new THREE.AudioAnalyser( sound1, 32 );
        frequencyData = new Uint8Array(analyser.analyser.frequencyBinCount);

        var frequencyData = analyser.getAverageFrequency() / 100;

        object.add(sound1);
      }
      // addSound();

      // PropertiesTabs
      var instances = [];
      var instancesColor = [];
      var instancesColor1 = [];

      for(var j = 4; j < scene.children.length; j++) {
        instancesColor.push(scene.children[j].children[0].material);
        instancesColor1.push(scene.children[j].children[1].material);
        scene.children[j].traverse( function ( object ) {
          instances.push(object);
        });
      }

      // INTRO
      function animation() {

        //FIRST ELEMENT APPEAR

        let intro = new TimelineMax();
        intro.add([
          TweenMax.to(instancesColor[0], 1, {transparent: false}),
          TweenMax.to(instancesColor1[0], 1, {transparent: false})
        ]).add([
          TweenMax.to(camera.position, 1.5, {z: 2, ease: Power3.easeOut}),
          TweenMax.to(object.rotation, .5, {x: .5, ease: Power3.easeOut}),
          TweenMax.fromTo(object.rotation, 1.5, {z:0}, {z: 6.3, ease: Power3.easeInOut}),
          TweenMax.to(object.position, .3, {y: -.1, ease: Power3.easeOut}),
        ]);

        // STORY
        let i = 0;
        let eltLength = $(".elt-story").length;
        let story = function() {
          if(i < eltLength - 1) {
            i++
            setTimeout(function() {
              $(".elt-story")[i-1].classList.add("off");
              $(".elt-story")[i-1].classList.remove("on");
              $(".elt-story")[i].classList.add("on");
              story();
            }, 2000);
          } else {
            setTimeout(function() {
              donutLook();
              TweenMax.to(".elt-story", 1.5, {autoAlpha: 0, ease: Power3.easeInOut})
            }, 2000);
            // good timing 2000
          }
        }
        setTimeout(function() {
          $(".elt-story")[0].classList.add("on");
          story();
        }, 2300);

      }

      function donutLook() {
        var eventAvailable = 1;
        document.addEventListener('mousewheel', function (e) {
          if(eventAvailable === 1) {
            donutShow();
            lock();
          }
          function lock() {
            eventAvailable = 0;
          }
        });
      }

      function donutShow() {

        //STEP 1
        speed();
        function speed() {
          rotationSpeed += 0.00001;
          requestAnimationFrame(speed);
        }

        //STEP 2
        let show = new TimelineMax();

        show.add([
          TweenMax.to(object.rotation, 2, {x: 0, z: 0, ease: Power2.easeOut}),
          TweenMax.to(object.position, 2, {x: 0, z: 0, y: 0, ease: Power2.easeOut}),
        ])
        .add([
          TweenMax.to(object.rotation, 2, {x: 1.5, ease: Power2.easeOut}),
        ])
        .add([
          TweenMax.to(camera.position, 20, {z: -100, ease: Power3.easeOut}),
          TweenMax.to(".elt-mysterious-thing", 1, {autoAlpha: 1, ease:Power0.easeInOut, delay: 6}),
        ])

        //STEP 3
        setTimeout(function(){
          //DISPLAY ALL 3D MESHES
          TweenMax.staggerTo(instances, .1, {visible: true}, .005);
        }, 3500);

      }

      // FIN STORY

      setTimeout(function(){
        TweenMax.to(".loading", .5, {autoAlpha: 0, ease: Power0.easeOut});
        animation();
        rotationSpeed = .012;
        function rotate() {
          object.rotation.y += rotationSpeed;
          requestAnimationFrame(rotate);
        }
        requestAnimationFrame(rotate);
      }, 1000);

    });

  });

}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // controls.update();
};

init();
animate();


// STORY
