class Player {
    constructor() {
        this.lanes = [[], [], []];
    }

    addUnit(index, element) {
        this.lanes[index-1].push(element);
    }

    eraseUnit(index) {
        this.lanes[index-1].shift();
    }
};