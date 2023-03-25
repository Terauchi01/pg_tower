// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;

//dragに必要な変数
var isDrag = false;
var mousePos = { x: 0, y: 0 };
var selectNum = -1;
var isShortcut = false;

//最後に追加したunit固有のid
var lastUnitId = 0;

var myPlayerId = 1;

var countTimer = 0;
var beforeTime = 0;
const attackWait = 1000;
var effect = [];

const circleSize = 64;

const ctx = canvas.getContext("2d");

//ボタンのサイズ定義
const buttonPos = { x: canvas.width / 25, y: canvas.height / 25 }
const buttonSize = { width: 100, height: 50 }

//ポーズのフラグ
var isPaused = false;
//終了フラグ
var isEnd = false;

// 画像の読み込み
const imgPaths = ["Image/MySoldier.png", "Image/MyLancer.png", "Image/MyCavalry.png", "Image/EnemySoldier.png", "Image/EnemyLancer.png", "Image/EnemyCavalry.png", "Image/MyCastle.png",
                  "Image/Frame1.png", "Image/Frame2.png", "Image/Frame3.png", "Image/Stage.png", "Image/Arrow.png", "Image/Slash1.png"];

//画像のインスタンスを保管する配列
const images = [];

//画像チップのサイズを保管
const unitSize = { width: 64, height: 64 };
const castleSize = { width: 256, height: 256 };
//処理に利用するデータの保管
const dragSize = { width: 128, height: 128 };
const unitDir = { left: 338, middle: 270, right: 202 };
const hpSize = { width: 20, height: 4 };
const castleHpSize = { width: 200, height: 10 };
const unitPointPos = { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 4 };

//ユニットの初期位置を設定
const laneStartPos = {
    left: { x: canvas.width / 2 - castleSize.width / 2, y: canvas.height - castleSize.height / 2 },
    middle: { x: canvas.width / 2, y: canvas.height - castleSize.height },
    right: { x: canvas.width / 2 + castleSize.width / 2, y: canvas.height - castleSize.height / 2 }
};
const dragPos = {
    soldier: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 3 },
    lancer: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 2 },
    cavalry: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height }
};

//各プレイヤーの初期化、現状ユニット追加が未実装の為初期でユニットを配置してテストを行う
const player = new Player(1, { x: canvas.width / 2, y: canvas.height - castleSize.height / 2 });
player.startUnitPointIncrease();

const enemy = new Player(2, { x: canvas.width / 2, y: canvas.height - castleSize.height / 2 });
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
                playUnitSelectSE();
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
            if (myPlayerId == player.playerId) {
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
                if (!isDrag) playUnitSelectSE();
                isDrag = true;
                isShortcut = true;
                selectNum = 0;
                break;
            case '2':
                if (!isDrag) playUnitSelectSE();
                isDrag = true;
                isShortcut = true;
                selectNum = 1;
                break;
            case '3':
                if (!isDrag) playUnitSelectSE();
                isDrag = true;
                isShortcut = true;
                selectNum = 2;
                break;
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
            }
        }
    });
}
