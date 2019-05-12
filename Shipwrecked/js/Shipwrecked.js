/* eslint-disable indent */
/* var sConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }//,
     //scene: {
       // preload: preload,
        //create: create,
        //update: update
    //}
}; 

var sGame = new Phaser.Game(sConfig);
*/

class Shipwrecked extends Phaser.Scene {
    constructor() {
        super({ key: "Shipwrecked" });

        this.gold = 0;
        this.wood = 0;
        this.rope = 0;
        this.sails = 0;
        this.food = 0;
        this.playerLife = 10;
        this.gameOver = false;
        this.score = 0;
    } // end constructor

    /*
player = "";
stars = "";
bombs = "";
platforms = "";
cursors = "";
score = 0;
gameOver = false;
scoreText = "";
*/


    preload() {
        
        this.load.image("sand", "assets/island_sand_d16.jpg");
        this.load.image("ocean", "assets/ocean16.jpg");
        this.load.image("boar", "assets/lava_s16.jpg");
        this.load.spritesheet("dude", "assets/universal-lpc-sprite_male_01_full.png", { frameWidth: 64, frameHeight: 64 });

        //game.kineticScrolling = game.plugins.add(Phaser.Plugin.KineticScrolling);
    }

// NOTE:  Our dude sprite sheet is 0 - 12 sprites wide over all. so
//        that means row 1 is 0 -12 for a total of 13 POSSIBLE slots.
//        However, we only have 7 in row 1 so slots 7-12 are empty.
//        row 2 starts on slot 13, etc. 

    create() {
        //this.score = 0;
        //this.gameOver = false;
        /*
        game.kineticScrolling.configure({
            kineticMovement: true,
            timeConstantScroll: 325, //really mimic iOS
            horizontalScroll: true,
            verticalScroll: true,
            horizontalWheel: false,
            verticalWheel: true,
            deltaWheel: 40
        });
        game.kineticScrolling.start(); */

        // Camera: set bounds to whole world size.
        this.cameras.main.setBounds(0, 0, 1600, 1600);

        // set actual camera width and height for what we see.
        this.cameras.main.setSize(800, 600);


        // only for test..
        this.gold = 1;
        this.wood = 2;
        this.rope = 3;
        this.sails = 4;
        this.food = 5;
        this.score = 6;

        // add the ground we can walk on (beach etc) as the whole underlying group to start..
        this.ground = this.physics.add.staticGroup();

        //  A sand everywhere.
        let i = 0;
        let j = 0;
        for (i = 0; i < 1600; i += 16) {
            console.log("in first i loop for sand");
            for (j = 0; j < 1600; j += 16) {
                this.ground.create(i, j, "sand");
            }// end for j
        }// end for i


        // to only add an image someplace, you would say:
        // this.add.image(x, y, "sand");


        //  add ocean as a static but we will set it up as a collider later.
        this.BigOcean = this.physics.add.staticGroup();
        // just a couple tiles wide down the left for now.
        for (i = 0; i < 65; i += 16) {
            console.log("in first i loop for ocean");
            for (j = 0; j < 1600; j += 16) {
                this.BigOcean.create(i, j, "ocean");
            }// end for j
        }// end for i

        console.log("out of ocean creation");
        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        //this.platforms.create(320, 360, "ground").setScale(2).refreshBody();

        //  Now let's create some ledges
        //this.platforms.create(480, 250, "ground");
        //this.platforms.create(40, 160, "ground");
        //this.platforms.create(600, 110, "ground");

        // The player and its settings
        this.player = this.physics.add.sprite(400, 300, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        //this.player.setBounce(0.15);
        this.player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking up, down, left and right.
        /*********** TODO.  THESE NOT SET CORRECTLY YET ***************** */
        this.anims.create({
            key: "front",
            frames: this.anims.generateFrameNumbers("dude", { start: 130, end: 138 }),
            frameRate: 16,
            repeate: -1
        });

        this.anims.create({
            key: "back",
            frames: this.anims.generateFrameNumbers("dude", { start: 104, end: 112 }),
            frameRate: 16,
            repeate: -1
        });


        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 117, end: 125 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 130 }],
            frameRate: 16
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 143, end: 151 }),
            frameRate: 16,
            repeat: -1
        });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();


        // Piggy down the right side area for now
        this.boars = this.physics.add.group({
            key: "boar",
            repeat: 4,
            setXY: { x: 550, y: 0, stepY: 150 }
        });

        this.boars.children.iterate(function (child) {

            //  Give each boar a speed to the left and bounded by world.
            child.setVelocityX(-10);
            child.setCollideWorldBounds(true);
        });

        //this.bombs = this.physics.add.group();

        //  The score
        this.scoreText = this.add.text(16, 16, myItem, { fontSize: "32px", fill: "#000" });

        //  Collide the player and the boars with the ocean
        this.physics.add.collider(this.player, this.BigOcean);
        this.physics.add.collider(this.boars, this.BigOcean);

        // collide boars with each other.
        this.physics.add.collider(this.boars, this.boars);

        //  Checks to see if the player overlaps with any of the boars, if he does call the boarCombat function
        this.physics.add.overlap(this.player, this.boars, this.boarPlayerCombat, null, this);

        //this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    update() {
        if (this.gameOver) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play("right", true);
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-100);
            this.player.anims.play("back", true);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(100);
            this.player.anims.play("front", true);
        }else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play("turn");
        }


        //  Position the center of the camera on the player
        //  We -400 because the camera width is 800px and
        //  we want the center of the camera on the player, not the left-hand side of it
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = this.player.y - 300;

     }// end update

    /*
        collectStar(player, star) {
            star.disableBody(true, true);

            //  Add and update the score
            this.score += 10;
            this.scoreText.setText("Score: " + this.score);

            if (this.stars.countActive(true) === 0) {
                //  A new batch of stars to collect
                this.stars.children.iterate(function(child) {

                    child.enableBody(true, child.x, 0, true, true);

                });

                var x = (player.x < 320) ? Phaser.Math.Between(320, 640) : Phaser.Math.Between(0, 320);

                var bomb = this.bombs.create(x, 16, "bomb");
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;

            }
        }
        */


    boarPlayerCombat(player, boar) {
        this.playerLife -= 5;
        boar.disableBody(true, true);

        if (this.playerLife <= 0) {

            this.physics.pause();

            player.setTint(0xff0000);

            player.anims.play("turn");

            this.gameOver = true;
        }

    }// end boarPlayerCombat


    /*
    hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play("turn");

        this.gameOver = true;
    }
*/


} // end class