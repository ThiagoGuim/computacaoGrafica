import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        InfoBox,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians, 
        createLightSphere} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(2.18, 1.62, 3.31);
  camera.up.set( 0, 1, 0 );
var objColor = "rgb(255, 255, 255)";

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(3.0, 3.0, 50, 50); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Show text information onscreen
showInformation();


// Teapot
var geometry = new TeapotGeometry(0.3);
var material = new THREE.MeshPhongMaterial({color:objColor, shininess:"200"});
  material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.position.set(0.0, 0.3, 0.0);
scene.add(obj);


//Angular velocity
var angV = 5;
var rotationTeapot = false;

//bars
createBars();

//Lights
var positionLightRed = new THREE.Vector3(-1.5, 1.0, 0.0);
var positionLightGreen = new THREE.Vector3(0.0, 1.0, -1.5);
var positionLightBlue = new THREE.Vector3(0.0, 1.0, 1.5);


var lightSphereRed = createLightSphere(scene, 0.05, 20, 20, positionLightRed, "rgb(255 , 0, 0)" );
var lightSphereGreen = createLightSphere(scene, 0.05, 20, 20, positionLightGreen, "rgb(0 ,255, 0)");
var lightSphereBlue = createLightSphere(scene, 0.05, 20, 20, positionLightBlue, "rgb(0 , 0, 255)");

var pointLightRed = new THREE.PointLight("rgb(255 , 0, 0)");
var pointLightGreen = new THREE.PointLight("rgb(0 ,255, 0)");
var pointLightBlue = new THREE.PointLight("rgb(0 , 0, 255)");

createLights();




buildInterface();
render();

function createBars(){

    var material = new THREE.MeshBasicMaterial( {color: 0x808080} );
    var geometry = new THREE.CylinderGeometry( 0.01, 0.01, 1, 32, 1 );


    var bar1 = new THREE.Mesh( geometry, material );
    var bar2 = new THREE.Mesh( geometry, material );
    var bar3 = new THREE.Mesh( geometry, material );
    var bar4 = new THREE.Mesh( geometry, material );
    
    
    bar1.position.set(-1.5, 0.5, 1.5);
    bar2.position.set(-1.5, 0.5, -1.5);
    bar3.position.set(1.5, 0.5, 1.5);
    bar4.position.set(1.5, 0.5, -1.5);
    
    scene.add(bar1);
    scene.add(bar2);
    scene.add(bar3);
    scene.add(bar4);

    geometry = new THREE.CylinderGeometry( 0.01, 0.01, 3, 32, 1 );
    var bar5 = new THREE.Mesh( geometry, material );
    var bar6 = new THREE.Mesh( geometry, material );
    var bar7 = new THREE.Mesh( geometry, material );

    bar5.position.set(-1.5, 1.0, 0.0);
    bar5.rotateX(degreesToRadians(90));

    bar6.position.set(0.0, 1.0, -1.5);
    bar6.rotateZ(degreesToRadians(90));

    bar7.position.set(0.0, 1.0, 1.5);
    bar7.rotateZ(degreesToRadians(90));

    scene.add(bar5);
    scene.add(bar6);
    scene.add(bar7);
    

}

function createLights(){
    
    setPointLight(pointLightRed, positionLightRed);
    setPointLight(pointLightGreen, positionLightGreen);
    setPointLight(pointLightBlue, positionLightBlue);

}

// Set Point Light
// More info here: https://threejs.org/docs/#api/en/lights/PointLight
function setPointLight(light, position)
{
    light.position.copy(position);
    light.name = "Point Light";
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.visible = true;
    light.penumbra = 0.5;
  
    scene.add( light );
}

function buildInterface()
{
  //------------------------------------------------------------
  // Interface
  var controls = new function ()
  {
    this.viewAxes = false;
    
    this.redLight = true;
    this.greenLight = true;
    this.blueLight = true;

    this.setRotationTeaPot = rotationTeapot;

    this.onViewAxes = function(){
      axesHelper.visible = this.viewAxes;
    };

    this.onEnableRedLight = function(){
        pointLightRed.visible = this.redLight;
    };

    this.onEnableGreenLight = function(){
        pointLightGreen.visible = this.greenLight;
    };

    this.onEnableBlueLight = function(){
        pointLightBlue.visible = this.blueLight;
    };

    this.onSetRotationTeapot = function(){
       rotationTeapot = this.setRotationTeaPot;
    };

  };


    var gui = new GUI();
    gui.add(controls, 'viewAxes', false)
        .name("View Axes")
        .onChange(function(e) { controls.onViewAxes() });


    gui.add(controls, 'redLight', true)
        .name("Red Light")
        .onChange(function(e) { controls.onEnableRedLight() });

    gui.add(controls, 'greenLight', true)
        .name("Green Light")
        .onChange(function(e) { controls.onEnableGreenLight() });

    gui.add(controls, 'blueLight', true)
        .name("Blue Light")
        .onChange(function(e) { controls.onEnableBlueLight() });

    gui.add(controls, 'setRotationTeaPot', true)
        .name("Rotation Teapot")
        .onChange(function(e) { controls.onSetRotationTeapot() });
}

