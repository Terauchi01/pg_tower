function cpuAddUnit(obj) {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    if (obj.myUnitPoint >= 1) {
        let index = getRandomInt(3);
        let elementType = getRandomInt(3);
        let pos = { x: 0, y: 0 };
        switch (index) {
            case 0:
                pos = laneStartPos.left;
                break;
            case 1:
                pos = laneStartPos.middle;
                break;
            case 2:
                pos = laneStartPos.right;
                break;
        }
        switch (elementType) {
            case 0:
                obj.addUnit(index, new Soldier(pos.x, pos.y, obj.playerId, lastUnitId++));
                break;
            case 1:
                obj.addUnit(index, new Lancer(pos.x, pos.y, obj.playerId, lastUnitId++));
                break;
            case 2:
                obj.addUnit(index, new Cavalry(pos.x, pos.y, obj.playerId, lastUnitId++));
                break;
        }
    }
}