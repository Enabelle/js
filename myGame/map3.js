class map3 extends Phaser.Scene {

    constructor() {
        super({ key: 'map3' });
    }

    init(data) {
        this.playerPos = data.playerPos;
        this.inventory = data.inventory;
    }

    preload() {
        this.load.tilemapTiledJSON("map3", "assets/map3.json");

        this.load.image("forest",   "assets/Forest.png");
        this.load.image("forests",  "assets/forest2.png");
        this.load.image("outdoor",  "assets/outdoors.png");
        this.load.image("outdoors", "assets/Outdoors2.png");
        this.load.image("date",     "assets/potato_red.png");
        this.load.image("baddate",  "assets/potato_yellow.png");
        this.load.spritesheet('doc', 'assets/doc.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        console.log('*** map3 scene');

        // ── Flags ──────────────────────────────────────────────
        this.dateCollected = false;
        this.warningActive = false;

        let map = this.make.tilemap({ key: "map3" });

        let forestTiles   = map.addTilesetImage("Forest",    "forest");
        let forestsTiles  = map.addTilesetImage("forest2",   "forests");
        let outdoorTiles  = map.addTilesetImage("outdoors",  "outdoor");
        let outdoorsTiles = map.addTilesetImage("Outdoors2", "outdoors");

        let tilesArray = [outdoorsTiles, forestTiles, forestsTiles, outdoorTiles];

        let groundLayer = map.createLayer("bottom", tilesArray, 0, 0);
        let midLayer    = map.createLayer("middle", tilesArray, 0, 0);
        let topLayer    = map.createLayer("top",    tilesArray, 0, 0);

        // ── HUD text ───────────────────────────────────────────
        this.dateText = this.add.text(
            100, 100, 'date: 0', { fontSize: '24px', fill: '#ff00ff' }
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
let dateObj = map.findObject("Object Layer 1", (obj) => obj.name === "date");
this.date1 = this.physics.add.sprite(dateObj.x, dateObj.y, 'date');

let date2Obj = map.findObject("Object Layer 1", (obj) => obj.name === "date2");
this.date2 = this.physics.add.sprite(date2Obj.x, date2Obj.y, 'date');

let date3Obj = map.findObject("Object Layer 1", (obj) => obj.name === "date3");
this.date3 = this.physics.add.sprite(date3Obj.x, date3Obj.y, 'date');

let baddateObj = map.findObject("Object Layer 1", (obj) => obj.name === "baddate");
this.baddate = this.physics.add.sprite(baddateObj.x, baddateObj.y, 'baddate');

let baddate2Obj = map.findObject("Object Layer 1", (obj) => obj.name === "baddate2");
this.baddate2 = this.physics.add.sprite(baddate2Obj.x, baddate2Obj.y, 'baddate');

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
        this.player = this.physics.add.sprite(130, 860, "doc").play("doc-down");
        this.player.body.setSize(32, 32);
        this.player.body.setOffset(16, 32);
        window.player = this.player;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player);

        // ── Collect zone ───────────────────────────────────────
        this.collectZone = this.add.zone(this.player.x, this.player.y, 100, 100);
        this.physics.add.existing(this.collectZone);
        this.collectZone.body.setCircle(50);

        // ── Camera / world bounds ──────────────────────────────
        const mapWidth  = map.widthInPixels;
        const mapHeight = map.heightInPixels;
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.physics.world.bounds.width  = groundLayer.width;
        this.physics.world.bounds.height = groundLayer.height;
        this.player.setCollideWorldBounds(true);

        // ── Tile collisions ────────────────────────────────────
        midLayer.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, midLayer);

        topLayer.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, topLayer);

        // ── Overlap / collectible callbacks ────────────────────
        this.physics.add.overlap(this.collectZone, this.date1,   this.collectdate,    null, this);
        this.physics.add.overlap(this.collectZone, this.date2,   this.collectdate,    null, this);
        this.physics.add.overlap(this.collectZone, this.date3,   this.collectdate,    null, this);
        this.physics.add.overlap(this.collectZone, this.baddate,  this.collectbaddate, null, this);
        this.physics.add.overlap(this.collectZone, this.baddate2, this.collectbaddate, null, this);
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
        // ── Sync collect zone ──────────────────────────────────
        this.collectZone.body.reset(this.player.x, this.player.y);

        // ── Exit gate — guarded by dateCollected ───────────────
        if (
            this.player.x > 28 &&
            this.player.x < 92 &&
            this.player.y > 833 &&
            this.player.y < 897
        ) {
            if (!this.dateCollected) {
                this.showWarning();   // blocked
            } else {
                this.world();         // allowed
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

    collectdate(zone, date) {
        console.log("Player collect date");
        datecounter++;
        this.dateText.setText(`Date: ${datecounter}`);
        date.disableBody(true, true);
        this.dateCollected = true;  // unlocks exit gate
    }

    collectbaddate(zone, baddate) {
        console.log("Player collect baddate");
        life--;
        this.cameras.main.shake(300);
        this.lifeText.setText(`Life: ${life}`);
        baddate.disableBody(true, true);
        if (life < 1) {
            this.scene.start("gameoverScene");
        }
    }

    world() {
        console.log("world function");
        let playerPos = { x: 1220, y: 1340 };
        this.scene.start("world", {
            playerPos: playerPos,
            inventory: this.inventory,
        });
    }
}