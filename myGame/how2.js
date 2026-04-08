class how2 extends Phaser.Scene {

    constructor() {
        super({
            key: 'how2'
        });

        // Put global variable here
    }

    preload() {

        this.load.image("how2", "assets/how2.png")
    }

    create() {

        console.log('*** main scene');
        this.add.image(320, 350, 'how2').setScale(0.6)

        // Check for spacebar or any key here
        var spaceDown = this.input.keyboard.addKey('SPACE');

        // On spacebar event, call the world scene        
        this.input.keyboard.once('keydown-SPACE', function () {
            console.log("Going to world");
            let playerPos = { x: 300, y: 300 };
            this.scene.start("world", {
                playerPos: playerPos,
                inventory: this.inventory,
            });

            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }

            if (!this.music.isPlaying) {
                this.music.play();
            }

        }, this);

    }


}