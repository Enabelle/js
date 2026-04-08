class introScene extends Phaser.Scene {

    constructor ()
    {
        super('introScene');
    }

    preload() {
        this.load.image("intro", "assets/intro.png");
    }

    create () {

    this.add.image(320, 320, "intro").setScale(0.6);


    this.input.keyboard.once('keydown-SPACE', function(){
    console.log("Spacebar pressed, goto world");
    this.scene.start("world", { 
        playerPos: { x: 300, y: 300 },  
        inventory: []                    
    });
}, this);


    }

}