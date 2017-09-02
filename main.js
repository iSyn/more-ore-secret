// Helper Shit

let s = ((el) => {return document.querySelector(el)})

let beautify = (num) => {

  if (num < 1000000) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //found on https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  } else {
    if (num >= 1000000 && num < 1000000000) {
      return (num/1000000).toFixed(1) + 'M'
    }
    if (num >= 1000000000 && num < 1000000000000) {
      return (num/1000000000).toFixed(1) + 'B'
    }
    if (num >= 1000000000000) {
      return (num/1000000000000).toFixed(1) + 'T'
    }
  }
}

formatTime = () => {
  let time = new Date(null);
  time.setSeconds(Game.stats.timePlayed); // specify value for SECONDS here
  let result = time.toISOString().substr(11, 8);
  return result
}

// Game

let Game = {}

Game.launch = () => {
  console.log('Game launched')

  Game.ores = 0
  Game.oreHp = 50
  Game.oresPerSecond = 0
  Game.oreClickMultiplier = 5
  Game.level = {
    currentLevel: 1,
    currentStrength: 0,
    currentLuck: 0,
    currentXP: 0,
    XPNeeded: 100,
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
    itemsPickedUp: 0,
    timePlayed: 0
  }
  Game.selectedTab = 'store'
  Game.newItem = {}
  Game.currentPickaxe = {
    name: 'Beginners Wood Pickaxe',
    rarity: 'Common',
    itemLevel: 1,
    material: 'Wood',
    stats: {
      damage: 1,
      hasPrefix: false
    }
  }

  Game.wipe = () => {
    localStorage.clear()
    location.reload()
  }

  Game.save = () => {
    localStorage.setItem('Game.ores', Game.ores)
    localStorage.setItem('Game.oreHp', Game.oreHp)
    localStorage.setItem('Game.level', JSON.stringify(Game.level))
    localStorage.setItem('Game.tabs', JSON.stringify(Game.tabs))
    localStorage.setItem('Game.stats', JSON.stringify(Game.stats))
    localStorage.setItem('Game.currentPickaxe', JSON.stringify(Game.currentPickaxe))
    for (let i in Game.items) { localStorage.setItem(`item-${i}`, JSON.stringify(Game.items[i])) }
    for (let i in Game.achievements) { localStorage.setItem(`achievement-${i}`, JSON.stringify(Game.achievements[i])) }
  }

  Game.load = () => {
    if (localStorage.getItem('Game.ores') !== null) {
      Game.ores = parseFloat(localStorage.getItem('Game.ores'))
      Game.oreHp = parseFloat(localStorage.getItem('Game.oreHp'))
      Game.level = JSON.parse(localStorage.getItem('Game.level'))
      Game.tabs = JSON.parse(localStorage.getItem('Game.tabs'))
      Game.stats = JSON.parse(localStorage.getItem('Game.stats'))
      Game.currentPickaxe = JSON.parse(localStorage.getItem('Game.currentPickaxe'))
      for (let i in Game.items) { Game.items[i] = JSON.parse(localStorage.getItem(`item-${i}`)) }
      for (let i in Game.achievements) {
        Game.achievements[i] = JSON.parse(localStorage.getItem(`achievement-${i}`))
      }
    }
  }

  Game.playSound = (sound) => {
    let sfx = new Audio(`./assets/${sound}.wav`)
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
    let str = ''
    str += `Ores: ${beautify(Game.ores.toFixed(0))}`
    if (Game.oresPerSecond > 0) {
      str += ` (${Game.oresPerSecond.toFixed(1)}/s)`
    }
    s('.ores').innerHTML = str
    s('.level').innerHTML = `Level: ${Game.level.currentLevel} (${Game.level.currentXP}/${Game.level.XPNeeded}xp)`
  }

  Game.dropItems = () => {
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign
    let randomY = Math.floor(Math.random() * 50) + 1
    let thisItemClicked = false
    let amountOfRocksDestroyed = Game.stats.rocksDestroyed

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
          Game.pickUpItem(item, amountOfRocksDestroyed)
        }
      })

      s('body').append(item)
    } else {
      if (Math.random() <= .2) { // 20% chance
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
            Game.pickUpItem(item, amountOfRocksDestroyed)
          }
        })

        s('body').append(item)
      }
    }
  }

  Game.rarity = [
    {
      name: 'Common',
      mult: 1
    }, {
      name: 'Uncommon',
      mult: 1.5
    }, {
      name: 'Unique',
      mult: 2
    }, {
      name: 'Rare',
      mult: 3
    }, {
      name: 'Legendary',
      mult: 5
    }
  ]
  Game.prefixes = [
    {
      name: 'Lucky',
      stat: 'Luck',
      mult: 1
    }, {
      name: 'Unlucky',
      stat: 'Luck',
      mult: -1
    }, {
      name: 'Fortuitous',
      stat: 'Luck',
      mult: 2
    }, {
      name: 'Poor',
      stat: 'Luck',
      mult: -1
    }, {
      name: 'Strong',
      stat: 'Strength',
      mult: 1
    }, {
      name: 'Weak',
      stat: 'Strength',
      mult: -1
    }, {
      name: 'Big',
      stat: 'Strength',
      mult: 1
    }, {
      name: 'Small',
      stat: 'Strength',
      mult: -1
    }, {
      name: 'Baby',
      stat: 'Strength',
      mult: -2
    }, {
      name: 'Gigantic',
      stat: 'Strength',
      mult: 2
    },   {
      name: 'Durable',
      stat: 'Strength',
      mult: 1
    }, {
      name: 'Frail',
      stat: 'Strength',
      mult: -1.5
    }, {
      name: 'Hard',
      stat: 'Strength',
      mult: 1
    }, {
      name: 'Weak',
      stat: 'Strength',
      mult: -1
    }, {
      name: 'Broken',
      stat: 'Strength',
      mult: -2
    }, {
      name: 'Shoddy',
      stat: 'Strength',
      mult: -1
    }
  ]
  Game.materials = [
    {
      name: 'Wood',
      mult: .5
    }, {
      name: 'Stone',
      mult: 1.5
    }, {
      name: 'Iron',
      mult: 3
    }, {
      name: 'Steel',
      mult: 5
    }, {
      name: 'Diamond',
      mult: 10
    }
  ]
  Game.suffixes = [
    {
      name: 'of the Giant',
      stat: 'strength',
      mult: 10
    }, {
      name: 'of the Leprechaun',
      stat: 'luck',
      mult: 10
    }
  ]

  Game.pickUpItem = (item, iLvl) => {

    Game.stats.itemsPickedUp++
    // GENERATE A RANDOM ITEM
    let range = Math.ceil((Math.random() * iLvl/2) + iLvl/2) // Picks a random whole number from 1 to iLvl

    let chooseRarity = () => {
      let rarity
      let randomNum = Math.random()
      if (randomNum >= 0) {
        rarity = Game.rarity[0]
      }
      if (randomNum >= .5) {
        rarity = Game.rarity[1]
      }
      if (randomNum >= .7) {
        rarity = Game.rarity[2]
      }
      if (randomNum >= .9) {
        rarity = Game.rarity[3]
      }
      if (randomNum >= .95) {
        rarity = Game.rarity[4]
      }
      return rarity
    }
    let chooseMaterial = () => {
      let material
      let randomNum = Math.random()
      if (randomNum >= 0) {
        material = Game.materials[0]
      }
      if (randomNum >= .4) {
        material = Game.materials[1]
      }
      if (randomNum >= .7) {
        material = Game.materials[2]
      }
      if (randomNum >= .9) {
        material = Game.materials[3]
      }
      if (randomNum >= .95) {
        material = Game.materials[4]
      }
      return material
    }

    let selectedRarity = chooseRarity()
    let selectedMaterial = chooseMaterial()
    let totalMult = selectedRarity.mult + selectedMaterial.mult
    let itemName
    let prefixName
    let prefixVal
    let prefixStat
    let suffixName

    if (selectedRarity.name == 'Legendary' || selectedRarity.name == 'Rare') {
      let selectedSuffix = Game.suffixes[Math.floor(Math.random() * Game.suffixes.length)]
      totalMult += selectedSuffix.mult
      suffixName = selectedSuffix.name
    }

    if (Math.random() >= .6) {
      let selectedPrefix = Game.prefixes[Math.floor(Math.random() * Game.prefixes.length)]
      prefixVal = (range + totalMult) * selectedPrefix.mult
      prefixStat = selectedPrefix.stat
      prefixName = selectedPrefix.name
    }

    if (prefixName) {
      itemName = `${prefixName} ${selectedMaterial.name} Pickaxe`
    } else {
      itemName = `${selectedMaterial.name} Pickaxe`
    }

    if (suffixName) {
      itemName += ` ${suffixName}`
    }

    let calculateDmg = iLvl * totalMult // GOTTA EDIT THIS <------------------

    Game.newItem = {
      name: itemName,
      rarity: selectedRarity.name,
      material: selectedMaterial.name,
      itemLevel: iLvl,
      stats: {
        damage: calculateDmg,
        hasPrefix: false
      }
    }

    if (prefixName) {
      Game.newItem.stats['hasPrefix'] = true
      Game.newItem.stats['stat'] = prefixStat
      Game.newItem.stats['statVal'] = prefixVal
    }

    setTimeout(() => {
      item.remove()
      Game.itemModal(Game.newItem)
    }, 800)
  }

  Game.itemModal = (item) => {
    let itemModal = document.createElement('div')
    itemModal.classList.add('item-modal-container')

    let str = `
      <div class="item-modal">
        <div class="item-modal-top">
          <h1>New Item!</h1>
        </div>
        <div class="item-modal-middle">
          <div class="item-modal-middle-left">
            <p>You Found</p>
            <h2 class='${item.rarity}' style='font-size: xx-large'>${item.name}</h2>
            <div class="item-modal-img">
              <div class="pickaxe-aura aura-${item.rarity}"></div>
              <div class="pickaxe-top ${item.material}"></div>
              <div class="pickaxe-bottom"></div>
            </div>
            <div class="item-stats">
              <p style='font-style: italic; font-size: small'>${item.rarity}</p>
              <br/>
              <p>Item Level: ${item.itemLevel}</p>
              <p>Damage: ${beautify(item.stats.damage)}</p>
              `
              if (item.stats.hasPrefix == true) {
                str += `
                  <p>${item.stats.stat}: ${Math.floor(item.stats.statVal)}</p>
                `
              }
              str += `
            </div>
          </div>
          <div class="item-modal-middle-right">
            <p>Currently Equipped</p>
            <h2 class='${Game.currentPickaxe.rarity}' style='font-size: xx-large'>${Game.currentPickaxe.name}</h2>
            <div class="item-modal-img">
              <div class="pickaxe-aura aura-${Game.currentPickaxe.rarity}"></div>
              <div class="pickaxe-top ${Game.currentPickaxe.material}"></div>
              <div class="pickaxe-bottom"></div>
            </div>
            <div class="item-stats">
              <p style='font-style: italic; font-size: small'>${Game.currentPickaxe.rarity}</p>
              <br/>
              <p>Item Level: ${Game.currentPickaxe.itemLevel}</p>
              <p>Damage: ${beautify(Game.currentPickaxe.stats.damage)}</p>
              `
              if (Game.currentPickaxe.stats.hasPrefix == true) {
                str += `
                  <p>${Game.currentPickaxe.stats.stat}: ${Math.floor(Game.currentPickaxe.stats.statVal)}</p>
                `
              }
              str += `
            </div>
          </div>
        </div>
        <div class="item-modal-bottom">
          <button style='margin-right: 10px;' onclick=Game.modalButtonClick('equip')>Equip</button>
          <button style='margin-left: 10px;' onclick=Game.modalButtonClick()>Discard</button>
        </div>
      </div>
    `

    itemModal.innerHTML = str
    s('body').append(itemModal)
  }

  Game.modalButtonClick = (str) => {

    if (str == 'equip') {
      Game.currentPickaxe = Game.newItem
    }
    s('.item-modal-container').remove()
  }

  let soundPlayed1 = false
  let soundPlayed2 = false
  let soundPlayed3 = false
  let soundPlayed4 = false
  let soundPlayed5 = false
  let currentHp = Game.oreHp
  let whichPic = Math.floor(Math.random() * 5) + 1
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
      s('.ore').style.background = `url("./assets/ore${whichPic}-1.png")`
      s('.ore').style.backgroundSize = 'cover'
    }
    if (currentHp/Game.oreHp <= 0.8) {
      s('.ore').style.background = `url("./assets/ore${whichPic}-2.png")`
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed1 == false) {
        Game.playSound('explosion')
        soundPlayed1 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.6) {
      s('.ore').style.background = `url("./assets/ore${whichPic}-3.png")`
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed2 == false) {
        Game.playSound('explosion')
        soundPlayed2 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.4) {
      s('.ore').style.background = `url("./assets/ore${whichPic}-4.png")`
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed3 == false) {
        Game.playSound('explosion')
        soundPlayed3 = true
      }
    }
    if (currentHp/Game.oreHp <= 0.2) {
      s('.ore').style.background = `url("./assets/ore${whichPic}-5.png")`
      s('.ore').style.backgroundSize = 'cover'
      if (soundPlayed4 == false) {
        Game.playSound('explosion')
        soundPlayed4 = true
      }
    }
    if (currentHp/Game.oreHp <= 0) {
      s('.ore').style.background = 'url("./assets/nothing.png")'
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

    if (type == 'spendMoney') {
      risingNumber.style.fontSize = 'xx-large'
      risingNumber.innerHTML = '-$'
      risingNumber.style.color = 'red'
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
    // Game.playSound('changetabsound')
  }

  Game.buildTabContent = (tab) => {
    let str = ''
    if (tab == 'store') {
      for (var i in Game.items) {
        let item = Game.items[i]
        if (item.tab == 'store') {
          if (item.hidden == 0) {
            str += `
              <div class="button" onclick="Game.items.${item.functionName}.buy()" style='border-radius: 10px'>
                <div class="button-top">
                  <div class="button-left">
                    <img src="./assets/${item.pic}" style='filter: brightness(100%); image-rendering: pixelated'/>
                  </div>
                  <div class="button-middle">
                    <h3 style='font-size: larger'>${item.name}</h3>
                    <p>cost: ${beautify(item.price.toFixed(0))} ores</p>
                  </div>
                  <div class="button-right">
                    <p style='font-size: xx-large'>${item.owned}</p>
                  </div>
                </div>
                <div class="button-bottom">
                  <hr/>
                  <p>${item.desc}</p>
                  <hr />
                  `
                  if (item.owned > 0) {
                    str += `
                      <p> <span class='bold'>${item.owned}</span> ${item.name} generating <span class='bold'>${(item.perSecond * item.owned).toFixed(1)}</span> ores per second</p>
                    `
                  }


                  str += `
                  <br/>
                  <p style='font-style: italic; text-align: center'>“${item.fillerQuote}”</p>
                </div>
              </div>
            `
          }
          if (item.hidden == 1) {
            str += `
              <div class="button" onclick="Game.items.${item.functionName}.buy()" style='border-radius: 10px; cursor: not-allowed; box-shadow: 0 4px black; filter: brightness(50%)'>
                <div class="button-top">
                  <div class="button-left">
                    <img src="./assets/${item.pic}" style='filter: brightness(0%)'/>
                  </div>
                  <div class="button-middle">
                    <h3 style='font-size: larger'>???</h3>
                    <p>cost: ??? ores</p>
                  </div>
                  <div class="button-right">

                  </div>
                </div>
              </div>
              `
          }
        }
      }
    }

    if (tab == 'upgrades') {
      for (var i in Game.items) {
        let item = Game.items[i]
        if (item.tab == 'upgrades') {
          if (item.hidden == 0) {
            str += `
              <div class="button" onclick="Game.items.${item.functionName}.buy()" style='border-radius: 10px'>
                <div class="button-top">
                  <div class="button-left">
                    <img src="./assets/${item.pic}" style='filter: brightness(100%); image-rendering: pixelated'/>
                  </div>
                  <div class="button-middle">
                    <h3 style='font-size: larger'>${item.name}</h3>
                    <p>cost: ${beautify(item.price.toFixed(0))} ores</p>
                  </div>
                  <div class="button-right">
                    <p style='font-size: xx-large'>${item.owned}</p>
                  </div>
                </div>

                <div class="button-bottom">
                  <hr/>
                  <p>${item.desc}</p>
                  <hr />
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
        <p>Time Played: ${formatTime()}</p>

        <button onclick=Game.save()>Save</button>
        <button onclick=Game.wipe()>Wipe Save</button>
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
  Game.item = function(name, functionName, tab, pic, perSecond, desc, fillerQuote, price, hidden, buyFunction) {
    this.name = name
    this.functionName = functionName
    this.tab = tab
    this.pic = pic
    this.perSecond = perSecond
    this.desc = desc
    this.fillerQuote = fillerQuote
    this.basePrice = price
    this.price = price
    this.owned = 0
    this.hidden = hidden
    this.buyFunction = buyFunction

    this.buy = () => {
      if (Game.ores >= this.price) {
        Game.playSound('buysound')
        Game.spend(this.price)
        this.owned++
        this.price += this.basePrice * Math.pow(1.15, this.owned)
        if (this.buyFunction) buyFunction()
        Game.rebuildInventory()
        Game.risingNumber(0, 'spendMoney')
        Game.buildTabContent(Game.selectedTab)
      }
    }

    Game.items[this.functionName] = this
  }

  // name, functionName, tab, pic, perSecond, desc, fillerQuote, price, hidden, buyFunction
  new Game.item('Magnifying Glass', 'MagnifyingGlass', 'store', 'magnifying-glass.png', 0, 'Allows you to spot weakpoints inside the rock', 'I can see... I... can... FIGHT', 5, 0, () => {
    Game.oreClickArea()
    Game.items.MagnifyingGlass.hidden = 3
    if (Game.tabs[1].locked == true) { Game.tabs[1].locked = false; Game.buildTabs(); Game.switchTab(Game.selectedTab)}
  })
  new Game.item('Old Man', 'OldMan', 'store', 'oldman.png', .2, 'He\'s just trying to feed his family', 'wip', 10, 0, () => {
    if (Game.tabs[1].locked == true) { Game.tabs[1].locked = false; Game.buildTabs(); Game.switchTab(Game.selectedTab)}
    if (Game.items.RockFarmer.hidden == 1) {Game.items.RockFarmer.hidden = 0}
    if (Game.items.RockMiner.hidden == 2) {Game.items.RockMiner.hidden = 1}
  })
  new Game.item('Rock Farmer', 'RockFarmer', 'store', 'rock-farmer.png', 1, 'A farmer that farms rocks... it\'s a dying business', 'wip', 100, 1, () => {
    if (Game.items.RockMiner.hidden == 1) {Game.items.RockMiner.hidden = 0}
    if (Game.items.HighSpeedAutoJackhammer.hidden == 2) {Game.items.HighSpeedAutoJackhammer.hidden = 1}
  })
  new Game.item('Rock Miner', 'RockMiner', 'store', 'rock-miner.png', 5, 'This makes a lot more sense...', 'wip', 1500, 2, () => {
    if (Game.items.HighSpeedAutoJackhammer.hidden == 1) {Game.items.HighSpeedAutoJackhammer.hidden = 0}
  })
  new Game.item('High Speed Auto Jackhammer','HighSpeedAutoJackhammer', 'store', 'wip.png', 30, 'This breaks many safety regulations', '0 days since last accident', 5000, 2, () => {
  })


  // UPGRADES
  new Game.item('Clean Magnifying Glass', 'CleanMagnifyingGlass', 'upgrades', 'wip.png', 0, 'Increases critical hit multiplier to 10x', 'wip', 100, 0, () => {
    if (Game.items.CleanMagnifyingGlass.owned > 0) {Game.items.CleanMagnifyingGlass.hidden = 1}
    Game.oreClickMultiplier = 10
    Game.items.PolishMagnifyingGlass.hidden = 0
  })

  new Game.item('Polish Magnifying Glass', 'PolishMagnifyingGlass', 'upgrades', 'wip.png', 0, 'Increases critical hit multiplier to 15x', 'wip', 10000, 1, () => {
    if (Game.items.PolishMagnifyingGlass.owned > 0) {Game.items.PolishMagnifyingGlass.hidden = 1}
    Game.oreClickMultiplier = 15
  Game.items.RefineMagnifyingGlass.hidden = 0
  })

  new Game.item('Refine Magnifying Glass', 'RefineMagnifyingGlass', 'upgrades', 'wip.png', 0, 'Increases critical hit multiplier to 20x', 'wip', 1000000, 1, () => {
    if (Game.items.RefineMagnifyingGlass.owned > 0) {Game.items.RefineMagnifyingGlass.hidden = 1}
    Game.oreClickMultiplier = 20
  })

  new Game.item('Near-Sighted Glasses','NearSightedGlasses', 'upgrades', 'glasses.png', 0, 'Doubles the amount of ores generated by the Old Men', 'wip', 500, 0, () => {
    if (Game.items.NearSightedGlasses.owned > 0) {Game.items.NearSightedGlasses.hidden = 1}
    Game.items.OldMan.perSecond *= 2
  })


  Game.gainXp = () => {
    if (Game.level.currentXP < Game.level.XPNeeded) {
      Game.level.currentXP++
    } else {
      Game.level.currentXP = 0
      Game.level.currentLevel++
      Game.level.availableSP += 3
      Game.playSound('levelup')
      Game.level.XPNeeded = Math.ceil(Math.pow(Game.level.XPNeeded, 1.15))
      setTimeout(() => {
        s('#stats-tab').style.boxShadow = 'none'
      }, 1000)
      s('#stats-tab').style.boxShadow = '0px 0px 50px yellow'
      Game.risingNumber(0, 'level')
    }
    if (Game.level.availableSP > 0) {
      s('#stats-tab').innerHTML = 'stats [!]'
      s('#stats-tab').style.fontSize = 'x-large'
    } else {
      s('#stats-tab').innerHTML = 'stats'
      s('#stats-tab').style.fontSize = 'x-large'
    }
  }

  Game.achievements = []
  Game.achievement = function(name, img, howToUnlock) {
    this.name = name
    this.img = img
    this.howToUnlock = howToUnlock
    this.won = 0
    this.functionName = name.replace(/ /g, '')


    Game.achievements[this.functionName] = this
  }

  Game.win = (achievement) => {
    if (Game.achievements[achievement]) {
      if (Game.achievements[achievement].won == 0) {
        Game.achievements[achievement].won = 1
        let div = document.createElement('div')
        div.classList.add('achievement')
        div.innerHTML = `
          <img class='achievement-img' src="./assets/${Game.achievements[achievement].img}" alt="" />
          <div class="achievement-right">
            <h3>Achievement Unlocked</h3>
            <h1>${Game.achievements[achievement].name}</h1>
            <p>${Game.achievements[achievement].howToUnlock}</p>
          </div>
        `
        s('body').append(div)

        setTimeout(() => {
          div.remove()
        }, 2800)
      }
    }
  }

  new Game.achievement('Your First Ore', 'wip.png', 'Mine your first ore')
  new Game.achievement('Bucket Full of Ore', 'wip', 'Mine a total of 500 ores')


  new Game.achievement('Level 2', 'Reach lvl 2', 'wip')



  Game.calculatePerClick = (type) => {
    let amount = 0
    let totalStr = Game.level.currentStrength

    if (Game.currentPickaxe.stats.stat) {
      if (Game.currentPickaxe.stats.stat == 'Strength') {
        totalStr += Game.currentPickaxe.stats.statVal
      }
    }

    amount += Game.currentPickaxe.stats.damage
    amount += Game.currentPickaxe.stats.damage * totalStr * .1


    if (type === 'special') {
      amount *= Game.oreClickMultiplier
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
    if (Game.achievements['YourFirstOre'].won == 0) {Game.win('YourFirstOre')}
  }
  s('.ore-click-area').onclick = () => {
    if (currentHp > 0) {
      Game.calculatePerClick('special')
      Game.oreClickArea()
      Game.gainXp()
    }
    Game.drawParticles()
    Game.updatePercentage(0)
    Game.stats.oreClicks++
    Game.stats.oreCritClick++
    Game.playSound('ore-hit')
    if (Game.selectedTab === 'stats') {
      Game.buildTabContent('stats')
    }
  }

  setInterval(() => {
    Game.gainXp()
    Game.stats.timePlayed += 1
    if (Game.selectedTab == 'stats') {
      Game.buildTabContent(Game.selectedTab)
    }
  }, 1000)

  //Init Shit
  Game.load()
  Game.buildTabs()
  Game.switchTab('store')
  Game.rebuildInventory()
  Game.updatePercentage(0)
  window.onresize = () => Game.oreClickArea()
  setInterval(() => {
    let ops = 0
    ops += Game.items.OldMan.owned * Game.items.OldMan.perSecond
    ops += Game.items.RockFarmer.owned * Game.items.RockFarmer.perSecond
    ops += Game.items.RockMiner.owned * Game.items.RockMiner.perSecond
    ops += Game.items.HighSpeedAutoJackhammer.owned * Game.items.HighSpeedAutoJackhammer.perSecond
    Game.earn(ops / 30)
    Game.updatePercentage(ops / 30)
    Game.oresPerSecond = ops
  }, 1000 / 30)

}

window.onload = () => {Game.launch()}
