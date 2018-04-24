// Helper Shit

let s = ((el) => {return document.querySelector(el)})

let beautify = (num) => {
  if (num >= 1000 && num < 1000000) {
    return (num/1000).toFixed(1) + 'a'
  } else if (num >= 1000000 && num < 1000000000) {
    return (num/1000000).toFixed(1) + 'b'
  } else if (num >= 1000000000 && num < 1000000000000) {
    return (num/1000000000).toFixed(1) + 'c'
  } else if (num >= 1000000000000) {
    return (num/1000000000000).toFixed(1) + 'd'
  }
  return num
}


// Game

let Game = {}

Game.launch = () => {
  console.log('Game launched')

  Game.ores = 0
  Game.oreHp = 50
  Game.oresPerClick = 1
  Game.oresPerSecond = 0
  Game.level = {
    currentLevel: 1,
    currentStrength: 0,
    currentLuck: 0,
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
    rocksDestroyed: 0,
    itemsPickedUp: 0
  }
  Game.selectedTab = 'store'
  Game.newItem = {}
  Game.currentPickaxe = {
    damage: 0,
    synonym: 'Shitty',
    rarity: 'Common',
    itemLevel: 1
  }

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
    s('.ores').innerHTML = 'Ores: ' + beautify(Game.ores.toFixed(1))
    s('.level').innerHTML = `Level: ${Game.level.currentLevel} (${Game.level.currentXP}/${Game.level.XPNeeded}xp)`
  }

  Game.dropItems = () => {
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign
    let randomY = Math.floor(Math.random() * 50) + 1
    let thisItemClicked = false

    if (Game.stats.rocksDestroyed == 1) {
      let item = document.createElement('div')
      item.classList.add('item-drop')
      item.style.position = 'absolute'

      let orePos = s('.ore').getBoundingClientRect()
      item.style.top = orePos.bottom + randomY + 'px'
      item.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'

      item.addEventListener('click', () => {
        if (thisItemClicked == false) {
          thisItemClicked = true
          s('.item-drop').classList.add('item-pickup-animation')
          Game.pickUpItem(item)
        }
      })

      s('body').append(item)
    } else {
      if (Math.random() <= .2) { // 20% chance
        let item = document.createElement('div')
        item.classList.add('item-drop')
        item.style.position = 'absolute'

        let orePos = s('.ore').getBoundingClientRect()
        console.log(orePos)
        item.style.top = orePos.bottom + randomY + 'px'
        item.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'

        item.addEventListener('click', () => {
          if (thisItemClicked == false) {
            thisItemClicked = true
            s('.item-drop').classList.add('item-pickup-animation')
            Game.pickUpItem(item)
          }
        })

        s('body').append(item)
      }
    }
  }

  Game.pickUpItem = (item) => {



    // GENERATE RANDOM ITEM
    // -------------------

    // DETERMINE RARITY BONUS
    let rarity = ''
    let bonus = 1
    let randomNum = Math.random()
    if (randomNum >= .4) { // if number is between .4 and 1
      rarity = 'Common'
      bonus = .05
    } else if (randomNum >= .2 && randomNum < .4) {
      rarity = 'Uncommon'
      bonus = .1
    } else if (randomNum >= .1 && randomNum < .2) {
      rarity = 'Unique'
      bonus = 1
    } else if (randomNum >= .05 && randomNum < .1) {
      rarity = 'Rare'
      bonus = 5
    } else if (randomNum >= 0 && randomNum < .05) {
      rarity = 'Legendary'
      bonus = 10
    }

    let shittySynonyms = ['Shitty', 'Shoddy', 'Broken']
    let synonym = shittySynonyms[Math.floor(Math.random() * shittySynonyms.length)];

    let itemDmg = (Math.random() / 2) * bonus * Game.oreHp
    let itemLevel = Game.stats.rocksDestroyed

    Game.newItem = {
      damage: itemDmg,
      synonym: synonym,
      rarity: rarity,
      itemLevel: itemLevel
    }

    setTimeout(() => {
      item.remove()
      Game.stats.itemsPickedUp++
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
                <h2>${rarity} ${synonym} Pickaxe</h2>
                <p>Item Level: ${Game.newItem.itemLevel}</p>
                <p>Damage: ${beautify(itemDmg.toFixed(1))}</p>
              </div>
            </div>
            <div class="item-modal-middle-right">
              <p>Equipped</p>
              <div class='item-modal-img'></div>
              <div class="item-stats">
                <h2>${Game.currentPickaxe.rarity} ${Game.currentPickaxe.synonym} Pickaxe</h2>
                <p>Item Level: ${Game.currentPickaxe.itemLevel}</p>
                <p>Damage: ${beautify(Game.currentPickaxe.damage.toFixed(1))}</p>
              </div>
            </div>
          </div>
          <div class="item-modal-bottom">
            <button style='margin-right: 10px;' onclick=Game.modalButtonClick(Game.newItem)>Equip</button>
            <button style='margin-left: 10px;' onclick=Game.modalButtonClick()>Discard</button>
          </div>
        </div>



      `
      s('body').append(itemModal)
    }, 800)
  }

  Game.modalButtonClick = (item) => {

    if (item) {
      // Game.oresPerClick = item.damage
      Game.currentPickaxe.rarity = item.rarity
      Game.currentPickaxe.damage = item.damage
      Game.currentPickaxe.itemLevel = item.itemLevel
    }




    s('.item-modal-container').remove()
  }

  let soundPlayed1 = false
  let soundPlayed2 = false
  let soundPlayed3 = false
  let soundPlayed4 = false
  let soundPlayed5 = false
  let currentHp = Game.oreHp
  let whichPic = Math.floor(Math.random() * 3) + 1
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
      Game.oreHp = Math.pow(Game.oreHp, 1.05)
      currentHp = Game.oreHp
      Game.dropItems()
      s('.ore-hp').innerHTML = `${((currentHp/Game.oreHp)*100).toFixed(0)}%`
      soundPlayed1 = false
      soundPlayed2 = false
      soundPlayed3 = false
      soundPlayed4 = false
      soundPlayed5 = false

      whichPic = Math.floor(Math.random() * 3) + 1
    }

    if (currentHp/Game.oreHp > 0.8) {
      s('.ore').style.background = `url("../assets/ore${whichPic}-1.png")`
      s('.ore').style.backgroundSize = 'cover'
    }
    if (currentHp/Game.oreHp <= 0.8) {
      s('.ore').style.background = `url("../assets/ore${whichPic}-2.png")`
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed1 == false) {
        Game.playSound('explosion')
        soundPlayed1 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.6) {
      s('.ore').style.background = `url("../assets/ore${whichPic}-3.png")`
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed2 == false) {
        Game.playSound('explosion')
        soundPlayed2 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.4) {
      s('.ore').style.background = `url("../assets/ore${whichPic}-4.png")`
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed3 == false) {
        Game.playSound('explosion')
        soundPlayed3 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.2) {
      s('.ore').style.background = `url("../assets/ore${whichPic}-5.png")`
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
    risingNumber.innerHTML = `+${beautify(amount.toFixed(1))}`
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

    if (type == 'level') {
      risingNumber.style.fontSize = 'xx-large'
      risingNumber.innerHTML = 'LEVEL UP'
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
    s('.ore-click-area').style.display = 'block'
  }

  Game.buildTabs = () => {
    let str = ''
    for (i = 0; i < Game.tabs.length; i++) {
      if (Game.tabs[i].locked == false) {
        str += `
          <div id='${Game.tabs[i].name}-tab' class='tab' onclick='Game.switchTab("${Game.tabs[i].name}")'  style='display: flex; align-items: center; justify-content: center;'>
            <p style='font-size: x-large'>${Game.tabs[i].name}</p>
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
        <p>Items Picked Up: ${Game.stats.itemsPickedUp}</p>
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
        Game.spend(this.price)
        this.owned++
        this.price += this.basePrice * Math.pow(1.15, this.owned)
        if (this.buyFunction) buyFunction()
        Game.rebuildInventory()
        Game.buildTabContent(Game.selectedTab)
      }
    }

    Game.items[this.functionName] = this
  }

  // name, functionName, tab, pic, desc, fillerText, fillerQuote, price, hidden, buyFunction
  new Game.item('Whetstone', 'Whetstone', 'store', 'whetstone.png', 'Increase ore per click by 1.5', 'filler text goes here', 'filler quote goes here', 10, false, () => {
    Game.oresPerClick *= 1.5
  })
  new Game.item('Magnifying Glass', 'MagnifyingGlass', 'store', 'magnifying-glass.png', 'Allows for critical hits on ore', 'This is useful I swear', 'I can see... I... can... FIGHT', 30, false, () => {
    Game.oreClickArea()
    Game.items.MagnifyingGlass.hidden = true
    if (Game.tabs[1].locked == true) { Game.tabs[1].locked = false; Game.buildTabs(); Game.switchTab(Game.selectedTab)}
  })
  new Game.item('Old Man', 'OldMan', 'store', 'wip.png', 'Increases ore per second by 0.1', 'Extracted from District 12', 'Help me Katniss', 20, false, () => {
    Game.oresPerSecond += .5
    if (Game.tabs[1].locked == true) { Game.tabs[1].locked = false; Game.buildTabs(); Game.switchTab(Game.selectedTab)}
  })

  Game.gainXp = () => {
    if (Game.level.currentXP < Game.level.XPNeeded) {
      Game.level.currentXP++
    } else {
      Game.level.currentXP = 0
      Game.level.currentLevel++
      Game.risingNumber(0, 'level')
      s('#stats-tab').style.boxShadow = '0px 0px 50px yellow'
      setTimeout(() => {
        s('#stats-tab').style.boxShadow = 'none'
      }, 1000)
      Game.playSound('levelup')
      Game.level.XPNeeded = Math.ceil(Math.pow(Game.level.XPNeeded, 1.15))
      // Game.level.XPNeeded = Math.ceil(20 * Math.pow(1.15, Game.level.currentLevel))
      Game.level.availableSP += 3
    }
  }

  Game.calculatePerClick = (type) => {
    let amount = 0

    amount += (Game.oresPerClick + Game.currentPickaxe.damage) + ((Game.oresPerClick + Game.currentPickaxe.damage) * Game.level.currentStrength * .3)

    // amount += Game.oresPerClick * (Game.level.currentStrength * .1)

    if (type === 'special') {
      amount *= 5
    }
    Game.earn(amount)
    Game.risingNumber(amount, type)
    Game.updatePercentage(amount)
  }

    Game.drawParticles = () => {
    for (i = 0; i < 3; i++) {
      let div = document.createElement('div')
      div.classList.add('particle')
      div.style.background = 'lightgrey'
      let x = event.clientX
      let y = event.clientY
      div.style.left = x + 'px'
      div.style.top = y + 'px'

      let particleY = y
      let particleX = x

      let randomNumber = Math.random()
      let randomSign = Math.round(Math.random()) * 2 - 1

      let particleUp = setInterval(() => {
        particleX += randomNumber * randomSign
        particleY -= 1
        div.style.top = particleY + 'px'
        div.style.left = particleX + 'px'
      }, 10)

      setTimeout(() => {
        clearInterval(particleUp)

        let particleDown = setInterval(() => {
          particleX += randomNumber * randomSign / 2
          particleY += 1.5
          div.style.top = particleY + 'px'
          div.style.left = particleX + 'px'
        }, 10)

        setTimeout(() => {
          clearInterval(particleDown)
          div.remove()
        }, 1000)
      }, 100)

      s('body').append(div)
    }
  }

  s('.ore').onclick = () => {
    if (currentHp > 0) {
      Game.calculatePerClick()
      Game.gainXp()
    }
    Game.drawParticles()
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
  // Game.oreClickArea()
  Game.buildTabs()
  Game.switchTab('store')
  Game.updatePercentage(0)
  window.onresize = () => Game.oreClickArea()
  setInterval(() => {
    Game.earn(Game.oresPerSecond / 30)
  }, 1000 / 30)

}

window.onload = () => {Game.launch()}
