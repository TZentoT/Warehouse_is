import { React, Component, Fragment } from "react";
import './StorekeeperVirtualWarehouse.css';
import * as THREE from 'three';
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SideBlock from "../../components/SideBlock/SideBlock";
import UniversalTabHolder from '../../components/TabHolders/UniversalTabHolder/UniversalTabHolder';
import { TableComponent } from "../../components/Table/TableComponent";
import InputText from "../../components/InputText/InputText";
import ExpandListInput from "../../components/ExpandListInput/ExpandListInput";
import ModelCreator from "../../classes/ModelCreator.js";
import { MOUSE, Vector2, Vector3 } from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

import AuxiliaryMath from "../../classes/AuxiliaryMath.js";
import WarehouseSettingsModel from "../../classes/WarehouseSettingsModel.js";
import FirstPersonControls from "../../classes/FirstPersonControls.js";
import zIndex from "@material-ui/core/styles/zIndex";
import { Api } from "../../api/administatoApi"

var api = new Api()
const styles = {

  }

let modelCreator = new ModelCreator()
let auxMath = new AuxiliaryMath()

let warehouseSettingsModel = new WarehouseSettingsModel()

let page



//#region Scene settings -------------------------------------------------

//#region Variables

const clock = new THREE.Clock();
let font = null

//is mouse button pressed
let mouseLeftButton = false
let mouseRightButton = false

//mouse last x and y
let lastX;
let lastY;

function setModel(value){
    model = value
    if (scene!=undefined) createHint();
}



//scene variables
let width, height;
let sceneMarginTop = 0;

let camera, scene, renderer;
let plane;
let pointer, raycaster; 

const objects = [];

//let editingMod = "viewing" //viewing, adding, deleting /change mode of interacting with models

let selectionLockedModels = [""] //models locked for selecting them
let hintLockedModels = [""] //models locked for creating hint fore them

let hintModel = undefined; //currently placed hint model
let model = undefined; //currently placed model
let selectedModel = undefined; //currently placed model

let viewMod = "observasion" //observasion, first-person /change mode of viewing
let controls

let player = {
    height: 70,
    turnSpeed: 0.2,
    speed: 10,
    jumpHeight: .2,
    gravity: 0,
    velocity: 0,
    jump:false
  }; //characteristics of first-person viewMod

//first-person view mod variables
let onPointerDownMouseX = 0
let onPointerDownMouseY = 0
let lon = 0
let lat = 0
let onPointerDownLon = 0
let onPointerDownLat = 0
let phi = 0
let theta = 0
let lookedPoint

//#endregion

function init(warehouseSettings) { 
    sceneMarginTop = document.getElementById('warehouseSceneWrap').offsetTop -1
    width =  window.innerWidth
    height = window.innerHeight - sceneMarginTop - 4

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    //scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    //grid
    const gridHelper = new THREE.GridHelper( Math.max(warehouseSettings.width, warehouseSettings.length), Math.max(warehouseSettings.width, warehouseSettings.length) );
    scene.add( gridHelper );

    const geometry = new THREE.PlaneGeometry( 10000, 10000 );
    geometry.rotateX( - Math.PI / 2 );

    plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    plane.name = "Mesh"
    selectionLockedModels.push("Mesh")
    hintLockedModels.push("Mesh")

    scene.add( plane );
    objects.push( plane );

    // lights
    const ambientLight = new THREE.AmbientLight( 0x606060 );
    scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add( directionalLight );

    //renderer
    var factor = 0.8; // percentage of the screen
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );

    setObservationViewMod()

    //addingSceneOnScreen
    var warehouseScene = document.getElementById("warehouseScene")
    warehouseScene.appendChild( renderer.domElement );

    //setListeners
    setListeners()
}

function render() {
    if (viewMod == "first-person" && mouseRightButton) {
        lon += 0.1;
        updatelookedPoint()
        camera.lookAt(lookedPoint);
    }
    if (renderer!=undefined)
        renderer.render( scene, camera );
}


function getScreenX(X){
    return ( X / width ) * 2 - 1
}

function getScreenY(Y){
    return -((Y - sceneMarginTop) / height) * 2 + 1 
}

//#region Listeners 

function setListeners(){
    var warehouseScene = document.getElementById("warehouseScene")
    var btnPanel = document.getElementById("btn_panel")

    //listener for hint
    warehouseScene.addEventListener('mousemove', onMouseMove)

    //listenets for saving mouse button
    warehouseScene.addEventListener('mousedown', onMouseDown)
    warehouseScene.addEventListener('mouseup', onMouseUp)

    //connecting key listeners when mouse over scene
    warehouseScene.addEventListener('mouseover', connectKeyListeners)
    warehouseScene.addEventListener('mouseout', disconnectKeyListeners)

    //listener for resizing
    window.addEventListener( 'resize', onWindowResize );

    //listener for saving mouse coordinates and animating model hint
    warehouseScene.addEventListener('pointermove', onPointerMove)

    //listener for creating a model on click
    warehouseScene.addEventListener('pointerdown', onPointerDown)

    //listener for flicking view mod
    warehouseScene.addEventListener( 'mousemove', onMouseMoveControls );
    warehouseScene.addEventListener( 'wheel', onSceneMouseWheel );

    //panel testing
    //btnPanel.addEventListener('pointerup', onPanel)
}

