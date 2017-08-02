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
    s('#inventory-ore').innerHTML = 'Ore: ' + Game.ores
    s('#inventory-refined').innerHTML = 'Refined: ' + Game.refinedOres
    s('#inventory-wood').innerHTML = 'Wood: ' + Game.wood
  }

  Game.rebuildInventory()

  Game.rebuildTabs = () => {
    // no idea for now
  }

  Game.items = []
  Game.item = function(whichTab, itemName, itemDesc, price, priceMaterial) {
    this.tab = whichTab
    this.name = itemName
    this.desc = itemDesc
    this.price = price
    this.priceMaterial = priceMaterial

    Game.items.push(this)
  }

  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )
  new Game.item('store', 'Axe', 'Sharp and sturdy', 20, 'ores' )

  Game.rebuildStore = (tab) => {
    let items = ''
    for (i = 0; i < Game.items.length; i++) {
      let item = Game.items[i]
      items += `
        <div class='store-button'>
          <p>${item.name}</p>
          <p>${item.desc}</p>
          <p>${item.price} ${item.priceMaterial}</p>
        </div>
      `
    }

    items += `
      <div id="store-spacer"></div>
    `
    s('#store-content').innerHTML = items
  }

  Game.rebuildStore()

}

window.onload = () => {Game.Launch()}
