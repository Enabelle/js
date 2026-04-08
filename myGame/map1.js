class map1 extends Phaser.Scene {

    constructor() {
        super({ key: 'map1' });
        // Put global variable here
    }

    init(data) {
        this.playerPos = (data && data.playerPos) ? data.playerPos : { x: 1200, y: 900 };
        this.inventory = (data && data.inventory) ? data.inventory : [];
    }

    preload() {
        this.load.tilemapTiledJSON("map1", "assets/map1.json");

        this.load.audio("explod", "assets/explod.mp3")
        this.load.audio("collect", "assets/collect.mp3")

        this.load.image("forest", "assets/Forest.png");
        this.load.image("forests", "assets/forest2.png");
        this.load.image("houses", "assets/house.png");
        this.load.image("houses2", "assets/house2.png");
        this.load.image("outdoor", "assets/outdoors.png");
        this.load.image("outdoors", "assets/Outdoors2.png");
        this.load.image("seeda", "assets/seedA.png");
        this.load.image("heart", "assets/heart.png");
        this.load.spritesheet('mao', 'assets/maomao.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("seed", "assets/seed.png", { frameWidth: 32, frameHeight: 32, });
        this.load.spritesheet("badseed", "assets/seed.png", { frameWidth: 32, frameHeight: 32, });
        this.load.spritesheet('enemy', 'assets/seed.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        console.log('*** map1 scene');

        // ── Flags ──────────────────────────────────────────────
        this.seedCollected = false;
        this.warningActive = false;

        this.damageSfx = this.sound.add("explod");

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

        // ── HUD icons + counters ───────────────────────────────

        this.add.image(75, 40, 'seeda').setScrollFactor(0).setDepth(999).setScale(1.5);
        this.seedText = this.add.text(75, 40, 'x 0', {
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
        let seed1 = map.findObject("objectLayer", (obj) => obj.name === "seed1");
        let seed2 = map.findObject("objectLayer", (obj) => obj.name === "seed2");
        let seed3 = map.findObject("objectLayer", (obj) => obj.name === "seed3");
        let badseed = map.findObject("objectLayer", (obj) => obj.name === "badseed");
        let badseed2 = map.findObject("objectLayer", (obj) => obj.name === "badseed2");


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
            key: 'seed-spin',
            frames: this.anims.generateFrameNumbers('seed', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'badseed-spin',
            frames: this.anims.generateFrameNumbers('badseed', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy-left',
            frames: this.anims.generateFrameNumbers('enemy', { start: 9, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy-right',
            frames: this.anims.generateFrameNumbers('enemy', { start: 6, end: 8 }),
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

        this.seed1   = makeItem(seed1,   'seed', 'seed-spin',    1.2, 'map1-seed1');
        this.seed2   = makeItem(seed2,   'seed', 'seed-spin',    1.2, 'map1-seed2');
        this.seed3   = makeItem(seed3,   'seed', 'seed-spin',    1.2, 'map1-seed3');
        this.badseed  = makeItem(badseed,  'seed', 'badseed-spin', 2,   'map1-badseed');
        this.badseed2 = makeItem(badseed2, 'seed', 'badseed-spin', 2,   'map1-badseed2');

        this.enemy = this.physics.add.sprite(900, 400, 'enemy').play('enemy-right').setScale(2);
        this.enemy.body.setCollideWorldBounds(true);
        this.enemy.speed = 80;
        this.enemy.direction = 'right';
        this.enemy.patrolLeft = 700;   // left boundary
        this.enemy.patrolRight = 900;  // right boundary

        this.enemy2 = this.physics.add.sprite(1200, 1000, 'enemy').play('enemy-right').setScale(2);
        this.enemy2.body.setCollideWorldBounds(true);
        this.enemy2.speed = 80;
        this.enemy2.direction = 'right';
        this.enemy2.patrolLeft = 1000;      
        this.enemy2.patrolRight = 1200;
        this.physics.add.overlap(this.player, this.enemy2, this.hitEnemy, null, this);

        this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);


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

        middleLayer.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, middleLayer);

        topLayer.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, topLayer);

        // Restore seedCollected flag if any seed was already picked up
        if (collectedItems.has('map1-seed1') || collectedItems.has('map1-seed2') || collectedItems.has('map1-seed3')) {
            this.seedCollected = true;
        }
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

        if (this.enemy.direction === 'right') {
            this.enemy.body.setVelocityX(this.enemy.speed);
            this.enemy.anims.play('enemy-right', true);
            if (this.enemy.x > this.enemy.patrolRight) {
                this.enemy.direction = 'left';
            }
        } else {
            this.enemy.body.setVelocityX(-this.enemy.speed);
            this.enemy.anims.play('enemy-left', true);
            if (this.enemy.x < this.enemy.patrolLeft) {
                this.enemy.direction = 'right';
            }
        }

        if (this.enemy2.direction === 'right') {
            this.enemy2.body.setVelocityX(this.enemy2.speed);
            this.enemy2.anims.play('enemy-right', true);
            if (this.enemy2.x > this.enemy2.patrolRight) this.enemy2.direction = 'left';
        } else {
            this.enemy2.body.setVelocityX(-this.enemy2.speed);
            this.enemy2.anims.play('enemy-left', true);
            if (this.enemy2.x < this.enemy2.patrolLeft) this.enemy2.direction = 'right';
        }


        // ── Exit gates ─────────────────────────────────────────
        const inGate1 = this.player.x > 1396 && this.player.x < 1463 &&
            this.player.y > 983 && this.player.y < 1064;

        const inGate2 = this.player.x > 1498 && this.player.x < 1562 &&
            this.player.y > 874 && this.player.y < 938;

        if (inGate1 || inGate2) {
    if (!this.seedCollected) {
        this.showWarning();
    } else {
        this.scene.start("world", { 
            playerPos: { x: 460, y: 980 },
            inventory: this.inventory 
        });
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

    collectseed(zone, seed) {
        if (collectedItems.has(seed.itemName)) return;
        collectedItems.add(seed.itemName);
        seedcounter++;
        this.sound.play("collect");
        this.seedText.setText(`x ${seedcounter}`);
        seed.disableBody(true, true);
        this.seedCollected = true;
    }

    collectbadseed(player, badseed) {
        life--;
        this.sound.play("explod");
        this.cameras.main.shake(300);
        this.lifeText.setText(`x ${life}`);
        badseed.disableBody(true, true);
        if (life < 1) {
            this.scene.start("gameoverScene");
        }
    }

    hitEnemy(player, enemy) {
        if (this.player.isInvincible) return;
        life--;
        this.sound.play("explod");  
        this.cameras.main.shake(300);
        this.lifeText.setText(`x ${life}`);
        this.player.isInvincible = true;
        this.player.setAlpha(0.5);
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.player.isInvincible = false;
                this.player.setAlpha(1);
            },
            callbackScope: this
        });
        if (life < 1) {
            this.scene.start("gameoverScene");
        }
    }

    world() {
        console.log("world function");
        let playerPos = { x: 1200, y: 900 };
        this.scene.start("world", { 
    playerPos: { x: 460, y: 980 },  
    inventory: this.inventory 
});
    }
}