const bgm = new Audio("music/maoudamashii/maoudamashii_bgm.mp3");

function playBGM() {
    bgm.loop = true;
    bgm.volume = 0.05;
    bgm.play();
}