function connectKeyListeners(){
//listener for shift and ctrl and creating model hint
    document.addEventListener( 'keydown', onDocumentKeyDown );
    document.addEventListener( 'keyup', onDocumentKeyUp );
}

function disconnectKeyListeners(){
    //listener for shift and ctrl and creating model hint
    document.removeEventListener( 'keydown', onDocumentKeyDown );
    document.removeEventListener( 'keyup', onDocumentKeyUp );
}

//onPanel
function onPanel(){
   
}

//#region flicking view mod
function onChangeViewMode(){
    switch (viewMod){
        case "observasion": setFirstPersonViewMod(); break;
        case "first-person": setObservationViewMod(); break;
    }
}

function setObservationViewMod(){
    viewMod = "observasion"
    
    camera = new THREE.PerspectiveCamera( 45, width/ height, 1, 10000 );
    camera.position.set( 500, 800, 1300 );
    // camera.lookAt( 0, 0, 0 );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.update()
    controls.enabled = true;

    render()
}

function setFirstPersonViewMod(){
    viewMod = "first-person"
    if (controls != undefined)
        controls.enabled = false;

    camera = new THREE.PerspectiveCamera( 45, width/ height, 1, 10000 );
    camera.position.set(0, player.height, 0);

    lookedPoint = auxMath.translatePoint(camera.position, {x:1,y:0,z:0})
    camera.lookAt(lookedPoint);

    // firstPersonControls = new FirstPersonControls( camera, renderer.domElement )
    // firstPersonControls.connect()
    // firstPersonControls.refreshControls()

    onPointerDownMouseX = 0
    onPointerDownMouseY = 0
    lon = 0
    lat = 0
    onPointerDownLon = 0
    onPointerDownLat = 0
    phi = 0
    theta = 0
    updatelookedPoint()

    render()
}

function onMouseDown(e){
    if (e.button == 0) mouseLeftButton = true
    if (e.button == 2) {
        mouseRightButton = true
        if ( e.isPrimary === false ) return;

        onPointerDownMouseX = e.clientX;
        onPointerDownMouseY = e.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;
    }
}
function onMouseUp(e){
    if (e.button == 0) mouseLeftButton = false
    if (e.button == 2) {
        mouseRightButton = false
        if ( e.isPrimary === false ) return;
    }
}

function onMouseMoveControls(event){
    if (viewMod == "first-person" && mouseRightButton) {
        if ( event.isPrimary === false ) return;
        lon = ( onPointerDownMouseX - event.clientX ) * player.turnSpeed + onPointerDownLon;
        lat = ( event.clientY - onPointerDownMouseY ) * player.turnSpeed + onPointerDownLat;
    }
}

function onSceneMouseWheel( event ) {
    const fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.MathUtils.clamp( fov, 10, 100 );
    camera.updateProjectionMatrix();
}

function updatelookedPoint(){
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.MathUtils.degToRad( 90 - lat );
    theta = THREE.MathUtils.degToRad( lon );

    const x = 500 * Math.sin( phi ) * Math.cos( theta );
    const y = 500 * Math.cos( phi );
    const z = 500 * Math.sin( phi ) * Math.sin( theta );
    lookedPoint = new Vector3(x,y,z)
}

//#endregion

//#region textHint
let hintTimer = setTimeout(onMouseStop, 1000);
function onMouseMove(){
    clearTimeout(hintTimer);
    hintTimer = setTimeout(onMouseStop, 1000)
    var hint = document.getElementById("hint")
    if (hint != null){
        hint.remove()
    }
    createHint();
}

function onMouseStop(){
    if (pointer != undefined){
        pointer.set(getScreenX(lastX), getScreenY(lastY));
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( objects );
        const intersect = intersects[0];
        if (intersects.length > 0 && !hintLockedModels.includes(intersect.object.name)) {
            generateHint(intersect, lastX, lastY)
        }
    }
}

function generateHint(intersect, lastX, lastY){
    var warehouseScene = document.getElementById("warehouseSceneWrap")
    var hint = document.createElement("div");
    hint.id = "hint";
    hint.style.position = "absolute";
    hint.style.left = `${lastX}px`;
    //hint.style.width = `${100}px`;
    hint.style.background = "white";
    hint.style.height = 0;
    hint.style.zIndex = 100;
    hint.style.border = "1px solid #000000";
    hint.style.borderRadius = "10px";
    if (intersect.object.userData.space != undefined){
        intersect.object.userData.space.map(function(good,i){
            hint.style.top = `${lastY - 25*(i+1)}px`;
            hint.style.height = `${25*(i+1)}px`;
            hint.innerHTML += `${good.name}<br>`;
        })
    } else {
        hint.style.top = `${lastY - 25}px`;
        hint.style.height = `${25}px`;
        hint.innerHTML = `${intersect.object.name}`;
    }
    warehouseScene.appendChild(hint);
}
//#endregion

//#region controls and creating model hint
let isShiftDown = false
let isCtrlDown = false
let pressedKeys = []

function onDocumentKeyDown( event ) {
    event.preventDefault()
    if (!pressedKeys.includes(event.keyCode))
        pressedKeys.push(event.keyCode)

    // switch ( event.keyCode ) {
    //     case 16: isShiftDown = true; changeEditingMod(); createHint(); break;
    //     case 17: isCtrlDown = true; changeEditingMod(); createHint(); break;
    // }
}

