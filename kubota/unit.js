class Unit {
    constructor(x, y, hp, attack, speed, playerId, unitTypeId, unitId) {
        this.pos = [x, y];
        this.hp = hp;
        this.attack = attack;
        this.speed = speed;
        this.playerId = playerId;
        this.unitTypeId = unitTypeId;
        this.unitId = unitId;
    }

    attack(obj) { }
};

class Soldier extends Unit {
    constructor(x, y, hp, playerId, unitId) {
        super(x, y, hp, 2, 1, playerId, 1, unitId);
    }

    attack(obj) {
        
    }
};

class Lancer extends Unit {
    constructor(x, y, hp, playerId, unitId) {
        super(x, y, hp, 2, 1, playerId, 2, unitId);
    }

    attack(obj) {
        if (obj.constructor === Cavalry) obj.hp -= this.attack;
    }
};

class Cavalry extends Unit {
    constructor(x, y, hp, playerId, unitId) {
        super(x, y, hp, 2, 1, playerId, 3, unitId);
    }

    attack(obj) {

    }
};
