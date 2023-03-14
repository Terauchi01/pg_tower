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

  setEventListener();

  function mainLoop() {
    //ここに繰り返したいものを書く
    //処理
    dataUpdates();
    //描画
    drawImage();

    //mainloopを回すために必要
    requestAnimationFrame(mainLoop);
  }

  //mainloopを回すために必要
  requestAnimationFrame(mainLoop);
}).catch((err) => {
  console.error("Error loading images:", err);
});