function onDocumentKeyUp( event ) {
    event.preventDefault()
    if (pressedKeys.includes(event.keyCode))
        pressedKeys.splice(pressedKeys.indexOf(event.keyCode), 1);

    // switch ( event.keyCode ) {
    //     case 16: isShiftDown = false; changeEditingMod(); createHint(); break;
    //     case 17: isCtrlDown = false; changeEditingMod(); createHint(); break;
    // }
}

// function changeEditingMod(){
//     if (!isShiftDown && !isCtrlDown || isShiftDown && isCtrlDown) editingMod = "viewing"
//     else if (isShiftDown && !isCtrlDown) editingMod = "adding"
//     else if (!isShiftDown && isCtrlDown) editingMod = "deleting"
// }

let keyListener = setTimeout(onKeyPressed, 10);
function onKeyPressed(){

    if (pressedKeys.includes(87)){// w
        if (viewMod == "first-person" && lookedPoint!=undefined) {
            var vector = lookedPoint.multiplyScalar( player.speed/1000, player.speed/1000, player.speed/1000 );
            camera.position.x += vector.x;
            camera.position.y += vector.y;
            camera.position.z += vector.z;
            lookedPoint.x += vector.x;
            lookedPoint.y += vector.y;
            lookedPoint.z += vector.z;
            updatelookedPoint()
            render()
        }
    }
    if (pressedKeys.includes(83)){// s
        if (viewMod == "first-person" && lookedPoint!=undefined) {
            var vector = lookedPoint.multiplyScalar( player.speed/1000 * -1, player.speed/1000, player.speed/1000 * -1 );
            camera.position.x += vector.x;
            camera.position.y += vector.y;
            camera.position.z += vector.z;
            lookedPoint.x += vector.x;
            lookedPoint.y += vector.y;
            lookedPoint.z += vector.z;
            updatelookedPoint()
            render()
        }
    }
    if (pressedKeys.includes(65)){// a
        if (viewMod == "first-person" && lookedPoint!=undefined) {
            let point = new Vector3(lookedPoint.x, camera.position.y, lookedPoint.z )
            var distinct = auxMath.rotatePointAroundAxis(
                point, 
                auxMath.translatePoint(camera.position, {x:0,y:-1,z:0}),
                auxMath.translatePoint(camera.position, {x:0,y:1,z:0}), 
                90 * Math.PI / 180
            )

            var vector = distinct.multiplyScalar( player.speed/1000, 0, player.speed/1000 );
            camera.position.x += vector.x;
            //camera.position.y += vector.y;
            camera.position.z += vector.z;
            lookedPoint.x += vector.x
            lookedPoint.z += vector.z
            updatelookedPoint()
            render()
        }
    }
    if (pressedKeys.includes(68)){// d
        if (viewMod == "first-person" && lookedPoint!=undefined) {
            let point = new Vector3(lookedPoint.x, camera.position.y, lookedPoint.z )
            var distinct = auxMath.rotatePointAroundAxis(
                point, 
                auxMath.translatePoint(camera.position, {x:0,y:-1,z:0}),
                auxMath.translatePoint(camera.position, {x:0,y:1,z:0}), 
                -90 * Math.PI / 180
            )
            var vector = distinct.multiplyScalar( player.speed/1000, 0, player.speed/1000 );
            camera.position.x += vector.x;
            //camera.position.y += vector.y;
            camera.position.z += vector.z;
            lookedPoint.x += vector.x
            lookedPoint.z += vector.z
            updatelookedPoint()
            render()
        }
    }
    if (pressedKeys.includes(18)){// left alt
        if (viewMod == "first-person" && lookedPoint!=undefined) {
            var vector = camera.position.multiplyScalar( 1, player.speed/1000, 1 );
            camera.position.y -= vector.y/50;

            vector = lookedPoint.multiplyScalar( 1, player.speed/1000, 1 );
            lookedPoint.y -= vector.y/50;
        }
        render()
    }
    if (pressedKeys.includes(32)){// space
        if (viewMod == "first-person" && lookedPoint!=undefined){
            var vector = camera.position.multiplyScalar( 1, player.speed/1000, 1 );
            camera.position.y += vector.y/50;

            vector = lookedPoint.multiplyScalar( 1, player.speed/1000, 1 );
            lookedPoint.y += vector.y/50;
        }
        render()
    }
    keyListener = setTimeout(onKeyPressed, 10);
}

function createHint(){
    if (hintModel != undefined) {
        scene.remove(hintModel.mesh)
        hintModel = undefined
    }
    pointer.set(getScreenX(lastX), getScreenY(lastY));
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( objects );
    const intersect = intersects[0];

    if (intersect != undefined && !selectionLockedModels.includes(intersect.object.name)) {
        hintModel = {
            name: "Hint", 
            modelName: "Hint",
            material: new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } ), 
            geometry: intersect.object.geometry, 
            mesh: new THREE.Mesh( 
                intersect.object.geometry, 
                new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } )
            ), 
            translation: new Vector3(0,0,0),
        }
        hintModel.mesh.visible = false
        scene.add( hintModel.mesh );
    }
    // }
    animateHint()
}
//#endregion

//#region window resize
function onWindowResize() {
    width =  window.innerWidth
    height = window.innerHeight - sceneMarginTop - 4

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height);
}
//#endregion

//#region saving mouse coordinate and animating model hint
function onPointerMove(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    animateHint();
}

