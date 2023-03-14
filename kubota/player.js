class Player {
    constructor(playerID, castlePos) {
        this.playerId = playerID;
        this.hp = 100;
        this.HPMAX = 100;
        this.myUnitPoint = 20;
        this.unitPointIncrease = 1;
        this.unitPointIncreaseTick = 1000;
        this.lanes = [[], [], []];
        this.remainTime = 0;
        this.unitPointIncreaseUpdateTime = 0;
        this.pos = { x: castlePos.x, y: castlePos.y }
        this.intervalID = null; //clearIntervalで使うため
    }
    addUnit(index, element) {
        if (this.myUnitPoint >= 1) {
            this.myUnitPoint--;
            this.lanes[index].push(element); //末尾にelementを追加
        }
    }
    eraseUnit(index) {
        this.lanes[index].shift(); //配列の最初の要素をpopする
    }

    startUnitPointIncrease() {
    //ポースする前までの秒数分まつための処理
    setTimeout(()=> {
        this.unitPointIncreaseUpdateTime = performance.now();
        console.log(performance.now());
        this.myUnitPoint += this.unitPointIncrease;
        this.intervalID = setInterval(() => { //pauseunitPointIncreaseで停止させるためにintervalIDに入れる
            this.unitPointIncreaseUpdateTime = performance.now();
            console.log(performance.now());
            this.myUnitPoint += this.unitPointIncrease;
        }, this.unitPointIncreaseTick);
    }, this.remainTime);
    }

    pauseUnitPointIncrease() {
        clearInterval(this.intervalID);
        this.remainTime = this.unitPointIncreaseTick - (performance.now() - this.unitPointIncreaseUpdateTime);
    }

    attack(obj, damageFlag) {
        if (damageFlag) {
            let damage = 1;
            obj.hp -= damage;
        }
    }
}
