import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        degreesToRadians,
        createGroundPlaneWired,
        onWindowResize,
        initDefaultBasicLight} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(5, 5, 7)); // Init camera in this position
var trackballControls = new TrackballControls( camera, renderer.domElement );
initDefaultBasicLight(scene);

// Set angles of rotation
var speed = 0.05;
var speed2 = 0.05;
var move = false; // control if animation is on or of

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(-0.02, 0.0, 0.0); // To avoid conflict with the axeshelper
planeGeometry.rotateX(degreesToRadians(90)); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgb(150, 150, 150)",
    side: THREE.DoubleSide
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// Show world axes
// var axesHelper = new THREE.AxesHelper( 12 );
// scene.add( axesHelper );

// Base sphere
var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(255,0,0)'} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add(sphere);
// Set initial position of the sphere
sphere.translateY(1);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();

var targetX = 0.0;
var targetY = 0.0;
var targetZ = 0.0;

function moveBall()
{   

    if(move){

        if(sphere.position.x < targetX) {
            sphere.position.x += 0.05;
        }

        if(sphere.position.x > targetX) {
            sphere.position.x -= 0.05;
        }
    
        if(sphere.position.z < targetZ){
            sphere.position.z += 0.05;
        }

        if(sphere.position.z > targetZ){
            sphere.position.z -= 0.05;
        }

        if(((Math.abs(sphere.position.x - targetX)) < 0.05)  && ((Math.abs(sphere.position.z - targetZ)) < 0.05))
          move = false; 
        
    }
    
}


function buildInterface()
{
    var controls = new function ()
    {
      this.posX = 0;
      this.posY = 0;
      this.posZ = 0;

      this.moveButton = function(){
        move = !move;
      };

      this.setTarget = function(){
        targetX = this.posX;
        targetY = this.posY;
        targetZ = this.posZ;
      };
    };
  
    // GUI interface
    var gui = new GUI();
    gui.add(controls, 'posX', -12.5, 12.5)
      .onChange(function(e) { controls.setTarget() })
      .name("TargetX");
    gui.add(controls, 'posY', 0, 0)
      .onChange(function(e) { controls.setTarget() })
      .name("TargetY");
    gui.add(controls, 'posZ', -12.5, 12.5)
      .onChange(function(e) { controls.setTarget() })
      .name("TargetZ");

    gui.add(controls, 'moveButton', false).name("Move ball");

}

function render()
{ 

  stats.update(); // Update FPS
  trackballControls.update();
  moveBall();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
