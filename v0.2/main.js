/*
IDEAS TO IMPLEMENT
------
Taverns can sell ores for money
Upgrade wheelbarrow for more ore storage (add a max ore amount)
Smelted ores give all at once, the more ore you smelt at once, the longer it takes, but faster than doing it 1 by 1
Have to collect smelted ores
Chance to get ore in beginning. (so multiple clicks might only yield 1 ore)
*/


// Helper Functions
let s = ((what) => {return document.querySelector(what)})

// Game
let Game = {}

Game.Launch = () => {
  Game.ready = 0
  console.log('Game is launching')
  Game.Init = () => {
    Game.ready = 1
    console.log('Game Initiated')

    // Variables and Presets
    Game.totalOreClicks = 0
    Game.totalOresMined = 0
    Game.totalRefinedOres = 0
    Game.currentOreAmount = 0
    Game.refinedOreAmount = 0
    Game.oresPerSecond = 0
    Game.currentRefinedOreAmount = 0
    Game.orePerClick = 1
    Game.priceIncrease = 1.15
    Game.upgrades = []
    Game.onMenu = 'upgrades'
    Game.smeltSpeed = 3
    Game.miners = 0

    Game.AddOresPerSecond = () => {
      setInterval(() => {
        Game.currentOreAmount += Game.oresPerSecond
        Game.RebuildInventory()
      }, 1000)
    }

    Game.AddOresPerSecond()

    Game.DrawTabs = () => {
      let tabs = document.querySelectorAll('.tab')
      if (tabs[1].classList.contains('locked')) {
        tabs[1].innerHTML = '???'
      } else {
        tabs[1].innerHTML = 'Furnace'
      }
      if (tabs[2].classList.contains('locked')) {
        tabs[2].innerHTML = '???'
      } else {
        tabs[2].innerHTML = 'Tavern'
      }
      if (tabs[3].classList.contains('locked')) {
        tabs[3].innerHTML = '???'
      } else {
        tabs[3].innerHTML = 'Quests'
      }
    }

    // This function changes adds and removes the 'selected' class
    // then runs UpdateMenu
    Game.ShowMenu = (menu) => {
      let tabs = document.querySelectorAll('.tab')
      let selectedTab = s('.' + menu + '-tab')

      // Change tabs
      if (!(selectedTab.classList.contains('locked'))) { // If selected tab doesnt have the locked class, change tab
        tabs.forEach((tab) => {
          tab.classList.remove('selected')
        })
        Game.onMenu = menu
        selectedTab.classList.add('selected')
        Game.UpdateMenu()
      }
    }

    // This function checks which tab is selected and builds the
    // items inside that tab
    Game.UpdateMenu = () => {
      let str = ''
      if (Game.onMenu == 'upgrades') {
        Game.BuildStore()
        s('.upgrades-content').style.display = 'block'
        s('.furnace-content').style.display = 'none'
        s('.tavern-content').style.display = 'none'
        s('.quests-content').style.display = 'none'
      } else if (Game.onMenu == 'furnace') {
        s('.upgrades-content').style.display = 'none'
        s('.furnace-content').style.display = 'block'
        s('.tavern-content').style.display = 'none'
        s('.quests-content').style.display = 'none'
        Game.BuildFurnaces()
      } else if (Game.onMenu == 'tavern') {
        s('.upgrades-content').style.display = 'none'
        s('.furnace-content').style.display = 'none'
        s('.tavern-content').style.display = 'block'
        s('.quests-content').style.display = 'none'
        Game.BuildTavern()
      }
    }

    s('.upgrades-tab').onclick = () => Game.ShowMenu('upgrades')
    s('.furnace-tab').onclick = () => Game.ShowMenu('furnace')
    s('.tavern-tab').onclick = () => Game.ShowMenu('tavern')
    s('.quests-tab').onclick = () => Game.ShowMenu('quests')
    s('.ore-amount').onclick = () => {
      Game.Earn(1000, 0)
      Game.Earn(1000, 1)
      Game.RebuildInventory()
    }

    // Rising numbers
    Game.risingNumber = (amount) => {
      let randomNumber = Math.floor(Math.random() * 50) + 50;
      let X = event.clientX+(randomNumber)-100
      let Y = event.clientY-50

      let div = document.createElement('div')
      div.classList.add('rising-number')
      div.innerHTML = `+${amount}`
      div.style.position = 'absolute'
      div.style.left = X + 'px'
      div.style.top = Y + 'px'
      // div.style.transform = 'translate(-50%, -50%)'
      s('.rising-numbers').append(div)

      let allRisingNumbers = document.querySelectorAll('.rising-number')
      allRisingNumbers.forEach((number) => {
        setTimeout(() => {
          number.remove()
        }, 2.9 * 1000) //MAKE SURE SECONDS ARE LESS THAN CSS
      })
    }

    Game.Earn = (amount, type) => {
      if (type == 0) { // 0 = raw ore
        Game.totalOresMined += amount
        Game.currentOreAmount += amount
        Game.risingNumber(amount)
      }
      if (type == 1) { // 1 = refined ore
        Game.totalRefinedOres += amount
        Game.currentRefinedOreAmount += amount
      }

      Game.RebuildInventory()
    }

    Game.Spend = (amount, type) => {
      if (type == 0) { // 0 = raw ore
        Game.currentOreAmount -= amount
      }
      if (type == 1) { // 1 = refined ore
        Game.currentRefinedOreAmount -= amount
      }
      Game.RebuildInventory()
    }

    Game.OreClick = () => {
      Game.totalOreClicks++
      Game.CalculateClick()
      Game.Earn(Game.orePerClick, 0)
      Game.RebuildInventory()
    }

    Game.CalculateClick = () => {
      let whetstone = Game.upgrades[0]
      let amount = Game.orePerClick
      if (whetstone.owned > 0) {
        Game.orePerClick = Math.ceil(Math.pow(whetstone.owned, 1.3))
      }
    }

    s('.ore').onclick = Game.OreClick

    Game.ClickArea = () => {
      let clickArea = s('.ore-click-area')
      let ore = s('.ore').getBoundingClientRect()
      let x = Math.floor(Math.random() * (ore.right-200 - ore.left+200 + 1)) + ore.left
      let y = Math.floor(Math.random() * (ore.bottom+200 - ore.top-200 + 1)) + ore.top
      clickArea.style.left = x + 'px'
      clickArea.style.top = y + 'px'
      Game.Earn(Game.orePerClick * 15, 0)
      console.log(x,y)
    }

    Game.positionClickArea = () => {
      let clickArea = s('.ore-click-area')
      let ore = s('.ore').getBoundingClientRect()
      console.log('ORE', ore)

      console.log(`possible x is between ${ore.left}, ${ore.right}`)
      console.log(Math.random() * (ore.right - ore.left + 1)) + ore.left

      //Math.floor(Math.random() * (max - min + 1)) + min;
      let x = Math.floor(Math.random() * (ore.right-200 - ore.left+200 + 1)) + ore.left
      let y = Math.floor(Math.random() * (ore.bottom+200 - ore.top-200 + 1)) + ore.top
      clickArea.style.left = x + 'px'
      clickArea.style.top = y + 'px'
    }

    Game.positionClickArea()

    s('.ore-click-area').onclick = () => Game.ClickArea()

    Game.Upgrade = function(name, lockedName, desc, lockedDesc, fillerText, price, material, locked, unlockPrice, unlockMaterial, whatItUnlocks, hidden){
      this.name = name
      this.lockedName = lockedName
      this.desc = desc
      this.lockedDesc = lockedDesc
      this.fillerText = fillerText
      this.basePrice = price
      this.price = this.basePrice
      this.material = material // 0 = raw ore, 1 = refined ore, 2 = gold
      this.owned = 0
      this.locked = locked
      this.unlockPrice = unlockPrice
      this.unlockMaterial = unlockMaterial
      this.whatItUnlocks = whatItUnlocks
      this.hidden = hidden

      this.buy = () => {
        console.log('buy function firing')
        let price = this.price
        if (this.material == 0) {
          if (Game.currentOreAmount >= price) {
            Game.Spend(price, 0)
            this.owned++
            price = Math.ceil(this.basePrice * Math.pow(Game.priceIncrease, this.owned))
            this.price = price
            Game.BuildStore()
            Game.RebuildInventory()
          }
        } else if (this.material == 1) {
          if (Game.currentRefinedOreAmount >= price) {
            Game.Spend(price, 1)
            this.owned++
            price = Math.ceil(this.basePrice * Math.pow(Game.priceIncrease, this.owned))
            this.price = price
            Game.BuildStore()
            Game.RebuildInventory()
            if (this.name == 'Buy New Furnace') {
              Game.furnaceId++
              new Game.Furnace()
            }
            if (this.name =='Upgrade Furnace') {
              Game.smeltSpeed *= .9
            }
          }
        } else {
          // do nothing for now

        }
      }

      this.unlock = () => {
        console.log('unclock function firing')
        if (this.unlockMaterial == 0) {
          if (Game.currentOreAmount >= this.unlockPrice) {
            Game.Spend(this.unlockPrice, 0)
            this.locked = 0
            s(this.whatItUnlocks).classList.remove('locked')
            Game.UnlockUpgrades()
            Game.RebuildInventory()
            Game.BuildStore()
            Game.DrawTabs()
            Game.displayMat(this)
          }
        } else {
          if (Game.currentRefinedOreAmount >= this.unlockPrice) {
            Game.Spend(this.unlockPrice, 1)
            this.locked = 0
            s(this.whatItUnlocks).classList.remove('locked')
             Game.UnlockUpgrades()
            Game.RebuildInventory()
            Game.BuildStore()
            Game.DrawTabs()
            Game.displayMat(this)
          }
        }
      }
      Game.upgrades.push(this)
    }

    Game.UnlockUpgrades = () => {
      // if furnace is unlocked
      if (Game.upgrades[1].locked == 0) {
        Game.upgrades[0].hidden = 0
        Game.upgrades[2].hidden = 0
        Game.upgrades[3].hidden = 0
      }
    }

    Game.displayMat = (item) => {
      if (item.locked == 1) {
        if (item.unlockMaterial == 0) {
          return 'Raw'
        } else {
          return 'Refined'
        }
      } else {
        if (item.material == 0) {
          return 'Raw'
        } else {
          return 'Refined'
        }
      }
    }

    Game.BuildStore = () => {
      let str = ''

      for (i = 0; i < Game.upgrades.length; i++) {
        let item = Game.upgrades[i]
        if (item.hidden == 0) {
          if (item.locked == 1) {
            str += `
              <div class='button upgrade-button' onclick='Game.upgrades[${i}].unlock()'>
                <h1>${item.lockedName}</h1>
                <p>${item.lockedDesc}</p>
                <p>Cost: ${item.unlockPrice} ${Game.displayMat(item)} Ores</p>
              </div>
            `
          } else {
            str += `
              <div class='button upgrade-button' onclick='Game.upgrades[${i}].buy()'>
                <h1>${item.name}</h1>
                <p>${item.desc}</p>
                <p>${item.fillerText}</p>
                <p>Cost: ${item.price} ${Game.displayMat(item)} Ores</p>
                <p>You Own: ${item.owned}</p>
              </div>
            `
          }
        }
      }
      s('.upgrades-content').innerHTML = str
    }

    Game.furnaces = []
    Game.furnaceId = 0
    Game.Furnace = function() {
      this.id = Game.furnaceId
      this.inUse = false
      this.amount = null
      this.collected = 0

      this.changeAmount = (id) => {
        let amount = parseInt(s(`#furnace${id}-amount`).value)
        this.amount = amount
      }

      this.start = (id) => {
        if (this.inUse == false) {
          if (this.amount > 0) {
            let price = this.amount * 10
            if (Game.currentOreAmount >= price) {

              s(`#furnace${id}-amount`).disabled = true
              s(`#furnace${id}-button`).style.cursor = 'not-allowed'
              s(`#furnace${id}-button`).innerHTML = 'Cancel'
              s(`#furnace${id}-button`).disabled = true

              Game.Spend(price, 0)
              Game.RebuildInventory()
              Game.inUse = true

              setTimeout(() => {
                Game.Earn(this.amount, 1)
                s(`#furnace${id}-amount`).disabled = false
                s(`#furnace${id}-amount`).value = null
                s(`#furnace${id}-button`).style.cursor = 'pointer'
                s(`#furnace${id}-button`).innerHTML = 'Smelt'
                s(`#furnace${id}-button`).disabled = false
                this.inUse = false
                this.amount = 0
              }, Game.smeltSpeed * 1000 * this.amount)

              let barWidth = 0

              let progress = () => {
                if (barWidth != 100) {
                  barWidth++
                  s(`#furnace${id}-progress`).style.width = barWidth + '%'
                } else {
                  clearInterval(interval)
                }
              }
              let interval = setInterval(progress, Game.smeltSpeed * 10 * this.amount)

              // Updates time left until finished
              let timer = (this.amount * Game.smeltSpeed * 1000) / 1000
              s(`#furnace${id}-estimated-time`).innerHTML = 'Seconds remaining: ' + Math.ceil(timer)
              let countdown = () => {
                if (timer >= 0) {
                  timer--
                  s(`#furnace${id}-estimated-time`).innerHTML = 'Seconds remaining: ' + Math.ceil(timer)
                } else {
                  clearInterval(timerInterval)
                  s(`#furnace${id}-estimated-time`).innerHTML = ''
                }
              }
              let timerInterval = setInterval(countdown, 1000)
            }
          }
        }
      }
      Game.furnaces.push(this)
    }

    new Game.Furnace()

    Game.BuildFurnaces = () => {
      let str = ''

      str += `
        <div>
          <p style='text-align: center'>10 raw ores = 1 refined ore</p>
        </div>
      `

      for (i = 0; i < Game.furnaces.length; i++) {
        str += `
          <div id='furnace${i}' class='furnace'>
            <div id='furnace${i}-top' class="furnace-top">
              <input id='furnace${i}-amount' type='number' onchange='Game.furnaces[${i}].changeAmount(Game.furnaces[${i}].id)' class="furnace-amount" value=${Game.furnaces[i].amount}></input>
              <button id='furnace${i}-button' class="furnace-button" onclick='Game.furnaces[${i}].start(Game.furnaces[${i}].id)'>Start</button>
            </div>
            <div id='furnace${i}-bottom' class="furnace-bottom">
              <div id='furnace${i}-progress-bar' class="furnace-progress-bar">
                <div id='furnace${i}-progress' class='furnace-progress'></div>
              </div>
              <div id='furnace${i}-estimated-time' class="furnace-estimated-time"></div>
            </div>
          </div>
        `
      }
      s('.furnace-content').innerHTML = str
    }

    //name, lockedName, desc, lockedDesc, fillerText, price, material, locked, unlockPrice, unlockMaterial, whatItUnlocks, hidden
    new Game.Upgrade('Whetstone', null, 'Increase ores per click', null, 'The sharper the better', 10, 1, 0, null, null, null, 1)
    new Game.Upgrade('Upgrade Furnace', 'Unlock Furnace', 'Increase smelting speed', 'Allows for smelting of raw ore', 'Fight fire with more fire', 10, 1, 1, 20, 0, '.furnace-tab', 0)
    new Game.Upgrade('Buy New Furnace', null, 'Adds extra furnace', null, 'More is better', 15, 1, 0, null, null, null, 1)
    new Game.Upgrade('Upgrade Worker Efficiency', 'Unlock Tavern', 'Increases the effectiveness of Miners and Heroes', 'Sell ores and hire workers', 'work work work', 15, 1, 1, 10, 1, '.tavern-tab', 1)

    Game.BuildStore()

    Game.RebuildInventory = () => {
      s('.ore-amount').innerHTML = 'Ore: ' + Game.currentOreAmount
      s('.refined-ore-amount').innerHTML = 'Refined Ore: ' + Game.currentRefinedOreAmount
      s('.gold-amount').innerHTML = 'Gold: ' + '0'
    }

    Game.BuildTavern = () => {
      console.log("build tavern")
      let str = ''

      str += `
        <div class="button" onclick="Game.BuyMiner()">
          <h1>Hire Miner</h1>
          <p>Price: 5 Refined Ore</p>
          <p>Owned: ${Game.oresPerSecond}</p>
        </div>
        <div class="button" onclick="Game.BuySmelter()">
          <h1>Hire Smelter</h1>
          <p>Price: 5 Refined Ore</p>
        </div>
        <div class="button" onclick="Game.BuyHero()">
          <h1>Hire Hero</h1>
          <p>Price: 5 Refined Ore</p>
        </div>
      `

      s('.tavern-content').innerHTML = str
    }

    Game.BuyMiner = () => {

      let ore = s('.ore').getBoundingClientRect()
      let minerX = ore.left - Game.oresPerSecond * 20 - 50
      let minerY = ore.bottom - 100

      if (Game.currentRefinedOreAmount >= 5) {
        Game.Spend(5, 1)
        Game.oresPerSecond += 1
        Game.BuildTavern()

        minerX -= 20

        let miner = document.createElement('div')
        console.log('miner', minerX, minerY)
        miner.style.left = minerX + 'px'
        miner.style.top = minerY + 'px'
        miner.classList.add('miner')

        s('.miners').append(miner)
      }
    }

    Game.BuySmelter = () => {
      //
    }

    Game.BuyHero = () => {
      //
    }



    // ACHIEVEMENTS
    // Game.Achievements = []
    // Game.AchievementsOwned = 0
    // Game.Achievement = function(name, desc) {
    //   this.name = name
    //   this.desc = desc
    //   this.won = 0

    //   Game.Achievements.push(this)
    // }

    // new Game.Achievement('Your First Click', 'woohoo! now go click some more');

    // Game.Win = (achievement) => {
    //   console.log(achievement)
    //   if (achievement.won == 0) {
    //     let div = document.createElement('div')
    //     div.innerHTML = `
    //       <div class='achievement'>
    //         <h1>Achievement Unlocked</h1>
    //         <h3>${achievement.name}</h3>
    //         <p>${achievement.desc}</p>
    //       </div>
    //     `
    //     s('.game').append(div)

    //     achievement.won = 1
    //     Game.AchievementsOwned++
    //   }
    // }


    // Final Checks
    Game.RebuildInventory()
    Game.DrawTabs()

    // other shit
    s('.ore-click-area').onmouseover = () => s('.ore').style.height = '310px'
    s('.ore-click-area').onmouseout = () => s('.ore').style.height = '300px'
    s('.ore-click-area').onmousedown = () => s('.ore').style.height = '300px'
    s('.ore-click-area').onmouseup = () => s('.ore').style.height = '310px'
    s('.ore').onmouseover = () => s('.ore').style.height = '310px'
    s('.ore').onmouseout = () => s('.ore').style.height = '300px'
    s('.ore').onmousedown = () => s('.ore').style.height = '300px'
    s('.ore').onmouseup = () => s('.ore').style.height = '310px'
  }
}

Game.Launch()

window.onload=function()
{
  if (!Game.ready) Game.Init();
};





