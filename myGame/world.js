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
    this.load.audio("expSound", "assets/explod.mp3")


    this.load.image("forest", "assets/Forest.png");
    this.load.image("forests", "assets/forest2.png");
    this.load.image("houses", "assets/house.png");
    this.load.image("houses2", "assets/house2.png");
    this.load.image("house3", "assets/houses3.png");
    this.load.image("outdoor", "assets/outdoors.png");
    this.load.image("trees", "assets/tree.png");
    this.load.image("main", "assets/main.png");
    this.load.image("side", "assets/side.png");
    this.load.image("seeda", "assets/seedA.png");
    this.load.image("gummy", "assets/gummy.png");
    this.load.image("dates", "assets/dates.png");
    this.load.image("heart", "assets/heart.png");
    this.load.spritesheet('mao', 'assets/maomao.png', { frameWidth: 32, frameHeight: 32 });


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

    let bgLayer = map.createLayer(
      "bg2",
      tilesArray,
      0,
      0
    );

    let treeLayer = map.createLayer(
      "tree",
      tilesArray,
      0,
      0
    );

    let treesLayer = map.createLayer(
      "tree2",
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

    let topLayer = map.createLayer(
      "top",
      tilesArray,
      0,
      0
    )

    // Find sign objects from Tiled map
    let sign = map.findObject("objectLayer2", (obj) => obj.name === "sign");
    let sign2 = map.findObject("objectLayer2", (obj) => obj.name === "sign2");
    let sign3 = map.findObject("objectLayer2", (obj) => obj.name === "sign3");

    // Safety check in case objects aren't found
    this.popUp1Area = sign
      ? new Phaser.Geom.Rectangle(sign.x, sign.y, sign.width * 2, sign.height * 2)
      : new Phaser.Geom.Rectangle(0, 0, 0, 0);

    this.popUp2Area = sign2
      ? new Phaser.Geom.Rectangle(sign2.x, sign2.y, sign2.width * 2, sign2.height * 2)
      : new Phaser.Geom.Rectangle(0, 0, 0, 0);

    this.popUp3Area = sign3
      ? new Phaser.Geom.Rectangle(sign3.x, sign3.y, sign3.width * 2, sign3.height * 2)
      : new Phaser.Geom.Rectangle(0, 0, 0, 0);



    // Add main player here with physics.add.sprite
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


    // Sign messages
    this.signMessages = [
      "Sign 1:\nGather lotus seeds here, beware of turtles!",
      "Sign 2:\nDanger ahead!\nProceed with caution.",
      "Sign 3:\nThe apothecary shop\nis just around the corner."
    ];

    // Popup box container (fixed to camera)
    this.signPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(500).setVisible(false);

    const popupRect = this.add.graphics();
    popupRect.fillStyle(0x000000, 0.85);
    popupRect.lineStyle(3, 0xffffff, 1);
    popupRect.fillRect(150, 380, 340, 100);
    popupRect.strokeRect(150, 380, 340, 100);

    // Sign icon/title
    this.signTitle = this.add.text(320, 400, "[ Sign ]", {
      fontSize: '14px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Main message text
    this.signPopupText = this.add.text(320, 430, "", {
      fontSize: '15px',
      fill: '#ffffff',
      wordWrap: { width: 300 },
      align: 'center'
    }).setOrigin(0.5);

    this.signPopup.add([popupRect, this.signTitle, this.signPopupText]);

    // Row 1: Seed icon + count
    this.add.image(40, 30, 'seeda').setScrollFactor(0).setDepth(999).setScale(1.5);
    this.seedText = this.add.text(60, 20, `x ${seedcounter}`, {
      fontSize: '18px', fill: '#ffffff', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(999);

    // Row 2: Gummy icon + count
    this.add.image(130, 30, 'gummy').setScrollFactor(0).setDepth(999).setScale(1.5);
    this.gumText = this.add.text(150, 20, `x ${gumcounter}`, {
      fontSize: '18px', fill: '#ffffff', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(999);

    // Row 3: Dates icon + count
    this.add.image(200, 30, 'dates').setScrollFactor(0).setDepth(999).setScale(1.5);
    this.dateText = this.add.text(220, 20, `x ${datecounter}`, {
      fontSize: '18px', fill: '#ffffff', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(999);

    // Row 4: Heart icon + life count
    this.add.image(40, 65, 'heart').setScrollFactor(0).setDepth(999).setScale(3);
    this.lifeText = this.add.text(60, 55, `x ${life}`, {
      fontSize: '18px', fill: '#ffffff', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(999);

    this.player = this.physics.add.sprite(this.playerPos.x, this.playerPos.y, 'mao').play('mao-down').setScale(2);
    this.player.body.setSize(16, 20);
    this.player.body.setOffset(8, 6);
    window.player = this.player
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
    this.isMoving = false;

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
      this.showDialogue([
        { name: "Mom", msg: "Mao, the herbs are boiling!", face: "side" },
        { name: "Mao", msg: "I'm coming, Mom! Just a second.", face: "main" },
        { name: "Mom", msg: "Make sure to check on it kay? I'm leaving now, byebye!", face: "side" },
        { msg: "The herbs burnt because Mao was watching cat tiktoks...." },
        { name: "Mao", msg: "Oh sh-, Im  gonna be beaten by mom if she finds out.", face: "main" },
        { name: "Mao", msg: "I better hurry and fix this mess!", face: "main" }
      ]);
      this.introShown = true;
    }

  } /////////////////// end of create //////////////////////////////


  showDialogue(dialogueData) {
    this.dialogueActive = true;
    this.player.body.setVelocity(0);
    this.player.anims.stop();

    // Set idle frame
    let idleFrame = 0;
    if (this.player.anims.currentAnim) {
      const key = this.player.anims.currentAnim.key;
      if (key === 'mao-up') idleFrame = 9;
      else if (key === 'mao-left') idleFrame = 6;
      else if (key === 'mao-right') idleFrame = 3;
      else idleFrame = 1; // mao-down
    }
    this.player.setFrame(idleFrame);

    let currentPage = 0;

    // Create UI Container
    const dialogueBox = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);

    const rect = this.add.graphics();
    rect.fillStyle(0x000000, 0.8);
    rect.lineStyle(4, 0xffffff, 1);
    rect.fillRect(50, 450, 540, 120);
    rect.strokeRect(50, 450, 540, 120);

    const avatar = this.add.image(110, 490, dialogueData[currentPage].face).setScale(0.3);

    const nameText = this.add.text(160, 465, dialogueData[currentPage].name || "", {
      fontSize: '22px', fill: '#ffffff', fontStyle: 'bold'
    });

    const mainText = this.add.text(160, 495, dialogueData[currentPage].msg, {
      fontSize: '18px', fill: '#ffffff', wordWrap: { width: 420 }
    });

    const pressSpaceText = this.add.text(580, 545, "SPACE ->", {
      fontSize: '12px', fill: '#aaaaaa'
    }).setOrigin(1, 0.5);

    dialogueBox.add([rect, avatar, nameText, mainText, pressSpaceText]);

    const spaceKey = this.input.keyboard.addKey('SPACE');

    // Helper function to update text/images
    const updateContent = () => {
      mainText.setText(dialogueData[currentPage].msg);
      nameText.setText(dialogueData[currentPage].name || "");

      if (dialogueData[currentPage].face) {
        avatar.setVisible(true);
        avatar.setTexture(dialogueData[currentPage].face);
        avatar.setScale(0.3);
      } else {
        avatar.setVisible(false);
      }
    };

    const handleSpace = () => {
      currentPage++;

      if (currentPage < dialogueData.length) {
        // Check for the "Explosion" event on the 4th message (index 3)
        if (currentPage === 3) {
          dialogueBox.setVisible(false);

          if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
          }

          this.cameras.main.shake(500, 0.03);
          this.sound.play('expSound');

          this.time.delayedCall(600, () => {
            if (currentPage < dialogueData.length) {
              updateContent();
              dialogueBox.setVisible(true);
            }
          });
        } else {
          updateContent();
        }
      } else {
        // --- DIALOGUE ENDED ---
        dialogueBox.destroy();
        this.dialogueActive = false;
        this.input.keyboard.removeKey('SPACE');

        // Start the instruction scene and pass data
        this.scene.start("how", {
          playerPos: this.playerPos,
          inventory: this.inventory
        });
      }
    };

    // Small delay to prevent the spacebar that opened the dialog from closing it instantly
    this.time.delayedCall(100, () => {
      spaceKey.on('down', handleSpace);
    });
  }

  update() {

    // Handle dialog text display
    // Sign popup logic
    let signMessage = null;
    let signTitle = null;

    if (this.popUp1Area.contains(this.player.x, this.player.y)) {
      signTitle = "[ Lotus pond ]";
      signMessage = "Gather lotus seeds here, beware of turtles!";
    } else if (this.popUp2Area.contains(this.player.x, this.player.y)) {
      signTitle = "[ Baren land ]";
      signMessage = "Danger ahead!\nProceed with caution.";
    } else if (this.popUp3Area.contains(this.player.x, this.player.y)) {
      signTitle = "[ Rocky forest ]";
      signMessage = "Find the dates\nand don't pick the wrong dates.. get it?";
    }

    if (signMessage) {
      this.signTitle.setText(signTitle);
      this.signPopupText.setText(signMessage);
      this.signPopup.setVisible(true);
    } else {
      this.signPopup.setVisible(false);
    }

    // Portal logic
    if (this.player.x > 331 && this.player.x < 395 && this.player.y > 924 && this.player.y < 988) {
      this.map1();
    }
    if (this.player.x > 430 && this.player.x < 494 && this.player.y > 1280 && this.player.y < 1344) {
      this.map2();
    }
    if (this.player.x > 1348 && this.player.x < 1412 && this.player.y > 1300 && this.player.y < 1364) {
      this.map3();
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

    // ── Win condition ──────────────────────────────────────
    if (seedcounter + gumcounter + datecounter >= 9) {
      this.scene.start("winScene");
      return;
    }

    // ── Refresh HUD counter ────────────────────────────────
    if (this.seedText) this.seedText.setText(`x ${seedcounter}`);
    if (this.gumText) this.gumText.setText(`x ${gumcounter}`);
    if (this.dateText) this.dateText.setText(`x ${datecounter}`);
    if (this.lifeText) this.lifeText.setText(`x ${life}`);
  }


  map1() {
    this.scene.start("map1scene", {
      playerPos: { x: 1200, y: 900 },
      inventory: this.inventory
    });
  }

  map2() {
    this.scene.start("map2scene", {
      playerPos: { x: 1300, y: 850 },
      inventory: this.inventory
    });
  }

  map3() {
    this.scene.start("map3scene", {
      playerPos: { x: 200, y: 800 },
      inventory: this.inventory
    });
  }
} //////////// end of class world ////////////////////////