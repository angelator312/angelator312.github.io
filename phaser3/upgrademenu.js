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
        this.pe=[6,15,60]
        let list= this.registry.list;
        let t=[ 'повече злато','скорост','ниво']
        let btns = [
            new Button(this, 75, 35, t[0], () => {
                if (list.coins>=this.pe[0]) {
                    list.csplus+=1
                    list.coins-=this.pe[0]
                    this.pe[0]+=7;
                    this.registry.set('csplus',list.csplus)
                    this.registry.set('coins',list.coins)
                }
            }),
            new Button(this, 75, 35, t[1], () => {
                if (list.coins>=this.pe[1]&& list.speed<=500) {
                    list.speed-=100
                    list.coins-=this.pe[1]
                    this.pe[1]+=10;
                    this.registry.set('speed',list.speed)
                    this.registry.set('coins',list.coins)
                    
                }
            }),
            new Button(this, 75, 35, t[2], () => {
                if (list.coins>=this.pe[2]) {
                    list.nivo+=1
                    list.coins-=this.pe[2]
                    this.pe[2]+=40
                    this.registry.set('nivo',list.nivo)
                    this.registry.set('coins',list.coins)
                   
                }
            })
        ]
        
        let group = this.add.group(btns.map((e)=>e.container))
        Phaser.Actions.GridAlign(group.getChildren(), {
            width: 60,
            height: -1,
            cellWidth: 70,
            cellHeight: 80,
            x: 120,
            y: 140
        });
        this.text=this.pe.map((e)=>this.add.text(0,0,e))
        let grt= this.add.group(this.text)
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
        this.scoreText.setText( `coins: ${this.registry.list.coins}`);
        for (const item in this.text) {
            this.text[item].setText(this.pe[item]);
        }
    }
    updateData(parent, key, data){
        this[key]=data;
    }
}
export default Upgrade