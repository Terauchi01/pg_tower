class Unit {
    constructor(x, y, hp, atk, speed, playerId, unitTypeId, unitId) {
        // ユニットの座標
        this.pos = { x: x, y: y };
        // ユニットの体力、0以下で死亡
        this.hp = hp;
        this.HPMAX = hp;
        // ユニットの攻撃力
        this.atk = atk;
        // ユニットの移動速度 基本1
        this.speed = speed;
        // ユニットがどちらのプレイヤーに所属しているかを識別する番号
        this.playerId = playerId;
        // ユニットの種類を識別する番号
        this.unitTypeId = unitTypeId;
        // ユニットの個体識別番号
        this.unitId = unitId;
        // 接触バフが生じたかどうか
        this.isCooperate = false;
        // 移動フラグ
        this.isMove = true;
    }

    /*
    update() {
        if (!this.isMove) {
            return;
        }
        this.pos[1] -= this.speed;
    }
    */

    //unitの移動処理, dx, dyは単位ベクトルとなるような数値を渡す
    update(dx, dy) {
        if (!this.isMove) {
            return;
        }
        this.pos.x += this.speed * dx;
        this.pos.y += this.speed * dy;
    }
    //攻撃用の関数,攻撃対象のインスタンスを引数として渡す
    attack(obj) { }
};

class Soldier extends Unit {
    constructor(x, y, playerId, unitId) {
        super(x, y, 2000, 2, 1, playerId, 1, unitId);
    }

    attack(obj) {
        this.isMove = false;
        let damage = this.atk;
        if (obj.constructor === Lancer) damage *= 2;
        if (this.isCooperate) damage *= 2;
        if (obj.constructor === Player) {
            obj.castleHP -= damage;
        } else {
            obj.hp -= damage;
        }
    }
};

class Lancer extends Unit {
    constructor(x, y, playerId, unitId) {
        super(x, y, 2000, 2, 1, playerId, 2, unitId);
    }

    attack(obj) {
        this.isMove = false;
        let damage = this.atk;
        if (obj.constructor === Cavalry) damage *= 2;
        if (this.isCooperate) damage *= 2;
        if (obj.constructor === Player) {
            obj.castleHP -= damage;
        } else {
            obj.hp -= damage;
        }
    }
};

class Cavalry extends Unit {
    constructor(x, y, playerId, unitId) {
        super(x, y, 2000, 2, 1, playerId, 3, unitId);
    }

    attack(obj) {
        this.isMove = false;
        let damage = this.atk;
        if (obj.constructor === Soldier) damage *= 2;
        if (this.isCooperate) damage *= 2;
        if (obj.constructor === Player) {
            obj.castleHP -= damage;
        } else {
            obj.hp -= damage;
        }
    }
};
