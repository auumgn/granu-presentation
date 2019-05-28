import * as THREE from 'three-full';
import '../css/style.css';
import '../css/nouislider.css';
var dat = require('dat.gui');
var TWEEN = require('@tweenjs/tween.js');
const scrollbar = document.getElementById('scrollbar');
const noUiSlider = require('nouislider');
const TextSprite = require('three.textsprite');
var WEBGL = require('./webGL');
if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var a;
var sprite, sprite2, sprite3, sprite0;
var copyPass;
var root, root2;
var group, group2;
var materialShader,materialTwoShader, materialThreeShader, materialTwo, materialThree, material3;

var container;
var particlesData = [];
var camera, scene, renderer, renderer2, composer;
var params = {
    enable: true
};
var positions, colors;
var particles;
var pointCloud;
var particlePositions;
var linesMesh;
var help;
var maxParticleCount = 1000;
var particleCount = 250;
var r = 500;
var boxLeaving = 3;
var rHalf = r / 2;
var mouse = {x:0,y:0};
var INTERSECTED;
var object2;
var mouseVar;
var effectController = {
    showDots: false,
    showLines: true,
    box: true,    
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500,
    boxLeaving: 3,
    multZ: 31.,
    offZ: 67,
    multY: 6.,
    offY: 24,
    multX:4,
    offX: 40,
    rotateX: 8.,
    rotateY: 40.,
    rotateZ: 23.,
    posX: 39639,
    posZ: -2458,
    posY : -9172,
    multZ2: 31.,
    offZ2: 67,
    multY2: 6.,
    offY2: 24,
    multX2: 5.5,
    offX2: 30,
    rotateX2: 8.,
    rotateY2: 6.,
    rotateZ2: 23.,
    posX2: -3878,
    posZ2: -974,
    posY2 : -9452,
};

var fxList = {
    minDistance: 1,
    particleCount: 250,
    leaveRange: 0,
    box: false
}

const chkbox = document.getElementById("AA");

function initGUI() {
    var gui = new dat.GUI();
    gui.add( effectController, "showDots" ).onChange( function ( value ) {
        pointCloud.visible = value;
    } );
    gui.add( effectController, "showLines" ).onChange( function ( value ) {
        linesMesh.visible = value;
    } );
    gui.add( effectController, "multZ", 0, 40 );
    gui.add( effectController, "offZ", 0, 100, 1 );
    gui.add( effectController, "multY", 0, 40 );
    gui.add( effectController, "offY", 0, 100, 1 );
    gui.add( effectController, "multX", 0, 40 );
    gui.add( effectController, "offX", 0, 100, 1 );
    gui.add( effectController, "rotateX", 0., 40., 1 );
    gui.add( effectController, "rotateY", 0., 40., 1 );
    gui.add( effectController, "rotateZ", 0., 40., 1 );
    gui.add( effectController, "posX", -5000., 5000., 1 );
    gui.add( effectController, "posZ", -15000., 3000., 1 );
    gui.add( effectController, "posY", -9500., -7500., 1 );
    gui.add( effectController, "multZ2", 0, 40 );
    gui.add( effectController, "offZ2", 0, 100, 1 );
    gui.add( effectController, "multY2", 0, 40 );
    gui.add( effectController, "offY2", 0, 100, 1 );
    gui.add( effectController, "multX2", 0, 40 );
    gui.add( effectController, "offX2", 0, 100, 1 );
    gui.add( effectController, "rotateX2", 0., 40., 1 );
    gui.add( effectController, "rotateY2", 30., 100., 1 );
    gui.add( effectController, "rotateZ2", 0., 40., 1 );
    gui.add( effectController, "posX2", -5000., 5000., 1 );
    gui.add( effectController, "posZ2", -15000., 3000., 1 );
    gui.add( effectController, "posY2", -9500., -7500., 1 );
    gui.add( effectController, "limitConnections" );
    gui.add( effectController, "maxConnections", 0, 30, 1 );
    gui.add( effectController, "particleCount", 0, maxParticleCount, 1 ).onChange( function ( value ) {
       // console.log(particleCount);
       // particleCount = parseInt( value );
       // particles.setDrawRange( 0, particleCount );
        
    } );
    gui.add( effectController, "boxLeaving", 2, 3, 1 );    
    gui.add( effectController, "box");
}

