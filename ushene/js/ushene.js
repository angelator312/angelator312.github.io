const task = document.getElementById('task')
const input= document.getElementById('result')
const yorn = document.getElementById('yorn')
const dialog= document.getElementById('d')
const verni = document.getElementById("verni")
function random(min=0,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function verniplus() {
    if (!verni.value) {
        verni=1;
    }else{
        verni+=1;
    }

}
input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("okbtn").click();
    }
  });
function newtask() {
    let random1 =random(42,45)
    let znak = random1==44?'/':String.fromCharCode(random1)
    random1=random(1,100)
    if (znak!='+') {
    let random2= random(1,random1)
    if (znak!='-') {
        random2=random(1,10)
        while(znak=='/' && random1%random2!=0){
            random2=random(1,random1)
        }
    }
    task.innerHTML = `${random1}${znak}${random2}`;
    }else{
    task.innerHTML = `${random(1,100)}${znak}${random(1,100)}`;
    }
}
function proverka() {
    if(parseInt(eval(input.value))===parseInt(eval(task.innerHTML))){
        newtask()
        yorn.innerHTML='да'
        verniplus()
    } 
    else  {
        yorn.innerHTML =`не е вярно${eval(task.innerHTML)}`
        input.value=''
        verni.value=0
        newtask()
    }
}
document.body.onload(newtask())
console.clear()