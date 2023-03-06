// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;
const ctx = canvas.getContext("2d");

// 画像の読み込み
const imgPaths = ["Image/soldier.png", "Image/lancer.png", "Image/cavalry.png"];
const images = [];

const player = new Player(1);

const lanePosx = [canvas.width / 4, canvas.width / 2, canvas.width / 4 * 3];

player.addUnit(0, new Soldier(lanePosx[0], 400, 10, 1, 4));
player.addUnit(1, new Cavalry(lanePosx[1], 500, 10, 1, 5));
player.addUnit(2, new Cavalry(lanePosx[2], 400, 10, 1, 6));

player.addUnit(0, new Soldier(lanePosx[0], canvas.height, 10, 1, 1));
player.addUnit(1, new Lancer(lanePosx[1], canvas.height, 10, 1, 2));
player.addUnit(2, new Cavalry(lanePosx[2], canvas.height, 10, 1, 3));

const enemy = new Player(2);
enemy.addUnit(0, new Soldier(lanePosx[2], canvas.height, 10, 2, 7));
enemy.addUnit(1, new Lancer(lanePosx[1], canvas.height, 10, 2, 8));

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
        let px = obj.pos[0], py = obj.pos[1];
        if (playerObj.playerID != 1) {
          py = canvas.height - py;
        }
        switch (obj.constructor) {
          case Soldier:
            ctx.drawImage(images[0], px, py);
            break;
          case Lancer:
            ctx.drawImage(images[1], px, py);
            break;
          case Cavalry:
            ctx.drawImage(images[2], px, py);
            break;
        }
      }
    }
  }

  function attackUnit(playerObj1, playerObj2) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
      if (playerObj1.lanes[i].length == 0 || playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0) continue;
      if (Math.abs(playerObj1.lanes[i][0].pos[1] - (canvas.height - playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos[1])) <= images[0].height) {
        playerObj1.lanes[i][0].isMove = false;
        playerObj2.lanes[playerObj2.lanes.length - i - 1][0].isMove = false;
        playerObj1.lanes[i][0].attack(playerObj2.lanes[playerObj2.lanes.length - i - 1][0]);
        playerObj2.lanes[playerObj2.lanes.length - i - 1][0].attack(playerObj1.lanes[i][0]);
      }
    }
  }

  function updateUnit(playerObj1, playerObj2) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
      for (let j = 0; j < playerObj1.lanes[i].length; j++) {
        if (j == 0) {
          if (playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0 ||
            Math.abs(playerObj1.lanes[i][j].pos[1] - (canvas.height - playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos[1])) > images[0].height) {
            playerObj1.lanes[i][j].isMove = true;
          }
        } else {
          if (Math.abs(playerObj1.lanes[i][j - 1].pos[1] - playerObj1.lanes[i][j].pos[1]) > images[0].height) {
            playerObj1.lanes[i][j].isMove = true;
          } else {
            if (playerObj1.lanes[i][j - 1].constructor == playerObj1.lanes[i][j].constructor) {
              playerObj1.lanes[i][j - 1].isCooperate = true;
            }
            playerObj1.lanes[i][j].isMove = false;
          }
        }
        playerObj1.lanes[i][j].update();
        if (playerObj1.lanes[i][j].hp <= 0) playerObj1.eraseUnit(i);
      }
    }
  }

  // 画像を描画する関数
  function drawImage() {
    // 最初に1回だけclearRectを呼ぶ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //x, yを更新することで画像の座標を変更できる
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

    drawImage();
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
