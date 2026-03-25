class main extends Phaser.Scene {

    constructor() {
        super({
            key: 'main'
        });

        // Put global variable here
    }

    preload() {

        this.load.image("start", "assets/start.png")
        this.load.audio("bgMusic", "assets/Bgaudio.mp3")
    }

    create() {

        console.log('*** main scene');
        this.add.image(320, 350, 'start').setScale(0.6)

        this.music = this.sound.add('bgMusic').setVolume(0.3) // 10% volume

        this.music.play()
        window.music = this.music


        // Add image and detect spacebar keypress
        //this.add.image(0, 0, 'main').setOrigin(0, 0);

        // Check for spacebar or any key here
        var spaceDown = this.input.keyboard.addKey('SPACE');

        // On spacebar event, call the world scene        
        spaceDown.on('down', function () {

            console.log("world function");
            let playerPos = {}
            playerPos.x = 300
            playerPos.y = 300
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



        // Add any text in the main page
        // this.add.text(90, 600, 'Press spacebar to continue', {
        //     font: '30px Courier',
        //     fill: '#FFFFFF'
        // });


        // Create all the game animations here

    }


}