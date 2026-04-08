class map1scene extends Phaser.Scene {

    constructor ()
    {
        super('map1scene');
    }

    preload() {
        this.load.image("map1scene", "assets/map1scene.png");
    }

    create () {

    this.add.image(320, 320, "map1scene").setScale(0.6);


    this.input.keyboard.once('keydown-SPACE', function(){
    console.log("Spacebar pressed, goto map1");
    this.scene.start("map1", { 
        playerPos: { x: 1200, y: 900 },  
        inventory: []                    
    });
}, this);


    }

}