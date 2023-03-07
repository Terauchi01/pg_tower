// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;
const ctx = canvas.getContext("2d");

// 画像の読み込み
const imgPaths = ["Image/soldier.png", "Image/lancer.png", "Image/cavalry.png", "Image/castle.png"];

const images = [];

const unitSize = {width:64, height:64};
const castleSize = {width:256, height:256};

const laneStartPos = {left:{x:canvas.width / 2 - castleSize.width / 2 - unitSize.width / 2, y:canvas.height - castleSize.height / 2},
                      middle:{x:canvas.width / 2, y:canvas.height - castleSize.height - unitSize.height / 2}, 
                      right:{x:canvas.width / 2 + castleSize.width / 2 + unitSize.width / 2, y:canvas.height - castleSize.height / 2}}

const player = new Player(1);
player.addUnit(0, new Lancer(laneStartPos.left.x, laneStartPos.left.y, 1, 0));
player.addUnit(1, new Cavalry(laneStartPos.middle.x, laneStartPos.middle.y, 1, 1));
player.addUnit(2, new Soldier(laneStartPos.right.x, laneStartPos.right.y, 1, 2));
player.addUnit(0, new Lancer(laneStartPos.left.x, laneStartPos.left.y, 1, 0));
player.addUnit(1, new Cavalry(laneStartPos.middle.x, laneStartPos.middle.y, 1, 1));
player.addUnit(2, new Soldier(laneStartPos.right.x, laneStartPos.right.y, 1, 2));

const enemy = new Player(2);
enemy.addUnit(0, new Soldier(laneStartPos.left.x, laneStartPos.left.y, 2, 3));
enemy.addUnit(1, new Lancer(laneStartPos.middle.x, laneStartPos.middle.y, 2, 4));
enemy.addUnit(2, new Cavalry(laneStartPos.right.x, laneStartPos.right.y, 2, 5));
enemy.addUnit(0, new Soldier(laneStartPos.left.x, laneStartPos.left.y, 2, 3));
enemy.addUnit(1, new Lancer(laneStartPos.middle.x, laneStartPos.middle.y, 2, 4));
enemy.addUnit(2, new Cavalry(laneStartPos.right.x, laneStartPos.right.y, 2, 5));


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

  function drawUnit(playerObj) {
    for (ary of playerObj.lanes) {
      for (obj of ary) {
        let px = obj.pos.x, py = obj.pos.y;
        if (playerObj.playerID != 1) {
          px = canvas.width - px;
          py = canvas.height - py;
        }
        switch (obj.constructor) {
          case Soldier:
            ctx.drawImage(images[0], px - unitSize.width/2, py - unitSize.height/2);
            break;
          case Lancer:
            ctx.drawImage(images[1], px - unitSize.width/2, py - unitSize.height/2);
            break;
          case Cavalry:
            ctx.drawImage(images[2], px - unitSize.width/2, py - unitSize.height/2);
            break;
        }
      }
    }
  }

  function attackUnit(playerObj1, playerObj2) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
      if (playerObj1.lanes[i].length == 0 || playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0) continue;
      let obj1 = playerObj1.lanes[i][0];
      let obj2 = playerObj2.lanes[playerObj2.lanes.length - i - 1][0];
      if (Math.abs(obj1.pos.y - (canvas.height - obj2.pos.y)) <= unitSize.height) {
        obj1.isMove = false;
        obj2.isMove = false;
        obj1.attack(obj2);
        obj2.attack(obj1);
      }
    }
  }

  function updateUnit(playerObj1, playerObj2) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
      for (let j = 0; j < playerObj1.lanes[i].length; j++) {
        let dir = 270;
        if (i == 0) { 
          if (playerObj1.lanes[i][j].pos.y < canvas.height/3) {
            dir = 315;
          } else if (playerObj1.lanes[i][j].pos.y > canvas.height/3*2) {
            dir = 225;
          }
        } else if (i == 2) {
          if (playerObj1.lanes[i][j].pos.y < canvas.height/3) {
            dir = 225;
          } else if (playerObj1.lanes[i][j].pos.y > canvas.height/3*2) {
            dir = 315;
          }
        }
        
        if (j == 0) {
          if (playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0 ||
            Math.abs(playerObj1.lanes[i][j].pos.y - (canvas.height - playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.y)) > unitSize.height) {
            playerObj1.lanes[i][j].isMove = true;
          }
        } else {
          if (Math.abs(playerObj1.lanes[i][j - 1].pos.y - playerObj1.lanes[i][j].pos.y) > unitSize.height) {
            playerObj1.lanes[i][j].isMove = true;
          } else {
            if (playerObj1.lanes[i][j - 1].constructor === playerObj1.lanes[i][j].constructor) {
              playerObj1.lanes[i][j - 1].isCooperate = true;
            }
            playerObj1.lanes[i][j].isMove = false;
          }
        }
        let rad = dir*(Math.PI/180);
        playerObj1.lanes[i][j].update(Math.cos(rad), Math.sin(rad));
      }
    }
  }

  function eraseUnit(playerObj) {
    for (let i = 0; i < playerObj.lanes.length; i++) {
      if (playerObj.lanes[i].length == 0) continue;
      if (playerObj.lanes[i][0].hp <= 0) {
        playerObj.eraseUnit(i);
      }
    }
  }

  // 画像を描画する関数
  function drawImage() {
    // 最初に1回だけclearRectを呼ぶ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //x, yを更新することで画像の座標を変更できる
    ctx.drawImage(images[3], canvas.width / 2 - castleSize.width / 2, 0);
    ctx.drawImage(images[3], canvas.width / 2 - castleSize.width / 2, canvas.height - castleSize.height);
    drawUnit(player);
    drawUnit(enemy);
  }

  function mainLoop() {
    //ここに繰り返したいものを書く
    //attack
    attackUnit(player, enemy);

    //move
    updateUnit(player, enemy);
    updateUnit(enemy, player);

    eraseUnit(player);
    eraseUnit(enemy);

    drawImage();
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
