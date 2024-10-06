import Phaser from 'phaser';

const config = {
  // WebGL(Web graphics library) JS Api for rendaring 2D and 3D graphics
  type:Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //Arcade phisics plugin, manages physics simulation
    default: 'arcade',
    arcade:{
      debug: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

// Global Variables
const VELOCITY = 200;
const PIPES_TO_REMDER = 4;
const initialBirdPosition = {x:config.width * 0.1, y:config.height / 2};
const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [400, 500];

let pipeHorizontalDistance = 0;
let bird = null;
let pipes = null;
let flapVelocity = 300;

// Loading assetes, such as images, music, animations...
function preload(){
  this.load.image('sky','assets/sky.png');
  this.load.image('bird','assets/bird.png');
  this.load.image('pipe','assets/pipe.png');
}

function create(){
  this.add.image(0, 0, 'sky').setOrigin(0);

  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;

  pipes = this.physics.add.group();

  for ( let i = 0; i < PIPES_TO_REMDER; i++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown-SPACE', flap);
}

function placePipe(uPipe, lPipe){
  const rightMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}
// Update
function update(time, delta) {
  if(bird.y > config.height-bird.height || bird.y < 0) {
    restartPlayerPosition();
  }
  recyclePipes();
}

function recyclePipes(){
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0){
    tempPipes.push(pipe);
    if(tempPipes.length === 2){
      placePipe(...tempPipes);
    }
    }
  })
}

function getRightMostPipe(){
  let rightMostX = 0;
  
  pipes.getChildren().forEach(function(pipe){
    rightMostX = Math.max(pipe.x, rightMostX);
  })

  return rightMostX;
}

function restartPlayerPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

new Phaser.Game(config);