var wireLines1, wireLines2;
var t = document.getElementById('test');
var t2 = document.getElementById('test2');
let ts;


/*var tweenScroll = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    .to(2500, 2) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(function() { // Called after tween.js updates 'coords'.
       
        if (scroll > 0){
            if (scrollbar.noUiSlider.get() < 8400) {
                let z = Number(scrollbar.noUiSlider.get()) + 200;
                scrollbar.noUiSlider.set(z);
            }       
            else {
                scrollbar.noUiSlider.set(8400);
            } 
        }
        else if (scroll < 0) { 
            if (scrollbar.noUiSlider.get() > 0) {
              
                let z = Number(scrollbar.noUiSlider.get()) - 200;
                scrollbar.noUiSlider.set(z);
            }       
            else {
                scrollbar.noUiSlider.set(0);
            } 
            
        }
        
    })*/


init();
animate();
noUiSlider.create(scrollbar, {
    orientation: "vertical",
    range: {
        min: 0,
        max: 8400
    },    
    start: [0],

});
scrollbar.noUiSlider.on('update', function (value) {
    camera.position.y = -value;
    
})


function init() {
    container = document.body;
    /////////////////
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    
    //
 //  initGUI();
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight , 100, 20000 );
    camera.position.z = 1750;
    scene = new THREE.Scene();
    group = new THREE.Group();
    scene.add( group );
  //  group.scale.multiplyScalar(2);
    var listener = new THREE.AudioListener();
    camera.add(listener);
    var audioLoader = new THREE.AudioLoader();
    var sound1 = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/1.mp3', function ( buffer ) {
        sound1.setBuffer( buffer );
        sound1.setRefDistance( 2 );
        sound1.setMaxDistance(8000);
        sound1.setDistanceModel("linear");
        sound1.setLoop(true);
        sound1.setVolume(0.7);
      //  sound1.play();
    } );

    var sound2 = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/spek.mp3', function ( buffer ) {
        sound2.setBuffer( buffer );
        sound2.setRefDistance( 2 );
        sound2.setMaxDistance(8000);
        sound2.setDistanceModel("linear");
        sound2.setLoop(true);
      //  sound2.play();
        
    } );


    var sound3 = new THREE.PositionalAudio( listener );
    audioLoader.load( 'sounds/bimb.mp3', function ( buffer ) {
        sound3.setBuffer( buffer );
        sound3.setRefDistance( 2 );
        sound3.setMaxDistance(8000);
        sound3.setDistanceModel("linear");
        sound3.setLoop(true);
        
    } );

    /**
     * 
     *     TEXT SPRITES
     * 
     */

    sprite0 = new TextSprite({
        textSize: 120,
        texture: {
            text: "granu is a three-track granular workstation \n built in Max, using Nobuyasu Sakonda's \n sugarSynth engine.",
            fontFamily: 'Arial',
        },
        material: {color: 0xffffff},
        redrawInterval: 250,
    });
    sprite0.position.set(0,1100,-2000);
    scene.add(sprite0);

    sprite = new TextSprite({
        textSize: 120,
        texture: {
            text: "granu is a three-track granular workstation built in \n        Max, using Nobuyasu Sakonda's sugarSynth engine.",
            fontFamily: 'Arial',
        },
        material: {color: 0xffffff},
        redrawInterval: 250,
    });
    
    sprite.position.set(-1200,1100,-2000);
    scene.add(sprite);
    sprite2 = new TextSprite({
        textSize: 70,
        texture: {
            text: "main features:  \n preset step sequencer with its own preset system \n ADSR support for pitch and preset modes \n4 band parametric EQ plus HPF and LPF\n preset system with key mapping \n record audio onto any track\n MIDI parameter mapping \n  grain position & EQ LFOs \n save and load projects \n 2 octave pitch system  \n [coming soon] limiter",
            fontFamily: 'Arial',
        },
        material: {color: 0xffffff},
        redrawInterval: 250,
    });
    sprite2.position.set(0,-2500,-2000);
    scene.add(sprite2);
    sprite3 = new TextSprite({
        textSize: 70,
        texture: {
            text: "generate complex and dynamic soundscapes\n arrange sequences for live performances \nrehash old / unused ideas into new sounds\n make things sound weird",
            fontFamily: 'Arial',
        },
        material: {color: 0xffffff},
        redrawInterval: 250,
    });
    sprite3.position.set(0,-7200,-2000);
    scene.add(sprite3);


        /**
     * 
     *     BOX
     * 
     */
   // group.rotation.x = 50;
    group.rotation.y = 0.75;
    group.rotation.x = 0.25;
    group.rotation.z = 0.15;
    group.position.set(600,0,0);
    var helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxBufferGeometry( r, r, r ) ) );
    helper.add(sound1);
    help = new THREE.Mesh( new THREE.BoxBufferGeometry( r, r, r ) );
    help.material.visible = false;
    group.add(help);
    helper.material.color.setHex( 0x080808 );
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = false;
    group.add( helper );
    var segments = maxParticleCount * maxParticleCount;
    positions = new Float32Array( segments * 3 );
    colors = new Float32Array( segments * 3 );
    var pMaterial = new THREE.PointsMaterial( {
        color: 0xFFFFFF,
        size: 3,
        blending: THREE.AdditiveBlending,
        transparent: false,
        sizeAttenuation: false
    } );
    particles = new THREE.BufferGeometry();
    particlePositions = new Float32Array( maxParticleCount * 3 );
    for ( var i = 0; i < maxParticleCount; i ++ ) {
        var x = Math.random() * r - r / 2;
        var y = Math.random() * r - r / 2;
        var z = Math.random() * r - r / 2;
        particlePositions[ i * 3 ] = x;
        particlePositions[ i * 3 + 1 ] = y;
        particlePositions[ i * 3 + 2 ] = z;
        // add it to the geometry
        particlesData.push( {
            velocity: new THREE.Vector3( - 2 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
            numConnections: 0
        } );
    }
    particles.setDrawRange( 0, particleCount );
    particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );
    // create the particle system
    pointCloud = new THREE.Points( particles, pMaterial );
    group.add( pointCloud );
    pointCloud.visible = false;
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );
    geometry.computeBoundingSphere();
    geometry.setDrawRange( 0, 0 );
    var material = new THREE.LineBasicMaterial( {
        vertexColors: THREE.VertexColors,
        blending: THREE.AdditiveBlending,
       // transparent: true,
      //  depthTest: false,
    } );
    linesMesh = new THREE.LineSegments( geometry, material );
    linesMesh.linewidth = 4;
    linesMesh.frustumCulled = false;
    group.add( linesMesh );
    var light = new THREE.DirectionalLight( 0xffffff, 0.7 );
    light.position.set(1, 1, 1000 );
    scene.add(light)
        /**
     * 
     *     CUBES NUMBER 1
     * 
     */
    

    var geometry2 = new THREE.BoxBufferGeometry( 20, 15, 20 );
    var material2 = new THREE.MeshNormalMaterial();
    root = new THREE.Mesh( geometry2, material2 );
    
    root.position.x = 1000;
    scene.add( root );   
    root.scale.multiplyScalar(10);
    root.position.x = 2000;
    root.position.z =  0;
    root.position.y = -8500;    
    
    var amount = 100, object, parent = root;
    for ( var i = 0; i < 100; i ++ ) {
        object = new THREE.Mesh( geometry2, material2 );
        object.position.x = 100;
       // object.position.z =  20;
        parent.add( object );
        parent = object;
    }
    parent = root;
    for ( var i = 0; i < 100; i ++ ) {
        object = new THREE.Mesh( geometry2, material2 );
        object.position.x =  100;
        //object.position.z = 10;
        parent.add( object );
        parent = object;
        
    }
    parent = root;
    for ( var i = 0; i < 150; i ++ ) {
        object = new THREE.Mesh( geometry2, material2 );
        object.position.y = 120;
        object.position.x = 80;
        parent.add( object );
        parent = object;
    }
    parent = root;
    for ( var i = 0; i < 150; i ++ ) {
        object = new THREE.Mesh( geometry2, material2 );
        object.position.y = 60;
        object.position.x = 40;
        parent.add( object );
        parent = object;
    }
    parent = root;
    for ( var i = 0; i < 50; i ++ ) {
        object = new THREE.Mesh( geometry2, material2 );
        object.position.z = 100;
        parent.add( object );
        parent = object;
    }
    parent = root;
    for ( var i = 0; i < 50; i ++ ) {
        object = new THREE.Mesh( geometry2, material2 );
        object.position.z = 50;
        parent.add( object );
        parent = object;
    }



    var material = new THREE.MeshToonMaterial();
    material.needsUpdate = true;
    
        material.onBeforeCompile = function ( shader ) {
            shader.uniforms.time = { value: 0 };
            shader.uniforms.speed = { value: 0.15};
            shader.vertexShader = 'uniform float time;\n uniform float speed;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                [
                    'float theta = sin( time + position.y ) / speed;',
                    'float c = cos( theta );',
                    'float s = sin( theta );',
                    'mat3 m = mat3( c, 0, s, 0, 1, 0.5, -s, 0.5, c );',
                    'vec3 transformed = vec3( position ) * m;',
                    'vNormal = vNormal * m;'
                ].join( '\n' )
            );
            materialShader = shader;
            material.wireframe = true;
            material.transparent = true;
            material.polygonOffsetFactor = 0;
            material.depthTest = false;
            material.opacity = 0.1;
            
            };
    materialTwo = new THREE.MeshToonMaterial();
    materialTwo.needsUpdate = true;
    
        
    materialTwo.onBeforeCompile = function ( shader ) {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.speed = { value: 0.2};
        shader.vertexShader = 'uniform float time;\n uniform float speed;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            [
                `float theta = sin( time + position.y  + position.z) / speed;`,
                'float c = cos( theta );',
                'float s = sin( theta );',
                'mat3 m = mat3( c, 0, s, 0, 1, 0., -s, 0., c );',
                'vec3 transformed = vec3( position ) * m;',
                'vNormal = vNormal * m;'
            ].join( '\n' )
        );
        materialTwoShader = shader;
        materialTwo.wireframe = true;
        materialTwo.transparent = true;
        materialTwo.polygonOffsetFactor = 0;
        materialTwo.depthTest = false;
        materialTwo.opacity = 0.1;
        
        };
    materialThree = new THREE.MeshToonMaterial();
    materialThree.needsUpdate = true;
    materialThree.onBeforeCompile = function ( shader ) {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.speed = { value: 0.2};
        shader.vertexShader = 'uniform float time;\n uniform float speed;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            [
                `float theta = sin( time + position.x ) / speed;`,
                'float c = cos( theta );',
                'float s = sin( theta );',
                'mat3 m = mat3( c, 0, s, 0, 1, 0., -s, 0., c );',
                'vec3 transformed = vec3( position ) * m;',
                'vNormal = vNormal * m;'
            ].join( '\n' )
        );
        materialThreeShader = shader;
        materialThree.wireframe = true;
        materialThree.transparent = true;
        materialThree.polygonOffsetFactor = 0;
        materialThree.depthTest = false;
        materialThree.opacity = 0.1;
        
        
        };
    var loader = new THREE.GLTFLoader();
    loader.load( './src/models/LeePerrySmith.glb', function ( gltf ) {
        var mesh = new THREE.Mesh( gltf.scene.children[ 0 ].geometry, material );
        mesh.add(sound2);
        
        var mesh2 = new THREE.Mesh(  gltf.scene.children[ 0 ].geometry, materialTwo );
        var mesh3 = new THREE.Mesh(  gltf.scene.children[ 0 ].geometry, materialThree  );
        group2 = new THREE.Group();
        
        group2.scale.multiplyScalar( 300 );
        scene.add( group2 );
        group2.updateMatrixWorld( true );
        mesh.position.y = -5;
        group2.add( mesh );
        
        mesh2.position.x = 5;
        mesh2.rotateX(-1.45);
        group2.add( mesh2 );
        mesh3.position.x = -5;
        group2.add( mesh3 );
        group2.children[2].rotation.x = -1.55;
        group2.children[2].rotation.z = 0;
        group2.children[2].rotation.y = 0;
        group2.children[2].position.z = 0;
        group2.position.y = -3000;
        group2.position.z = -2500;
        group2.rotation.x = 0;
      
    });

    
    /**
     * 
     *  CUBES 2
     * 
     */
    
    var geometry3 = new THREE.BoxBufferGeometry( 20, 15, 20 );
    material3 = new THREE.MeshNormalMaterial();
    root2 = new THREE.Mesh( geometry3, material3 );
    root2.add(sound3);
    sound3.play();
    var parento = root2;
    scene.add(root2);   
    root2.scale.multiplyScalar(10);
    root2.position.x = 0;
    root2.position.z =  0;
    root2.position.y = -8500;    
    for ( var i = 0; i < 100; i ++ ) {
        object2 = new THREE.Mesh( geometry3, material3 );
       // object.position.x = 150;
        object.position.z =  20;
        parento.add( object2 );
        parento = object2;
    }
    parento = root2;
    for ( var i = 0; i < 100; i ++ ) {
        object2 = new THREE.Mesh( geometry3, material3 );
        object2.position.x =  75;
        object2.position.z = 10;
        parento.add( object2 );
        parento = object2;
        
    }
    parento = root2;
    for ( var i = 0; i < 150; i ++ ) {
        object2 = new THREE.Mesh( geometry3, material3 );
        object2.position.y =120;
        object2.position.x = 80;
        parento.add( object2 );
        parento = object2;
    }
    parento = root2;
    for ( var i = 0; i < 150; i ++ ) {
        object2 = new THREE.Mesh( geometry3, material3 );
        object2.position.y = 60;
        object2.position.x = 40;
        parento.add( object2 );
        parento = object2;
    }
    parento = root2;
    for ( var i = 0; i < 100; i ++ ) {
        object2 = new THREE.Mesh( geometry3, material3 );
        object2.position.z = 100;
        parento.add( object2 );
        parento = object2;
    }
    parento = root2;
    for ( var i = 0; i < 100; i ++ ) {
        object2 = new THREE.Mesh( geometry3, material3 );
        object2.position.z = 50;
        parento.add( object2 );
        parento = object2;
    }
  //  AnimateCube();
    var fx = {minDistance:10, leaveRange:0, particleCount:250};
    var targetFx = {minDistance:150, leaveRange:400};
    var tween1 = new TWEEN.Tween(fx) // Create a new tween that modifies 'coords'.
    .to({minDistance:150}, 20000) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Sinusoidal.InOut) // Use an easing function to make the animation smooth.
    .onUpdate(function() { // Called after tween.js updates 'coords'.
        // Move 'box' to the position described by 'coords' with a CSS translation.
        fxList.minDistance = fx.minDistance;

        
        
    }).start()
    

    var tween2 = new TWEEN.Tween(fx)
    .to({leaveRange: 350, minDistance: 160}, 15000)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .onUpdate(() => {
        fxList.leaveRange = fx.leaveRange;
        fxList.minDistance = fx.minDistance;
    })

    var tween3 = new TWEEN.Tween(fx)
    .to({leaveRange: -400, minDistance: 15}, 1500)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onUpdate(() => {
        fxList.box = true;
        fxList.leaveRange = fx.leaveRange;
        fxList.minDistance = fx.minDistance;
    })

    var tween4 = new TWEEN.Tween(fx)
    .to({particleCount: 0}, 1500)
    .onUpdate(() => {
         
        particleCount = fx.particleCount;
        particles.setDrawRange( 0, fx.particleCount );
    })
    .onComplete( () => {
        fxList.box = false;
        fx.leaveRange = 0; 
        fxList.leaveRange = 0;
        fxList.minDistance = 40;
        fx.minDistance = 40;
    })

    var tween5 = new TWEEN.Tween(fx)
    .to({particleCount: 250}, 10000)
    .onUpdate(() => {
        particleCount = fx.particleCount;
        particles.setDrawRange( 0, fx.particleCount );
    }).delay(2000)
    
    tween1.chain(tween2);
    tween2.chain(tween3);
    tween3.chain(tween4);
    tween4.chain(tween5);
    tween5.chain(tween1);


    composer = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight) );
    copyPass = new THREE.ShaderPass( THREE.CopyShader );
    copyPass.renderToScreen = true; 
    composer.addPass( copyPass );

    composer.addPass( new THREE.RenderPass( scene, camera ) );
    
    composer.setSize( window.innerWidth, window.innerHeight );
    
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener( 'resize', onWindowResize, false );
    document.body.addEventListener("wheel", MouseWheelHandler, false);
    document.body.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    //document.body.addEventListener('touchstart', touchStartHandler);
    renderer.domElement.addEventListener('touchstart', (e) => { 
        ts = e.touches[0].clientY;
    }, false);
    renderer.domElement.addEventListener('touchmove', (e) => {
        mouse.x = (e.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
    });
   /* renderer.domElement.addEventListener('touchmove', (e) => {
        var te = e.changedTouches[0].clientY;
        if (ts > te) {
            let obj = {deltaY: ts*2};
            MouseWheelHandler(obj);
        } else {
            let obj = {deltaY: -ts*2};
            MouseWheelHandler(obj);
        }
        
    })*/
    if (camera.aspect < 1 && window.innerWidth < 1000) {
        chkbox.checked = true;
    }
    else {
        chkbox.checked = false;
    }
}


    