function keyboardUpdate()
{
  keyboard.update();

  //Red Z
  if ( keyboard.pressed("R") )
  { 

    if(Math.abs(-1.5 - lightSphereRed.position.z) > 0.01){
        if(lightSphereRed.position.x <= -1.5){

            lightSphereRed.position.z -= 0.1;
            pointLightRed.position.copy(lightSphereRed.position);
        }
    }
  }


  if ( keyboard.pressed("T") )
  { 
    
    //Se nao tiver no final da barra
    if(Math.abs(1.5 - lightSphereRed.position.z) > 0.01){
        
        //Se tiver na sua barra
        if(lightSphereRed.position.x <= -1.5){

            lightSphereRed.position.z += 0.1;
            pointLightRed.position.copy(lightSphereRed.position);
        }
    }

  }

  //Red X
  keyboard.update();
  if ( keyboard.pressed("Y") )
  { 
      
      //Se tiver na extremidade
      if(Math.abs(-1.5 - lightSphereRed.position.z) < 0.01 || Math.abs(1.5 - lightSphereRed.position.z) < 0.01){

          //Se nao tiver no final da barra
          if(Math.abs(-1.5 - lightSphereRed.position.x) > 0.01){

            lightSphereRed.position.x -= 0.1;
            pointLightRed.position.copy(lightSphereRed.position);
        }

    }
  }

  if ( keyboard.pressed("U") )
  { 
      
      //Se tiver na extremidade
      if(Math.abs(-1.5 - lightSphereRed.position.z) < 0.01 || Math.abs(1.5 - lightSphereRed.position.z) < 0.01){

        //Se nao tiver no final da barra
        if(Math.abs(1.5 - lightSphereRed.position.x) > 0.01){

          lightSphereRed.position.x += 0.1;
          pointLightRed.position.copy(lightSphereRed.position);
      }

  }
  }


  //Green X
  keyboard.update();
  if ( keyboard.pressed("F") )
  {
    //Se nao tiver no final da barra
    if(Math.abs(-1.5 - lightSphereGreen.position.x) > 0.01){
        
        //Se tiver na sua barra
        if(lightSphereGreen.position.z <= -1.5 || lightSphereGreen.position.z >= 1.5){

            lightSphereGreen.position.x -= 0.1;
            pointLightGreen.position.copy(lightSphereGreen.position);
        }
    }
  }

  if ( keyboard.pressed("G") )
  {
    //Se nao tiver no final da barra
    if(Math.abs(1.5 - lightSphereGreen.position.x) > 0.01){
        
        //Se tiver na sua barra
        if(lightSphereGreen.position.z <= -1.5 || lightSphereGreen.position.z >= 1.5){

            lightSphereGreen.position.x += 0.1;
            pointLightGreen.position.copy(lightSphereGreen.position);
        }
    }
  }

  //Green Z
  keyboard.update();
  if ( keyboard.pressed("J") )
  {
    //Se tiver na extremidade
    if(Math.abs(-1.5 - lightSphereGreen.position.x) < 0.01){

        //Se nao tiver no final da barra
        if(Math.abs(-1.5 - lightSphereGreen.position.z) > 0.01){

          lightSphereGreen.position.z -= 0.1;
          pointLightGreen.position.copy(lightSphereGreen.position);
      }

    }
  }

  if ( keyboard.pressed("K") )
  {
    //Se tiver na extremidade
    if(Math.abs(-1.5 - lightSphereGreen.position.x) < 0.01){

        //Se nao tiver no final da barra
        if(Math.abs(1.5 - lightSphereGreen.position.z) > 0.01){

          lightSphereGreen.position.z += 0.1;
          pointLightGreen.position.copy(lightSphereGreen.position);
      }

    }
  }

  //Blue X
  keyboard.update();
  if ( keyboard.pressed("V") )
  {
    //Se nao tiver no final da barra
    if(Math.abs(-1.5 - lightSphereBlue.position.x) > 0.01){
        
        //Se tiver na sua barra
        if(lightSphereBlue.position.z <= -1.5 || lightSphereBlue.position.z >= 1.5){

            lightSphereBlue.position.x -= 0.1;
            pointLightBlue.position.copy(lightSphereBlue.position);
        }
    }
  }

  if ( keyboard.pressed("B") )
  {
    //Se nao tiver no final da barra
    if(Math.abs(1.5 - lightSphereBlue.position.x) > 0.01){
        
        //Se tiver na sua barra
        if(lightSphereBlue.position.z <= -1.5 || lightSphereBlue.position.z >= 1.5){

            lightSphereBlue.position.x += 0.1;
            pointLightBlue.position.copy(lightSphereBlue.position);
        }
    }
  }

   //Blue Z
   keyboard.update();
   if ( keyboard.pressed("N") )
   {
        //Se tiver na extremidade
        if(Math.abs(-1.5 - lightSphereBlue.position.x) < 0.01){

            //Se nao tiver no final da barra
            if(Math.abs(-1.5 - lightSphereBlue.position.z) > 0.01){

                lightSphereBlue.position.z -= 0.1;
                pointLightBlue.position.copy(lightSphereBlue.position);
            }

        }
   }

   if ( keyboard.pressed("M") )
   {
        //Se tiver na extremidade
        if(Math.abs(-1.5 - lightSphereBlue.position.x) < 0.01){

            //Se nao tiver no final da barra
            if(Math.abs(1.5 - lightSphereBlue.position.z) > 0.01){

            lightSphereBlue.position.z += 0.1;
            pointLightBlue.position.copy(lightSphereBlue.position);
        }

        }
   }
 
}

function rotateTeapot(){

  if(rotationTeapot){
    obj.rotateY(degreesToRadians(angV));
  }

}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();

    controls.add("Use the R-T (translateZ) and Y-U (translateX )Red Light");
    controls.addParagraph();
    controls.add("Use the F-G (translateX) and J-K (translateZ )Green Light");
    controls.addParagraph();
    controls.add("Use the V-B (translateX) and N-M (translateZ )Blue Light");
    controls.show();
}

function render()
{
  stats.update();
  trackballControls.update();
  keyboardUpdate();
  rotateTeapot();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
