class map3scene extends Phaser.Scene {

    constructor ()
    {
        super('map3scene');
    }

    preload() {
        this.load.image("map3scene", "assets/map3scene.png");
    }

    create () {

    this.add.image(320, 320, "map3scene").setScale(0.6);


    this.input.keyboard.once('keydown-SPACE', function(){
    console.log("Spacebar pressed, goto world");
    this.scene.start("map3", { 
        playerPos: { x: 200, y: 800 },  
        inventory: []                    
    });
}, this);


    }

}