function animateHint() {
    pointer.set(getScreenX(lastX), getScreenY(lastY));
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( objects );
    const intersect = intersects[0];
    if (intersect!=undefined && hintModel != undefined && page.state.panelSelTab.id == 0) {
        //hintMesh.visible = true;

        hintModel.mesh.position.copy( intersect.point ).add( intersect.face.normal );
        hintModel.mesh.position.divideScalar(1).floor().multiplyScalar(1).addScalar( 1 );
        hintModel.mesh.position.set(
            intersect.object.position.x, 
            intersect.object.position.y, 
            intersect.object.position.z
        )
        hintModel.mesh.visible = true
        scene.add( hintModel.mesh );
    } 
    render();
}

function highlightModel(model){
    let highlightModel = {
        name: "highlightHint", 
        modelName: "highlightHint",
        material: new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } ), 
        geometry: model.geometry, 
        mesh: new THREE.Mesh( 
            model.geometry, 
            new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } )
        ), 
        translation: new Vector3(0,0,0),
    }
    if (highlightModel!=undefined) {
        highlightModel.mesh.position.copy( model.position.clone() );
        highlightModel.mesh.position.divideScalar(1).floor().multiplyScalar(1).addScalar( 1 );
        highlightModel.mesh.position.set(
            model.position.x, 
            model.position.y, 
            model.position.z
        )
        highlightModel.mesh.name = highlightModel.name;
        highlightModel.mesh.visible = true
        scene.add( highlightModel.mesh );
    } 
}

function highlightGoods(goodsId){
    let buf = []
    scene.children.map(obj=>{
        if (obj.name == "highlightHint"){
            buf.push(obj)
        }
    })
    buf.map(obj=>{scene.remove(obj)})
    buf = []
    scene.children.map(obj=>{
        if(obj.userData !=undefined && obj.userData.space!=undefined){
            obj.userData.space.map(good=>{
                if (goodsId.includes(good.id)){
                    buf.push(obj)
                }
            })
        }
    })
    buf.map(obj=>{highlightModel(obj)})
    render();
}
//#endregion

//#region create a model on click
function onPointerDown( event ) {
    pointer.set(getScreenX(event.clientX), getScreenY(event.clientY));
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( objects );
    
    if (intersects.length > 0 && hintModel!=undefined && page.state.panelSelTab.id == 0) {
        const intersect = intersects[0];

        scene.remove(selectedModel)
        //objects.remove(selectedModel)
        selectedModel = undefined
              
        const voxel = new THREE.Mesh( hintModel.geometry, hintModel.material);
        voxel.position.copy( intersect.point ).add( intersect.face.normal );
        voxel.position.divideScalar( 1 ).floor().multiplyScalar( 1 ).addScalar( 1 );
        voxel.position.set(
            intersect.object.position.x, 
            intersect.object.position.y, 
            intersect.object.position.z)
        //voxel.name = model.name;
        scene.add( voxel );
        //objects.push( voxel );
        selectedModel = voxel

        let shelfSpace = structuredClone(intersect.object.userData.space).map(
        function(good,i){
            let buf = good
            buf.goodId = good.id
            buf.id = i
            buf.number = i+1
            buf.goodsType = good.name
            buf.weight = good.weight
            return buf
        })
        page.setState({tableList: shelfSpace});
        //page.flickPanel()
        
        render();
    }
}
//#endregion

//#region work with models and scene

function setModelOnCoordinates(model, coordinates, inObjects){
    const voxel = model.mesh;
    voxel.position.divideScalar( 1 ).floor().multiplyScalar( 1 ).addScalar( 1 );
    voxel.position.set(coordinates.x + model.translation.x, coordinates.y + model.translation.y, coordinates.z + model.translation.z)
    voxel.name = model.name;
    scene.add( voxel );
    if (inObjects) objects.push( voxel );
}

