let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.launch = () => {
  console.log('Game launched')

  Game.ores = 0
  Game.oreHp = 50
  Game.orePerClick = .1
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
  Game.selectedTab = 'store'

  Game.playSound = (sound) => {
    let sfx = new Audio(`../assets/${sound}.wav`)
    sfx.volume = 0.1
    sfx.play()
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
    s('.ores').innerHTML = 'Ores: ' + Game.ores.toFixed(1)
    s('.level').innerHTML = `Level: ${Game.level.currentLevel} (${Game.level.currentXP}/${Game.level.XPNeeded}xp)`
  }

  Game.dropItems = () => {
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign

    if (Game.stats.rocksDestroyed == 1) {
      let item = document.createElement('div')
      item.classList.add('item-drop')
      item.style.position = 'absolute'

      let orePos = s('.ore').getBoundingClientRect()
      item.style.top = orePos.bottom + 30 + 'px'
      item.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'

      item.addEventListener('click', () => {
        Game.pickUpItem(item)
      })

      s('body').append(item)
    } else {
      if (Math.random() <= .2) {
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
  }

  Game.pickUpItem = (item) => {
    console.log('picking up')

    s('.item-drop').classList.add('item-pickup-animation')

    setTimeout(() => {
      item.remove()
      let itemModal = document.createElement('div')
      itemModal.classList.add('item-modal-container')
      itemModal.innerHTML = `

        <div class="item-modal">
          <div class="item-modal-top">
            <h1>New Item</h1>
          </div>
          <div class="item-modal-middle">
            <div class="item-modal-middle-left">
              <p>You Found</p>
              <div class='item-modal-img'></div>
              <div class="item-stats">
                <h2>Slightly Less Shitty Pickaxe</h2>
                <p>Ore Per Click: 2</p>
                <p>Strength Bonus: 3%</p>
                <p>Luck Bonus: 3%</p>
              </div>
            </div>
            <div class="item-modal-middle-right">
              <p>Equipped</p>
              <div class='item-modal-img'></div>
              <div class="item-stats">
                <h2>Shitty Pickaxe</h2>
                <p>Ore Per Click: 1</p>
              </div>
            </div>
          </div>
          <div class="item-modal-bottom">
            <button style='margin-right: 10px;' onclick=Game.modalButtonClick()>Equip</button>
            <button style='margin-left: 10px;' onclick=Game.modalButtonClick()>Discard</button>
          </div>
        </div>



      `
      s('body').append(itemModal)
    }, 800)
  }

  Game.modalButtonClick = () => {
    s('.item-modal-container').remove()
  }

  let soundPlayed1 = false
  let soundPlayed2 = false
  let soundPlayed3 = false
  let soundPlayed4 = false
  let soundPlayed5 = false
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
      soundPlayed1 = false
      soundPlayed2 = false
      soundPlayed3 = false
      soundPlayed4 = false
      soundPlayed5 = false
    }

    if (currentHp/Game.oreHp > 0.8) {
      s('.ore').style.background = 'url("../assets/rock.png")'
      s('.ore').style.backgroundSize = 'cover'
    }
    if (currentHp/Game.oreHp <= 0.8) {
      s('.ore').style.background = 'url("../assets/rock1-2.png")'
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed1 == false) {
        Game.playSound('explosion')
        soundPlayed1 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.6) {
      s('.ore').style.background = 'url("../assets/rock1-3.png")'
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed2 == false) {
        Game.playSound('explosion')
        soundPlayed2 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.4) {
      s('.ore').style.background = 'url("../assets/rock1-4.png")'
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed3 == false) {
        Game.playSound('explosion')
        soundPlayed3 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.2) {
      s('.ore').style.background = 'url("../assets/rock1-5.png")'
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed4 == false) {
        Game.playSound('explosion')
        soundPlayed4 = true
      }
    }
    if (currentHp/Game.oreHp <= 0) {
      s('.ore').style.background = 'url("../assets/nothing.png")'
      if (soundPlayed5 == false) {
        Game.playSound('explosion2')
        soundPlayed5 = true
      }
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
    Game.selectedTab = selectedTab
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
              <p style='text-align: center;'>Available SP: ${Game.level.availableSP}</p>
              <br/>
              <div class="single-stat">
                <p class='stat-left'>Strength: </p>
                <p>${Game.level.currentStrength}</p>
                `

                if (Game.level.availableSP > 0) {
                  str += `<button class='level-up-btn' onclick='Game.addStat("str")'>+</button>`
                }

              str += `
              <br/>
              </div>
              <div class="single-stat">
                <p class='stat-left'>Luck: </p>
                <p>${Game.level.currentLuck}</p>

                `
                if (Game.level.availableSP > 0) {
                  str += `<button class='level-up-btn' onclick='Game.addStat("luk")'>+</button>`
                }

                str += `

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

  Game.addStat = (stat) => {
    if (Game.level.availableSP > 0) {
      Game.level.availableSP--
      if (stat == 'str') Game.level.currentStrength++
      if (stat == 'luk') Game.level.currentLuck++
      Game.buildTabContent(Game.selectedTab)
    }
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
  new Game.item('Old Man', 'OldMan', 'store', 'oldmanbig.png', 'Increases ore per second by 0.1', 'Extracted from District 12', 'Help me Katniss', 5, false)

  Game.gainXp = () => {
    if (Game.level.currentXP < Game.level.XPNeeded) {
      Game.level.currentXP++
    } else {
      Game.level.currentXP = 0
      Game.level.XPNeeded = Math.ceil(Math.pow(Game.level.XPNeeded, 1.15))
      Game.level.currentLevel++
      Game.level.availableSP += 3
    }
  }

  Game.calculatePerClick = (type) => {
    let amount = 0
    amount += Game.orePerClick
    amount += (Game.level.currentStrength * .3)
    if (type === 'special') {
      amount *= 5
    }
    Game.earn(amount)
    Game.risingNumber(amount, type)
    Game.updatePercentage(amount)
  }

  s('.ore').onclick = () => {
    if (currentHp > 0) {
      Game.calculatePerClick()
      Game.gainXp()
    }
    Game.updatePercentage(0)
    Game.stats.oreClicks++
    Game.playSound('ore-hit')
    if (Game.selectedTab === 'stats') {
      Game.buildTabContent('stats')
    }
  }


  s('.ore-click-area').onclick = () => {
    if (currentHp > 0) {
      Game.calculatePerClick('special')
      Game.oreClickArea()
      Game.gainXp()
    }
    Game.updatePercentage(0)
    Game.stats.oreClicks++
    Game.stats.oreCritClick++
    Game.playSound('ore-hit')
    if (Game.selectedTab === 'stats') {
      Game.buildTabContent('stats')
    }
  }

  //Init Shit
  Game.oreClickArea()
  Game.buildTabs()
  Game.switchTab('store')
  window.onresize = () => Game.oreClickArea()

}

window.onload = () => {Game.launch()}
