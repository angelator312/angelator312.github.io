import Button from './button.js'
const LEFT = 2
const RIGHT = 1
const STOP = 0
class Level extends Phaser.Scene {
    static brplayr=2
    static peplus=[0,0,0]
    static Armor=0;
    static SuperAr=0;
    static endscore=1000
    constructor(name,nivo) {
        super(name)
        this.players = []
        this.vid = []
        this.broy = []
        this.broypl = this.constructor.brplayr
        this.speed=1000
        this.score = 0
        this.coins=0;
        this.csplus=5;
        this.endscore=this.constructor.endscore;
        this.win=false
        this.nivo=nivo
        this.pe=[50+this.constructor.peplus[0],100+this.constructor.peplus[1],100+this.constructor.peplus[2]]
    }
    preload() {}

    plusplayer(){
        this.players.push(this.physics.add.sprite(150, 450, 'dude'))
        this.vid.push(LEFT)
        this.broy.push(0)
        this.players[this.players.length-1].setBounce(0.2);
        this.players[this.players.length-1].body.setCollideWorldBounds(true, undefined, undefined, true);
        this.physics.add.collider(this.players[this.players.length-1], this.platforms);
    }
    
    create() {
        console.log('create',this.nivo);
        this.registry.set('pe',this.pe)
        this.registry.set('nivo',this.nivo)
        this.registry.set('csplus',this.csplus)
        this.registry.set('addplayer',false);
        if(this.nivo>=2) {
            this.coins += this.registry.list.coins;
        }
        this.registry.events.on('changedata', this.updateData, this);
        this.registry.set('speed', this.speed)
        this.add.image(400, 300, 'sky');
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.button = new Button(this, 700, 30, 'upgrade', () => { 
            this.scene.manager.start('upgrade');
        })
        for (let i = 0; i < this.broypl; i++) {
            this.plusplayer()
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
        this.Leveltext = this.add.text(50,16,`Level: ${this.nivo}`)
        this.registry.set('score', this.coins);        
        this.physics.world.on('worldbounds', (player, up, down, left, right) => { return this.onworldboundce(player, up, down, left, right) })


        
    }

    update() {
        for (const item in this.players) {
            if (this.vid[item] != STOP) {
                if (this.broy[item] == 0) {
                    this.broy[item] = Phaser.Math.Between(44, 157)
                    let vid = this.vid[item];
                    this.vid[item] = Math.floor(Math.random() * 2 + 1)
                    while (vid == this.vid[item]) {
                        this.vid[item] = Math.floor(Math.random() * 2 + 1)
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
        if (this.win) {
            return
        }
        if (this.stopbomb) {
            return
        }
        this.time.delayedCall(this.speed, () => {
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
        this.coins += this.csplus;
        this.registry.set('coins', this.coins)
        this.score += this.csplus;
        this.scoreText.setText('Score: ' + this.score);
        if (this.endscore<=this.score) {
            this.win=true;
            for (const item in this.vid) {
                this.vid[item]=STOP
                this.players[item].setVelocityX(0)
                this.players[item].anims.play('turn')
            }
            new Button(this, 300, 200,'към следващо ниво',()=>{this.scene.stop(`level${this.nivo}`); this.scene.start(`level${this.nivo+1}`)},4)
        }
    }
    updateData(parent, key, data){
        if(!this.scene.isActive()) {
            return
        }
        if (this.registry.list.addplayer) {
            this.registry.list.addplayer=false;
            this.plusplayer()
        }
        this[key]=data;
    }
   
}
export default Level