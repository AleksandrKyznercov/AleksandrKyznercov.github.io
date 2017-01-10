//COLORS
var Colors = {
    black:0x000000,
    rez:0x232420,
    grey:0x4f4f4f,
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x505050,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    green: 0x556B2F,
    pesoch: 0x9c7130,
    white2:0xFFFFFF,
};

// GAME VARIABLES
var game = {speed:50,
        initSpeed:.00035,
        baseSpeed:.00035,
        targetBaseSpeed:.00035,
        incrementSpeedByTime:.0000025,
        incrementSpeedByLevel:.000005,
        distanceForSpeedUpdate:100,
        speedLastUpdate:0,
        maxSpeed:100,

        distance:0,
        ratioSpeedDistance:50,
        energy:100,
        ratioSpeedEnergy:3,

        level:1,
        levelLastUpdate:0,
        distanceForLevelUpdate:1000,

        planeDefaultHeight:50,
        planeAmpHeight:80,
        planeAmpWidth:75,
        planeMoveSensivity:0.005,
        planeRotXSensivity:0.0008,
        planeRotZSensivity:0.0004,
        planeFallSpeed:.001,
        planeMinSpeed:1.2,
        planeMaxSpeed:1.6,
        planeSpeed:0,
        planeCollisionDisplacementX:0,
        planeCollisionSpeedX:0,

        planeCollisionDisplacementY:0,
        planeCollisionSpeedY:0,

        seaRadius:600,
        seaLength:800,
        //seaRotationSpeed:0.006,
        wavesMinAmp : 5,
        wavesMaxAmp : 20,
        wavesMinSpeed : 0.001,
        wavesMaxSpeed : 0.003,

        cameraFarPos:500,
        cameraNearPos:150,
        cameraSensivity:0.002,

        coinDistanceTolerance:15,
        coinValue:3,
        coinsSpeed:.5,
        coinLastSpawn:0,
        distanceForCoinsSpawn:100,

        lineDistanceTolerance:100,
        ennemyValue:10,
        ennemiesSpeed:.6,
        lineLastSpawn:0,
        distanceForLinesSpawn:40,

        mineDistanceTolerance:100,
        mineLastSpawn:0,
        distanceForMineSpawn:200,


        status : "starting",
       };

var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var whiteLinesPool = [];
var targetY_global;
var targetX_global;
// THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;


//MUSIC

var soundEngStart = new Audio(); // Создаём новый элемент Audio
  soundEngStart.src = 'sound/int-uaz-start.wav'; // Указываем путь к звуку "клика"
  soundEngStart.volume = 0.1;
  soundEngStart.autoplay = true; // Автоматически запускаем

var soundEngineLow = new Audio(); // Создаём новый элемент Audio
  soundEngineLow.src = 'sound/int-uaz-engine-low.wav'; // Указываем путь к звуку "клика"
  soundEngineLow.volume = 0.1;
  soundEngineLow.loop = true;

var soundEngineHigh = new Audio(); // Создаём новый элемент Audio
  soundEngineHigh.src = 'sound/int-uaz-engine-high.wav'; // Указываем путь к звуку "клика"
  soundEngineHigh.volume = 0.1;
  soundEngineHigh.loop = true;

var engHolost = new Audio(); // Создаём новый элемент Audio
  engHolost.src = 'sound/int-uaz-idle.wav'; // Указываем путь к звуку "клика"
  engHolost.volume = 0.1;
  engHolost.loop = true;

function playGudok() {
  if ((game.status == "playing") && (soundButton.value == "Вкл")){
    var audio = new Audio(); // Создаём новый элемент Audio
    audio.src = 'sound/int-uaz-horn.wav'; // Указываем путь к звуку "клика"
    audio.volume = 0.1;
    audio.autoplay = true;
  }
}

function playMineExplosion() {
  if (soundButton.value == "Вкл"){
    var audio = new Audio(); // Создаём новый элемент Audio
    audio.src = 'sound/mine.mp3'; // Указываем путь к звуку "клика"
    audio.volume = 0.1;
    audio.autoplay = true;
  }
}

