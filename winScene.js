class winScene extends Phaser.Scene {

    constructor ()
    {
        super('winScene');
    }

    preload() {
        this.load.image("winscene", "assets/winscene.png");
    }

    create () {
        this.add.image(320, 320, "winscene").setScale(0.6);

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, goto endScene");
        this.scene.start("world");
        }, this );

    }

}