function MouseWheelHandler(e) {
    var coords = 0;
    var scroll = e.deltaY ;
    var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    .to(2500, 2) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(function() { // Called after tween.js updates 'coords'.
       
        if (scroll > 0){
            if (scrollbar.noUiSlider.get() < 8400) {
                let z = Number(scrollbar.noUiSlider.get()) + 200;
                scrollbar.noUiSlider.set(z);
            }       
            else {
                scrollbar.noUiSlider.set(8400);
            } 
        }
        else if (scroll < 0) { 
            if (scrollbar.noUiSlider.get() > 0) {
              
                let z = Number(scrollbar.noUiSlider.get()) - 200;
                scrollbar.noUiSlider.set(z);
            }       
            else {
                scrollbar.noUiSlider.set(0);
            } 
            
        }
        
    })
    .start();
	return false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.updateProjectionMatrix();
    composer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function animate() {
    var vertexpos = 0;
    var test = document.getElementById('testbox');
    var colorpos = 0;
    var numConnected = 0;    
    
    for ( var i = 0; i < particleCount; i ++ )
        particlesData[ i ].numConnections = 0;
        
    for ( var i = 0; i < particleCount; i ++ ) {
        var particleData = particlesData[ i ];
        if (fxList.box) {
            particlePositions[ i * 3 ] /= 1.05;
            particlePositions[ i * 3 + 1 ] /= 1.05;
            particlePositions[ i * 3 + 2 ] /= 1.05;
        }
       
            particlePositions[ i * 3 ] -= particleData.velocity.x;
        
            particlePositions[ i * 3 + 1 ] -= particleData.velocity.y;
            
            particlePositions[ i * 3 + 2 ] -= particleData.velocity.z;
        
        if ( particlePositions[ i * 3 + 1 ] < - rHalf - fxList.leaveRange || particlePositions[ i * effectController.boxLeaving + 1 ] > rHalf + fxList.leaveRange )
            particleData.velocity.y = - particleData.velocity.y;
           
            
        if ( particlePositions[ i * 3 ] < - rHalf - fxList.leaveRange || particlePositions[ i *effectController.boxLeaving ] > rHalf +fxList.leaveRange )
        
            particleData.velocity.x = - particleData.velocity.x;
            
        if ( particlePositions[ i * 3 + 2 ] < - rHalf - fxList.leaveRange || particlePositions[ i * effectController.boxLeaving + 2 ] > rHalf + fxList.leaveRange )
        
            particleData.velocity.z = - particleData.velocity.z;
            
        if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
            continue;
        // Check collision
        for ( var j = i + 1; j < particleCount; j ++ ) {
            var particleDataB = particlesData[ j ];
            if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
                continue;
            var dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ];
            var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
            var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
            var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );
            if ( dist < fxList.minDistance ) {
                particleData.numConnections ++;
                particleDataB.numConnections ++;
                var alpha = 1.0 - dist / fxList.minDistance;
                positions[ vertexpos ++ ] = particlePositions[ i * 3 ];
                positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ];
                positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ];
                positions[ vertexpos ++ ] = particlePositions[ j * 3 ];
                positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ];
                positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ];
                colors[ colorpos ++ ] = alpha;
                colors[ colorpos ++ ] = alpha;
                colors[ colorpos ++ ] = alpha;
                colors[ colorpos ++ ] = alpha;
                colors[ colorpos ++ ] = alpha;
                colors[ colorpos ++ ] = alpha;
                numConnected ++;
            }
        }
    }
    linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;
    pointCloud.geometry.attributes.position.needsUpdate = true;
    pointCloud.geometry.boundingBox = null;
    linesMesh.geometry.boundingBox = null;
    
    if ( !chkbox.checked ) {
          composer.render(0.01);
      } else {
          renderer.render( scene, camera );
      }
    requestAnimationFrame( animate ); 
    update();
    render();
    
}
let tgl1 = false, tgl2 = false, tgl3 = false;
function tweensOne(e) {
    if (materialShader) {
        let speed = {speed:materialShader.uniforms.speed.value};
        var headOn = new TWEEN.Tween(speed)
        .to({speed: 2.5}, 1000)
   //     .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(() => {
                tgl1 = true;
                materialShader.uniforms.speed.value = speed.speed;
        })

        var headOff = new TWEEN.Tween(speed)
        .to({speed: 0.2}, 400)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(() => {        
                tgl1 = false;
                materialShader.uniforms.speed.value = speed.speed;        
        })

        if (e == "on" && !tgl1) {
            headOn.start()
        }
        if (e == "off" && tgl1) {
            headOff.start()
        }
    }
}
function tweensTwo(e) {
    if (materialShader) {
        let speed = {speed:materialTwoShader.uniforms.speed.value, rot:group2.children[1].rotation.x, posZ : 0, posx: 5};
        var headOn = new TWEEN.Tween(speed)
        .to({speed: 0.45, rot:-1.45, posZ: 4, posx: 3}, 300)
        .easing(TWEEN.Easing.Bounce.InOut)
        .onUpdate(() => {
                tgl2 = true;
                materialTwoShader.uniforms.speed.value = speed.speed;
                group2.children[1].rotation.x = speed.rot;
        })

        var headOff = new TWEEN.Tween(speed)
        .to({speed: 0.2, rot:0}, 500)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(() => {
            tgl2 = false;
                materialTwoShader.uniforms.speed.value = speed.speed;
        })

        if (e == "on" && !tgl2) {
            headOn.start()
        }
        if (e == "off" && tgl2) {
            headOff.start()
        }
    }
}
function tweensThree(e) {
    if (materialShader) {
        let speed = {speed:materialThreeShader.uniforms.speed.value};
        var headOn = new TWEEN.Tween(speed)
        .to({speed: 0.4}, 1000)
        .easing(TWEEN.Easing.Bounce.InOut)
        .onUpdate(() => {
                tgl3 = true;
                materialThreeShader.uniforms.speed.value = speed.speed;
        })

        var headOff = new TWEEN.Tween(speed)
        .to({speed: 0.2}, 1000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(() => {
                tgl3 = false;
                materialThreeShader.uniforms.speed.value = speed.speed;
        })

        if (e == "on" && !tgl3) {
            headOn.start()
        }
        if (e == "off" && tgl3) {
            headOff.start()
        }
    }
}
function update() {
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    vector.unproject(camera);
    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    if (scene.children[8]) {
        var objs = [];
        objs.push(help);
        if (scene.children[8].children) {
            
            objs.push(scene.children[8]);
        }
        
        var intersects = ray.intersectObjects(objs, true);
        if (intersects.length > 0) {
            if (help == INTERSECTED) {
                group.children[1].material.color.setHex(0xffffff);
            }
            if (scene.children[8].children[0] == INTERSECTED) {
                tweensOne("on");
                tweensTwo("off");
                tweensThree("off");
            }
            if (scene.children[8].children[1] == INTERSECTED) {
                tweensTwo("on");
                tweensOne("off");
                tweensThree("off");
            }
            if (scene.children[8].children[2] == INTERSECTED) {
                tweensThree("on");
                tweensOne("off");
                tweensTwo("off");
            }
            if (intersects[0].object != INTERSECTED) {
            if (INTERSECTED)
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            }
        } else // there are no intersections
        {
            group.children[1].material.color.setHex(0x080808);
            if (INTERSECTED) {
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            }
            INTERSECTED = null;
            tweensOne("off");
                tweensTwo("off");
                tweensThree("off");
        }
    }
    
}

var trav = 0;
function render() {
    TWEEN.update();
    var time = Date.now() * 0.0004;

    trav = ((mouse.x * 0.5) * 1 * (mouse.y * 0.8));
    var rx = (Math.sin(time* 0.1) + (effectController.offX / 10.) ) * (effectController.multX / 10.) + 0.2;    
    var ry = (Math.sin(time* 0.1 ) + (effectController.offY / 10.) ) * (effectController.multY / 10.);                
    var rz = (Math.sin(time* 0.1 ) + (effectController.offZ / 10.)) / (effectController.multZ / 10.);
    var rr = (Math.sin(time *0.1) + 1) * 1.5 + 5 + trav;
    var zz = (Math.sin(time *0.1) + 1) * 1.5 + 4 + trav;
    var yy = (-Math.sin(time * 0.1) + 1) * 2.33 + 3 + trav;  
    var z1 = -((Math.sin(time * 0.1) + 1) * 654 + 1150 + trav);           
    root.traverse( function ( object ) {
            object.rotation.x = rx;
            object.rotation.y = ry ;
            object.rotation.z = rz  ;
        } );

    root.rotation.x = rr / 10;
    root.rotation.z = zz / 10.;
    group.rotation.y = time * 0.25;
    group.rotation.x = time * 0.25;
    group.rotation.z = time * 0.25;
    root.rotation.y = effectController.rotateY / 10.;
    root.position.z = z1;  

    if (materialTwo) {
        
        var hue1 = (Math.sin(time * 0.45) + 1) / 2.;
        var hue2 = (Math.sin(time * 0.5) + 1) / 2.;
        materialTwo.color.setHSL(hue1, 1.0, 0.2);
        materialThree.color.setHSL(hue2, 0.5, 0.6);
    }
    if ( materialShader ) {        
        materialShader.uniforms.time.value = performance.now() / 2000;
        materialTwoShader.uniforms.time.value = performance.now() / 10000;
        materialThreeShader.uniforms.time.value = performance.now() / 10000;
    }

    if (group2) {
        group2.needsUpdate = true;
        if (group2.children){
            group2.children[0].rotation.y = mouse.x * 2;
            group2.children[2].rotation.y = mouse.y * 3;
            group2.children[1].position.z = mouse.y * 1.5;
            group2.children[2].position.z = mouse.x * 1.5;
        }       
    }
    if (root2) {
        root2.traverse( function ( object2 ) {
            object2.rotation.x = rx;
            object2.rotation.y = ry;
            object2.rotation.z = rz;
        });
    }
    root2.rotation.x = rr / 10;
    root2.rotation.z = zz / 10.;
    root2.rotation.y = yy / 10.;

    root.position.y = (-(mouse.y - 2) * 100) - 9200;
    root.position.x = (-(mouse.x - 2) * 100) + 3200;
    root2.position.x = ((mouse.x + 2) * 100) - 4500;
    root2.position.y = ((mouse.y + 2) * 100) - 9500;

    root2.position.z = effectController.posZ2;
   // params.enable =  effectController.box;
    if (camera.aspect > 1.64 ) {
        if (window.innerWidth > 1400) {
            sprite2.textSize = 70;
            sprite3.textSize = 70;
        } else {
            sprite2.textSize = 85;
            sprite3.textSize = 85;
        }
        sprite0.visible = false;
        sprite.visible = true;
        group.position.set(600,0,0);
    } else if (camera.aspect < 1.65) {
        sprite0.visible = true;
        sprite.visible = false;
        group.position.set(0,-100,0);
        if (window.innerWidth > 1400) {
            sprite2.textSize = 70;
            sprite3.textSize = 70;
        } else {
            sprite2.textSize = 100;
            sprite3.textSize = 100;
        }
    } 
    if (camera.aspect < 1 && window.innerWidth < 1000) {
       if (group2) {
           group2.children[1].visible = false;
           group2.children[2].visible = false;
           sprite0.textSize = 100;
           sprite2.textSize = 85;
           sprite3.textsize = 80;
       }
    }
    else {
        if (group2) {
            group2.children[1].visible = true;
            group2.children[2].visible = true;
            sprite0.textSize = 120;
        }
    }
}