function warehouseGeneration(warehouseSettings, zonesType, racksType, goodsType){
    let floorModel = modelCreator.createFloor("Floor", 0x808080, warehouseSettings.width, warehouseSettings.length, 4, new Vector3(0,-2,0))
        
    setModelOnCoordinates(floorModel, new Vector3(0,0,0))
    selectionLockedModels.push(floorModel.name)
    hintLockedModels.push(floorModel.name)

    //zones
    warehouseSettings.zones.map(zone=>{
        let zoneType = zonesType[`zone_${zone.zoneTypeId}`]
        let zoneBorderModel = modelCreator.createZoneBorder(zone.name, zoneType.color, zoneType.width, zoneType.length, zoneType.lineWidth, zoneType.chamferLendth, zoneType.message, zoneType.messageAlighment, font, zoneType.textSize, zoneType.gapLengthX, zoneType.gapLengthY, new Vector3(0,0,0))
        zoneBorderModel.mesh = auxMath.rotateMeshOnAllAxis(zoneBorderModel.mesh, zone.rotation)
        let zoneCenterGlobalCoordinate = zone.centerPoint
        setModelOnCoordinates(zoneBorderModel, zoneCenterGlobalCoordinate, false)
        selectionLockedModels.push(zone.name)
        hintLockedModels.push(zone.name)
        //racks
        zone.racks.map(rack=>{
            let rackType = racksType[`rack_${rack.racksTypeId}`]
            let rackModel = modelCreator.createRack(rack.name, rackType.color, rackType.shelfWidth, rackType.shelfHeight, rackType.depth, rackType.columsAmount, rackType.rowsAmount, rackType.borderWidth, rackType.translation)
            let rackCenterGlobalCoordinate = new Vector3(
                zoneCenterGlobalCoordinate.x + rack.centerPoint.x, 
                zoneCenterGlobalCoordinate.y + rack.centerPoint.y, 
                zoneCenterGlobalCoordinate.z + rack.centerPoint.z
            )
            rackModel.mesh = auxMath.rotateMeshOnAllAxis(rackModel.mesh, auxMath.sumRotations([zone.rotation, rack.rotation]))
            let rotatedRackCenterGlobalCoordinate = auxMath.rotatePointAroundAxisMass(
                rackCenterGlobalCoordinate.clone(), 
                auxMath.translatePoint(zoneCenterGlobalCoordinate.clone(), {x:-rackType.translation.x,y:-rackType.translation.y,z:-rackType.translation.z}), 
                zone.rotation
            )
            setModelOnCoordinates(
                rackModel, 
                rotatedRackCenterGlobalCoordinate,
                true
            )
            selectionLockedModels.push(rack.name)
            //shelfs
            rack.shelfs.map(shelf=>{
                if (shelf.space != ""){
                    //shelf.space.map(good=>{
                        let good = shelf.space[0]
                        let goodType = goodsType[`good_${good.goodTypeId}`]
                        let goodModel = modelCreator.createCube(good.name, goodType.color, goodType.width, goodType.height, goodType.depth, goodType.translation)
                        goodModel.mesh.userData.space = shelf.space
                        
                        let firstShelfCenterGlobalCoordinate = new Vector3(
                            rackCenterGlobalCoordinate.x-((rackType.shelfWidth*rackType.columsAmount + rackType.borderWidth*(rackType.columsAmount+1))/2 - (rackType.shelfWidth/2 + rackType.borderWidth) ),
                            rackCenterGlobalCoordinate.y + rackType.borderWidth*2,
                            rackCenterGlobalCoordinate.z
                        )
                        let shiftedFirstShelfCenterGlobalCoordinate = new Vector3(
                            firstShelfCenterGlobalCoordinate.x + (rackType.shelfWidth  + rackType.borderWidth)*rackType.shelfs[`shelf_${shelf.number}`].column,
                            firstShelfCenterGlobalCoordinate.y + (rackType.shelfHeight + rackType.borderWidth)*rackType.shelfs[`shelf_${shelf.number}`].row,
                            firstShelfCenterGlobalCoordinate.z
                        )
                        goodModel.mesh = auxMath.rotateMeshOnAllAxis(goodModel.mesh, auxMath.sumRotations([zone.rotation, rack.rotation]))
                        let rotatedZoneShiftedFirstShelfCenterGlobalCoordinate = auxMath.rotatePointAroundAxisMass(shiftedFirstShelfCenterGlobalCoordinate.clone(), zoneCenterGlobalCoordinate.clone(), zone.rotation)
                        let rotatedRackShiftedFirstShelfCenterGlobalCoordinate = auxMath.rotatePointAroundAxisMass(
                            rotatedZoneShiftedFirstShelfCenterGlobalCoordinate.clone(), 
                            auxMath.translatePoint(rotatedRackCenterGlobalCoordinate.clone(), {x:rackType.translation.x,y:rackType.translation.y,z:rackType.translation.z}),
                            rack.rotation
                        )
                            
                        setModelOnCoordinates(
                            goodModel, 
                            rotatedRackShiftedFirstShelfCenterGlobalCoordinate,
                            true
                        )
                    //})
                }
            })
        })
    })
}
//#endregion

class StorekeeperVirtualWarehouse extends Component {

    isSideBlockOpened = false
    prevSearchTerm = undefined
    allGoods = undefined
    warehouseSettings = undefined
    selectedItem1 = undefined

    // componentWillMount(){
    //     this.sideBlock = new SideBlock({isOpened:this.isSideBlockOpened, onRightClosed:"-497px", onRightOpened:"-1px", styles:{top:"100px",width:"500px", height:"100%"}})
    // }
    
