class Unit {
    constructor(x, y, hp, atk, speed, playerId, unitTypeId, unitId) {
        this.pos = [x, y];
        this.hp = hp;
        this.atk = atk;
        this.speed = speed;
        this.playerId = playerId;
        this.unitTypeId = unitTypeId;
        this.unitId = unitId;
        this.isCooperate = false;
        this.isMove = true;
    }

    update() {
        if (!this.isMove) {
            return;
        }
        this.pos[1] -= this.speed;
    }
    //attack(obj) { }
};

class Soldier extends Unit {
    constructor(x, y, hp, playerId, unitId) {
        super(x, y, hp, 2, 1, playerId, 1, unitId);
    }

    attack(obj) {
        this.isMove = false;
        let damage = this.atk;
        if (obj.constructor === Lancer) damage *= 2;
        if (this.isCooperate) damage *= 2;
        obj.hp -= damage;
    }
};

class Lancer extends Unit {
    constructor(x, y, hp, playerId, unitId) {
        super(x, y, hp, 2, 1, playerId, 2, unitId);
    }

    attack(obj) {
        this.isMove = false;
        let damage = this.atk;
        if (obj.constructor === Cavalry) damage *= 2;
        if (this.isCooperate) damage *= 2;
        obj.hp -= damage;
    }
};

class Cavalry extends Unit {
    constructor(x, y, hp, playerId, unitId) {
        super(x, y, hp, 2, 1, playerId, 3, unitId);
    }

    attack(obj) {
        this.isMove = false;
        let damage = this.atk;
        if (obj.constructor === Soldier) damage *= 2;
        if (this.isCooperate) damage *= 2;
        obj.hp -= damage;
    }
};
