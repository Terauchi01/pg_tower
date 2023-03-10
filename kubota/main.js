// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;

var isDrag = false;
var mousePos = { x: 0, y: 0 };
var selectNum = -1;
const circleSizeData = 64;

const ctx = canvas.getContext("2d");

// 画像の読み込み
const imgPaths = ["Image/soldier.png", "Image/lancer.png", "Image/cavalry.png", "Image/soldier2.png", "Image/lancer2.png", "Image/cavalry2.png", "Image/castle.png"];

//画像のインスタンスを保管する配列
const images = [];

//画像チップのサイズを保管
const unitSizeData = { width: 64, height: 64 };
const castleSizeData = { width: 256, height: 256 };
const dragSize = { width: 128, height: 128 };
const canvasSizeData = { width: canvas.width, height: canvas.height };
const unitDir = {left:315, middle:270, right:225}

//ユニットの初期位置を設定
const laneStartPos = {
  left: { x: canvas.width / 2 - castleSizeData.width / 2 - unitSizeData.width / 2, y: canvas.height - castleSizeData.height / 2 },
  middle: { x: canvas.width / 2, y: canvas.height - castleSizeData.height - unitSizeData.height / 2 },
  right: { x: canvas.width / 2 + castleSizeData.width / 2 + unitSizeData.width / 2, y: canvas.height - castleSizeData.height / 2 }
}
const dragPos = {
  soldier: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 3 },
  lancer: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 2 },
  cavalry: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height }
}

//各プレイヤーの初期化、現状ユニット追加が未実装の為初期でユニットを配置してテストを行う
const player = new Player(1, { x: canvas.width / 2, y: canvas.height - castleSizeData.height / 2 });
player.addUnit(0, new Lancer(laneStartPos.left.x, laneStartPos.left.y, 1, 0));
player.addUnit(1, new Cavalry(laneStartPos.middle.x, laneStartPos.middle.y, 1, 1));
player.addUnit(2, new Soldier(laneStartPos.right.x, laneStartPos.right.y, 1, 2));
player.addUnit(0, new Lancer(laneStartPos.left.x, laneStartPos.left.y, 1, 0));
player.addUnit(1, new Cavalry(laneStartPos.middle.x, laneStartPos.middle.y, 1, 1));
player.addUnit(2, new Soldier(laneStartPos.right.x, laneStartPos.right.y, 1, 2));
player.startCostIncrease()

