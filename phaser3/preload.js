
class Preload extends Phaser.Scene {
    constructor() {
        super('preload')
    }

    preload() {
        this.load.image('menu','assets/menu.png')
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('button-blue', 'assets/upgrade-blue.png');
        this.load.image('bomb', 'assets/tomato2.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {this.scene.start('level')}

    update() {}

}
export default Preload