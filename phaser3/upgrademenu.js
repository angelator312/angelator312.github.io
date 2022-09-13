import Button from "./button.js"
class Upgrade extends Phaser.Scene {
    constructor() {
        
        super('upgrade')
    }



    create() {
        this.registry.events.on('changedata', this.updateData, this);
        this.add.image(400, 300, 'menu')
        this.closebtn = new Button(this, 75, 35, 'close', () => {
            this.scene.manager.stop('upgrade')
            ''
        })
        this.scoreText = this.add.text(300, 300, `coins: ${this.registry.list.coins}`, { fontSize: '32px', fill: '#000' });
        let list = this.registry.list;
        let t = ['повече злато', 'скорост', 'еrror не работи']
        let btns = [
            new Button(this, 75, 35, t[0], () => {
                if (list.coins >= list.pe[0]) {
                    list.csplus += 2
                    list.coins -= list.pe[0]
                    list.pe[0] += 65;
                    this.registry.set('pe', list.pe)
                    this.registry.set('csplus', list.csplus)
                    this.registry.set('coins', list.coins)
                }
            }),
            new Button(this, 75, 35, t[1], () => {
                if (list.coins >= list.pe[1] && list.speed >= 600) {
                    list.speed -= 100
                    list.coins -= list.pe[1]
                    list.pe[1] += 150;
                    this.registry.set('pe', list.pe)
                    this.registry.set('speed', list.speed)
                    this.registry.set('coins', list.coins)
                    console.log(list.pe,list.speed);

                }
            }),
            new Button(this, 75, 35, t[2], () => {/*
                if (list.coins >= list.pe[2]) {
                    this.registry.list.addplayer()
                    list.coins -= list.pe[2]
                    list.pe[2] += 100
                    this.registry.set('pe', list.pe)
                    this.registry.set('coins', list.coins)

                }*/
            })
        ]

        let group = this.add.group(btns.map((e) => e.container))
        Phaser.Actions.GridAlign(group.getChildren(), {
            width: 60,
            height: -1,
            cellWidth: 70,
            cellHeight: 80,
            x: 120,
            y: 140
        });
        this.text = list.pe.map((e) => this.add.text(0, 0, e))
        let grt = this.add.group(this.text)
        Phaser.Actions.GridAlign(grt.getChildren(), {
            width: 60,
            height: -1,
            cellWidth: 70,
            cellHeight: 80,
            x: 80,
            y: 100
        });
    }

    update() {
        this.scoreText.setText(`coins: ${this.registry.list.coins}`);
        for (const item in this.text) {
            this.text[item].setText(this.registry.list.pe[item]);
        }
    }
    updateData(parent, key, data) {
        if (key!=this.registry.list.pe) {
            this[key] = data;
        }
    }
}
export default Upgrade