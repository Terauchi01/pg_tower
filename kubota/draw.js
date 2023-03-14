//HPバーを描画,対象のインスタンスと対象の大きさとバーの大きさを渡す
function drawHP(obj, objSize, barSize) {
    let hpPar = (obj) => {
        if (obj.hp <= 0) return 0;
        return obj.hp / obj.HPMAX;
    }
    let hpPos = { x: obj.pos.x, y: obj.pos.y };
    if (obj.playerId != 1) {
        hpPos.x = canvas.width - hpPos.x;
        hpPos.y = canvas.height - hpPos.y;
    }
    ctx.beginPath();
    ctx.rect(hpPos.x - barSize.width / 2, hpPos.y - objSize.height / 2, barSize.width, barSize.height);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(hpPos.x - barSize.width / 2, hpPos.y - objSize.height / 2, hpPar(obj) * barSize.width, barSize.height);
    ctx.fillStyle = 'rgb(50, 205, 50)';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(hpPos.x - barSize.width / 2, hpPos.y - objSize.height / 2, barSize.width, barSize.height);
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.strokeStyle = 'rgb(0, 0, 0)';
}

//ユニットの画像描画用の関数,playerのインスタンスを渡すとそのplayerの保持するユニットを描画, canvasSize, unitSizeにはサイズを渡す
function drawUnit(playerObj) {
    for (ary of playerObj.lanes) {
        for (obj of ary) {
            let px = obj.pos.x, py = obj.pos.y, index = 0;
            if (playerObj.playerId != 1) {
                px = canvasSize.width - px;
                py = canvasSize.height - py;
                index = 3;
            }
            switch (obj.constructor) {
                case Soldier:
                    ctx.drawImage(images[0 + index], px - unitSize.width / 2, py - unitSize.height / 2);
                    break;
                case Lancer:
                    ctx.drawImage(images[1 + index], px - unitSize.width / 2, py - unitSize.height / 2);
                    break;
                case Cavalry:
                    ctx.drawImage(images[2 + index], px - unitSize.width / 2, py - unitSize.height / 2);
                    break;
            }
            drawHP(obj, unitSize, hpSize);
        }
    }
}

//ユニット配置場所を知らせるサークルを描画
function drawCircle(pos) {
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.arc(pos.x, pos.y, circleSize, (performance.now() / 100) * Math.PI / 180, ((performance.now() / 100) + 360) * Math.PI / 180, false);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgb(0, 0, 0)';
}

//保持コストを描画
function drawCost(obj) {
    let fontSize = 60;
    ctx.font = fontSize + 'px Arial';
    ctx.fillText(Math.floor(obj.myCost), costPos.x - fontSize / 2 * Math.floor(Math.log10(Math.max(1, obj.myCost))), costPos.y - fontSize / 2);
}

function drawButton() {
    // ボタンの外枠を描画
    ctx.beginPath();
    ctx.rect(50, 25, 100, 50);
    ctx.stroke();

    // ボタンに表示するテキストを設定
    ctx.font = '20px Arial';
    ctx.fillText('test', 80, 55);
}

// 画像を描画する関数
function drawImage() {
    // 最初に1回だけclearRectを呼ぶ
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    //x, yを更新することで画像の座標を変更できる
    if (player.hp > 0) {
        drawHP(player, castleSize, castleHpSize);
        ctx.drawImage(images[6], player.pos.x - castleSize.width / 2, player.pos.y - castleSize.height / 2);
    }
    if (enemy.hp > 0) {
        drawHP(enemy, castleSize, castleHpSize);
        ctx.drawImage(images[6], canvas.width - enemy.pos.x - castleSize.width / 2, canvas.height - enemy.pos.y - castleSize.height / 2);
    }

    ctx.drawImage(images[0], dragPos.soldier.x - dragSize.width / 2, dragPos.soldier.y - dragSize.height / 2, dragSize.width, dragSize.height);
    ctx.drawImage(images[1], dragPos.lancer.x - dragSize.width / 2, dragPos.lancer.y - dragSize.height / 2, dragSize.width, dragSize.height);
    ctx.drawImage(images[2], dragPos.cavalry.x - dragSize.width / 2, dragPos.cavalry.y - dragSize.height / 2, dragSize.width, dragSize.height);

    drawCost(player);

    drawCircle(laneStartPos.left);
    drawCircle(laneStartPos.middle);
    drawCircle(laneStartPos.right);

    drawUnit(player);
    drawUnit(enemy);

    drawButton();

    if (isDrag) ctx.drawImage(images[selectNum], mousePos.x - unitSize.width / 2, mousePos.y - unitSize.height / 2);
}