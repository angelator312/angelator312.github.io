class Button {
    constructor(scene, btnX, btnY, text,callback, color = 'blue') {
        this.bg = scene.add.image(0, 0, `button-${color}`).setInteractive();
        this.text = scene.add.text(0, 0, text)
        let textw = this.text.displayWidth, texth = this.text.displayHeight;
        let btnw = this.bg.displayWidth, btnh = this.bg.displayHeight;
        this.text.setY(0-(btnh-texth)/2)
        this.container = scene.add.container(btnX, btnY, [this.bg, this.text]);
        this.text.setX(0-(btnw-textw)/2)
        
        this.bg.on('pointerover', () => {

            this.bg.setTint(0x44ff44);

        });

        this.bg.on('pointerout', () => {

            this.bg.clearTint();

        });

        this.bg.on('pointerup', () => {
            this.bg.setScale(1)
            callback();
        });
        this.bg.on('pointerdown', () => {
            this.bg.setScale(1.1)
        });
    }
}
export default Button