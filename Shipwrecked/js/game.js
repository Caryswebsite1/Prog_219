

// our game's configuration
// note the width and height are just the viewport sizes. 
// they don't have to be the "world" sizes.  See setBounds..
let config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1600,
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


