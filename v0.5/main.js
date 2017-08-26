let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.launch = () => {
  console.log('Game launched')

  Game.ores = 0
  Game.oreHp = 50
  Game.orePerClick = 5
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
    s('.ores').innerHTML = 'Ores: ' + Game.ores
  }

  let currentHp = Game.oreHp
  Game.updatePercentage = () => {
    if (currentHp > 0) {
      currentHp -= Game.orePerClick
      s('.ore-hp').innerHTML = `${((currentHp/Game.oreHp)*100).toFixed(0)}%`
      // s('.ore-hp').innerHTML = Math.ceil(currentHp)
    } else {
      Game.oreHp = Math.pow(Game.oreHp, 1.15)
      currentHp = Game.oreHp
    }
  }

  s('.ore').onclick = () => {
    Game.earn(Game.orePerClick)
    Game.updatePercentage()
  }


}

window.onload = () => {Game.launch()}