function soundMute() {
  if (soundButton.value == "Вкл"){
    soundEngStart.muted = true;
    soundEngineLow.muted = true;
    soundEngineHigh.muted = true;
    engHolost.muted = true;
    soundButton.value = "Выкл";soundButton.innerHTML = "Выкл";
  }else{
    soundEngStart.muted = false;
    soundEngineLow.muted = false;
    soundEngineHigh.muted = false;
    engHolost.muted = false;
    soundButton.value = "Вкл";soundButton.innerHTML = "Вкл";
  }

}

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS


function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );

  //Туман
  scene.fog = new THREE.Fog(0xf7d9aa, 10,10000);

  camera.rotation.x = -.2;
  camera.rotation.y = 2.2;
  camera.position.x = 350;
  camera.position.y = -100;
  camera.position.z = -950;
  /*camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;*/


  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}
function startGame(){
 messageStart.style.display = "block";
}

function resetGame(){
  messageStart.style.display = "none";
  messageGameOver.style.display = "none";
  game.speed=50;
  game.initSpeed=.00035;
  game.baseSpeed=.00035;
  game.targetBaseSpeed=.00035;
  game.incrementSpeedByTime=.0000025;
  game.incrementSpeedByLevel=.000005;
  game.distanceForSpeedUpdate=100;
  game.speedLastUpdate=0;
  game.maxSpeed=100;

  game.distance=0;
  game.ratioSpeedDistance=50;
  game.energy=100;
  game.ratioSpeedEnergy=3;

  game.level=1;
  game.levelLastUpdate=0;
  game.distanceForLevelUpdate=1000;

          /*game.planeDefaultHeight:100;
          game.planeAmpHeight:80;
          game.planeAmpWidth:75;
          game.planeMoveSensivity:0.005;
          game.planeRotXSensivity:0.0008;
          game.planeRotZSensivity:0.0004;
          game.planeFallSpeed:.001;
          game.planeMinSpeed:1.2;
          game.planeMaxSpeed:1.6;
          game.planeSpeed:0;
          game.planeCollisionDisplacementX:0;
          game.planeCollisionSpeedX:0;

          game.planeCollisionDisplacementY:0;
          game.planeCollisionSpeedY:0,

          game.seaRadius:600;
          game.seaLength:800;
          //seaRotationSpeed:0.006,
          game.wavesMinAmp : 5;
          game.wavesMaxAmp : 20;
          game.wavesMinSpeed : 0.001;
          game.wavesMaxSpeed : 0.003;

          game.cameraFarPos:500;
          game.cameraNearPos:150;
          game.cameraSensivity:0.002;

          game.coinDistanceTolerance:15;
          game.coinValue:3;
          game.coinsSpeed:.5;
          game.coinLastSpawn:0;
          game.distanceForCoinsSpawn:100;
game.ennemyDistanceTolerance:10;

          game.ennemyValue:10;
          game.ennemiesSpeed:.6;
          game.ennemyLastSpawn:0;
          game.distanceForEnnemiesSpawn:50;*/
          game.lineLastSpawn = 0;
          game.mineLastSpawn = 0;
  game.status = "playing";

  distanceLabel.innerHTML = game.distance;
  soundEngineLow.play();
  engHolost.pause();
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(100, 350, -200);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -1000;
  shadowLight.shadow.camera.right = 1000;
  shadowLight.shadow.camera.top = 1000;
  shadowLight.shadow.camera.bottom = -1000;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

var AirPlane = function(){
	this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // Create the cabin
	var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
  var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);

  // Create Engine
  var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
	this.mesh.add(engine);

  // Create Tailplane

  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-35,25,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);

  // Create Wing

  var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0,0,0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

  // Propeller

  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  // Blades

  var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});

  var blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8,0,0);
  blade.castShadow = true;
  blade.receiveShadow = true;
	this.propeller.add(blade);
  this.propeller.position.set(50,0,0);
  this.mesh.add(this.propeller);
};

