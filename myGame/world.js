class world extends Phaser.Scene {
  constructor() {
    super({
      key: "world",
    });

    // Put global variable here
  }

  // incoming data from scene below
  init(data) {
    this.playerPos = data.playerPos;
    this.inventory = data.inventory;
  }

  preload() {

    // this is the exported JSON map file
    this.load.tilemapTiledJSON("world", "assets/mainMap.json");


    this.load.image("forest", "assets/Forest.png");
    this.load.image("forests", "assets/forest2.png");
    this.load.image("houses", "assets/house.png");
    this.load.image("houses2", "assets/house2.png");
    this.load.image("house3", "assets/houses3.png");
    this.load.image("outdoor", "assets/outdoors.png");
    this.load.image("trees", "assets/tree.png");
    this.load.image("main", "assets/main.png");
    this.load.image("side", "assets/side.png");
    this.load.spritesheet('doc', 'assets/doc.png', { frameWidth: 64, frameHeight: 64 });

  }

  create() {
    console.log("*** world scene");

    // Create the map from main
    let map = this.make.tilemap({
      key: "world",
    });

    // Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload
    let forestTiles = map.addTilesetImage("Forest", "forest");
    let forestsTiles = map.addTilesetImage("forest2", "forests");
    let houseTiles = map.addTilesetImage("house", "houses");
    let housesTiles = map.addTilesetImage("house2", "houses2");
    let housessTiles = map.addTilesetImage("House3", "house3");
    let outdoorTiles = map.addTilesetImage("outdoors", "outdoor");
    let treeTiles = map.addTilesetImage("tree", "trees");

    let tilesArray = [treeTiles, houseTiles, housesTiles, housessTiles, forestTiles, forestsTiles, outdoorTiles]

    // Load in layers by layers
    let groundLayer = map.createLayer(
      "bottom",
      tilesArray,
      0,
      0
    );

    let backgroundLayer = map.createLayer(
      "bg",
      tilesArray,
      0,
      0
    );


    let houseLayer = map.createLayer(
      "house",
      tilesArray,
      0,
      0
    );

    let housesLayer = map.createLayer(
      "house2",
      tilesArray,
      0,
      0
    );

    let topmidLayer = map.createLayer(
      "top middle",
      tilesArray,
      0,
      0
    );


    // // Add any text to the game
    // this.add.text(10, 10, "Add any text here", {
    //   font: "30px Courier",
    //   fill: "#00FFFF",
    // });

    // Add main player here with physics.add.sprite
    this.anims.create({
      key: 'doc-left',
      frames: this.anims.generateFrameNumbers('doc',
        { start: 65, end: 72 }),
      frameRate: 24,
      repeat: -1
    });

    this.anims.create({
      key: 'doc-right',
      frames: this.anims.generateFrameNumbers('doc',
        { start: 91, end: 98 }),
      frameRate: 24,
      repeat: -1
    });

    this.anims.create({
      key: 'doc-up',
      frames: this.anims.generateFrameNumbers('doc',
        { start: 52, end: 59 }),
      frameRate: 24,
      repeat: -1
    });

    this.anims.create({
      key: 'doc-down',
      frames: this.anims.generateFrameNumbers('doc',
        { start: 78, end: 85 }),
      frameRate: 24,
      repeat: -1
    });

    let sign1 = map.findObject("objectLayer2", (obj) => obj.name === "sign1");
    console.log(sign1)

    this.popUp1Area = new Phaser.Geom.Rectangle(
      sign1.x,
      sign1.y,
      sign1.width,
      sign1.height
    );

    let sign2 = map.findObject("objectLayer2", (obj) => obj.name === "sign2");
    console.log(sign2)

    this.popUp2Area = new Phaser.Geom.Rectangle(
      sign2.x,
      sign2.y,
      sign2.width,
      sign2.height
    );

    let sign3 = map.findObject("objectLayer2", (obj) => obj.name === "sign3");
    console.log(sign3)

    this.popUp3Area = new Phaser.Geom.Rectangle(
      sign3.x,
      sign3.y,
      sign3.width,
      sign3.height
    );

    this.dialogText = this.add
      .text(0, 0, "", { font: "16px Arial Black", fill: "#ff00ff", stroke: '#000000', strokeThickness: 4 })
      .setOrigin(0.5)  // Center the text
      .setDepth(100)   // Make sure it's above other elements
      .setVisible(false); // Hide it initially


    this.player = this.physics.add.sprite(this.playerPos.x, this.playerPos.y, "doc").play("doc-down");
    this.player.body.setSize(32, 32);
    this.player.body.setOffset(16, 32);
    window.player = this.player
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);


    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);


    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    this.player.setCollideWorldBounds(true)

    backgroundLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, backgroundLayer)

    houseLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, houseLayer)

    housesLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, housesLayer)

    topmidLayer.setCollisionByExclusion(-1, true);
    this.physics.add.collider(this.player, topmidLayer)

    this.dialogueActive = false;

    if (!this.introShown) {
        this.showDialogue("Mom", "Please remember to check on the herbs Im boiling.");
        this.introShown = true;
    }
    

  } /////////////////// end of create //////////////////////////////

  showDialogue(name, message) {
    this.dialogueActive = true;  // block movement

    const dialogueBox = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);

    const rect = this.add.graphics();
    rect.fillStyle(0x000000, 0.8);
    rect.lineStyle(4, 0xffffff, 1);
    rect.fillRect(50, 450, 540, 120);
    rect.strokeRect(50, 450, 540, 120);

    const avatar = this.add.image(110, 470, "side").setScale(0.3);

    const nameText = this.add.text(160, 465, name, {
        fontSize: '22px',
        fill: '#ffffff',
        fontStyle: 'bold',
        wordWrap: { width: 440 }
    });

    const text = this.add.text(160, 490, message, {
        fontSize: '18px',
        fill: '#ffffff',
        wordWrap: { width: 440 }
    });

    const pressSpaceText = this.add.text(580, 545, "Press SPACE ->", {
        fontSize: '14px',
        fill: '#ffffff'
    }).setOrigin(1, 0.5);

    dialogueBox.add([rect, avatar, nameText, text, pressSpaceText]);

    this.time.delayedCall(500, () => {
        this.input.keyboard.once('keydown-SPACE', () => {
            dialogueBox.destroy();
            this.dialogueActive = false;  // unblock movement
        });
    });
}

  update() { /////////////////// end of update //////////////////////////////

    this.dialogText.setVisible(false);

    // Now handle dialog text display
    if (this.popUp1Area.contains(this.player.x, this.player.y)) {
      this.dialogText.setText("This is popup1");
      this.dialogText.setVisible(true);
    }
    else if (this.popUp2Area.contains(this.player.x, this.player.y)) {
      this.dialogText.setText("This is popup2");
      this.dialogText.setVisible(true);
    }
    else if (this.popUp3Area.contains(this.player.x, this.player.y)) {
      this.dialogText.setText("This is popup3");
      this.dialogText.setVisible(true);
    }

    // Update the text position to be above the player
    if (this.dialogText.visible) {
      this.dialogText.x = this.player.x;
      this.dialogText.y = this.player.y - 40; // 40 pixels above the player
    }

    if (
      this.player.x > 331 &&
      this.player.x < 395 &&
      this.player.y > 924 &&
      this.player.y < 988
    ) {
      this.map1()
    }

    if (
      this.player.x > 430 &&
      this.player.x < 494 &&
      this.player.y > 1280 &&
      this.player.y < 1344
    ) {
      this.map2()
    }

    if (
      this.player.x > 1348 &&
      this.player.x < 1412 &&
      this.player.y > 1300 &&
      this.player.y < 1364
    ) {
      this.map3()
    }

if (!this.dialogueActive) {
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

  }

  // Function to jump to room1
  map1(player, tile) {
    console.log("map1 function");
    this.scene.start("map1", {
      player: player,
      inventory: this.inventory,
    });
  }

  map2(player, tile) {
    console.log("map2 function");
    this.scene.start("map2", {
      player: player,
      inventory: this.inventory,
    });
  }

  map3(player, tile) {
    console.log("map3 function");
    this.scene.start("map3", {
      player: player,
      inventory: this.inventory,
    });
  }
} //////////// end of class world ////////////////////////
