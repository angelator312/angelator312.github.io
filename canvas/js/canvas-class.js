var c = document.getElementById("mycanvas")
var ctx = c.getContext("2d")
// console.log((25500/8000)/100);
function random(kray, minimum = 0) {
    return parseInt(Math.floor(Math.random() * kray + minimum))
}
class Sprite {
    constructor() {
        this.initrandom()
    }
    initrandom() {
        let text = ''
        let len = random(16, 5)
        for (let i = 0; i < len; i++) {
            text += String.fromCharCode(random(126, 33))
        }

        this.x = random(c.width)
        this.y = 16 // animira se от 0 до height
        this.text = text  // случайни цифри и букви
        this.velocity = random(10, 3)
        this.textSize = 16

    }
    draw(ctx) {
        ctx.font = `${this.textSize}px Arial`;
        let coeficent = 1 / this.text.length
        for (const item in this.text) {
            let gren = Math.floor((1 + parseInt(item)) * coeficent * 255)
            ctx.fillStyle = `#00${gren.toString(16)}00`;
            ctx.fillText(this.text[item], this.x, this.y + item * this.textSize)
        }
    }
    plus() {
        if (this.y >= c.height) {
            this.initrandom()
        } else {
            this.y += this.velocity

        }

    }
}

let a = []
ctx.fillStyle = "#00bb00";

for (let i = 0; i < 188; i++) {
    a.push(new Sprite())
}
function anims() {
    ctx.clearRect(0, 0, c.width, c.height)
    for (let i in a) {
        a[i].draw(ctx)
        a[i].plus()

    }

}

setInterval(anims, 50)
