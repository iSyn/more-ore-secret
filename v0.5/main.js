let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.launch = () => {
  console.log('Game launched')

  Game.ores = 0
  Game.oreHp = 50
  Game.orePerClick = 10
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
  Game.stats = {
    oreClicks: 0,
    oreCritClick: 0,
    rocksDestroyed: 0
  }

  Game.clickSound = () => {
    let sound = new Audio('../assets/ore-hit.wav')
    sound.volume = 0.3
    sound.play()
  }

  Game.earn = (amount) => {
    Game.ores += amount
    Game.rebuildInventory()
  }

  Game.spend = (amount) => {
    Game.ores -= amount
    Game.rebuildInventory()
  }

  Game.rebuildInventory = () => {
    s('.ores').innerHTML = 'Ores: ' + Game.ores
  }

  Game.dropItems = () => {
    console.log('drop item')

    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign

    console.log(randomNumber)
    if (Game.stats.rocksDestroyed == 1) {
      console.log('first item')
      let item = document.createElement('div')
      item.classList.add('item-drop')
      item.style.position = 'absolute'

      let orePos = s('.ore').getBoundingClientRect()
      console.log(orePos)
      item.style.top = orePos.bottom + 30 + 'px'
      item.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'

      item.addEventListener('click', () => {
        Game.pickUpItem(item)
      })

      s('body').append(item)
    }
  }

  Game.pickUpItem = (item) => {
    console.log('picking up')

    s('.item-drop').classList.add('item-pickup-animation')

    setTimeout(() => {
      item.remove()
      let itemModal = document.createElement('div')
      itemModal.classList.add('item-modal-container')
      itemModal.innerHTML = `
        <div class='item-modal'>
          <h1>New Item</h1>
          <div class="item-modal-left">
            <p>You Found:</p>
          </div>
          <div class="item-modal-right"></div>
        </div>

      `
      s('body').append(itemModal)
    }, 800)
  }

  let currentHp = Game.oreHp
  Game.updatePercentage = (amount) => {
    if (currentHp > 0) {
      if (currentHp - amount > 0) {
        currentHp -= amount
        s('.ore-hp').innerHTML = `${((currentHp/Game.oreHp)*100).toFixed(0)}%`
      } else {
        currentHp = 0
        s('.ore-hp').innerHTML = `0%`
      }
    } else {
      Game.stats.rocksDestroyed++
      Game.oreHp = Math.pow(Game.oreHp, 1.15)
      currentHp = Game.oreHp
      Game.dropItems()
      s('.ore-hp').innerHTML = `${((currentHp/Game.oreHp)*100).toFixed(0)}%`
    }

    if (currentHp/Game.oreHp > 0.8) {
      s('.ore').style.background = 'url("../assets/rock.png")'
      s('.ore').style.backgroundSize = 'cover'
    }
    if (currentHp/Game.oreHp <= 0.8) {
      s('.ore').style.background = 'url("../assets/rock1-2.png")'
      s('.ore').style.backgroundSize = 'cover'
    }
    if (currentHp/Game.oreHp <= 0.6) {
      s('.ore').style.background = 'url("../assets/rock1-3.png")'
      s('.ore').style.backgroundSize = 'cover'
    }
    if (currentHp/Game.oreHp <= 0.4) {
      s('.ore').style.background = 'url("../assets/rock1-4.png")'
      s('.ore').style.backgroundSize = 'cover'
    }
    if (currentHp/Game.oreHp <= 0.2) {
      s('.ore').style.background = 'url("../assets/rock1-5.png")'
      s('.ore').style.backgroundSize = 'cover'
    }
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

    risingNumber.style.position = 'absolute'
    risingNumber.style.fontSize = '15px'
    risingNumber.style.animation = 'risingNumber 2s ease-out'
    risingNumber.style.animationFillMode = 'forwards'
    risingNumber.style.pointerEvents = 'none'
    risingNumber.style.color = 'white'

    if (type == 'special') {
      risingNumber.style.fontSize = 'xx-large'
    }

    s('.particles').append(risingNumber)

    setTimeout(() => {
      risingNumber.remove()
    }, 2000)
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

    if (tab == 'stats') {
      str += `

        <div class='stat-sheet'>
          <div class="stat-sheet-left">
            <div class="stat-sheet-img"></div>
          </div>
          <div class="stat-sheet-right">
            <div class="stats-container">
              <div class="single-stat" style='font-size: x-large'>
                <p class='stat-left'>Level: </p>
                <p>${Game.level.currentLevel}</p>
              </div>
              <hr/>
              <div class="single-stat">
                <p class='stat-left'>Strength: </p>
                <p>${Game.level.currentStrength}</p>
              </div>
              <div class="single-stat">
                <p class='stat-left'>Luck: </p>
                <p>${Game.level.currentLuck}</p>
              </div>

            </div>
          </div>
        </div>

        <p>Ore Clicks: ${Game.stats.oreClicks}</p>
        <p>Ore Crit Clicks: ${Game.stats.oreCritClick} </p>
        <p>Rocks Destroyed: ${Game.stats.rocksDestroyed}</p>
      `
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
  new Game.item('Magnifying Glass', 'MagnifyingGlass', 'store', 'magnifying-glass.png', 'Increase ore crit hit multiplier', 'This is useful I swear', 'I can see... I... can... FIGHT', 30, false, () => {
    Game.criticalOreClickMulti += .3
  })
  new Game.item('Old Man', 'OldMan', 'store', 'oldmanbig.png', 'Increases ore per second by 0.1', 'Extracted from District 12', 'Help me Katniss', 5, false, () => {
    Game.ops += 0.1
    Game.addCanvasSprite('oldman.png')
  })


  s('.ore').onclick = () => {
    if (currentHp > 0) {
      Game.earn(Game.orePerClick)
      Game.updatePercentage(Game.orePerClick)
      Game.risingNumber(Game.orePerClick)
    }
    Game.updatePercentage(0)
    Game.stats.oreClicks++
    Game.clickSound()
  }

  s('.ore-click-area').onclick = () => {
    if (currentHp > 0) {
      Game.earn(Game.orePerClick * 5)
      Game.updatePercentage(Game.orePerClick * 5)
      Game.oreClickArea()
      Game.risingNumber(Game.orePerClick * 5, 'special')
    }
    Game.updatePercentage(0)
    Game.stats.oreClicks++
    Game.stats.oreCritClick++
    Game.clickSound()
  }

  //Init Shit
  Game.oreClickArea()
  Game.buildTabs()
  Game.switchTab('store')
  window.onresize = () => Game.oreClickArea()

}

window.onload = () => {Game.launch()}