    constructor(props){
        super(props)
        page = this
        this.state={
            reload:0,
            //?????????????????? ????????????
            zonesType: undefined,
            racksType: undefined,
            goodsType: undefined,
            warehouseSettings: undefined,
            //???????? toolbar'a
            tabs:[
                {id:0, title:"??????", func:()=>{onChangeViewMode()}, selection:false, style:{fontSize:"15px", height:"20px"}},
                // {id:1, title:"???????? ????????????????", func:()=>{this.flickPanel()}, selection:false, style:{fontSize:"15px", height:"20px"}}
            ],
            selTab:{id:0, title:"??????", func:()=>{onChangeViewMode()}, selection:false, style:{fontSize:"15px", height:"20px"}},
            //???????? ???????????????????? ????????????????
            panelTabs:[
                {id:0, title:"????????????????????", func:()=>{}, selection:true, style:{fontSize:"15px", height:"20px"}},
                {id:1, title:"??????????", func:()=>{}, selection:true, style:{fontSize:"15px", height:"20px"}}
            ],
            panelSelTab:{id:0, title:"????????????????????", func:()=>{}},
            isSideBlockOpened:false,
            //?????????????? ?? ???????????????????? ?????????? ???? ????????????????
            tableHeaders:[
                {name: 'number',    title:'???',              editingEnabled:false,   width:40    }, 
                {name: 'goodId',    title:'id',             editingEnabled:false,   width:40    }, 
                {name: 'goodsType', title:'????????????????????????',   editingEnabled:false,   width:310   }, 
                {name: 'weight',    title:'?????? (????)',            editingEnabled:false,   width:100, totalCount:{type:['sum'], expantionAlign: 'right'}   }, 
            ],
            tableSettings:{add:false, edit:false, delete:false, select:true},
            selectedItem:undefined,
            tableList:[],
            //??????-???? ???????????? ???? ???????????? ???????? ????????????????
            good:undefined,
            id:undefined,
            category:undefined,
            subCategory:undefined,
            cost:undefined,
            weight:undefined,
            goodCharacteristics:undefined,
            //?????????? ???????????? ???? ??????-?????? ???? ???????????? ???????? ????????????????
            goodSearchTerm:"",
            idSearchTerm:"",
            categoryExpandList:[
                {value: ""                         },
                {value: "???????????????????????? ??????????????"     },
                {value: "???????????????????? ????????????"        },
                {value: "?????????????????? ????????????"         },
                {value: "????????????????????????"             },
                {value: "?????????????????????? ????????????"       },
                {value: "???????????? ??????????"             },
                {value: "??????????????"                  },
                {value: "??????????"                    },
                {value: "?????????????????????????? ????????????"     },
                {value: "???????????? ?????????????? ??????????????"   },
                {value: "?????????????????????????? ????????"       },
                {value: "????????????????????????????"           },
                {value: "????????????????"                 },
                {value: "??????????????????????????????"          },
                {value: "???????????? ?? ????????????????????"      },
                {value: "?????????????? ????????????, ????????????????" }
            ],
            categorySearchTerm: "",
            subCategoryExpandList:[
                {value: ""                                  },
                {value: "???????????????? ??????????????????????"              },
                {value: "?????????????? ??????????"                     },
                {value: "??????????????"                           },
                {value: "???????????????????????? ?????????????????????????? ????????????" },
                {value: "???????????????????????? ????????????????????????"         },
                {value: "???????????????????????? ?????????????????????? ????????????"   },
                {value: "???????????????????????? ?????????????????????????? ????????"   },
                {value: "???????????????? ??????????"                    },
                {value: "???????????????????????? ??????????????"              },
                {value: "??????????"                             },
                {value: "?????????????? ?????????????? ?????? ????????"          },
                {value: "?????????????? ?? ??????????????"                 },
                {value: "?????????????????????????? ??????????????"             },
                {value: "???????????????? ?? ????????????????????????"           },
            ],
            subCategorySearchTerm: "",
            //?????????????? ?? ???????????????????? ???? ??????-?????? ????????????????
            tableHeaders1:[
                {name: 'number',    title:'???',              editingEnabled:false,   width:80, totalCount:{type:['count'], expantionAlign: 'right'} }, 
                {name: 'goodId',    title:'id',             editingEnabled:false,   width:40    }, 
                {name: 'goodsType', title:'????????????????????????',   editingEnabled:false,   width:290   }, 
                {name: 'weight',    title:'?????? (????)',       editingEnabled:false,   width:80   }, 
            ],
            tableSettings1:{add:false, edit:false, delete:false, select:true, massSelection:true,},
            selectedItem1:undefined,
            tableList1:[],
        }
    }

    setReload = ()=>{this.setState({reload: this.state.reload+1});}
    setTableHeaders = (value)=>{this.setState({tableHeaders: value});}  //?????????????? ?? ???????????????????? ?????????? ???? ????????????????
    setTableList = (value)=>{this.setState({tableList: value});}        //?????????????? ?? ???????????????????? ?????????? ???? ????????????????
    setSelectedItem = (value)=>{this.setState({selectedItem: value});}  //?????????????? ?? ???????????????????? ?????????? ???? ????????????????
    setSelTab = (value)=>{this.setState({selTab: value});}              //???????? toolbar'a
    setIsSideBlockOpened = (value)=>{this.setState({isSideBlockOpened: value});}    //???????? ???????????????????? ????????????????
    setGoodSearchTerm = (value)=>{
        this.state.selectedItem1 = undefined; 
        highlightGoods([])
        this.setState({goodSearchTerm: value});
    }                  //?????????? ???????????? ???? ??????-?????? ???? ???????????? ???????? ????????????????
    setIdSearchTerm = (value)=>{
        this.state.selectedItem1 = undefined; 
        highlightGoods([])
        this.setState({idSearchTerm: value});
    }                      //?????????? ???????????? ???? ??????-?????? ???? ???????????? ???????? ????????????????
    setCategoryExpandList = (value)=>{this.setState({categoryExpandList: value});}          //?????????? ???????????? ???? ??????-?????? ???? ???????????? ???????? ????????????????
    setCategorySearchTerm = (value)=>{
        this.state.selectedItem1 = undefined;
        highlightGoods([])
        this.setState({categorySearchTerm: value});
    }          //?????????? ???????????? ???? ??????-?????? ???? ???????????? ???????? ????????????????
    setSubCategoryExpandList = (value)=>{this.setState({subCategoryExpandList: value});}    //?????????? ???????????? ???? ??????-?????? ???? ???????????? ???????? ????????????????
    setSubCategorySearchTerm = (value)=>{
        this.state.selectedItem1 = undefined;
        highlightGoods([])
        this.setState({subCategorySearchTerm: value});
    }    //?????????? ???????????? ???? ??????-?????? ???? ???????????? ???????? ????????????????

