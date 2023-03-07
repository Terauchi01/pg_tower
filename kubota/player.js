class Player {
    constructor(playerID) {
        this.playerID = playerID;
        this.castleHP = 100;
        this.myCost = 100;
        this.costIncrease = 10;
        this.lanes = [[], [], []];
        this.pauseFlag = false;
        this.TIME_COST_UP = 1000;
        this.remainTime = 1;
    }
    addUnit(index, element) {
        this.lanes[index].push(element); //末尾にelementを追加
    }
    eraseUnit(index) {
        this.lanes[index].shift(); //配列の最初の要素をpopする
    }
    startCostIncrease() {
        let isFirstInterval = true;
        if(!this.pauseFlag){
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
};
