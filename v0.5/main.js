let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.launch = () => {
  console.log('Game launched')
}

window.onload = () => {Game.launch()}
