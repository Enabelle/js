class gameoverScene extends Phaser.Scene {

    constructor() {
        super('gameoverScene');
    }

    preload() {
        this.load.image("gameover", "assets/gameover.png");
        this.load.audio("failMusic", "assets/fail.mp3")
    }

    create() {
        this.add.image(320, 320, "gameover").setScale(0.6);

        this.music = this.sound.add('failMusic', {
            volume: 0.3,
        });

        this.music.play()
        window.music = this.music

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');

        spaceDown.on('down', function () {
            console.log("Spacebar pressed, goto endScene");
            life = 3;
            this.scene.start("map1");
        }, this);

    }

}