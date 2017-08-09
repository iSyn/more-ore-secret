
let s = ((el) => {return document.querySelector(el)})

let x = 0
let y = 0

s('#button').onclick = () => {
  let image = new Image()
  image.src = '../../assets/treeMonster.png'

  let canvas = s('#bottom-canvas')
  let canvasContext = canvas.getContext("2d")
  // let image = s('#image')
  canvasContext.drawImage(image, x, y)
  x += 10
  y = Math.floor(Math.random() * 20) + 1
}


// var c=document.getElementById("myCanvas");
//     var ctx=c.getContext("2d");
//     var img=document.getElementById("scream");
//     ctx.drawImage(img,10,10);
