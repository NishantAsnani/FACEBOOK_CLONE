const arrow=document.querySelector('.arrow');
const list=document.querySelector('.list');
const btn=document.querySelector('.btn');
arrow.addEventListener('click',()=>{
    list.classList.toggle('show');
    arrow.classList.toggle('rotate')
})