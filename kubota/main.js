// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;
const ctx = canvas.getContext("2d");

// 画像の読み込み
const imgPaths = ["Image/rico.png", "Image/test1.png", "Image/cavalry.png", "Image/lancer.png", "Image/soldier.png"];
const images = [];

const player = new Player();
player.addUnit(0, new Soldier(100, 200, 10, 1, 1));

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
  // 画像の初期座標
  let x = 0;
  let y = 0;

  let x2 = 0;
  let y2 = 0;

  // 画像を描画する関数
  function drawImage() {
    // 最初に1回だけclearRectを呼ぶ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //x, yを更新することで画像の座標を変更できる
    ctx.drawImage(images[2], x, y);
    ctx.drawImage(images[3], x2, y2);
    ctx.drawImage(images[4], player.lanes[0][0].pos[0], player.lanes[0][0].pos[1]);
  }

  function mainLoop() {
    //ここに繰り返したいものを書く
    if (y < canvas.height - images[2].height) y++;
    if (x2 < canvas.width - images[3].width) x2++;
    drawImage();
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