Car = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "Uaz";

  //Кузов
  var geomCuzov = new THREE.BoxGeometry(180,90,280,1,1,1);
  var matCuzov = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  geomCuzov.vertices[2].z -= 10;
  geomCuzov.vertices[7].z -= 10;
  var cuzov = new THREE.Mesh(geomCuzov, matCuzov);
  cuzov.castShadow = true;
  cuzov.receiveShadow = true;
  this.mesh.add(cuzov);

  //Двигатель
  var geomEngine = new THREE.BoxGeometry(180,70,120,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  geomEngine.vertices[3].z += 10;
  geomEngine.vertices[6].z += 10;
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.set(0,-10,-200);
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  //Капот
  var geomEngineСover = new THREE.BoxGeometry(150,20,120,1,1,1);
  var matEngineСover = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  geomEngineСover.vertices[1].x -= 5;
  geomEngineСover.vertices[4].x += 5;
  geomEngineСover.vertices[0].x -= 5;
  geomEngineСover.vertices[5].x += 5;

  geomEngineСover.vertices[0].x += 15;
  geomEngineСover.vertices[2].x += 15;
  geomEngineСover.vertices[5].x -= 15;
  geomEngineСover.vertices[7].x -= 15;
  var engineСover = new THREE.Mesh(geomEngineСover, matEngineСover);
  engineСover.position.set(0,35,-200);
  engineСover.castShadow = true;
  engineСover.receiveShadow = true;
  this.mesh.add(engineСover);

  //Кабина
  var geomKab = new THREE.BoxGeometry(180,70,240,1,1,1);
  var matKab = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
  geomKab.vertices[3].z -= 40;
  geomKab.vertices[6].z -= 40;
  geomKab.vertices[0].z -= 10;
  geomKab.vertices[5].z -= 10;
  var kab = new THREE.Mesh(geomKab, matKab);
  kab.position.set(0,80,20);
  kab.castShadow = true;
  kab.receiveShadow = true;
  this.mesh.add(kab);

  //Стекло

  //Крыша
  var geomRoof = new THREE.BoxGeometry(180,5,230,1,1,1);
  var matRoof = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  geomRoof.vertices[1].z += 40;
  geomRoof.vertices[4].z += 40;
  geomRoof.vertices[0].z -= 10;
  geomRoof.vertices[5].z -= 10;
  geomRoof.vertices[1].x -= 5;
  geomRoof.vertices[4].x += 5;
  geomRoof.vertices[0].x -= 5;
  geomRoof.vertices[5].x += 5;
  var roof = new THREE.Mesh(geomRoof, matRoof);
  roof.position.set(0,118,15);
  roof.castShadow = true;
  roof.receiveShadow = true;
  this.mesh.add(roof);

  //Запасное колесо(резина)
  Wheel = function(){
    this.mesh = new THREE.Object3D();

    var geomWheel = new THREE.TorusGeometry( 40, 10, 40, 10, 360*Math.PI/180 );
      //geomWheel.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    var matWheel = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
    var wheel = new THREE.Mesh(geomWheel, matWheel);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    this.mesh.add(wheel);

    var geomWheel2 = new THREE.CylinderGeometry(35,35,15,60,100);
      geomWheel2.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    var matWheel2 = new THREE.MeshPhongMaterial({color:Colors.white2, shading:THREE.FlatShading});
    var wheel2 = new THREE.Mesh(geomWheel2, matWheel2);
    wheel2.castShadow = true;
    wheel2.receiveShadow = true;
    this.mesh.add(wheel2);
    this.mesh.add(wheel);
  }

  wheel_spare = new Wheel();
  wheel_spare.mesh.position.set(30,30,150);
  this.mesh.add(wheel_spare.mesh);
  // Основные колеса Переднее левое
  wheel1 = new Wheel();
  wheel1.mesh.rotation.y = Math.PI/2;
  wheel1.mesh.position.set(-85,-40,-190);
  this.mesh.add(wheel1.mesh);
  // Основные колеса Переднее правое
  wheel2 = new Wheel();
  wheel2.mesh.rotation.y = Math.PI/2;
  wheel2.mesh.position.set(85,-40,-190);
  this.mesh.add(wheel2.mesh);
  // Основные колеса Заднее левое
  wheel3 = new Wheel();
  wheel3.mesh.rotation.y = Math.PI/2;
  wheel3.mesh.position.set(-85,-40,70);
  this.mesh.add(wheel3.mesh);
  // Основные колеса Заднее правое
  wheel4 = new Wheel();
  wheel4.mesh.rotation.y = Math.PI/2;
  wheel4.mesh.position.set(85,-40,70);
  this.mesh.add(wheel4.mesh);
}

Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = 750 + Math.random()*200;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -400-Math.random()*400;
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Sea = function(){
  var geom = new THREE.CylinderGeometry(600,400,800,40,100);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.blue,
    transparent:true,
    opacity:.6,
    shading:THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Ground = function(){
  var geom = new THREE.BoxGeometry(10000,8,15000,1,1);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.pesoch
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Road = function(){
  var geom = new THREE.BoxGeometry(900,9,15000,1,1);
  var mat = new THREE.MeshStandardMaterial({
    color:Colors.brown
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.CubeGeometry(20,20,20);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,
  });

  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

Text = function(){
  var geom = new THREE.TextGeometry( "Вася",{
  			size:500,
  			height:5,
  			curveSegments: 4,
  			font: "arial",
  			weight:"normal",
  			style:"normal",
  			hover:0,
  			bevelEnabled:false} );
  var mat = new THREE.MeshPhongMaterial({
          color:Colors.white
        });
  //var text_mesh = THREE.SceneUtils.createMultiMaterialObject( text_geometry, obj_material );
    this.mesh = new THREE.Mesh(geom,mat);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
}

Mine = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "Mine";

  var geom = new THREE.CylinderGeometry(15,15,6,40,100);
  var mat = new THREE.MeshPhongMaterial({color:0x384521, shading:THREE.FlatShading});
  var mineBottomPart = new THREE.Mesh(geom, mat);
  mineBottomPart.castShadow = true;
  mineBottomPart.receiveShadow = true;
  this.mesh.add(mineBottomPart);

  var geom = new THREE.CylinderGeometry(8,10,2,40,100);
  var mat = new THREE.MeshPhongMaterial({color:0x384521, shading:THREE.FlatShading});
  var mineTopPart = new THREE.Mesh(geom, mat);
  mineTopPart.position.set(0,4,0);
  mineTopPart.castShadow = true;
  mineTopPart.receiveShadow = true;
  this.mesh.add(mineTopPart);

  var geom = new THREE.CylinderGeometry(5,5,2,40,100);
  var mat = new THREE.MeshPhongMaterial({color:0x1c1c1c, shading:THREE.FlatShading});
  var mineFusePart = new THREE.Mesh(geom, mat);
  mineFusePart.position.set(0,5,0);
  mineFusePart.castShadow = true;
  mineFusePart.receiveShadow = true;
  this.mesh.add(mineFusePart);
}

MinesHolder = function(nMines){
  this.mesh = new THREE.Object3D();
  this.minesInUse = [];
  this.minesPool = [];
  for (var i=0; i<nMines; i++){
    var mine = new Mine();
    this.minesPool.push(mine);
  }
}

MinesHolder.prototype.spawnMines = function(){
    var mine;
    if (this.minesPool.length) {
      mine = this.minesPool.pop();
    }else{
      mine = new Mine();
    }

    mine.mesh.position.y = -192;
    mine.mesh.position.x = Math.random()*(430+430)-430;
    mine.mesh.position.z = -10000;
    mine.mesh.scale.set(1.5,1.5,1.5);
    this.mesh.add(mine.mesh);
    this.minesInUse.push(mine);
}

MinesHolder.prototype.rotateMines = function(){
  for (var i=0; i<this.minesInUse.length; i++){
    var mine = this.minesInUse[i];

      mine.mesh.position.z += game.speed;

    //console.log(this.ennemiesInUse.length);
    if (mine.mesh.position.z > 0) {
      //this.ennemiesInUse.splice(i,1)[0];
      this.minesPool.unshift(this.minesInUse.splice(i,1)[0]);
      this.mesh.remove(mine.mesh);
      i--;
    }
    /*ennemy.angle += game.speed*deltaTime*game.ennemiesSpeed;

    if (ennemy.angle > Math.PI*2) ennemy.angle -= Math.PI*2;

    ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.distance;
    ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.distance;
    ennemy.mesh.rotation.z += Math.random()*.1;
    ennemy.mesh.rotation.y += Math.random()*.1;*/

    //var globalEnnemyPosition =  ennemy.mesh.localToWorld(new THREE.Vector3());
    // РАБОТАЕТ
    var diffPos = car.mesh.position.clone().sub(mine.mesh.position.clone());
    var d = diffPos.length();
    //console.log("d = "+d + "Toler = " + game.ennemyDistanceTolerance);
    if (d<game.mineDistanceTolerance){
      //particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3);

      this.minesPool.unshift(this.minesInUse.splice(i,1)[0]);
      this.mesh.remove(mine.mesh);

      gameOver();
      playMineExplosion();
      i--;
    }

    /*else if (ennemy.angle > Math.PI){
      ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
      this.mesh.remove(ennemy.mesh);
      i--;
    }*/
  }
}

WhiteLine = function(){
  var geom = new THREE.BoxGeometry(40,10,200,1,1);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white
  });
  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.receiveShadow = true;
  /*this.angle = 0;
  this.dist = 0;*/
}

