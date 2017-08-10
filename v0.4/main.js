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
  Game.selectedTab = 'store'
  Game.priceIncrease = 1.15
  Game.oresPerClick = 0.1
  Game.criticalOreClickMulti = 5

  Game.earn = (amount, type) => {
    Game[type] += amount
    Game.rebuildInventory()
    Game.risingNumber(amount, type)
  }

  Game.spend = (amount, type) => {
    Game[type] -= amount
    Game.rebuildInventory()
  }

  Game.risingNumber = (amount, type) => {
    let mouseX = event.clientX
    let randomNumber = Math.floor(Math.random() * 20) + 1
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomMouseX = mouseX + (randomNumber * randomSign)
    let mouseY = event.clientY - 20

    let risingNumber = document.createElement('div')
    risingNumber.classList.add('rising-number')
    risingNumber.innerHTML = `+${amount.toFixed(1)}`
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
    s('#ores').innerHTML = 'Ores: ' + Game.ores.toFixed(1)
  }

  Game.switchTab = (selectedTab) => {
    let tabs = document.querySelectorAll('.tab')
    tabs.forEach((tab) => {
      tab.classList.remove('selected')
    })
    s(`#${selectedTab}-tab`).classList.add('selected')
    Game.selectedTab = selectedTab
    Game.rebuildTabContent()
  }

  Game.rebuildTabContent = () => {
    let str = ''

    if (Game.selectedTab == 'store') {
      for (var i in Game.items) {
        let item = Game.items[i]
        if (item.tab == 'store') {
          if (item.hidden == false) {
            str += `
              <div class="button" onclick="Game.items.${item.functionName}.buy()">
                <div class="button-top">
                  <div class="button-left">
                    <img src="../assets/${item.pic}"/>
                  </div>
                  <div class="button-middle">
                    <h3>${item.name}</h3>
                    <p>cost: ${item.price.toFixed(0)} ores</p>
                  </div>
                  <div class="button-right">
                    <p>${item.owned}</p>
                  </div>
                </div>
                <div class="button-bottom">
                  <hr/>
                  <p>${item.desc}</p>
                  <p>${item.fillerText}</p>
                  <br/>
                  <p style='font-style: italic; text-align: center'>“${item.fillerQuote}”</p>
                </div>
              </div>
            `
          }
        }
      }
    }
    if (Game.selectedTab == 'blacksmith') {
      //
    }
    if (Game.selectedTab == 'stats') {
      str += `
        <p>
          Current Amount of Ores: ${Game.ores.toFixed(1)} <br/>
          Ore Clicks: ${Game.oreClicks} <br/>
          Total Clicks: ${Game.totalClicks} <br/>
        </p>
      `
    }

    s('#tab-content').innerHTML = str
  }

  Game.items = []
  Game.item = function(name, functionName, tab, pic, desc, fillerText, fillerQuote, price, hidden, buyFunction) {
    this.name = name
    this.functionName = functionName
    this.tab = tab
    this.pic = pic
    this.desc = desc
    this.fillerText = fillerText
    this.fillerQuote = fillerQuote
    this.basePrice = price
    this.price = price
    this.owned = 0
    this.hidden = hidden
    this.buyFunction = buyFunction

    this.buy = () => {
      if (Game.ores >= this.price) {
        Game.spend(this.price, 'ores')
        this.owned++
        this.price += this.basePrice * Math.pow(Game.priceIncrease, this.owned)
        if (this.buyFunction) buyFunction()
        Game.rebuildInventory()
        Game.rebuildTabContent()
      }
    }

    Game.items[this.functionName] = this
  }

  // name, tab, pic, desc, fillerText, fillerQuote, price, hidden, buyFunction
  new Game.item('Whetstone', 'Whetstone', 'store', 'wip.png', 'Increase ore per click by 1.5', 'filler text goes here', 'filler quote goes here', 10, false, () => {
    Game.oresPerClick *= 1.5
  })
  new Game.item('Magnifying Glass', 'MagnifyingGlass', 'store', 'wip.png', 'Increase ore crit hit multiplier', 'This is useful I swear', 'I can see... I... can... FIGHT', 100, false)
  new Game.item('Hungry Man', 'HungryMan', 'store', 'wip.png', 'Increases ore per second by 0.1', 'Extracted from District 12', 'Help me Katniss', 5, false)
  new Game.item('The Map', 'TheMap', 'store', 'wip.png', 'Unlocks RPG', 'This is what maps do IRL', 'filler quote here', 50, false)

  // CLICKS
  s('#ore-sprite').onclick = () => {
    Game.earn(Game.oresPerClick, 'ores')
    Game.oreClicks++
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
  Game.rebuildTabContent()
}

window.onload = () => {Game.Launch()}
