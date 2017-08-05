// Helper Functions
let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.Launch = () => {
  console.log('Game loaded and launched')

  Game.ores = 999
  Game.refined = 999
  Game.wood = 999
  Game.gold = 999
  Game.miners = 0
  Game.lumberjacks = 0
  Game.heroes = 0

  Game.totalOreClicks = 0
  Game.totalTreeClicks = 0

  Game.oresPerClick = 50
  Game.woodPerClick = 50

  Game.priceIncrease = 1.15
  Game.smeltTime = 2
  Game.selectedTab = 0
  Game.sessionTime = 0

  Game.earn = (amt, type) => {
    Game[type] += amt
    Game.unlockStuff()
    Game.risingNumber(amt, type)
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
    Game.drawParticles('ore')
  }

  s('#ore').onclick = Game.oreClick

  Game.woodClick = () => {
    Game.totalTreeClicks++
    Game.calculateClick()
    Game.earn(Game.woodPerClick, 'wood')
    Game.rebuildInventory()
    Game.drawParticles('wood')
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
        this.owned++
        this.price += Math.floor(Math.pow(Game.priceIncrease, this.owned))
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
    this.id = Game.furnaces.length
    this.inUse = false
    this.amount = null

    this.setAmount = () => {
      this.amount = parseInt(s(`#furnace${this.id}-amount`).value)
    }

    this.start = () => {
      let amountLeft = this.amount
      if (this.inUse == false) {
        let price = this.amount * 10
        if (Game.ores >= price) {
          this.inUse = true
          Game.spend(price, 'ores')

          s(`#furnace${this.id}-amount`).disabled = true
          s(`#furnace${this.id}-amount`).style.cursor = 'not-allowed'
          s(`#furnace${this.id}-button`).disabled = true
          s(`#furnace${this.id}-button`).style.cursor = 'not-allowed'

          let smeltInterval = setInterval(() => {
            amountLeft--
            s(`#furnace${this.id}-amount`).value = amountLeft
            Game.earn(1, 'refined')
            Game.rebuildInventory()
          }, Game.smeltTime * 1000)

          let timer = Game.smeltTime * this.amount
          s(`#furnace${this.id}-time-remaining`).innerHTML = `[seconds left until completed: ${Math.ceil(timer)}]`
          let smeltTimer = setInterval(() => {
            timer--
            s(`#furnace${this.id}-time-remaining`).innerHTML = `[seconds left until completed: ${Math.ceil(timer)}]`
          }, 1000)

          let currentWidth = 0
          let ammountOfTimeNeeded = this.amount * Game.smeltTime
          startProgress = setInterval(() => {
            currentWidth += (100/ammountOfTimeNeeded) * .01
            s(`#furnace${this.id}-progress-bar`).style.width = currentWidth + '%'
            Game.rebuildInventory()
          }, 10)

          setTimeout(() => {
            clearInterval(startProgress)
            s(`#furnace${this.id}-progress-bar`).style.width = '0%'
          }, ammountOfTimeNeeded * 1000)



          setTimeout(() => {
            clearInterval(smeltInterval)
            clearInterval(smeltTimer)
            this.inUse = false
            s(`#furnace${this.id}-amount`).disabled = false
            s(`#furnace${this.id}-amount`).style.cursor = 'initial'
            s(`#furnace${this.id}-amount`).value = null
            s(`#furnace${this.id}-button`).disabled = false
            s(`#furnace${this.id}-button`).style.cursor = 'pointer'
            s(`#furnace${this.id}-time-remaining`).innerHTML = `[seconds left until completed: not in use]`
          }, Game.smeltTime * 1000 * this.amount)


        }
      }
    }

    Game.furnaces.push(this)
  }

  // whichTab, itemName, itemPic, itemDesc, fillerText, price, priceMaterial, maximumAmount, hidden
  new Game.item(0, 'Axe', 'axe.png', 'Allows for the chopping of wood','Sharp and sturdy', 1, 'gold', 1, false)
  new Game.item(0, 'X-Ray Glasses', 'xray-glasses.png', 'Detects weak spots within the ore', 'Why is everything so swirly', 30, 'gold', 1, false)
  new Game.item(0, 'Workshop', 'workbench.png', 'Build things...', 'Wood... and lots of it', 50, 'wood', 1, true)
  new Game.item(1, 'Blacksmiths Hut', 'anvil.png', 'Gives you access to furnaces', 'fire burn good', 100, 'wood', 1, false)
  new Game.item(1, 'Tavern', 'beer.png', 'Trade goods and hire workers', 'slavery for cheap', 100, 'wood', 1, false)
  new Game.item(2, 'Furnace', 'furnace.png', 'Smelt raw ores to create refined ores', 'Caution... hot!', 50, 'ores', 999, false, () => {
    new Game.furnace()
    if (Game.items[6].hidden == true) Game.items[6].hidden = false
  })
  new Game.item(2, 'Upgrade Furnace Speed', 'fire.png', 'Decreases the amount of time needed to smelt', 'Add more fire', 5, 'refined', 999, true, () => {
    Game.smeltTime *= .9
  })
  new Game.item(3, 'Hire Miner', 'hardhat.png', 'Increases idle ore gain', 'mine mine mine', 5, 'gold', 999, false)
  new Game.item(3, 'Hire Smelter', 'mask.png', 'Allows for idle smelting', 'smelt smelt smelt', 5, 'gold', 999, false)
  new Game.item(3, 'Hire Lumberjack', 'lumberjack.png', 'Increases idle wood gain', 'chop chop chop', 5, 'gold', 999, false)
  new Game.item(3, 'Hire Hero', 'shield.png', 'Fight baddies', 'Time for an adventure', 1000, 'gold', 999, false)
  new Game.item(0, 'Metal Detector', 'metaldetector.png', 'Increases chance of gold', 'beep... beep', 100, 'gold', 999, false)

  Game.trade = (item1amount, item1Material, item2amount, item2Materiaal) => {
    if (Game[item1Material] >= item1amount) {
      Game[item1Material] -= item1amount
      Game[item2Materiaal] += item2amount
    }
    Game.rebuildInventory()
  }

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
                <h1 class='item-name'>${item.name} <span class='hide' style='font-size: 15px'>[owned: ${item.owned}]</span></h1>
                <p class='item-price'>cost: ${item.price} ${item.priceMaterial}</p>
              </div>
              <div class="button-bottom">
                <hr/>
                <h3>${item.desc}</h3>
                <p style='font-style: oblique'>${item.filler}</p>
              </div>
            </div>
          `
        }
      }
    }
    if (Game.selectedTab == 2) { // If on furnace tab, also build furnaces
      str += '<h1>10 Raw Ores = 1 Refined Ore</h1>'
      for (j = 0; j < Game.furnaces.length; j++) {
        Game.furnaces[j].id = j
        str += `
          <div id='furnace${j}' class='furnace'>
            <div class="furnace-top">
              <input id='furnace${j}-amount' type="number" onchange='Game.furnaces[${j}].setAmount()'/>
              <button id='furnace${j}-button' class="start-furnace-button" onclick='Game.furnaces[${j}].start()'>Start</button>
            </div>
            <div class="furnace-bottom">
              <div id='furnace${j}-progress-bar-container' class="progress-bar-container">
                <div id='furnace${j}-progress-bar' class="progress-bar"></div>
              </div>
              <p id='furnace${j}-time-remaining' class="time-remaining"> [seconds left until completed: not in use]</p>
            </div>
          </div>
        `
      }
    }

    if (Game.selectedTab == 3) {
      str += `
        <div id='trade-hall'>
          <h1>Trade Hall</h1>
          <div class="trade-container">
            <div class="trade">
              <p>Trade 50 raw ores for 1 refined ore</p>
              <button onclick='Game.trade(50,"ores", 1, "refined")'>Trade</button>
            </div>
            <div class="trade">
              <p>Trade 100 raw ores for 1 gold</p>
              <button onclick='Game.trade(100,"ores", 1, "gold")'>Trade</button>
            </div>
            <div class="trade">
              <p>Trade 2 gold for 50 raw ores</p>
              <button onclick='Game.trade(2,"gold", 50, "ores")'>Trade</button>
            </div>
          </div>
        </div>

      `
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

  setInterval(() => {
    Game.sessionTime++
    Game.unlockStuff()
  }, 1000)

  Game.unlockStuff = () => {
    if (Game.totalOreClicks >= 1) Game.win('Your First Click')
    if (Game.totalOreClicks >= 2) Game.win('Double Click')
    if (Game.totalOreClicks >= 100) Game.win('Carpal Tunnel')
    if (Game.totalTreeClicks >= 1) Game.win('Morning Wood')
    if (Game.sessionTime >= 30) Game.win('Milestone 1')
    if (Game.sessionTime >= 60) Game.win('Milestone 2')
    if (Game.sessionTime >= 300) Game.win('Milestone 3')
    if (Game.wood > 0 && Game.items[2].hidden == true) {Game.items[2].hidden = false; Game.rebuildStore()}
    if (Game.items[2].owned == 1 && Game.tabs[1].unlocked == false) {Game.tabs[1].unlocked = true; Game.rebuildTabs(); Game.rebuildStore()}
    if (Game.items[3].owned == 1 && Game.tabs[2].unlocked == false) {Game.tabs[2].unlocked = true; Game.rebuildTabs(); Game.rebuildStore()}
    if (Game.items[4].owned == 1 && Game.tabs[3].unlocked == false) {Game.tabs[3].unlocked = true; Game.rebuildTabs(); Game.rebuildStore()}

  }

  Game.unlockStuff()

  Game.achievements = []
  Game.achievement = function(name, howToUnlock, desc) {
      this.name = name
      this.howToUnlock = howToUnlock
      this.desc = desc
      this.won = 0

      Game.achievements[this.name] = this
  }

  new Game.achievement('Your First Click', 'Have your first click', 'Wont be your last though...')
  new Game.achievement('Double Click', 'Click a second time', 'I told you so')
  new Game.achievement('Carpal Tunnel', 'Click a total of 100 times', 'Wheres the Bengay')

  new Game.achievement('Morning Wood', 'Cut your first tree', '-insert dick pun here-')

  new Game.achievement('Milestone 1', 'Stay on More Ore for more than 30 seconds', "You're still here?")
  new Game.achievement('Milestone 2', 'Stay on More Ore for more than 1 minute', "Why are you still here...")
  new Game.achievement('Milestone 3', 'Stay on More Ore for more than 5 minute', "Ahhh... afk")

  Game.win = (achievement) => {
    if (Game.achievements[achievement]) {
      if (Game.achievements[achievement].won == 0) {
        Game.achievements[achievement].won = 1
        let div = document.createElement('div')
        div.classList.add('achievement')
        div.innerHTML = `
          <h3>Achievement Unlocked</h3>
          <hr size='2px' color='black'>
          <h1 style='font-size: 40px;'>${Game.achievements[achievement].name}</h1>
          <hr size='2px' color='black'>
          <p style='font-size: 25px'>${Game.achievements[achievement].howToUnlock}</p>
          <p style='font-style: italic; font-size:25px'>"${Game.achievements[achievement].desc}"</p>
        `
        s('#achievements').append(div)

        setTimeout(() => {
          div.remove()
        }, 2800)
      }
    }
  }

  Game.drawParticles = (material) => {
    for (i = 0; i < 3; i++) {
      let div = document.createElement('div')
      div.classList.add('particle')
      if (material == 'ore') {
        div.style.background = 'silver'
      }
      if (material == 'wood') {
        div.style.background = 'brown'
      }
      let x = event.clientX
      let y = event.clientY
      div.style.left = x + 'px'
      div.style.top = y + 'px'

      let particleY = y
      let particleX = x
      let randomNumber = Math.random()
      let randomSign = Math.round(Math.random()) * 2 - 1

      let particleFall = setInterval(() => {
        particleX += randomNumber * randomSign
        particleY += 2
        div.style.top = particleY + 'px'
        div.style.left = particleX + 'px'
      }, 10)

      setTimeout(() => {
        clearInterval(particleFall)
        div.remove()
      }, 1000)


      s('#particles').append(div)
    }
  }





  Game.rebuildStore()

}

window.onload = () => {Game.Launch()}
