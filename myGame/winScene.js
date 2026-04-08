class winScene extends Phaser.Scene {

    constructor ()
    {
        super('winScene');
    }

    preload() {
        this.load.image("winscene", "assets/winscene.png");
        this.load.audio("win", "assets/win.mp3")
    }

    create () {
        this.add.image(320, 320, "winscene").setScale(0.6);

            this.music = this.sound.add('win', {
            volume: 0.3,
        });

        this.music.play()
        window.music = this.music

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, goto endScene");
        this.scene.start("winScene2");
        }, this );

    }

}