WhiteLinesHolder = function (){
  this.mesh = new THREE.Object3D();
  this.whiteLinesInUse = [];
}

WhiteLinesHolder.prototype.spawnWhiteLines = function(){

  //for (var i=0; i<10000; i+=800){
    var whiteLine;
    if (whiteLinesPool.length) {
      whiteLine = whiteLinesPool.pop();
    }else{
      whiteLine = new WhiteLine();
    }
    whiteLine.mesh.position.y = -200;
    whiteLine.mesh.position.z = -10000;

    this.mesh.add(whiteLine.mesh);
    this.whiteLinesInUse.push(whiteLine);
  //}
}

WhiteLinesHolder.prototype.rotateWhiteLines = function(){
  for (var i=0; i<this.whiteLinesInUse.length; i++){
    var whiteLine = this.whiteLinesInUse[i];
      whiteLine.mesh.position.z += game.speed;

    //console.log(this.ennemiesInUse.length);
    if (whiteLine.mesh.position.z > 0) {
      //this.ennemiesInUse.splice(i,1)[0];
      whiteLinesPool.unshift(this.whiteLinesInUse.splice(i,1)[0]);
      this.mesh.remove(whiteLine.mesh);
      i--;
    }
    /*ennemy.angle += game.speed*deltaTime*game.ennemiesSpeed;

    if (ennemy.angle > Math.PI*2) ennemy.angle -= Math.PI*2;

    ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.distance;
    ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.distance;
    ennemy.mesh.rotation.z += Math.random()*.1;
    ennemy.mesh.rotation.y += Math.random()*.1;*/

    //var globalEnnemyPosition =  ennemy.mesh.localToWorld(new THREE.Vector3());
    // РАБОТАЕТ
    /*var diffPos = car.mesh.position.clone().sub(ennemy.mesh.position.clone());
    var d = diffPos.length();
    //console.log("d = "+d + "Toler = " + game.ennemyDistanceTolerance);
    if (d<game.ennemyDistanceTolerance){
      //particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3);

      ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
      this.mesh.remove(ennemy.mesh);

      gameOver();
      i--;
    }*/

    /*else if (ennemy.angle > Math.PI){
      ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
      this.mesh.remove(ennemy.mesh);
      i--;
    }*/
  }
}


