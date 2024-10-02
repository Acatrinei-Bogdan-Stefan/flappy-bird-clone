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

// Variables
const VELOCITY = 200;
const initialBirdPosition = {x:config.width * 0.1, y:config.height / 2};
const pipeVerticalDistanceRange = [150, 250];
let bird = null;
let upperPipe = null;
let lowerPipe = null;
let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);
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

  upperPipe = this.physics.add.sprite(400, pipeVerticalPosition, 'pipe').setOrigin(0, 1);
  lowerPipe = this.physics.add.sprite(400, upperPipe.y + pipeVerticalDistance, 'pipe').setOrigin(0, 0);
  
  this.input.on('pointerdown', flap);

  this.input.keyboard.on('keydown-SPACE', flap);

  

}

function update(time, delta) {
  if(bird.y > config.height-bird.height || bird.y < 0) {
    restartPlayerPosition();
  }
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





