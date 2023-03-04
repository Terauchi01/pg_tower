// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;
const ctx = canvas.getContext("2d");

// 画像の読み込み
const imgPaths = ["Image/rico.png", "Image/test1.png", "Image/soldier.png", "Image/lancer.png", "Image/cavalry.png"];
const images = [];

const player = new Player();
player.addUnit(0, new Soldier(100, 200, 10, 1, 1));
player.addUnit(1, new Lancer(200, 300, 10, 1, 2));
player.addUnit(2, new Cavalry(300, 200, 10, 1, 3));


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
            ctx.drawImage(images[2], obj.pos[0], obj.pos[1]);
            break;
          case Lancer:
            ctx.drawImage(images[3], obj.pos[0], obj.pos[1]);
            break;
          case Cavalry:
            ctx.drawImage(images[4], obj.pos[0], obj.pos[1]);
            break;
        }
      }
    }
  }

  function mainLoop() {
    //ここに繰り返したいものを書く
    for (ary of player.lanes) {
      for (obj of ary) {
        obj.move();
        if (obj.pos[1] < 0) obj.isMove = false;
      }
    }

    drawImage();
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
