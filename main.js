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

let beautifyTime = (num) => {

  let hours = Math.floor(num / 3600);
  num %= 3600;
  let minutes = Math.floor(num / 60);
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  let seconds = num % 60;
  if (seconds < 10) {
    seconds = '0' + seconds
  }

  return hours + ":" + minutes + ":" + seconds
}

// Game

let Game = {}

Game.launch = () => {

  Game.state = {
    refinedOres: 0,
    ores: 0,
    oreHp: 50,
    oreCurrentHp: 50,
    oresPerSecond: 0,
    opsMultiplier: 0,
    opcMultiplier: 0,
    critHitMultiplier: 2,
    weakHitMultiplier: 5,
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
      specialization: null,
      specializationLv: 1,
      specializationXp: 0,
      specializationXpNeeded: 300,
      specializationXpStored: 1000000,
      specializationSp: 1,
      pickaxe: {
        name: 'Beginners Wood Pickaxe',
        rarity: 'Common',
        itemLevel: 1,
        material: 'Wood',
        damage: 1,
      },
      accesory: {}
    },
    stats: {
      totalOresMined: 0,
      totalOresSpent: 0,
      oreClicks: 0,
      critHits: 0,
      weakSpotHits: 0,
      megaHits: 0,
      rocksDestroyed: 0,
      itemsPickedUp: 0,
      timePlayed: 0,
      highestCombo: 0,
      currentCombo: 0,
      timesRefined: 0,
    },
    currentVersion: '0.6.7',
    settings: {
      volume: .5,
      rockParticles: true,
      risingNumbers: true,
      scrollingText: true
    },
    canRefine: true,
    refineTimer: 10800 // 3 hours in seconds
  }

  let generateStoreItems = () => {
    for (i in Game.items) {
      new Item(Game.items[i])
    }
  }

  let resetItems = () => {
    Game.items = []
    /* ITEMS */
    Game.items['School'] = { name: 'School', type: 'item', pic: 'school.png', production: .3, desc: 'Teach students about ores', fillerQuote: 'Jesus Christ Marie, they\'re minerals!', price: 6, basePrice: 6, hidden: 0}
    Game.items['Farm'] = { name: 'Farm', type: 'item', pic: 'farm.png', production: 1, desc: 'Cultivate the lands for higher quality ores', fillerQuote: 'This totally makes sense.', price: 75, basePrice: 75, hidden: 1}
    Game.items['Quarry'] = { name: 'Quarry', type: 'item', pic: 'quarry.png', production: 21, desc: 'Designated mining area', fillerQuote: 'mine mine mine', price: 1200, basePrice: 1200, hidden: 1}
    Game.items['Church'] = { name: 'Church', type: 'item', pic: 'church.png', production: 300, desc: 'Praise to the Ore Gods', fillerQuote: 'In Ore name we pray, Amen.', price: 6660, basePrice: 6660, hidden: 2}
    Game.items['Factory'] = { name: 'Factory', type: 'item', pic: 'factory.png', production: 5500, desc: 'Manufacture your ores', fillerQuote: 'Assembly line this sh&* up!', price: 48000, basePrice: 48000, hidden: 2}
    Game.items['Crypt'] = { name: 'Crypt', type: 'item', pic: 'crypt.png', production: 30000, desc: 'Raise dead ores from the graves', fillerQuote: 'spooky ores', price: 290000, basePrice: 290000, hidden: 2}
    Game.items['Hospital'] = { name: 'Hospital', type: 'item', pic: 'hospital.png', production: 220000, desc: 'Heal your damaged ores', fillerQuote: 'An apple a day keeps the ore cancer away', price: 1000000, basePrice: 1000000, hidden: 2}
    // Game.items['Laboratory']
    Game.items['Citadel'] = { name: 'Citadel', type: 'item', pic: 'citadel.png', production: 1666666, desc: 'wip', fillerQuote: 'wip', price: 66666666, basePrice: 66666666, hidden: 2}
    Game.items['XenoSpaceship'] = { name: 'Xeno Spaceship', type: 'item', pic: 'xeno-spaceship.png', production: 45678910, desc: 'wip', fillerQuote: 'wip', price: 758492047, basePrice: 758492047, hidden: 2}
    Game.items['SkyCastle'] = { name: 'Sky Castle', type: 'item', pic: 'wip.png', production: 777777777, desc: 'wip', fillerQuote: 'wip', price: 5500000000, basePrice: 5500000000, hidden: 2}
    Game.items['EonPortal'] = { name: 'Eon Portal', type: 'item', pic: 'wip.png', production: 8888800000, desc: 'wip', fillerQuote: 'wip', price: 79430000000, basePrice: 79430000000, hidden: 2}
    Game.items['SacredMines'] = { name: 'Sacred Mines', type: 'item', pic: 'wip.png', production: 40501030500, desc: 'wip', fillerQuote: 'wip', price: 300000000000, basePrice: 300000000000, hidden: 2}
    Game.items['O.A.R.D.I.S.'] = { name: 'O.A.R.D.I.S.', type: 'item', pic: 'wip.png', production: 110100110110, desc: 'wip', fillerQuote: 'wip', price: 9999999999999, basePrice: 9999999999999, hidden: 2}

    /* ITEM UPGRADES */
    Game.items['MagnifyingGlass'] = { name: 'Magnifying Glass', type: 'upgrade', pic: 'magnifying-glass.png', desc: 'Allows you to spot weakpoints inside the rock', fillerQuote: 'These sure will help...', price: 1, basePrice: 1, hidden: 1}
    Game.items['CleanMagnifyingGlass'] = { name: 'Clean Magnifying Glass', type: 'upgrade', pic: 'clean-magnifying-glass.png', desc: 'Increases critical hit multiplier to 10x', fillerQuote: 'wip', price: 100, hidden: 1,}
    Game.items['PolishMagnifyingGlass'] = { name: 'Polish Magnifying Glass', type: 'upgrade', pic: 'wip.png', desc: 'Increases critical hit multiplier to 15x', fillerQuote: 'wip', price: 50000, hidden: 1,}
    Game.items['CompositionNotebooks'] = { name: 'Composition Notebooks', type: 'upgrade', pic: 'compositionnotebook.png', desc: 'Doubles the production of Schools', fillerQuote: 'wip', price: 80, hidden: 1}
    Game.items['ManureSpreader'] = { name: 'Manure Spreader', type: 'upgrade', pic: 'manure-spreader.png', desc: 'Doubles the production of Farms', fillerQuote: 'wip', price: 950, hidden: 1}
    Game.items['Headlights'] = { name: 'Headlights', type: 'upgrade', pic: 'headlights.png', desc: 'Doubles the production of Quarrys', fillerQuote: 'wip', price: 19000, hidden: 1}
    Game.items['ScriptureReading'] = { name: 'Scripture Reading', type: 'upgrade', pic: 'scripture-reading.png', desc: 'Doubles the production of Churches', fillerQuote: 'wip', price: 300000, hidden: 1}
    // Metal Detector
    Game.items['RubberConveryorBelts'] = { name: 'Rubber Converyor Belts', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Factories', fillerQuote: 'wip', price: 300000, hidden: 1}
    Game.items['MetalSarcophagus'] = { name: 'Metal Sarcophagus', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Crypt', fillerQuote: 'wip', price: 5200000, hidden: 1}
    Game.items['ImmunizationShots'] = { name: 'Immunization Shots', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Hospitals', fillerQuote: 'wip', price: 10000000, hidden: 1}
    Game.items['CouncilOfRocks'] = { name: 'Council Of Rocks', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Citadel', fillerQuote: 'wip', price: 400000000, hidden: 1}
    Game.items['JetFuel'] = { name: 'Jet Fuel', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Xeno Spaceships', fillerQuote: 'wip', price: 5500000000, hidden: 1}
    Game.items['GoldenEggs'] = { name: 'Golden Eggs', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Sky Castles', fillerQuote: 'wip', price: 95000000000, hidden: 1}
    Game.items['GreenGoop'] = { name: 'Green Goop', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Eon Portals', fillerQuote: 'wip', price: 150000000000, hidden: 1}
    Game.items['UnholyMineshaft'] = { name: 'Unholy Mineshaft', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Sacred Mines', fillerQuote: 'wip', price: 2200000000000, hidden: 1}
    Game.items['OARDISupgrade'] = { name: 'OARDISupgrade', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of OARDIS ', fillerQuote: 'wip', price: 50000000000000, hidden: 1}

    // UPGRADES
    Game.items['WorkBoots'] = {name: 'Work Boots', type: 'upgrade', pic: 'workboots.png', desc: 'Increase all ore production by 1%', fillerQuote: 'wip', price: 500, hidden: 1}
    Game.items['Painkillers'] = {name: 'Painkillers', type: 'upgrade', pic: 'painkillers.png', desc: 'double your OpC', fillerQuote: 'wip', price: 15000, hidden: 1}
    Game.items['Steroids'] = {name: 'Steroids', type: 'upgrade', pic: 'steroids.png', desc: 'double your OpC', fillerQuote: 'wip', price: 1000000, hidden: 1}
    Game.items['Flashlight'] = {name: 'Flashlight', type: 'upgrade', pic: 'wip.png', desc: 'Gain 10% of your OpS as OpC', fillerQuote: 'wip', price: 50000, hidden: 1}

    generateStoreItems()
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
    localStorage.setItem('skills', JSON.stringify(Game.skills))
    let cookie = btoa(JSON.stringify(Game.state))

  }

  Game.load = () => {
    if (localStorage.getItem('state') !== null) {
      Game.state = JSON.parse(localStorage.getItem('state'))

      for (i in Game.items) {
        Game.items[i] = JSON.parse(localStorage.getItem(`item-${i}`))
      }

      Game.skills = JSON.parse(localStorage.getItem('skills'))

      generateStoreItems()
    }
  }

  let playSound = (snd) => {
    let sfx = new Audio(`./assets/${snd}.wav`)
    sfx.volume = Game.state.settings.volume
    sfx.play()
  }

  let earn = (amt) => {
    Game.state.ores += amt
    Game.state.stats.totalOresMined += amt
    buildInventory()

    if (Game.state.ores >= 10000) unlockUpgrades('Flashlight')
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

    // IF PICKAXE HAS STRENGTH
    if (Game.state.player.pickaxe.prefixStat) {
      if (Game.state.player.pickaxe.prefixStat == 'Strength') {
        // pickaxeStr = Game.state.player.pickaxe.prefixStatVal
        opc += Math.pow(1.2, Game.state.player.pickaxe.prefixStatVal)
      }
    }

    // ADD DAMAGE FROM PICKAXE
    opc += Game.state.player.pickaxe.damage

    // ADD DAMAGE FROM PLAYER STRENGTH
    let playerStr = Game.state.player.str
    if (Game.skills['WeightLifting'].lv > 0) { // WEIGHT LIFTING SKILL
      playerStr += playerStr * (Game.skills['WeightLifting'].current * .01)
    }

    if (playerStr > 0) opc += Math.pow(1.25, playerStr)


    // ADD DAMAGE FROM PLAYER DEX
    let playerDex = Game.state.player.dex
    if (Game.skills['Conditioning'].lv > 0) { // Conditioning SKILL
      playerDex += playerDex * (Game.skills['Conditioning'].current * .01)
    }

    if (playerDex > 0) opc += Math.pow(1.1, playerDex)

    // ADD OpC MULTIPLIERS
    opc += (opc * Game.state.opcMultiplier)

    if (Game.items['Flashlight'].owned > 0) {
      let ops = calculateOPS() * .01
      opc += ops
    }


    if (type == 'weak-hit') {
      opc *= Game.state.weakHitMultiplier
    }

    if (type == 'crit-hit') {
      opc *= Game.state.critHitMultiplier
    }

    if (Game.skills['RoidRage'].inUse == true) {
      opc *= Game.skills['RoidRage'].current
    }

    if (opc >= 1000000) winAchievement('Still A Baby')
    if (opc >= 1000000000) winAchievement('Getting There')
    if (opc >= 1000000000000) winAchievement('Big Boy')

    return opc
  }

  let calculateOPS = () => {
    let ops = 0

    for (i in Game.items) {
      if (Game.items[i].type == 'item') {
        ops += Game.items[i].production * Game.items[i].owned
        ops += (Game.items[i].production * Game.items[i].owned) * (Game.state.player.int * .01)
        ops += (Game.items[i].production * Game.items[i].owned) * (Game.state.player.cha * .05)
      }
    }

    ops += (ops * Game.state.opsMultiplier)

    Game.state.oresPerSecond = ops

    if (ops >= 401000) winAchievement('401K')
    if (ops >= 5000000) winAchievement('Retirement Plan')
    if (ops >= 5000000000) winAchievement('Hedge Fund')

    return ops
  }

  let dropItem = () => {
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign
    let randomY = Math.floor(Math.random() * 50) + 1
    let thisItemClicked = false
    let amountOfRocksDestroyed = Game.state.stats.rocksDestroyed
    let iLvl = amountOfRocksDestroyed

    // CALCULATES DROP CHANCE
    let itemDropChance = .3 // 30%
    if (Game.state.player.int > 0) {
      itemDropChance += Game.state.player.int / (Game.state.player.int + 30)
    }
    if (Game.state.player.luk > 0) {
      itemDropChance += Game.state.player.int / (Game.state.player.int + 20)
    }

    // IF ITEM DROPS CREATE A CONTAINER
    if (Math.random() < itemDropChance || amountOfRocksDestroyed <= 1) {
      let itemContainer = document.createElement('div')
      itemContainer.classList.add('item-container')
      itemContainer.id = `item-${amountOfRocksDestroyed}`
      itemContainer.innerHTML = `
        <div class="item-pouch-glow"></div>
        <div class="item-pouch-glow2"></div>
        <div class="item-pouch-glow3"></div>
      `


      // POSITION ITEM CONTAINER NEAR ORE
      let orePos = s('.ore').getBoundingClientRect()
      itemContainer.style.position = 'absolute'
      itemContainer.style.top = orePos.bottom + randomY + 'px'
      itemContainer.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'

      // MAKE ITEM
      let item = document.createElement('div')
      item.classList.add('item-drop')
      item.style.position = 'relative'
      item.id = `item-${amountOfRocksDestroyed}`

      itemContainer.append(item)

      s('body').append(itemContainer)


      item.addEventListener('click', () => {
        let id = item.id
        item.style.pointerEvents = 'none'
        s(`#${id}`).classList.add('item-pickup-animation')
        setTimeout(() => {
          let items = document.querySelectorAll(`#${id}`)
          items.forEach((item) => {
            item.remove()
          })
          pickUpItem(iLvl)
        }, 800)
      })
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
                  <p>${Game.newItem.prefixStat}: ${Game.newItem.prefixStatVal}</p>
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
    if (Game.state.stats.timesRefined > 0) {
      str += `<br/> Refined Ores: ${Game.state.refinedOres}`
    }

    s('.ores').innerHTML = str

    let lvlStr = ''
    lvlStr += `Level: ${Game.state.player.lvl} (${Game.state.player.currentXp}/${Game.state.player.xpNeeded})`
    if (Game.state.player.specialization != null) {
      lvlStr += `<br/> ${Game.state.player.specialization} Level: ${Game.state.player.specializationLv} (${Game.state.player.specializationXp.toFixed(0)}/${Game.state.player.specializationXpNeeded.toFixed(0)})`
    }


    s('.level').innerHTML = lvlStr
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
      str += '<div class="stats-container-content-wrapper" style="height: 370px;">'
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
            <p class='stat-str'>${Game.state.player.str}`
              if (Game.state.player.pickaxe.prefixStat) {
                if (Game.state.player.pickaxe.prefixStat == 'Strength') {
                  str += `(${Game.state.player.pickaxe.prefixStatVal})`
                }
              }

            str += `</p>
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

          `

          if (Game.state.player.specialization == null) { // IF THERE IS NO SPECIALIZATION
            if (Game.state.player.lvl < 5) { // IF LESS THAN LV 5
              str += `
                <br/>
                <button class='specialization-btn' onmouseover='Game.showTooltip(null, null, "stat", "spec")' onmouseout='Game.hideTooltip()'>???</button>
                <br/>
              `
            } else {
              str += `
                <br/>
                <button class='specialization-btn' onclick='Game.showSpecialization()'>Specialization</button>
                <br/>
              `
            }
          } else { // IF THERE IS A SPECIALIZATION
            let timeLeft = beautifyTime(Game.state.refineTimer)
            str += `
              <h2 style='text-align: center; cursor: pointer; padding: 5px 0;' onclick='Game.specializationSkills()'>${Game.state.player.specialization} &nbsp; &rsaquo;</h2>
              <hr/>
              <div class="single-stat">
                <p style='flex-grow: 1'>Level:</p>
                <p>${Game.state.player.specializationLv}</p>
              </div>
              <div class="single-stat">
                <p style='flex-grow: 1'>XP until next lv:</p>
                <p>${Math.floor(Game.state.player.specializationXpNeeded - Game.state.player.specializationXp)}</p>
              </div>
              <div class="single-stat">
                <p style='flex-grow: 1'>XP on refine:</p>
                <p class='specialization-xp-stored'>${Game.state.player.specializationXpStored}</p>
              </div>
              <br/>`

              if (Game.state.canRefine == true) {
                str += `
                  <button class='specialization-btn' onclick='Game.confirmRefine()'>Refine</button>
                `
              } else {
                str += `
                  <button id='not-allowed' class='specialization-btn' onclick='Game.confirmRefine()'>Refine ${timeLeft}</button>
                `
              }
          }
          str += `
        </div>
      </div>
    `




    statsContainer.innerHTML = str
  }

  Game.showSpecialization = () => {
    let div = document.createElement('div')
    div.classList.add('specialization-wrapper')
    div.innerHTML = `
      <h1>Choose a Specialization</h1>
      <div class="specialization-container">
        <div class="specialization-prospector specialization" onclick='Game.chooseSpecialization("Prospector")'>
          <div class="prospector-txt specialization-txt">
            <h3>Prospector</h3>
            <p>-text about how being a prospector is great-</p>
            <p>Skills for more OpC and extra bonuses in game</p>
            <p>(For players that are more active in games)</p>
          </div>
        </div>
        <div class="specialization-manager specialization"'>
          <div class="manager-txt specialization-txt">
            <h3>Manager</h3>
            <p>-NOT IMPLEMENTED YET-</p>
          </div>
        </div>
      </div>
    `

    s('body').append(div)
  }

  Game.chooseSpecialization = (sel) => {

    let div = document.createElement('div')
    div.classList.add('specialization-confirmation-wrapper')
    div.innerHTML = `
      <div class="specialization-confirmation-container">
        <h4>Specialization</h4>
        <hr/>
        <p>Are you sure you want to be a <strong>${sel}</strong></p>
        <p>You can not change this unless you do a hard reset...</p>
        <hr style='margin-bottom: 5px;'/>
        <button onclick='Game.specialization("${sel}")'>yes</button>
        <button onclick='document.querySelector(".specialization-confirmation-wrapper").remove()'>no</button>
      </div>
    `

    s('body').append(div)
  }

  Game.startSpecializationXp = () => {
    if (Game.state.player.specialization != null) {
      setInterval(() => {
        Game.state.player.specializationXpStored++
        if (Game.statsVisable) {
          s('.specialization-xp-stored').innerHTML = Game.state.player.specializationXpStored
        }
      }, 1000)
    }
  }

  Game.specialization = (sel) => {
    Game.state.player.specialization = sel
    drawSkillsContainer()
    Game.buildStats()
    s('.specialization-wrapper').remove()
    s('.specialization-confirmation-wrapper').remove()
    Game.specializationSkills()
    Game.startSpecializationXp()
  }

  Game.specializationSkills = () => {
    if (s('.specialization-skills-wrapper')) s('.specialization-skills-wrapper').remove()
    let specialization = Game.state.player.specialization
    let div = document.createElement('div')
    let str = ''
    div.classList.add('specialization-skills-wrapper')
    if (specialization == 'Prospector') {
      str += `

      <div class="specialization-skills-container">
        <div class="specialization-skills-top">
          <h1 style='flex-grow: 1; text-align: center;'>${specialization}</h1>
          <p onclick='document.querySelector(".specialization-skills-wrapper").remove()'>X</p>
        </div>
        <div class="specialization-skills-middle">
          <h2 style='margin-right: 10px;'>Lv: ${Game.state.player.specializationLv}</h2>
          <div class="specialization-skills-xp-container">
            <div class="specialization-skills-xp"></div>
          </div>
        </div>
        <p style='text-align: center;'>Specialization SP Available: ${Game.state.player.specializationSp}</p>
        <br/>
        <div class="specialization-skills-bottom">
          <div class="specialization-skills-bottom-left">
            <div class="skill-tier tier-1">
      `
      for (i in Game.skills) {
        let skill = Game.skills[i]
        if (skill.tier == 1) {
           str += `<div class="specialization-skill" style='background-image: url("./assets/${skill.img}.png")' onclick='Game.levelUpSkill("${i}")' onmouseover='Game.renderSkillText("${i}")' onmouseout='document.querySelector(".specialization-skills-bottom-right").innerHTML = "" '></div>`
        }
      }
      str += `</div> <div class="skill-tier tier-2">`

      for (i in Game.skills) {
        let skill = Game.skills[i]
        if (skill.tier == 2) {
          if (skill.locked == 0) {
            str += `<div class="specialization-skill" style='background-image: url("./assets/${skill.img}.png")' onclick='Game.levelUpSkill("${i}")' onmouseover='Game.renderSkillText("${i}")' onmouseout='document.querySelector(".specialization-skills-bottom-right").innerHTML = "" '></div>`
          } else {
            str += `<div class="specialization-skill" style='background-image: url("./assets/mystery.png")' onclick='Game.levelUpSkill("${i}")' onmouseover='Game.renderSkillText("${i}")' onmouseout='document.querySelector(".specialization-skills-bottom-right").innerHTML = "" '></div>`
          }
        }
      }

      str += `</div> <div class="skill-tier tier-3">`

      for (i in Game.skills) {
        let skill = Game.skills[i]
        if (skill.tier == 3) {
          if (skill.locked == 0) {
            str += `<div class="specialization-skill" style='background-image: url("./assets/${skill.img}.png")' onclick='Game.levelUpSkill("${i}")' onmouseover='Game.renderSkillText("${i}")' onmouseout='document.querySelector(".specialization-skills-bottom-right").innerHTML = "" '></div>`
          } else {
            str += `<div class="specialization-skill" style='background-image: url("./assets/mystery.png")' onclick='Game.levelUpSkill("${i}")' onmouseover='Game.renderSkillText("${i}")' onmouseout='document.querySelector(".specialization-skills-bottom-right").innerHTML = "" '></div>`
          }
        }
      }

      str += `
              </div>
                </div>
                <div class="specialization-skills-bottom-right"></div>
              </div>
            </div>
      `
    }
    if (specialization == 'Manager') {
      //
    }

    div.innerHTML = str
    s('body').append(div)
    calculateSpecializationXP()
  }

  calculateSpecializationXP = () => {
    let currentXp = Game.state.player.specializationXp
    let neededXp = Game.state.player.specializationXpNeeded
    let percentage = (currentXp / neededXp) * 100
    s('.specialization-skills-xp').style.width = percentage + '%'
  }

  Game.confirmRefine = () => {
    if (Game.state.canRefine == true) {
      let div = document.createElement('div')
      let amountOfRefinedOres = Math.floor(Math.cbrt(Game.state.ores / 10000000))
      div.classList.add('wrapper')
      div.innerHTML = `
        <div class="confirm-refine">
          <h3 style='text-align: center;'>Refine</h3>
          <hr/>
          <p style='text-align: left; color: lightgreen;'>+ You will gain <strong>${Game.state.player.specializationXpStored}</strong> specialization xp</p>
          <p style='text-align: left; color: lightgreen;'>+ You will gain <strong>${amountOfRefinedOres}</strong> refined ores</p>
          <p style='text-align: left; color: #c36d6d;'>- You will lose all current ores</p>
          <p style='text-align: left; color: #c36d6d;'>- You will lose all owned items and upgrades</p>
          <hr/>
          <p style='text-align: center;'>Are you sure you want to refine?</p>
          <p style='text-align: center; font-size: smaller; margin-bottom: 5px'>-You can refine once every 3 hours-</p>
          <button onclick='Game.refine()'>yes</button>
          <button onclick='document.querySelector(".wrapper").remove()'>no</button>
        </div>
      `

      s('body').append(div)
    }
  }

  Game.refine = () => {
    if (Game.state.canRefine == true) {
      Game.state.canRefine = false
      Game.state.stats.timesRefined++
      refineCountdown()
      let div = document.createElement('div')
      div.classList.add('refine')
      s('body').append(div)

      // let amountOfRefinedOres = Math.floor(Math.cbrt(Game.state.ores / 10000000))
      let amountOfRefinedOres = 0
      if (Game.state.ores >= 1000000) amountOfRefinedOres++
      if (Game.state.ores >= 1000000000) amountOfRefinedOres += 2
      if (Game.state.ores >= 1000000000000) amountOfRefinedOres += 5
      if (Game.state.ores >= 1000000000000000) amountOfRefinedOres += 10
      if (Game.state.ores >= 1000000000000000000) amountOfRefinedOres += 10

      Game.state.refinedOres += amountOfRefinedOres

      setTimeout(() => {
        softReset()
        s('.wrapper').remove()
      }, 1500)
      setTimeout(() => {
        s('.refine').remove()
        if (Game.state.stats.timesRefined > 0) winAchievement('Blacksmiths Apprentice')
      }, 3000)
    }
  }

  refineCountdown = () => {
    if (Game.state.refineTimer > 0) {
      Game.state.refineTimer--
    } else {
      Game.state.canRefine == true
      Game.state.refineTimer = 10800000
      Game.buildStats()
    }
  }

  softReset = () => {
    Game.state.ores = 0
    Game.state.oreHp = 50
    Game.state.oreCurrentHp = 50
    Game.state.oresPerSecond = 0
    Game.state.opsMultiplier = 0
    Game.state.opcMultiplier = 0
    Game.state.weakHitMultiplier = 5
    Game.state.player.lvl = 1
    Game.state.player.str = 0
    Game.state.player.dex = 0
    Game.state.player.luk = 0
    Game.state.player.int = 0
    Game.state.player.cha = 0
    Game.state.player.currentXp = 0
    Game.state.player.xpNeeded = 50
    Game.state.player.availableSp = 0
    Game.state.player.pickaxe = {
      name: 'Beginners Wood Pickaxe',
      rarity: 'Common',
      itemLevel: 1,
      material: 'Wood',
      damage: 1,
    }

    if (Game.state.player.specializationXpStored > 0) {
      while (Game.state.player.specializationXp + Game.state.player.specializationXpStored > Game.state.player.specializationXpNeeded) {
        Game.state.player.specializationXpStored -= Game.state.player.specializationXpNeeded
        Game.state.player.specializationLv++
        Game.state.player.specializationSp++
        Game.state.player.specializationXp = 0
        Game.state.player.specializationXpNeeded = Math.pow(Game.state.player.specializationXpNeeded, 1.15)
      }
      Game.state.player.specializationXp = Game.state.player.specializationXpStored
      Game.state.player.specializationXpStored = 0
    }

    resetItems()
    Game.buildStats()
    buildStore()
  }

  Game.levelUpSkill = (skillName) => {
    let skill = Game.skills[skillName]

    if (Game.state.player.specializationSp > 0) { // IF WE HAVE SP
      if (skill) { // IF SKILL EXISTS
        if (skill.locked == 0) {
          Game.state.player.specializationSp --
          skill.lv++
          if (skill.lv > 1) {
            skill.current += skill.next
          }
          // UNlOCK NEXT TIER
          let nextTier = skill.tier + 1
          for (i in Game.skills) {
            if (Game.skills[i].tier == nextTier) {
              Game.skills[i].locked = 0
            }
          }
          Game.specializationSkills()
          Game.renderSkillText(skillName)
          drawSkillsContainer()
        }
      }
    }
  }

  Game.skills = []

  Game.skills['HeavySmash'] = {
    name: 'Heavy Smash',
    type: 'active',
    img: 'heavy-smash-skill',
    specialization: 'Prospector',
    fillerTxt: 'Unleash your inner strength and deal a powerful strike',
    desc: 'Deal a single 100x OpC hit',
    lv: 0,
    locked: 0,
    tier: 1,
    what: 'OpC',
    current: 100,
    next: 10,
    cooldown: 3,
    inUse: false,
    currentCooldown: 0
  }
  Game.skills['WeightLifting'] = {
    name: 'Weight Lifting',
    type: 'passive',
    img: 'weight-lifting-skill',
    specialization: 'Prospector',
    fillerTxt: 'I lift things up and put them down',
    desc: 'Passive STR bonus',
    id: 1,
    lv: 0,
    locked: 1,
    tier: 2,
    what: 'STR',
    current: 5,
    next: 5
  }
  Game.skills['Conditioning'] = {
    name: 'Conditioning',
    type: 'passive',
    img: 'conditioning-skill',
    specialization: 'Prospector',
    fillerTxt: 'Crossfit is like totally awesome',
    desc: 'Passive DEX bonus',
    id: 2,
    lv: 0,
    locked: 1,
    tier: 2,
    what: 'DEX',
    current: 5,
    next: 5
  }
  Game.skills['RoidRage'] = {
    name: 'Roid Rage',
    type: 'active',
    img: 'roidrage-skill',
    specialization: 'Prospector',
    fillerTxt: 'All you see is red... and rocks',
    desc: 'Increases your OpC by 50x for 10s',
    lv: 0,
    locked: 1,
    tier: 3,
    what: 'OpC',
    current: 50,
    next: 10,
    cooldown: 60,
    inUse: false,
    currentCooldown: 0
  }

  Game.renderSkillText = (skillName) => {
    let skill = Game.skills[`${skillName}`]
    s('.specialization-skills-bottom-right').innerHTML = `
      <h2>${skill.name} &nbsp; Lv. ${skill.lv}</h2>
      <hr/>
      <p><i>${skill.type}</i></p>
      <hr/>
      <br/>
      <p>${skill.fillerTxt}</p>
      <br/>
      <p>${skill.desc}</p>
    `
    if (skill.lv > 0) {
      s('.specialization-skills-bottom-right').innerHTML += `
        <br/>
        <hr/>
        <p style='float: left;'>[Current Level] ${skill.what} + ${skill.current}</p>
        <p style='float: left;'>[Next Level] ${skill.what} + ${skill.current + skill.next}</p>
      `
    }
    if (skill.locked == 1) {
      s('.specialization-skills-bottom-right').innerHTML = `
          <h2>???</h2>
        `
    }
  }

  let drawSkillsContainer = () => {
    if (Game.state.player.specialization != null) {
      let div = s('.active-skills-container')
      let anchorTop = s('.inventory-section').getBoundingClientRect()
      let anchorRight = s('#main-separator').getBoundingClientRect()

      s('body').append(div)

      div.style.display = 'flex'
      div.style.top = anchorTop.bottom + 'px'
      div.style.marginTop = '10px'
      div.style.left = anchorRight.left - div.getBoundingClientRect().width + 'px'

      drawActiveSkills()
    }
  }

  let drawActiveSkills = () => {
    let str = ''
    for (i in Game.skills) {
      if (Game.skills[i].type == 'active') { // IF ITS AN ACTIVE SKILL
        if (Game.skills[i].locked == 0) { // IF ITS NOT LOCKED
          if (Game.skills[i].lv > 0) { // IF THERES POINTS IN IT
            if (Game.skills[i].currentCooldown <= 0) {
              str += `<div class='active-skill' style='background-image: url("./assets/${Game.skills[i].img}.png"); cursor: pointer' onclick='Game.useSkill("${i}")' onmouseover='Game.showTooltip("${i}", null, "skill", null)' onmouseout='Game.hideTooltip()' ></div>`
            } else {
              str += `<div class='active-skill' style='background-image: url("./assets/${Game.skills[i].img}.png"); cursor: not-allowed' onmouseover='Game.showTooltip("${i}", null, "skill", null)' onmouseout='Game.hideTooltip()' ></div>`
            }
          }
        }
      }
    }
    s('.active-skills-area').innerHTML = str
  }

  Game.useSkill = (skillName) => {
    Game.hideTooltip()
    let skill = Game.skills[skillName]
    if (skill.name == 'Roid Rage') {
      if (skill.inUse == false && skill.currentCooldown <= 0) {
        skill.inUse = true
        skill.currentCooldown = skill.cooldown * 60
        calculateSkillCooldown()
        setTimeout(() => {
          skill.inUse = false
        }, 10000)

        let div = document.createElement('div')
        div.style.width = '100vw'
        div.style.height = '100vh'
        div.style.position = 'absolute'
        div.style.top = '0px'
        div.style.background = 'darkred'
        div.style.opacity = '0.2'
        div.style.zindex = '99999'
        div.style.pointerEvents = 'none'
        s('body').classList.add('roid-rage')

        s('body').append(div)

        setTimeout(() => {
          div.remove()
          s('body').classList.remove('roid-rage')
        }, 1000 * 10)
      }
    }
    if (skill.name == 'Heavy Smash') {
      if (skill.currentCooldown <= 0) {
        playSound('heavy-smash')
        let orePos = s('.ore').getBoundingClientRect()
        skill.currentCooldown = skill.cooldown * 60
        calculateSkillCooldown()

        let div = document.createElement('div')
        div.classList.add('heavy-smash-wrapper')
        div.innerHTML = `
          <div class="heavy-smash"></div>
        `

        s('body').append(div)

        s('.heavy-smash').style.left = (orePos.left + orePos.right) / 2 + 'px'
        s('.heavy-smash').style.top = ((orePos.top + orePos.bottom) / 2) - ((s('.heavy-smash').getBoundingClientRect().top + s('.heavy-smash').getBoundingClientRect().bottom) / 2) + 'px'

        s('body').classList.add('roid-rage')

        // DO DAMAGE
        let amount = calculateOPC() * 100
        earn(amount)
        updatePercentage(amount)
        risingNumber(amount, 'heavy-smash')

        if (Game.skills['RoidRage'].inUse == true) winAchievement('Roided Smash')

        setTimeout(() => {
          s('body').classList.remove('roid-rage')
          div.remove()
        }, 500)

      }
    }
    drawActiveSkills()
  }

  let calculateSkillCooldown = () => {
    if (Game.skills['RoidRage'].currentCooldown > 0) {
      Game.skills['RoidRage'].currentCooldown--
    }
    if (Game.skills['HeavySmash'].currentCooldown > 0) {
      Game.skills['HeavySmash'].currentCooldown--
    }
    drawActiveSkills()
  }

  Game.toggleStats = () => {
    if (s('.stats-container-content-wrapper').style.height == 0 || s('.stats-container-content-wrapper').style.height == '0px') {
      s('.stats-container-content-wrapper').style.height = '370px';
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
    tooltip.style.zIndex = '9999'

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
          <p>Increases your critical damage multiplier</p>
        `
      }
      if (stat == 'dex') {
        tooltip.innerHTML = `
          <h3>Dexterity</h3>
          <hr/>
          <p>Increases your OpC slightly</p>
          <p>Increases your critical strike chance slightly</p>
        `
        if (Game.state.player.dex > 0) {
          tooltip.innerHTML += `
            <hr/>
            <p>Crit Chance: ${Math.floor((Math.pow((Game.state.player.dex/(Game.state.player.dex+10)), 2)) * 100) / 2}%
          `
        }
      }
      if (stat == 'int') {
        tooltip.innerHTML = `
          <h3>Intelligence</h3>
          <hr/>
          <p>Increases item drop chance</p>
          <p>Increases store item output slightly</p>
          <p>Lowers shop prices slightly</p>
        `
      }
      if (stat == 'luk') {
        tooltip.innerHTML = `
          <h3>Luck</h3>
          <hr/>
          <p>Increases item rarity percentage</p>
          <p>Increases item drop chance</p>
          <p>Chance for critical strikes</p>
        `
      }
      if (stat == 'cha') {
        tooltip.innerHTML = `
          <h3>Charisma</h3>
          <hr/>
          <p>Increases item output slightly</p>
          <p>Lowers shop prices</p>
        `
      }
      if (stat == 'spec') {
        tooltip.innerHTML = `
          <p>Unlocked at Level 5</p>
        `
      }
    } else if (type == 'skill') {
      let skill = Game.skills[itemName]
      let anchorRight = s('#skill-separator').getBoundingClientRect()
      let mouseY = event.clientY

      tooltip.style.left = anchorRight.left - tooltip.getBoundingClientRect().width + 'px'
      tooltip.style.top = mouseY + 'px'

      tooltip.innerHTML = `
        <h3>${skill.name}</h3>
        <hr/>
        <p>${skill.desc}</p>
      `
      if (skill.currentCooldown > 0) {
        tooltip.innerHTML += `<hr/><p>Cooldown: ${beautifyTime(skill.currentCooldown)}</p>`
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
        <hr/>
        <p style='font-size: small; opacity: .6; float: right; padding-top: 5px;'><i>${item.fillerQuote}</i></p>

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
    // if (s('.img_ad')) {
    //   //do nothing
    // } else {
    //     let str = `
    //     <p style='text-align: center; background: transparent; color: white;'>Please consider whitelisting this page! <br/> I tried my best to make the ads non-intrusive! <br/> Thanks!</p>
    //     `
    //     s('#ads-im-sorry-please-dont-hate-me').innerHTML = str
    // }
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
        Game.items['CompositionNotebooks'].hidden = 0
      }
    }
    if (item.name == 'Farm') {
      if (item.owned == 1) {
        Game.items['Quarry'].hidden = 0
        Game.items['Church'].hidden = 1
        Game.items['Factory'].hidden = 1
        Game.items['ManureSpreader'].hidden = 0
      }
    }
    if (item.name == 'Quarry') {
      if (item.owned == 1) {
        Game.items['Church'].hidden = 0
        Game.items['Factory'].hidden = 1
        Game.items['Crypt'].hidden = 1
        Game.items['Headlights'].hidden = 0
      }
    }
    if (item.name == 'Church') {
      if (item.owned == 1) {
        Game.items['Factory'].hidden = 0
        Game.items['Crypt'].hidden = 1
        Game.items['Hospital'].hidden = 1
        Game.items['ScriptureReading'].hidden = 0
      }
    }
    if (item.name == 'Factory') {
      if (item.owned == 1) {
        Game.items['Crypt'].hidden = 0
        Game.items['Hospital'].hidden = 1
        Game.items['Citadel'].hidden = 1
        Game.items['RubberConveryorBelts'].hidden = 0
      }
    }
    if (item.name == 'Crypt') {
      if (item.owned == 1) {
        Game.items['Hospital'].hidden = 0
        Game.items['Citadel'].hidden = 1
        Game.items['XenoSpaceship'].hidden = 1
        Game.items['MetalSarcophagus'].hidden = 0
      }
    }
    if (item.name == 'Hospital') {
      if (item.owned == 1) {
        Game.items['Citadel'].hidden = 0
        Game.items['XenoSpaceship'].hidden = 1
        Game.items['SkyCastle'].hidden = 1
        Game.items['ImmunizationShots'].hidden = 0
      }
    }
    if (item.name == 'Citadel') {
      if (item.owned == 1) {
        Game.items['XenoSpaceship'].hidden = 0
        Game.items['SkyCastle'].hidden = 1
        Game.items['EonPortal'].hidden = 1
        Game.items['CouncilOfRocks'].hidden = 0
      }
    }
    if (item.name == 'Xeno Spaceship') {
      if (item.owned == 1) {
        Game.items['SkyCastle'].hidden = 0
        Game.items['EonPortal'].hidden = 1
        Game.items['SacredMines'].hidden = 1
        Game.items['JetFuel'].hidden = 0
      }
    }
    if (item.name == 'Sky Castle') {
      if (item.owned == 1) {
        Game.items['EonPortal'].hidden = 0
        Game.items['SacredMines'].hidden = 1
        Game.items['O.A.R.D.I.S.'].hidden = 1
        Game.items['GoldenEggs'].hidden = 0
      }
    }
    if (item.name == 'Eon Portal') {
      if (item.owned == 1) {
        Game.items['SacredMines'].hidden = 0
        Game.items['O.A.R.D.I.S.'].hidden = 1
        Game.items['GreenGoop'].hidden = 0
      }
    }
    if (item.name == 'Sacred Mines') {
      if (item.owned == 1) {
        Game.items['O.A.R.D.I.S.'].hidden = 0
        Game.items['UnholyMineshaft'].hidden = 0
      }
    }


    // ITEM UPGRADES
    if (item.name == 'Clean Magnifying Glass') {
      item.hidden = 1
      Game.items['PolishMagnifyingGlass'].hidden = 0
      Game.state.weakHitMultiplier = 10
    }
    if (item.name == 'Polish Magnifying Glass') {
      item.hidden = 1
      Game.state.weakHitMultiplier = 15
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
    if (item.name == 'Composition Notebooks') {
      item.hidden = 1
      Game.items['School'].production *= 2
    }
    if (item.name == 'Manure Spreader') {
      item.hidden = 1
      Game.items['Farm'].production *= 2
    }
    if (item.name == 'Headlights') {
      item.hidden = 1
      Game.items['Quarry'].production *= 2
    }
    if (item.name == 'Scripture Reading') {
      item.hidden = 1
      Game.items['Church'].production *= 2
    }
    if (item.name == 'Rubber Converyor Belts') {
      item.hidden = 1
      Game.items['Factory'].production *= 2
    }
    if (item.name == 'Metal Sarcophagus') {
      item.hidden = 1
      Game.items['Crypt'].production *= 2
    }
    if (item.name == 'Immunization Shots') {
      item.hidden = 1
      Game.items['Hospital'].production *= 2
    }
    if (item.name == 'Council Of Rocks') {
      item.hidden = 1
      Game.items['Citadel'].production *= 2
    }
    if (item.name == 'Jet Fuel') {
      item.hidden = 1
      Game.items['XenoSpaceship'].production *= 2
    }
    if (item.name == 'Golden Eggs') {
      item.hidden = 1
      Game.items['SkyCastle'].production *= 2
    }
    if (item.name == 'Green Goop') {
      item.hidden = 1
      Game.items['EonPortal'].production *= 2
    }
    if (item.name == 'Unholy Mineshaft') {
      item.hidden = 1
      Game.items['SacredMines'].production *= 2
    }
    if (item.name == 'OARDISupgrade') {
      item.hidden = 1
      Game.items['O.A.R.D.I.S.'].production *= 2
    }
    if (item.name == 'Flashlight') {
      item.hidden = 1
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
        this.price = (this.basePrice * Math.pow(1.15, this.owned))
        if (Game.state.player.int > 0) {
          this.price -= (this.basePrice * Math.pow(1.15, this.owned)) * (Game.state.player.int * .01)
        }
        if (Game.state.player.cha > 0) {
          this.price -= (this.basePrice * Math.pow(1.15, this.owned)) * (Game.state.player.cha * .05)
        }

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

  resetItems()

  Game.achievements = []
  let Achievement = function(name, desc) {
    this.name = name
    // this.functionName = name.replace(/ /g, '')
    this.desc = desc
    this.won = 0

    Game.achievements.push(this)
  }

  // AMOUNT OF ROCKS DESTROYED ACHIEVEMENTS
  new Achievement('Newbie Miner', 'Break your first rock')
  new Achievement('Novice Miner', 'Break 5 rocks')
  new Achievement('Intermediate Miner', 'Break 10 rocks')

  // COMBO ACHIEVEMENTS
  new Achievement('Combro', 'Reach 5 hit combo')
  new Achievement('Comboing', 'Reach 25 hit combo')
  new Achievement('Combo Master', 'Reach 100 hit combo')
  new Achievement('Combo Devil', 'Reach 666 hit combo')
  new Achievement('Combo God', 'Reach 777 hit combo')
  new Achievement('Combo Saiyan', 'Reach 1000 hit combo')
  new Achievement('Combo Saitama', 'Reach 11111 hit combo')

  // OPC ACHIEVEMENTS
  new Achievement('Still A Baby', 'Deal more than 1,000,000 in one hit')
  new Achievement('Getting There', 'Deal more than 1,000,000,000 in one hit')
  new Achievement('Big Boy', 'Deal more than 1,000,000,000,000 in one hit')

  // OPS ACHIEVEMENTS
  new Achievement('401K', 'Reach 401,000 OpS')
  new Achievement('Retirement Plan', 'Reach 5,000,000 OpS')
  new Achievement('Hedge Fund', 'Reach 5,000,000,000 OpS')

  // REFINE ACHIEVEMENTS
  new Achievement('Blacksmiths Apprentice', 'Refine for your first time')

  // OTHER ACHIEVEMENTS
  new Achievement('Roided Smash', 'Use the skill Heavy Smash along while Roid Rage is active')


  let winAchievement = (achievementName) => {
    for (i = 0; i < Game.achievements.length; i++) {
      if (achievementName == Game.achievements[i].name) {
        if (Game.achievements[i].won == 0) {
          Game.achievements[i].won = 1
          let div = document.createElement('div')
          div.classList.add('achievement')

          div.innerHTML = `
            <h3>Achievement Unlocked</h3>
            <h1>${Game.achievements[i].name}</h1>
            <p>${Game.achievements[i].desc}</p>
          `
          s('body').append(div)

          // let divWidth = div.getBoundingClientRect().width
          // let windowWidth = window.innerWidth

          // div.style.left = ((windowWidth/2) - (divWidth/2)) + 'px'



          setTimeout(() => {
            div.remove()
          }, 3000)
        }
      }
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
      gainXp(10)
      if (Game.state.stats.rocksDestroyed == 1) { winAchievement('Newbie Miner'); textScroller.push('[Breaking News] Rocks are breaking!',) }
      if (Game.state.stats.rocksDestroyed == 5) { winAchievement('Novice Miner'); textScroller.push('[Breaking News] The cries of baby rocks can be heard from miles away as their parents get obliterated by this new miner','What happens in Ore Town stays in Ore Town') }
      if (Game.state.stats.rocksDestroyed == 10) winAchievement('Intermediate Miner')
      playSound('explosion2')
      Game.state.oreHp = Math.pow(Game.state.oreHp, 1.11)
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
      amount = amt
    }

    if (Game.state.player.currentXp + amount < Game.state.player.xpNeeded) {
      Game.state.player.currentXp += amount
    } else {
      Game.state.player.currentXp = (Game.state.player.currentXp + amount) - Game.state.player.xpNeeded
      Game.state.player.lvl++
      Game.state.player.availableSp += 3
      Game.buildStats()
      playSound('levelup')
      Game.state.player.xpNeeded = Math.ceil(Math.pow(Game.state.player.xpNeeded, 1.05))
      risingNumber(0, 'level')
      s('.stats-container').style.boxShadow = '0 0 10px yellow'
      setTimeout(() => {
        s('.stats-container').style.boxShadow = 'none'
      }, 1000)
    }
    buildInventory()
  }

  //https://stackoverflow.com/questions/1484506/random-color-generator
  let getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  let risingNumber = (amount, type) => {
    if (Game.state.settings.risingNumbers == true) {
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

      if (type == 'weak-hit') {
        risingNumber.style.fontSize = '30px'
      }

      if (type == 'crit-hit') {
        risingNumber.style.fontSize = '25px'
      }

      if (type == 'level') {
        risingNumber.style.fontSize = 'x-large'
        risingNumber.innerHTML = 'LEVEL UP'
      }

      if (type == 'spendMoney') {
        risingNumber.style.fontSize = 'xx-large'
        risingNumber.style.color = 'red'
        risingNumber.innerHTML = '-$'
      }

      if (type == 'combo') {
        risingNumber.style.fontSize = 'xx-large'
        risingNumber.style.color = getRandomColor()
        risingNumber.style.animationDuration = '3s'
        risingNumber.innerHTML = `${Game.state.stats.currentCombo} hit combo`
      }

      if (type == 'mega-crit') {
        risingNumber.style.fontSize = '60px'
        risingNumber.style.color = 'lightcyan'
        risingNumber.style.animationDuration = '3.5s'
      }

      if (type == 'heavy-smash') {
        risingNumber.style.left = (s('.ore').getBoundingClientRect().left + s('.ore').getBoundingClientRect().right)/2 + 'px'
        risingNumber.style.right = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom)/2 + 'px'
        risingNumber.style.animationDuration = '3s'
        risingNumber.style.fontSize = '50px'
        risingNumber.style.color = 'crimson'
      }


      s('.particles').append(risingNumber)

      setTimeout(() => {
        risingNumber.remove()
      }, 2000)
    }
  }

  let getCombo = (type) => {
    if (type == 'hit') { // IF WEAK SPOT HIT
      Game.state.stats.currentCombo++
      if (Game.state.stats.currentCombo % 5 == 0) {
        risingNumber(0, 'combo')
      }
      if (Game.state.stats.currentCombo > Game.state.stats.highestCombo) {
        Game.state.stats.highestCombo = Game.state.stats.currentCombo
      }

      // UNLOCK ACHIEVEMENTS REGARDING COMBOS
      if (Game.state.stats.currentCombo >= 5) winAchievement('Combro')
      if (Game.state.stats.currentCombo >= 25) winAchievement('Comboing')
      if (Game.state.stats.currentCombo >= 100) winAchievement('Combo Master')
      if (Game.state.stats.currentCombo >= 666) winAchievement('Combo Devil')
      if (Game.state.stats.currentCombo >= 777) winAchievement('Combo God')
      if (Game.state.stats.currentCombo >= 1000) winAchievement('Combo Saiyan')
      if (Game.state.stats.currentCombo >= 11111) winAchievement('Combo Saitama')


    } else { // IF REGULAR HIT
      Game.state.stats.currentCombo = 0
    }
  }

  let drawRockParticles = () => {
    if (Game.state.settings.rockParticles == true) {
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
  }

  Game.showChangelog = (show) => {
    let newestVersion = '0.6.4'

    if (Game.state.currentVersion != newestVersion || Game.state.ores == 0 || show == 1) {
      Game.state.currentVersion = newestVersion
      let div = document.createElement('div')
      div.classList.add('changelog-wrapper')
      div.onclick = () => s('.changelog-wrapper').remove()
      div.innerHTML = `
        <div class="changelog-container">
          <h1>Changelog</h1>
          <p style='text-align: center'>(Click anywhere to close)</p>
          <hr style='border-color: black; margin-bottom: 10px;'/>

          <h3>v0.6.7 (10/1/2017)</h3>
          <p>-Prospector class is 3/4 done...</p>
          <p>-Changed up background image</p>
          <p>-Changed store fonts</p>
          <p>-Added a couple more upgrades</p>
          <p>-Added some more sprites</p>
          <p>-Added more achievements</p>
          <p>-Added a text scrolling thingy doodad</p>
          <p>-Fixed bug where other items disappear on click</p>
          <p>-Fixed countless more bugs</p>
          <br/>


          <h3>v0.6.5 (9/27/2017)</h3>
          <p>Prospector class is halfway done...</p>
          <br/>

          <h3>v0.6.4 (9/24/2017)</h3>
          <p>-Almost done implementing classes... well, a single class</p>

          <br/>

          <h3>v0.6.3 (9/23/2017) THE SPRITES UPDATE</h3>
          <p>-Sprites for every single store item(My index finger is sore)</p>

          <br/>

          <h3>v0.6.2 (9/22/2017)</h3>
          <p>-BIG UPDATE IN THE WORKS... classes dont do anything yet but they will soon...</p>
          <p>-Added a couple more sprites</p>
          <p>-Lots of bug fixes</p>

          <br/>

          <h3>v0.6.1 (9/19/2017)</h3>
          <p>-Added upgrades for every single store item</p>
          <p>-Added a bunch more sprites</p>
          <p>-Critical hits gives more XP</p>
          <p>-Mousing over stats displays information</p>
          <p>-Adjusted Strength values to prevent negative damage from happening</p>
          <p>-Adjusted ore health</p>
          <p>-Implement achievements</p>
          <p>-Added 2 achievements</p>
          <p>-Implemented patch notes (this thing!)</p>
        </div>

      `
      s('body').append(div)
    }
  }

  let checkCrit = () => {
    let dex = Game.state.player.dex
    let luk = Game.state.player.luk
    let critChance = Math.floor((Math.pow((dex/(dex+5)), 2)) * 100) / 2
    critChance += luk * .10
  }

  s('.ore').onclick = () => {
    let amt = calculateOPC()
    let num = Math.random()
    let dex = Game.state.player.dex
    checkCrit()

    if (dex > 0) {
      let critChance = Math.floor((Math.pow((dex/(dex+5)), 2)) * 100) / 2
      if (critChance > Math.random() * 100) {
        amt += calculateOPC('crit-hit')
        risingNumber(amt, 'crit-hit')
      } else {
        risingNumber(amt)
      }
    } else {
      risingNumber(amt)
    }

    Game.state.currentCombo = 0
    earn(amt)
    gainXp()
    playSound('ore-hit')
    updatePercentage(amt)
    buildInventory()
    drawRockParticles()
    Game.state.stats.oreClicks++
    if (Game.statsVisable) Game.buildStats()
    if (Game.state.stats.oreClicks >= 2) unlockUpgrades('MagnifyingGlass')
    if (Game.state.stats.oreClicks >= 100) unlockUpgrades('WorkBoots')
    if (Game.state.stats.oreClicks >= 100) unlockUpgrades('Painkillers')
    if (document.querySelector('.click-me-container')) {
      s('.click-me-container').remove()
    }
    getCombo()
  }

  s('.ore-click-area').onclick = () => {
    let amt = calculateOPC('weak-hit')
    let dex = Game.state.player.dex
    Game.state.stats.oreClicks++
    Game.state.stats.weakSpotHits++

    if (dex > 0) {
      let critChance = Math.floor((Math.pow((dex/(dex+5)), 2)) * 100) / 2
      if (critChance > Math.random() * 100) {
        amt += calculateOPC('weak-hit')
        risingNumber(amt, 'mega-crit')
        Game.state.stats.megaCrit++
      } else {
        risingNumber(amt, 'weak-hit')
      }
    } else {
      risingNumber(amt, 'weak-hit')
    }


    earn(amt)
    gainXp(3)
    playSound('ore-crit-hit')
    updatePercentage(amt)
    buildInventory()
    drawRockParticles()
    oreClickArea()
    if (Game.state.player.specialization == 'Prospector') {
      Game.state.player.specializationXpStored += 5
    }
    if (Game.statsVisable) Game.buildStats()
    getCombo('hit')
  }

  Game.showSettings = () => {
    let div = document.createElement('div')
    let str;
    div.classList.add('wrapper')

    str += `
      <div class="setting-container">
        <h3>settings</h3>
        <i class='fa fa-times fa-1x' onclick='document.querySelector(".wrapper").remove()'></i>
        <hr/>
        <p>Sound</p>
        <div class="single-setting">
          <p style='padding-right: 10px;'>Volume: </p>
          <input class='volume-slider' type="range" min=0 max=1 step=0.1 list='tickmarks' onchange='Game.state.settings.volume = document.querySelector(".volume-slider").value'/>
          <datalist id="tickmarks">
            <option value="0" label="0%">
            <option value="0.1">
            <option value="0.1">
            <option value="0.2">
            <option value="0.3">
            <option value="0.4">
            <option value="0.5" label="50%">
            <option value="0.6">
            <option value="0.7">
            <option value="0.8">
            <option value="0.9">
            <option value='1.0' label="100%">
          </datalist>
        </div>
        <hr/>
        <br/>
        <p>Video</p>
        <div class="single-setting">
          <p style='padding-right: 20px;'>Enable Rock Particles:</p>
          <input type="radio" name='rockParticles' id='rockParticlesOn' value='true' onchange='Game.state.settings.rockParticles = true'/>
            <label for="rockParticlesOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='rockParticles' id='rockParticlesOff' value='false' onchange='Game.state.settings.rockParticles = false' />
            <label for="rockParticlesOff">Off</label>
        </div>
        <div class="single-setting">
          <p style='padding-right: 20px;'>Enable Rising Numbers:</p>
          <input type="radio" name='risingNumbers' id='risingNumbersOn' value='true' onchange='Game.state.settings.risingNumbers = true'/>
            <label for="risingNumbersOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='risingNumbers' id='risingNumbersOff' value='false' onchange='Game.state.settings.risingNumbers = false' />
            <label for="risingNumbersOff">Off</label>
        </div>
        <hr/>
        <br/>
        <p>Miscellaneous</p>
        <div class="single-setting">
          <p style='padding-right: 20px;'>Enable Scrolling Text:</p>
          <input type="radio" name='scrollingText' id='scrollingTextOn' value='true' onchange='Game.state.settings.scrollingText = true'/>
            <label for="scrollingTextOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='scrollingText' id='scrollingTextOff' value='false' onchange='Game.state.settings.scrollingText = false' />
            <label for="scrollingTextOff">Off</label>
        </div>
        <hr/>
      </div>

    `
    div.innerHTML = str

    s('body').append(div)
    s('.volume-slider').value = Game.state.settings.volume

    Game.state.settings.rockParticles == true ? s('#rockParticlesOn').checked = true : s('#rockParticlesOff').checked = true
    Game.state.settings.risingNumbers == true ? s('#risingNumbersOn').checked = true : s('#risingNumbersOff').checked = true
    Game.state.settings.scrollingText == true ? s('#scrollingTextOn').checked = true : s('#scrollingTextOff').checked = true
  }

  Game.showAchievements = () => {
    let div = document.createElement('div')
    let str;
    let achievementsWon = 0
    let achievementsMissing = 0
    div.classList.add('wrapper')

    for (i = 0; i < Game.achievements.length; i++) {
      if (Game.achievements[i].won == 1) {
        achievementsWon++
      } else {
        achievementsMissing++
      }
    }

    str += `
      <div class="achievements-container">
        <h1>Statistics</h1>
        <i class='fa fa-times fa-1x' onclick='document.querySelector(".wrapper").remove()'></i>
        <hr/>
        <p><span style='opacity: .6'>Ores Mined:</span> <strong>${beautify(Game.state.stats.totalOresMined.toFixed(1))}</strong></p>
        <p><span style='opacity: .6'>Ore Clicks:</span> <strong>${Game.state.stats.oreClicks}</strong></p>
        <p><span style='opacity: .6'>Weak Spot Hits:</span> <strong>${Game.state.stats.weakSpotHits}</strong></p>
        <p><span style='opacity: .6'>Crit Hits:</span> <strong>${Game.state.stats.critHits}</strong></p>
        <p><span style='opacity: .6'>Mega Hits: (Crit & Weak Spot Hit):</span> <strong>${Game.state.stats.megaHits}</strong></p>
        <p><span style='opacity: .6'>Highest Weak Spot Combo:</span> <strong>${Game.state.stats.highestCombo}</strong></p>
        <p><span style='opacity: .6'>Ores Spent:</span> <strong>${beautify(Game.state.stats.totalOresSpent)}</strong></p>
        <p><span style='opacity: .6'>Rocks Destroyed:</span> <strong>${Game.state.stats.rocksDestroyed}</strong></p>
        <p><span style='opacity: .6'>Items Picked Up:</span> <strong>${Game.state.stats.itemsPickedUp}</strong></p>
        <p><span style='opacity: .6'>Refine Amount:</span> <strong>${Game.state.stats.timesRefined}</strong></p>
        <p><span style='opacity: .6'>Time Played:</span> <strong>${beautifyTime(Game.state.stats.timePlayed)}</strong></p>
        <br/>
        <h1>Achievements</h1>
        <hr/>
        <h2><span style='opacity: .6'>Achievements Won:</span> ${achievementsWon}</h2>
        `
        for (i = 0; i < Game.achievements.length; i++) {
          if (Game.achievements[i].won == 1) {
            str += `<p><span style='opacity: .6'>${Game.achievements[i].name}</span> - <strong>${Game.achievements[i].desc}</strong></p>`
          }
        }

        str += `<br/> <p><span style='opacity: .6'>Achievements Missing:</span> <strong>${achievementsMissing}</strong></p>`

        for (j = 0; j < Game.achievements.length; j++) {
          if (Game.achievements[j].won == 0) {
            str += `<p><span style='opacity: .6'>${Game.achievements[j].name}</span> - <strong>???</strong></p>`
          }
        }

        str += `
    </div>

    `


    div.innerHTML = str

    s('body').append(div)
  }

  textScroller = [
    'What is a rocks favorite fruit? ... Pom-a-granite',
    'Did you see that cleavage? Now that\'s some gneiss schist.',
    'All rock and no clay makes you a dull boy (or girl)',
    'Don\'t take life for granite',
    'What happens when you throw a blue rock in the red sea? ... It gets wet',
  ]

  showTextScroller = (text) => {

    let scrollTime = 20 // 20seconds

    if (Game.state.settings.scrollingText == true) {
      s('.text-scroller').innerHTML = ''

      if (text) {
        s('.text-scroller').innerHTML = text
        s('.text-scroller').style.right = -s('.text-scroller').clientWidth + 'px'

        let parentWidth = s('.text-scroller').parentElement.clientWidth

        s('.text-scroller').style.transition = `transform 15s linear`;
        s('.text-scroller').style.transform = `translateX(-${parentWidth + s('.text-scroller').clientWidth}px)`
      } else {
        let random = Math.floor(Math.random() * textScroller.length)

        s('.text-scroller').innerHTML = textScroller[random]
        s('.text-scroller').style.right = -s('.text-scroller').clientWidth + 'px'

        let parentWidth = s('.text-scroller').parentElement.clientWidth

        s('.text-scroller').style.transition = `transform ${scrollTime}s linear`
        s('.text-scroller').style.transform = `translateX(-${parentWidth + s('.text-scroller').clientWidth}px)`
      }
      setTimeout(() => {
        s('.text-scroller').style.transition = `none`
        s('.text-scroller').style.transform = `translateX(0px)`
        showTextScroller()
      }, scrollTime * 1000)
    }
  }

  showTextScroller()


  // INIT SHIT
  buildInventory()
  Game.buildStats()
  generateStoreItems()
  // Game.load()
  drawSkillsContainer()
  buildStore()
  Game.buildStats()
  Game.showChangelog()
  setInterval(() => {
    gainXp()
    Game.state.stats.timePlayed++
    if (Game.state.canRefine == false) {
      refineCountdown()
    }
    if (s('.stats-container-content-wrapper').clientHeight > 0) {
      Game.buildStats()
    }
    calculateSkillCooldown()
  }, 1000)
  setInterval(() => {
    Game.save()
  }, 1000 * 30)
  updatePercentage(0)
  setInterval(() => {
    earnOPS()
  }, 1000 / 30)
  window.onresize = () => {
    drawSettingsBar()
    if (Game.items['MagnifyingGlass'].owned > 0) {
      oreClickArea()
    }
    drawSkillsContainer()
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

  if (window.navigator.platform != 'MacIntel') {
    s('.right-section').style.width = '317px'
  }
  Game.startSpecializationXp()

  // Settings area thing
  let drawSettingsBar = () => {
    let div = s('.settings-container')

    let anchorHorizontal = s('#horizontal-separator').getBoundingClientRect()
    let anchorVertical = s('#main-separator').getBoundingClientRect()

    div.style.position = 'absolute'
    div.style.top = anchorHorizontal.top - div.getBoundingClientRect().height + 'px'
    div.style.left = anchorVertical.left - div.getBoundingClientRect().width  + 'px'

    s('body').append(div)
  }

  drawSettingsBar()

  //https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript-or-jquery
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
    } else {
        isEscape = (evt.keyCode == 27);
    }
    if (isEscape) {
      if (s('.wrapper')) {
        s('.wrapper').remove()
      }
      if (s('.specialization-wrapper')) {
        s('.specialization-wrapper').remove()
      }
      if (s('.specialization-skills-wrapper')) {
        s('.specialization-skills-wrapper').remove()
      }
      if (s('.specialization-confirmation-wrapper')) {
        s('.specialization-confirmation-wrapper').remove()
      }
    }
};

  if (window.navigator.vendor != 'Google Inc.') {
    alert('Game works best on Google Chrome. Sorry if things dont work, they will be fixed on final version')
  }

}





window.onload = () => {
  Game.launch();
}

