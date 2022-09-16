import Button from './button.js'
const LEFT = 2
const RIGHT = 1
const STOP = 0
class Levelbosses extends Phaser.Scene {
    static peplus=[40,50,90]
    static Armor=60;
    static SuperAr=0;
    static pluscoins=200;
    constructor(name,nivo) {
        super(name)
        this.players = []
        this.vid = []
        this.broy = []
        this.pluscoins= this.constructor.pluscoins;
        this.broypl = 1
        this.speed=1000
        this.score = 0
        this.coins=0;
        this.csplus=5;
        this.endscore=this.constructor.endscore;
        this.win=false
        this.nivo=nivo
        this.shields=[]
        this.armor=this.constructor.Armor;
        this.pe=[50+this.constructor.peplus[0],100+this.constructor.peplus[1],100+this.constructor.peplus[2]]
    }
    
    preload() {}

    addplayer(){
        this.players.push(this.physics.add.sprite(150, 450, 'boss1'))
        this.vid.push(LEFT)
        this.broy.push(0)
        this.players[this.players.length-1].setBounce(0.2);
        this.players[this.players.length-1].body.setCollideWorldBounds(true, undefined, undefined, true);
        this.physics.add.collider(this.players[this.players.length-1], this.platforms);
        this.players[this.players.length-1].setScale(2);
        let shield=this.physics.add.sprite(150,430,'shield');
        shield.setScale(2);
        shield.body.setAllowGravity(false);
        this.physics.add.collider(shield, this.platforms);
        this.shields.push({s:shield,life:20})
    }
    
    create() {
        this.registry.set('pe',this.pe)
        
        this.registry.set('csplus',this.csplus)
        this.registry.set('addplayer',false);
        this.registry.events.on('changedata', this.updateData, this);
        this.registry.set('speed', this.speed)
        this.add.image(400, 300, 'sky');
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.button = new Button(this, 700, 30, 'upgrade', () => { 
            this.scene.manager.start('upgrade');
        })
        for (let i = 0; i < this.broypl; i++) {
            this.addplayer()
        }
        this.input.on('pointerdown', (pointer) => {

            return this.onmouseclick(pointer)

        }, this);
        this.anims.create({
            key: 'leftboss',
            frames: this.anims.generateFrameNumbers('boss1', { start: 14, end: 28 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'rightboss',
            frames: this.anims.generateFrameNumbers('boss1', { start: 0, end: 14 }),
            frameRate: 10,
            repeat: -1
        });
        this.Leveltext = this.add.text(23, 16, `Level: ${this.nivo},bossnivo`);
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
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
                        this.players[item].anims.play('rightboss', true);
                    } else if (this.vid[item] == LEFT) {
                        this.players[item].anims.play('leftboss', true);
                    }
                }

                if (this.vid[item] == RIGHT) {


                    this.players[item].setVelocityX(90);
                    if (this.shields[item]) {
                        this.shields[item].s.setVelocityX(90)
                    }
                    

                } else if (this.vid[item] == LEFT) {
                    this.players[item].setVelocityX(-90);
                    if (this.shields[item]) {
                        this.shields[item].s.setVelocityX(-90)
                    }
                }
                this.broy[item]--
            }
        }

    }


    onworldboundce(player, up, down, left, right) {
        let ipla=this.players.findIndex((e)=>e.body==player)
        if (left) {
            this.vid[ipla] = RIGHT;
            this.players[ipla].anims.play('rightboss')
            this.broy[ipla] = Phaser.Math.Between(44, 157)

        }
        if (right) {
            this.vid[ipla] = LEFT;
            this.players[ipla].anims.play('leftboss')
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
        for (const item in this.shields) {
            let shieldi=item;
            this.physics.add.overlap(this.shields[item].s, star, () => { this.hitshild(shieldi); star.disableBody(true, true); })
        }
    }
    hitbomb() {
        // this.coins += this.csplus;
        // this.registry.set('coins', this.coins)
        this.score += this.csplus;
        this.armor -=this.csplus;
        console.log(this.armor,this.armor-this.csplus);
        this.scoreText.setText('Score: ' + this.score);
        if (this.armor<=0) {
            this.win=true;
            for (const item in this.vid) {
                this.vid[item]=STOP
                this.players[item].setVelocityX(0)
                this.players[item].anims.play('turn')
            }
            this.coins+= this.pluscoins;
            this.registry.set('coins', this.coins)
            this.registry.set('bossp',true);
            new Button(this, 300, 200,'към следващо ниво',()=>this.scene.start(`level${this.nivo+1}`),4)
        }
    }
    updateData(parent, key, data){
        if(!this.scene.isActive()) {
            return
        }
        if (this.registry.list.addplayer) {
            this.registry.list.addplayer=false;
            this.addplayer()
        }
        this[key]=data;
    }
    hitshild(i){
        this.shields[i].life-=this.csplus;
        console.log(i);
        if (this.shields[i].life<=0) {
            this.shields[i].s.setTint(0xff0000)
            this.shields[i]=null
        }
    }
   
}
export default Levelbosses