    setTableHeaders1 = (value)=>{this.setState({tableHeaders1: value});}  //?????????????? ?? ???????????????????? ???? ??????-?????? ????????????????
    setTableList1 = (value)=>{this.setState({tableList1: value});}        //?????????????? ?? ???????????????????? ???? ??????-?????? ????????????????
    setSelectedItem1 = (value)=>{this.setState({selectedItem1: value});}  //?????????????? ?? ???????????????????? ???? ??????-?????? ????????????????


    setPanelSelTab = (value)=>{
        this.state.selectedItem1 = undefined;
        highlightGoods([])
        scene.remove(selectedModel)
        selectedModel = undefined
        createHint()
        render()
        this.setState({panelSelTab: value});
    }                //???????? ???????????????????? ????????????????
    // flickPanel=()=>{
    //     this.setState({isSideBlockOpened: !this.state.isSideBlockOpened}); this.isSideBlockOpened = !this.isSideBlockOpened
    // }
    
    componentDidMount(){
        var manager = new THREE.LoadingManager();
        manager.onLoad = () => { // when all resources are loaded
         
            var racksWithShelfs = this.getRacksType()
            racksWithShelfs.then(racksWithShelfs => {
                console.log("racksWithShelfs")
                console.log(racksWithShelfs)
                this.state.racksType = racksWithShelfs
                this.state.rackTypeIdExpandList = Object.keys(racksWithShelfs).map(rackType=>{return {value: rackType.split("_")[1]}})

                var zones = this.getZonesType()
                zones.then(zones => {
                    this.state.zonesType = zones
                    this.state.zoneTypeIdExpandList = Object.keys(zones).map(zoneType=>{return {value: zoneType.split("_")[1]}})

                    var goods_type = this.getGoodsType()
                    goods_type.then(goods_type => {
                        this.state.goodsType = goods_type
                        var warehouse_model = this.getWarehouseModel()
                        warehouse_model.then(warehouse_model => {
                            this.state.warehouseSettings = warehouse_model
                            this.buildWarehouse()
                        })
                      
                    })
                })
            })

           
        }
        let fontWeight = 'regular';
        //fontWeight = 'bold';
        let fontName = 'helvetiker' // helvetiker, optimer, gentilis, droid sans, droid serif
        var loader = new FontLoader(manager);
        loader.load('https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json', function(response) {
            font = response;
        });
    }

    componentDidUpdate(){
        if (this.state.zonesType != undefined && this.state.racksType != undefined && this.state.warehouseSettings != undefined && this.state.goodsType != undefined) {
            console.log("DidUpdate")
            if (this.state.isSideBlockOpened==true){
                this.setState({isSideBlockOpened: !this.state.isSideBlockOpened})
            }
            if (this.state.selectedItem!=undefined && this.state.id!=this.state.selectedItem.goodId){
                this.state.good = this.state.selectedItem.goodsType
                this.state.id = this.state.selectedItem.goodId
                this.state.category = this.state.selectedItem.category
                this.state.subCategory = this.state.selectedItem.subCategory
                this.state.cost = this.state.selectedItem.cost
                this.state.weight = this.state.selectedItem.weight
                this.state.goodCharacteristics = this.state.selectedItem.goodCharacteristics
                this.setReload()
            }
            if (this.prevSearchTerm != undefined && (
                this.prevSearchTerm.goodSearchTerm != this.state.goodSearchTerm ||
                this.prevSearchTerm.idSearchTerm != this.state.idSearchTerm ||
                this.prevSearchTerm.categorySearchTerm != this.state.categorySearchTerm ||
                this.prevSearchTerm.subCategorySearchTerm != this.state.subCategorySearchTerm
            )){
                let buf = structuredClone(this.allGoods)
                buf = this.sortListByKey(buf, "name", this.state.goodSearchTerm)
                buf = this.sortListByKey(buf, "id", this.state.idSearchTerm)
                buf = this.sortListByKey(buf, "category", this.state.categorySearchTerm)
                buf = this.sortListByKey(buf, "subCategory", this.state.subCategorySearchTerm)
                buf = buf.map(function(good,i){
                    let goodBuf = good
                    goodBuf.goodId = good.id
                    goodBuf.id = i
                    goodBuf.number = i+1
                    goodBuf.goodsType = good.name
                    goodBuf.weight = good.weight
                    return goodBuf
                })
                this.setState({tableList1: buf})
            }
            this.prevSearchTerm = {goodSearchTerm:this.state.goodSearchTerm, idSearchTerm:this.state.idSearchTerm, categorySearchTerm:this.state.categorySearchTerm, subCategorySearchTerm:this.state.subCategorySearchTerm}
            if (this.selectedItem1 != this.state.selectedItem1){
                let buf = []
                this.state.selectedItem1.map(index=>{buf.push(this.state.tableList1[index].goodId)})
                highlightGoods(buf)
            }
        }
    }

