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
  Game.tabs = [
    {
      name: 'store',
      locked: false
    }, {
      name: 'upgrades',
      locked: true
    }, {
      name: 'stats',
      locked: false
    }
  ]

  Game.earn = (amount) => {
    Game.ores += amount
    Game.rebuildInventory()
  }

  Game.rebuildInventory = () => {
    s('.ores').innerHTML = 'Ores: ' + Game.ores
  }

  let currentHp = Game.oreHp
  Game.updatePercentage = (amount) => {
    console.log(currentHp)
    if (currentHp > 0) {
      if (currentHp - amount > 0) {
        currentHp -= amount
        s('.ore-hp').innerHTML = `${((currentHp/Game.oreHp)*100).toFixed(0)}%`
      } else {
        currentHp = 0
        s('.ore-hp').innerHTML = `0%`
      }
    } else {
      Game.oreHp = Math.pow(Game.oreHp, 1.15)
      currentHp = Game.oreHp
      s('.ore-hp').innerHTML = `${((currentHp/Game.oreHp)*100).toFixed(0)}%`
    }
  }

  Game.oreClickArea = () => {
    let randomNumber = () => Math.floor(Math.random() * 80) + 1
    let orePos = s('.ore').getBoundingClientRect()
    let randomSign = Math.round(Math.random()) * 2 - 1
    let centerX = (orePos.left + orePos.right) / 2
    let centerY = (orePos.top + orePos.bottom) / 2
    let randomX = centerX + (randomNumber() * randomSign)
    let randomY = centerY + (randomNumber() * randomSign)

    s('.ore-click-area').style.left = randomX + 'px'
    s('.ore-click-area').style.top = randomY + 'px'
  }

  Game.buildTabs = () => {
    let str = ''
    for (i = 0; i < Game.tabs.length; i++) {
      if (Game.tabs[i].locked == false) {
        str += `
          <div id='${Game.tabs[i].name}-tab' class='tab' onclick='Game.switchTab("${Game.tabs[i].name}")'  style='display: flex; align-items: center; justify-content: center;'>
            <p>${Game.tabs[i].name}</p>
          </div>
        `
      }
    }
    s('.tabs').innerHTML = str
  }

  Game.switchTab = (selectedTab) => {
    let tabs = document.querySelectorAll('.tab')
    tabs.forEach((tab) => {
      tab.classList.remove('selected')
    })
    s(`#${selectedTab}-tab`).classList.add('selected')
    Game.buildTabContent(selectedTab)
  }

  Game.buildTabContent = (tab) => {
    let str = ''
    if (tab == 'store') {
      for (var i in Game.items) {
        let item = Game.items[i]
        console.log(item)
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
                    <p style='font-size: xx-large'>${item.owned}</p>
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
    s('.tab-content').innerHTML = str
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

  new Game.item('Whetstone', 'Whetstone', 'store', 'whetstone.png', 'Increase ore per click by 1.5', 'filler text goes here', 'filler quote goes here', 10, false, () => {
    Game.oresPerClick *= 1.5
  })
  new Game.item('Whetstdone', 'Whetsdtone', 'store', 'whetstone.png', 'Increase ore per click by 1.5', 'filler text goes here', 'filler quote goes here', 10, false, () => {
    Game.oresPerClick *= 1.5
  })

  s('.ore').onclick = () => {
    Game.earn(Game.orePerClick)
    Game.updatePercentage(Game.orePerClick)
  }

  s('.ore-click-area').onclick = () => {
    Game.earn(Game.orePerClick * 5)
    Game.updatePercentage(Game.orePerClick * 5)
    Game.oreClickArea()
  }

  //Init Shit
  Game.oreClickArea()
  Game.buildTabs()
  Game.switchTab('store')
  window.onresize = () => Game.oreClickArea()

}

window.onload = () => {Game.launch()}
