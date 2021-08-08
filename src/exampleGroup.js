import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        InfoBox,
        initDefaultSpotlight,
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";



var angle = 5;
var speed = 0.05;
var animationOn = true;

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 40)");

var light = initDefaultSpotlight(scene, new THREE.Vector3(0, 10000, 0)); // Use default light


var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(0, 0, 0);
camera.up.set( 0, 1, 0 );

var cameraHolder = createBox();
    cameraHolder.add(camera);
// cameraHolder.position.set(0,0,0);
scene.add(cameraHolder);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlaneWired(1000, 1000, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);  
var axesHelper = new THREE.AxesHelper( 30 );
scene.add(axesHelper);
// Show text information onscreen
// showInformation();



// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

var pos = 0;
var target = new THREE.Vector3(); // create once an reuse it

// Make a pivot
var pivot = new THREE.Object3D();

//Strucuture to store the airplane's parts apart from each other
var parts = {}; 
var plane = createPlane();
// pivot.position.set(0, 20, -40);
// plane.position.set(0, -20, 40);
// pivot.add(plane);
// plane.position.set(0, 20, -40);
// scene.add(plane);
// scene.add(pivot);



render();


// Create Airplane
function createPlane(){

  //-------------------------------------------------------------------
  // Start setting the group
  var plane = new THREE.Group();

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper( 12 );
  
  // Set the parts of the plane

  var tail = createCylinder(0.8, 0.3, 5.0, 20, 20, false, 1);
    tail.rotateX(degreesToRadians(90));
    tail.position.set(0.0, 0.0, -7.5)
  
  var nozzle = createSphere(4, 30, 30, 'black', 0);
    nozzle.scale.set(0.2, 0.2, 2);
    nozzle.position.set(0.0, 0.0, 2.5);
    
  var cockpit = createSphere(2.5, 30, 30, 'rgb(204, 255, 255)', 1);
    cockpit.position.set(0.0, 1.0, 1.0);
    cockpit.scale.set(0.5, 0.5, 1);
  
  var wings = createSphere(12, 30, 30, 'rgb(64, 64, 64)', 0);
    wings.position.set(0.0, -0.5, 2.0);
    wings.scale.set(1, 0.05, 0.2);
  
  var wings2 = createSphere(4, 30, 30, 'rgb(64, 64, 64)', 0);
    wings2.position.set(0.0, 0.0, -8.0);
    wings2.scale.set(1, 0.05, 0.2);
  
  var wings3 = createSphere(2, 30, 30, 'rgb(64, 64, 64)', 0);
    wings3.rotateZ(degreesToRadians(90));
    wings3.rotateY(degreesToRadians(45)); 
    wings3.position.set(0.0, 1.0, -9.0);
    wings3.scale.set(1, 0.05, 0.2);
  
  var proppeler = createBox();
    proppeler.position.set(0.0, 4.0, 3.8);
    proppeler.scale.set(0.2, 1, 0.02);
    nozzle.add(proppeler);
  
  var proppeler2 = createBox();
    proppeler2.rotateZ(degreesToRadians(45));
    proppeler2.position.set(Math.cos(45)*4 + 1, -Math.sin(45)*4 + 0.5, 3.8);
    proppeler2.scale.set(0.2, 1, 0.02);
    nozzle.add(proppeler2);
  
  var proppeler3 = createBox();
    proppeler3.rotateZ(degreesToRadians(135));
    proppeler3.position.set(-Math.cos(45)*4 - 1 , -Math.sin(45)*4 + 0.5, 3.8);
    proppeler3.scale.set(0.2, 1, 0.02); 
    nozzle.add(proppeler3);
  
  var body = createSphere(10, 30, 30, 'grey', 0);
    body.scale.set(0.2, 0.15, 1);
  
  parts = {
    body: body,
    tail: tail,
    cockpit: cockpit,
    nozzle: nozzle,
    wings: wings,
    wings2: wings2,
    wings3: wings3
  }

  // Add objects to the group
  plane.add( axesHelper );
  plane.add(body);
  plane.add(cockpit);
  plane.add(nozzle);
  plane.add(tail);
  plane.add(wings);
  plane.add(wings2);
  plane.add(wings3);


  return plane;

}


function rotateProppeler()
{ 
  // Set angle's animation speed
  if(animationOn)
  { 
    // angle+=speed;
    // pos+=angle;
    // camera.lookAt(0, 0, 0);
    // cameraHolder.rotateY(degreesToRadians(angle));
    // parts['nozzle'].rotateZ(degreesToRadians(angle));
  }

}


