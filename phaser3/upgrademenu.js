import Button from "./button.js"
class Upgrade extends Phaser.Scene {
    constructor() {
        super('upgrade')
    }

    

    create() {
        this.add.image(400,300,'menu')
        this.closebtn= new Button(this, 75,35,'close',()=>{
            this.scene.manager.stop('upgrade')
        ''})
        this.scoreText = this.add.text(300, 300, `score: ${this.registry.list.score}`, { fontSize: '32px', fill: '#000' });
    }

    update() {}

}
export default Upgrade