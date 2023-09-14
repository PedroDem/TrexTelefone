var trex, trex_correndo, trexCollided
var ground, groundImage, invisibleGround
var cloudImage
var cactus1, cactus2, cactus3, cactus4, cactus5, cactus6
var score = 0
var cactusGroup, cloudsGroup
var gameState = "nothing"
var gameOver, gameOverImage
var restart, restartImage
var dieSound, checkpointSound, jumpSound
 
function preload(){
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  trexCollided = loadAnimation("trex_collided.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  cactus1 = loadImage("obstacle1.png")
  cactus2 = loadImage("obstacle2.png")
  cactus3 = loadImage("obstacle3.png")
  cactus4 = loadImage("obstacle4.png")
  cactus5 = loadImage("obstacle5.png")
  cactus6 = loadImage("obstacle6.png")
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
  jumpSound = loadSound("jump.mp3")
}
 
function setup() {
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(50, 160, 20, 50)
  trex.scale = 0.6
  trex.addAnimation("trexRunning", trexRunning)
  trex.addAnimation("trexCollided", trexCollided)
  trex.debug = false
  trex.setCollider("circle", 0,0,40)
 
  ground = createSprite(200, 180, 400, 20)
  ground.addImage(groundImage)
  ground.x = ground.width/2
  invisibleGround = createSprite(200, 200, 400, 5)
  invisibleGround.visible = false
  cloudsGroup = new Group()
  cactusGroup = new Group()

  gameOver = createSprite(width/2, 90)
  gameOver.addImage(gameOverImage)
  gameOver.visible = false
  gameOver.scale = 0.5
  restart = createSprite(width/2, 120)
  restart.addImage(restartImage)
  restart.visible = false
  restart.scale = 0.5
}

function draw() {
  background("white");
  textSize(20)
  fill("red")
  text("Points: " + score, width-300, 50)
  
  if(gameState === "playing"){
    ground.velocityX = -(6 + 3*score/100)
  if(ground.x<0){
    ground.x = ground.width/2
  }
  if(score%500===0 && score > 0){
    checkpointSound.play()
  }
 
  if((keyDown("space")|| touches.length >0) && trex.y>=100){
    trex.velocityY = -10
    jumpSound.play()
    touches = []
  }

  score = score + Math.round(getFrameRate()/60)

  if(cactusGroup.isTouching (trex)){
   gameState = "end"
   dieSound.play() 
  }
  createClouds()
  createCactus()
 
  } else if(gameState === "end"){
   ground.velocityX = 0
   trex.changeAnimation("trexCollided", trexCollided)
   cactusGroup.setVelocityXEach(0)
   cloudsGroup.setVelocityXEach(0)
   cactusGroup.setLifetimeEach(-1)
   cloudsGroup.setLifetimeEach(-1)
   gameOver.visible = true
   restart.visible = true

   if(mousePressedOver(restart)|| touches.lenght > 0){
    restartGame()
    touches = []
   }

  } else if(gameState = "nothing"){
  if(keyDown("space") || touches.length > 0){
    gameState = "playing"
    touches = []
  }
  }
  trex.velocityY = trex.velocityY + 0.8
  trex.collide(invisibleGround)
  drawSprites();
}

function createClouds() {
  if(frameCount%100===0){ 
    var cloud = createSprite(width+200, 100, 40, 10)
    cloud.y = Math.round(random(10, 60))
    console.log(cloud.y)
    cloud.addImage(cloudImage)
    cloud.scale = 0.1
    cloud.velocityX = -(3 + score/150)
    cloud.depth = trex.depth
    trex.depth = trex.depth +1
    cloud.lifetime = width+300
    cloudsGroup.add(cloud)
    cloud.debug = false
  }
}

function createCactus(){
  if(frameCount%180===0){
    var cactus = createSprite(width+200, 160, 200, 200)
    cactus.addImage(cactus1)
    cactus.scale = 0.1
    cactus.velocityX = -(6 + 3*score/100)
    cactus.lifetime = width+300
    cactusGroup.add(cactus)
    cactus.debug = false
    var numberCactus = Math.round(random(1, 6))
    switch(numberCactus){
      case 1: cactus.addImage(cactus1)
       break
      case 2: cactus.addImage(cactus2)
        break
      case 3: cactus.addImage(cactus3)
       break
      case 4: cactus.addImage(cactus4)
        break
      case 5: cactus.addImage(cactus5)
        break
      case 6: cactus.addImage(cactus6)
        break
    }
  }
}

function restartGame(){
  gameState = "nothing"
  score = 0
  gameOver.visible = false
  restart.visible = false
  trex.changeAnimation("trexRunning", trexRunning)
  cloudsGroup.destroyEach()
  cactusGroup.destroyEach()
}
