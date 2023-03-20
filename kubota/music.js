const bgm = new Audio("music/maoudamashii/maoudamashii_bgm.mp3");
const unitAttackSE = new Audio("music/maoudamashii/maou_se_battle16.mp3");
const castleAttackSE = new Audio("music/maoudamashii/maou_se_battle03.mp3");
const unitSelectSE = new Audio("music/maoudamashii/maou_se_system13.mp3");
const unitDeploySE = new Audio("music/maoudamashii/maou_se_system10.mp3");


function playBGM() {
    bgm.loop = true;
    bgm.volume = 0.05;
    bgm.play();
}

function stopBGM() {
    bgm.pause();
    bgm.currentTime = 0;
}

function playSE(obj) {
    obj.currentTime = 0;
    obj.play();
}

function playUnitAttackSE() {
    playSE(unitAttackSE);
}

function playCastleAttackSE() {
    playSE(castleAttackSE);
}

function playUnitSelectSE() {
    playSE(unitSelectSE);
}

function playUnitDeploySE() {
    playSE(unitDeploySE);
}