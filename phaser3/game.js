
    const LEFT=2
    const RIGHT=1
    const STOP=0
    class Games extends Phaser.Scene{
        constructor(){
            super()
            this.broy=0
            this.vid=Math.floor(Math.random() * 3 +1)
        }
     
    preload ()
    {
        
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/tomato2.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

     create ()
    {
        this.score=0
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        

        this.player1 = this.physics.add.sprite(100, 450, 'dude');

        this.player1.setBounce(0.2);
        this.player1.body.setCollideWorldBounds(true, undefined,undefined,true);
        
        this.input.on('pointerdown',(pointer) =>{

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
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
 
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        let { width, height } = this.sys.game.canvas;
        
        this.physics.add.collider(this.player1, this.platforms);
        
        this.physics.world.on('worldbounds', (player,up,down,left,right)=>{ return this.onworldboundce(player,up,down,left,right)})
        
    
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
this.physics.add.collider(this.player1, this.player2 );
this.physics.add.overlap(this.player2, this.stars, this.collectStar, null, this);*/
this.cursors = this.input.keyboard.createCursorKeys();
}

update ()
{
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
        if (this.cursors.up.isDown && this.player1.body.touching.down)
        {
            this.player1.setVelocityY(-330);
        }
        if (this.cursors.left.isDown)
        {
            this.player1.setVelocityX(-160);

            this.player1.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player1.setVelocityX(160);

            this.player1.anims.play('right', true);
        }
        else
        {
            this.player1.setVelocityX(0);

            this.player1.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player2.body.touching.down)
        {
            this.player1.setVelocityY(-330);
        }*/
        if (this.vid!=STOP) {
        if (this.broy==0) {
            this.broy=Phaser.Math.Between(44,157)
            let vid=this.vid;
            this.vid=Math.floor(Math.random() * 3 +1)
            while(vid==this.vid) {
                this.vid=Math.floor(Math.random() * 3 +1)
            }
            if (this.vid==RIGHT) {
                this.player1.anims.play('right', true);
            } else if(this.vid==LEFT){
                this.player1.anims.play('left', true);
            }
            
        }
        
        if (this.vid==RIGHT) { 
            
            
            this.player1.setVelocityX(90);
        
           
        }else if(this.vid== LEFT){
            this.player1.setVelocityX(-90);
            
        }
        /*
        let vid2=Math.floor(Math.random() * 3 )
        
        if (vid2==RIGHT) { 
            
        let broy=Phaser.Math.Between(25,50)
        this.player2.anims.play('turn');

        for(let i=0;i<broy;i++){
            this.player2.anims.play('right')
            this.player2.setVelocityX(9);
           
        }
        }else if(vid2==LEFT){
            this.player2.setVelocityX(-7);
            this.player2.anims.play('left');
        }*/
            this.broy--
        }
        
    }
    
    
    onworldboundce(player,up,down,left,right){
        if (left) {
            this.vid=RIGHT;
            this.player1.anims.play('right')
            this.broy=Phaser.Math.Between(44,157)
            
        }
        if (right) {
            this.vid=LEFT;
            this.player1.anims.play('left')
            this.broy=Phaser.Math.Between(44,157)
        }
    }
    onmouseclick(pointer){
        if (this.stopbomb) {
            return
        }
        this.time.delayedCall(1000, () => { 
            this.stopbomb=false
        }, [], this)
        
        this.stopbomb=true
        let star=this.physics.add.sprite(pointer.x,3, 'bomb');
        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        this.physics.add.overlap(star, this.platforms,()=>{ 
            // this.star.disableBody(true, true);
            star.setTint(0xff0000);
            star.setBounceY(0)
        });
        this.physics.add.overlap(this.player1, star, ()=>{ this.hitbomb();star.disableBody(true, true);})
        
    }
    hitbomb(){
    this.score += 5;
    this.scoreText.setText('Score: ' + this.score);
    this.player1.setTint(0xff0000);
    
    }
    
}
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [ Games]
};



var game = new Phaser.Game(config);
