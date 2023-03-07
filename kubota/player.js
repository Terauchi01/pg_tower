class Player {
    constructor(playerID) {
        this.playerID = playerID;
        this.castleHP = 100;
        this.myCost = 100;
        this.costIncrease = 10;
        this.lanes = [[], [], []];
        this.timerId = null;
        this.s = 0;
        this.flg = false;
    }
    addUnit(index, element) {
        this.lanes[index].push(element); //末尾にelementを追加
    }
    eraseUnit(index) {
        this.lanes[index].shift(); //配列の最初の要素をpopする
    }
    startCostIncrease() {
    if (!this.timerId) {
        this.timerId = setInterval(() => {
            console.log(this.s++ +" s");
    }, 1000);
}
}

        pauseCostIncrease() {
clearInterval(this.timerId);
this.timerId = null;
}
};
