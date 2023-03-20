import React, { useEffect, useRef } from 'react';
import main, { imgPaths, images, setEventListener, playBGM, dataUpdates, drawImage } from '../kubota/main';

function Battle() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // 画像読み込み
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
        // ここに繰り返したいものを書く
        // 処理
        dataUpdates();
        // 描画
        drawImage(context);

        // mainloopを回すために必要
        requestAnimationFrame(mainLoop);
      }

      // mainloopを回すために必要
      requestAnimationFrame(mainLoop);
    }).catch((err) => {
      console.error("Error loading images:", err);
    });
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="myCanvas"></canvas>
    </div>
  );
}

export default Battle;
