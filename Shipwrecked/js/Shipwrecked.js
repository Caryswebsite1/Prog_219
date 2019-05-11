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
        this.load.image("BigSand", "assets/island_sand_d.jpg");
        this.load.image("sand", "assets/island_sand_d64.jpg");
        this.load.image("ocean", "assets/ocean64.jpg");
        this.load.image("lavaBeach", "assets/lava_s64.jpg");
        this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        //this.score = 0;
        //this.gameOver = false;

        // add the ground we can walk on (beach etc) as the whole underlying group to start..
        this.ground = this.physics.add.staticGroup();


        //  A sand everywhere.
        let i = 0;
        let j = 0;
        for (i = 0; i < 640; i + 64) {
            for (j = 0; j < 640; j + 64) {
                this.ground.create(i, j, "sand");
            }// end for j
        }// end for i


        // this.add.image(i, j, "sand");
        //  add ocean as a static but we will set it up as a collider later.
        this.ocean = this.physics.add.staticGroup();
        // just a couple tiles wide down the left for now.
        for (i = 0; i < 65; i + 64) {
            for (j = 0; j < 640; j + 64) {
                this.ground.create(i, j, "sand");
            }// end for j
        }// end for i


        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        //this.platforms.create(320, 360, "ground").setScale(2).refreshBody();

        //  Now let's create some ledges
        //this.platforms.create(480, 250, "ground");
        //this.platforms.create(40, 160, "ground");
        //this.platforms.create(600, 110, "ground");

        // The player and its settings
        this.player = this.physics.add.sprite(320, 320, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.15);
        this.player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking up, down, left and right.
        /*********** TODO.  THESE NOT SET CORRECTLY YET ***************** */
        this.anims.create({
            key: "front",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "back",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });


        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();


        // Piggy down the right side area
        this.boars = this.physics.add.group({
            key: "boar",
            repeat: 10,
            setXY: { x: 550, y: 0, stepY: 64 }
        });

        this.boars.children.iterate(function (child) {

            //  Give each boar a speed to the left and bounded by world.
            child.setVelocityX(-10);
            child.setCollideWorldBounds(true);
        });

        //this.bombs = this.physics.add.group();

        //  The score
        //this.scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "#000" });

        //  Collide the player and the boars with the ocean
        this.physics.add.collider(this.player, this.ocean);
        this.physics.add.collider(this.boars, this.ocean);

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
            this.player.setVelocityX(-160);

            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play("right", true);
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play("back");
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play("front");
        }else {
            this.player.setVelocityX(0);

            this.player.anims.play("turn");
        }

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