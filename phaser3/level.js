import Button from './button.js'
const LEFT = 2
const RIGHT = 1
const STOP = 0
class Level extends Phaser.Scene {
    constructor(brplayr=2) {
        super()
        this.players = []
        this.vid = []
        this.broy = []
        this.broypl = brplayr
    }

    preload() {

        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('button-blue', 'assets/upgrade-blue.png');
        this.load.image('bomb', 'assets/tomato2.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.score = 0
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.button = new Button(this, 200, 200, 'wwwwwww', () => { console.log('true'); })
        for (let i = 0; i < this.broypl; i++) {
            this.players.push(this.physics.add.sprite(150, 450, 'dude'))
            this.vid.push(LEFT)
            this.broy.push(0)
        }
        for (const item in this.players) {
            this.players[item].setBounce(0.2);
            this.players[item].body.setCollideWorldBounds(true, undefined, undefined, true);
        }
        this.input.on('pointerdown', (pointer) => {

            return this.onmouseclick(pointer)

        }, this);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        for (const item in this.players) {
            this.physics.add.collider(this.players[item], this.platforms);
        }
        this.physics.world.on('worldbounds', (player, up, down, left, right) => { return this.onworldboundce(player, up, down, left, right) })


        /* this.player2 = this.physics.add.sprite(165, 450, 'dude');
         
         this.player2.setBounce(0.2);
         this.player2.setCollideWorldBounds(true);
         
         this.anims.create({
             key: 'left',
             frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
             frameRate: 10,
             repeat: -1
         });
         
         this.anims.create({
             key: 'turn',
             frames: [ { key: 'dude', frame: 4 } ],
             frameRate: 20
         });
         
         this.anims.create({
             key: 'right',
             frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
             frameRate: 10,
             repeat: -1
         });
         
         this.physics.add.collider(this.player2, this.platforms);
         this.physics.add.collider(this.stars, this.platforms);
         this.physics.add.collider(this.players[item], this.player2 );
         this.physics.add.overlap(this.player2, this.stars, this.collectStar, null, this);*/
        // this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        /*if (this.cursors.left.isDown)
        {
            this.player2.setVelocityX(-160);
            
            this.player2.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
                this.player2.setVelocityX(160);
    
                this.player2.anims.play('right', true);
            }
            else
            {
                this.player2.setVelocityX(0);
    
                this.player2.anims.play('turn');
            }
            if (this.cursors.up.isDown && this.player2.body.touching.down)
            {
                this.player2.setVelocityY(-330);
            }
            if (this.cursors.up.isDown && this.players[item].body.touching.down)
            {
                this.players[item].setVelocityY(-330);
            }
            if (this.cursors.left.isDown)
            {
                this.players[item].setVelocityX(-160);
    
                this.players[item].anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                this.players[item].setVelocityX(160);
    
                this.players[item].anims.play('right', true);
            }
            else
            {
                this.players[item].setVelocityX(0);
    
                this.players[item].anims.play('turn');
            }
    
            if (this.cursors.up.isDown && this.player2.body.touching.down)
            {
                this.players[item].setVelocityY(-330);
            }*/
        for (const item in this.players) {


            if (this.vid[item] != STOP) {
                if (this.broy[item] == 0) {
                    this.broy[item] = Phaser.Math.Between(44, 157)
                    let vid = this.vid[item];
                    this.vid[item] = Math.floor(Math.random() * 3 + 1)
                    while (vid == this.vid[item]) {
                        this.vid[item] = Math.floor(Math.random() * 3 + 1)
                    }
                    if (this.vid[item] == RIGHT) {
                        this.players[item].anims.play('right', true);
                    } else if (this.vid[item] == LEFT) {
                        this.players[item].anims.play('left', true);
                    }
                }

                if (this.vid[item] == RIGHT) {


                    this.players[item].setVelocityX(90);


                } else if (this.vid[item] == LEFT) {
                    this.players[item].setVelocityX(-90);

                }
                this.broy[item]--
            }
        }

    }


    onworldboundce(player, up, down, left, right) {
        let ipla=this.players.findIndex((e)=>e.body==player)
        if (left) {
            this.vid[ipla] = RIGHT;
            this.players[ipla].anims.play('right')
            this.broy[ipla] = Phaser.Math.Between(44, 157)

        }
        if (right) {
            this.vid[ipla] = LEFT;
            this.players[ipla].anims.play('left')
            this.broy[ipla] = Phaser.Math.Between(44, 157)
        }
    }
    onmouseclick(pointer) {
        if (this.stopbomb) {
            return
        }
        this.time.delayedCall(1000, () => {
            this.stopbomb = false
        }, [], this)

        this.stopbomb = true
        let star = this.physics.add.sprite(pointer.x, 3, 'bomb');
        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        this.physics.add.overlap(star, this.platforms, () => {
            // this.star.disableBody(true, true);
            star.setTint(0xff0000);
            star.setBounceY(0)
        });
        for (const item in this.players) {
            this.physics.add.overlap(this.players[item], star, () => { this.hitbomb(); star.disableBody(true, true); })
        }
    }
    hitbomb() {
        this.score += 5;
        this.scoreText.setText('Score: ' + this.score);
    }
}
export default Level