// Helper Functions
let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.Launch = () => {
  console.log('Game loaded and launched')

  Game.ores = 0
  Game.refinedOres = 0
  Game.wood = 0

  Game.oresPerClick = 1
  Game.woodPerClick = 0

  Game.earn = (amt, type) => {
    Game[type] += amt
  }

  Game.spend = (amt, type) => {
    Game[type] -= amt
  }

  Game.oreClick = () => {
    Game.calculateClick()
    Game.earn(Game.oresPerClick, 'ores')
    Game.rebuildInventory()
  }

  s('#ore').onclick = Game.oreClick

  Game.calculateClick = () => {
    let amount = 0
    amount += Game.oresPerClicks
    // calculate the upgrdes and update Game.oresPerClick
    Game.oresPerClicks = amount
  }

  Game.rebuildInventory = () => {
    s('#inventory-ore').innerHTML = 'Ores: ' + Game.ores
    s('#inventory-refined').innerHTML = 'Refined: ' + Game.refinedOres
    s('#inventory-wood').innerHTML = 'Wood: ' + Game.wood
  }

  Game.rebuildInventory()

}

window.onload = () => {Game.Launch()}
