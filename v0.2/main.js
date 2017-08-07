// Helper Functions
let s = ((el) => {return document.querySelector(el)})

let Game = {}

Game.Launch = () => {
  console.log('Game loaded and launched')

  Game.ores = 9999
  Game.refined = 9999
  Game.wood = 9999
  Game.gold = 9999
  Game.miners = 0
  Game.smelters = 0
  Game.lumberjacks = 0
  Game.adventurers = 0

  Game.totalOreClicks = 0
  Game.totalTreeClicks = 0

  Game.oresPerClick = 99
  Game.woodPerClick = 99
  Game.goldPerClick = 1
  Game.damagePerClick = 1
  Game.damagePerSeconds = 0

  Game.priceIncrease = 1.15
  Game.smeltTime = 2
  Game.goldChance = .1
  Game.selectedTab = 0
  Game.sessionTime = 0

  Game.hasQuests = false

  Game.earn = (amt, type) => {
    Game[type] += amt
    Game.unlockStuff()
    Game.risingNumber(amt, type)
  }

  Game.spend = (amt, type) => {
    Game[type] -= amt
  }

  Game.getGold = () => {
    let number = Math.random()
    if (number < Game.goldChance) {
      Game.earn(Game.goldPerClick, 'gold')
    }
  }

  Game.oreClick = () => {
    Game.totalOreClicks++
    Game.calculateClick()
    Game.earn(Game.oresPerClick, 'ores')
    Game.rebuildInventory()
    Game.getGold()
    Game.drawParticles('ore')
  }

  s('#ore').onclick = Game.oreClick

  Game.woodClick = () => {
    Game.totalTreeClicks++
    Game.calculateClick()
    Game.earn(Game.woodPerClick, 'wood')
    Game.rebuildInventory()
    Game.drawParticles('wood')
  }

  s('#wood').onclick = Game.woodClick

  Game.calculateClick = () => {
    let oreAmount = 0
    let woodAmount = 0
    oreAmount += Game.oresPerClick
    woodAmount += Game.woodPerClick

    // calculate the upgrdes and update Game.oresPerClick
    Game.oresPerClick = oreAmount
    Game.woodPerClick = woodAmount
  }

  Game.rebuildInventory = () => {
    s('#inventory-ore').innerHTML = 'Ore: ' + Game.ores
    s('#inventory-refined').innerHTML = 'Refined: ' + Game.refined
    s('#inventory-wood').innerHTML = 'Wood: ' + Game.wood
    s('#inventory-gold').innerHTML = 'Gold: ' + Game.gold
  }

  Game.rebuildInventory()

  Game.tabs = [{name: 'store', unlocked: true}, {name: 'workshop', unlocked: false}, {name: 'blacksmith', unlocked: false}, {name: 'tavern', unlocked: false}, {name: 'quest', unlocked: false}]
  Game.rebuildTabs = () => {

    let str = ''
    for (i = 0; i < Game.tabs.length; i++) {
      let tab = Game.tabs[i]
      if (tab.unlocked == true) {
        str += `
          <div id='${tab.name}-tab' class='tab' onclick='Game.changeTabs(${i})'>${tab.name}</div>
        `
      }
    }

    s('#tabs').innerHTML = str
  }

  Game.changeTabs = (tabNumber) => {
    Game.selectedTab = tabNumber
    Game.rebuildStore()
  }

  Game.rebuildTabs()

  Game.itemsPerSecond = () => {
    setInterval(() => {
      Game.ores += Game.miners
      Game.wood += Game.lumberjacks
      Game.rebuildInventory()
    }, 1000)
  }

  Game.itemsPerSecond()

  Game.risingNumber = (amt, type) => {
    let randomNumber = Math.floor((Math.random() * 40) - 20) //picks a random number from -20 to 20
    let X = event.clientX+randomNumber
    let Y = event.clientY-50

    let div = document.createElement('div')
    div.classList.add('rising-number')

    if (type == 'gold') {
      div.classList.add('gold')
    }

    div.innerHTML = `+${amt}`

    if (type == 'damage') {
      div.classList.add('damage')
      div.innerHTML = `-${amt}`
    }

    div.style.position = 'absolute'
    div.style.left = X + 'px'
    div.style.top = Y + 'px'

    s('.rising-numbers').append(div)

    let allRisingNumbers = document.querySelectorAll('.rising-number')
    allRisingNumbers.forEach((number) => {
      setTimeout(() => {
        number.remove()
      }, 2.9 * 1000) //MAKE SURE SECONDS ARE LESS THAN CSS
    })
  }

  Game.items = []
  Game.item = function(whichTab, itemName, itemPic, itemDesc, fillerText, price, priceMaterial, maximumAmount, hidden, buyFunction) {
    this.tab = whichTab
    this.name = itemName
    this.pic = itemPic
    this.desc = itemDesc
    this.filler = fillerText
    this.price = price
    this.priceMaterial = priceMaterial
    this.owned = 0
    this.maximumAmount = maximumAmount
    this.hidden = hidden
    this.buyFunction = buyFunction

    this.changeText = (number) => {
      s(`#store-button${number}`).innerHTML = `
        <div style='height: 100%; width: 100%' onclick='Game.items[${number}].buy()'>
          <h1 onclick='Game.items[${number}].buy()'>${this.name} <span style='font-size: 15px;'>[owned: ${this.owned}]</span> <span style='font-size: 25px; float: right'>${this.price} ${this.priceMaterial}</span></h1>
          <hr >
          <p style='font-weight: bold'>${this.desc}</p>
          <p style='font-style: italic'>${this.filler}</p>
        </div>
      `
    }

    this.buy = () => {
      if (Game[this.priceMaterial] >= this.price) {
        Game.spend(this.price, this.priceMaterial)
        this.owned++
        this.price += Math.floor(Math.pow(Game.priceIncrease, this.owned))
        if (this.buyFunction) this.buyFunction()
        Game.rebuildInventory()
        Game.rebuildStore()
        Game.unlockStuff()
        Game.drawZone()
      }
    }

    Game.items.push(this)
  }

  Game.furnaces = []
  Game.furnace = function() {
    this.id = Game.furnaces.length
    this.inUse = false
    this.amount = null

    this.setAmount = () => {
      this.amount = parseInt(s(`#furnace${this.id}-amount`).value)
    }

    this.start = () => {
      let amountLeft = this.amount
      if (this.inUse == false) {
        let price = this.amount * 10
        if (Game.ores >= price) {
          this.inUse = true
          Game.spend(price, 'ores')

          s(`#furnace${this.id}-amount`).disabled = true
          s(`#furnace${this.id}-amount`).style.cursor = 'not-allowed'
          s(`#furnace${this.id}-button`).disabled = true
          s(`#furnace${this.id}-button`).style.cursor = 'not-allowed'

          let smeltInterval = setInterval(() => {
            amountLeft--
            s(`#furnace${this.id}-amount`).value = amountLeft
            Game.earn(1, 'refined')
            Game.rebuildInventory()
          }, Game.smeltTime * 1000)

          let timer = Game.smeltTime * this.amount
          s(`#furnace${this.id}-time-remaining`).innerHTML = `[seconds left until completed: ${Math.ceil(timer)}]`
          let smeltTimer = setInterval(() => {
            timer--
            s(`#furnace${this.id}-time-remaining`).innerHTML = `[seconds left until completed: ${Math.ceil(timer)}]`
          }, 1000)

          let currentWidth = 0
          let ammountOfTimeNeeded = this.amount * Game.smeltTime
          startProgress = setInterval(() => {
            currentWidth += (100/ammountOfTimeNeeded) * .01
            s(`#furnace${this.id}-progress-bar`).style.width = currentWidth + '%'
            Game.rebuildInventory()
          }, 10)

          setTimeout(() => {
            clearInterval(startProgress)
            s(`#furnace${this.id}-progress-bar`).style.width = '0%'
          }, ammountOfTimeNeeded * 1000)



          setTimeout(() => {
            clearInterval(smeltInterval)
            clearInterval(smeltTimer)
            this.inUse = false
            s(`#furnace${this.id}-amount`).disabled = false
            s(`#furnace${this.id}-amount`).style.cursor = 'initial'
            s(`#furnace${this.id}-amount`).value = null
            s(`#furnace${this.id}-button`).disabled = false
            s(`#furnace${this.id}-button`).style.cursor = 'pointer'
            s(`#furnace${this.id}-time-remaining`).innerHTML = `[seconds left until completed: not in use]`
          }, Game.smeltTime * 1000 * this.amount)


        }
      }
    }

    Game.furnaces.push(this)
  }

  // whichTab, itemName, itemPic, itemDesc, fillerText, price, priceMaterial, maximumAmount, hidden
  new Game.item(0, 'Axe', 'axe.png', 'Allows for the chopping of wood','Sharp and sturdy', 1, 'gold', 1, false)
  new Game.item(0, 'X-Ray Glasses', 'xray-glasses.png', 'Detects weak spots within the ore', 'Why is everything so swirly', 20, 'gold', 1, false)
  new Game.item(0, 'Workshop', 'workbench.png', 'Build things...', 'Wood... and lots of it', 50, 'wood', 1, true)
  new Game.item(1, 'Blacksmiths Hut', 'anvil.png', 'Gives you access to furnaces', 'fire burn good', 100, 'wood', 1, false)
  new Game.item(1, 'Tavern', 'beer.png', 'Trade goods and hire workers', 'slavery for cheap', 100, 'wood', 1, false)
  new Game.item(2, 'Furnace', 'furnace.png', 'Smelt raw ores to create refined ores', 'Caution... hot!', 50, 'ores', 999, false, () => {
    new Game.furnace()
    if (Game.items[6].hidden == true) Game.items[6].hidden = false
  })
  new Game.item(2, 'Upgrade Furnace Speed', 'fire.png', 'Decreases the amount of time needed to smelt', 'Add more fire', 5, 'refined', 999, true, () => {
    Game.smeltTime *= .9
  })
  new Game.item(3, 'Hire Miner', 'hardhat.png', 'Increases idle ore gain', 'mine mine mine', 5, 'gold', 999, false, () => {
    Game.miners++
    if (Game.miners >= 0) {Game.win('Your First Miner')}
  })
  new Game.item(3, 'Hire Smelter', 'mask.png', 'Allows for idle smelting', 'smelt smelt smelt', 5, 'gold', 999, false, () => {
    Game.smelters++
    if (Game.smelters >= 0) {Game.win('Your First Smelter')}
  })
  new Game.item(3, 'Hire Lumberjack', 'lumberjack.png', 'Increases idle wood gain', 'chop chop chop', 5, 'gold', 999, false, () => {
    Game.lumberjacks++
    if (Game.lumberjacks >= 0) {Game.win('Your First Lumberjack')}
  })
  new Game.item(3, 'Hire Adventurer', 'shield.png', 'Fight baddies', 'Time for an adventure', 1000, 'gold', 999, false, () => {
    Game.adventurers++
    if (Game.adventurers >= 0) {Game.win('Your First Adventurer')}
    // if (Game.tabs[4].unlocked == false) {Game.tabs[4].unlocked = true; Game.rebuildTabs()}
  })
  new Game.item(0, 'Metal Detector', 'metaldetector.png', 'Increases chance of gold on click', 'beep... beep', 10, 'gold', 999, false, () => {
    Game.goldChance *= 1.25
  })
  new Game.item(1, 'Mass Production', 'nothing.png', 'Unlock items to be mass produced (items for workers)', 'You get a car... You get a car!', 10, 'refined', 1, false, () => {
    if (Game.items[14].hidden == true) Game.items[14].hidden = false
  })
  new Game.item(0, 'Piggy Bank', 'nothing.png', 'Increases the amount of gold get', 'oink oink', 10, 'gold', 999, false, () => {
    Game.goldPerClick++
  })
  new Game.item(0, 'Mass Produced Metal Detector', 'nothing.png', 'Increase chance for miners to strike gold', 'clink clink', 15, 'gold', 999, true)

  Game.trade = (item1amount, item1Material, item2amount, item2Materiaal) => {
    if (Game[item1Material] >= item1amount) {
      Game[item1Material] -= item1amount
      Game[item2Materiaal] += item2amount
    }
    Game.rebuildInventory()
  }

  Game.quests = []
  Game.quest = function(name, image, desc, artifacts, timeLimit, amountOfEnemies, enemyHealth, bossHealth, locked) {
    this.id = null
    this.name = name
    this.desc = desc
    this.image = image
    this.cleared = false
    this.timesCleared = 0
    artifacts = artifacts.split('|')
    this.artifact1 = artifacts[0]
    this.artifact2 = artifacts[1]
    this.artifact3 = artifacts[2]
    this.locked = locked
    this.inProgress = false
    this.zoneHidden = true

    this.timeLimit = timeLimit
    this.amountOfEnemies = amountOfEnemies
    this.enemyHealth = enemyHealth
    this.bossHealth = bossHealth

    this.activateQuest = (id) => {
      s('.cover').remove()
      s('.quest-modal').remove()

      // Add separator into select element
      let select = s('#zone')
      let selectSeparator = document.createElement('option')
      selectSeparator.value = 'separator'
      selectSeparator.disabled = true
      selectSeparator.innerHTML = '-Quests-'
      if (Game.hasQuests == false) {
        Game.hasQuests = true
        select.add(selectSeparator)
      }

      // Add zone
      if (this.zoneHidden == true) {
        this.zoneHidden = false
        this.inProgress = true
        let newQuest = document.createElement('option')

        newQuest.value = Game.quests[id].name
        newQuest.innerHTML = Game.quests[id].name
        select.add(newQuest)

        s('#zone').style.boxShadow = '0 0 50px 3px yellow'
        setTimeout(() => {
          s('#zone').style.boxShadow = 'none'
        }, 3500)
      }

      Game.startQuest(this)
      Game.rebuildStore()
    }

    this.openModal = (id) => {
      let div = document.createElement('div')
      let div2 = document.createElement('div')
      div2.classList.add('cover')
      div2.onclick = () => {div2.remove(); div.remove()}
      div.classList.add('quest-modal')
      div.innerHTML = `
        <p style='text-align: center;'>&bull;</p>
        <h1 style='text-align: center;'>${this.name}</h1>
        <hr/>
        <img class='quest-modal-image' src="./assets/${this.image}" alt="" />
        <p style='text-align: center'>${this.desc}</p>
        <br>
        <p>Possible Artifacts: ${this.artifact1}, ${this.artifact2}, ${this.artifact3}</p>
        <br>
        <button style='padding: 5px' onclick='Game.quests[${id}].activateQuest(${id})'>Activate Quest <br/> (req. at least 1 adventurer)</button>
      `

      s('body').appendChild(div2)
      s('#modals').append(div)
    }

    Game.quests.push(this)
  }

  Game.startQuest = (quest) => {
    console.log('START QUEST:', quest)

    let amountOfEnemies = quest.amountOfEnemies

    s('.enemies-left').innerHTML = amountOfEnemies

    let currentHealth = quest.enemyHealth
    let minusHealthbarAmount = (Game.damagePerClick/quest.enemyHealth) * 100
    let currentHealthPercentage = 100

    s('.enemy-health').style.width = currentHealthPercentage + '%'

    //Draws time
    let timeLimit = quest.timeLimit * 60000 // amount of time in ms
    let minutes = Math.floor(timeLimit / 60000);
    let seconds = ((timeLimit % 60000) / 1000).toFixed(0);
    let prettySeconds = null
    let prettyMinutes = null

    let timeLeft = setInterval(() => {
      if (seconds == 0 && minutes > 0) {
        minutes--
        seconds = 60
      }
      seconds--
      seconds < 10 ? (prettySeconds = '0' + seconds) : (prettySeconds = seconds)
      minutes < 10 ? (prettyMinutes = '0' + minutes) : (prettyMinutes = minutes)
      if (seconds <= 0 && minutes <= 0) {
        clearInterval(timeLeft)
      }
      if (s('#zone').value == 'Hu Man Woods') {
        s('.time-remaining').innerHTML = `<p style='text-align: center; color: white'>Time Remaining: ${prettyMinutes}:${prettySeconds}</p>`
      } //
    }, 1000)

    setTimeout(() => {
      if (quest.inProgress == true) {
        s('#zone').value = 'mine'
        let remove = s('#zone').querySelector(`option[value="${quest.name}"]`)
        let removeSeparator = s('#zone').querySelector(`option[value="separator"]`)
        s('#zone').removeChild(remove)
        s('#zone').removeChild(removeSeparator)
        quest.inProgress = false
        quest.zoneHidden = true
        Game.hasQuests = false
        Game.drawZone()
        Game.rebuildStore()
      }
    }, timeLimit)

    // kill enemies

    s('.enemy').onclick = () => {
      if (amountOfEnemies > 0) { // if there are enemies left
        console.log('YES')
        if (currentHealth > 0) { // If the health is more than 0
          Game.risingNumber(Game.damagePerClick, 'damage')
          currentHealthPercentage -= minusHealthbarAmount
          currentHealth -= Game.damagePerClick
          s('.enemy-health').style.width = currentHealthPercentage + '%'
          if (currentHealth <= 0) { // If health is less than 0
            s('.enemy').style.visibility = 'hidden'
            setTimeout(() => {
              s('.enemy').style.visibility = 'visible'
            }, 200)
            amountOfEnemies--
            s('.enemies-left').innerHTML = amountOfEnemies
            currentHealth = quest.enemyHealth
            currentHealthPercentage = 100
            s('.enemy-health').style.width = currentHealthPercentage + '%'
          }
        }
      } else {
        console.log('NO')
        console.log('quest end')
        s('#zone').value = 'mine'
        let remove = s('#zone').querySelector(`option[value="${quest.name}"]`)
        let removeSeparator = s('#zone').querySelector(`option[value="separator"]`)
        s('#zone').removeChild(remove)
        s('#zone').removeChild(removeSeparator)
        quest.inProgress = false
        quest.zoneHidden = true
        Game.hasQuests = false
        Game.drawZone()
        Game.rebuildStore()
      }
    }
  }

  //name, image, desc, artifacts, timeLimit, amountOfEnemies, enemyHealth, bossHealth, locked
  new Game.quest('Hu Man Woods',
                  'huManWoods.png',
                  'Less than 2% of the total amount of people who went inside the Hu Man Woods lived to tell the tale. Survivors said they saw their loved ones in the shadows beckon them deeper and deeper into the woods, only to find out it was just some branches.',
                  '???|???|???',
                  5,
                  10,
                  50,
                  1000,
                  false)
  new Game.quest('Kong Caves',
                  'kongcaves.png',
                  'Legends of a giant 32 foot gorilla lies deep within these caves. The locals have nicknamed the gorilla "Dino"',
                  '???|???|???',
                  30,
                  10,
                  500,
                  5000,
                  false)
  new Game.quest('Jasok Lake',
                  'nothing.png',
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat cum id libero veritatis quaerat saepe sequi doloremque esse obcaecati soluta quidem, atque dolorum rerum error, asperiores explicabo, alias laboriosam voluptate.',
                  '???|???|???',
                  999,
                  999,
                  999,
                  999,
                  true)
  new Game.quest('Rusty Forest',
                  'nothing.png',
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis illum ducimus architecto, itaque earum est expedita, repudiandae maxime sit natus deleniti atque eum vitae quas totam rem at inventore et.',
                  '???|???|???',
                  999,
                  999,
                  999,
                  999,
                  true)
  new Game.quest('Lantiguen Mineshaft',
                  'nothing.png',
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae unde harum a placeat. Harum expedita, reiciendis veritatis voluptates, possimus illum. Tempora rem quaerat, eum nemo quos exercitationem et sequi nobis!',
                  '???|???|???',
                  999,
                  999,
                  999,
                  999,
                  true)

  Game.rebuildStore = () => {
    let str = ''
    for (i = 0; i < Game.items.length; i++) {
      let item = Game.items[i]
      if (item.owned < item.maximumAmount && item.hidden == false) {
        if (Game.selectedTab == item.tab) {
          str += `
            <div class='store-button' id='store-button${i}' onclick='Game.items[${i}].buy()'>
              <div class="button-top">
                <img src="./assets/${item.pic}" alt="" />
                <h1 class='item-name'>${item.name} <span class='hide' style='font-size: 15px'>[owned: ${item.owned}]</span></h1>
                <p class='item-price'>cost: ${item.price} ${item.priceMaterial}</p>
              </div>
              <div class="button-bottom">
                <hr/>
                <h3>${item.desc}</h3>
                <p style='font-style: oblique'>${item.filler}</p>
              </div>
            </div>
          `
        }
      }
    }
    if (Game.selectedTab == 2) {
      str += '<h1>10 Raw Ores = 1 Refined Ore</h1>'
      for (j = 0; j < Game.furnaces.length; j++) {
        Game.furnaces[j].id = j
        str += `
          <div id='furnace${j}' class='furnace'>
            <div class="furnace-top">
              <input id='furnace${j}-amount' type="number" onchange='Game.furnaces[${j}].setAmount()'/>
              <button id='furnace${j}-button' class="start-furnace-button" onclick='Game.furnaces[${j}].start()'>Start</button>
            </div>
            <div class="furnace-bottom">
              <div id='furnace${j}-progress-bar-container' class="progress-bar-container">
                <div id='furnace${j}-progress-bar' class="progress-bar"></div>
              </div>
              <p id='furnace${j}-time-remaining' class="time-remaining"> [seconds left until completed: not in use]</p>
            </div>
          </div>
        `
      }
    }

    if (Game.selectedTab == 3) {

      if (Game.adventurers >= 1) {
        str += `
          <div id="quest-board">
            <h1 style='text-align: center'>Quest Board</h1>
            <div class='quests-container'>
        `

        for (k = 0; k < Game.quests.length; k++) {
          Game.quests[k].id = k
          if (Game.quests[k].locked == true) {
            str += `
              <div class='quest'>
                <p style='text-align: center;'>&bull;</p>
                <p>???</p>
              </div>
            `
          } else if (Game.quests[k].locked == false & Game.quests[k].inProgress == true) {
            str += `
              <div class='quest' onclick='Game.quests[${k}].openModal(${k})' id='quests[${k}]'>
                <p style='text-align: center;'>&bull;</p>
                <p>${Game.quests[k].name}</p>
                <p>In progress...</p>
              </div>
            `
          } else {
            str += `
              <div class='quest' onclick='Game.quests[${k}].openModal(${k})' id='quests[${k}]'>
                <p style='text-align: center;'>&bull;</p>
                <p>${Game.quests[k].name}</p>
              </div>
            `
          }
        }

        str += '</div></div>'
      }

      str += `
        <div id='trade-hall'>
          <h1>Trade Hall</h1>
          <div class="trade-container">
            <div class="trade">
              <p>Trade 50 raw ores for 1 refined ore</p>
              <button onclick='Game.trade(50,"ores", 1, "refined")'>Trade</button>
            </div>
            <div class="trade">
              <p>Trade 100 raw ores for 1 gold</p>
              <button onclick='Game.trade(100,"ores", 1, "gold")'>Trade</button>
            </div>
            <div class="trade">
              <p>Trade 2 gold for 50 raw ores</p>
              <button onclick='Game.trade(2,"gold", 50, "ores")'>Trade</button>
            </div>
          </div>
        </div>
        `
    }

    str += `
      <div id="store-spacer"></div>
    `
    s('#store-content').innerHTML = str
  }

  Game.drawZone = () => {
    let el = s('#zone')
    if (Game.items[0].owned == 1) {
      el.style.visibility = 'visible'

      //Get value of select tag
      let value = el.options[el.selectedIndex].value

      if (value == 'mine') {
        s('#ore').style.display = 'initial'
        s('#wood').style.display = 'none'
        s('#enemy').style.display = 'none'
        // s('#left').style.background = '#777'
        s('#left').style.background = "url('./assets/mine-bg.png')"
        s('#left').style.backgroundSize = 'cover'
      }

      if (value == 'wood') {
        s('#wood').style.display = 'initial'
        s('#ore').style.display = 'none'
        s('#enemy').style.display = 'none'
        s('#left').style.background = "url('./assets/forest-bg.png')"
        s('#left').style.backgroundSize = 'cover'
      }

      if (value == 'Hu Man Woods') {
        s('#wood').style.display = 'none'
        s('#ore').style.display = 'none'
        s('#enemy').style.display = 'flex'
        s('.enemy').style.background = "url('./assets/treeMonster.png')"
        s('#left').style.background = "url('./assets/huManWoods.png')"
        s('#left').style.backgroundSize = 'cover'
      }

      if (value == 'Kong Caves') {
        s('#wood').style.display = 'none'
        s('#ore').style.display = 'none'
        s('#enemy').style.display = 'flex'
        s('#left').style.background = "url('./assets/kongcaves.png')"
        s('#left').style.backgroundSize = 'cover'
      }

    }
  }

  setInterval(() => {
    Game.sessionTime++
    Game.unlockStuff()
  }, 1000)

  Game.unlockStuff = () => {
    if (Game.totalOreClicks >= 1) Game.win('Your First Click')
    if (Game.totalOreClicks >= 2) Game.win('Double Click')
    if (Game.totalOreClicks >= 100) Game.win('Carpal Tunnel')
    if (Game.totalTreeClicks >= 1) Game.win('Morning Wood')
    if (Game.sessionTime >= 60) Game.win('Milestone 1')
    if (Game.sessionTime >= 300) Game.win('Milestone 2')
    if (Game.sessionTime >= 6000) Game.win('Milestone 3')
    if (Game.wood > 0 && Game.items[2].hidden == true) {Game.items[2].hidden = false; Game.rebuildStore()}
    if (Game.items[2].owned == 1 && Game.tabs[1].unlocked == false) {Game.tabs[1].unlocked = true; Game.rebuildTabs(); Game.rebuildStore()}
    if (Game.items[3].owned == 1 && Game.tabs[2].unlocked == false) {Game.tabs[2].unlocked = true; Game.rebuildTabs(); Game.rebuildStore()}
    if (Game.items[4].owned == 1 && Game.tabs[3].unlocked == false) {Game.tabs[3].unlocked = true; Game.rebuildTabs(); Game.rebuildStore()}
  }

  Game.unlockStuff()

  Game.achievements = []
  Game.achievement = function(name, howToUnlock, desc) {
      this.name = name
      this.howToUnlock = howToUnlock
      this.desc = desc
      this.won = 0

      Game.achievements[this.name] = this
  }

  new Game.achievement('Your First Click', 'Have your first click', 'Wont be your last though...')
  new Game.achievement('Double Click', 'Click a second time', 'I told you so')
  new Game.achievement('Carpal Tunnel', 'Click a total of 100 times', 'Wheres the Bengay')

  new Game.achievement('Morning Wood', 'Cut your first tree', '-insert dick pun here-')

  new Game.achievement('Milestone 1', 'Stay on More Ore for more than 1 minute', "You're still here?")
  new Game.achievement('Milestone 2', 'Stay on More Ore for more than 3 minutes', "Why are you still here...")
  new Game.achievement('Milestone 3', 'Stay on More Ore for more than 10 minutes', "Ahhh... afk")

  new Game.achievement('Your First Miner', 'Hire your first miner', 'Off to mine I guess...')
  new Game.achievement('Your First Smelter', 'Hire your first smelter', 'Off to smelt I guess...')
  new Game.achievement('Your First Lumberjack', 'Hire your first lumberjack', 'Off to chop wood I guess...')
  new Game.achievement('Your First Adventurer', 'Hire your first adventurer', 'Off to adventure')

  Game.win = (achievement) => {
    if (Game.achievements[achievement]) {
      if (Game.achievements[achievement].won == 0) {
        Game.achievements[achievement].won = 1
        let div = document.createElement('div')
        div.classList.add('achievement')
        div.innerHTML = `
          <h3>Achievement Unlocked</h3>
          <hr size='2px' color='black'>
          <h1 style='font-size: 40px;'>${Game.achievements[achievement].name}</h1>
          <hr size='2px' color='black'>
          <p style='font-size: 25px'>${Game.achievements[achievement].howToUnlock}</p>
          <p style='font-style: italic; font-size:25px'>"${Game.achievements[achievement].desc}"</p>
        `
        s('#achievements').append(div)

        setTimeout(() => {
          div.remove()
        }, 2800)
      }
    }
  }

  Game.drawParticles = (material) => {
    for (i = 0; i < 3; i++) {
      let div = document.createElement('div')
      div.classList.add('particle')
      if (material == 'ore') {
        div.style.background = 'lightgrey'
      }
      if (material == 'wood') {
        div.style.background = 'brown'
      }
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

      s('#particles').append(div)
    }
  }





  Game.rebuildStore()

}

window.onload = () => {Game.Launch()}