// 3D Models
var sea;
var airplane;
var ground;
var car;
var road;

function createText(){
  text = new Text();
  text.mesh.scale.set(25,25,25);
  text.mesh.position.y = 00;
  text.mesh.position.z = -500;
  scene.add(text.mesh);
}

function createGround(){
  ground = new Ground();
  //road.mesh.scale.set(.25,.25,.25);
  ground.mesh.position.y = -200;
  ground.mesh.position.z = -5000;
  scene.add(ground.mesh);
}

function createRoad(){
  road = new Road();
  //road.mesh.scale.set(.25,.25,.25);
  road.mesh.position.y = -200;
  road.mesh.position.z = -5000;

  scene.add(road.mesh);
}

function createWhiteLine(){
  for (var i = 0; i < 1; i += 1){
    var whiteLine = new WhiteLine();
    whiteLine.mesh.position.y = -200;
    //whiteLine.mesh.position.z = -i;
    whiteLinesPool.push(whiteLine);
  }
  WhiteLinesHolder = new WhiteLinesHolder();
  scene.add(WhiteLinesHolder.mesh)
}

function createCar(){
  car = new Car();
  car.mesh.scale.set(0.75,0.75,0.75);
  car.mesh.position.y = -135//100 при 1.25
  car.mesh.position.z = -600;
  scene.add(car.mesh);
}

