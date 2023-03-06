// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;
const ctx = canvas.getContext("2d");

// 画像の読み込み
const imgPaths = ["Image/soldier.png", "Image/lancer.png", "Image/cavalry.png"];
const images = [];

const player = new Player();

const lanePosx = [canvas.width / 4, canvas.width / 2, canvas.width / 4 * 3];

player.addUnit(0, new Soldier(lanePosx[0], 400, 10, 1, 4));
player.addUnit(1, new Cavalry(lanePosx[1], 500, 10, 1, 5));
player.addUnit(2, new Cavalry(lanePosx[2], 400, 10, 1, 6));

player.addUnit(0, new Soldier(lanePosx[0], canvas.height, 10, 1, 1));
player.addUnit(1, new Lancer(lanePosx[1], canvas.height, 10, 1, 2));
player.addUnit(2, new Cavalry(lanePosx[2], canvas.height, 10, 1, 3));

const enemy = new Player();
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
  // 画像を描画する関数
  function drawImage() {
    // 最初に1回だけclearRectを呼ぶ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //x, yを更新することで画像の座標を変更できる

    for (ary of player.lanes) {
      for (obj of ary) {
        switch (obj.constructor) {
          case Soldier:
            ctx.drawImage(images[0], obj.pos[0], obj.pos[1]);
            break;
          case Lancer:
            ctx.drawImage(images[1], obj.pos[0], obj.pos[1]);
            break;
          case Cavalry:
            ctx.drawImage(images[2], obj.pos[0], obj.pos[1]);
            break;
        }
      }
    }

    for (ary of enemy.lanes) {
      for (obj of ary) {
        switch (obj.constructor) {
          case Soldier:
            ctx.drawImage(images[0], obj.pos[0], canvas.height - obj.pos[1]);
            break;
          case Lancer:
            ctx.drawImage(images[1], obj.pos[0], canvas.height - obj.pos[1]);
            break;
          case Cavalry:
            ctx.drawImage(images[2], obj.pos[0], canvas.height - obj.pos[1]);
            break;
        }
      }
    }
  }

  function mainLoop() {
    //ここに繰り返したいものを書く
    //attack
    for (let i = 0; i < player.lanes.length; i++) {
      if (player.lanes[i].length == 0 || enemy.lanes[enemy.lanes.length - i - 1].length == 0) continue;
      if (Math.abs(player.lanes[i][0].pos[1] - (canvas.height - enemy.lanes[enemy.lanes.length - i - 1][0].pos[1])) <= images[0].height) {
        player.lanes[i][0].isMove = false;
        enemy.lanes[enemy.lanes.length - i - 1][0].isMove = false;
        player.lanes[i][0].attack(enemy.lanes[enemy.lanes.length - i - 1][0]);
        enemy.lanes[enemy.lanes.length - i - 1][0].attack(player.lanes[i][0]);
      }
    }

    //move
    for (let i = 0; i < player.lanes.length; i++) {
      for (let j = 0; j < player.lanes[i].length; j++) {
        if (j == 0) {
          if (enemy.lanes[enemy.lanes.length - i - 1].length == 0 ||
            Math.abs(player.lanes[i][j].pos[1] - (canvas.height - enemy.lanes[enemy.lanes.length - i - 1][0].pos[1])) > images[0].height) {
            player.lanes[i][j].isMove = true;
          }
        } else {
          player.lanes[i][j].isMove = Math.abs(player.lanes[i][j - 1].pos[1] - player.lanes[i][j].pos[1]) > images[0].height;
        }
        player.lanes[i][j].update();
        if (player.lanes[i][j].hp <= 0) player.eraseUnit(i);
      }
    }

    for (let i = 0; i < enemy.lanes.length; i++) {
      for (let j = 0; j < enemy.lanes[i].length; j++) {
        if (j == 0) {
          if (player.lanes[player.lanes.length - i - 1].length == 0 ||
            Math.abs(enemy.lanes[i][j].pos[1] - (canvas.height - player.lanes[player.lanes.length - i - 1][0].pos[1])) > images[0].height) {
            enemy.lanes[i][j].isMove = true;
          }
        } else {
          enemy.lanes[i][j].isMove = Math.abs(enemy.lanes[i][j - 1].pos[1] - enemy.lanes[i][j].pos[1]) > images[0].height;
        }
        enemy.lanes[i][j].update();
        if (enemy.lanes[i][j].hp <= 0) enemy.eraseUnit(i);
      }
    }

    drawImage();
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
