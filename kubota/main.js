// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

// 画像の読み込み
const imgPaths = ["Image/rico.png", "Image/test1.png"];
const images = [];

const player = new Player();
player.addUnit(1, new Soldier(1, 1, 1, 1, 1, 1));

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

  // 画像を描画する関数
  function drawImage() {
    // 最初に1回だけclearRectを呼ぶ
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //x, yを更新することで画像の座標を変更できる
    ctx.drawImage(images[0], x, y);
    ctx.drawImage(images[1], y, x);
  }

  function mainLoop() {
    //ここに繰り返したいものを書く
    if (y < canvas.height - images[0].height) y++;
    drawImage();
    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
