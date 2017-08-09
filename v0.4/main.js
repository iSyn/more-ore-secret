// Helper Functions
let s = ((el) => {return document.querySelector(el)})

// Game
let Game = {}

Game.Launch = () => {

  console.log('Game Launched')

  Game.ores = 0
  Game.currentLevel = 1
  Game.currentXP = 0
  Game.totalClicks = 0
  Game.oreClicks = 0
  Game.monsterClicks = 0
  Game.sessionTime = 0

  Game.oresPerClick = 0.1

  Game.earn = (amount, type) => {
    Game[type] += amount
    Game.rebuildInventory()
  }

  s('#ore-sprite').onclick = () => {
    console.log('clicked')
    Game.earn(Game.oresPerClick, 'ores')
  }

  Game.oreClickArea = () => {
    let orePos = s('#ore-sprite').getBoundingClientRect()
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = Math.floor(Math.random() * 80) + 1
    let randomNumber2 = Math.floor(Math.random() * 80) + 1
    let centerX = (orePos.left + orePos.right) / 2
    let centerY = (orePos.top + orePos.bottom) / 2
    let randomX = centerX + (randomNumber * randomSign)
    let randomY = centerY + (randomNumber2 * randomSign)

    s('#ore-sprite-click-area').style.left = randomX + 'px'
    s('#ore-sprite-click-area').style.top = randomY + 'px'
  }

  setInterval(() => {
    Game.oreClickArea()
  }, 500)

  Game.rebuildInventory = () => {
    s('#ores').innerHTML = 'Ores: ' + Math.floor(Game.ores)
  }

}

window.onload = () => {Game.Launch()}
