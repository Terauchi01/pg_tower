// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;
const ctx = canvas.getContext("2d");


// 画像の読み込み
const imgPaths = ["Image/soldier.png", "Image/lancer.png", "Image/cavalry.png", "Image/castle.png"];

//画像のインスタンスを保管する配列
const images = [];

//画像チップのサイズを保管
const unitSizeData = { width: 64, height: 64 };
const castleSizeData = { width: 256, height: 256 };
const canvasSizeData = { width: canvas.width, height: canvas.height};

//ユニットの初期位置を設定
const laneStartPos = {
  left: { x: canvas.width / 2 - castleSizeData.width / 2 - unitSizeData.width / 2, y: canvas.height - castleSizeData.height / 2 },
  middle: { x: canvas.width / 2, y: canvas.height - castleSizeData.height - unitSizeData.height / 2 },
  right: { x: canvas.width / 2 + castleSizeData.width / 2 + unitSizeData.width / 2, y: canvas.height - castleSizeData.height / 2 }
}

//各プレイヤーの初期化、現状ユニット追加が未実装の為初期でユニットを配置してテストを行う
const player = new Player(1);
player.addUnit(0, new Lancer(laneStartPos.left.x, laneStartPos.left.y, 1, 0));
player.addUnit(1, new Cavalry(laneStartPos.middle.x, laneStartPos.middle.y, 1, 1));
player.addUnit(2, new Soldier(laneStartPos.right.x, laneStartPos.right.y, 1, 2));
player.addUnit(0, new Lancer(laneStartPos.left.x, laneStartPos.left.y, 1, 0));
player.addUnit(1, new Cavalry(laneStartPos.middle.x, laneStartPos.middle.y, 1, 1));
player.addUnit(2, new Soldier(laneStartPos.right.x, laneStartPos.right.y, 1, 2));
player.startCostIncrease()

const enemy = new Player(2);
enemy.addUnit(0, new Soldier(laneStartPos.left.x, laneStartPos.left.y, 2, 3));
enemy.addUnit(1, new Lancer(laneStartPos.middle.x, laneStartPos.middle.y, 2, 4));
enemy.addUnit(2, new Cavalry(laneStartPos.right.x, laneStartPos.right.y, 2, 5));
enemy.addUnit(0, new Soldier(laneStartPos.left.x, laneStartPos.left.y, 2, 3));
enemy.addUnit(1, new Lancer(laneStartPos.middle.x, laneStartPos.middle.y, 2, 4));
enemy.addUnit(2, new Cavalry(laneStartPos.right.x, laneStartPos.right.y, 2, 5));

