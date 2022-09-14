import Upgrade from "./upgrademenu.js";
import Preload from "./preload.js";
import Level1 from "./level1.js";
import Level2 from "./level2.js";
import Level3 from "./level3.js";
import Level4 from "./level4.js";
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
    scene: [Preload,Level1,Level2,Level3,Level4,Upgrade]
};



var game = new Phaser.Game(config);
