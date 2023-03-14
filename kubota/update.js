//ユニットの攻撃、playerObj1,playerObj2には各プレイヤーのインスタンスを渡す(順不同)
function attackUnit(playerObj1, playerObj2) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
        //length!=0を先に判定しないと配列外アクセス
        if (playerObj1.lanes[i].length != 0 && playerObj2.lanes[playerObj2.lanes.length - i - 1].length != 0) {
            let obj1 = playerObj1.lanes[i][0];
            let obj2 = playerObj2.lanes[playerObj2.lanes.length - i - 1][0];
            let dx = obj1.pos.x - (canvasSize.width - obj2.pos.x), dy = obj1.pos.y - (canvasSize.height - obj2.pos.y);
            if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(unitSize.height, 2)) {
                obj1.attack(obj2);
                obj2.attack(obj1);
            }
        } else if (playerObj1.lanes[i].length != 0 && playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0) {
            if (Math.abs(playerObj1.lanes[i][0].pos.x - (canvasSize.width - playerObj2.pos.x)) < castleSize.width / 2 + unitSize.width / 2 &&
                Math.abs(playerObj1.lanes[i][0].pos.y - (canvasSize.height - playerObj2.pos.y)) < castleSize.height / 2 + unitSize.height / 2) {
                playerObj1.lanes[i][0].attack(playerObj2);
                playerObj2.attack(playerObj1.lanes[i][0]);
            }
        } else if (playerObj1.lanes[i].length == 0 && playerObj2.lanes[playerObj2.lanes.length - i - 1].length != 0) {
            if (Math.abs(playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.x - (canvasSize.width - playerObj1.pos.x)) < castleSize.width / 2 + unitSize.width / 2 &&
                Math.abs(playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.y - (canvasSize.height - playerObj1.pos.y)) < castleSize.height / 2 + unitSize.height / 2) {
                playerObj2.lanes[playerObj2.lanes.length - i - 1][0].attack(playerObj1);
                playerObj1.attack(playerObj2.lanes[playerObj2.lanes.length - i - 1][0]);
            }
        }
    }
}

//ユニットの移動関係,動かしたいplayerのインスタンスをplayerObj1,もう片方のインスタンスをplayerObj2
function updateUnit(playerObj1, playerObj2) {
    for (let i = 0; i < playerObj1.lanes.length; i++) {
        for (let j = 0; j < playerObj1.lanes[i].length; j++) {
            let dir = unitDir.middle;
            if (i == 0) {
                if (playerObj1.lanes[i][j].pos.y < canvasSize.height / 3) {
                    dir = unitDir.left;
                } else if (playerObj1.lanes[i][j].pos.y > canvasSize.height / 3 * 2) {
                    dir = unitDir.right;
                }
            } else if (i == 2) {
                if (playerObj1.lanes[i][j].pos.y < canvasSize.height / 3) {
                    dir = unitDir.right;
                } else if (playerObj1.lanes[i][j].pos.y > canvasSize.height / 3 * 2) {
                    dir = unitDir.left;
                }
            }

            if (j == 0) {
                if (playerObj2.lanes[playerObj2.lanes.length - i - 1].length == 0) {
                    if (Math.abs(playerObj1.lanes[i][j].pos.x - (canvasSize.width - playerObj2.pos.x)) >= castleSize.width / 2 + unitSize.width / 2 ||
                        Math.abs(playerObj1.lanes[i][j].pos.y - (canvasSize.height - playerObj2.pos.y)) >= castleSize.height / 2 + unitSize.height / 2) {
                        playerObj1.lanes[i][j].isMove = true;
                    }
                } else {
                    let dx = playerObj1.lanes[i][j].pos.x - (canvasSize.width - playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.x), dy = playerObj1.lanes[i][j].pos.y - (canvasSize.height - playerObj2.lanes[playerObj2.lanes.length - i - 1][0].pos.y);
                    if (Math.pow(dx, 2) + Math.pow(dy, 2) > Math.pow(unitSize.height, 2)) {
                        playerObj1.lanes[i][j].isMove = true;
                    }
                }
            } else {
                let dx = playerObj1.lanes[i][j].pos.x - playerObj1.lanes[i][j - 1].pos.x, dy = playerObj1.lanes[i][j].pos.y - playerObj1.lanes[i][j - 1].pos.y;
                if (Math.pow(dx, 2) + Math.pow(dy, 2) > Math.pow(unitSize.height, 2)) {
                    playerObj1.lanes[i][j].isMove = true;
                } else {
                    if (playerObj1.lanes[i][j - 1].constructor === playerObj1.lanes[i][j].constructor) {
                        playerObj1.lanes[i][j - 1].isCooperate = true;
                    }
                    playerObj1.lanes[i][j].isMove = false;
                }
            }
            let rad = dir * (Math.PI / 180);
            playerObj1.lanes[i][j].update(Math.cos(rad), Math.sin(rad));
        }
    }
}

//指定したplayerのユニットのhpを確認しhpがゼロ以下のユニットを消去
function eraseUnit(playerObj) {
    for (let i = 0; i < playerObj.lanes.length; i++) {
        if (playerObj.lanes[i].length == 0) continue;
        if (playerObj.lanes[i][0].hp <= 0) {
            playerObj.eraseUnit(i);
        }
    }
}

//メインで行う処理
function dataUpdates() {
    countTimer += performance.now() - beforeTime;
    beforeTime = performance.now();
    //attack
    if (countTimer >= attackWait) {
        attackUnit(player, enemy);
        countTimer -= attackWait;
    }

    //move
    updateUnit(player, enemy);
    updateUnit(enemy, player);

    //ユニット消去
    eraseUnit(player);
    eraseUnit(enemy);
}