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

  Game.oresPerClick = 0.1
  Game.criticalOreClickMulti = 5

  Game.earn = (amount, type) => {
    Game[type] += amount
    console.log(Game.ores)
    Game.rebuildInventory()
    Game.risingNumber(amount, type)
  }

  Game.risingNumber = (amount, type) => {
    let mouseX = event.clientX
    let randomNumber = Math.floor(Math.random() * 20) + 1
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomMouseX = mouseX + (randomNumber * randomSign)
    let mouseY = event.clientY - 20

    let risingNumber = document.createElement('div')
    risingNumber.classList.add('rising-number')
    risingNumber.innerHTML = `+${amount}`
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
    s('#ores').innerHTML = 'Ores: ' + Math.floor(Game.ores)
  }

  Game.switchTab = (selectedTab) => {
    let tabs = document.querySelectorAll('.tab')
    tabs.forEach((tab) => {
      tab.classList.remove('selected')
    })
    s(`#${selectedTab}-tab`).classList.add('selected')
    Game.rebuildTabContent(selectedTab)
  }

  Game.rebuildTabContent = (tab) => {
    let str = ''

    if (tab == 'store') {
      for (var i in Game.items) {
        let item = Game.items[i]
        if (item.tab == 'store') {
          if (item.hidden == false) {
            str += `
              <div class="button" onclick="Game.items.${item.name}.buy()">
                <p>${item.name}</p>
              </div>
            `
          }
        }
      }
    }
    if (tab == 'blacksmith') {
      //
    }
    if (tab == 'stats') {
      str += `
        <p>
          Current Amount of Ores: ${Game.ores} <br/>
          Ore Clicks: ${Game.oreClicks} <br/>
          Total Clicks: ${Game.totalClicks} <br/>
        </p>
      `
    }

    s('#tab-content').innerHTML = str
  }

  Game.items = []
  Game.item = function(name, tab, pic, desc, fillerText, price, hidden, buyFunction) {
    this.name = name
    this.tab = tab
    this.pic = pic
    this.desc = desc
    this.fillerText = fillerText
    this.price = price
    this.owned = 0
    this.hidden = hidden
    this.buyFunction = buyFunction

    this.buy = () => {
      console.log('buying', this.name)
    }

    Game.items[this.name] = this
  }

  new Game.item('Whetstone', 'store', 'wip.png', 'Increase ore per click', 'filler text goes here', 10, false)
  new Game.item('Miner', 'store', 'wip.png', 'Increase ore per click', 'filler text goes here', 10, false)

  // CLICKS
  s('#ore-sprite').onclick = () => {
    Game.earn(Game.oresPerClick, 'ores')
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
  Game.rebuildTabContent('store')
}

window.onload = () => {Game.Launch()}
