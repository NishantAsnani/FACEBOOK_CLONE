const like_counter=document.querySelector('.like_counter')
const like_display=document.querySelector('.like_display')
let display=like_display.innerText;
like_counter.addEventListener('click',(e)=>{
    display++;
    like_display.innerText=display
})