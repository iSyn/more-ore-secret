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
    },
    prefs: {
      volume: 0.5,
      rockParticles: true,
      risingNumbers: true,
      scrollingText: true,
      currentVersion: '0.6.7',
      fps: 30,
      canRefined: true,
      refineTimer: 10800 // 3 hours in seconds
    }
  }

  Game.save = () => {
    //
    //
  }

  Game.load = () => {
    items.forEach((item) => {
      new Item(item)
    })

    Game.updatePercentage()
    Game.rebuildStore = 1
    Game.rebuildInventory = 1
    Game.recalculateOpC = 1
    Game.recalculateOpS = 1
    Game.repositionSettingsContainer = 1
  }

  Game.wipe = () => {
    //
    //
  }

  Game.playSound = (snd) => {
    let sfx = new Audio(`./assets/${snd}.wav`)
    sfx.volume = Game.state.prefs.volume
    sfx.play()
  }

  Game.earn = (amount) => {
    //
    Game.state.ores += amount
    Game.updatePercentage(amount)
    Game.rebuildInventory = 1
  }

  Game.spend = (amount) => {
    //
    Game.state.ores -= amount
  }

  Game.calculateOpC = (type) => {
    let opc = 0
    opc += Game.state.player.pickaxe.damage
    Game.state.oresPerClick = opc
    Game.recalculateOpC = 0
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
  }

  Game.handleClick = (type) => {
    let amount = Game.state.oresPerClick
    if (type) {
      if (type == 'weak-spot') {
        amount *= Game.state.weakHitMulti
        Game.playSound('ore-crit-hit')
        Game.risingNumber(amount, 'weak-hit')
        Game.state.stats.weakSpotHits++
      }
    } else {
      Game.playSound('ore-hit')
      Game.risingNumber(amount)
    }

    Game.earn(amount)
    Game.drawRockParticles()
    Game.state.stats.oreClicks++
    Game.state.stats.totalOresMined += amount
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
            <div class="upgrade-item" onclick='Game.upgrades[${i}].buy()' onmouseover="Game.showTooltip({name: '${item.name}', type: '${item.type}s'})" onmouseout="Game.hideTooltip()" style='background: url(./assets/${item.pic}); background-size: 100%;'></div>
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

  Game.positionSettingsContainer = () => {
    let div = s('.settings-container')

    let anchorHorizontal = s('#horizontal-separator').getBoundingClientRect()
    let anchorVertical = s('#main-separator').getBoundingClientRect()

    div.style.position = 'absolute'
    div.style.top = anchorHorizontal.top - div.getBoundingClientRect().height + 'px'
    div.style.left = anchorVertical.left - div.getBoundingClientRect().width  + 'px'

    s('body').append(div)
    Game.repositionSettingsContainer = 1
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

    if (amount) {
      if (Game.state.oreCurrentHp - amount > 0) {
        Game.state.oreCurrentHp -= amount
      } else {
        Game.state.stats.rocksDestroyed++
        // Game.gainXp(10)
        Game.playSound('explosion2')
        Game.state.oreHp = Math.pow(Game.state.oreHp, 1.09)
        Game.state.oreCurrentHp = Game.state.oreHp
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
    }

    s('.ore-hp').innerHTML = `${oreHpPercentage.toFixed(0)}%`

    if (oreHpPercentage > 80 ) {
      s('.ore').style.background = `url("./assets/ore${whichPic}-1.png")`
      s('.ore').style.backgroundSize = 'cover'
    }
    if (oreHpPercentage <= 80 && Game.soundPlayed1 == false) {
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

    // UNLOCK SHIT
    if (Game.state.stats.oreClicks >= 2 && Game.upgrades[0].owned == 0) Game.unlockUpgrade('Magnifying Glass')
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
    this.price = item.price
    if (item.basePrice) this.basePrice = item.basePrice
    this.hidden = item.hidden
    this.owned = item.owned || 0

    this.buy = () => {
      if (Game.state.ores >= this.price) {
        if (this.type == 'upgrade') this.hidden = 2
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
    {name: 'School', namePlural: 'Schools', type: 'building', pic: 'school.png', production: .3, desc: 'Teach students about the wonders of ores', fillerQuote: 'Jesus Christ Marie, they\'re minerals!', price: 6, basePrice: 6, hidden: 0},
    {name: 'Farm', namePlural: 'Farms', type: 'building', pic: 'farm.png', production: 1, desc: 'Cultivate the lands for higher quality ores', fillerQuote: 'This totally makes sense.', price: 75, basePrice: 75, hidden: 1},
    {name: 'Quarry', namePlural: 'Quarries', type: 'building', pic: 'quarry.png', production: 20, desc: 'Designated mining area', fillerQuote: 'mine mine mine', price: 1200, basePrice: 1200, hidden: 1},
    {name: 'Church', namePlural: 'Churches', type: 'building', pic: 'church.png', production: 300, desc: 'Praise to the Ore Gods', fillerQuote: 'In Ore name we pray, Amen.', price: 6660, basePrice: 6660, hidden: 2},
    {name: 'Factory', namePlural: 'Factories', type: 'building', pic: 'factory.png', production: 5500, desc: 'Manufacture your ores', fillerQuote: 'Assembly line this sh&* up!', price: 48000, basePrice: 48000, hidden: 2},
    {name: 'Crypt', namePlural: 'Crypts', type: 'building', pic: 'crypt.png', production: 30000, desc: 'Raise dead ores from the graves', fillerQuote: 'spooky ores', price: 290000, basePrice: 290000, hidden: 2},
    {name: 'Hospital', namePlural: 'Hospitals', type: 'building', pic: 'hospital.png', production: 220000, desc: 'Heal your damaged ores', fillerQuote: 'An apple a day keeps the ore cancer away', price: 1000000, basePrice: 1000000, hidden: 2},
    {name: 'Citadel', namePlural: 'Citadels', type: 'building', pic: 'citadel.png', production: 1666666, desc: 'wip', fillerQuote: 'wip', price: 66666666, basePrice: 66666666, hidden: 2},
    {name: 'Xeno Spaceship', namePlural: 'Xeno Spaceships', type: 'building', pic: 'xeno-spaceship.png', production: 45678910, desc: 'wip', fillerQuote: 'wip', price: 758492047, basePrice: 758492047, hidden: 2},
    {name: 'Sky Castle', namePlural: 'Sky Castles', type: 'building', pic: 'wip.png', production: 777777777, desc: 'wip', fillerQuote: 'wip', price: 5500000000, basePrice: 5500000000, hidden: 2},
    {name: 'Eon Portal', namePlural: 'Eon Portal', type: 'building', pic: 'wip.png', production: 8888800000, desc: 'wip', fillerQuote: 'wip', price: 79430000000, basePrice: 79430000000, hidden: 2},
    {name: 'Sacred Mine', namePlural: 'Sacred Mines', type: 'building', pic: 'wip.png', production: 40501030500, desc: 'wip', fillerQuote: 'wip', price: 300000000000, basePrice: 300000000000, hidden: 2},
    {name: 'O.A.R.D.I.S.', namePlural: 'O.A.R.D.I.S.s', type: 'building', pic: 'wip.png', production: 110100110110, desc: 'wip', fillerQuote: 'wip', price: 9999999999999, basePrice: 9999999999999, hidden: 2},
    //UPGRADES
    {name: 'Magnifying Glass', type: 'upgrade', pic: 'magnifying-glass.png', desc: 'Allows you to spot weakpoints inside the rock', fillerQuote: 'These sure will help...', price: 1, hidden: 1},
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

  Game.load()
  Game.logic()

  s('.ore').onclick = () => Game.handleClick()
  s('.ore-weak-spot').onclick = () => {Game.handleClick('weak-spot'); Game.oreWeakSpot()}
  window.onresize = () => {Game.repositionSettingsContainer = 1; Game.repositionOreWeakSpot = 1}


}

window.onload = () => {
  Game.launch()
}
