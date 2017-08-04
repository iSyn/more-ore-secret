// Helper Functions
let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.Launch = () => {
  console.log('Game loaded and launched')

  Game.ores = 9999
  Game.refined = 9999
  Game.wood = 99999
  Game.gold = 0

  Game.totalOreClicks = 0

  Game.oresPerClick = 50
  Game.woodPerClick = 50

  Game.priceIncrease = 1.15
  Game.selectedTab = 0

  Game.earn = (amt, type) => {
    Game[type] += amt
    Game.risingNumber(amt, type)
    Game.unlockStuff()
  }

  Game.spend = (amt, type) => {
    Game[type] -= amt
  }

  Game.getGold = () => {
    let number = Math.random()
    if (number > .9) {
      Game.earn(1, 'gold')
    }
  }

  Game.oreClick = () => {
    Game.totalOreClicks++
    Game.calculateClick()
    Game.earn(Game.oresPerClick, 'ores')
    Game.rebuildInventory()
    Game.getGold()
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
    s('#inventory-gold').innerHTML = 'Gold: ' + Game.gold
  }

  Game.rebuildInventory()

  Game.tabs = [{name: 'store', unlocked: true}, {name: 'workshop', unlocked: false}, {name: 'blacksmith', unlocked: false}, {name: 'tavern', unlocked: false}]
  Game.rebuildTabs = () => {

    let str = ''
    for (i = 0; i < Game.tabs.length; i++) {
      let tab = Game.tabs[i]
      if (tab.unlocked == true) {
        str += `
          <div id='${tab.name}-tab' class='tab' onclick='Game.changeTabs(${i})'>${tab.name}</div>
        `
      }
    }

    s('#tabs').innerHTML = str
  }

  Game.changeTabs = (tabNumber) => {
    Game.selectedTab = tabNumber
    Game.rebuildStore()
  }

  Game.rebuildTabs()

  Game.risingNumber = (amt, type) => {
    let randomNumber = Math.floor((Math.random() * 40) - 20) //picks a random number from -20 to 20
    let X = event.clientX+randomNumber
    let Y = event.clientY-50

    let div = document.createElement('div')
    div.classList.add('rising-number')
    if (type == 'gold') {
      div.classList.add('gold')
    }
    div.innerHTML = `+${amt}`
    div.style.position = 'absolute'
    div.style.left = X + 'px'
    div.style.top = Y + 'px'

    s('.rising-numbers').append(div)

    let allRisingNumbers = document.querySelectorAll('.rising-number')
    allRisingNumbers.forEach((number) => {
      setTimeout(() => {
        number.remove()
      }, 2.9 * 1000) //MAKE SURE SECONDS ARE LESS THAN CSS
    })
  }

  Game.items = []
  Game.item = function(whichTab, itemName, itemPic, itemDesc, fillerText, price, priceMaterial, maximumAmount, hidden, buyFunction) {
    this.tab = whichTab
    this.name = itemName
    this.pic = itemPic
    this.desc = itemDesc
    this.filler = fillerText
    this.price = price
    this.priceMaterial = priceMaterial
    this.owned = 0
    this.maximumAmount = maximumAmount
    this.hidden = hidden
    this.buyFunction = buyFunction

    this.changeText = (number) => {
      s(`#store-button${number}`).innerHTML = `
        <div style='height: 100%; width: 100%' onclick='Game.items[${number}].buy()'>
          <h1 onclick='Game.items[${number}].buy()'>${this.name} <span style='font-size: 15px;'>[owned: ${this.owned}]</span> <span style='font-size: 25px; float: right'>${this.price} ${this.priceMaterial}</span></h1>
          <hr >
          <p style='font-weight: bold'>${this.desc}</p>
          <p style='font-style: italic'>${this.filler}</p>
        </div>
      `
    }

    this.buy = () => {
      if (Game[this.priceMaterial] >= this.price) {
        Game.spend(this.price, this.priceMaterial)
        this.price += Math.floor(Math.pow(Game.priceIncrease, this.owned))
        this.owned++
        if (this.buyFunction) this.buyFunction()
        Game.rebuildInventory()
        Game.rebuildStore()
        Game.unlockStuff()
        Game.drawZone()
      }
    }

    Game.items.push(this)
  }

  Game.furnaces = []
  Game.furnace = function() {
    this.id = 0
    this.inUse = false
    this.amount = null
    Game.furnaces.push(this)
  }

  // whichTab, itemName, itemPic, itemDesc, fillerText, price, priceMaterial, maximumAmount, hidden
  new Game.item(0, 'Axe', 'axe.png', 'Allows for the chopping of wood','Sharp and sturdy', 20, 'ores', 1, false)
  new Game.item(0, 'X-Ray Glasses', 'xray-glasses.png', 'Detects weak spots within the ore', 'Why is everything so swirly', 50, 'refined', 1, false)
  new Game.item(0, 'Workshop', 'workbench.png', 'Build things...', 'Wood... and lots of it', 50, 'wood', 1, true)
  new Game.item(1, 'Blacksmiths Hut', 'nothing.png', 'Gives you access to furnaces', 'fire burn good', 100, 'wood', 1, false)
  new Game.item(1, 'Tavern', 'nothing.png', 'Hire workers and trade goods', 'slavery for cheap', 100, 'wood', 1, false)
  new Game.item(1, 'Shed', 'nothing.png', 'Increase max storage for wood', 'Got wood?', 50, 'wood', 999, false)
  new Game.item(1, 'Wheelbarrow', 'nothing.png', 'Increase max storage for ores', 'Ore my!', 50, 'wood', 999, false)
  new Game.item(2, 'Furnace', 'furnace.png', 'Smelt raw ores to create refined ores', 'Caution... hot!', 50, 'ores', 999, false, () => {
    new Game.furnace()
  })

  Game.rebuildStore = () => {
    let str = ''
    for (i = 0; i < Game.items.length; i++) {
      let item = Game.items[i]
      if (item.owned < item.maximumAmount && item.hidden == false) {
        if (Game.selectedTab == item.tab) {
          str += `
            <div class='store-button' id='store-button${i}' onclick='Game.items[${i}].buy()'>
              <div class="button-top">
                <img src="./assets/${item.pic}" alt="" />
                <h1 class='item-name'>${item.name}</h1>
                <p class='item-price'>cost: ${item.price} ${item.priceMaterial}</p>
              </div>
              <div class="button-bottom">
                <hr/>
                <h3>${item.desc}</h3>
                <p style='font-style: oblique'>${item.filler}</p>
                <br>
                <p>owned: ${item.owned}</p>
              </div>
            </div>
          `
        }
      }
    }
    if (Game.selectedTab == 2) { // If on furnace tab, also build furnaces
      for (j = 0; j < Game.furnaces.length; j++) {
        Game.furnaces[j].id = j
        str += `
          <div id='furnace${j}' class='furnace'>
          </div>
        `
      }
    }
    str += `
      <div id="store-spacer"></div>
    `
    s('#store-content').innerHTML = str
  }

  Game.drawZone = () => {
    let el = s('#zone')
    if (Game.items[0].owned == 1) {
      el.style.visibility = 'visible'

      //Get value of select tag
      let value = el.options[el.selectedIndex].value

      if (value == 'mine') {
        s('#ore').style.display = 'initial'
        s('#wood').style.display = 'none'
        // s('#left').style.background = '#777'
        s('#left').style.background = "url('./assets/mine-bg.png')"
        s('#left').style.backgroundSize = 'cover'
      }

      if (value == 'wood') {
        s('#wood').style.display = 'initial'
        s('#ore').style.display = 'none'
        s('#left').style.background = "url('./assets/forest-bg.png')"
        s('#left').style.backgroundSize = 'cover'
      }
    }
  }

  Game.unlockStuff = () => {
    if (Game.totalOreClicks >= 1) Game.win('Your First Click')
    if (Game.totalOreClicks >= 2) Game.win('Double Click')
    if (Game.totalOreClicks >= 10) Game.win('Carpal Tunnel')
    if (Game.wood > 0 && Game.items[2].hidden == true) {Game.items[2].hidden = false}
    if (Game.items[2].owned == 1 && Game.tabs[1].unlocked == false) {Game.tabs[1].unlocked = true; Game.rebuildTabs()}
    if (Game.items[3].owned == 1 && Game.tabs[2].unlocked == false) {Game.tabs[2].unlocked = true; Game.rebuildTabs()}
    if (Game.items[4].owned == 1 && Game.tabs[3].unlocked == false) {Game.tabs[3].unlocked = true; Game.rebuildTabs()}

    Game.rebuildStore()
  }

  Game.achievements = []
  Game.achievement = function(name, howToUnlock, desc) {
      this.name = name
      this.howToUnlock = howToUnlock
      this.desc = desc
      this.won = 0

      Game.achievements[this.name] = this
  }

  new Game.achievement('Your First Click', 'Have your first click', '<q>Wont be your last though...</q>')
  new Game.achievement('Double Click', 'Click a second time', '<q>I told you so</q>')
  new Game.achievement('Carpal Tunnel', 'Click a total of 10 times', '<q>Wheres the Bengay</q>')

  Game.win = (achievement) => {
    console.log(achievement)
    if (Game.achievements[achievement]) {
      if (Game.achievements[achievement].won == 0) {
        Game.achievements[achievement].won = 1
        let div = document.createElement('div')
        div.classList.add('achievement')
        div.innerHTML = `
          <h3>Achievement Unlocked</h3>
          <hr>
          <h1>${Game.achievements[achievement].name}</h1>
          <p>${Game.achievements[achievement].howToUnlock}</p>
          <p>${Game.achievements[achievement].desc}</p>
        `
        s('#achievements').append(div)

        setTimeout(() => {
          div.remove()
        }, 2800)
      }
    }
  }




  Game.rebuildStore()

}

window.onload = () => {Game.Launch()}




