class winScene2 extends Phaser.Scene {

    constructor ()
    {
        super('winScene2');
    }

    preload() {
        this.load.image("winscene2", "assets/winscene2.png");
    }

    create () {
        this.add.image(320, 320, "winscene2").setScale(0.6);

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, goto world");
        this.scene.start("world");
        }, this );

    }

}