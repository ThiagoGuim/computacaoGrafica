import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        onWindowResize,
        createGroundPlaneWired,
        initDefaultBasicLight} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
//var camera = initCamera(new THREE.Vector3(0, 20, 15)); // Init camera in this position
var clock = new THREE.Clock();
initDefaultBasicLight(scene);

var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
//var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );

// create the ground plane
var plane = createGroundPlaneWired(500,500);
// add the plane to the scene
scene.add(plane);

// create a cube
//var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
//var cubeMaterial = new THREE.MeshNormalMaterial();
//var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//cube.add(axesHelper);
//// position the cube
//cube.position.set(0.0, 2.0, 0.0);
//// add the cube to the scene
//scene.add(cube);

var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
camera.lookAt(0,0,0);
camera.position.set(0,10.0,0);
camera.up.set(0,1,0);
scene.add(camera);

// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.add(axesHelper);
// position the cube
cube.position.set(0.0, -8.0, -30.0);
// add the cube to the scene
camera.add(cube);

/* Função de controle de aceleração */

var airplaneSpeed = 0;

function accelerationControl()
{
    keyboard.update();

    if(airplaneSpeed < 50)
    {
        if(keyboard.pressed("Q"))
        {
            airplaneSpeed += 0.1;
        }
    }

    if(airplaneSpeed > 50)
    {
        airplaneSpeed = 50;
    }

    if(airplaneSpeed > 0)
    {
        if(keyboard.pressed("A"))
        {
            airplaneSpeed -= 0.1;
        }
    }

    if(airplaneSpeed < 0)
    {
        airplaneSpeed = 0;
    }
}

/* ---------------------------------- */

/* Funções de movimentação */

function acceleratePlane()
{
    camera.translateZ(-airplaneSpeed * clock.getDelta());

    var slopeSpeed = 1000 * clock.getDelta();

    keyboard.update();

    if(airplaneSpeed > 0)
    {
        if(keyboard.pressed("down"))
        {
            camera.translateY(slopeSpeed*10);
            if(cube.rotation.x < 0.5)
            {
                cube.rotateX(slopeSpeed);
            }
        }
        else
        {
            if(cube.rotation.x > 0)
            {
                cube.rotateX(-slopeSpeed);
            }   
        }

        if(keyboard.pressed("up"))
        {
            camera.translateY(-slopeSpeed*10);
            if(cube.rotation.x > -0.5)
            {
                cube.rotateX(-slopeSpeed);
            }
        }
        else
        {
            if(cube.rotation.x < 0)
            {
                cube.rotateX(slopeSpeed);
            }   
        }

        if(keyboard.pressed("right"))
        {
            camera.rotateY(-slopeSpeed);
            if(cube.rotation.z > -0.5)
            {
                cube.rotateZ(-slopeSpeed);
            }
        }
        else
        {
            if(cube.rotation.z < 0)
            {
                cube.rotateZ(slopeSpeed);
            }   
        }

        if(keyboard.pressed("left"))
        {
            camera.rotateY(slopeSpeed);
            if(cube.rotation.z < 0.5)
            {
                cube.rotateZ(slopeSpeed);
            }
        }
        else
        {
            if(cube.rotation.z > 0)
            {
                cube.rotateZ(-slopeSpeed);
            }   
        }
    }
}

function controlZSlope()
{
    var slopeSpeed = 1000 * clock.getDelta();

    keyboard.update();

    if(airplaneSpeed > 0)
    {
        if(keyboard.pressed("down"))
        {
            cube.translateY(slopeSpeed);
        }

        if(keyboard.pressed("up"))
        {
            cube.translateY(-slopeSpeed);
        }
    }
}

function controlXSlope()
{
    var slopeSpeed = 1000 * clock.getDelta();

    keyboard.update();

    if(airplaneSpeed > 0)
    {
        if(keyboard.pressed("right"))
        {
            cube.rotateX(slopeSpeed);
        }

        if(keyboard.pressed("left"))
        {
            cube.rotateX(-slopeSpeed);
        }
    }   
}

/* ----------------------------------- */

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  stats.update(); // Update FPS
  acceleratePlane();
  accelerationControl();
  //controlZSlope();
  //controlXSlope();
  //trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}