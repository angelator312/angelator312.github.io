import Upgrade from "./upgrademenu.js";
import Preload from "./preload.js";
import Level1 from "./level1.js"
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
    scene: [Preload,Level1,Upgrade]
};



var game = new Phaser.Game(config);