    buildWarehouse = ()=>{
        init(this.state.warehouseSettings)
        createHint()
        warehouseGeneration(this.state.warehouseSettings, this.state.zonesType, this.state.racksType, this.state.goodsType)
        this.allGoods = []
        this.state.warehouseSettings.zones.map(zone=>{
            zone.racks.map(rack=>{
                rack.shelfs.map(shelf=>{
                    shelf.space.map(good=>{
                        this.allGoods.push(good)
                    })
                })
            })
        })
        let buf = structuredClone(this.allGoods).map(function(good,i){
            let goodBuf = good
            goodBuf.goodId = good.id
            goodBuf.id = i
            goodBuf.number = i+1
            goodBuf.goodsType = good.name
            goodBuf.weight = good.weight
            return goodBuf
        })
        this.state.tableList1 = buf
        render()
    }

    getRacksType = async ()=>{
		var res = {}
		res = await api.getRacksType()
		return res
	}

    getZonesType = async ()=>{
		var res = {}
		res = await api.getZones()
		return res
	}

    getGoodsType = async ()=>{
        var res = {}
		res = await api.getGoodsType()
		return res  
    }

    getWarehouseModel = async ()=>{
        var res = {}
		res = await api.getWarehouseModel()
		return res  
    }

    sortListByKey=(list, key, searchTerm)=>{
        return list.filter(item => {
            return String(item[key]).toLowerCase().includes(String(searchTerm).toLowerCase())
        })
    }

    // componentWillUnmount() {
    //     clearInterval(keyListener);
    // }

    render(){
        return (
            <>
                {/* <div id="toolbar" style={{display: "table", width:"100%"}}>
                    <UniversalTabHolder tabs={this.state.tabs} setTab={this.setSelTab} selTab={this.state.selTab}/>
                </div> */}
                
                <div id="warehouseSceneWrap">
                    <div id="warehouseScene" onContextMenu={(e)=> e.preventDefault()}/>
                    <SideBlock isOpened={this.isSideBlockOpened} onRightClosed="-497px" onRightOpened="-1px" styles={{top:"90px",width:"500px", height:"100%"}}>
                        <UniversalTabHolder tabs={this.state.panelTabs} setTab={this.setPanelSelTab} selTab={this.state.panelSelTab}/>
                        {this.state.panelSelTab.id==0&&(
                            <>
                                <div class="header_text" style={{margin:"5px"}}>???????????? ???? ??????????</div>
                                <div style={{width:"min-content", display:'inline-table', marginLeft:"1px" }} >
                                    <TableComponent height={320} columns={this.state.tableHeaders} rows={this.state.tableList} setNewTableList={this.setTableList}  tableSettings={this.state.tableSettings} onSelect={this.setSelectedItem}/>
                                </div>
                                {this.state.good==undefined
                                ?<div>???????????????? ?????????? ???? ??????????</div>
                                :<>
                                    <div style={{width:500+"px", margin:"5px"}}>
                                        <div class="low_text bold">??????????:&nbsp;<label class="normal">{this.state.good}</label></div>
                                        <div class="low_text bold">Id&nbsp;????????????:&nbsp;<label class="normal">{this.state.id}</label></div>
                                        <div class="low_text bold">??????????????????:&nbsp;<label class="normal">{this.state.category}</label></div>
                                        <div class="low_text bold">????????????????????????:&nbsp;<label class="normal">{this.state.subCategory}</label></div>
                                        <div class="low_text bold">????????&nbsp;????&nbsp;????????????&nbsp;<label class="normal">{this.state.cost} ???</label></div>
                                        <div class="low_text bold">??????&nbsp;????&nbsp;????????????:&nbsp;<label class="normal">{this.state.weight} ????</label></div>
                                        <div class="low_text bold">??????-????&nbsp;????????????:&nbsp;</div><div class="low_text normal">{this.state.goodCharacteristics}</div>
                                    </div>
                                </>
                                }
                                
                            </>
                        )}
                        {this.state.panelSelTab.id==1&&(
                            <>
                                <div class="header_text" style={{margin:"5px"}}>??????????&nbsp;????????????</div>
                                <div style={{width:400+"px", margin:"5px"}}>
                                    <InputText styles = "row_with_item_equal" label="????????????????&nbsp;????????????&nbsp;" placeholder="???????????????? ????????????" defValue={this.state.goodSearchTerm} set={this.setGoodSearchTerm}/> 
                                    <InputText styles = "row_with_item_equal" label="id&nbsp;????????????&nbsp;" placeholder="id ????????????" defValue={this.state.idSearchTerm} set={this.setIdSearchTerm} mask={/^[-0-9]{0,10}$/i} maskExample="???????? ????????????"/> 
                                    <div class="low_text row_with_item_equal"><div>??????????????????&nbsp;</div><ExpandListInput width={300} defValue={this.state.categoryExpandList[0]} list={this.state.categoryExpandList} func={this.setCategorySearchTerm}/></div>
                                    <div class="low_text row_with_item_equal"><div>????????????????????????&nbsp;</div><ExpandListInput width={300} defValue={this.state.subCategoryExpandList[0]} list={this.state.subCategoryExpandList} func={this.setSubCategorySearchTerm}/></div>
                                    <div style={{width:"min-content", display:'inline-table', marginLeft:"-4px" }} >
                                        <TableComponent height={588} columns={this.state.tableHeaders1} rows={this.state.tableList1} setNewTableList={this.setTableList1}  tableSettings={this.state.tableSettings1} onSelect={this.setSelectedItem1}/>
                                    </div>
                                </div>
                            </>
                        )}
                        
                    </SideBlock>
                </div>

                {/* <DropdownListWithModels setModel={setModel}/> */}
                
        </>
        )
    }
}

export default StorekeeperVirtualWarehouse