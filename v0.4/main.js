// Helper Functions
let s = ((el) => {return document.querySelector(el)})

// Game
let Game = {}

Game.Launch = () => {

  console.log('Game Launched')

  Game.ores = 9999
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
  Game.fps = 30
  Game.ops = 0
  Game.tabs = [
    {name: 'store', hidden: false},
    {name: 'blacksmith', hidden: true},
    {name: 'quests', hidden: true},
    {name: 'stats', hidden: false}
  ]


  Game.earn = (amount) => {
    Game.ores += amount
    Game.rebuildInventory()
  }

  Game.spend = (amount) => {
    Game.ores -= amount
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

    if (type == 'ores-special') {
      risingNumber.style.fontSize = 'xx-large'
    }

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
    s('#ores').innerHTML = `Ores: ${Game.ores.toFixed(1)} (${Game.ops.toFixed(1)}/sec)`
  }

  Game.buildTabs = () => {

    let str = ''

    for (i = 0; i < Game.tabs.length; i++) {
      let tab = Game.tabs[i]
      if (tab.hidden == false) {
        str += `
          <div id='${tab.name}-tab' class='tab' onclick='Game.switchTab("${tab.name}")'>
            <p>${tab.name}</p>
          </div>
        `
      }
    }

    s('#tabs').innerHTML = str
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

  Game.rebuildTabContent = (tab) => {
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

    if (Game.selectedTab == 'quests') {
      for (i = 0; i < Game.quests.length; i++) {
        let quest = Game.quests[i]
        if (quest.show == 1) {
          str += `
            <div class="button">
              <div class="button-top">
                <div class="button-left">
                  <img src="../assets/${quest.pic}"/>
                </div>
                <div class="button-middle">
                  <h3>${quest.name}</h3>
                </div>
                <div class="button-right">

                </div>
              </div>
              <div class="button-bottom">
                <hr/>
                <p>${quest.desc}</p>
              </div>
            </div>
          `
        }
        if (quest.show == 2) {
          str += `
            <div class="button" style='cursor: not-allowed; background: rgba(0,0,0,0.3)' >
              <div class="button-top">
                <div class="button-left">
                  <img src="../assets/${quest.pic}"/>
                </div>
                <div class="button-middle">
                  <h3>${quest.name}</h3>
                </div>
              </div>
            </div>
          `
        }
        if (quest.show == 3) {
          str += `
            <div class="button" style='cursor: not-allowed; background: rgba(0,0,0,0.3);'>
              <div class="button-top">
                <div class="button-left">
                  <img src="../assets/mystery.png"/>
                </div>
                <div class="button-middle">
                  <h3>???</h3>
                </div>
              </div>
            </div>
          `
        }
      }
      console.log(str)
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
  new Game.item('Whetstone', 'Whetstone', 'store', 'whetstone.png', 'Increase ore per click by 1.5', 'filler text goes here', 'filler quote goes here', 10, false, () => {
    Game.oresPerClick *= 1.5
  })
  new Game.item('Magnifying Glass', 'MagnifyingGlass', 'store', 'magnifying-glass.png', 'Increase ore crit hit multiplier', 'This is useful I swear', 'I can see... I... can... FIGHT', 30, false, () => {
    Game.criticalOreClickMulti += .3
  })
  new Game.item('Old Man', 'OldMan', 'store', 'oldmanbig.png', 'Increases ore per second by 0.1', 'Extracted from District 12', 'Help me Katniss', 5, false, () => {
    Game.ops += 0.1
    Game.addCanvasSprite('oldman.png')
  })
  new Game.item('The Map', 'TheMap', 'store', 'map.png', 'Unlocks quests', 'This is what maps do IRL', 'filler quote here', 50, false, () => {
    Game.items.TheMap.hidden = true
    Game.tabs[2].hidden = false
    Game.items.Blacksmith.hidden = false
    Game.rebuildTabContent()
    Game.buildTabs()
    Game.switchTab('store')
  })
  new Game.item('Blacksmith', 'Blacksmith', 'store', 'wip.png', 'Unlocks the blacksmith', 'Purchase upgrades for weapons', 'filler quote here', 50, true, () => {
    Game.items.Blacksmith.hidden = true
    Game.tabs[1].hidden = false
    Game.rebuildTabContent()
    Game.buildTabs()
    Game.switchTab('store')
  })

  Game.quests = []
  Game.quest = function(name, functionName, pic, desc, show) {
    this.name = name
    this.functionName = functionName
    this.pic = pic
    this.desc = desc
    this.show = show
    this.cleared = false


    // Game.quests[this.functionName] = this
    Game.quests.push(this)
  }

  new Game.quest('Baby Forest', 'BabyForest', 'wip.png', 'desc text goes here', 1)
  new Game.quest('Kong Caves', 'KongCaves', 'wip.png', 'desc text goes here', 2)
  new Game.quest('mystery', 'test', 'wip.png', 'desc text goes here', 3)
  new Game.quest('hidden', 'test', 'wip.png', 'desc text goes here', 4)


  let spriteX = 30
  let spriteY = 0

  Game.addCanvasSprite = (sprite) => {
    let randomNumber = Math.floor(Math.random() * 10) + 1
    let image = document.createElement('img')
    image.src = `../assets/${sprite}`
    image.style.height = '70%'
    image.style.width = 'auto'
    image.style.imageRendering = 'pixelated'
    image.style.paddingRight = '15px'
    image.style.marginBottom = randomNumber + 'px'
    s('#canvas').append(image)
  }

  // CLICKS
  s('#ore-sprite').onclick = () => {
    Game.earn(Game.oresPerClick)
    Game.risingNumber(Game.oresPerClick)
    Game.oreClicks++
  }

  s('#ore-sprite-click-area').onclick = () => {
    Game.oreClickArea()
    Game.earn(Game.oresPerClick * Game.criticalOreClickMulti)
    Game.risingNumber(Game.oresPerClick * Game.criticalOreClickMulti, 'ores-special')
  }

  window.onresize = () => {
    Game.oreClickArea()
  }

  //MISC SHIT
  Game.oreClickArea()
  Game.buildTabs()
  Game.switchTab('store')
  Game.rebuildTabContent()
  setInterval(() => {
    Game.earn(Game.ops / Game.fps)
  }, 1000 / Game.fps)
}

window.onload = () => {Game.Launch()}
