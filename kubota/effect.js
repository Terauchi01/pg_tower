class Effect {
    constructor() {
        this.yet = false;
    }

    //draw() { }
}

class UnitAttackEffect extends Effect {
    constructor(pos) {
        super();
        this.pos = {x:pos.x, y:pos.y};
        this.num = 10;
        this.time = [];
        this.edgePos = [];
        this.dir = [];
        this.size = [];
        this.randomRange = 12;
        this.countTime = 0;
        this.beforeTime = performance.now();
        this.timeRange = 256;
        this.timeRandomRange = 1000;
        for (let i = 0; i < this.num; i++) {
            this.time[i] = Math.random() * (this.timeRandomRange);
            this.dir[i] = Math.random() * 360 * Math.PI / 180;
            this.edgePos[i] = { x: Math.random() * this.randomRange, y: Math.random() * this.randomRange };
            this.size[i] = Math.random() * unitSize.height / 2;
        }
    }
}

class CastleAttackEffect extends Effect {
    constructor(spos, epos) {
        super();
        this.pos = {x:spos.x, y:spos.y};
        this.epos = {x:epos.x, y:epos.y};
        this.dir = Math.atan2(epos.y - spos.y, epos.x - spos.x);
        this.len = Math.sqrt(Math.pow(epos.y - spos.y, 2) + Math.pow(epos.x - spos.x, 2));
        this.speed = 10;
    }
}

function updateAttackEffect() {
    for (let obj of effect) {
        if (obj.constructor === UnitAttackEffect) {
            if (!isPaused) obj.countTime += performance.now() - obj.beforeTime;
            obj.beforeTime = performance.now();
        } else {
            if (isPaused) continue;
            if (obj.len >= obj.speed) {
                obj.pos.x += Math.cos(obj.dir) * obj.speed;
                obj.pos.y += Math.sin(obj.dir) * obj.speed;
                obj.len -= obj.speed;
            } else {
                obj.pos.x += Math.cos(obj.dir) * obj.len;
                obj.pos.y += Math.sin(obj.dir) * obj.len;
                obj.len = 0;
                obj.yet = true;
            }
        }
    }
}

function drawAttackEffect() {
    for (let obj of effect) {
        if (obj.constructor === UnitAttackEffect) {
            let edge = (i) => {
                ctx.save();
                ctx.globalAlpha = Math.max(0, obj.timeRange - Math.abs(obj.time[i] - obj.countTime)) / obj.timeRange;
                ctx.translate(obj.pos.x, obj.pos.y);
                ctx.rotate(obj.dir[i]);
                ctx.drawImage(images[12], obj.edgePos[i].x - obj.size[i] / 2, obj.edgePos[i].y - obj.size[i] / 2, obj.size[i], obj.size[i]);
                ctx.restore();
            }
            for (let i = 0; i < obj.num; i++) {
                edge(i);
            }
            if (performance.new - obj.makeTime > obj.timeRandomRange) obj.yet = true;
        } else {
            console.log(obj);
            ctx.save();
            // 回転の中心に原点を移動する
            ctx.translate(obj.pos.x, obj.pos.y);
            // canvasを回転する
            ctx.rotate(obj.dir);
            // 画像サイズの半分だけずらして画像を描画する
            ctx.drawImage(images[11], 0, 0);
            // コンテキストを元に戻す
            ctx.restore();
        }
    }
}