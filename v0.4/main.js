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
    let randomNumber = Math.floor(Math.random() * 20) + 1
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomMouseX = mouseX + (randomNumber * randomSign)
    let mouseY = event.clientY - 20

    let risingNumber = document.createElement('div')
    risingNumber.classList.add('rising-number')
    risingNumber.innerHTML = `+${amount}`
    risingNumber.style.left = randomMouseX + 'px'
    risingNumber.style.top = mouseY + 'px'

    s('#particles').append(risingNumber)

    setTimeout(() => {
      risingNumber.remove()
    }, 2000)
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
    Game.earn(Game.oresPerClick, 'ores')
  }

  s('#ore-sprite-click-area').onclick = () => {
    Game.oreClickArea()
    Game.earn(Game.oresPerClick * Game.criticalOreClickMulti, 'ores')
  }

  window.onresize = () => {
    Game.oreClickArea()
  }

  //MISC SHIT
  Game.oreClickArea()

}

window.onload = () => {Game.Launch()}
