// Canvas要素の取得
const canvas = document.getElementById("myCanvas");
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;

//dragに必要な変数
var isDrag = false;
var mousePos = { x: 0, y: 0 };
var selectNum = -1;

//最後に追加したunit固有のid
var lastUnitId = 0;

var myPlayerId = 1;

var countTimer = 0;
var beforeTime = 0;
const attackWait = 1000;

const circleSize = 64;

const ctx = canvas.getContext("2d");

// 画像の読み込み
const imgPaths = ["Image/soldier.png", "Image/lancer.png", "Image/cavalry.png", "Image/soldier2.png", "Image/lancer2.png", "Image/cavalry2.png", "Image/castle.png"];

//画像のインスタンスを保管する配列
const images = [];

//画像チップのサイズを保管
const unitSize = { width: 64, height: 64 };
const castleSize = { width: 256, height: 256 };
//処理に利用するデータの保管
const dragSize = { width: 128, height: 128 };
const canvasSize = { width: canvas.width, height: canvas.height };
const unitDir = { left: 315, middle: 270, right: 225 };
const hpSize = { width: 20, height: 4 };
const castleHpSize = { width: 200, height: 10 };
const costPos = { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 4 };

//ユニットの初期位置を設定
const laneStartPos = {
    left: { x: canvas.width / 2 - castleSize.width / 2 - unitSize.width / 2, y: canvas.height - castleSize.height / 2 },
    middle: { x: canvas.width / 2, y: canvas.height - castleSize.height - unitSize.height / 2 },
    right: { x: canvas.width / 2 + castleSize.width / 2 + unitSize.width / 2, y: canvas.height - castleSize.height / 2 }
};
const dragPos = {
    soldier: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 3 },
    lancer: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height * 2 },
    cavalry: { x: canvas.width - dragSize.width, y: canvas.height - dragSize.height }
};

//各プレイヤーの初期化、現状ユニット追加が未実装の為初期でユニットを配置してテストを行う
const player = new Player(1, { x: canvas.width / 2, y: canvas.height - castleSize.height / 2 });

const enemy = new Player(2, { x: canvas.width / 2, y: canvas.height - castleSize.height / 2 });

//EventListenerの設定,一度のみ呼ばれる
function setEventListener() {
    canvas.addEventListener('mousedown', function (event) {
        //配置するユニットを選択

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
            let dx = pos.x - event.clientX, dy = pos.y - event.clientY;
            if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(circleSize, 2)) {
                switch (selectNum) {
                    case 0:
                        player.addUnit(index, new Soldier(pos.x, pos.y, myPlayerId, lastUnitId++));
                        break;
                    case 1:
                        player.addUnit(index, new Lancer(pos.x, pos.y, myPlayerId, lastUnitId++));
                        break;
                    case 2:
                        player.addUnit(index, new Cavalry(pos.x, pos.y, myPlayerId, lastUnitId++));
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
        if (x > 50 && x < 150 && y > 25 && y < 75) {
            //alert('Button clicked!');
            player.pauseCostIncrease();
        }
    })
}