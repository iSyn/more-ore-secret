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
  Game.criticalOreClickMulti = 5

  Game.earn = (amount, type) => {
    Game[type] += amount
    console.log(Game.ores)
    Game.rebuildInventory()
    Game.risingNumber(amount, type)
  }

  Game.risingNumber = (amount, type) => {
    let mouseX = event.clientX
    let mouseY = event.clientY

    let risingNumber = document.createElement('div')
    risingNumber.classList.add('rising-number')
    risingNumber.innerHTML = `+${amount}`
    risingNumber.style.left = mouseX + 'px'
    risingNumber.style.top = mouseY + 'px'

    s('#particles').append(risingNumber)

    setTimeout(() => {
      risingNumber.remove()
    }, 1000)
  }

  Game.oreClickArea = () => {
    let randomNumber = () => Math.floor(Math.random() * 80) + 1
    let orePos = s('#ore-sprite').getBoundingClientRect()
    let randomSign = Math.round(Math.random()) * 2 - 1
    let centerX = (orePos.left + orePos.right) / 2
    let centerY = (orePos.top + orePos.bottom) / 2
    let randomX = centerX + (randomNumber() * randomSign)
    let randomY = centerY + (randomNumber() * randomSign)

    s('#ore-sprite-click-area').style.left = randomX + 'px'
    s('#ore-sprite-click-area').style.top = randomY + 'px'
  }

  Game.rebuildInventory = () => {
    s('#ores').innerHTML = 'Ores: ' + Math.floor(Game.ores)
  }

  // CLICKS
  s('#ore-sprite').onclick = () => {
    if
    Game.earn(Game.oresPerClick, 'ores')
  }

  s('#ore-sprite-click-area').onclick = () => {
    Game.oreClickArea()
    Game.earn(Game.oresPerClick * Game.criticalOreClickMulti, 'ores')
  }

  window.onresize = () => {
    Game.oreClickArea()
  }

  //THINGS TO DO
  Game.oreClickArea()

}

window.onload = () => {Game.Launch()}