const enemy = new Player(2, { x: canvas.width / 2, y: canvas.height - castleSizeData.height / 2 });
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
        let px = obj.pos.x, py = obj.pos.y, index = 0;
        if (playerObj.playerID != 1) {
          px = canvasSize.width - px;
          py = canvasSize.height - py;
          index = 3;
        }
        switch (obj.constructor) {
          case Soldier:
            ctx.drawImage(images[0 + index], px - unitSize.width / 2, py - unitSize.height / 2);
            break;
          case Lancer:
            ctx.drawImage(images[1 + index], px - unitSize.width / 2, py - unitSize.height / 2);
            break;
          case Cavalry:
            ctx.drawImage(images[2 + index], px - unitSize.width / 2, py - unitSize.height / 2);
            break;
        }
      }
    }
  }

  //ユニットの攻撃、playerObj1,playerObj2には各プレイヤーのインスタンスを渡す(順不同), canvasSize, unitSizeにはサイズを渡す
  function attackUnit(playerObj1, playerObj2, canvasSize, castleSize, unitSize) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
      //length!=0を先に判定しないと配列外アクセス
      if (playerObj1.lanes[i].length != 0 && playerObj2.lanes[playerObj2.lanes.length - i - 1].length != 0) {
        let obj1 = playerObj1.lanes[i][0];
        let obj2 = playerObj2.lanes[playerObj2.lanes.length - i - 1][0];
        let dx = obj1.pos.x - (canvasSize.width - obj2.pos.x), dy = obj1.pos.y - (canvasSize.height - obj2.pos.y);
        if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(unitSize.height, 2)) {
          obj1.attack(obj2);
          obj2.attack(obj1);
        }
      } else if (playerObj1.lanes[i].length != 0 && playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0) {
        if (Math.abs(playerObj1.lanes[i][0].pos.x - (canvasSize.width - playerObj2.pos.x)) < castleSize.width / 2 + unitSize.width / 2 &&
          Math.abs(playerObj1.lanes[i][0].pos.y - (canvasSize.height - playerObj2.pos.y)) < castleSize.height / 2 + unitSize.height / 2) {
          playerObj1.lanes[i][0].attack(playerObj2);
        }
      } else if (playerObj1.lanes[i].length == 0 && playerObj2.lanes[playerObj2.lanes.length - i - 1].length != 0) {
        if (Math.abs(playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.x - (canvasSize.width - playerObj1.pos.x)) < castleSize.width / 2 + unitSize.width / 2 &&
          Math.abs(playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.y - (canvasSize.height - playerObj1.pos.y)) < castleSize.height / 2 + unitSize.height / 2) {
          playerObj2.lanes[playerObj2.lanes.length - i - 1][0].attack(playerObj1);
        }
      }
    }
  }

  //ユニットの移動関係,動かしたいplayerのインスタンスをplayerObj1,もう片方のインスタンスをplayerObj2
  //canvasSize, unitSizeにはサイズを渡す
  function updateUnit(playerObj1, playerObj2, canvasSize, castleSize, unitSize) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
      for (let j = 0; j < playerObj1.lanes[i].length; j++) {
        let dir = unitDir.middle;
        if (i == 0) {
          if (playerObj1.lanes[i][j].pos.y < canvasSize.height / 3) {
            dir = unitDir.left;
          } else if (playerObj1.lanes[i][j].pos.y > canvasSize.height / 3 * 2) {
            dir = unitDir.right;
          }
        } else if (i == 2) {
          if (playerObj1.lanes[i][j].pos.y < canvasSize.height / 3) {
            dir = unitDir.right;
          } else if (playerObj1.lanes[i][j].pos.y > canvasSize.height / 3 * 2) {
            dir = unitDir.left;
          }
        }

        if (j == 0) {
          if (playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0) {
            if (Math.abs(playerObj1.lanes[i][j].pos.x - (canvasSize.width - playerObj2.pos.x)) >= castleSize.width / 2 + unitSize.width / 2 ||
              Math.abs(playerObj1.lanes[i][j].pos.y - (canvasSize.height - playerObj2.pos.y)) >= castleSize.height / 2 + unitSize.height / 2) {
              playerObj1.lanes[i][j].isMove = true;
            }
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

  function drawCircle(pos, size) {
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.arc(pos.x, pos.y, size, (performance.now() / 100) * Math.PI / 180, ((performance.now() / 100) + 360) * Math.PI / 180, false);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgb(0, 0, 0)';
  }

  // 画像を描画する関数, ctxにキャンバスのコンテキスト,canvasSize, unitSize, castleSizeにはサイズを渡す
  function drawImage(ctx, canvasSize, castleSize, unitSize, circleSize) {
    // 最初に1回だけclearRectを呼ぶ
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    //x, yを更新することで画像の座標を変更できる
    if (player.castleHP > 0) ctx.drawImage(images[6], player.pos.x - castleSize.width / 2, player.pos.y - castleSizeData.height / 2);
    if (enemy.castleHP > 0) ctx.drawImage(images[6], canvas.width - enemy.pos.x - castleSize.width / 2, canvas.height - enemy.pos.y - castleSizeData.height / 2);

    ctx.drawImage(images[0], dragPos.soldier.x - dragSize.width / 2, dragPos.soldier.y - dragSize.height / 2, dragSize.width, dragSize.height);
    ctx.drawImage(images[1], dragPos.lancer.x - dragSize.width / 2, dragPos.lancer.y - dragSize.height / 2, dragSize.width, dragSize.height);
    ctx.drawImage(images[2], dragPos.cavalry.x - dragSize.width / 2, dragPos.cavalry.y - dragSize.height / 2, dragSize.width, dragSize.height);

    drawCircle(laneStartPos.left, circleSize);
    drawCircle(laneStartPos.middle, circleSize);
    drawCircle(laneStartPos.right, circleSize);

    drawUnit(player, canvasSize, unitSize);
    drawUnit(enemy, canvasSize, unitSize);

    if (isDrag) ctx.drawImage(images[selectNum], mousePos.x - unitSize.width / 2, mousePos.y - unitSize.height / 2);
  }

  function mainLoop() {
    //ここに繰り返したいものを書く
    //attack
    attackUnit(player, enemy, canvasSizeData, castleSizeData, unitSizeData);

    //move
    updateUnit(player, enemy, canvasSizeData, castleSizeData, unitSizeData);
    updateUnit(enemy, player, canvasSizeData, castleSizeData, unitSizeData);

    //ユニット消去
    eraseUnit(player);
    eraseUnit(enemy);

    //描画
    drawImage(ctx, canvasSizeData, castleSizeData, unitSizeData, circleSizeData);
    // ボタンの外枠を描画
    ctx.beginPath();
    ctx.rect(50, 25, 100, 50);
    ctx.stroke();

    // ボタンに表示するテキストを設定
    ctx.font = '20px Arial';
    ctx.fillText('test', 80, 55);

    // ボタンをクリックしたときの処理
    canvas.addEventListener('click', function (event) {
      // クリックされた座標を取得
      var x = event.pageX - canvas.offsetLeft;
      var y = event.pageY - canvas.offsetTop;

      // ボタン内をクリックした場合
      if (x > 50 && x < 150 && y > 25 && y < 75) {
        //alert('Button clicked!');
        player.pauseCostIncrease();
      }

    });

    canvas.addEventListener('mousedown', function (event) {
      //配置するユニットを選択

      let checkDrag = (pos, index) => {
        let dx = pos.x - event.clientX, dy = pos.y - event.clientY;
        if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(dragSize.height / 2, 2)) {
          selectNum = index;
          isDrag = true;
        }
      }

      if (!isDrag) checkDrag(dragPos.soldier, 0);
      if (!isDrag) checkDrag(dragPos.lancer, 1);
      if (!isDrag) checkDrag(dragPos.cavalry, 2);
    });

    canvas.addEventListener('mouseup', function (event) {
      //ユニット配置
      let checkAdd = (pos, index) => {
        let dx = pos.x - event.clientX, dy = pos.y - event.clientY;
        if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(circleSizeData, 2)) {
          switch (selectNum) {
            case 0:
              player.addUnit(index, new Soldier(pos.x, pos.y, 1, 100));
              break;
            case 1:
              player.addUnit(index, new Lancer(pos.x, pos.y, 1, 100));
              break;
            case 2:
              player.addUnit(index, new Cavalry(pos.x, pos.y, 1, 100));
              break;
          }
          isDrag = false;
        }
      }

      if (isDrag) checkAdd(laneStartPos.left, 0);
      if (isDrag) checkAdd(laneStartPos.middle, 1);
      if (isDrag) checkAdd(laneStartPos.right, 2);
      isDrag = false;
    });

    canvas.addEventListener('mousemove', function (event) {
      mousePos.x = event.clientX;
      mousePos.y = event.clientY;
    });

    //mainloopを回すために必要
    requestAnimationFrame(mainLoop);
  }

  //mainloopを回すために必要
  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
