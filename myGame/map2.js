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

    this.load.image("tree", "assets/tree.png");
    this.load.image("forests", "assets/forest2.png");
    this.load.image("houses2", "assets/house2.png");
    this.load.image("outdoors", "assets/Outdoors2.png");
    this.load.image("gum", "assets/oca.png");
    this.load.image("badgum", "assets/myoga.png");
    this.load.spritesheet('doc', 'assets/doc.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    console.log('*** map2 scene');

    // ── Flags ──────────────────────────────────────────────
    this.ocaCollected = false;
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

    // ── HUD text ───────────────────────────────────────────
    this.ocaText = this.add.text(
      100, 100, 'oca: 0', { fontSize: '24px', fill: '#ff00ff' }
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
let gum = map.findObject("objectLayer", (obj) => obj.name === "gum");
this.oca1 = this.physics.add.sprite(gum.x, gum.y, 'gum');

let gum2 = map.findObject("objectLayer", (obj) => obj.name === "gum2");
this.oca2 = this.physics.add.sprite(gum2.x, gum2.y, 'gum');

let gum3 = map.findObject("objectLayer", (obj) => obj.name === "gum3");
this.oca3 = this.physics.add.sprite(gum3.x, gum3.y, 'gum');

let badgum = map.findObject("objectLayer", (obj) => obj.name === "badgum");
this.myoga = this.physics.add.sprite(badgum.x, badgum.y, 'badgum');

let badgum2 = map.findObject("objectLayer", (obj) => obj.name === "badgum2");
this.myoga2 = this.physics.add.sprite(badgum2.x, badgum2.y, 'badgum');

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
    this.player = this.physics.add.sprite(1370, 765, "doc").play("doc-down");
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
    this.physics.add.overlap(this.collectZone, this.oca1, this.collectoca, null, this);
    this.physics.add.overlap(this.collectZone, this.oca2, this.collectoca, null, this);
    this.physics.add.overlap(this.collectZone, this.oca3, this.collectoca, null, this);
    this.physics.add.overlap(this.collectZone, this.myoga, this.collectmyoga, null, this);
    this.physics.add.overlap(this.collectZone, this.myoga2, this.collectmyoga, null, this);
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

  collectoca(zone, oca) {
    console.log("Player collect oca");
    ocacounter++;
    this.ocaText.setText(`Oca: ${ocacounter}`);
    oca.disableBody(true, true);
    this.ocaCollected = true;  // unlocks exit gate
  }

  collectmyoga(zone, myoga) {
    console.log("Player collect myoga");
    life--;
    this.cameras.main.shake(300);
    this.lifeText.setText(`Life: ${life}`);
    myoga.disableBody(true, true);
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