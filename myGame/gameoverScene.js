class gameoverScene extends Phaser.Scene {

    constructor ()
    {
        super('gameoverScene');
    }

    preload() {
        this.load.image("gameover", "assets/gameover.png");
    }

    create () {
        this.add.image(320,320,"gameover")

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, goto endScene");
        this.scene.start("preloadScene");
        }, this );

    }

}