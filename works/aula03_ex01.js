import * as THREE from  '../build/three.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer,
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils

scene.add(new THREE.HemisphereLight());    

// Main camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0, 1, 0);
  camera.up.set( 0, 1, 0);

// Enable mouse rotation, pan, zoom etc.
// var trackballControls = new TrackballControls(camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlaneWired(10, 10, 40, 40); // width, height, resolutionW, resolutionH
    // groundPlane.rotateX(degreesToRadians(-90));
    // groundPlane.rotateY(degreesToRadians(-90));
scene.add(groundPlane);  

var cameraHolder = new THREE.Object3D();
    cameraHolder.add(camera);
scene.add(cameraHolder);

// To use the keyboard
var keyboard = new KeyboardState();

render();
function keyboardUpdate() {

    keyboard.update();

    if ( keyboard.pressed("space") ) cameraHolder.translateZ(-0.2);
    if ( keyboard.pressed("Z") ) cameraHolder.translateZ(0.2);

    if ( keyboard.pressed("left") )   cameraHolder.rotateY( degreesToRadians(5) );
    if ( keyboard.pressed("right") )  cameraHolder.rotateY(  degreesToRadians(-5) );
    if ( keyboard.pressed("up") )     cameraHolder.rotateX( degreesToRadians(5) );
    if ( keyboard.pressed("down") )   cameraHolder.rotateX( degreesToRadians(-5) );

    if ( keyboard.pressed(",") )     cameraHolder.rotateZ(  degreesToRadians(5) );
    if ( keyboard.pressed(".") )   cameraHolder.rotateZ(  degreesToRadians(-5) );
  
  }


function render()
{   
    keyboardUpdate();
    requestAnimationFrame(render); // Show events
    // trackballControls.update();
    renderer.render(scene, camera) // Render scene
}