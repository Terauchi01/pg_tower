import { imgPaths,images } from './data.js';
import { setEventListener, playBGM } from './music.js';
import { dataUpdates } from './update.js';
import { drawImage } from './draw.js';

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
  playBGM();

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

export { imgPaths } from './data.js';
export { setEventListener, playBGM } from './music.js';
export { dataUpdates } from './update.js';
export { drawImage } from './draw.js';
export { images } from './data.js';