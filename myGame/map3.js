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

        this.load.audio("explod", "assets/explod.mp3")
        this.load.audio("collect", "assets/collect.mp3")

        this.load.image("forest", "assets/Forest.png");
        this.load.image("forests", "assets/forest2.png");
        this.load.image("outdoor", "assets/outdoors.png");
        this.load.image("outdoors", "assets/Outdoors2.png");
        this.load.image("heart", "assets/heart.png");
        this.load.image("dates", "assets/dates.png");
        this.load.spritesheet('mao', 'assets/maomao.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('date', 'assets/date.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('baddate', 'assets/date.png', { frameWidth: 32, frameHeight: 32 });

    }

    create() {
        console.log('*** map3 scene');

        // ── Flags ──────────────────────────────────────────────
        this.dateCollected = false;
        this.warningActive = false;

        let map = this.make.tilemap({ key: "map3" });

        let forestTiles = map.addTilesetImage("Forest", "forest");
        let forestsTiles = map.addTilesetImage("forest2", "forests");
        let outdoorTiles = map.addTilesetImage("outdoors", "outdoor");
        let outdoorsTiles = map.addTilesetImage("Outdoors2", "outdoors");

        let tilesArray = [outdoorsTiles, forestTiles, forestsTiles, outdoorTiles];

        let groundLayer = map.createLayer("bottom", tilesArray, 0, 0);
        let midLayer = map.createLayer("middle", tilesArray, 0, 0);
        let topLayer = map.createLayer("top", tilesArray, 0, 0);

        // ── HUD text ───────────────────────────────────────────
        this.add.image(75, 40, 'dates').setScrollFactor(0).setDepth(999).setScale(1.5);
        this.dateText = this.add.text(75, 40, 'x 0', {
            fontSize: '20px', fill: '#ffffff', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(999);

        this.add.image(75, 80, 'heart').setScrollFactor(0).setDepth(999).setScale(3);
        this.lifeText = this.add.text(75, 80, `x ${life}`, {
            fontSize: '20px', fill: '#ffffff', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3
        }).setScrollFactor(0).setDepth(999);

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
        let date = map.findObject("objectLayer", (obj) => obj.name === "date");
        let date2 = map.findObject("objectLayer", (obj) => obj.name === "date2");
        let date3 = map.findObject("objectLayer", (obj) => obj.name === "date3");
        let baddate = map.findObject("objectLayer", (obj) => obj.name === "baddate");
        let baddate2 = map.findObject("objectLayer", (obj) => obj.name === "baddate2");


        // ── Player animations ──────────────────────────────────
        this.anims.create({
            key: 'mao-down',
            frames: this.anims.generateFrameNumbers('mao', { start: 0, end: 2 }),
            frameRate: 8, repeat: -1
        });

        this.anims.create({
            key: 'mao-right', frames: this.anims.generateFrameNumbers('mao', { start: 3, end: 5 }),
            frameRate: 8, repeat: -1
        });

        this.anims.create({
            key: 'mao-left', frames: this.anims.generateFrameNumbers('mao', { start: 6, end: 8 }),
            frameRate: 8, repeat: -1
        });

        this.anims.create({
            key: 'mao-up', frames: this.anims.generateFrameNumbers('mao', { start: 9, end: 11 }),
            frameRate: 8, repeat: -1
        });

        this.anims.create({
            key: 'date-spin',
            frames: this.anims.generateFrameNumbers('date', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'baddate-spin',
            frames: this.anims.generateFrameNumbers('baddate', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        // ── Player ─────────────────────────────────────────────
        this.player = this.physics.add.sprite(this.playerPos.x, this.playerPos.y, 'mao').play('mao-down').setScale(2);
        this.player.body.setSize(16, 20);
        this.player.body.setOffset(8, 6);
        window.player = this.player;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player);
        this.isMoving = false;

        const makeItem = (obj, key, anim, scale, name) => {
            const sprite = this.physics.add.sprite(obj.x, obj.y, key).play(anim).setScale(scale);
            sprite.itemName = name;
            if (collectedItems.has(name)) sprite.disableBody(true, true);
            return sprite;
        };

        this.date = makeItem(date, 'date', 'date-spin', 1.2, 'map3-date');
        this.date2 = makeItem(date2, 'date', 'date-spin', 1.2, 'map3-date2');
        this.date3 = makeItem(date3, 'date', 'date-spin', 1.2, 'map3-date3');
        this.baddate = makeItem(baddate, 'baddate', 'baddate-spin', 1.2, 'map3-baddate');
        this.baddate2 = makeItem(baddate2, 'baddate', 'baddate-spin', 1.2, 'map3-baddate2');

        // Restore flag if already collected
        if (collectedItems.has('map3-date') || collectedItems.has('map3-date2') || collectedItems.has('map3-date3')) {
            this.dateCollected = true;
        }

        // ── Collect zone ───────────────────────────────────────
        this.collectZone = this.add.zone(0, 0, 32, 32);
        this.physics.add.existing(this.collectZone);
        let zoneRadius = 20;
        this.collectZone.body.setCircle(zoneRadius);
        this.collectZone.body.setOffset(-zoneRadius + 16, -zoneRadius + 16);

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

        topLayer.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, topLayer);

        // ── Overlap / collectible callbacks ────────────────────
        this.physics.add.overlap(this.collectZone, this.date, this.collectdate, null, this);
        this.physics.add.overlap(this.collectZone, this.date2, this.collectdate, null, this);
        this.physics.add.overlap(this.collectZone, this.date3, this.collectdate, null, this);
        this.physics.add.overlap(this.collectZone, this.baddate, this.collectbaddate, null, this);
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
        if (!this.dialogueActive) {
            let speed = 250;

            this.player.body.setVelocity(0);
            this.player.body.setDrag(1000, 1000);

            let moving = false;

            if (this.cursors.left.isDown) {
                this.player.body.setVelocityX(-speed);
                this.player.anims.play("mao-left", true);
                moving = true;
            }
            else if (this.cursors.right.isDown) {
                this.player.body.setVelocityX(speed);
                this.player.anims.play("mao-right", true);
                moving = true;
            }
            else if (this.cursors.up.isDown) {
                this.player.body.setVelocityY(-speed);
                this.player.anims.play("mao-up", true);
                moving = true;
            }
            else if (this.cursors.down.isDown) {
                this.player.body.setVelocityY(speed);
                this.player.anims.play("mao-down", true);
                moving = true;
            }

            if (!moving) {
                this.player.anims.stop();
                const currentAnim = this.player.anims.currentAnim;
                if (currentAnim) {
                    this.player.setFrame(currentAnim.frames[1].frame.name);
                }
            }
        }
    }

    collectdate(zone, date) {
        if (collectedItems.has(date.itemName)) return;
        collectedItems.add(date.itemName);
        datecounter++;
        this.sound.play("collect");
        this.dateText.setText(`Date: ${datecounter}`);
        date.disableBody(true, true);
        this.dateCollected = true;
    }

    collectbaddate(zone, baddate) {
        console.log("Player collect baddate");
        life--;
        this.sound.play("explod");
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