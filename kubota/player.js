class Player {
<<<<<<< HEAD
    constructor(playerID) {
        this.playerID = playerID;
        this.castleHP = 100;
        this.myCost = 100;
        this.costIncrease = 10;
        this.lanes = [[], [], []];
    }
    addUnit(index, element) {
        this.lanes[index].push(element); //末尾にelementを追加
=======
    constructor(playerID, castlePos) {
        this.playerId = playerID;
        this.hp = 100;
        this.HPMAX = 100;
        this.myUnitPoint = 0;
        this.unitCost = 2;
        this.unitPointIncrease = 1;
        this.unitPointIncreaseTick = 1000;
        this.lanes = [[], [], []];
        this.remainTime = 0;
        this.unitPointIncreaseUpdateTime = 0;
        this.pos = { x: castlePos.x, y: castlePos.y }
        this.intervalID = null; //clearIntervalで使うため
        this.timeoutID = null;
    }
    addUnit(index, element) {
        if (this.myUnitPoint >= this.unitCost) {
            this.myUnitPoint -= this.unitCost;
            this.lanes[index].push(element); //末尾にelementを追加
        }
>>>>>>> kubota
    }
    eraseUnit(index) {
        this.lanes[index].shift(); //配列の最初の要素をpopする
    }
<<<<<<< HEAD
};
=======

    startUnitPointIncrease() {
        //ポースする前までの秒数分まつための処理
        this.timeoutID = setTimeout(() => {
            this.unitPointIncreaseUpdateTime = performance.now();
            console.log(performance.now());
            this.myUnitPoint += this.unitPointIncrease;
            this.intervalID = setInterval(() => { //pauseunitPointIncreaseで停止させるためにintervalIDに入れる
                this.unitPointIncreaseUpdateTime = performance.now();
                console.log(performance.now());
                this.myUnitPoint += this.unitPointIncrease;
            }, this.unitPointIncreaseTick);
            this.remainTime = 0;
        }, this.remainTime);
    }

    pauseUnitPointIncrease() {
        if (this.remainTime != 0) clearTimeout(this.timeoutID);
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
>>>>>>> kubota
