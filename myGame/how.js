class how extends Phaser.Scene {

    constructor() {
        super({
            key: 'how'
        });

        // Put global variable here
    }

    preload() {

        this.load.image("how", "assets/how.png")

    }

    create() {

        console.log('*** main scene');
        this.add.image(320, 350, 'how').setScale(0.6)



        // Check for spacebar or any key here
        var spaceDown = this.input.keyboard.addKey('SPACE');

        // On spacebar event, call the world scene        
        this.input.keyboard.once('keydown-SPACE', function () {
            console.log("Going to how2");
            let playerPos = { x: 300, y: 300 };
            this.scene.start("how2", {
                playerPos: playerPos,
                inventory: this.inventory,
            });

            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }


        }, this);

    }


}