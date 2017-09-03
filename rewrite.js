// Helper Shit

let s = ((el) => {return document.querySelector(el)})

let beautify = (num) => {

  if (num % 1 == 0) { // IF NUMBER IS AN INTEGER
    return num

  } else { // IF NUMBER IS A FLOAT
    if (num < 1) {
      return parseFloat(num).toFixed(1)
    } else {
      return num.toFixed(1)
    }
  }


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

// Game

let Game = {}

Game.launch = () => {

  Game.state = {
    ores: 0,
    oreHp: 50,
    oresPerSecond: 0,
    oreClickMultiplier: 5,
    player: {
      lvl: 1,
      str: 0,
      luk: 0,
      int: 0,
      dex: 0,
      currentXp: 0,
      xpNeeded: 100,
      availableSp: 0,
      pickaxe: {
        name: 'Beginners Wood Pickaxe',
        rarity: 'Common',
        itemLevel: 1,
        material: 'Wood',
        damage: .2
      },
      accesory: {}
    },
    tabs: [
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
    ],
    stats: {
      totalOresMined: 0,
      totalOresSpent: 0,
      oreClicks: 0,
      oreCritClicks: 0,
      rocksDestroyed: 0,
      itemsPickedUp: 0,
      timePlayed: 0
    },
    items: [
      {
        id: 0,
        name: 'Magnifying Glass',
        functionName: 'MagnifyingGlass',
        tab: 'store',
        pic: 'magnifying-glass.png',
        production: 0,
        desc: 'Allows you to spot weakpoints inside the rock',
        fillerQuote: 'wip',
        price: 5,
        hidden: 0,
        owned: 0
      }, {
        id: 1,
        name: 'Old Man',
        functionName: 'OldMan',
        tab: 'store',
        pic: 'oldman.png',
        production: .2,
        desc: 'wip',
        fillerQuote: 'wip',
        price: 10,
        hidden: 0,
        owned: 0
      }
    ]
  }

  Game.wipe = () => {
    localStorage.clear()
    location.reload()
  }

  Game.save = () => {
    localStorage.setItem('state', JSON.stringify(Game.state))
  }

  Game.load = () => {
    if (localStorage.getItem('state') !== null) {
      Game.state = JSON.parse(localStorage.getItem('state'))
    }
  }

  let playSound = (snd) => {
    let sfx = new Audio(`./assets/${snd}.wav`)
    sfx.volume = 0.1
    sfx.play()
  }

  let earn = (amt) => {
    Game.state.ores += amt
    Game.state.stats.totalOresMined += amt
  }

  let earnOPS = () => {
    let ops = calculateOPS()
    Game.state.oresPerSecond = ops
    earn(ops/30)
    updatePercentage(ops/30)
  }

  let spend = (amt) => {
    Game.state.ores -= amt
    Game.state.stats.totalOresSpent += amt
  }

  let calculateOPC = (type) => {
    let opc = 0
    let str = Game.state.player.str
    if (Game.state.player.pickaxe.prefixStat) {
      if (Game.state.player.pickaxe.prefixStat == 'Strength') {
        str += Game.state.player.pickaxe.prefixStatVal
      }
    }
    opc += Game.state.player.pickaxe.damage
    opc += Game.state.player.pickaxe.damage * str * .1

    if (type == 'crit') {
      opc *= 5
    }

    return opc
  }

  let calculateOPS = () => {
    let ops = 0
    // ops += Game.items.OldMan.owned * Game.items.OldMan.production
    return ops
  }

  let dropItem = () => {
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign
    let randomY = Math.floor(Math.random() * 50) + 1
    let thisItemClicked = false
    let amountOfRocksDestroyed = Game.state.stats.rocksDestroyed
    let iLvl = amountOfRocksDestroyed

    if (Game.state.stats.rocksDestroyed == 1) {
      let item = document.createElement('div')
      item.classList.add('item-drop')
      item.style.position = 'absolute'

      let orePos = s('.ore').getBoundingClientRect()
      item.style.top = orePos.bottom + randomY + 'px'
      item.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'

      item.addEventListener('click', () => {
        item.style.pointerEvents = 'none'
        s('.item-drop').classList.add('item-pickup-animation')
        setTimeout(() => {
          item.remove()
          pickUpItem(iLvl)
        }, 800)
      })
      s('body').append(item)
    } else {
      if (Math.random() <= .3) { // 30% chance
        let item = document.createElement('div')
        item.classList.add('item-drop')
        item.style.position = 'absolute'

        let orePos = s('.ore').getBoundingClientRect()
        item.style.top = orePos.bottom + randomY + 'px'
        item.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'

        item.addEventListener('click', () => {
          item.style.pointerEvents = 'none'
          s('.item-drop').classList.add('item-pickup-animation')
          setTimeout(() => {
            item.remove()
            pickUpItem(iLvl)
          }, 800)
        })

        s('body').append(item)
      }
    }
  }

  let generateRandomItem = (iLvl) => {

    let rarity = [
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
    let prefixes = [
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
    let materials = [
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
    let suffixes = [
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

    let range = Math.ceil((Math.random() * iLvl/2) + iLvl/2) // Picks a random whole number from 1 to iLvl

    let chooseRarity = () => {
      let selectedRarity
      let randomNum = Math.random()
      if (randomNum >= 0) {
        selectedRarity = rarity[0]
      }
      if (randomNum >= .5) {
        selectedRarity = rarity[1]
      }
      if (randomNum >= .7) {
        selectedRarity = rarity[2]
      }
      if (randomNum >= .9) {
        selectedRarity = rarity[3]
      }
      if (randomNum >= .95) {
        selectedRarity = rarity[4]
      }
      return selectedRarity
    }
    let chooseMaterial = () => {
      let selectedMaterial
      let randomNum = Math.random()
      if (randomNum >= 0) {
        selectedMaterial = materials[0]
      }
      if (randomNum >= .4) {
        selectedMaterial = materials[1]
      }
      if (randomNum >= .7) {
        selectedMaterial = materials[2]
      }
      if (randomNum >= .9) {
        selectedMaterial = materials[3]
      }
      if (randomNum >= .95) {
        selectedMaterial = materials[4]
      }
      return selectedMaterial
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
      let selectedSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]
      totalMult += selectedSuffix.mult
      suffixName = selectedSuffix.name
    }
    if (Math.random() >= .6) { // 40% chance for a prefix
      let selectedPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
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

    let calculateDmg = iLvl * totalMult

    let newItem = {
      name: itemName,
      rarity: selectedRarity.name,
      material: selectedMaterial.name,
      itemLevel: iLvl,
      damage: calculateDmg,
    }

    if (prefixName) {
      newItem['hasPrefix'] = true
      newItem['prefixStat'] = prefixStat
      newItem['prefixStatVal'] = prefixVal
    }

    return newItem
  }

  let pickUpItem = (iLvl) => {
    Game.state.stats.itemsPickedUp++
    Game.newItem = generateRandomItem(iLvl)
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
            <h2 class='${Game.newItem.rarity}' style='font-size: xx-large'>${Game.newItem.name}</h2>
            <div class="item-modal-img">
              <div class="pickaxe-aura aura-${Game.newItem.rarity}"></div>
              <div class="pickaxe-top ${Game.newItem.material}"></div>
              <div class="pickaxe-bottom"></div>
            </div>
            <div class="item-stats">
              <p style='font-style: italic; font-size: small'>${Game.newItem.rarity}</p>
              <br/>
              <p>Item Level: ${Game.newItem.itemLevel}</p>
              <p>Damage: ${beautify(Game.newItem.damage)}</p>
              `
              if (Game.newItem.hasPrefix == true) {
                str += `
                  <p>${Game.newItem.prefixStat}: ${Math.floor(Game.newItem.prefixStatVal)}</p>
                `
              }
              str += `
            </div>
          </div>
          <div class="item-modal-middle-right">
            <p>Currently Equipped</p>
            <h2 class='${Game.state.player.pickaxe.rarity}' style='font-size: xx-large'>${Game.state.player.pickaxe.name}</h2>
            <div class="item-modal-img">
              <div class="pickaxe-aura aura-${Game.state.player.pickaxe.rarity}"></div>
              <div class="pickaxe-top ${Game.state.player.pickaxe.material}"></div>
              <div class="pickaxe-bottom"></div>
            </div>
            <div class="item-stats">
              <p style='font-style: italic; font-size: small'>${Game.state.player.pickaxe.rarity}</p>
              <br/>
              <p>Item Level: ${Game.state.player.pickaxe.itemLevel}</p>
              <p>Damage: ${beautify(Game.state.player.pickaxe.damage)}</p>
              `
              if (Game.state.player.pickaxe.hasPrefix == true) {
                str += `
                  <p>${Game.state.player.pickaxe.prefixStat}: ${Math.floor(Game.state.player.pickaxe.prefixStatVal)}</p>
                `
              }
              str += `
            </div>
          </div>
        </div>
        <div class="item-modal-bottom">
          <button style='margin-right: 10px;' onclick=Game.itemModalClick('equip')>Equip</button>
          <button style='margin-left: 10px;' onclick=Game.itemModalClick()>Discard</button>
        </div>
      </div>
    `

    itemModal.innerHTML = str
    s('body').append(itemModal)
  }

  Game.itemModalClick = (str) => {

    if (str == 'equip') {
      Game.state.player.pickaxe = Game.newItem
    }
    s('.item-modal-container').remove()
  }

  let buildInventory = () => {
    let str = ''
    str += `Ores: ${beautify(Game.state.ores)}`
    if (Game.state.oresPerSecond > 0) {
      str += ` (${Game.state.oresPerSecond.toFixed(1)}/s)`
    }
    s('.ores').innerHTML = str
    s('.level').innerHTML = `Level: ${Game.state.player.lvl} (${Game.state.player.currentXp}/${Game.state.player.xpNeeded})`
  }

  let buildTabs = () => {
    let str = ''
    for (i = 0; i < Game.state.tabs.length; i++) {
      if (Game.state.tabs[i].locked == false) {
        str += `
          <div id='${Game.state.tabs[i].name}-tab' class='tab' onclick='Game.switchTab("${Game.state.tabs[i].name}")' style='display: flex; align-items: center; justify-content: center;'>
            <p style='font-size: x-large'>${Game.state.tabs[i].name}</p>
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
    Game.selectedTab = selectedTab
    buildTabContent()
  }

  let buildTabContent = () => {
    let str = ''
    if (Game.selectedTab == 'store') {
      for (let i in Game.items) {
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
                      <p> <span class='bold'>${item.owned}</span> ${item.name} generating <span class='bold'>${(item.production * item.owned).toFixed(1)}</span> ores per second</p>
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
    if (Game.selectedTab == 'upgrades') {
      for (let i in Game.items) {
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
    if (Game.selectedTab == 'stats') {
      str += `

        <div class='stat-sheet'>

          <div class="stat-sheet-right">
            <div class="stats-container">
              <div class="single-stat" style='font-size: x-large'>
                <p class='stat-left'>Level: </p>
                <p>${Game.state.player.lvl}</p>
              </div>
              <hr/>
              <p style='text-align: center;'>Available SP: ${Game.state.player.availableSp}</p>
              <br/>
              <div class="single-stat">
                <p class='stat-left'>Strength: </p>
                <p>${Game.state.player.str}</p>
                `

                if (Game.state.player.availableSp > 0) {
                  str += `<button class='level-up-btn' onclick='Game.addStat("str")'>+</button>`
                }

              str += `
              <br/>
              </div>
              <div class="single-stat">
                <p class='stat-left'>Luck: </p>
                <p>${Game.state.player.luk}</p>

                `
                if (Game.state.player.availableSp > 0) {
                  str += `<button class='level-up-btn' onclick='Game.addStat("luk")'>+</button>`
                }

                str += `

              </div>

            </div>
          </div>
        </div>

        <p>Ore Clicks: ${Game.state.stats.oreClicks}</p>
        <p>Ore Crit Clicks: ${Game.state.stats.oreCritClicks} </p>
        <p>Rocks Destroyed: ${Game.state.stats.rocksDestroyed}</p>
        <p>Items Picked Up: ${Game.state.stats.itemsPickedUp}</p>

        <button onclick=Game.save()>Save</button>
        <button onclick=Game.wipe()>Wipe Save</button>
      `
    }
    s('.tab-content').innerHTML = str
  }

  Game.addStat = (stat) => {
    if (Game.state.player.availableSp > 0) {
      Game.state.player.availableSp--
      if (stat == 'str') Game.state.player.str++
      if (stat == 'luk') Game.state.player.luk++
      buildTabContent()
    }
  }

  let buyFunction = (item) => {
    if (item.functionName == 'MagnifyingGlass') {
      oreClickArea()
      Game.items.MagnifyingGlass.hidden = 3
      Game.state.items[0].hidden = 3
      if (Game.state.tabs[1].locked == true) {Game.state.tabs[1].locked = false;buildTabs();Game.switchTab(Game.selectedTab)}
    }
  }

  Game.items = []
  let Item = function(obj) {
    this.id = obj.id
    this.name = obj.name
    this.functionName = obj.functionName
    this.tab = obj.tab
    this.pic = obj.pic
    this.production = obj.production
    this.desc = obj.desc
    this.fillerQuote = obj.fillerQuote
    this.basePrice = obj.price
    this.price = obj.price
    this.owned = obj.owned
    this.hidden = obj.hidden

    this.buy = () => {
     if (Game.state.ores >= this.price) {
        spend(this.price)
        this.owned++
        Game.state.items[this.id].owned++
        playSound('buysound')
        this.price = this.basePrice * Math.pow(1.15, this.owned)
        Game.state.items[this.id].price = this.basePrice * Math.pow(1.15, this.owned)
        buyFunction(this)
        buildInventory()
        risingNumber(0, 'spendMoney')
        buildTabContent(Game.selectedTab)
      }
    }

    Game.items[this.functionName] = this
  }

  let generateStoreItems = () => {
    for (i = 0; i < Game.state.items.length; i++) {
      console.log(Game.state.items[i])
      new Item(Game.state.items[i])
    }
  }

  let soundPlayed1 = false
  let soundPlayed2 = false
  let soundPlayed3 = false
  let soundPlayed4 = false
  let soundPlayed5 = false
  let currentHp = Game.state.oreHp
  let whichPic = Math.floor(Math.random() * 4) + 1
  let updatePercentage = (amount) => {
    if (currentHp - amount > 0) {
      currentHp -= amount
      s('.ore-hp').innerHTML = `${((currentHp/Game.state.oreHp)*100).toFixed(0)}%`

      if (currentHp/Game.state.oreHp > .8 ) {
        s('.ore').style.background = `url("./assets/ore${whichPic}-1.png")`
        s('.ore').style.backgroundSize = 'cover'
      }
      if (currentHp/Game.state.oreHp <= .8 && soundPlayed1 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-2.png")`
        s('.ore').style.backgroundSize = 'cover'
        playSound('explosion')
        soundPlayed1 = true
      }
      if (currentHp/Game.state.oreHp <= .6 && soundPlayed2 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-3.png")`
        s('.ore').style.backgroundSize = 'cover'
        playSound('explosion')
        soundPlayed2 = true
      }
      if (currentHp/Game.state.oreHp <= .4 && soundPlayed3 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-4.png")`
        s('.ore').style.backgroundSize = 'cover'
        playSound('explosion')
        soundPlayed3 = true
      }
      if (currentHp/Game.state.oreHp <= .2 && soundPlayed4 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-5.png")`
        s('.ore').style.backgroundSize = 'cover'
        playSound('explosion')
        soundPlayed4 = true
      }
    } else {
      Game.state.stats.rocksDestroyed++
      playSound('explosion2')
      Game.state.oreHp = Math.pow(Game.state.oreHp, 1.15)
      console.log('hp', Game.state.oreHp)
      currentHp = Game.state.oreHp
      dropItem()
      s('.ore-hp').innerHTML = '100%'
      soundPlayed1 = false
      soundPlayed2 = false
      soundPlayed3 = false
      soundPlayed4 = false
      soundPlayed5 = false
      whichPic = Math.floor(Math.random() * 4) + 1
      s('.ore').style.background = `url("./assets/ore${whichPic}-1.png")`
      s('.ore').style.backgroundSize = 'cover'
    }
  }

  let oreClickArea = () => {
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

  let gainXp = () => {
    if (Game.state.player.currentXp < Game.state.player.xpNeeded) {
      Game.state.player.currentXp++
    } else {
      Game.state.player.currentXp = 0
      Game.state.player.lvl++
      Game.state.player.availableSp += 3
      playSound('levelup')
      Game.state.player.xpNeeded = Math.ceil(Math.pow(Game.state.player.xpNeeded, 1.05))
      setTimeout(() => {
        s('#stats-tab').style.boxShadow = 'none'
      }, 1000)
      s('#stats-tab').style.boxShadow = '0px 0px 50px yellow'
      risingNumber(0, 'level')
    }
    if (Game.state.player.availableSp > 0) {
      s('#stats-tab').innerHTML = 'stats [!]'
      s('#stats-tab').style.fontSize = 'x-large'
    } else {
      s('#stats-tab').innerHTML = 'stats'
      s('#stats-tab').style.fontSize = 'x-large'
    }
    buildInventory()
  }

  let risingNumber = (amount, type) => {
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

    if (type == 'crit') {
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

  let drawRockParticles = () => {
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
    let amt = calculateOPC()
    earn(amt)
    gainXp()
    risingNumber(amt)
    playSound('ore-hit')
    updatePercentage(amt)
    buildInventory()
    drawRockParticles()
  }

  s('.ore-click-area').onclick = () => {
    let amt = calculateOPC('crit')
    earn(amt)
    gainXp()
    risingNumber(amt, 'crit')
    playSound('ore-hit')
    updatePercentage(amt)
    buildInventory()
    drawRockParticles()
  }



  // INIT SHIT
  Game.load()
  buildInventory()
  generateStoreItems()
  buildTabs()
  Game.switchTab('store')
  setInterval(() => {
    gainXp()
    Game.state.stats.timePlayed++
    if (Game.selectedTab == 'stats') {
      buildTabContent()
    }
  }, 1000)
  updatePercentage(0)
  setInterval(() => {
    earnOPS()
  }, 1000 / 30)
  window.onresize = () => {
    if (Game.items.MagnifyingGlass.owned == 1 || Game.state.items[0].owned == 1) {
      oreClickArea()
    }
  }
}

window.onload = () => Game.launch()
