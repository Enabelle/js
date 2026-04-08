class main extends Phaser.Scene {

    constructor() {
        super({
            key: 'main'
        });

        // Put global variable here
    }

    preload() {

        this.load.image("start", "assets/start.png")
        this.load.audio("bgMusic", "assets/BGaudio.mp3")
    }

    create() {

        console.log('*** main scene');
        this.add.image(320, 350, 'start').setScale(0.6)

        this.music = this.sound.add('bgMusic', {
            volume: 0.3,
            loop: true
        });

        this.music.play()
        window.music = this.music


        // Add image and detect spacebar keypress
        //this.add.image(0, 0, 'main').setOrigin(0, 0);

        // Check for spacebar or any key here
        var spaceDown = this.input.keyboard.addKey('SPACE');

        // On spacebar event, call the world scene        
        this.input.keyboard.once('keydown-SPACE', function () {
            console.log("Going to introScene");
            let playerPos = { x: 300, y: 300 };
            this.scene.start("introScene", {
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