var scene;
var camera;
var renderer;
var width;
var height;
var object;
var rotationSpeed;
var newObjs = [];
//SOUND ENVIRONNEMENT
var listener, audio, mediaElement, analyser, uniforms, frequence;
var fftSize = 128;


// CLICK ACTIVATION SON
$(".btn-play").click(function() {
  let loader = new TimelineMax();
  loader.add([
    TweenMax.staggerTo(".intro div", .8, {autoAlpha: 0, ease: Power0.easeInOut}, -.4),
    TweenMax.to(".btn-sound", .5, {autoAlpha: 1, ease: Power0.easeInOut})
  ]).add(
    TweenMax.to(".loader", .5, {autoAlpha: 1, ease: Power1.easeInOut})
  ).add([
    TweenMax.to(".intro", .1, {display: "none"}),
  ])

  init();
  // animate();
});

$(".btn-sound").click(function() {
  if(mediaElement.volume != 0) {
    this.innerHTML = "sound off";
    mediaElement.volume = 0;
    mediaElement1.volume = 0;
  } else {
    this.innerHTML = "sound on";
    mediaElement.volume = 1;
    mediaElement1.volume = 1;
  }
});

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
  listener = new THREE.AudioListener();
	audio = new THREE.Audio(listener);
  audio1 = new THREE.Audio(listener);
  audio2 = new THREE.Audio(listener);
  audio3 = new THREE.Audio(listener);
	mediaElement = new Audio('sounds/voice1-modif.mp3');
  mediaElement1 = new Audio('sounds/run-intro.mp3');
  mediaElement2 = new Audio('sounds/intro.mp3');
  mediaElement3 = new Audio('sounds/run-boom.mp3');
  mediaElement1.volume = .05;
  mediaElement3.volume = .8;
  mediaElement1.loop = true;
  // console.log(mediaElement1.playbackRate);
	audio.setMediaElementSource(mediaElement);
  audio1.setMediaElementSource(mediaElement1);
  audio2.setMediaElementSource(mediaElement2);
  audio3.setMediaElementSource(mediaElement3);
	analyser = new THREE.AudioAnalyser( audio, fftSize );
  analyser3 = new THREE.AudioAnalyser( audio3, fftSize );

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
      object.children[0].material.emissive = new THREE.Color(0xFF5AFF);
      object.children[0].material.emissiveIntensity = 1;

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

      // PropertiesTabs
      var instances = [];
      var instancesColor = [];
      var instancesColor1 = [];

      for(var j = 4; j < scene.children.length; j++) {
        instancesColor.push(scene.children[j].children[0].material);
        instancesColor1.push(scene.children[j].children[1].material);
        scene.children[j].traverse( function (object) {
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
        ]).add(
          TweenMax.to(mediaElement, .1, {play: true}),
        );

        // STORY
        let i = 0;
        let eltLength = $(".elt-story").length;
        let timings = [
          3043,
          2430,
          3590,
          2474,
          4379,
          2306,
          1500,
          1745,
          3350
        ]; //Sets sentences timings
        function story() {
          if(i < eltLength - 1) {
            i++
            setTimeout(function() {
              $(".elt-story")[i-1].classList.add("off");
              $(".elt-story")[i-1].classList.remove("on");
              $(".elt-story")[i].classList.add("on");
              story();
            }, timings[i-1]);
          } else {
            setTimeout(function() {
              donutLook();
              TweenMax.to(".elt-story", 1, {autoAlpha: 0, ease: Power3.easeInOut});
              TweenMax.to(".scroll-progression", 1.5, {autoAlpha: 1, ease: Power3.easeInOut, delay: 1});
            }, 1500);
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
          rotationDonut();
          if(eventAvailable === 1) {
            if(e.deltaY <= -50 || e.deltaY >= 50) {
              let scrollProgress = new TimelineMax();
              scrollProgress.add(
                TweenMax.to(".scroll-progression .before", .8, {width: "100%", ease: Power1.easeOut})
              ).add(
                TweenMax.to(".scroll-progression", .5, {autoAlpha: 0, ease: Power1.easeOut})
              ).add(
                TweenMax.to(mediaElement, .3, {volume: 0, ease: Power1.easeIn})
              );
              donutShow();
              lock();
            } else {
              TweenMax.to(".scroll-progression .before", 1, {width: "0" + e.deltaY + "%", ease: Power1.easeOut});
            }
          }
          function lock() {
            eventAvailable = 0;
          }
        });
      }

      function rotationDonut() {
        //STEP 1
        speed();
        function speed() {
          rotationSpeed += 0.00003;
          requestAnimationFrame(speed);
        }
      }

      function donutShow() {


        //STEP 2
        mediaElement3.play();
        let show = new TimelineMax();

        show.add([
          TweenMax.to(mediaElement1, .5, {volume: 0}),
          TweenMax.to(object.rotation, 2, {x: 0, z: 0, ease: Power2.easeOut}),
          TweenMax.to(object.position, 2, {x: 0, z: 0, y: 0, ease: Power2.easeOut}),
        ])
        .add([
          TweenMax.to(object.rotation, 2, {x: 1.5, ease: Power2.easeOut}),
        ])
        .add([
          TweenMax.to(camera.position, 5, {z: -100, ease: Power0.easeNone}),
          TweenMax.to(mediaElement3, 1, {volume: 0, delay: 5}),
        ]);

        //STEP 3
        setTimeout(function(){
          //DISPLAY ALL 3D MESHES
          TweenMax.staggerTo(instances, .1, {visible: true}, .005);
        }, 3500);

        setTimeout(function() {
            clear();
        }, 10000);

      }

      // FIN STORY

      function clear() {
        location.href = "hello.html";
      }

      setTimeout(function(){
        TweenMax.to(".loading", .5, {autoAlpha: 0, ease: Power0.easeOut});
        TweenMax.to(".loading", .1, {display: "none", ease: Power0.easeOut, delay: .5});
        animation();
        mediaElement1.play();
        mediaElement2.play();
        rotationSpeed = .012;
        function rotate() {
          object.rotation.y += rotationSpeed;
          requestAnimationFrame(rotate);
        }
        requestAnimationFrame(rotate);
      }, 1000);

      animate();
      function animate() {
        var frequence = parseInt(analyser.getAverageFrequency());
        var frequence3 = parseInt(analyser3.getAverageFrequency());
        object.children[0].material.emissiveIntensity = (frequence3/70);
        // object.children[0].material.emissiveIntensity = (frequence3/60);
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        // controls.update();
      };

    });

  });

}
