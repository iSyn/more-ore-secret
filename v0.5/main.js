let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.launch = () => {
  console.log('Game launched')

  Game.ores = 0
  Game.oreHp = 10
  Game.orePerClick = 1
  Game.level = {
    currentLevel: 1,
    currentStrength: 1,
    currentLuck: 1,
    currentXP: 0,
    XPNeeded: 20,
    availableSP: 0
  }

  Game.earn = (amount) => {
    Game.ores += amount
    Game.rebuildInventory()
  }

  Game.rebuildInventory = () => {
    // s('.ores').innerHTML = 'Ores: ' + Game.ores.toFixed(1)
    s('.ores').innerHTML = 'Ores: ' + Game.ores
  }

  Game.updatePercentage = () => {
    let percentage = s('.ore-hp')

  }

  s('.ore').onclick = () => {
    Game.earn(Game.orePerClick)
  }


}

window.onload = () => {Game.launch()}
