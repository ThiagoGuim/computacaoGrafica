import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {initRenderer,
        initCamera,
        initDefaultSpotlight,
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";



var angle = 2;
var speed = 0.0;
var animationOn = true;

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 40)");

initDefaultSpotlight(scene, new THREE.Vector3(0, 10000, 0)); // Use default light

// var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.lookAt(0, 0, 0);
// camera.position.set(0, 0, 0);
// camera.up.set( 0, 1, 0 );
var camera = initCamera(new THREE.Vector3(60, 60, 60)); // Init camera in this position


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlaneWired(1000, 1000, 40, 40, "rgb(255,228,181)"); // width, height, resolutionW, resolutionH
scene.add(groundPlane);  
var axesHelper = new THREE.AxesHelper( 30 );
scene.add(axesHelper);
// Show text information onscreen(148,0,211)
// showInformation();


// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
var geometry = new THREE.CylinderGeometry( 3, 6, 2, 8, 1 );
var base = new THREE.Mesh( geometry, material );
scene.add(base);
base.position.set(0.0, 1.0, 0);

var material = new THREE.MeshBasicMaterial( {color: 0x808080} );
var geometry = new THREE.CylinderGeometry( 0.8, 2.0, 28, 30, 1 );
var tower = new THREE.Mesh( geometry, material );
scene.add(tower);
tower.position.set(0.0, 14.0, 0);

var material = new THREE.MeshBasicMaterial( {color: 0x800080} );
var geometry = new THREE.BoxGeometry( 2, 2, 8 );
var motorBox = new THREE.Mesh( geometry, material );
scene.add(motorBox);
motorBox.position.set(0.0, 28.0, 1);

var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var geometry = new THREE.SphereGeometry( 1, 32, 32 );
var motor = new THREE.Mesh( geometry, material );
motor.scale.set(0.5, 0.5, 3);
motor.position.set(0.0, 28.0, 5);
scene.add(motor);

var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var geometry = new THREE.SphereGeometry( 3, 32, 32 );
var proppeler1 = new THREE.Mesh( geometry, material );
proppeler1.scale.set(0.1, 5, 0.05);
proppeler1.position.set(0.0, 14.2, 0.7);
motor.add(proppeler1);

var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var geometry = new THREE.SphereGeometry( 3, 32, 32 );
var proppeler2 = new THREE.Mesh( geometry, material );
proppeler2.rotateZ(degreesToRadians(120));
proppeler2.scale.set(0.1, 5, 0.05);
proppeler2.position.set(-12.2, -7, 0.7);
motor.add(proppeler2);

var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var geometry = new THREE.SphereGeometry( 3, 32, 32 );
var proppeler3 = new THREE.Mesh( geometry, material );
proppeler3.rotateZ(degreesToRadians(240));
proppeler3.scale.set(0.1, 5, 0.05);
proppeler3.position.set(12.2, -7, 0.7);
motor.add(proppeler3);

buildInterface();
render();


function rotateMotor(){

    if(animationOn){
        
        angle = speed;

        if(degreesToRadians(angle) < 300){

            motor.rotateZ( degreesToRadians(angle) );
            console.log(degreesToRadians(angle));

        }


    }

}

function buildInterface()
{
  var controls = new function ()
  {
    this.onChangeAnimation = function(){
      animationOn = !animationOn;
    };

    this.speed = 0;
    this.changeSpeed = function(){
      speed = this.speed;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
  gui.add(controls, 'speed', 0, 40)
    .onChange(function(e) { controls.changeSpeed() })
    .name("Change Speed");
}

function render()
{
  stats.update(); // Update FPS 
  trackballControls.update();
  rotateMotor();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
