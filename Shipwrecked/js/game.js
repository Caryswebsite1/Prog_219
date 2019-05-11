

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 900,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
 
  scene: [Shipwrecked]
};

console.log("in game.js");
let myItem = "this is my item";

// create the game, and pass it the configuration
let game = new Phaser.Game(config);


