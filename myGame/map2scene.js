class map2scene extends Phaser.Scene {

    constructor ()
    {
        super('map2scene');
    }

    preload() {
        this.load.image("map2scene", "assets/map2scene.png");
    }

    create () {

    this.add.image(320, 320, "map2scene").setScale(0.6);


    this.input.keyboard.once('keydown-SPACE', function(){
    console.log("Spacebar pressed, goto world");
    this.scene.start("map2", { 
        playerPos: { x: 1300, y: 850 },  
        inventory: []                    
    });
}, this);


    }

}