class Player {
    constructor() {
        this.lanes = [[], [], []];
    }

    addUnit(index, element) {
        this.lanes[index].push(element);
    }

    eraseUnit(index) {
        this.lanes[index].shift();
    }
};