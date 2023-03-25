import { Soldier, Lancer, Cavalry } from './unit';
import {Player} from './player';
import { createCanvas } from 'canvas';

import arrowImg from './Image/arrow.png';
import backgroundImg from './Image/background.png';
import castleImg from './Image/castle.png';
import cavalryImg from './Image/cavalry.png';
import cavalry2Img from './Image/cavalry2.png';
import frame1Img from './Image/frame1.png';
import frame2Img from './Image/frame2.png';
import frame3Img from './Image/frame3.png';
import lancerImg from './Image/lancer.png';
import lancer2Img from './Image/lancer2.png';
import slashImg from './Image/slash.png';
import soldierImg from './Image/soldier.png';
import soldier2Img from './Image/soldier2.png';

// Canvas要素の取得
export const canvas = createCanvas(document.documentElement.scrollWidth,document.documentElement.scrollHeight);

//dragに必要な変数
export var isDrag = false;
export var mousePos = { x: 0, y: 0 };
export var selectNum = -1;
var isShortcut = false;

//最後に追加したunit固有のid
export var lastUnitId = 0;

export var myPlayerId = 1;

export var countTimer = 0;
export var beforeTime = 0;
export const attackWait = 1000;

export const circleSize = 64;

export const ctx = canvas.getContext("2d");

//ボタンのサイズ定義
export const buttonPos = { x: canvas.width / 25, y: canvas.height / 25 }
export const buttonSize = { width: 100, height: 50 }

//ポーズのフラグ
export var isPaused = false;
//終了フラグ
export var isEnd = false;

// 画像の読み込み
export const imgPaths = [
    arrowImg,
    backgroundImg,
    castleImg,
    cavalryImg,
    cavalry2Img,
    frame1Img,
    frame2Img,
    frame3Img,
    lancerImg,
    lancer2Img,
    slashImg,
    soldierImg,
    soldier2Img,
];

//画像のインスタンスを保管する配列
export const images = [];

//画像チップのサイズを保管
export const unitSize = { width: 64, height: 64 };
export const castleSize = { width: 256, height: 256 };
//処理に利用するデータの保管
export const dragSize = { width: 128, height: 128 };
export const unitDir = { left: 315, middle: 270, right: 225 };
export const hpSize = { width: 20, height: 4 };
export const castleHpSize = { width: 200, height: 10 };
export const unitPointPos = { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 4 };

//ユニットの初期位置を設定
export const laneStartPos = {
    left: { x: canvas.width / 2 - castleSize.width / 2, y: canvas.height - castleSize.height / 2 },
    middle: { x: canvas.width / 2, y: canvas.height - castleSize.height },
    right: { x: canvas.width / 2 + castleSize.width / 2, y: canvas.height - castleSize.height / 2 }
};
export const dragPos = {
    soldier: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 3 },
    lancer: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 2 },
    cavalry: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height }
};

//各プレイヤーの初期化、現状ユニット追加が未実装の為初期でユニットを配置してテストを行う
export const player = new Player(1, { x: canvas.width / 2, y: canvas.height - castleSize.height / 2 });
player.startUnitPointIncrease();

export const enemy = new Player(2, { x: canvas.width / 2, y: canvas.height - castleSize.height / 2 });
enemy.startUnitPointIncrease();

//EventListenerの設定,一度のみ呼ばれる
function setEventListener() {
    canvas.addEventListener('mousedown', function (event) {
        //配置するユニットを選択
        if (isPaused) return;
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
            let obj;
            if (myPlayerId === player.playerId) {
                obj = player;
            } else {
                obj = enemy;
            }
            let dx = pos.x - event.clientX, dy = pos.y - event.clientY;
            if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(circleSize, 2)) {
                switch (selectNum) {
                    case 0:
                        obj.addUnit(index, new Soldier(pos.x, pos.y, myPlayerId, lastUnitId++));
                        break;
                    case 1:
                        obj.addUnit(index, new Lancer(pos.x, pos.y, myPlayerId, lastUnitId++));
                        break;
                    case 2:
                        obj.addUnit(index, new Cavalry(pos.x, pos.y, myPlayerId, lastUnitId++));
                        break;
                    default:
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

    canvas.addEventListener('click', function (event) {
        // クリックされた座標を取得
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;

        // ボタン内をクリックした場合
        if (x > buttonPos.x && x < buttonPos.x + buttonSize.width && y > buttonPos.y && y < buttonPos.y + buttonSize.height) {
            //alert('Button clicked!');
            if (isPaused) {
                player.startUnitPointIncrease();
                enemy.startUnitPointIncrease();
            } else {
                player.pauseUnitPointIncrease();
                enemy.pauseUnitPointIncrease();
            }
            isPaused = !isPaused;
            //alert(isPaused);
            console.log("paused");
        }
    })

    //ここはdocumentにしないとダメ絶対
    //ショートカットキーを用いたユニット生成
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case '1':
                isDrag = true;
                isShortcut = true;
                selectNum = 0;
                break;
            case '2':
                isDrag = true;
                isShortcut = true;
                selectNum = 1;
                break;
            case '3':
                isDrag = true;
                isShortcut = true;
                selectNum = 2;
                break;
            default:
        }
    });

    document.addEventListener('keyup', function (event) {
        if (isShortcut) {
            switch (event.key) {
                case '1':
                    isDrag = false;
                    isShortcut = false;
                    break;
                case '2':
                    isDrag = false;
                    isShortcut = false;
                    break;
                case '3':
                    isDrag = false;
                    isShortcut = false;
                    break;
                default:
            }
        }
    });
}
