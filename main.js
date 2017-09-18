// Helper Shit

let s = ((el) => {return document.querySelector(el)})

let beautify = (num) => {

  if (num < 1000000) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //found on https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  } else {
    if (num >= 1000000 && num < 1000000000) {
      return (num/1000000).toFixed(3) + ' Million'
    }
    if (num >= 1000000000 && num < 1000000000000) {
      return (num/1000000000).toFixed(3) + ' Billion'
    }
    if (num >= 1000000000000 && num < 1000000000000000) {
      return (num/1000000000000).toFixed(3) + ' Trillion'
    }
    if (num >= 1000000000000000 && num < 1000000000000000000) {
      return (num/1000000000000000).toFixed(3) + ' Quadrillion'
    }
    if (num >= 1000000000000000000 && num < 1000000000000000000000) {
      return (num/1000000000000000000).toFixed(3) + ' Quintillion'
    }
    if (num >= 1000000000000000000000 && num < 1000000000000000000000000) {
      return (num/1000000000000000000000).toFixed(3) + ' Sextillion'
    }
  }
}

// Game

let Game = {}

Game.launch = () => {

  Game.state = {
    ores: 0,
    oreHp: 50,
    oreCurrentHp: 50,
    oresPerSecond: 0,
    opsMultiplier: 0,
    opcMultiplier: 0,
    oreClickMultiplier: 5,
    player: {
      lvl: 1,
      str: 0,
      dex: 0,
      luk: 0,
      int: 0,
      cha: 0,
      currentXp: 0,
      xpNeeded: 100,
      availableSp: 0,
      pickaxe: {
        name: 'Beginners Wood Pickaxe',
        rarity: 'Common',
        itemLevel: 1,
        material: 'Wood',
        damage: 1
      },
      accesory: {}
    },
    tabs: [
      {
        name: 'store',
        locked: false
      },
      // {
      //   name: 'stats',
      //   locked: false
      // }
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
  }

  Game.wipe = () => {
    localStorage.clear()
    location.reload()
  }

  Game.save = () => {
    localStorage.setItem('state', JSON.stringify(Game.state))
    for (i in Game.items) {
      localStorage.setItem(`item-${i}`, JSON.stringify(Game.items[i]))
    }
  }

  Game.load = () => {
    if (localStorage.getItem('state') !== null) {
      Game.state = JSON.parse(localStorage.getItem('state'))

      for (i in Game.items) {
        Game.items[i] = JSON.parse(localStorage.getItem(`item-${i}`))
      }

      generateStoreItems()
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
    buildInventory()
  }

  let earnOPS = () => {
    let ops = calculateOPS()
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
    // opc += (Game.state.player.pickaxe.damage * str) * .1
    opc += Math.pow(1.25, str)

    opc += (opc * Game.state.opcMultiplier)

    if (type == 'crit') {
      opc *= Game.state.oreClickMultiplier
    }

    return opc
  }

  let calculateOPS = () => {
    let ops = 0

    for (i in Game.items) {
      if (Game.items[i].type == 'item') {
        ops += Game.items[i].production * Game.items[i].owned
      }
    }

    ops += (ops * Game.state.opsMultiplier)

    Game.state.oresPerSecond = ops
    return ops
  }

  let dropItem = () => {
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign
    let randomY = Math.floor(Math.random() * 50) + 1
    let thisItemClicked = false
    let amountOfRocksDestroyed = Game.state.stats.rocksDestroyed
    let iLvl = amountOfRocksDestroyed

    if (Math.random() < .3 || amountOfRocksDestroyed <= 1) { // 30% chance
      let itemContainer = document.createElement('div')
      itemContainer.classList.add('item-container')
      itemContainer.innerHTML = `
        <div class="item-pouch-glow"></div>
        <div class="item-pouch-glow2"></div>
        <div class="item-pouch-glow3"></div>
      `
      let orePos = s('.ore').getBoundingClientRect()
      itemContainer.style.position = 'absolute'
      itemContainer.style.top = orePos.bottom + randomY + 'px'
      itemContainer.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'

      let item = document.createElement('div')
      item.classList.add('item-drop')
      item.style.position = 'relative'
      item.id = `item-${amountOfRocksDestroyed}`

      itemContainer.append(item)

      item.addEventListener('click', () => {
        s('.item-pouch-glow').style.display = 'none'
        s('.item-pouch-glow2').style.display = 'none'
        s('.item-pouch-glow3').style.display = 'none'
        item.style.pointerEvents = 'none'
        s('.item-drop').classList.add('item-pickup-animation')
        setTimeout(() => {
          itemContainer.remove()
          pickUpItem(iLvl)
        }, 800)
      })


      s('body').append(itemContainer)
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
    str += `Ores: ${beautify(Game.state.ores.toFixed(1))}`
    if (Game.state.oresPerSecond > 0) {
      str += ` (${beautify(Game.state.oresPerSecond.toFixed(1))}/s)`
    }
    s('.ores').innerHTML = str
    s('.level').innerHTML = `Level: ${Game.state.player.lvl} (${Game.state.player.currentXp}/${Game.state.player.xpNeeded})`
  }

  let buildStore = () => {
    let str = ''
    str += `
      <div class="upgrades-container">
    `
    let hasContent = 0
    for (i in Game.items) {
      let item = Game.items[i]
      if (item.type == 'upgrade') {
        if (item.hidden == 0) {
          hasContent = 1
          str += `
            <div class="upgrade-item-container" style='background-color: #b56535'>
              <div class="upgrade-item" onmouseover="Game.showTooltip('${i}')" onmouseout="Game.hideTooltip()" onclick='Game.items["${i}"].buy()' style='background: url(./assets/${item.pic}); background-size: 100%;'></div>
            </div>
          `
        }
      }
    }
    if (hasContent == 0) str += `<h3 style="text-align: center; width: 100%; opacity: .5">no upgrades available</h3>`
    str += `</div><div class="horizontal-separator" style='height: 8px;'></div>`

    for (i in Game.items) {
      let item = Game.items[i]
      if (item.type == 'item') {
        if (item.hidden == 0) {
          str += `
            <div class="button" onclick="Game.items['${i}'].buy()" onmouseover="Game.showTooltip('${i}', this)" onmouseout="Game.hideTooltip()">
              <div class="button-top">
                <div class="button-left">
                  <img src="./assets/${item.pic}" style='filter: brightness(100%); image-rendering: pixelated'/>
                </div>
                <div class="button-middle">
                  <h3 style='font-size: x-large'>${item.name}</h3>
                  <p>cost: ${beautify(item.price.toFixed(0))} ores</p>
                </div>
                <div class="button-right">
                  <p style='font-size: xx-large'>${item.owned}</p>
                </div>
              </div>
            </div>
          `
        }
        if (item.hidden == 1) {
          str += `
            <div class="button" style='cursor: not-allowed; box-shadow: 0 4px black; opacity: .7; filter: brightness(60%)'>
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
    s('.tab-content').innerHTML = str
    loadAd()
  }

  Game.statsVisable = false

  Game.buildStats = () => {
    let str = ''
    let inventoryPos = s('.inventory-section')
    let leftSeparatorPos = s('#left-separator')

    let statsContainer = s('.stats-container')
    statsContainer.style.top = inventoryPos.getBoundingClientRect().bottom + 10 + 'px'
    statsContainer.style.left = leftSeparatorPos.getBoundingClientRect().right + 'px'

    if (Game.statsVisable == true) {
      str += `
        <div class="stats-container-header" onclick='Game.toggleStats();'>
          <h4>stats</h4>
          <p class='caret' style='font-size: 8px; float: right; margin-right: 5px; transform: rotate(180deg)'>&#9660;</p>
        </div>
      `
    } else {
      str += `
        <div class="stats-container-header" onclick='Game.toggleStats()'>
          <h4>stats</h4>
          <p class='caret' style='font-size: 8px; float: right; margin-right: 5px';>&#9660;</p>
        </div>
      `
    }

    if (Game.statsVisable == true) {
      str += '<div class="stats-container-content-wrapper" style="height: 400px;">'
    } else {
      str += '<div class="stats-container-content-wrapper">'
    }

      str += `

        <div class="stats-container-content">

          <div class="stat-level-container">
            <h1 style='flex-grow: 1'>Level:</h1>
            <h1 class='stat-player-lvl'>${Game.state.player.lvl}</h1>
          </div>

          <hr/>

          <div class="single-stat">
            <p style='flex-grow: 1' onmouseover='Game.showTooltip(null, null, "stat", "str")' onmouseout='Game.hideTooltip()'>Strength:</p>
            <p class='stat-str'>${Game.state.player.str}</p>
            `
            if (Game.state.player.availableSp > 0) {
              str += `<button onclick='Game.addStat("str")' onmouseover='Game.showTooltip(null, null, "stat", "str")' onmouseout='Game.hideTooltip()'>+</button>`
            }

            str += `
          </div>

          <div class="single-stat">
            <p style='flex-grow: 1' onmouseover='Game.showTooltip(null, null, "stat", "dex")' onmouseout='Game.hideTooltip()'>Dexterity:</p>
            <p class='stat-dex'>${Game.state.player.dex}</p>
            `
            if (Game.state.player.availableSp > 0) {
              str += `<button onclick='Game.addStat("dex")' onmouseover='Game.showTooltip(null, null, "stat", "dex")' onmouseout='Game.hideTooltip()'>+</button>`
            }

            str += `
          </div>

          <div class="single-stat">
            <p style='flex-grow: 1' onmouseover='Game.showTooltip(null, null, "stat", "int")' onmouseout='Game.hideTooltip()'>Intelligence:</p>
            <p class='stat-int'>${Game.state.player.int}</p>
            `
            if (Game.state.player.availableSp > 0) {
              str += `<button onclick='Game.addStat("int")' onmouseover='Game.showTooltip(null, null, "stat", "int")' onmouseout='Game.hideTooltip()'>+</button>`
            }

            str += `
          </div>

          <div class="single-stat">
            <p style='flex-grow: 1' onmouseover='Game.showTooltip(null, null, "stat", "luk")' onmouseout='Game.hideTooltip()'>Luck:</p>
            <p class='stat-luk'>${Game.state.player.luk}</p>
            `
            if (Game.state.player.availableSp > 0) {
              str += `<button onclick='Game.addStat("luk")' onmouseover='Game.showTooltip(null, null, "stat", "luk")' onmouseout='Game.hideTooltip()'>+</button>`
            }

            str += `
          </div>

          <div class="single-stat">
            <p style='flex-grow: 1' onmouseover='Game.showTooltip(null, null, "stat", "cha")' onmouseout='Game.hideTooltip()'>Charisma:</p>
            <p class='stat-cha'>${Game.state.player.cha}</p>
            `
            if (Game.state.player.availableSp > 0) {
              str += `<button onclick='Game.addStat("cha")' onmouseover='Game.showTooltip(null, null, "stat", "cha")' onmouseout='Game.hideTooltip()'>+</button>`
            }

            str += `
          </div>

          <br/>

          <p style='text-align: center; font-size: small'>Available SP: ${Game.state.player.availableSp}</p>

          <hr/>
          <br/>

          <div style='width: 100%; border: 1px solid white; cursor: pointer; display: flex; flex-flow: row-nowrap; align-items: center; justify-content: center;'>
            <img src="./assets/lock.svg" alt="" height="30px" style='filter: invert(100%)'/>
            <p style='flex-grow: 1'>Classes lv. 10</p>
          </div>

          <br/>
          <hr/>
          <p>Miscellaneous</p>
          <p>Ore Clicks: ${Game.state.stats.oreClicks}</p>
          <p>Ore Crit Clicks: ${Game.state.stats.oreCritClicks}</p>
          <p>Rocks Destroyed: ${Game.state.stats.rocksDestroyed}</p>
          <p>Items Picked Up: ${Game.state.stats.itemsPickedUp}</p>
        </div>
      </div>
    `




    statsContainer.innerHTML = str
  }

  Game.toggleStats = () => {
    if (s('.stats-container-content-wrapper').style.height == 0 || s('.stats-container-content-wrapper').style.height == '0px') {
      s('.stats-container-content-wrapper').style.height = '400px';
      s('.caret').style.transform = 'rotate(180deg)'
      Game.statsVisable = true
    } else {
      s('.stats-container-content-wrapper').style.height = 0;
      s('.caret').style.transform = 'rotate(0deg)'
      Game.statsVisable = false
    }
  }

  Game.showTooltip = (itemName, anchorPoint, type, stat) => {
    let item;
    if (itemName) {
      item = Game.items[itemName]
    }
    let tooltip = s('.tooltip')
    let anchor = s('#main-separator').getBoundingClientRect()

    tooltip.classList.add('tooltip-container')
    tooltip.style.display = 'block'
    tooltip.style.width = '300px'
    tooltip.style.background = '#222'
    tooltip.style.border = '1px solid white'
    tooltip.style.color = 'white'
    tooltip.style.position = 'absolute'
    tooltip.style.left = anchor.left - tooltip.getBoundingClientRect().width + 'px'

    if (document.querySelector('#anchor-point')) {
      tooltip.style.top = s('#anchor-point').getBoundingClientRect().bottom + 'px'
    } else {
      tooltip.style.top = s('.stat-sheet').getBoundingClientRect().top + 'px'
    }

    if (anchorPoint) {
      tooltip.style.top = anchorPoint.getBoundingClientRect().top + 'px'
    }


    if (type == 'stat') {
      anchor = s('.stats-container-content-wrapper').getBoundingClientRect()
      tooltip.style.width = 'auto'
      tooltip.style.left = anchor.right + 'px'
      tooltip.style.top = event.clientY + 'px'

      if (stat == 'str') {
        tooltip.innerHTML = `
          <h3>Strength</h3>
          <hr/>
          <p>Increases your OpC</p>
        `
      }
      if (stat == 'dex') {
        tooltip.innerHTML = `
          <h3>Dexterity</h3>
          <hr/>
          <p>Increases your OpC slightly</p>
          <p>Chance for critical strikes</p>
        `
      }
      if (stat == 'int') {
        tooltip.innerHTML = `
          <h3>Intelligence</h3>
          <hr/>
          <p>Increases item output slightly</p>
          <p>Chance for critical strikes</p>
        `
      }
      if (stat == 'luk') {
        tooltip.innerHTML = `
          <h3>Luck</h3>
          <hr/>
          <p>Increases item rarity percentage</p>
          <p>Increases item drop chance</p>
        `
      }
      if (stat == 'cha') {
        tooltip.innerHTML = `
          <h3>Charisma</h3>
          <hr/>
          <p>Increases item output</p>
          <p>Lowers shop prices</p>
        `
      }
    } else {
      tooltip.innerHTML = `
      <div class="tooltip-top">
        <img src="./assets/${item.pic}" height='40px' alt="" />
        <h3 style='flex-grow: 1'>${item.name}</h3>
        <p>${beautify(item.price.toFixed(0))} ores</p>
      </div>
      <div class="tooltip-bottom">
        <hr />
        <p>${item.desc}</p>

        `

        if (item.type == 'item') {
          if (item.owned > 0) {
            tooltip.innerHTML += `
              <hr />
              <p>Each ${item.name} generates ${beautify(item.production)} OpS</p>
              <p><span class='bold'>${item.owned}</span> ${item.name} generating <span class='bold'>${beautify((item.production * item.owned).toFixed(1))}</span> ores per second</p>
            `
          }
        }

        tooltip.innerHTML += `

      </div>
    `
    }
  }

  Game.hideTooltip = () => {
    s('.tooltip').style.display = 'none'
  }

  Game.addStat = (stat) => {
    if (Game.state.player.availableSp > 0) {
      Game.state.player.availableSp--
      if (stat == 'str') Game.state.player.str++
      if (stat == 'luk') Game.state.player.luk++
      if (stat == 'dex') Game.state.player.dex++
      if (stat == 'int') Game.state.player.int++
      if (stat == 'cha') Game.state.player.cha++
      Game.buildStats()
      if (Game.state.player.availableSp == 0) {
        Game.hideTooltip()
      }
    }
  }

  let unlockUpgrades = (name) => {
    let upgrade = Game.items[name]
    if (upgrade.owned <= 0) {
      if (upgrade.hidden != 0) {
        upgrade.hidden = 0
        buildStore()
      }
    }
  }

  let adsLoaded = false
  let loadAd = () => {
    if (adsLoaded == false) {
      adsLoaded = true
      for (i = 0; i < 3; i++) {
        let script = document.createElement('script')
        script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        let ins = document.createElement('ins')
        ins.classList.add('adsbygoogle')
        ins.style.display = 'block'
        ins.setAttribute('data-ad-client', 'ca-pub-4584563958870163')
        ins.setAttribute('data-ad-slot', '6565116738')

        let div = s('#ads-im-sorry-please-dont-hate-me')
        div.append(script)
        div.append(ins)

        if (s('ins').style.display == 'block') {
          ins.setAttribute('data-ad-format', 'rectangle, horizontal');
          (adsbygoogle = window.adsbygoogle || []).push({});
        }
      s('.tab-content-container').append(div)
      }
    }
  }

  let buyFunction = (item) => {
    // ITEMS
    if (item.name == 'Magnifying Glass') {
      oreClickArea()
      item.hidden = 2
      unlockUpgrades('CleanMagnifyingGlass')
    }
    if (item.name == 'School') {
      if (item.owned == 1) {
        Game.items['Farm'].hidden = 0
        Game.items['Quarry'].hidden = 1
        Game.items['Church'].hidden = 1
      }
    }
    if (item.name == 'Farm') {
      if (item.owned == 1) {
        Game.items['Quarry'].hidden = 0
        Game.items['Church'].hidden = 1
        Game.items['Factory'].hidden = 1
      }
    }
    if (item.name == 'Quarry') {
      if (item.owned == 1) {
        Game.items['Church'].hidden = 0
        Game.items['Factory'].hidden = 1
        Game.items['Crypt'].hidden = 1
      }
    }
    if (item.name == 'Church') {
      if (item.owned == 1) {
        Game.items['Factory'].hidden = 0
        Game.items['Crypt'].hidden = 1
        Game.items['Hospital'].hidden = 1
      }
    }
    if (item.name == 'Factory') {
      if (item.owned == 1) {
        Game.items['Crypt'].hidden = 0
        Game.items['Hospital'].hidden = 1
        Game.items['Citadel'].hidden = 1
      }
    }
    if (item.name == 'Crypt') {
      if (item.owned == 1) {
        Game.items['Hospital'].hidden = 0
        Game.items['Citadel'].hidden = 1
        Game.items['XenoSpaceship'].hidden = 1
      }
    }
    if (item.name == 'Hospital') {
      if (item.owned == 1) {
        Game.items['Citadel'].hidden = 0
        Game.items['XenoSpaceship'].hidden = 1
        Game.items['SkyCastle'].hidden = 1
      }
    }
    if (item.name == 'Citadel') {
      if (item.owned == 1) {
        Game.items['XenoSpaceship'].hidden = 0
        Game.items['SkyCastle'].hidden = 1
        Game.items['EonPortal'].hidden = 1
      }
    }
    if (item.name == 'Xeno Spaceship') {
      if (item.owned == 1) {
        Game.items['SkyCastle'].hidden = 0
        Game.items['EonPortal'].hidden = 1
        Game.items['SacredMines'].hidden = 1
      }
    }
    if (item.name == 'Sky Castle') {
      if (item.owned == 1) {
        Game.items['EonPortal'].hidden = 0
        Game.items['SacredMines'].hidden = 1
        Game.items['O.A.R.D.I.S.'].hidden = 1
      }
    }
    if (item.name == 'Eon Portal') {
      if (item.owned == 1) {
        Game.items['SacredMines'].hidden = 0
        Game.items['O.A.R.D.I.S.'].hidden = 1
      }
    }
    if (item.name == 'Sacred Mines') {
      if (item.owned == 1) {
        Game.items['O.A.R.D.I.S.'].hidden = 0
      }
    }


    // ITEM UPGRADES
    if (item.name == 'Clean Magnifying Glass') {
      item.hidden = 1
      Game.state.oreClickMultiplier = 10
    }

    // UPGRADES
    if (item.name == 'Work Boots') {
      item.hidden = 1
      Game.state.opsMultiplier += .1
      Game.state.opcMultiplier += .1
    }
    if (item.name == 'Painkillers') {
      item.hidden = 1
      Game.state.opcMultiplier += 2
      Game.items['Steroids'].hidden = 0
    }
    if (item.name == 'Steroids') {
      item.hidden = 1
      Game.state.opcMultiplier += 2
    }
  }

  let Item = function(obj, id) {
    // this.id = id
    this.name = obj.name
    this.functionName = obj.name.replace(/ /g, '')
    this.type = obj.type
    this.pic = obj.pic
    this.production = obj.production || 0
    this.desc = obj.desc
    this.fillerQuote = obj.fillerQuote
    this.basePrice = obj.basePrice
    this.price = obj.price
    this.hidden = obj.hidden
    this.owned = obj.owned || 0

    this.buy = () => {
      if (Game.state.ores >= this.price) {
        spend(this.price)
        this.owned++
        playSound('buysound')
        this.price = this.basePrice * Math.pow(1.15, this.owned)
        buyFunction(this)
        if (this.type == 'upgrade') {
          Game.hideTooltip()
        }
        buildInventory()
        risingNumber(0, 'spendMoney')
        generateStoreItems()
        buildStore()
      }
    }

    Game.items[this.functionName] = this
  }

  Game.items = []
  // ITEMS
  Game.items['MagnifyingGlass'] = {
    name: 'Magnifying Glass',
    type: 'item',
    pic: 'magnifying-glass.png',
    desc: 'Allows you to spot weakpoints inside the rock',
    fillerQuote: 'wip',
    price: 1,
    basePrice: 1,
    hidden: 0
  }
  Game.items['School'] = {
    name: 'School',
    type: 'item',
    pic: 'wip.png',
    production: .3,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 6,
    basePrice: 6,
    hidden: 0
  }
  Game.items['Farm'] = {
    name: 'Farm',
    type: 'item',
    pic: 'farmer.png',
    production: 1,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 75,
    basePrice: 75,
    hidden: 1
  }
  Game.items['Quarry'] = {
    name: 'Quarry',
    type: 'item',
    pic: 'wip.png',
    production: 21,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 1200,
    basePrice: 1200,
    hidden: 1
  }
  Game.items['Church'] = {
    name: 'Church',
    type: 'item',
    pic: 'wip.png',
    production: 300,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 6660,
    basePrice: 6660,
    hidden: 2
  }
  Game.items['Factory'] = {
    name: 'Factory',
    type: 'item',
    pic: 'wip.png',
    production: 5500,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 48000,
    basePrice: 48000,
    hidden: 2
  }
  Game.items['Crypt'] = {
    name: 'Crypt',
    type: 'item',
    pic: 'wip.png',
    production: 30000,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 290000,
    basePrice: 290000,
    hidden: 2
  }
  Game.items['Hospital'] = {
    name: 'Hospital',
    type: 'item',
    pic: 'wip.png',
    production: 220000,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 1000000,
    basePrice: 1000000,
    hidden: 2
  }
  Game.items['Citadel'] = {
    name: 'Citadel',
    type: 'item',
    pic: 'wip.png',
    production: 1666666,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 66666666,
    basePrice: 66666666,
    hidden: 2
  }
  Game.items['XenoSpaceship'] = {
    name: 'Xeno Spaceship',
    type: 'item',
    pic: 'wip.png',
    production: 45678910,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 758492047,
    basePrice: 758492047,
    hidden: 2
  }
  Game.items['SkyCastle'] = {
    name: 'Sky Castle',
    type: 'item',
    pic: 'wip.png',
    production: 777777777,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 5500000000,
    basePrice: 5500000000,
    hidden: 2
  }
  Game.items['EonPortal'] = {
    name: 'Eon Portal',
    type: 'item',
    pic: 'wip.png',
    production: 8888800000,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 79430000000,
    basePrice: 79430000000,
    hidden: 2
  }
  Game.items['SacredMines'] = {
    name: 'Sacred Mines',
    type: 'item',
    pic: 'wip.png',
    production: 40501030500,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 300000000000,
    basePrice: 300000000000,
    hidden: 2
  }
  Game.items['O.A.R.D.I.S.'] = {
    name: 'O.A.R.D.I.S.',
    type: 'item',
    pic: 'wip.png',
    production: 110100110110,
    desc: 'wip',
    fillerQuote: 'wip',
    price: 9999999999999,
    basePrice: 9999999999999,
    hidden: 2
  }

  // ITEM UPGRADES
  Game.items['CleanMagnifyingGlass'] = {
    name: 'Clean Magnifying Glass',
    type: 'upgrade',
    pic: 'clean-magnifying-glass.png',
    desc: 'Increases critical hit multiplier to 10x',
    fillerQuote: 'wip',
    price: 100,
    hidden: 1,
  }


  // UPGRADES
  Game.items['WorkBoots'] = {
    name: 'Work Boots',
    type: 'upgrade',
    pic: 'wip.png',
    desc: 'Increase all ore production by 1%',
    fillerQuote: 'wip',
    price: 500,
    hidden: 1,
  }
  Game.items['Painkillers'] = {
    name: 'Painkillers',
    type: 'upgrade',
    pic: 'painkillers.png',
    desc: 'double your OpC',
    fillerQuote: 'wip',
    price: 15000,
    hidden: 1,
  }
  Game.items['Steroids'] = {
    name: 'Steroids',
    type: 'upgrade',
    pic: 'steroids.png',
    desc: 'double your OpC',
    fillerQuote: 'wip',
    price: 1000000,
    hidden: 1,
  }

  let generateStoreItems = () => {
    for (i in Game.items) {
      new Item(Game.items[i])
    }
  }

  let soundPlayed1 = false
  let soundPlayed2 = false
  let soundPlayed3 = false
  let soundPlayed4 = false
  let soundPlayed5 = false
  let whichPic = Math.floor(Math.random() * 4) + 1
  let updatePercentage = (amount) => {
    if (Game.state.oreCurrentHp - amount > 0) {
      Game.state.oreCurrentHp -= amount
      s('.ore-hp').innerHTML = `${((Game.state.oreCurrentHp/Game.state.oreHp)*100).toFixed(0)}%`

      if (Game.state.oreCurrentHp/Game.state.oreHp > .8 ) {
        s('.ore').style.background = `url("./assets/ore${whichPic}-1.png")`
        s('.ore').style.backgroundSize = 'cover'
      }
      if (Game.state.oreCurrentHp/Game.state.oreHp <= .8 && soundPlayed1 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-2.png")`
        s('.ore').style.backgroundSize = 'cover'
        playSound('explosion')
        soundPlayed1 = true
      }
      if (Game.state.oreCurrentHp/Game.state.oreHp <= .6 && soundPlayed2 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-3.png")`
        s('.ore').style.backgroundSize = 'cover'
        playSound('explosion')
        soundPlayed2 = true
      }
      if (Game.state.oreCurrentHp/Game.state.oreHp <= .4 && soundPlayed3 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-4.png")`
        s('.ore').style.backgroundSize = 'cover'
        playSound('explosion')
        soundPlayed3 = true
      }
      if (Game.state.oreCurrentHp/Game.state.oreHp <= .2 && soundPlayed4 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-5.png")`
        s('.ore').style.backgroundSize = 'cover'
        playSound('explosion')
        soundPlayed4 = true
      }
    } else {
      Game.state.stats.rocksDestroyed++
      playSound('explosion2')
      Game.state.oreHp = Math.pow(Game.state.oreHp, 1.15)
      Game.state.oreCurrentHp = Game.state.oreHp
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

  let gainXp = (amt) => {
    let amount = 1
    if (amt) {
      amount = 2
    }
    if (Game.state.player.currentXp < Game.state.player.xpNeeded) {
      Game.state.player.currentXp += amount
    } else {
      Game.state.player.currentXp = 0
      Game.state.player.lvl++
      Game.state.player.availableSp += 3
      Game.buildStats()
      playSound('levelup')
      Game.state.player.xpNeeded = Math.ceil(Math.pow(Game.state.player.xpNeeded, 1.05))
      risingNumber(0, 'level')
    }
    buildInventory()
  }

  let risingNumber = (amount, type) => {
    let mouseX = (s('.ore').getBoundingClientRect().left + s('.ore').getBoundingClientRect().right)/2
    let mouseY = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom)/2
    if (event) {
      mouseX = event.clientX
      mouseY = event.clientY
    }
    let randomNumber = Math.floor(Math.random() * 20) + 1
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomMouseX = mouseX + (randomNumber * randomSign)

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
    Game.state.stats.oreClicks++
    if (Game.statsVisable) Game.buildStats()
    if (Game.state.stats.oreClicks >= 10 ) unlockUpgrades('WorkBoots')
    if (Game.state.stats.oreClicks >= 100) unlockUpgrades('Painkillers')
    if (document.querySelector('.click-me-container')) {
      s('.click-me-container').remove()
    }
  }

  s('.ore-click-area').onclick = () => {
    let amt = calculateOPC('crit')
    Game.state.stats.oreClicks++
    Game.state.stats.oreCritClicks++
    earn(amt)
    gainXp(3)
    risingNumber(amt, 'crit')
    playSound('ore-crit-hit')
    updatePercentage(amt)
    buildInventory()
    drawRockParticles()
    oreClickArea()
  }

  // INIT SHIT
  buildInventory()
  Game.buildStats()
  generateStoreItems()
  buildStore()
  Game.load()
  Game.buildStats()
  setInterval(() => {
    gainXp()
    Game.state.stats.timePlayed++
  }, 1000)
  setInterval(() => {
    Game.save()
  }, 1000 * 30)
  updatePercentage(0)
  setInterval(() => {
    earnOPS()
  }, 1000 / 30)
  window.onresize = () => {
    if (Game.items['MagnifyingGlass'].owned > 0) {
      oreClickArea()
    }
  }
  if (Game.state.stats.oreClicks == 0) {
    let clickMeContainer = s('.click-me-container')
    let orePos = s('.ore').getBoundingClientRect()
    clickMeContainer.style.top = (orePos.top + orePos.bottom)/2 + 'px'
    clickMeContainer.innerHTML = `
      <div class="click-me-left">
        <p style='text-align: center;'>Click me!</p>
      </div>
      <div class="click-me-right"></div>
    `
    clickMeContainer.style.left = orePos.left - clickMeContainer.getBoundingClientRect().width + 'px'
    s('body').append(clickMeContainer)
  }
  if (Game.items['MagnifyingGlass'].owned > 0) oreClickArea()
}

window.onload = () => {
  Game.launch();
}

