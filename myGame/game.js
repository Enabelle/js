var config = {
    type: Phaser.AUTO,
    // pixel size * tile map size * zoom 
    width: 32 * 20,
    height: 32 * 20,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000000',
    pixelArt: true,
    scene: [main, introScene,how,how2, world, map1, map2, map3, gameoverScene,winScene,map1scene,map2scene,map3scene,winScene2]
};

var game = new Phaser.Game(config);

let seedcounter = 0;
let life = 3;
let gumcounter = 0;
let datecounter = 0;

let collectedItems = new Set();