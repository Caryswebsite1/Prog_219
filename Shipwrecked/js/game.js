

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 900,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
    },
  myItem: "this is my item",
  scene: [Shipwrecked]
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);