//画像読み込み
Promise.all(imgPaths.map(path => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = path;
    images.push(img);
  });
})).then(() => {

  //ユニットの画像描画用の関数,playerのインスタンスを渡すとそのplayerの保持するユニットを描画, canvasSize, unitSizeにはサイズを渡す
  function drawUnit(playerObj, canvasSize, unitSize) {
    for (ary of playerObj.lanes) {
      for (obj of ary) {
        let px = obj.pos.x, py = obj.pos.y;
        if (playerObj.playerID != 1) {
          px = canvasSize.width - px;
          py = canvasSize.height - py;
        }
        switch (obj.constructor) {
          case Soldier:
            ctx.drawImage(images[0], px - unitSize.width / 2, py - unitSize.height / 2);
            break;
          case Lancer:
            ctx.drawImage(images[1], px - unitSize.width / 2, py - unitSize.height / 2);
            break;
          case Cavalry:
            ctx.drawImage(images[2], px - unitSize.width / 2, py - unitSize.height / 2);
            break;
        }
      }
    }
  }

  //ユニットの攻撃、playerObj1,playerObj2には各プレイヤーのインスタンスを渡す(順不同), canvasSize, unitSizeにはサイズを渡す
  function attackUnit(playerObj1, playerObj2, canvasSize, unitSize) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
      //length==0を先に判定しないと配列外アクセス
      if (playerObj1.lanes[i].length == 0 || playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0) continue;
      let obj1 = playerObj1.lanes[i][0];
      let obj2 = playerObj2.lanes[playerObj2.lanes.length - i - 1][0];
      let dx = obj1.pos.x - (canvasSize.width - obj2.pos.x), dy = obj1.pos.y - (canvasSize.height - obj2.pos.y);
      if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(unitSize.height, 2)) {
        obj1.isMove = false;
        obj2.isMove = false;
        obj1.attack(obj2);
        obj2.attack(obj1);
      }
    }
  }

  //ユニットの移動関係,動かしたいplayerのインスタンスをplayerObj1,もう片方のインスタンスをplayerObj2
  //canvasSize, unitSizeにはサイズを渡す
  function updateUnit(playerObj1, playerObj2, canvasSize, unitSize) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
      for (let j = 0; j < playerObj1.lanes[i].length; j++) {
        let dir = 270;
        if (i == 0) {
          if (playerObj1.lanes[i][j].pos.y < canvasSize.height / 3) {
            dir = 315;
          } else if (playerObj1.lanes[i][j].pos.y > canvasSize.height / 3 * 2) {
            dir = 225;
          }
        } else if (i == 2) {
          if (playerObj1.lanes[i][j].pos.y < canvasSize.height / 3) {
            dir = 225;
          } else if (playerObj1.lanes[i][j].pos.y > canvasSize.height / 3 * 2) {
            dir = 315;
          }
        }

        if (j == 0) {
          if (playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0) {
            playerObj1.lanes[i][j].isMove = true;
          } else {
            let dx = playerObj1.lanes[i][j].pos.x - (canvasSize.width - playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.x), dy = playerObj1.lanes[i][j].pos.y - (canvasSize.height - playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.y);
            if (Math.pow(dx, 2) + Math.pow(dy, 2) > Math.pow(unitSize.height, 2)) {
              playerObj1.lanes[i][j].isMove = true;
            }
          }
        } else {
          let dx = playerObj1.lanes[i][j].pos.x - playerObj1.lanes[i][j - 1].pos.x, dy = playerObj1.lanes[i][j].pos.y - playerObj1.lanes[i][j - 1].pos.y;
          if (Math.pow(dx, 2) + Math.pow(dy, 2) > Math.pow(unitSize.height, 2)) {
            playerObj1.lanes[i][j].isMove = true;
          } else {
            if (playerObj1.lanes[i][j - 1].constructor === playerObj1.lanes[i][j].constructor) {
              playerObj1.lanes[i][j - 1].isCooperate = true;
            }
            playerObj1.lanes[i][j].isMove = false;
          }
        }
        let rad = dir * (Math.PI / 180);
        playerObj1.lanes[i][j].update(Math.cos(rad), Math.sin(rad));
      }
    }
  }

  //指定したplayerのユニットのhpを確認しhpがゼロ以下のユニットを消去
  function eraseUnit(playerObj) {
    for (let i = 0; i < playerObj.lanes.length; i++) {
      if (playerObj.lanes[i].length == 0) continue;
      if (playerObj.lanes[i][0].hp <= 0) {
        playerObj.eraseUnit(i);
      }
    }
  }

  // 画像を描画する関数, ctxにキャンバスのコンテキスト,canvasSize, unitSize, castleSizeにはサイズを渡す
  function drawImage(ctx, canvasSize, castleSize, unitSize) {
    // 最初に1回だけclearRectを呼ぶ
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

          // ボタンの外枠を描画
      ctx.beginPath();
      ctx.rect(50, 25, 100, 50);
      ctx.stroke();

      // ボタンに表示するテキストを設定
      ctx.font = '20px Arial';
      ctx.fillText('test1', 80, 55);

      // ボタンをクリックしたときの処理
      canvas.addEventListener('test', function(event) {
        // クリックされた座標を取得
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;

        // ボタン内をクリックした場合
        if (x > 50 && x < 150 && y > 25 && y < 75) {
          alert('Button clicked!');
          //player.pauseCostIncrease()
        }
      });
    //x, yを更新することで画像の座標を変更できる
    ctx.drawImage(images[3], canvasSize.width / 2 - castleSize.width / 2, 0);
    ctx.drawImage(images[3], canvasSize.width / 2 - castleSize.width / 2, canvasSize.height - castleSize.height);
    drawUnit(player, canvasSize, unitSize);
    drawUnit(enemy, canvasSize, unitSize);
  }

  function mainLoop() {
    //ここに繰り返したいものを書く
    //attack
    attackUnit(player, enemy, canvasSizeData, unitSizeData);

    //move
    updateUnit(player, enemy, canvasSizeData, unitSizeData);
    updateUnit(enemy, player, canvasSizeData, unitSizeData);

    //ユニット消去
    eraseUnit(player);
    eraseUnit(enemy);

    //描画
    drawImage(ctx, canvasSizeData, castleSizeData, unitSizeData);
    //mainloopを回すために必要
    requestAnimationFrame(mainLoop);
  }

  //mainloopを回すために必要
  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
