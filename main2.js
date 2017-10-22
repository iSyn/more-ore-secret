/* =================
  HELPER FUNCTIONS
================= */
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
    Game.closeCurrentWindow()
  }
};

//https://stackoverflow.com/questions/1484506/random-color-generator
let getRandomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/* ========================
  NOW FOR THE ACTUAL GAME
======================== */


let Game = {}

Game.launch = () => {

  Game.state = {
    gems: 0,
    ores: 0,
    oreHp: 50,
    oreCurrentHp: 50,
    oresPerSecond: 0,
    oresPerClick: 0,
    opsMulti: 0,
    opcMulti: 0,
    critHitMulti: 2,
    weakHitMulti: 5,
    player: {
      lv: 1,
      str: 0,
      dex: 0,
      int: 0,
      luk: 0,
      cha: 0,
      currentXp: 0,
      xpNeeded: 100,
      availableSp: 0,
      specialization: null,
      specializationLv: 1,
      specializationXp: 0,
      specializationXpStored: 0,
      specializationXpNeeded: 300,
      specializationSp: 1,
      pickaxe: {
        name: 'Beginners Wood Pickaxe',
        rarity: 'Common',
        iLv: 1,
        material: 'Wood',
        damage: 1
      }
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
      buildingsOwned: 0
    },
    prefs: {
      volume: 0.5,
      bgm: 1,
      rockParticles: true,
      risingNumbers: true,
      scrollingText: true,
      currentVersion: '0.6.7',
      fps: 30,
      canRefined: true,
      refineTimer: 10800, // 3 hours in seconds
    }
  }

  Game.save = () => {
    localStorage.setItem('state', JSON.stringify(Game.state))
    localStorage.setItem('buildings', JSON.stringify(Game.buildings))
    localStorage.setItem('upgrades', JSON.stringify(Game.upgrades))
    localStorage.setItem('prospectorSkills', JSON.stringify(Game.prospectorSkills))
    localStorage.setItem('managerSkills', JSON.stringify(Game.managerSkills))
    localStorage.setItem('achievements', JSON.stringify(Game.achievements))
  }

  Game.load = () => {

    if (localStorage.getItem('state') !== null) {
      console.log('SAVE FILE FOUND')
      // LOAD IN STATE
      console.log('LOADING STATE')
      Game.state = JSON.parse(localStorage.getItem('state'))

      // LOAD BUILDINGS AND UPGRADES
      console.log('LOADING BUILDINGS AND UPGRADES')
      let items = []
      JSON.parse(localStorage.getItem('buildings')).forEach((building) => {items.push(building)})
      JSON.parse(localStorage.getItem('upgrades')).forEach((upgrade) => {items.push(upgrade)})
      items.forEach((item) => {new Item(item)})

      // LOAD SKILLS
      console.log('LOADING SKILLS')
      let skills = []
      JSON.parse(localStorage.getItem('prospectorSkills')).forEach((skill) => {skills.push(skill)})
      JSON.parse(localStorage.getItem('managerSkills')).forEach((skill) => {skills.push(skill)})
      skills.forEach((skill) => {new Skill(skill)})

      // LOAD ACHIEVEMENTS
      console.log('LOADING ACHIEVEMENTS')
      let achievements = []
      JSON.parse(localStorage.getItem('achievements')).forEach((achievement) => {achievements.push(achievement)})
      achievements.forEach((achievement) => {new Achievement(achievement)})

      console.log('LOADING SAVE COMPLETE')

    } else {
      console.log('NO SAVE FILE. LOADING BASE ITEMS', items)

      items.forEach((item) => {
        new Item(item)
      })

       // BUILD ALL SKILLS
      skills.forEach((skill) => {
        new Skill(skill)
      })

      // BUILD ACHIEVEMENTS
      achievements.forEach((achievement) => {
        new Achievement(achievement)
      })
    }

    // PREREQUISITES
    Game.updatePercentage(0)
    Game.showTextScroller()
    Game.rebuildStats = 1
    Game.rebuildStore = 1
    Game.rebuildInventory = 1
    Game.recalculateOpC = 1
    Game.recalculateOpS = 1
    Game.repositionSettingsContainer = 1
    if (Game.state.player.specialization) Game.redrawSkillsContainer = 1
    if (Game.state.stats.oreClicks == 0) Game.tutorialOne()
    Game.playBgm()
  }

  Game.wipe = () => {
    localStorage.clear()
    location.reload()
  }

  Game.playSound = (snd) => {
    let sfx = new Audio(`./assets/${snd}.wav`)
    sfx.volume = Game.state.prefs.volume
    sfx.play()
  }

  Game.playBgm = (volume) => {
    let selected = Math.floor(Math.random() * 4) + 1
    let bgm = new Audio(`./assets/bgm${selected}.mp3`)

    if (volume) {
      //IDK HOW TO MUTE SHIT DONT WORK I TRIED EVERYTHING
    } else {
      bgm.volume = .1
      bgm.play()
      bgm.onended = () => Game.playBgm()
    }
  }

  Game.earn = (amount) => {
    Game.state.ores += amount
    Game.updatePercentage(amount)
    Game.rebuildInventory = 1
  }

  Game.spend = (amount) => {
    Game.state.ores -= amount
    Game.state.stats.totalOresSpent += amount
  }

  Game.tutorialOne = () => {
    let div = document.createElement('div')

    div.classList.add('tutorial-container')
    div.innerHTML = `
      <div class="tutorial-text">
        <p>Click Me!</p>
      </div>
      <div class="tutorial-arrow"></div>
    `

    let anchor = s('.ore').getBoundingClientRect()

    s('body').append(div)

    div.style.top = (anchor.top + anchor.bottom)/2 + 'px'
    div.style.left = anchor.left - div.getBoundingClientRect().width + 'px'

    setTimeout(() => div.remove(), 2000)
    setTimeout(() => {if (Game.state.stats.buildingsOwned == 0) Game.tutorialTwo()}, 5000)
  }

  Game.tutorialTwo = () => {
    let div = document.createElement('div')

    div.classList.add('tutorial-container')
    div.innerHTML = `
      <div class="tutorial-text">
        <p>Don't forget to purchase buildings</p>
        <p>to increase your Ores Per Second(OpS)</p>
        <hr/>
        <p style='font-size: x-small'>(im looking at you Dylan)</p>
      </div>
      <div class="tutorial-arrow"></div>
    `

    let anchor = s('#main-separator').getBoundingClientRect()

    s('body').append(div)

    div.style.top = (anchor.top + anchor.bottom) / 5 + 'px'
    div.style.left = anchor.left  - div.getBoundingClientRect().width + 'px'

    setTimeout(() => div.remove(), 5000)
  }

  Game.calculateOpC = (type) => {
    let opc = 0
    opc += Game.state.player.pickaxe.damage

    // IF PICKAXE HAS STRENGTH
    if (Game.state.player.pickaxe.prefixStat) {
      if (Game.state.player.pickaxe.prefixStat == 'Strength') {
        // pickaxeStr = Game.state.player.pickaxe.prefixStatVal
        opc += Math.pow(1.2, Game.state.player.pickaxe.prefixStatVal)
      }
    }

    // ADD DAMAGE FROM PLAYER STRENGTH
    let playerStr = Game.state.player.str

    if (playerStr > 0) opc += Math.pow(1.25, playerStr)

    // ADD DAMAGE FROM PLAYER DEX
    let playerDex = Game.state.player.dex

    if (playerDex > 0) opc += Math.pow(1.1, playerDex)

    // ADD OPC MULTIPLIER
    opc += (opc * Game.state.opcMulti)

    Game.state.oresPerClick = opc
    Game.recalculateOpC = 0

    // OPC ACHIEVEMENTS
    if (Game.state.oresPerClick >= 1000000) Game.winAchievement('Still a Baby')
    if (Game.state.oresPerClick >= 1000000000) Game.winAchievement('Getting There')
    if (Game.state.oresPerClick >= 1000000000000) Game.winAchievement('Big Boy')
  }

  Game.calculateOpS = () => {
    let ops = 0

    for (i in Game.buildings) {
      if (Game.buildings[i].owned > 0) {
        ops += Game.buildings[i].production * Game.buildings[i].owned
      }
    }

    Game.state.oresPerSecond = ops
    Game.recalculateOpS = 0

    // OPS ACHIEVEMENTS
    if (Game.state.oresPerSecond >= 401000) Game.winAchievement('401k')
    if (Game.state.oresPerSecond >= 5000000) Game.winAchievement('Retirement Plan')
    if (Game.state.oresPerSecond >= 1000000000) Game.winAchievement('Hedge Fund')
  }

  Game.getCombo = (type) => {
    if (type) { // IF WEAK SPOT HIT
      Game.state.stats.currentCombo++
      if (Game.state.stats.currentCombo % 5 == 0) {
        Game.risingNumber(0, 'combo')
      }
      if (Game.state.stats.currentCombo > Game.state.stats.highestCombo) {
        Game.state.stats.highestCombo = Game.state.stats.currentCombo
      }

      // UNLOCK ACHIEVEMENTS REGARDING COMBOS
      if (Game.state.stats.currentCombo == 5) Game.winAchievement('Combo Pleb')
      if (Game.state.stats.currentCombo == 15) Game.winAchievement('Combo Squire')
      if (Game.state.stats.currentCombo == 40) Game.winAchievement('Combo Knight')
      if (Game.state.stats.currentCombo == 100) Game.winAchievement('Combo King')
      if (Game.state.stats.currentCombo == 300) Game.winAchievement('Combo Master')
      if (Game.state.stats.currentCombo == 666) Game.winAchievement('Combo Devil')
      if (Game.state.stats.currentCombo == 777) Game.winAchievement('Combo God')
      if (Game.state.stats.currentCombo == 1000) Game.winAchievement('Combo Saiyan')
      if (Game.state.stats.currentCombo == 10000) Game.winAchievement('Combo Saitama')


    } else { // IF REGULAR HIT
      Game.state.stats.currentCombo = 0
    }
  }

  Game.handleClick = (type) => {
    let amount = Game.state.oresPerClick
    if (type) {
      if (type == 'weak-spot') {
        Game.getCombo('hit')
        amount *= Game.state.weakHitMulti
        Game.playSound('ore-crit-hit')
        Game.risingNumber(amount, 'weak-hit')
        Game.state.stats.weakSpotHits++
        Game.gainXp(3)
      }
    } else {
      Game.getCombo()
      Game.playSound('ore-hit')
      Game.risingNumber(amount)
      Game.gainXp()
    }

    Game.earn(amount)
    Game.drawRockParticles()
    Game.state.stats.oreClicks++
    Game.state.stats.totalOresMined += amount
  }

  Game.gainXp = (amt) => {

    let amount = 1
    if (amt) {
      amount = amt
    }

    if (Game.state.player.currentXp + amount < Game.state.player.xpNeeded) {
      Game.state.player.currentXp += amount
    } else {
      Game.state.player.currentXp = (Game.state.player.currentXp + amount) - Game.state.player.xpNeeded
      Game.state.player.lv++
      Game.state.player.availableSp += 3
      Game.rebuildStats = 1
      Game.playSound('levelup')
      Game.state.player.xpNeeded = Math.ceil(Math.pow(Game.state.player.xpNeeded, 1.05))
      Game.risingNumber(0, 'level')
      s('.stats-container').style.boxShadow = '0 0 10px yellow'
      setTimeout(() => {
        s('.stats-container').style.boxShadow = 'none'
      }, 1000)
    }

    Game.rebuildInventory = 1
  }

  Game.oreWeakSpot = () => {
    let randomNumber = () => Math.floor(Math.random() * 80) + 1
    let orePos = s('.ore').getBoundingClientRect()
    let randomSign = Math.round(Math.random()) * 2 - 1
    let centerX = (orePos.left + orePos.right) / 2
    let centerY = (orePos.top + orePos.bottom) / 2
    let randomX = centerX + (randomNumber() * randomSign)
    let randomY = centerY + (randomNumber() * randomSign)

    s('.ore-weak-spot').style.left = randomX + 'px'
    s('.ore-weak-spot').style.top = randomY + 'px'
    s('.ore-weak-spot').style.display = 'block'
    Game.repositionOreWeakSpot = 0
  }

  Game.dropItem = () => {
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
          Game.pickUpItem(iLvl)
        }, 800)
      })
    }
  }

  Game.generateRandomItem = (iLvl) => {

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
      iLv: iLvl,
      damage: calculateDmg,
    }

    if (prefixName) {
      newItem['hasPrefix'] = true
      newItem['prefixStat'] = prefixStat
      newItem['prefixStatVal'] = prefixVal
    }

    return newItem
  }

  Game.pickUpItem = (iLvl) => {
    Game.state.stats.itemsPickedUp++
    Game.newItem = Game.generateRandomItem(iLvl)
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
              <p>Item Level: ${Game.newItem.iLv}</p>
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
              <p>Item Level: ${Game.state.player.pickaxe.iLv}</p>
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
      Game.recalculateOpC = 1
    }
    s('.item-modal-container').remove()
  }

  Game.risingNumber = (amount, type) => {
    if (Game.state.prefs.risingNumbers == true) {
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
      if (amount) risingNumber.innerHTML = `+${beautify(amount.toFixed(1))}`
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

      if (type == 'spendGems') {
        risingNumber.style.fontSize = 'xx-large'
        risingNumber.style.color = 'red'
        risingNumber.style.zIndex = 9999999
        risingNumber.innerHTML = '-<i style="color: red" class="fa fa-diamond fa-1x"></i>'
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
        risingNumber.style.top = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom)/2 + 'px'
        risingNumber.style.animationDuration = '3s'
        risingNumber.style.fontSize = '50px'
        risingNumber.style.color = 'crimson'
      }

      if (type == 'auto-miner') {
        risingNumber.style.left = (s('.ore').getBoundingClientRect().left + s('.ore').getBoundingClientRect().right)/2 + (randomNumber * randomSign) + 'px'
        risingNumber.style.top = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom)/2 + 'px'
      }

      if (type == 'buildings') {
        risingNumber.style.left = (s('.ore').getBoundingClientRect().left + s('.ore').getBoundingClientRect().right)/2 + (randomNumber * randomSign) + 'px'
        risingNumber.style.top = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom)/2 + 'px'
        risingNumber.style.animation = 'risingNumberBuildings 2s ease-out'
        risingNumber.style.opacity = '.4'
      }


      s('.particles').append(risingNumber)

      setTimeout(() => {
        risingNumber.remove()
      }, 2000)
    }
  }

  Game.drawRockParticles = () => {
    if (Game.state.prefs.rockParticles == true) {
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

  Game.buildStore = () => {
    let str = ''
    str += `
      <div class="upgrades-container">
    `
    let hasContent = 0
    for (i in Game.upgrades) {
      let item = Game.upgrades[i]
      if (item.hidden == 0) {
        hasContent = 1
        str += `
          <div class="upgrade-item-container" style='background-color: #b56535'>
            <div class="upgrade-item" id="${item.name.replace(/\s/g , "-")}" onclick='Game.upgrades[${i}].buy(); Game.hideTooltip()' onmouseover="Game.showTooltip({name: '${item.name}', type: '${item.type}s'})" onmouseout="Game.hideTooltip()" style='background: url(./assets/${item.pic}); background-size: 100%;'></div>
          </div>
        `
      }
    }
    if (hasContent == 0) str += `<h3 style="text-align: center; width: 100%; opacity: .5; height: 50px; line-height: 50px;">no upgrades available</h3>`
    str += `</div><div class="horizontal-separator" style='height: 8px;'></div>`

    for (i in Game.buildings) {
      let item = Game.buildings[i]
      if (item.hidden == 0) {
        str += `
          <div class="button" onclick="Game.buildings[${i}].buy()" onmouseover="Game.showTooltip({name: '${item.name}', type: '${item.type}s'})" onmouseout="Game.hideTooltip()">
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
    Game.rebuildStore = 0
    s('.tab-content').innerHTML = str
  }

  Game.buildInventory = () => {
    let str = ''
    str += `Ores: ${beautify(Game.state.ores.toFixed(1))}`
    if (Game.state.oresPerSecond > 0) {
      str += ` (${beautify(Game.state.oresPerSecond.toFixed(1))}/s)`
    }
    if (Game.state.stats.timesRefined > 0) {
      str += `<br/> Gems: ${Game.state.gems}`
    }

    s('.ores').innerHTML = str

    let lvlStr = ''
    lvlStr += `Level: ${Game.state.player.lv} (${Game.state.player.currentXp}/${Game.state.player.xpNeeded})`
    if (Game.state.player.specialization != null) {
      lvlStr += `<br/> ${Game.state.player.specialization} Level: ${Game.state.player.specializationLv} (${Game.state.player.specializationXp.toFixed(0)}/${Game.state.player.specializationXpNeeded.toFixed(0)})`
    }

    Game.rebuildInventory = 0
    s('.level').innerHTML = lvlStr
  }

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
      str += '<div class="stats-container-content-wrapper" style="height: 450px;">'
    } else {
      str += '<div class="stats-container-content-wrapper">'
    }

      str += `

        <div class="stats-container-content">

          <div class="stat-level-container">
            <h1 style='flex-grow: 1'>Level:</h1>
            <h1 class='stat-player-lvl'>${Game.state.player.lv}</h1>
          </div>

          <hr/>

          <div class="stats-container-current-equipment">
            <div onmouseover='Game.showTooltip(null, null, "equipment", "pickaxe")' onmouseout='Game.hideTooltip()' class="stats-container-current-pickaxe stats-container-equipment"></div>
            <div onmouseover='Game.showTooltip(null, null, "equipment", "accessory")' onmouseout='Game.hideTooltip()' class="stats-container-current-accessory stats-container-equipment"></div>
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
            if (Game.state.player.lv < 5) { // IF LESS THAN LV 5
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



    Game.rebuildStats = 0
    statsContainer.innerHTML = str
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

  Game.statsVisable = false

  Game.toggleStats = () => {
    if (s('.stats-container-content-wrapper').style.height == 0 || s('.stats-container-content-wrapper').style.height == '0px') {
      s('.stats-container-content-wrapper').style.height = '450px';
      s('.caret').style.transform = 'rotate(180deg)'
      Game.statsVisable = true
    } else {
      s('.stats-container-content-wrapper').style.height = 0;
      s('.caret').style.transform = 'rotate(0deg)'
      Game.statsVisable = false
    }
  }

  Game.positionSettingsContainer = () => {
    let div = s('.settings-container')

    let anchorHorizontal = s('#horizontal-separator').getBoundingClientRect()
    let anchorVertical = s('#main-separator').getBoundingClientRect()

    div.style.position = 'absolute'
    div.style.top = anchorHorizontal.top - div.getBoundingClientRect().height + 'px'
    div.style.left = anchorVertical.left - div.getBoundingClientRect().width  + 'px'

    s('body').append(div)
    Game.repositionSettingsContainer = 0
  }

  Game.unlockUpgrade = (upgradeName) => {
    let upgrade = ''
    for (i in Game.upgrades) {
      if (upgradeName == Game.upgrades[i].name)
        upgrade = Game.upgrades[i]
    }

    if (upgrade) {
      if (upgrade.owned == 0 && upgrade.hidden == 1) {
        upgrade.hidden = 0
        Game.rebuildStore = 1
      }
    }
  }

  Game.buyFunction = (item) => {
    // UNLOCK NEXT BUILDING IF THERE IS ONE
    if (item.type == 'building') {
      for (i=0; i<Game.buildings.length; i++) {
        if (Game.buildings[i].name == item.name) {
          if (Game.buildings[i+1]) {
            if (Game.buildings[i+1].hidden == 1) {
              Game.buildings[i+1].hidden = 0
            }
          }
          if (Game.buildings[i+2]) {
            if (Game.buildings[i+2].hidden == 2) {
              Game.buildings[i+2].hidden = 1
            }
          }
          if (Game.buildings[i+3]) {
            if (Game.buildings[i+3].hidden == 2) {
              Game.buildings[i+3].hidden = 1
            }
          }
        }
      }
    }

    if (item.name == 'Magnifying Glass') {
      Game.oreWeakSpot()
    }
    if (item.name == 'School') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Composition Notebooks')
      }
    }
    if (item.name == 'Farm') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Manure Spreader')
      }
    }
    if (item.name == 'Quarry') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Headlights')
      }
    }
    if (item.name == 'Church') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Scripture Reading')
      }
    }
    if (item.name == 'Factory') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Rubber Converyor Belts')
      }
    }
    if (item.name == 'Crypt') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Metal Sarcophagus')
      }
    }
    if (item.name == 'Hospital') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Immunization Shots')
      }
    }
    if (item.name == 'Citadel') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Council of Rocks')
      }
    }
    if (item.name == 'Xeno Spaceship') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Jet Fuel')
      }
    }
    if (item.name == 'Sky Castle') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Golden Eggs')
      }
    }
    if (item.name == 'Eon Portal') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Green Goop')
      }
    }
    if (item.name == 'Sacred Mines') {
      if (item.owned == 1) {
        Game.unlockUpgrade('Unholy Mineshaft')
      }
    }

    // UPGRADES
    if (item.name == 'Clean Magnifying Glass') {
      Game.state.weakHitMultiplier = 10
    }
    if (item.name == 'Polish Magnifying Glass') {
      Game.state.weakHitMultiplier = 15
    }

    // UPGRADES
    if (item.name == 'Work Boots') {
      Game.state.opsMulti += .1
      Game.state.opcMulti += .1
    }
    if (item.name == 'Painkillers') {
      Game.state.opcMultiplier += 2
      Game.unlockUpgrade('Steroids')
    }
    if (item.name == 'Steroids') {
      Game.state.opcMultiplier += 2
    }
    if (item.name == 'Composition Notebooks') {
      Game.buildings[0].production *= 2
    }
    if (item.name == 'Manure Spreader') {
      Game.buildings[1].production *= 2
    }
    if (item.name == 'Headlights') {
      Game.buildings[2].production *= 2
    }
    if (item.name == 'Scripture Reading') {
      Game.buildings[3].production *= 2
    }
    if (item.name == 'Rubber Converyor Belts') {
      Game.buildings[4].production *= 2
    }
    if (item.name == 'Metal Sarcophagus') {
      Game.buildings[5].production *= 2
    }
    if (item.name == 'Immunization Shots') {
      Game.buildings[6].production *= 2
    }
    if (item.name == 'Council Of Rocks') {
      Game.buildings[7].production *= 2
    }
    if (item.name == 'Jet Fuel') {
      Game.buildings[8].production *= 2
    }
    if (item.name == 'Golden Eggs') {
      Game.buildings[9].production *= 2
    }
    if (item.name == 'Green Goop') {
      Game.buildings[10].production *= 2
    }
    if (item.name == 'Unholy Mineshaft') {
      Game.buildings[11].production *= 2
    }
    if (item.name == 'OARDISupgrade') {
      Game.buildings[12].production *= 2
    }
  }

  soundPlayed1 = false
  soundPlayed2 = false
  soundPlayed3 = false
  soundPlayed4 = false
  soundPlayed5 = false
  let whichPic = Math.floor(Math.random() * 4) + 1
  Game.updatePercentage = (amount) => {
    let oreHpPercentage = (Game.state.oreCurrentHp/Game.state.oreHp) * 100
    if (Game.state.oreCurrentHp - amount > 0) {
      Game.state.oreCurrentHp -= amount
      if (oreHpPercentage > 80 ) {
        s('.ore').style.background = `url("./assets/ore${whichPic}-1.png")`
        s('.ore').style.backgroundSize = 'cover'
      }
      if (oreHpPercentage <= 80 && soundPlayed1 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-2.png")`
        s('.ore').style.backgroundSize = 'cover'
        Game.playSound('explosion')
        soundPlayed1 = true
      }
      if (oreHpPercentage <= 60 && soundPlayed2 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-3.png")`
        s('.ore').style.backgroundSize = 'cover'
        Game.playSound('explosion')
        soundPlayed2 = true
      }
      if (oreHpPercentage <= 40 && soundPlayed3 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-4.png")`
        s('.ore').style.backgroundSize = 'cover'
        Game.playSound('explosion')
        soundPlayed3 = true
      }
      if (oreHpPercentage <= 20 && soundPlayed4 == false) {
        s('.ore').style.background = `url("assets/ore${whichPic}-5.png")`
        s('.ore').style.backgroundSize = 'cover'
        Game.playSound('explosion')
        soundPlayed4 = true
      }
    } else {
      Game.state.stats.rocksDestroyed++
      Game.dropItem()
      Game.gainXp(10)
      Game.playSound('explosion2')
      Game.state.oreHp = Math.pow(Game.state.oreHp, 1.09)
      Game.state.oreCurrentHp = Game.state.oreHp

      if (Game.state.stats.rocksDestroyed == 1) Game.winAchievement('Newbie Miner')
      if (Game.state.stats.rocksDestroyed == 10) Game.winAchievement('Novice Miner')
      if (Game.state.stats.rocksDestroyed == 25) Game.winAchievement('Intermediate Miner')
      if (Game.state.stats.rocksDestroyed == 50) Game.winAchievement('Advanced Miner')

      soundPlayed1 = false
      soundPlayed2 = false
      soundPlayed3 = false
      soundPlayed4 = false
      soundPlayed5 = false
      whichPic = Math.floor(Math.random() * 4) + 1
      s('.ore').style.background = `url("./assets/ore${whichPic}-1.png")`
      s('.ore').style.backgroundSize = 'cover'
      s('.ore-hp').innerHTML = '100%'
    }
    s('.ore-hp').innerHTML = `${oreHpPercentage.toFixed(0)}%`
  }

  Game.prospectorSkills = []
  Game.managerSkills = []
  let Skill = function(skill) {
    this.name = skill.name
    this.type = skill.type
    this.img = skill.img
    this.specialization = skill.specialization
    this.fillerTxt = skill.fillerTxt
    this.desc = skill.desc
    this.lv = skill.lv || 0
    this.locked = skill.locked
    this.tier = skill.tier
    if (this.type == 'active') this.cooldown = skill.cooldown

    this.currentCooldown = skill.currentCooldown || 0

    this.specialization == 'Prospector' ? Game.prospectorSkills.push(this) : Game.managerSkills.push(this)
  }

  let skills = [
    {
      name: 'Heavy Smash',
      type: 'active',
      img: 'heavy-smash',
      specialization: 'Prospector',
      fillerTxt: 'Unleash your inner strength and deal a powerful smash',
      desc: 'Instantly deal a large amount of damage',
      tier: 1,
      cooldown: 10, // minutes
      locked: 0
    }, {
      name: 'Weightlifting',
      type: 'passive',
      img: 'weight-lifting-skill',
      specialization: 'Prospector',
      fillerTxt: 'I lift things up and put them down',
      desc: 'Passive STR bonus',
      tier: 2
    }, {
      name: 'Conditioning',
      type: 'passive',
      img: 'conditioning-skill',
      specialization: 'Prospector',
      fillerTxt: 'Crossfit is like totally awesome',
      desc: 'Passive DEX bonus',
      tier: 2
    }
  ]

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
    Game.drawSkillsContainer()
    Game.buildStats()
    s('.specialization-wrapper').remove()
    s('.specialization-confirmation-wrapper').remove()
    Game.specializationSkills()
    Game.startSpecializationXp()
  }

  Game.specializationSkills = () => {
    if (s('.wrapper')) s('.wrapper').remove()
    let specialization = Game.state.player.specialization
    let div = document.createElement('div')
    let str = ''
    div.classList.add('wrapper')
    if (specialization == 'Prospector') {
      str += `

      <div class="specialization-skills-container">
        <div class="specialization-skills-top">
          <h1 style='flex-grow: 1; text-align: center;'>${specialization}</h1>
          <p onclick='document.querySelector(".wrapper").remove()'>X</p>
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

      `

      for (i = 1; i <= 5; i++) {
        str += `<div class="skill-tier">`

          for (j in Game.prospectorSkills) {
            let skill = Game.prospectorSkills[j]
            if (skill.tier == i) {
              if (skill.locked == 0) {
                str += `<div class="specialization-skill" style='background-image: url("./assets/${skill.img}.png")' onclick='Game.levelUpSkill("${j}")' onmouseover='Game.renderSkillText("${j}")' onmouseout='document.querySelector(".specialization-skills-bottom-right").innerHTML = "" '></div>`
              } else {
                str += `<div class="specialization-skill" style='background-image: url("./assets/mystery.png")' onclick='Game.levelUpSkill("${j}")' onmouseover='Game.renderSkillText("${j}")' onmouseout='document.querySelector(".specialization-skills-bottom-right").innerHTML = "" '></div>`
              }
            }
          }


        str += '</div>'
      }

      str += `
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
    Game.calculateSpecializationXP()
  }

  Game.calculateSpecializationXP = () => {
    let currentXp = Game.state.player.specializationXp
    let neededXp = Game.state.player.specializationXpNeeded
    let percentage = (currentXp / neededXp) * 100
    s('.specialization-skills-xp').style.width = percentage + '%'
  }

  Game.drawSkillsContainer = () => {
    if (Game.state.player.specialization != null) {
      let div = s('.active-skills-container')
      let anchorTop = s('.inventory-section').getBoundingClientRect()
      let anchorRight = s('#main-separator').getBoundingClientRect()

      s('body').append(div)

      div.style.display = 'flex'
      div.style.top = anchorTop.bottom + 'px'
      div.style.marginTop = '10px'
      div.style.left = anchorRight.left - div.getBoundingClientRect().width + 'px'

      Game.redrawSkillsContainer = 0
      Game.drawActiveSkills()
    }
  }

  Game.drawActiveSkills = () => {
    let str = ''

    let skills;

    if (Game.state.player.specialization == 'Prospector') {
      skills = Game.prospectorSkills
    } else {
      skills = Game.managerSkills
    }

    for (i in skills) {
      if (skills[i].type == 'active') { // IF ITS AN ACTIVE SKILL
        if (skills[i].locked == 0) { // IF ITS NOT LOCKED
          if (skills[i].lv > 0) { // IF THERES POINTS IN IT
            if (skills[i].currentCooldown <= 0) {
              str += `<div class='active-skill' style='background-image: url("./assets/${skills[i].img}.png"); cursor: pointer' onclick='Game.useSkill(${i})' onmouseover='Game.showTooltip(${i}, null, "skill", null)' onmouseout='Game.hideTooltip()' ></div>`
            } else {
              str += `<div class='active-skill' style='background-image: url("./assets/${skills[i].img}.png"); cursor: not-allowed' onmouseover='Game.showTooltip(${i}, null, "skill", null)' onmouseout='Game.hideTooltip()' ></div>`
            }
          }
        }
      }
    }
    s('.active-skills-area').innerHTML = str
  }

  Game.renderSkillText = (id) => {
    let skill;

    if (Game.state.player.specialization == 'Prospector') {
      skill = Game.prospectorSkills[id]
    } else {
      skill = Game.managerSkills[id]
    }



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

  Game.levelUpSkill = (id) => {

    let skill;

    if (Game.state.player.specialization == 'Prospector') {
      skill = Game.prospectorSkills[id]
    } else {
      skill = Game.managerSkills[id]
    }

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
          Game.renderSkillText(id)
          Game.drawSkillsContainer()
        }
      }
    }
  }

  Game.useSkill = (id) => {

    let skill;

    if (Game.state.player.specialization == 'Prospector') {
      skill = Game.prospectorSkills[id]
    } else {
      skill = Game.managerSkills[id]
    }

    Game.hideTooltip()

    // if (skill.name == 'Heavy Smash') {
    //   if (skill.currentCooldown <= 0) {
    //     Game.winAchievement('Hulk Smash')
    //     playSound('heavy-smash')
    //     let orePos = s('.ore').getBoundingClientRect()
    //     skill.currentCooldown = skill.cooldown * 60
    //     calculateSkillCooldown()

    //     let div = document.createElement('div')
    //     div.classList.add('heavy-smash-wrapper')
    //     div.innerHTML = ` <div class="heavy-smash"></div>`

    //     s('body').append(div)

    //     div.classList.add('heavy-smash-anim')

    //     s('.heavy-smash').style.left = (orePos.left + orePos.right) / 2 + 'px'
    //     s('.heavy-smash').style.top = ((orePos.top + orePos.bottom) / 2) - ((s('.heavy-smash').getBoundingClientRect().top + s('.heavy-smash').getBoundingClientRect().bottom) / 2) + 'px'

    //     s('body').classList.add('roid-rage')

    //     // DO DAMAGE
    //     let amount = Math.ceil(Game.state.oreHp/2.9)
    //     earn(amount)
    //     updatePercentage(amount)
    //     risingNumber(amount, 'heavy-smash')

    //     if (Game.skills['RoidRage'].inUse == true) Game.winAchievement('Roided Smash')

    //     setTimeout(() => {
    //       s('body').classList.remove('roid-rage')
    //       div.remove()
    //     }, 500)

    //   }
    // }
    // if (skill.name == 'Roid Rage') {
    //   if (skill.inUse == false && skill.currentCooldown <= 0) {
    //     Game.winAchievement('RAOOARARRWR')
    //     skill.inUse = true
    //     skill.currentCooldown = skill.cooldown * 60
    //     calculateSkillCooldown()
    //     setTimeout(() => {
    //       skill.inUse = false
    //     }, 10000)

    //     let div = document.createElement('div')
    //     div.style.width = '100vw'
    //     div.style.height = '100vh'
    //     div.style.position = 'absolute'
    //     div.style.top = '0px'
    //     div.style.background = 'darkred'
    //     div.style.opacity = '0.2'
    //     div.style.zindex = '99999'
    //     div.style.pointerEvents = 'none'
    //     s('body').classList.add('roid-rage')

    //     s('body').append(div)

    //     setTimeout(() => {
    //       div.remove()
    //       s('body').classList.remove('roid-rage')
    //     }, 1000 * 10)
    //   }
    // }
    // if (skill.name == 'Auto-Miner 5000') {
    //   if (skill.currentCooldown <= 0) {
    //     Game.winAchievement('Beep Boop')
    //     skill.currentCooldown = skill.cooldown * 60
    //     calculateSkillCooldown()
    //     let autoMiner = setInterval(() => {
    //       console.log('running')
    //       let amount = calculateOPC()
    //       earn(amount)
    //       playSound('ore-hit')
    //       updatePercentage(amount)
    //       risingNumber(amount, 'auto-miner')
    //     }, 1000 / 15)

    //     setTimeout(() => {
    //       clearInterval(autoMiner)
    //     }, 1000 * 15)
    //   }
    // }
    // drawActiveSkills()
  }

  Game.showTooltip = (itemInfo, anchorPoint, type, stat) => {

    let item;

    // IF ITEM, GRAB SELECTED ITEM
    if (itemInfo) {
      for (i in Game[`${itemInfo.type}`]) {
        if (itemInfo.name == Game[`${itemInfo.type}`][i].name) item = Game[`${itemInfo.type}`][i]
      }
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
    } else {
      tooltip.style.top = event.clientY + 'px'
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
      let skill;

      if (Game.state.player.specialization == 'Prospector') {
        skill = Game.prospectorSkills[itemInfo]
      } else {
        skill = Game.managerSkills[itemInfo]
      }

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

    } else if (type == 'equipment'){
      anchor = s('.stats-container-content-wrapper').getBoundingClientRect()
      tooltip.style.width = 'auto'
      tooltip.style.left = anchor.right + 'px'
      tooltip.style.top = event.clientY + 'px'
      tooltip.style.minWidth = '150px'
      if (stat == 'pickaxe') {
        tooltip.innerHTML = `
          <p style='text-align: center; font-size: small;'><i>Currently Equipped</i></p>
          <hr/>
          <h3 class='${Game.state.player.pickaxe.rarity}' style='text-align: center'>${Game.state.player.pickaxe.name}</h3>
          <hr/>
          <p style='text-align: center'><i>${Game.state.player.pickaxe.rarity}</i></p>
          <hr/>
          <p>Damage: ${Game.state.player.pickaxe.damage}</p>
        `
        if (Game.state.player.pickaxe.prefixStat) {
          tooltip.innerHTML += `
            <p>${Game.state.player.pickaxe.prefixStat}: ${Game.state.player.pickaxe.prefixStatVal}</p>
          `
        }
      } else if (stat == 'accessory'){
        tooltip.innerHTML = `
            <p>You don't have a trinket</p>
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
        if (item.type == 'building') {
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
    //
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
          <p style='padding-right: 10px;'>SFX Volume: </p>
          <input class='volume-slider' type="range" min=0 max=1 step=0.1 list='tickmarks' onchange='Game.state.prefs.volume = document.querySelector(".volume-slider").value'/>
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
        <div class="single-setting">
          <p style='padding-right: 20px;'>Background Music: </p>
          <input type="radio" name='bgm' id='bgmOn' value='true' onchange='Game.state.prefs.bgm = 1; Game.playBgm()'/>
            <label for="bgmOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='bgm' id='bgmOff' value='false' onchange='Game.state.prefs.bgm = 0; Game.playBgm("muted")'/>
            <label for="bgmOff" style='margin-right: 10px'>Off</label>
        </div>
        <hr/>
        <br/>
        <p>Video</p>
        <div class="single-setting">
          <p style='padding-right: 20px;'>Enable Rock Particles:</p>
          <input type="radio" name='rockParticles' id='rockParticlesOn' value='true' onchange='Game.state.prefs.rockParticles = true'/>
            <label for="rockParticlesOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='rockParticles' id='rockParticlesOff' value='false' onchange='Game.state.prefs.rockParticles = false' />
            <label for="rockParticlesOff">Off</label>
        </div>
        <div class="single-setting">
          <p style='padding-right: 20px;'>Enable Rising Numbers:</p>
          <input type="radio" name='risingNumbers' id='risingNumbersOn' value='true' onchange='Game.state.prefs.risingNumbers = true'/>
            <label for="risingNumbersOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='risingNumbers' id='risingNumbersOff' value='false' onchange='Game.state.prefs.risingNumbers = false' />
            <label for="risingNumbersOff">Off</label>
        </div>
        <hr/>
        <br/>
        <p>Miscellaneous</p>
        <div class="single-setting">
          <p style='padding-right: 20px;'>Enable Scrolling Text:</p>
          <input type="radio" name='scrollingText' id='scrollingTextOn' value='true' onchange='Game.state.prefs.scrollingText = true'/>
            <label for="scrollingTextOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='scrollingText' id='scrollingTextOff' value='false' onchange='Game.state.prefs.scrollingText = false' />
            <label for="scrollingTextOff">Off</label>
        </div>
        <hr/>
      </div>

    `
    div.innerHTML = str

    s('body').append(div)
    s('.volume-slider').value = Game.state.prefs.volume

    Game.state.prefs.bgm == true ? s('#bgmOn').checked = true : s('#bgmOff').checked = true
    Game.state.prefs.rockParticles == true ? s('#rockParticlesOn').checked = true : s('#rockParticlesOff').checked = true
    Game.state.prefs.risingNumbers == true ? s('#risingNumbersOn').checked = true : s('#risingNumbersOff').checked = true
    Game.state.prefs.scrollingText == true ? s('#scrollingTextOn').checked = true : s('#scrollingTextOff').checked = true
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

  Game.uniqueTrinkets = [
    {
      name: 'Tome of Higher Learning',
      desc: 'Doubles xp gain per click',
      rarity: 'Mythic',
      img: 'wip.png',
      price: 15,
      owned: 0
    },{
      name: 'Discount Card',
      desc: 'All store items are 10% cheaper',
      rarity: 'Mythic',
      img: 'wip.png',
      price: 15,
      owned: 0
    }, {
      name: 'Earrings of Alacrity',
      desc: 'Double cast skills',
      rarity: 'Mythic',
      img: 'wip.png',
      price: 10,
      owned: 0
    }, {
      name: 'Golden Apple',
      desc: 'Permanantly increases School production by 5x',
      // rarity: 'Mythic',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'School',
        amount: 5
      },
      price: 1,
      owned: 0
    }, {
      name: 'Diamond Tow Truck',
      desc: 'Permanantly increases Farm production by 5x',
      // rarity: 'Mythic',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'Farm',
        amount: 5
      },
      price: 1,
      owned: 0
    }, {
      name: 'Quarry name-in-progress',
      desc: 'Permanantly increases Quarry production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'Quarry',
        amount: 5
      },
      price: 2,
      owned: 0
    }, {
      name: 'Church name-in-progress',
      desc: 'Permanantly increases Church production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'Church',
        amount: 5
      },
      price: 2,
      owned: 0
    }, {
      name: 'Factory name-in-progress',
      desc: 'Permanantly increases Factory production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'Factory',
        amount: 5
      },
      price: 3,
      owned: 0
    }, {
      name: 'Crypt name-in-progress',
      desc: 'Permanantly increases Crypt production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'Crypt',
        amount: 5
      },
      price: 3,
      owned: 0
    }, {
      name: 'Hospital name-in-progress',
      desc: 'Permanantly increases Hospital production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'Hospital',
        amount: 5
      },
      price: 4,
      owned: 0
    }, {
      name: 'Xeno Spaceship name-in-progress',
      desc: 'Permanantly increases Xeno Spaceship production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'XenoSpaceship',
        amount: 5
      },
      price: 4,
      owned: 0
    }, {
      name: 'Sky Castle name-in-progress',
      desc: 'Permanantly increases Sky Castle production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'SkyCastle',
        amount: 5
      },
      price: 5,
      owned: 0
    }, {
      name: 'Eon Portal name-in-progress',
      desc: 'Permanantly increases Eon Portal production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'EonPortal',
        amount: 5
      },
      price: 5,
      owned: 0
    }, {
      name: 'Sacred Mines name-in-progress',
      desc: 'Permanantly increases Sacred Mines production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'SacredMines',
        amount: 5
      },
      price: 6,
      owned: 0
    }, {
      name: 'O.A.R.D.I.S. name-in-progress',
      desc: 'Permanantly increases O.A.R.D.I.S production by 5x',
      img: 'wip.png',
      type: {
        type: 'Building Multiplier',
        building: 'O.A.R.D.I.S.',
        amount: 5
      },
      price: 7,
      owned: 0
    }
  ]

  Game.generateRefinedStoreItems = () => {
    Game.state.currentRefinedStoreItems = []
    // % of unique trinket
    let uniqueChance = .1
    let suffixChance = .3
    let prefixChance = .5
    let cost = 1
    let amountOfStats = 1
    let iLvl = Math.floor(Math.random() * Game.state.stats.timesRefined) + 1
    let multi = 0
    let unique = true

    // GENERATE 4 ITEMS
    while (Game.state.currentRefinedStoreItems.length < 4) {
      let randomUnique = Game.uniqueTrinkets[Math.floor(Math.random() * Game.uniqueTrinkets.length)]
      Game.state.currentRefinedStoreItems.push(randomUnique)
    }
  }

  Game.generateRefinedStoreItems()

  Game.selectedRefineTab = 'trinkets'
  Game.showRefinedStore = () => {
    let div = document.createElement('div')
    div.classList.add('wrapper')
    let str = ''

    let items = Game.state.currentRefinedStoreItems

    str += `
        <div class="refined-store-container">
          <div class="refined-store-top">
            <p onclick='document.querySelector(".wrapper").remove()' style='position: absolute; right: 5px; top: 1px; cursor: pointer'>x</p>
            <h1 style='flex-grow: 1; text-align: center;'>Refined Store</h1>
            <h3 style='padding-right: 20px;'><i style='color:#00c0ff' class='fa fa-diamond fa-1x'></i> ${Game.state.gems}</h3>
          </div>
          <hr/>
          <div class="refined-store-middle">
            <p onclick='Game.changeRefineTab("trinkets")' id='trinkets-tab' class='refine-tab selected'>Trinkets</p>
            <p onclick='Game.changeRefineTab("potions")' id='potions-tab' class='refine-tab' >Potions</p>
            <p onclick='Game.changeRefineTab("gems")' id='gems-tab' class='refine-tab' >Gems</p>
          </div>
          <hr/>
          <div class="refined-store-bottom"></div>
          <div class="refined-store-refresh-btn"></div>
        </div>
    `

    div.innerHTML = str
    s('body').append(div)
    Game.changeRefineTab('trinkets')
  }

  Game.changeRefineTab = (selectedTab) => {
    let tabs = document.querySelectorAll('.refine-tab')
    tabs.forEach((tab) => tab.classList.remove('selected'))

    s(`#${selectedTab}-tab`).classList.add('selected')

    let str = ''
    if (selectedTab == 'trinkets') {
      s('.refined-store-refresh-btn').innerHTML = '<button onclick="Game.refreshItems()">REFRESH <i class="fa fa-diamond fa-1x"></i> 1</button>'
      for (i=0; i<Game.state.currentRefinedStoreItems.length; i++) {
        let item = Game.state.currentRefinedStoreItems[i]
        str += `
            <div class="refined-store-item ${item.rarity}" onclick='Game.confirmBuyRefinedItem("${item.name}")'>
              <div class="refined-store-item-top"></div>
              <div class="refined-store-item-bottom" style='text-align: center'>
                <h2>${item.name}</h2>
                <hr/>
                <p style='color: white; padding: 5px;'>${item.desc}</p>
                <hr/>
                <p style='color: white; margin-top: 20px;'>Cost: <i class='fa fa-diamond fa-1x' style="color:#00c0ff"></i> ${item.price}</p>
              </div>
            </div>
        `
      }
    } else {
      s('.refined-store-refresh-btn').innerHTML = ''
      str = ''
    }

    s('.refined-store-bottom').innerHTML = str
  }

  Game.confirmBuyRefinedItem = (itemName) => {
    let selectedItem = ''
    for (i=0; i<Game.uniqueTrinkets.length; i++) {
      if (Game.uniqueTrinkets[i].name == itemName) {
        selectedItem = Game.uniqueTrinkets[i]
      }
    }

    if (selectedItem) {
      let div = document.createElement('div')
      div.classList.add('wrapper')

      div.innerHTML = `
        <div class="confirm-buy-refined-item">
          <h3>Confirm</h3>
          <hr/>
          <p>Are you sure you want to buy <strong>${selectedItem.name}</strong> for <strong><i class='fa fa-diamond fa-1x'></i> ${selectedItem.price}</strong>?</p>
          <hr/>
          <button onclick='Game.buyRefinedItem("${selectedItem.name}")'>Yes</button>
          <button onclick='let wrappers = document.querySelectorAll(".wrapper"); wrappers[1].remove()'>No</button>
        </div>
      `

      s('body').append(div)
    }
  }

  Game.buyRefinedItem = (itemName) => {
    let selectedItem = ''
    for (i=0; i<Game.uniqueTrinkets.length; i++) {
      if (Game.uniqueTrinkets[i].name == itemName) {
        selectedItem = Game.uniqueTrinkets[i]
      }
    }

    if (selectedItem) { // IF THERE IS A SELECTED ITEM
      if (Game.state.gems >= selectedItem.price) { // IF YOU HAVE ENOUGH MONEY
        Game.state.gems -= selectedItem.price
        risingNumber(0, 'spendGems')
        Game.closeCurrentWindow()
        if (selectedItem.type) {
          if (selectedItem.type.type == 'Building Multiplier') {
            Game.items[selectedItem.type.building].production *= selectedItem.type.amount
          }
        }
        if (selectedItem.name == 'Tome of Higher Learning') {
          //
        }
        if (selectedItem.name == 'Discount Card') {
          for (i in Game.items) {
            if (Game.items[i].type == 'item') {
              Game.items[i].price -= Game.items[i].price * .1
              buildStore()
            }
          }
        }
        if (selectedItem.name == 'Earrings of Alacrity') {
          //
        }
      }
    }
  }

  Game.refreshItems = () => {
    if (Game.state.gems >= 1) {
      Game.state.gems -= 1
      s('.wrapper').remove()
      Game.generateRefinedStoreItems()
      Game.showRefinedStore()
    }
  }

  Game.closeCurrentWindow = () => {
    if (s('.wrapper')) {
      let wrappers = document.querySelectorAll('.wrapper')
      let newest = wrappers.length -1

      if (wrappers.length > 1) {
        wrappers[newest].remove()
      } else {
        wrappers.forEach((wrapper) => wrapper.remove())
      }
    }

    if (s('.specialization-wrapper')) s('.specialization-wrapper').remove()
    if (s('.specialization-skills-wrapper')) s('.specialization-skills-wrapper').remove()
    if (s('.specialization-confirmation-wrapper')) s('.specialization-confirmation-wrapper').remove()
  }

  Game.achievements = []
  let Achievement = function(obj) {
    this.name = obj.name
    this.desc = obj.desc
    this.won = obj.won || 0
    if (obj.reward) this.reward = obj.reward

    Game.achievements.push(this)
  }

  let achievements = [
    // MINING RELATED ACHIEVEMENTS
    {name: 'Newbie Miner', desc: 'Break your first rock'},
    {name: 'Novice Miner', desc: 'Break 10 rocks'},
    {name: 'Intermediate Miner', desc: 'Break 25 rocks'},
    {name: 'Advanced Miner', desc: 'Break 50 rocks'},

    // COMBO RELATED ACHIEVEMENTS
    {name: 'Combo Pleb', desc: 'Reach 5 hit combo'},
    {name: 'Combo Squire', desc: 'Reach 15 hit combo'},
    {name: 'Combo Knight', desc: 'Reach 40 hit combo'},
    {name: 'Combo King', desc: 'Reach 100 hit combo'},
    {name: 'Combo Master', desc: 'Reach 300 hit combo'},
    {name: 'Combo Devil', desc: 'Reach 666 hit combo'},
    {name: 'Combo God', desc: 'Reach 777 hit combo'},
    {name: 'Combo Saiyan', desc: 'Reach 1000 hit combo'},
    {name: 'Combo Saitama', desc: 'Reach 10000 hit combo'},

    // OPC ACHIEVEMENTS
    {name: 'Still a Baby', desc: 'Deal more than 1,000,000 in one hit'},
    {name: 'Getting There', desc: 'Deal more than 1,000,000,000 in one hit'},
    {name: 'Big Boy', desc: 'Deal more than 1,000,000,000,000 in one hit'},

    // OPS ACHIEVEMENTS
    {name: '401k', desc: 'Earn 401,000 ores per second'},
    {name: 'Retirement Plan', desc: 'Earn 5,000,000 OpS'},
    {name: 'Hedge Fund', desc: 'Earn 1,000,000,000 OpS'},

    // REFINE ACHIEVEMENTS
    {name: 'Blacksmiths Apprentice', desc: 'Refine for your first time'},

    // SKILL ACHIEVEMENTS
    {name: 'Hulk Smash', desc: 'Use the skill Heavy Smash for the first time'},
    {name: 'Roided Out', desc: 'Use the skill Roid Rage for the first time'},
    {name: 'Beep Boop', desc: 'Use the skill Auto-Miner 5000 for the first time'},
    {name: 'Roided Smash', desc: 'Use the skill Heavy Smash while Roid Rage is active'}
  ]

  Game.winAchievement = (achievementName) => {
    let selectedAchievement;
    for (i in Game.achievements) {
      if (Game.achievements[i].name == achievementName) {
        selectedAchievement = Game.achievements[i]
        break
      }
    }

    if (selectedAchievement.won == 0) {
      selectedAchievement.won = 1
      let div = document.createElement('div')
      div.classList.add('achievement')

      let str = `
        <h3>Achievement Unlocked</h3>
        <h1>${selectedAchievement.name}</h1>
        <p>${selectedAchievement.desc}</p>
      `
      if (selectedAchievement.reward) {
        str += `
          <p>reward: bleh</p>
        `
      }

      div.innerHTML = str
      s('body').append(div)

      setTimeout(() => {
        div.remove()
      }, 3000)
    }
  }

  Game.logic = () => {
    // HANDLE ORES N SHIT
    if (Game.recalculateOpC) Game.calculateOpC()
    if (Game.recalculateOpS) Game.calculateOpS()
    let ops = Game.state.oresPerSecond/Game.state.prefs.fps
    Game.earn(ops)

    // BUILD STORE & INVENTORY
    if (Game.rebuildStore) Game.buildStore()
    if (Game.rebuildInventory) Game.buildInventory()

    // REPOSITION SHIT
    if (Game.repositionSettingsContainer) Game.positionSettingsContainer()
    if (Game.repositionOreWeakSpot) Game.oreWeakSpot()
    if (Game.rebuildStats) Game.buildStats()
    if (Game.redrawSkillsContainer) Game.drawSkillsContainer()

    // UNLOCK SHIT
    if (Game.state.stats.oreClicks >= 5 && Game.upgrades[0].owned == 0) Game.unlockUpgrade('Magnifying Glass')
    if (Game.state.stats.weakSpotHits >= 5 && Game.upgrades[1].owned == 0) Game.unlockUpgrade('Clean Magnifying Glass')
    if (Game.state.stats.weakSpotHits >= 20 && Game.upgrades[1].owned == 1 && Game.upgrades[2].owned == 0) Game.unlockUpgrade('Polish Magnifying Glass')

    setTimeout(Game.logic, 1000/Game.state.prefs.fps)
  }

  setInterval(() => {if (Game.state.oresPerSecond) Game.risingNumber(Game.state.oresPerSecond, 'buildings')}, 1000)

  Game.buildings = []
  Game.upgrades = []
  let Item = function(item) {
    this.name = item.name
    if (item.namePlural) this.namePlural = item.namePlural
    this.type = item.type
    this.pic = item.pic
    if (item.production) this.production = item.production
    this.desc = item.desc
    this.fillerQuote = item.fillerQuote
    item.price ? this.price = item.price : this.price = item.basePrice
    if (item.basePrice) this.basePrice = item.basePrice
    this.hidden = item.hidden
    this.owned = item.owned || 0

    this.buy = () => {
      if (Game.state.ores >= this.price) {
        if (this.type == 'upgrade') {
          this.hidden = 2
        } else {
          Game.state.stats.buildingsOwned++
        }
        Game.spend(this.price)
        Game.playSound('buysound')
        Game.risingNumber(null, 'spendMoney')
        this.owned++
        Game.buyFunction(this)
        this.price = this.basePrice * Math.pow(1.15, this.owned)
        Game.recalculateOpC = 1
        Game.recalculateOpS = 1
        Game.rebuildStore = 1
      }
    }
    this.type == 'building' ? Game.buildings.push(this) : Game.upgrades.push(this)
  }

  let items = [
    //BUILDINGS
    {name: 'School', namePlural: 'Schools', type: 'building', pic: 'school.png', production: .3, desc: 'Teach students about the wonders of ores', fillerQuote: 'Jesus Christ Marie, they\'re minerals!', basePrice: 6, hidden: 0},
    {name: 'Farm', namePlural: 'Farms', type: 'building', pic: 'farm.png', production: 1, desc: 'Cultivate the lands for higher quality ores', fillerQuote: 'This totally makes sense.', basePrice: 75, hidden: 1},
    {name: 'Quarry', namePlural: 'Quarries', type: 'building', pic: 'quarry.png', production: 20, desc: 'Designated mining area', fillerQuote: 'mine mine mine', basePrice: 1200, hidden: 1},
    {name: 'Church', namePlural: 'Churches', type: 'building', pic: 'church.png', production: 300, desc: 'Praise to the Ore Gods', fillerQuote: 'In Ore name we pray, Amen.', basePrice: 6660, hidden: 2},
    {name: 'Factory', namePlural: 'Factories', type: 'building', pic: 'factory.png', production: 5500, desc: 'Manufacture your ores', fillerQuote: 'Assembly line this sh&* up!', basePrice: 48000, hidden: 2},
    {name: 'Crypt', namePlural: 'Crypts', type: 'building', pic: 'crypt.png', production: 30000, desc: 'Raise dead ores from the graves', fillerQuote: 'spooky ores', basePrice: 290000, hidden: 2},
    {name: 'Hospital', namePlural: 'Hospitals', type: 'building', pic: 'hospital.png', production: 220000, desc: 'Heal your damaged ores', fillerQuote: 'An apple a day keeps the ore cancer away', basePrice: 1000000, hidden: 2},
    {name: 'Citadel', namePlural: 'Citadels', type: 'building', pic: 'citadel.png', production: 1666666, desc: 'wip', fillerQuote: 'wip', basePrice: 66666666, hidden: 2},
    {name: 'Xeno Spaceship', namePlural: 'Xeno Spaceships', type: 'building', pic: 'xeno-spaceship.png', production: 45678910, desc: 'wip', fillerQuote: 'wip', basePrice: 758492047, hidden: 2},
    {name: 'Sky Castle', namePlural: 'Sky Castles', type: 'building', pic: 'wip.png', production: 777777777, desc: 'wip', fillerQuote: 'wip', basePrice: 5500000000, hidden: 2},
    {name: 'Eon Portal', namePlural: 'Eon Portal', type: 'building', pic: 'wip.png', production: 8888800000, desc: 'wip', fillerQuote: 'wip', basePrice: 79430000000, hidden: 2},
    {name: 'Sacred Mine', namePlural: 'Sacred Mines', type: 'building', pic: 'wip.png', production: 40501030500, desc: 'wip', fillerQuote: 'wip', basePrice: 300000000000, hidden: 2},
    {name: 'O.A.R.D.I.S.', namePlural: 'O.A.R.D.I.S.s', type: 'building', pic: 'wip.png', production: 110100110110, desc: 'wip', fillerQuote: 'wip', basePrice: 9999999999999, hidden: 2},
    //UPGRADES
    {name: 'Magnifying Glass', type: 'upgrade', pic: 'magnifying-glass.png', desc: 'Allows you to spot weakpoints inside the rock', fillerQuote: 'These sure will help...', price: 5, hidden: 1},
    {name: 'Clean Magnifying Glass', type: 'upgrade', pic: 'clean-magnifying-glass.png', desc: 'Increases critical hit multiplier to 10x', fillerQuote: 'wip', price: 100, hidden: 1},
    {name: 'Polish Magnifying Glass', type: 'upgrade', pic: 'wip.png', desc: 'Increases critical hit multiplier to 15x', fillerQuote: 'wip', price: 50000, hidden: 1},
    {name: 'Composition Notebooks', type: 'upgrade', pic: 'compositionnotebook.png', desc: 'Doubles the production of Schools', fillerQuote: 'wip', price: 80, hidden: 1},
    {name: 'Manure Spreader', type: 'upgrade', pic: 'manure-spreader.png', desc: 'Doubles the production of Farms', fillerQuote: 'wip', price: 950, hidden: 1},
    {name: 'Headlights', type: 'upgrade', pic: 'headlights.png', desc: 'Doubles the production of Quarrys', fillerQuote: 'wip', price: 1900, hidden: 1},
    {name: 'Scripture Reading', type: 'upgrade', pic: 'scripture-reading.png', desc: 'Doubles the production of Churches', fillerQuote: 'wip', price: 60000, hidden: 1},
    {name: 'Rubber Converyor Belts', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Factories', fillerQuote: 'wip', price: 300000, hidden: 1},
    {name: 'Metal Sarcophagus', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Crypt', fillerQuote: 'wip', price: 5200000, hidden: 1},
    {name: 'Immunization Shots', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Hospitals', fillerQuote: 'wip', price: 10000000, hidden: 1},
    {name: 'Council of Rocks', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Citadel', fillerQuote: 'wip', price: 400000000, hidden: 1},
    {name: 'Jet Fuel', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Xeno Spaceships', fillerQuote: 'wip', price: 5500000000, hidden: 1},
    {name: 'Golden Eggs', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Sky Castles', fillerQuote: 'wip', price: 95000000000, hidden: 1},
    {name: 'Green Goop', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Eon Portals', fillerQuote: 'wip', price: 150000000000, hidden: 1},
    {name: 'Unholy Mineshaft', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Sacred Mines', fillerQuote: 'wip', price: 2200000000000, hidden: 1},
    {name: 'OARDISupgrade', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of OARDIS ', fillerQuote: 'wip', price: 50000000000000, hidden: 1},
    {name: 'Work Boots', type: 'upgrade', pic: 'workboots.png', desc: 'Increase all ore production by 1%', fillerQuote: 'wip', price: 500, hidden: 1},
    {name: 'Painkillers', type: 'upgrade', pic: 'painkillers.png', desc: 'double your OpC', fillerQuote: 'wip', price: 15000, hidden: 1},
    {name: 'Steroids', type: 'upgrade', pic: 'steroids.png', desc: 'double your OpC', fillerQuote: 'wip', price: 1000000, hidden: 1},
    {name: 'Flashlight', type: 'upgrade', pic: 'wip.png', desc: 'Gain 10% of your OpS as OpC', fillerQuote: 'wip', price: 50000, hidden: 1},
  ]

  textScroller = [
    'What is a rocks favorite fruit? ... Pom-a-granite',
    'Did you see that cleavage? Now that\'s some gneiss schist.',
    'All rock and no clay makes you a dull boy (or girl)',
    'Don\'t take life for granite',
    'What happens when you throw a blue rock in the red sea? ... It gets wet',
  ]

  Game.showTextScroller = (text) => {

    let scrollTime = 20 // 20seconds

    if (Game.state.prefs.scrollingText == true) {
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
        Game.showTextScroller()
      }, scrollTime * 1000)
    }
  }

  Game.load()
  Game.logic()

  s('.ore').onclick = () => Game.handleClick()
  s('.ore-weak-spot').onclick = () => {Game.handleClick('weak-spot'); Game.oreWeakSpot()}
  s('.bottom').addEventListener('mouseover', () => {
    if (Game.state.player.lv < 10) {
      s('.bottom-overlay-txt').innerHTML = `<i class='fa fa-lock fa-1x' style='margin-right: 10px'></i>QUESTS NOT YET IMPLEMENTED`
    } else {
      s('.bottom-overlay-txt').style.display = 'none'
    }
  })
  s('#main-separator').onclick = () => {
    Game.state.ores += 99999999
    Game.gainXp(999)
    Game.state.player.gems += 999
    Game.state.player.specializationSp += 999
  }

  window.onresize = () => {
    Game.repositionSettingsContainer = 1
    Game.repositionOreWeakSpot = 1
    Game.rebuildStats = 1
    Game.redrawSkillsContainer = 1
  }


}

window.onload = () => {
  Game.launch()
}
