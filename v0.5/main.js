let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.launch = () => {
  console.log('Game launched')

  Game.ores = 0
  Game.oreHp = 50
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

  let currentHp = Game.oreHp
  Game.updatePercentage = () => {
    if (currentHp > 0) {
      currentHp--
      s('.ore-hp').innerHTML = `${((currentHp/Game.oreHp)*100).toFixed(0)}%`
    } else {
      Game.oreHp *= 1.5
      currentHp = Game.oreHp
    }
  }

  s('.ore').onclick = () => {
    Game.earn(Game.orePerClick)
    Game.updatePercentage()
  }


}

window.onload = () => {Game.launch()}
