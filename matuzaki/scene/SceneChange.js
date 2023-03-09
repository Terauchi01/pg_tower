let button = document.querySelector("input:checked[name*=Scene]").value;
button.addEventListener('click', ButtonClicked);
function ButtonClicked(){
    document.forms.Scene.submit();
}
/*
btn.addEventListener('click',()=>{
    document.forms.Scene.submit();
});
*/
