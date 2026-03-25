class map1 extends Phaser.Scene {

    constructor() {
        super({ key: 'map1' });
        // Put global variable here
    }

    init(data) {
        this.playerPos = data.playerPos;
        this.inventory = data.inventory;
    }

    preload() {
        this.load.tilemapTiledJSON("map1", "assets/map1.json");

        this.load.image("forest", "assets/Forest.png");
        this.load.image("forests", "assets/forest2.png");
        this.load.image("houses", "assets/house.png");
        this.load.image("houses2", "assets/house2.png");
        this.load.image("outdoor", "assets/outdoors.png");
        this.load.image("outdoors", "assets/Outdoors2.png");
        this.load.image("seed", "assets/seed.png");
        this.load.image("badseed", "assets/Heart.png");
        this.load.spritesheet('doc', 'assets/doc.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        console.log('*** map1 scene');

        // ── Flags ──────────────────────────────────────────────
        this.seedCollected = false;
        this.warningActive = false;

        // Create the map from main
        let map = this.make.tilemap({ key: "map1" });

        // Load the game tiles
        let forestTiles = map.addTilesetImage("Forest", "forest");
        let forestsTiles = map.addTilesetImage("forest2", "forests");
        let houseTiles = map.addTilesetImage("house", "houses");
        let housesTiles = map.addTilesetImage("house2", "houses2");
        let outdoorTiles = map.addTilesetImage("outdoors", "outdoor");
        let outdoorsTiles = map.addTilesetImage("Outdoors2", "outdoors");

        let tilesArray = [outdoorsTiles, houseTiles, housesTiles, forestTiles, forestsTiles, outdoorTiles];

        let groundLayer = map.createLayer("bottom", tilesArray, 0, 0);
        let midLayer = map.createLayer("middle", tilesArray, 0, 0);
        let middleLayer = map.createLayer("middle top", tilesArray, 0, 0);
        let topLayer = map.createLayer("top", tilesArray, 0, 0);

        // ── HUD text ───────────────────────────────────────────
        this.seedText = this.add.text(
            100, 100, 'seed: 0', { fontSize: '24px', fill: '#ff00ff' }
        ).setScrollFactor(0).setDepth(999);

        this.lifeText = this.add.text(
            200, 100, 'life: 5', { fontSize: '24px', fill: '#ff00ff' }
        ).setScrollFactor(0).setDepth(999);

        // ── Warning text ───────────────────────────────────────
        const cam = this.cameras.main;
        this.warningText = this.add.text(
            cam.width / 2, cam.height - 80,
            "Collect an item in this room first!",
            {
                fontSize: '20px',
                fill: '#ff0000',
                fontStyle: 'bold',
            }
        )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(100)
            .setAlpha(0);

        // ── Collectibles from object layer ─────────────────────
        let seed1 = map.findObject("objectLayer", (obj) => obj.name === "seed1");
        this.seed1 = this.physics.add.sprite(seed1.x, seed1.y, 'seed');

        let seed2 = map.findObject("objectLayer", (obj) => obj.name === "seed2");
        this.seed2 = this.physics.add.sprite(seed2.x, seed2.y, 'seed');

        let seed3 = map.findObject("objectLayer", (obj) => obj.name === "seed3");
        this.seed3 = this.physics.add.sprite(seed3.x, seed3.y, 'seed');

        let badseed = map.findObject("objectLayer", (obj) => obj.name === "badseed");
        this.badseed = this.physics.add.sprite(badseed.x, badseed.y, 'badseed');

        let badseed2 = map.findObject("objectLayer", (obj) => obj.name === "badseed2");
        this.badseed2 = this.physics.add.sprite(badseed2.x, badseed2.y, 'badseed');

        // ── Player animations ──────────────────────────────────
        this.anims.create({
            key: 'doc-left',
            frames: this.anims.generateFrameNumbers('doc', { start: 65, end: 72 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'doc-right',
            frames: this.anims.generateFrameNumbers('doc', { start: 91, end: 98 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'doc-up',
            frames: this.anims.generateFrameNumbers('doc', { start: 52, end: 59 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'doc-down',
            frames: this.anims.generateFrameNumbers('doc', { start: 78, end: 85 }),
            frameRate: 24,
            repeat: -1
        });

        // ── Player ─────────────────────────────────────────────
        this.player = this.physics.add.sprite(1416, 896, "doc").play("doc-down");
        this.player.body.setSize(32, 32);
        this.player.body.setOffset(16, 32);
        window.player = this.player;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player);

        // ── Collect zone ───────────────────────────────────────
        this.collectZone = this.add.zone(this.player.x, this.player.y, 100, 100);
        this.physics.add.existing(this.collectZone);
        this.collectZone.body.setCircle(50);

        // ── World / camera bounds ──────────────────────────────
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.physics.world.bounds.width = groundLayer.width;
        this.physics.world.bounds.height = groundLayer.height;
        this.player.setCollideWorldBounds(true);

        // ── Tile collisions ────────────────────────────────────
        midLayer.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, midLayer);

        middleLayer.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, middleLayer);

        topLayer.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, topLayer);

        // ── Overlap / collectible callbacks ────────────────────
        this.physics.add.overlap(this.collectZone, this.seed1, this.collectseed, null, this);
        this.physics.add.overlap(this.collectZone, this.seed2, this.collectseed, null, this);
        this.physics.add.overlap(this.collectZone, this.seed3, this.collectseed, null, this);
        this.physics.add.overlap(this.collectZone, this.badseed, this.collectbadseed, null, this);
        this.physics.add.overlap(this.collectZone, this.badseed2, this.collectbadseed, null, this);
    }

    // ── Warning banner ─────────────────────────────────────────
    showWarning() {
        if (this.warningActive) return;
        this.warningActive = true;

        this.tweens.killTweensOf(this.warningText);

        this.warningText.setAlpha(1);
        this.tweens.add({
            targets: this.warningText,
            alpha: 0,
            delay: 2000,
            duration: 600,
            ease: 'Linear',
            onComplete: () => {
                this.warningActive = false;
            }
        });
    }

    update() {
        this.collectZone.x = this.player.x;
        this.collectZone.y = this.player.y;

        this.collectZone.body.reset(this.player.x, this.player.y);


        // ── Exit gate — guarded by shirtCollected flag ─────────
 if (
        this.player.x > 1396 &&
        this.player.x < 1463 &&
        this.player.y > 983 &&
        this.player.y < 1064
    ) {
        if (!this.seedCollected) {
            this.showWarning();                                        // blocked
        } else {
            this.scene.start("world", { inventory: this.inventory }); // allowed
        }
    }

        // ── Original world-transition zone ─────────────────────
if (
        this.player.x > 1498 &&
        this.player.x < 1562 &&
        this.player.y > 874 &&
        this.player.y < 938
    ) {
        if (!this.seedCollected) {
            this.showWarning();  // blocked
        } else {
            this.world();        // allowed
        }
    }

        // ── Movement ───────────────────────────────────────────
    let speed = 200;

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-speed);
        this.player.anims.play("doc-left", true);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(speed);
        this.player.anims.play("doc-right", true);
    } else if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-speed);
        this.player.anims.play("doc-up", true);
    } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(speed);
        this.player.anims.play("doc-down", true);
    } else {
        this.player.anims.stop();
        this.player.body.setVelocity(0, 0);
    }
}

    collectseed(player, seed) {
        console.log("Player collect seed");
        seedcounter++;
        this.seedText.setText(`Seed: ${seedcounter}`);
        seed.disableBody(true, true);
        this.seedCollected = true;  // <-- add this line
    }

    collectbadseed(player, badseed) {
        console.log("Player collect bad seed");
        life--;
        this.cameras.main.shake(300);
        this.lifeText.setText(`Life: ${life}`);
        badseed.disableBody(true, true);
        if (life < 1) {
            this.scene.start("gameoverScene");
        }
    }

    // ── Seedpickup — sets the gate flag ─────────────────────
    collectseed(player, seed) {
        seed.destroy();
        this.seedCollected = true;   // unlocks the exit gate
    }

    world() {
        console.log("world function");
        let playerPos = { x: 400, y: 950 };
        this.scene.start("world", {
            playerPos: playerPos,
            inventory: this.inventory,
        });
    }
}
