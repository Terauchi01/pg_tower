class Effect {
    constructor() {
        this.yet = false;
    }

    draw() {}
}

class UnitAttackEffect extends Effect {
    constructor(pos) {
        super();
        this.pos = pos;
        this.num = 10;
        this.time = [];
        this.edgePos = [];
        this.dir = [];
        this.speed = [];
        for (let i = 0; i < this.num; i++) {
            this.time.push(Math.random(1000));
        }
        this.makeTime = performance.now();
        this.range = 256;
    }

    draw() {
        let edge = (i) => {
            ctx.globalAlpha = Math.max(0, this.range - Math.abs(this.time[i] - (performance.now() - this.makeTime)))/this.range;
            ctx.drawImage(images[12], pos.x, pos.y);
        }
        
        ctx.globalAlpha(1);
    }
    
}

class CastleAttackEffect extends Effect {
    constructor(spos, epos) {
        super();
        this.pos = spos;
        this.epos = epos;
        this.dir = Math.atan2(epos.y - spos.y, epos.x - spos.x);
        this.len = Math.sqrt(Math.pow(epos.y - spos.y, 2) + Math.pow(epos.x - spos.x, 2));
        this.speed = 10;
        console.log(this.dir);
    }

    move() {
        if (this.len >= this.speed) {
            this.pos.x += Math.cos(this.dir)*this.speed;
            this.pos.y += Math.sin(this.dir)*this.speed;
            this.len -= this.speed;
        } else {
            this.pos.x += Math.cos(this.dir)*this.len;
            this.pos.y += Math.sin(this.dir)*this.len;
            this.len = 0;
            this.yet = true;
        }
    }

    draw() {
        ctx.save();
        // 回転の中心に原点を移動する
        ctx.translate(this.pos.x, this.pos.y);
        // canvasを回転する
        ctx.rotate(this.dir);
        // 画像サイズの半分だけずらして画像を描画する
        ctx.drawImage(images[11], 0, 0);
        // コンテキストを元に戻す
        ctx.restore();
    }
}