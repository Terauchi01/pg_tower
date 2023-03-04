class Player {
    constructor(playerID) {
        this.playerID = playerID;
        this.castleHP = 100;
        this.myCost = 100;
        this.costIncrease = 10;
        this.lanes = [[], [], []];
    }
    addUnit(index, element) {
        this.lanes[index].push(element); //末尾にelementを追加
    }
    eraseUnit(index) {
        this.lanes[index].shift(); //配列の最初の要素をpopする
    }
};
