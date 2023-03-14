class Player {
    constructor(playerID, castlePos) {
        this.playerId = playerID;
        this.hp = 100;
        this.HPMAX = 100;
        this.myCost = 20;
        this.costIncrease = 10;
        this.lanes = [[], [], []];
        this.pauseFlag = false;
        this.TIME_COST_UP = 1000;
        this.remainTime = 1;
        this.pos = { x: castlePos.x, y: castlePos.y }
    }
    addUnit(index, element) {
        if (this.myCost >= 1) {
            this.myCost--;
            this.lanes[index].push(element); //末尾にelementを追加
        }
    }
    eraseUnit(index) {
        this.lanes[index].shift(); //配列の最初の要素をpopする
    }
    startCostIncrease() {
        let isFirstInterval = true;
        if (!this.pauseFlag) {
            /* setTimeout(()=> {
                isFirstInterval = false;
            }, this.remainTime); */
            /* /* if(!isFirstInterval){ */
            setInterval(() => {
                console.log(performance.now());
            }, 1000);
        }
    }


    pauseCostIncrease() {
        this.pauseFlag = !this.pauseFlag;
        console.log(this.pauseFlag);
        this.remainTime = 1000 - performance.now();
    }

    attack(obj, damageFlag) {
        if (damageFlag) {
            let damage = 1;
            obj.hp -= damage;
        }
    }
};