function createBox()
{ 
  const geometry = new THREE.BoxGeometry( 5, 8, 1 );
  const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  return cube;

}

function createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, color)
{ 
  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
  var material;
  if(!color)
    material = new THREE.MeshPhongMaterial({color:"rgb(255,0,0)"});
  else
    material = new THREE.MeshPhongMaterial({color:"black"});
  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
  return object;
}

function createSphere(radius, widthSegments, heightSegments, _color, transparent)
{ 

  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
  var material;
  if(transparent){

     material = new THREE.MeshPhongMaterial({
      color: _color,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }else
    material = new THREE.MeshPhongMaterial({color:_color});
  

  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
  return object;
}

function keyboardUpdate() {

  keyboard.update();

  if ( keyboard.pressed("space") ){
    
    // cameraHolder.translateX(-1);
    // pivot.translateZ(1);
    plane.translateZ(1);
  }


  if ( keyboard.pressed("left") ){
    plane.rotateZ( degreesToRadians(-1)); 
    // pivot.rotateY(degreesToRadians(1));  
    // plane.rotateY( degreesToRadians(5)) ;
    // plane.rotateX( degreesToRadians(-5)) ;
  }
  if ( keyboard.pressed("right") ){
    plane.rotateZ( degreesToRadians(1)); 
    // pivot.rotateY( degreesToRadians(-1));
    // plane.rotateZ( degreesToRadians(2)) ;

    // plane.rotateY( degreesToRadians(-5)) ;
    // plane.rotateY( degreesToRadians(-5)) ;
    // plane.rotateX( degreesToRadians(5)) ;
  }   
    
  if ( keyboard.pressed("up") ) {
    // pivot.rotateX( degreesToRadians(-5) );
    plane.rotateX( degreesToRadians(-1) );

  }  
  if ( keyboard.pressed("down") ){
    // pivot.rotateX( degreesToRadians(5) );
    plane.rotateX( degreesToRadians(1) );
  }  

  


    // if ( keyboard.pressed("right") )  cameraHolder.rotateZ(  degreesToRadians(5) );
    // if ( keyboard.pressed("up") )     cameraHolder.rotateX( degreesToRadians(5) );
    // if ( keyboard.pressed("down") )   cameraHolder.rotateX( degreesToRadians(-5) );

    // if ( keyboard.pressed(",") )     cameraHolder.rotateZ(  degreesToRadians(5) );
    // if ( keyboard.pressed(".") )   cameraHolder.rotateZ(  degreesToRadians(-5) );
  // keyboard.update();

  // if ( keyboard.down("A") ) axesHelper.visible = !axesHelper.visible;

  // if ( keyboard.pressed("up") )    group.translateZ(  1 );
  // if ( keyboard.pressed("down") )  group.translateZ( -1 );

  // var angle = degreesToRadians(10);
  // if ( keyboard.pressed("left") )  group.rotateY(  angle );
  // if ( keyboard.pressed("right") ) group.rotateY( -angle );

}

// function moveCamera() {
//   var relativeCameraOffset = new THREE.Vector3(0, 20, -30);
//   var cameraOffset = relativeCameraOffset.applyMatrix4(plane.matrixWorld);
//   cameraHolder.position.x = cameraOffset.x;
//   cameraHolder.position.y = cameraOffset.y;
//   cameraHolder.position.z = cameraOffset.z;
//   camera.lookAt(plane.position);
// }

function showInformation()
{
  // Use this to show information onscreen
  // var controls = new InfoBox();
  //   controls.add("Group Example");
  //   controls.addParagraph();
  //   controls.add("Use mouse to rotate/pan/zoom the camera");
  //   controls.add("Up / Arrow to walk");
  //   controls.add("Left / Right arrow to turn");
  //   controls.add("Press 'A' to show/hide axes");
  //   controls.show();
}

function render()
{
  stats.update(); // Update FPS
  keyboardUpdate();

  // moveCamera();

  pos = plane.getWorldPosition(target); 
  cameraHolder.position.set(pos.x, pos.y + 20, pos.z - 40);   
  // // 
  // // pivot.position.set(plane.position.x, plane.position.y, plane.position.x)
  // // plane.position.x, plane.position.y, plane.position.z-40
  // // pivot.position.copy(cameraHolder.getWorldPosition(target));
  // // console.log(pivot.position);
  // camera.lookAt(pos);

  // trackballControls.update();
  rotateProppeler();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
