var scene;
var camera;
var renderer;
var width;
var height;
var object;
var rotationSpeed;
let controller = new ScrollMagic.Controller();
var instances = [];

function init() {

  width = window.innerWidth;
  height = window.innerHeight;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  // renderer.setClearColor(0xff0000);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  console.log(renderer.domElement);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,0,-4);
  camera.lookAt(0,0,0);

  scene.add(camera);

  var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
  fillLight.position.set(100, 0, 100);
  var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();
  var light = new THREE.AmbientLight( 0x8F8F8F ); // soft white light

  scene.add(fillLight);
  scene.add(backLight);
  scene.add(light);

  myLoader();

  window.addEventListener('resize', function() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
  // controls = new THREE.OrbitControls(camera, renderer.domElement);

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
      object.position.x = 1.5;
      object.position.y = -.8;
      object.rotation.x = -.7;
      object.children[0].material.color = new THREE.Color(0xFF5AFF);
      object.children[1].material.color = new THREE.Color(0xFFBD72);
      let newColor = new THREE.Color(0x0000ff);

      //transparence
      object.children[0].material.transparent = true;
      object.children[1].material.transparent = true;
      object.children[0].material.opacity = 0;
      object.children[1].material.opacity = 0;

      scene.add(object);

      for(var j = 0; j < 3; j++) {

        instance = object.clone();

        // Setting position
        instance.rotation.x = 1.2;
        instance.position.x = -1;
        instance.position.y = -j*4 - 4 ;
        instance.rotation.x = Math.random() * 2;

        scene.add(instance);
        instances.push(instance);
      }

      instances[1].position.x = 1.8;

      // When OBJ is loaded
      let appearObj = new TimelineMax();
      appearObj.add([
        TweenMax.to(".appear-custom", 1, {autoAlpha: 1, ease: Power1.easeInOut, delay: .5}),
        TweenMax.to(object.children[0].material, 1, {opacity: 1, ease: Power1.easeOut, delay: .5}),
        TweenMax.to(object.children[1].material, 1, {opacity: 1, ease: Power1.easeOut, delay: .5}),
      ]);

      //SCROLL ANIM
      let donut = new TimelineMax();

      donut.add([
        TweenMax.to(object.rotation, .5, {x: 1, z: 1}),
        TweenMax.to(object.position, .5, {y: 4}),
        TweenMax.to(instances[0].position, .5, {y: 3}),
        TweenMax.to(instances[0].rotation, .5, {x: -.5, z: -2}),
        TweenMax.to(instances[1].position, .5, {y: 1}),
        TweenMax.to(instances[1].rotation, .5, {x: -6, z: 5}),
        TweenMax.to(instances[2].position, .5, {y: -1}),
        TweenMax.to(instances[2].rotation, .5, {x: -2, z: 5}),
      ]);

      new ScrollMagic.Scene({
          triggerElement: ".hello",
          duration: "700%",
          triggerHook: 0,
      })
      .setTween(donut)
      .setPin(renderer.domElement)
      .addTo(controller);

      let bg = new TimelineMax();

      bg.add([
        TweenMax.to(object.children[0].material.color, 1, {r: 13/255, g: 255/255, b: 148/255}),
        TweenMax.to(".content p span", 1, {borderColor: "rgba(13, 255, 148, 1)"})
      ]).add([
        TweenMax.to(object.children[0].material.color, 1, {r: 255/255, g: 0/255, b: 68/255}),
        TweenMax.to(".content p span", 1, {borderColor: "rgba(255, 0, 68, 1)"})
      ]).add([
        TweenMax.to(object.children[0].material.color, 1, {r: 241/255, g: 226/255, b: 25/255}),
        TweenMax.to(".content p span", 1, {borderColor: "rgba(241, 226, 25, 1)"})
      ]).add([
        TweenMax.to(object.children[0].material.color, 1, {r: 17/255, g: 19/255, b: 232/255}),
        TweenMax.to(".content p span", 1, {borderColor: "rgba(17, 19, 232, 1)"})
      ]);

      new ScrollMagic.Scene({
          triggerElement: ".hello",
          duration: "700%",
          triggerHook: 0,
      })
      .setTween(bg)
      .addTo(controller);

      ////////////

      setTimeout(function(){
        TweenMax.to(".loading", .5, {autoAlpha: 0, ease: Power0.easeOut});
        TweenMax.to(".loading", .1, {display: "none", ease: Power0.easeOut, delay: .5});
      }, 1000);

      animate();
      function animate() {
        object.rotation.y += .005;

        for(i=0; i < instances.length; i++) {
          instances[i].rotation.y += .004;
        }

        instance.rotation.y -= .006;
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

    });

  });

}

init();

// ScrollMagic














//
