var test = document.getElementById("test");
test.style.position = "absolute";
test.style.cursor = "pointer";
test.style.zIndex = "2";
test.ondragstart = function(e){
  return false;
}

function onMouseMove(event){
  var x = event.clientX;
  var y = event.clientY;
  var width = test.offsetWidth;
  var height = test.offsetHeight;
  test.style.top = (y-height/2) + "px";
  test.style.left = (x-width/2) + "px";
}

//マウスが押されている間//
test.onmousedown = function(event){
  document.addEventListener("mousemove",onMouseMove);
}

//マウスが離されている間//
test.onmouseup = function(event){
  document.removeEventListener("mousemove",onMouseMove);
}