//Препядствия

function createMine(){
  /*mine = new Mine();
  mine.mesh.position.y = -192;
  mine.mesh.position.x =
  mine.mesh.position.z = -550;
  scene.add(mine.mesh);*/
  MinesHolder = new MinesHolder(1);
  scene.add(MinesHolder.mesh)
  /*
  for (var i = 0; i < 10000; i += 800){
    mine = new Mine();
    mine.mesh.position.y = -192;
    mine.mesh.position.x = Math.random()*(430+430)-430;
    mine.mesh.position.z = -550;
    minesPool.push(mine);
  }
  MinesHolder = new MinesHolder();
  scene.add(MinesHolder.mesh)
*/
}

function createPlane(){
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25,.25,.25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}

function createSea(){
  sea = new Sea();
  sea.mesh.position.y = -600;
  scene.add(sea.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}


function gameOver() {
  game.status = "gameover";
  soundEngineLow.pause();
  messageGameOver.style.display = "block"
}

var delta = 0;
function loop(){
if (game.status != "pause"){
  newTime = new Date().getTime();
  deltaTime = newTime-oldTime;
  oldTime = newTime;

  if (game.status == "starting"){
    if (soundEngStart.currentTime){
      engHolost.play();
    }
  }
  if (game.status == "playing") {
    updateCamera();
    updateCar();

    if (game.speed<game.maxSpeed){
      game.speed += 0.01;
      speedChanger.value = Math.floor(game.speed);
    }


    if (Math.floor(game.distance)%game.distanceForLinesSpawn == 0 && Math.floor(game.distance) > game.lineLastSpawn){
      console.log('inUse Lines'+WhiteLinesHolder.whiteLinesInUse.length);
      game.lineLastSpawn = Math.floor(game.distance);
      WhiteLinesHolder.spawnWhiteLines();
    }

    if (Math.floor(game.distance)%game.distanceForMineSpawn == 0 && Math.floor(game.distance) > game.mineLastSpawn){
      game.mineLastSpawn = Math.floor(game.distance);
      MinesHolder.spawnMines();
    }


    game.distance += game.speed/100;
    //game.distance++;
    distanceLabel.innerHTML = (game.distance/1000).toFixed(2) + " Км";
    speedLabel.innerHTML = "Уазик алгует со скоростью: " + Math.floor(game.speed) + " Км/ч";
  }
  if (game.status == "gameover") {
    game.speed *= .98;
    car.mesh.rotation.y = car.mesh.rotation.y*0.975;
    car.mesh.rotation.z = car.mesh.rotation.z*0.975;
    //car.mesh.material.color.set(Color.red);

  }
  WhiteLinesHolder.rotateWhiteLines();
  MinesHolder.rotateMines();
}
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
  delta++;

}

function updateCamera(){
  if (camera.rotation.x.toFixed(4) != 0){
    camera.rotation.x += .02;// -.2
  }else{
    camera.rotation.x = 0;
  }
  if (camera.rotation.y.toFixed(4) != 0){// 2.2
    camera.rotation.y -= .1;//0.5
  }else{
    camera.rotation.y = 0;
  }
  if (camera.position.x.toFixed(4) != 0){// 350
    camera.position.x -= 350/12;//10
  }else{
      camera.position.x = 0;
  }
  if (camera.position.y.toFixed(4) != 100){// -100
    camera.position.y += 20;//20
  }
  if (camera.position.z.toFixed(2) < 200){// -950
    camera.position.z += (950 + 200)/20;//30
  }
  /*camera.position.x = 350;
  camera.position.y = -100;
  camera.position.z = -950;
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;*/
}

function changeSpeed(){
  game.speed = Math.floor(speedChanger.value);
}

function updateCar(){
  var targetY = normalize(mousePos.y,-1,0.5,-400, -750);
  var targetX = normalize(mousePos.x,-.75,.75,-380, 380);
  car.mesh.position.x += (targetX - car.mesh.position.x)*0.1;
  car.mesh.position.z = targetY;//+y лево, -y право
  car.mesh.rotation.y = (car.mesh.position.x - targetX)*0.002;
  car.mesh.rotation.z = (targetX - car.mesh.position.x)*0.0007;
  wheel1.mesh.rotation.x -= game.speed/70;//0.15;
  wheel2.mesh.rotation.x -= game.speed/70;
  wheel3.mesh.rotation.x -= game.speed/70;
  wheel4.mesh.rotation.x -= game.speed/70;
  targetX_global = targetX;
  targetY_global = targetY;
}

function pauseGame(event){
  if (game.status != "starting"){
    if (event.charCode == 32 && game.status != "pause"){
      game.status = "pause";
      messagePause.style.display = "block";
    }else {
      game.status = "playing";
      messagePause.style.display = "none";
    }
    soundMute();
  }
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){

  distanceLabel = document.getElementById("distance");
  speedLabel = document.getElementById("speed");
  messageStart = document.getElementById("messageStart");
  messagePause = document.getElementById("messagePause");
  messageGameOver = document.getElementById("messageGameOver");
  soundButton = document.getElementById("soundButton");
  speedChanger = document.getElementById("speedChanger");
  soundButton.value = "Вкл";
  world = document.getElementById("world");
  camera_x = document.getElementById("camera_x");
  camera_y = document.getElementById("camera_y");
  camera_z = document.getElementById("camera_z");
  /*energyBar = document.getElementById("energyBar");
  replayMessage = document.getElementById("replayMessage");
  fieldLevel = document.getElementById("levelValue");
  levelCircle = document.getElementById("levelCircleStroke");*/

  //resetGame();

  createScene();

  createLights();
  //createText();
  startGame();
  createRoad();
  createGround();
  createWhiteLine();
  createCar();
  //car.mesh.material.emissive.setHex( 0xff0000 );
  createMine();
  //cuzov.mesh.material.color.setHex( 0xff0000 );
  //soundEngStart();oninput
  speedChanger.addEventListener('click', changeSpeed, false);
  soundButton.addEventListener('click', soundMute, false);
  messageStart.addEventListener('click', resetGame, false);
  messageGameOver.addEventListener('click', resetGame, false);
  messagePause.addEventListener('click', pauseGame, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  world.addEventListener('click', playGudok, false);
  document.addEventListener('keypress', pauseGame, false);

  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);
