// Helper Functions
let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.Launch = () => {
  console.log('Game loaded and launched')

  Game.ores = 40
  Game.refined = 0
  Game.wood = 0

  Game.oresPerClick = 1
  Game.woodPerClick = 1

  Game.selectedZone = 'mine'
  Game.priceIncrease = 1.15

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

  Game.woodClick = () => {
    Game.calculateClick()
    Game.earn(Game.woodPerClick, 'wood')
    Game.rebuildInventory()
  }

  s('#wood').onclick = Game.woodClick

  Game.calculateClick = () => {
    let oreAmount = 0
    let woodAmount = 0
    oreAmount += Game.oresPerClick
    woodAmount += Game.woodPerClick

    // calculate the upgrdes and update Game.oresPerClick
    Game.oresPerClick = oreAmount
    Game.woodPerClick = woodAmount
  }

  Game.rebuildInventory = () => {
    s('#inventory-ore').innerHTML = 'Ore: ' + Game.ores
    s('#inventory-refined').innerHTML = 'Refined: ' + Game.refined
    s('#inventory-wood').innerHTML = 'Wood: ' + Game.wood
  }

  Game.rebuildInventory()

  Game.rebuildTabs = () => {
    // no idea for now
  }

  Game.items = []
  Game.item = function(itemName, itemDesc, fillerText, price, priceMaterial) {
    this.name = itemName
    this.desc = itemDesc
    this.filler = fillerText
    this.price = price
    this.priceMaterial = priceMaterial
    this.owned = 0

    this.changeText = (number) => {
      s(`#store-button${number}`).innerHTML = `
        <div style='height: 100%; width: 100%' onclick='Game.items[${number}].buy()'>
          <h1 onclick='Game.items[${number}].buy()'>${this.name} <span style='font-size: 15px'>[owned: ${this.owned}]</span> <span style='font-size: 25px; float: right'>${this.price} ${this.priceMaterial}</span></h1>
          <hr >
          <p style='font-weight: bold'>${this.desc}</p>
          <p style='font-style: italic'>${this.filler}</p>
        </div>
      `
    }



    this.buy = () => {
      console.log('buy firing')
      if (Game[this.priceMaterial] >= this.price) {
        console.log('price increase:', Math.floor(Math.pow(Game.priceIncrease, this.owned)))
        Game.spend(this.price, this.priceMaterial)
        this.price += Math.floor(Math.pow(Game.priceIncrease, this.owned))
        this.owned++
        Game.rebuildInventory()
        Game.rebuildStore()
        Game.drawZone()
      }
    }

    Game.items.push(this)
  }

  new Game.item('Axe', 'Allows for the chopping of wood','Sharp and sturdy', 20, 'ores' )
  new Game.item('X-Ray Goggles', 'Detects weak spots within the ore. Mine for extra resources','Why is everything so swirly', 50, 'refined' )

  Game.rebuildStore = () => {
    console.log('rebuilding store')
    let items = ''
    for (i = 0; i < Game.items.length; i++) {
      let item = Game.items[i]
      items += `
        <div class='store-button' id='store-button${i}' onclick='Game.items[${i}].buy()' onmouseover='Game.items[${i}].changeText(${i})' onmouseout='Game.rebuildStore()'>
          <h1 class='item-name'>${item.name}</h1>
          <p class='item-price'>cost: ${item.price} ${item.priceMaterial}</p>
        </div>
      `
    }

    items += `
      <div id="store-spacer"></div>
    `
    s('#store-content').innerHTML = items
  }

  Game.drawZone = () => {
    let el = s('#zone')
    if (Game.items[0].owned == 1) {
      el.style.visibility = 'visible'

      //Get value of select tag
      let value = el.options[el.selectedIndex].value

      if (value == 'mine') {
        console.log('you are currently in the mines')
        s('#ore').style.display = 'initial'
        s('#wood').style.display = 'none'
      }

      if (value == 'wood') {
        console.log('you are currently in the woods')
        s('#wood').style.display = 'initial'
        s('#ore').style.display = 'none'
      }
    }
  }

  Game.rebuildStore()

}

window.onload = () => {Game.Launch()}
