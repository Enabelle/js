class map2 extends Phaser.Scene {

  constructor() {
    super({ key: 'map2' });
  }

  init(data) {
    this.playerPos = data.playerPos;
    this.inventory = data.inventory;
  }

  preload() {
    this.load.tilemapTiledJSON("map2", "assets/map2.json");

    this.load.audio("explod", "assets/explod.mp3")
    this.load.audio("collect", "assets/collect.mp3")

    this.load.image("tree", "assets/tree.png");
    this.load.image("forests", "assets/forest2.png");
    this.load.image("houses2", "assets/house2.png");
    this.load.image("outdoors", "assets/Outdoors2.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("gummy", "assets/gummy.png");
    this.load.spritesheet('mao', 'assets/maomao.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('gum', 'assets/gum.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('badgum', 'assets/gum.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    console.log('*** map2 scene');

    // ── Flags ──────────────────────────────────────────────
    this.gumCollected = false;
    this.warningActive = false;

    let map = this.make.tilemap({ key: "map2" });

    let forestsTiles = map.addTilesetImage("forest2", "forests");
    let treeTiles = map.addTilesetImage("tree", "tree");
    let housesTiles = map.addTilesetImage("house2", "houses2");
    let outdoorsTiles = map.addTilesetImage("Outdoors2", "outdoors");

    let tilesArray = [outdoorsTiles, housesTiles, forestsTiles, treeTiles];

    let groundLayer = map.createLayer("bottom", tilesArray, 0, 0);
    let midLayer = map.createLayer("middle", tilesArray, 0, 0);
    let topLayer = map.createLayer("top", tilesArray, 0, 0);

    // ── HUD icons + counters ───────────────────────────────

    this.add.image(75, 40, 'gummy').setScrollFactor(0).setDepth(999).setScale(1.5);
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
    this.anims.create({
      key: 'gum-spin',
      frames: this.anims.generateFrameNumbers('gum', { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'badgum-spin',
      frames: this.anims.generateFrameNumbers('badgum', { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

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

    // ── Player ─────────────────────────────────────────────
    this.player = this.physics.add.sprite(this.playerPos.x, this.playerPos.y, 'mao').play('mao-down').setScale(2);
    this.player.body.setSize(16, 20);
    this.player.body.setOffset(8, 6);
    window.player = this.player;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
    this.isMoving = false;

    // ── Collect zone ───────────────────────────────────────
    this.collectZone = this.add.zone(0, 0, 32, 32);
    this.physics.add.existing(this.collectZone);
    let zoneRadius = 20;
    this.collectZone.body.setCircle(zoneRadius);
    this.collectZone.body.setOffset(-zoneRadius + 16, -zoneRadius + 16);

    // ── Camera / world bounds ──────────────────────────────
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

    // ── gum ────────────────────
    let gum = map.findObject("objectLayer", (obj) => obj.name === "gum");
    let gum2 = map.findObject("objectLayer", (obj) => obj.name === "gum2");
    let gum3 = map.findObject("objectLayer", (obj) => obj.name === "gum3");
    let badgum = map.findObject("objectLayer", (obj) => obj.name === "badgum");
    let badgum2 = map.findObject("objectLayer", (obj) => obj.name === "badgum2");

    const makeItem = (obj, key, anim, scale, name) => {
      const sprite = this.physics.add.sprite(obj.x, obj.y, key).play(anim).setScale(scale);
      sprite.itemName = name;
      if (collectedItems.has(name)) sprite.disableBody(true, true);
      return sprite;
    };

    this.gum = makeItem(gum, 'gum', 'gum-spin', 1.2, 'map2-gum');
    this.gum2 = makeItem(gum2, 'gum', 'gum-spin', 1.2, 'map2-gum2');
    this.gum3 = makeItem(gum3, 'gum', 'gum-spin', 1.2, 'map2-gum3');
    this.badgum = makeItem(badgum, 'gum', 'badgum-spin', 1.2, 'map2-badgum');
    this.badgum2 = makeItem(badgum2, 'gum', 'badgum-spin', 1.2, 'map2-badgum2');

    // Restore flag if already collected
    if (collectedItems.has('map2-gum') || collectedItems.has('map2-gum2') || collectedItems.has('map2-gum3')) {
      this.ocaCollected = true;
    }

    this.physics.add.overlap(this.collectZone, this.gum, this.collectgum, null, this);
    this.physics.add.overlap(this.collectZone, this.gum2, this.collectgum, null, this);
    this.physics.add.overlap(this.collectZone, this.gum3, this.collectgum, null, this);
    this.physics.add.overlap(this.collectZone, this.badgum, this.collectbadgum, null, this);
    this.physics.add.overlap(this.collectZone, this.badgum2, this.collectbadgum, null, this);


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

    // ── Exit gate — guarded by ocaCollected ────────────────
    if (
      this.player.x > 1530 &&
      this.player.x < 1594 &&
      this.player.y > 718 &&
      this.player.y < 782
    ) {
      if (!this.ocaCollected) {
        this.showWarning();   // blocked
      } else {
        this.world();         // allowed
      }
    }

    // ── Movement ───────────────────────────────────────────
    let speed = 200;


    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play("mao-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play("mao-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      this.player.anims.play("mao-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
      this.player.anims.play("mao-down", true);
    } else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
    }

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



  collectgum(zone, gum) {
    if (collectedItems.has(gum.itemName)) return;
    collectedItems.add(gum.itemName);
    gumcounter++;
    this.sound.play("explod");
    this.seedText.setText(`x ${gumcounter}`);
    gum.disableBody(true, true);
    this.ocaCollected = true;
  }

  collectbadgum(zone, badgum) {
    console.log("Player collect badgum");
    life--;
    this.sound.play("explod");
    this.cameras.main.shake(300);
    this.lifeText.setText(`Life: ${life}`);
    badgum.disableBody(true, true);
    if (life < 1) {
      this.scene.start("gameoverScene");
    }
  }

  world() {
    console.log("world function");
    let playerPos = { x: 635, y: 1310 };
    this.scene.start("world", {
      playerPos: playerPos,
      inventory: this.inventory,
    });
  }
}