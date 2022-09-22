let task = document.getElementById('task')
let input= document.getElementById('result')
let yorn = document.getElementById('yorn')
function random(min=0,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function newtask() {
    let random1 =random(42,45)
    let znak = random1==44?'/':String.fromCharCode(random1)
    if (znak=='/'|| znak=='-' || znak=='*') {
    let random2= random(0,random1)
    task.innerHTML = `${random(0,100)}${znak}${random2}`;
    }else{
    task.innerHTML = `${random(0,100)}${znak}${random(0,100)}`;
    }
}
function proverka() {
    if(parseInt(eval(input.value))===parseInt(eval(task.innerHTML))){
        newtask()
        yorn.innerHTML='да'
    } 
    else  {
        yorn.innerHTML =`не е вярно${eval(task.innerHTML)}`
        input.value=''
        newtask()
    }
}
document.body.onload(newtask())
console.clear()