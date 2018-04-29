/* =================
  HELPER FUNCTIONS
================= */
let s = ((el) => {return document.querySelector(el)})

let beautify = (num) => {

  if (num < 1) {
    return num.toFixed(1);
  }
  if (num < 1000000) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //found on https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  } else {
	  
	  let suffixes = ['ones','thousand',' Million',' Billion',' Trillion',' Quadrillion',' Quintillion',' Sextillion',' Alotillion',' Waytoomanyillion',' F*ckloadillion',' F*ckloadillion',' F*cktonillion'];
	  
	  let length = Math.floor(Math.log10(num)+1);//find length of number
	  let suffixIndex = Math.floor(length/3);
	  let reducedNum = num/(Math.pow(10,(length - 4)));//reduce number to a number less than 1000 
	  let decimalPlace = (length - 4)%3;//determines how many decimal places to use
	  if(suffixIndex > suffixes.length)//if out of bounds of index convert to engineering notation 
	  {
		  let engineeringPower = (length - 3)+decimalPlace;
		  return (reducedNum + ' e^' + engineeringPower);
	  }
	  return reducedNum.toFixed(decimalPlace+1)+suffixes[suffixIndex];
	  
    /*if (num >= 1000000000000000000000000000000000) {
      return (num/1000000000000000000000000000000000).toFixed(0) + ' F*cktonillion'
    }
    if (num >= 1000000000000000000000000000000) {
      return (num/1000000000000000000000000000000).toFixed(1) + ' F*ckloadillion'
    }
    if (num >= 1000000000000000000000000000) {
      return (num/1000000000000000000000000000).toFixed(1) + ' Waytoomanyillion'
    }
    if (num >= 1000000000000000000000000) {
      return (num/1000000000000000000000000).toFixed(1) + ' Alotillion'
    }
    if (num >= 1000000000000000000000) {
      return (num/1000000000000000000000).toFixed(1) + ' Sextillion'
    }
    if (num >= 1000000000000000000) {
      return (num/1000000000000000000).toFixed(1) + ' Quintillion'
    }
    if (num >= 1000000000000000) {
      return (num/1000000000000000).toFixed(1) + ' Quadrillion'
    }
    if (num >= 1000000000000) {
      return (num/1000000000000).toFixed(1) + ' Trillion'
    }
    if (num >= 1000000000) {
      return (num/1000000000).toFixed(1) + ' Billion'
    }
    if (num >= 1000000) {
      return (num/1000000).toFixed(1) + ' Million'
    }*/
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

//https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
let beautifyMs = (ms) => {
  var seconds = (ms / 1000).toFixed(1);

  var minutes = (ms / (1000 * 60)).toFixed(1);

  var hours = (ms / (1000 * 60 * 60)).toFixed(1);

  var days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
      return seconds + " seconds";
  } else if (minutes < 60) {
      return minutes + " minutes";
  } else if (hours < 24) {
      return hours + " hours";
  } else {
      return days + " days"
  }
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
  for (let i = 0; i < 6; i++) {
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
    lastLogin: null,
    canRefine: false,

    permanentOpsMulti: 0,
    permanentOpcMulti: 0,
    permanentWeakHitMulti: 0,

    player: {
      generation: {
        lv: 0,
        currentXp: 0,
        xpNeeded: 100,
        availableSp: 0
      },
      pickaxe: {
        name: 'Beginners Wood Pickaxe',
        rarity: 'Common',
        iLv: 1,
        material: 'Wood',
        damage: 1
      },
      skills: {
        spSection1: 0,
        spSection2: 0,
        spSection3: 0
      },
    },

    quest: {
      active: false,
      currentQuest: null,
      currentQuestProgress: null,
      questCompletionTime: null,
    },

    stats: {
      totalOresMined: 0,
      totalOresEarned: 0,
      totalOresSpent: 0,
      currentOresEarned: 0,
      currentOresMined: 0,
      currentOreClicks: 0,
      critHits: 0,
      currentWeakSpotHits: 0,
      megaHits: 0,
      rocksDestroyed: 0,
      globalRocksDestroyed: 0,
      itemsPickedUp: 0,
      timePlayed: 0,
      highestCombo: 0,
      currentCombo: 0,
      timesRefined: 0,
      buildingsOwned: 0,
    },

    prefs: {
      volume: 0.5,
      bgm: 0,
      rockParticles: true,
      risingNumbers: true,
      scrollingText: true,
      fps: 30,
      shownAlert: false,
      buyAmount: 1,
      inventoryOpen: false
    }
  }

  Game.positionAllElements = () => {

    // POSITION TORCHES
    let torch1 = s('.torch1')
    let torch2 = s('.torch2')

    let torch1Anchor = s('#left-separator').getBoundingClientRect()
    torch1.style.left = torch1Anchor.right + 'px'
    torch1.style.top = '25%'

    let torch2Anchor = s('#main-separator').getBoundingClientRect()
    torch2.style.left = torch2Anchor.left - torch2.getBoundingClientRect().width + 'px'
    torch2.style.top = '25%'

    // POSITION SETTINGS CONTAINER
    let settingsContainer = s('.settings-container')

    let anchorHorizontal = s('#horizontal-separator').getBoundingClientRect()
    let anchorVertical = s('#main-separator').getBoundingClientRect()

    settingsContainer.style.position = 'absolute'
    settingsContainer.style.top = anchorHorizontal.top - settingsContainer.getBoundingClientRect().height + 'px'
    settingsContainer.style.left = anchorVertical.left - settingsContainer.getBoundingClientRect().width  + 'px'

    // POSITION REFINE BTNS
    if (Game.state.stats.totalOresEarned > 1000000 || Game.state.stats.timesRefined > 0) {
      s('.refine-btn').style.display = 'block'
    } else {
      s('.refine-btn').style.display = 'none'
    }

    // POSITION QUEST BTN
    if (Game.state.stats.timesRefined > 0) {
      let verticalAnchor = s('.inventory-section').getBoundingClientRect()
      let horizontalAnchor = s('#main-separator').getBoundingClientRect()

      let btn = s('.open-quests-container')

      btn.style.top = verticalAnchor.bottom + 'px'
      btn.style.left = horizontalAnchor.left - btn.getBoundingClientRect().width - 30 + 'px'
    }

    let bottomLeftBtnsContainer = s('.bottom-left-btns-container')

    anchorHorizontal = s('#horizontal-separator').getBoundingClientRect()
    anchorVertical = s('#left-separator').getBoundingClientRect()

    bottomLeftBtnsContainer.style.position = 'absolute'
    bottomLeftBtnsContainer.style.top = anchorHorizontal.top - bottomLeftBtnsContainer.getBoundingClientRect().height + 'px'
    bottomLeftBtnsContainer.style.left = anchorVertical.right + 'px'

    // POSITION ORE WEAK SPOT
    let magnifyingGlass = Game.select(Game.upgrades, 'Magnifying Glass')
    if (magnifyingGlass.owned) {
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
    } else {
      s('.ore-weak-spot').style.display = 'none'
    }

    // POSITION INVENTORY SLIDE
    if (Game.state.stats.itemsPickedUp > 0) {
      let anchor = s('#left-separator').getBoundingClientRect()
      if (!Game.state.prefs.inventoryOpen) {
        s('.inventory-container').style.left = anchor.right - s('.inventory-container').getBoundingClientRect().width + s('.inventory-container__right').getBoundingClientRect().width + 'px'
        s('.inventory-container').style.top = (s('.ore-container').getBoundingClientRect().bottom + s('.ore-container').getBoundingClientRect().top)/2 - (s('.inventory-container').getBoundingClientRect().height / 2) + 'px'
        s('.inventory-container').style.visibility = 'visible'
      } else {
        s('.inventory-container').style.left = anchor.right + 'px'
        s('.inventory-container').style.top = (s('.ore-container').getBoundingClientRect().bottom + s('.ore-container').getBoundingClientRect().top)/2 - (s('.inventory-container').getBoundingClientRect().height / 2) + 'px'
        s('.inventory-container').style.visibility = 'visible'
      }
    }

    Game.repositionAllElements = 0
  }

  Game.showChangelog = (show) => {
    let newestVersion = '0.6.8.1'

    if (Game.state.currentVersion != newestVersion || Game.state.ores == 0 || show == 1) {
      Game.state.currentVersion = newestVersion
      let div = document.createElement('div')
      div.classList.add('wrapper')
      div.onclick = () => Game.removeEl(s('.wrapper'))
      div.innerHTML = `
        <div class="changelog-container">
          <h1>Changelog</h1>
          <p style='text-align: center'>(Click anywhere to close)</p>
          <hr style='border-color: black; margin-bottom: 10px;'/>

          <h3>v0.7 (10/25/2017)</h3>
          <p>-Offline progression</p>
          <p>-Autosave and autoload</p>
          <p>-Upgrades are now sorted by price</p>
          <p>-Added a bunch of new sprites. All buildings and current upgrades have a sprite</p>
          <p>-Working refine mechanic with timer</p>

          <p>-Took out leveling for generations</p>
          <br/>

          <h3>v0.6.8.1 (10/13/2017)</h3>
          <p>-Trinket store is now working... most of em</p>
          <br/>

          <h3>v0.6.8 (10/12/2017)</h3>
          <p>-Working on Gems store</p>
          <p>-Working on Quests</p>
          <p>-Countless bug fixes</p>
          <br/>

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

  Game.export = () => {
    alert('SAVE FILE COPIED')
    let save = btoa(JSON.stringify(Game.state))
    let textarea = document.createElement('textarea')

    textarea.style.opacity = '0'

    s('body').append(textarea)

    textarea.value = save

    textarea.select()

    try {
      document.execCommand('copy')
    } catch (err) {
      console.log('unable to copy')
    }

    if (s('textarea')) {
      console.log('removing textarea')
      Game.removeEl(s('textarea'))
    }
  }

  Game.import = () => {
    let save = prompt('Enter save code')

    try {
      if (save.length > 1500) {
        let newState = JSON.parse(atob(save))
        Game.state = newState
        Game.save()
        location.reload()
      } else {
        console.log('not a valid save')
      }
    } catch (err) {
      console.log('not a valid save')
    }
  }

  Game.save = () => {
    Game.state.lastLogin = new Date().getTime()
    localStorage.setItem('state', JSON.stringify(Game.state))
    console.log('SAVED STATE')
    localStorage.setItem('buildings', JSON.stringify(Game.buildings))
    console.log('SAVED BUILDINGS')
    localStorage.setItem('upgrades', JSON.stringify(Game.upgrades))
    console.log('SAVED UPGRADES')
    localStorage.setItem('skills', JSON.stringify(Game.skills))
    console.log('SAVED SKILLS')
    localStorage.setItem('quests', JSON.stringify(Game.quests))
    console.log('SAVED QUESTS')
    localStorage.setItem('achievements', JSON.stringify(Game.achievements))
    console.log('SAVED ACHIEVEMENTS')
    Game.notify('Game Saved')
  }

  Game.load = () => {
    Game.upgrades = []
    Game.buildings = []
    Game.skills = []
    Game.achievements = []
    Game.quests = []

    if (localStorage.getItem('state') !== null) {
      console.log('SAVE FILE FOUND')
      // LOAD IN STATE
      console.log('LOADING STATE')
      Game.state = JSON.parse(localStorage.getItem('state'))

      // LOAD BUILDINGS AND UPGRADES
      console.log('LOADING BUILDINGS AND UPGRADES')
      let items = []
      JSON.parse(localStorage.getItem('buildings')).forEach((building) => items.push(building))
      JSON.parse(localStorage.getItem('upgrades')).forEach((upgrade) => items.push(upgrade))
      items.forEach((item) => new Item(item))

      // LOAD SKILLS
      console.log('LOADING SKILLS')
      let skills = []
      JSON.parse(localStorage.getItem('skills')).forEach((skill) => skills.push(skill))
      skills.forEach((skill) => new Skill(skill))
      console.log('skills', Game.skills)

      // LOAD ACHIEVEMENTS
      console.log('LOADING ACHIEVEMENTS')
      let achievements = []
      JSON.parse(localStorage.getItem('achievements')).forEach((achievement) => achievements.push(achievement))
      achievements.forEach((achievement) => new Achievement(achievement))

      // LOAD QUESTS
      console.log('LOADING QUESTS')
      let quests = []
      JSON.parse(localStorage.getItem('quests')).forEach((quest) => quests.push(quest))
      quests.forEach((quest) => new Quest(quest))

      // GAIN AWAY INCOME
      if (Game.state.oresPerSecond > 0 && Game.state.lastLogin) Game.earnOfflineGain()

      console.log('LOADING SAVE COMPLETE')
    } else {
      console.log('NO SAVE FILE')

      // BUILD ITEMS
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

      // BUILD QUESTS
      quests.forEach((quest) => {
        new Quest(quest)
      })

      Game.tutorialOne()
      Game.tutOneActive = true
    }

    // PRELOAD ORE IMAGES
    for (let i = 1; i <= 4; i++) { // ore 1, ore 2, ore 3, ore 4
      for (let j = 1; j <= 5; j++) { // 1-1, 1-2, 1-2, 1-4, 1-5 etc
        let preloadImage = new Image()
        preloadImage.src = `./assets/images/ore${i}-${j}.png`
      }
    }

    // SHOW WELCOME TEXT
    let welcomeTxt = document.createElement('div')
    welcomeTxt.classList.add('wrapper')
    welcomeTxt.innerHTML = `
      <div class="welcome-text" onClick='Game.removeEl(document.querySelector(".wrapper"));'>
        <h1>Welcome to More Ore Alpha v.0.9</h1>
        <br />
        <p>After a long hiatus from programming, I am finally excited to work on More Ore again</p>
        <p>Since this game is in its early alpha stages, current features might be changed or scrapped in the final version.</p>
        <p>If you have any interesting gameplay ideas, let me know! Post in the comments or email me!</p>
        <p style='color: red;'>Game is only compatible in Google Chrome as of now</p>
        <br />
        <p style='text-align: center;'>[ Press ESC or click to close window ]</p>
      </div>
    `

    s('body').append(welcomeTxt)

    // PREREQUISITES
    Game.updatePercentage(0)
    Game.state.prefs.inventoryOpen = false
    // Game.playBgm()
    Game.showTextScroller()
    Game.repositionAllElements = 1
    Game.rebuildStats = 1
    Game.rebuildStore = 1
    Game.rebuildInventory = 1
    Game.recalculateOpC = 1
    Game.recalculateOpS = 1
    Game.redrawQuestInfo = 1
    Game.drawQuestBtn()
    s('.loading').classList.add('finished')

    setTimeout(() => {
      Game.removeEl(s('.loading'))
    }, 1500)
  }

  Game.confirmWipe = () => {
    let div = document.createElement('div')
    div.classList.add('wrapper')
    div.innerHTML = `
      <div class="offline-gain-popup-container">
        <h2 style='font-family: "Germania One"; letter-spacing: 1px;'>Confirm Wipe</h2>
        <i class='fa fa-times fa-1x' onclick='Game.removeEl(document.querySelector(".wrapper"))'></i>
        <hr />
        <p style='color: red'>Are you sure you want to wipe your save?</p>
        <p style='color: red'>You will lose all your progress and achievements</p>
        <hr />
        <button onclick='Game.wipe()'>Yes</button>
        <button onclick='Game.closeCurrentWindow()'>No</button>
      </div>
    `

    s('body').append(div)
  }

  Game.wipe = () => {
    localStorage.clear()
    location.reload()
  }

  Game.playSound = (snd) => {
    let sfx = new Audio(`./assets/sounds/${snd}.wav`)
    sfx.volume = Game.state.prefs.volume
    sfx.play()
  }

  Game.playBgm = () => {
    let selected = Math.floor(Math.random() * 4) + 1
    let bgm = s('#bgm')
    bgm.src = `./assets/sounds/bgm${selected}.mp3`
    bgm.play()
    bgm.onended = () => Game.playBgm()
  }

  Game.toggleBgm = () => {
    let selected = Math.floor(Math.random() * 4) + 1
    let audio = s('audio')
    audio.src = `./assets/sounds/bgm${selected}.mp3`
    audio.onended = () => Game.toggleBgm('on')
    audio.volume = 0.1
    bgm.onended = () => Game.playBgm()
    if (Game.state.prefs.bgm) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  Game.earnOfflineGain = () => {
    let past = Game.state.lastLogin
    let current = new Date().getTime()
    let amountOfTimePassed = (current - past) / 1000 // GETS THE DIFFERENCE IN SECONDS
    let currentOpS = Game.state.oresPerSecond
    let amountToGain = (amountOfTimePassed * currentOpS)
    if (amountToGain >= 1 && amountOfTimePassed >= 30) {
      if (!s('.offline-gain-popup-container')) {
        let div = document.createElement('div')
        div.classList.add('wrapper')
        div.innerHTML = `
          <div class="offline-gain-popup-container">
            <h2 style='font-family: "Germania One"; letter-spacing: 1px;'>Welcome Back!</h2>
            <hr />
            <p>You were gone for ${beautifyMs(amountOfTimePassed * 1000)}</p>
            <p>You earned ${beautify(Math.round(amountToGain))} ores!</p>
            <hr />
            <button onclick='Game.earn(${amountToGain}); Game.risingNumber(${amountToGain},"passive", event); Game.removeEl(document.querySelector(".wrapper")); Game.save();'>Ok</button>
          </div>
        `

        s('body').append(div)
      }
    }
  }

  Game.notify = (text) => {
    let div = document.createElement('div')

    div.classList.add('notify')

    div.innerHTML = `
      <p>${text}</p>
    `

    s('body').append(div)

    setTimeout(() => {
      Game.removeEl(div)
    }, 3000)
  }

  Game.earn = (amount) => {
    Game.state.ores += amount
    Game.updatePercentage(amount)
    Game.rebuildInventory = 1
    Game.state.stats.currentOresEarned += amount
    Game.state.stats.totalOresEarned += amount

    // UNLOCKS
    if (Game.state.stats.currentOresEarned >= 200) {
      Game.unlockUpgrade('Work Boots')
      Game.unlockUpgrade('Painkillers')
    }
    if (Game.state.stats.currentOresEarned >= 600) {
      Game.unlockUpgrade('Shiny Watch')
      Game.unlockUpgrade('Whetstone')
    }
    if (Game.state.stats.currentOresEarned >= 1000) Game.unlockUpgrade('Flashlight')
    if (Game.state.stats.currentOresEarned >= 8000) {
      Game.unlockUpgrade('Steroids')
      Game.unlockUpgrade('Safety Vest')
    }
    if (Game.state.stats.currentOresEarned >= 25000) Game.unlockUpgrade('Clipboard')

    if (Game.state.player.generation.lv == 0 && Game.state.canRefine == false) {
      if (Game.state.stats.currentOresEarned >= 1000000 || Game.state.ores >= 1000000) {
        Game.state.canRefine = true
        Game.repositionAllElements = 1
        setTimeout(() => {Game.tutorialRefine()}, 1000)
      }
    }
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

    s('.ore').addEventListener("click", () => {
      Game.removeEl(div)
      setTimeout(() => {
        if (Game.state.stats.buildingsOwned == 0) {
          Game.tutorialTwo()
        }
      }, 2000)
    }, {once : true});
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

    let check = setInterval(() => {
      if (Game.state.stats.buildingsOwned > 0) {
        Game.removeEl(div)
        clearInterval(check)
      }
    }, 500)
  }

  Game.showTutorialRefine = 0
  Game.tutorialRefine = () => {
    if (Game.showTutorialRefine == 0 && Game.state.player.generation.lv == 0) {
      Game.showTutorialRefine = 1
      let div = document.createElement('div')
      div.id = 'refine-tut'

      div.classList.add('tutorial-container')
      div.innerHTML = `
        <div class="tutorial-arrow-left"></div>
        <div class="tutorial-text">
          <p>You can now refine!</p>
          <p>It is highly recommended to refine ASAP for your first refine</p>
        </div>
      `

      let anchor = s('.refine-btn').getBoundingClientRect()

      s('body').append(div)

      div.style.top = anchor.top - (anchor.height / 2) + 'px'
      div.style.left = anchor.right + 'px'
    }
  }

  Game.tutorialQuest = () => {
    setTimeout(() => {
      if (Game.state.stats.timesRefined == 1) {
        let div = document.createElement('div')
        div.id = 'quest-tut'

        div.classList.add('tutorial-container')
        div.innerHTML = `
          <div class="tutorial-text">
            <p>Quests are now available!</p>
            <p>Go on quests for Generation XP, Gems, and even <span style='color: #673AB7;text-shadow: 0 2px #e40b32;'>Mythical Artifacts!</span></p>
          </div>
          <div class="tutorial-arrow"></div>
        `

        let anchor = s('.open-quests-container').getBoundingClientRect()

        s('body').append(div)

        div.style.top = anchor.top + (anchor.height / 6) + 'px'
        div.style.left = anchor.left - div.getBoundingClientRect().width + 'px'
      }
    }, 1000)
  }

  Game.calculateOpC = () => {
    let opc = 0

    opc += Game.state.player.pickaxe.damage

    // IF PICKAXE HAS STRENGTH
    if (Game.state.player.pickaxe.prefixStat) {
      if (Game.state.player.pickaxe.prefixStat == 'Strength') {
        // pickaxeStr = Game.state.player.pickaxe.prefixStatVal
        opc += Math.pow(1.2, Game.state.player.pickaxe.prefixStatVal)
      }
    }

    let flashlight = Game.select(Game.upgrades, 'Flashlight')
    if (flashlight.owned > 0) opc += (Game.state.oresPerSecond * .01)
    let clipboard = Game.select(Game.upgrades, 'Clipboard')
    if (clipboard.owned > 0) opc += (Game.state.oresPerSecond * .02)

    // ADD OPC MULTIPLIER
    opc += (opc * Game.state.opcMulti)

    // ADD PERMA OPC MULTI
    opc += (opc * Game.state.permanentOpcMulti)

    // ADD GENERATION BONUS
    // opc += (opc * (Game.state.player.generation.lv * 1))

    Game.state.oresPerClick = opc
    Game.recalculateOpC = 0

    // OPC ACHIEVEMENTS
    if (Game.state.oresPerClick >= 1000000) Game.winAchievement('Still a Baby')
    if (Game.state.oresPerClick >= 1000000000) Game.winAchievement('Getting There')
    if (Game.state.oresPerClick >= 1000000000000) Game.winAchievement('Big Boy')
  }

  Game.calculateOpS = () => {
    let ops = 0

    for (let i in Game.buildings) {
      if (Game.buildings[i].owned > 0) {
        ops += Game.buildings[i].production * Game.buildings[i].owned
      }
    }

    // GENERATION BONUS
    // ops += (ops * (Game.state.player.generation.lv * 1))

    // OPS MULTIeeeeeeeeeeeeeeee
    ops += (ops * Game.state.opsMulti)

    // ADD PERMA OPS MULTI
    ops += (ops * Game.state.permanentOpsMulti)

    Game.state.oresPerSecond = ops
    Game.recalculateOpS = 0

    // OPS ACHIEVEMENTS
    if (Game.state.oresPerSecond >= 401000) Game.winAchievement('401k')
    if (Game.state.oresPerSecond >= 5000000) Game.winAchievement('Retirement Plan')
    if (Game.state.oresPerSecond >= 1000000000) Game.winAchievement('Hedge Fund')
  }

  Game.calculateGenerationXp = () => {
    let xp = Math.floor(Math.cbrt(Game.state.stats.currentOresEarned))
    // let xpCopy = xp
    // let lvs = 0

    // let xpNeeded;
    // while (xpCopy > 0) {
    //   console.log(xpCopy)
    //   xpNeeded = 100 * Math.pow(1.9, lvs)
    //   if (Game.state.player.generation.currentXp + xpCopy > xpNeeded) {
    //     xpCopy -= (xpNeeded - Game.state.player.generation.currentXp)
    //     lvs++
    //   } else {
    //     xpCopy = 0
    //   }
    // }

    let info = {
      xp: xp,
      // lvs: lvs
    }
    return info
  }

  Game.gainGenerationXp = () => {

    let gain = Game.calculateGenerationXp()

    let generation = Game.state.player.generation

    while (gain.xp > 0) {
      if (generation.currentXp + gain.xp < generation.xpNeeded) { // if you dont level up
        generation.currentXp += gain.xp
        gain.xp = 0
      } else { // If you level up
        gain.xp -= (generation.xpNeeded - generation.currentXp)
        Game.gainGenerationLv()
      }
    }
  }

  Game.gainGenerationLv = () => {
    Game.state.player.generation.lv++
    Game.state.player.generation.availableSp += 1
    Game.state.player.generation.xpNeeded = 100 * Math.pow(1.25, Game.state.player.generation.lv)
  }

  Game.getCombo = (type) => {
    if (type) { // IF WEAK SPOT HIT
      Game.state.stats.currentCombo++
      if (Game.state.stats.currentCombo % 5 == 0) {
        Game.risingNumber(0, 'combo', event)
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
        amount *= (Game.state.weakHitMulti + Game.state.permanentWeakHitMulti)
        Game.playSound('ore-crit-hit')
        Game.risingNumber(amount, 'weak-hit', event)
        Game.state.stats.currentWeakSpotHits++
        Game.repositionAllElements = 1
      }
    } else {
      Game.getCombo()
      Game.playSound('ore-hit')
      Game.risingNumber(amount, event)
      // Game.gainXp()
    }

    Game.earn(amount)
    Game.drawRockParticles()
    Game.state.stats.currentOreClicks++
    Game.state.stats.currentOresMined += amount
    Game.state.stats.totalOresMined += amount
    console.log(amount)

    // CHECK CLICK RELATED ACHIEVEMENTS

    Game.recentlyClicked = 0;

    // UNLOCK SHIT
    if (Game.state.stats.currentOreClicks == 3) Game.unlockUpgrade('Magnifying Glass')
    if (Game.state.stats.currentWeakSpotHits == 5) Game.unlockUpgrade('Clean Magnifying Glass')
    if (Game.state.stats.currentWeakSpotHits == 20) Game.unlockUpgrade('Polish Magnifying Glass')
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

      let allRisingNumbers = document.querySelectorAll('.rising-number')
      if (allRisingNumbers.length > 10) {
        let selectedEl = allRisingNumbers[0]
        Game.removeEl(selectedEl)
      }

      let risingNumber = document.createElement('div')
      risingNumber.classList.add('rising-number')
      if (amount) risingNumber.innerHTML = `+${beautify(amount)}`
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

      if (type == 'passive') {
        risingNumber.innerHTML = `+${beautify(amount)}`
        risingNumber.style.fontSize = '35px'
      }

      if (type == 'bonus') {
        risingNumber.innerHTML = `+${beautify(amount)}`
        risingNumber.style.color = 'gold'
        risingNumber.style.fontSize = '40px'
        risingNumber.style.animationDuration = '3s'
      }

      if (type == 'gold rush') {
        risingNumber.innerHTML = `GOLD RUSH <br/> +${beautify(amount)}`
        risingNumber.style.color = 'gold'
        risingNumber.style.textAlign = 'center'
        risingNumber.style.fontSize = '40px'
        risingNumber.style.animationDuration = '3s'
      }

      if (type == 'skill up') {
        risingNumber.innerHTML = `<i class='fa fa-level-up'></i>`
        risingNumber.style.color = 'green'
        risingNumber.style.fontSize = '30px'
      }

      if (type == 'quest-progress') {
        risingNumber.innerHTML = `<i class='fa fa-angle-double-right fa-2x'></i>`
        risingNumber.style.color = 'white'
      }


      s('.particles').append(risingNumber)

      setTimeout(() => {
        Game.removeEl(risingNumber)
      }, 2000)
    }
  }

  Game.drawRockParticles = () => {
    if (Game.state.prefs.rockParticles == true) {
      let allParticles = document.querySelectorAll('.particle')
      if (allParticles.length >= 10) {
        let selectedEl = allParticles[0]
        Game.removeEl(selectedEl)
      }
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
          if (div.parentNode) div.parentNode.removeChild(div)
        }, 1000)
      }, 100)

      s('body').append(div)
    }
  }

  Game.checkDrop = () => {
    let amountOfRocksDestroyed = Game.state.stats.rocksDestroyed
    let itemDropChance = .3 // 30%

    if (amountOfRocksDestroyed <= 5) {
      if (amountOfRocksDestroyed === 1 || amountOfRocksDestroyed === 4) {
        Game.dropItem()
      }
    } else {
      if (Math.random() < itemDropChance) {
        Game.dropItem()
      }
    }
  }

  Game.dropItem = () => {
    let randomSign = Math.round(Math.random()) * 2 - 1
    let randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign
    let randomY = Math.floor(Math.random() * 50) + 1
    let amountOfRocksDestroyed = Game.state.stats.rocksDestroyed
    let iLvl = amountOfRocksDestroyed
    let thisItemClicked = false
    let itemContainer = document.createElement('div')

    itemContainer.classList.add('item-container')
    itemContainer.id = `item-${amountOfRocksDestroyed}`
    itemContainer.innerHTML = `
      <div class="item-pouch-glow"></div>
      <div class="item-pouch-glow2"></div>
      <div class="item-pouch-glow3"></div>
    `

    // POSITION ITEM ON ORE
    let orePos = s('.ore').getBoundingClientRect()
    itemContainer.style.position = 'absolute'
    itemContainer.style.top = (orePos.top + orePos.bottom)/1.5 + 'px'
    itemContainer.style.left = (orePos.left + orePos.right)/2 + 'px'
    itemContainer.style.transition = 'all .5s'
    itemContainer.style.transitionTimingFunction = 'ease-out'

    // MAKE ITEM
    let item = document.createElement('div')
    item.classList.add('item-drop')
    item.style.position = 'relative'
    item.id = `item-${amountOfRocksDestroyed}`

    itemContainer.append(item)

    s('body').append(itemContainer)

    // SMALL ANIMATION FOR ITEM MOVEMENT
    setTimeout(() => {
      itemContainer.style.top = orePos.bottom + randomY + 'px'
      itemContainer.style.left = (orePos.left + orePos.right)/2 + randomNumber + 'px'
    }, 10)

    item.addEventListener('click', () => {
      let id = item.id
      item.style.pointerEvents = 'none'
      s(`#${id}`).classList.add('item-pickup-animation')
      setTimeout(() => {
        let items = document.querySelectorAll(`#${id}`)
        items.forEach((item) => {
          Game.removeEl(item)
        })
        Game.pickUpItem(iLvl)
      }, 800)
    })
  }

  Game.generateRandomPickaxe = (iLvl) => {

    let selected
    let totalMultiplier = 0
    let pickaxeName = ''

    let allRarities = [
      // [name, [stat range], multiplier]
      ['Common', [0, 1], 1],
      ['Uncommon', [0, 2], 1.5],
      ['Rare', [1, 2], 2],
      ['Unique', [2, 3], 3.5],
      ['Legendary', [3, 4], 5],
      ['Mythical', [4, 5], 10]
    ]
    let allMaterials = [
      // [[names], multiplier]
      [['Wood', 'Plastic', 'Cardboard', 'Glass', 'Tin'], .5],
      [['Stone', 'Bronze', 'Copper', 'Bone', 'Lead'], 1],
      [['Iron', 'Silver', 'Gold'], 3],
      [['Steel', 'Platinum'], 5],
      [['Diamond', 'Adamantite', 'Titanium', 'Alien'], 10]
    ]
    let allPrefixes = [
      // common prefixes +1
      [
        ['Pointy', 'Strong', 'Refined', 'Big', 'Durable', 'Hard'],
        ['Charming', 'Shiny'],
        ['Lucky']
      ],
      // uncommon prefixes -1
      [
        ['Small', 'Broken', 'Shoddy', 'Frail', 'Hollow'],
        ['Boring', 'Rusty', 'Rusted'],
        ['Unlucky', 'Poor']
      ],
      // rare prefixes +2
      [
        ['Sharp', 'Gigantic'],
        ['Elegant', 'Alluring'],
        ['Fortuitous']
      ]
    ]
    let allSuffixes = [
      ['of the Giant', 'of the Beast'],
      ['of the Prince', 'of the Sun'],
      ['of the Beggar', 'of the Leprechaun']
    ]

    // SELECT RARITY
    let randomNum = Math.random()
    let selectedRarity
    if (randomNum >= 0) selected = allRarities[0]   // 45%  Common
    if (randomNum >= .45) selected = allRarities[1] // 25%  Uncommon
    if (randomNum >= .70) selected = allRarities[2] // 15%  Rare
    if (randomNum >= .85) selected = allRarities[3] // 9%   Unique
    if (randomNum >= .94) selected = allRarities[4] // 5%   Legendary
    if (randomNum >= .99) selected = allRarities[5] // 1%   Mythical
    selectedRarity = {
      name: selected[0],
      stat_amount: Math.floor(Math.random() * (selected[1][1] - selected[1][0] + 1) + selected[1][0]),
      multiplier: selected[2]
    }
    totalMultiplier += selectedRarity.multiplier

    // SELECT PREFIX
    randomNum = Math.random()
    let selectedPrefix
    if (selectedRarity.stat_amount > 0) {
      if (randomNum <= .6) { // 60%
        let multiplier, stat, name
        let selectedType = Math.floor(Math.random() * allPrefixes.length)
        let selectedStat = Math.floor(Math.random() * allPrefixes[selectedType].length)
        let selectedName = Math.floor(Math.random() * allPrefixes[selectedType][selectedStat].length)

        name = allPrefixes[selectedType][selectedStat][selectedName]
        pickaxeName += name

        if (selectedType == 0) multiplier = 1
        if (selectedType == 1) multiplier = -1
        if (selectedType == 2) multiplier = 2

        if (selectedStat == 0) stat = 'Strength'
        if (selectedStat == 1) stat = 'Charisma'
        if (selectedStat == 2) stat = 'Luck'

        selectedPrefix = { name, stat, multiplier }
        totalMultiplier += selectedPrefix.multiplier
      }
    }

    // SELECT MATERIAL
    randomNum = Math.random()
    if (randomNum >= 0) selected = allMaterials[0]    // 35%
    if (randomNum >= .5) selected = allMaterials[1]   // 50%
    if (randomNum >= .7) selected = allMaterials[2]   // 9%
    if (randomNum >= .85) selected = allMaterials[3]  // 5%
    if (randomNum >= .95) selected = allMaterials[4]  // 1%
    let selectedMaterial = {
      name: selected[0][Math.floor(Math.random() * selected[0].length)],
      multiplier: selected[1]
    }
    pickaxeName += ` ${selectedMaterial.name} Pickaxe`
    totalMultiplier += selectedMaterial.multiplier

    // SELECT SUFFIX
    randomNum = Math.random()
    let selectedSuffix
    if (selectedRarity.multiplier >= 3.5) {
      if (randomNum <= .5) {
        let stat, name
        let selectedStat = Math.floor(Math.random() * allSuffixes.length)
        let selectedName = Math.floor(Math.random() * allSuffixes[selectedStat].length)

        if (selectedStat == 0) stat = 'Strength'
        if (selectedStat == 1) stat = 'Charisma'
        if (selectedStat == 2) stat = 'Luck'

        name = allSuffixes[selectedStat][selectedName]
        pickaxeName += ` ${name}`

        selectedSuffix = { name, stat }
        totalMultiplier += 10
      }
    }

    totalMultiplier *= (iLvl * .5)

    // DAMAGE
    let damage = iLvl * totalMultiplier

    // SELECT AND BUILD BONUS STATS
    let pickaxeStats = {
      Strength: [],
      Charisma: [],
      Luck: []
    }

    let statAmount = selectedRarity.stat_amount
    if (statAmount > 0) {
      if (selectedSuffix) {
        statAmount--
        pickaxeStats[selectedSuffix.stat].push(Math.floor(Math.random() * (totalMultiplier - (totalMultiplier / 2) + 1) + (totalMultiplier / 2)))
      }
      if (selectedPrefix) {
        statAmount--
        pickaxeStats[selectedPrefix.stat].push(Math.floor(Math.random() * (totalMultiplier - (totalMultiplier / 2) + 1) + (totalMultiplier / 2)))
      }
      if (statAmount > 0) {
        for (let i = 0; i < statAmount; i++) {
          let possibleStats = ['Strength', 'Charisma', 'Luck']
          pickaxeStats[possibleStats[Math.floor(Math.random() * possibleStats.length)]].push(Math.floor(Math.random() * (totalMultiplier - (totalMultiplier / 2) + 1) + (totalMultiplier / 2)))
        }
      }
    }

    let pickaxe = {
      name: pickaxeName,
      rarity: selectedRarity.name,
      material: selectedMaterial.name,
      stats: pickaxeStats,
      iLv: iLvl,
      damage: damage,
      raw_info: {
        rarity: selectedRarity,
        prefix: selectedPrefix,
        material: selectedMaterial,
        suffix: selectedSuffix,
      }
    }

    console.log('generating pickaxe:', pickaxe)
    return pickaxe
  }

  Game.pickUpItem = (iLvl) => {
    let amountOfRocksDestroyed = Game.state.stats.rocksDestroyed
    Game.state.stats.itemsPickedUp++
    if (Game.state.stats.itemsPickedUp == 1) Game.repositionAllElements = 1

    if (amountOfRocksDestroyed === 1) { Game.newItem = { name: 'Big Lead Pickaxe', rarity: 'Common', material: 'Lead', stats: { Strength: [1], Charisma: [], Luck: [] }, iLv: 2, damage: 3, }
    } else if (amountOfRocksDestroyed === 4) { Game.newItem = { name: 'Lucky Iron Pickaxe', rarity: 'Uncommon', material: 'Iron', stats: { Strength: [2], Charisma: [], Luck: [4] }, iLv: 4, damage: 47 }
    } else { Game.newItem = Game.generateRandomPickaxe(iLvl) }

    let itemModal = document.createElement('div')
    itemModal.classList.add('item-modal-container')

    let str = `
      <div class="item-modal">
        <div class="item-modal__left">
          <h1 style='font-family: "Germania One"; font-size: 60px;'>New Pickaxe</h1>
          <h2 class='${Game.newItem.rarity}' style='font-size: xx-large'>${Game.newItem.name}</h2>
          <div class="item-modal-img">
            <div class="pickaxe-top" style='background: url("./assets/images/pickaxe-top-${Game.newItem.material.toLowerCase()}.png"); background-size: 100% 100%;'></div>
            <div class="pickaxe-bottom"></div>
            `
            if (Game.newItem.rarity == 'Legendary' || Game.newItem.rarity == 'Mythical') {
              str += "<div class='pickaxe-bg'></div>"
            }

            str += `
          </div>
          <div class="item-stats">
            <p style='font-style: italic; font-size: small'>${Game.newItem.rarity}</p>
            <br/>
            <p>Item Level: ${Game.newItem.iLv}</p>
            <p>Damage: ${beautify(Game.newItem.damage)}</p>
            `

            if (Game.newItem.stats.Strength.length > 0) {
              Game.newItem.stats.Strength.forEach((val) => {
                str += `<p>Strength: ${val}</p>`
              })
            }

            if (Game.newItem.stats.Charisma.length > 0) {
              Game.newItem.stats.Charisma.forEach((val) => {
                str += `<p>Charisma: ${val}</p>`
              })
            }

            if (Game.newItem.stats.Luck.length > 0) {
              Game.newItem.stats.Luck.forEach((val) => {
                str += `<p>Luck: ${val}</p>`
              })
            }

            str += `
            <br/>
          </div>
          <div class="item-modal-bottom">
            <button onclick=Game.itemModalClick('equip')>Equip</button>
            <button onclick=Game.itemModalClick()>Discard</button>
          </div>
        </div>
        <div class="item-modal__right">
          <h1 style='font-family: "Germania One"; font-size: 30px;'>Equipped</h1>
          <h2 class='${Game.state.player.pickaxe.rarity}' style='font-size: large'>${Game.state.player.pickaxe.name}</h2>
          <div class="item-modal-img-small">
            <div class="pickaxe-top-small ${Game.state.player.pickaxe.material}" style='background: url("./assets/images/pickaxe-top-${Game.state.player.pickaxe.material.toLowerCase()}.png"); background-size: 100% 100%;'></div>
            <div class="pickaxe-bottom-small"></div>
            `
            if (Game.state.player.pickaxe.rarity == 'Legendary' || Game.state.player.pickaxe.rarity == 'Mythical') {
              str += `<div class="pickaxe-bg-small"></div>`
            }

            str += `
          </div>
          <div class="item-stats">
              <p style='font-style: italic; font-size: small'>${Game.state.player.pickaxe.rarity}</p>
              <br/>
              <p>Item Level: ${Game.state.player.pickaxe.iLv}</p>
              <p>Damage: ${beautify(Game.state.player.pickaxe.damage)}</p>
              `

              if (Game.state.player.pickaxe.stats) {
                if (Game.state.player.pickaxe.stats.Strength.length > 0) {
                  Game.state.player.pickaxe.stats.Strength.forEach((val) => {
                    str += `<p>Strength: ${val}</p>`
                  })
                }

                if (Game.state.player.pickaxe.stats.Charisma.length > 0) {
                  Game.state.player.pickaxe.stats.Charisma.forEach((val) => {
                    str += `<p>Charisma: ${val}</p>`
                  })
                }

                if (Game.state.player.pickaxe.stats.Luck.length > 0) {
                  Game.state.player.pickaxe.stats.Luck.forEach((val) => {
                    str += `<p>Luck: ${val}</p>`
                  })
                }
              }

              str += `
            </div>
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

    s('.item-modal').style.animation = 'itemFallOut .3s forwards'
    s('.item-modal').addEventListener('animationend', () => Game.removeEl(s('.item-modal-container')))

    // Game.removeEl(s('.item-modal-container'))
  }

  Game.buildStore = () => {
    let str = ''
    str += `
      <div class="upgrades-container">
    `
    let hasContent = 0

    Game.sortedUpgrades = Game.upgrades.sort((a, b) => {
      return a.price - b.price;
    });

    for (let i in Game.sortedUpgrades) {
      let item = Game.sortedUpgrades[i]
      if (item.hidden == 0) {
        hasContent = 1
        str += `
          <div class="upgrade-item-container" style='background-color: #b56535'>
            <div class="upgrade-item" id="${item.name.replace(/\s/g , "-")}" onclick='Game.sortedUpgrades[${i}].buy(); Game.hideTooltip();' onmouseover="Game.showTooltip({name: '${item.name}', type: '${item.type}s'}, event); Game.playSound('itemhover')" onmouseout="Game.hideTooltip()" style='background: url(./assets/images/${item.pic}); background-size: 100%;'></div>
          </div>
        `
      }
    }
    if (hasContent == 0) str += `<h3 style="text-align: center; width: 100%; opacity: .5; height: 50px; line-height: 50px;">no upgrades available</h3>`
    str += `</div><div class="horizontal-separator" style='height: 8px;'></div>`

    if (Game.state.stats.timesRefined >= 1) {
      str += `
        <div class='bulk-buy-container'>
          <p>BUY AMOUNT:</p>
          <p onclick='Game.state.prefs.buyAmount = 1; Game.rebuildStore = 1' id='buy-1' class='bulk-buy-amt'>1</p>
          <p onclick='Game.state.prefs.buyAmount = 10; Game.rebuildStore = 1' id='buy-10' class='bulk-buy-amt'>10</p>
          <p onclick='Game.state.prefs.buyAmount = 100; Game.rebuildStore = 1' id='buy-100' class='bulk-buy-amt'>100</p>
          <p onclick='Game.state.prefs.buyAmount = "max"; Game.rebuildStore = 1' id='buy-max' class='bulk-buy-amt'>MAX</p>
        </div>
        <div class="horizontal-separator" style='height: 8px;'></div>
      `
    }

    for (let i in Game.buildings) {
      let item = Game.buildings[i]
      let price = Game.buildings[i].price
      if (Game.state.prefs.buyAmount != 'max') price = (item.basePrice * ((Math.pow(1.15, item.owned + Game.state.prefs.buyAmount) - Math.pow(1.15, item.owned)))/.15)
      if (item.hidden == 0) {
        str += `
          <div class="button" onclick="Game.buildings[${i}].buy();" onmouseover="Game.showTooltip({name: '${item.name}', type: '${item.type}s'}, event); Game.playSound('itemhover')" onmouseout="Game.hideTooltip()">
            <div style='pointer-events: none' class="button-top">
              <div class="button-left">
                <img src="./assets/images/${item.pic}" style='filter: brightness(100%); image-rendering: pixelated; image-rendering: -moz-crisp-edges'/>
              </div>
              <div style='pointer-events: none' class="button-middle">
                <h3 style='font-size: x-large'>${item.name}</h3>
                <p>cost: ${beautify(price)} ores</p>
              </div>
              <div style='pointer-events: none' class="button-right">
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
                <img src="./assets/images/${item.pic}" style='filter: brightness(0%)'/>
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
      if (item.hidden == 3) {
        str += `
          <div class="button" style='cursor: not-allowed; box-shadow: 0 4px black; opacity: .7; filter: brightness(60%)'>
            <div class="button-top">
              <div class="button-left">
                <img src="./assets/images/${item.pic}" style='filter: brightness(0%)'/>
              </div>
              <div class="button-middle">
                <h3 style='font-size: larger'>???</h3>
                <p>cost: ${beautify(item.price)} ores</p>
              </div>
              <div class="button-right">
              </div>
            </div>
          </div>
        `
      }
    }
    Game.rebuildStore = 0
    Game.loadAd()
    s('.tab-content').innerHTML = str

    //BULK BUY SETTINGS
    if (Game.state.stats.timesRefined >= 1) {
      if (Game.state.prefs.buyAmount == 1) s('#buy-1').style.color = 'white'
      if (Game.state.prefs.buyAmount == 10) s('#buy-10').style.color = 'white'
      if (Game.state.prefs.buyAmount == 100) s('#buy-100').style.color = 'white'
      if (Game.state.prefs.buyAmount == "max") s('#buy-max').style.color = 'white'
    }
  }

  Game.adsLoaded = false
  Game.loadAd = () => {
    if (Game.adsLoaded == false) {
      Game.adsLoaded = true
      for (let i = 0; i < 3; i++) {
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

    if (s('#ads-im-sorry-please-dont-hate-me').innerHTML.length < 1000) {
      let str = `
        <p style='text-align: center; background: transparent; color: white; padding-bottom: 20px;'>
        Please consider disabling adblock! <br/>
        I am just a broke college student and the cents generated from this game will be for food.
        <br/>
        Or consider supporting me on <a target='_blank' href="https://www.patreon.com/user?u=8032477">patreon!</a> <br/>(Even a dollar helps!)
        </p>
      `
      s('#ads-im-sorry-please-dont-hate-me').innerHTML = str
    }
  }

  Game.buildInventory = () => {
    let str = ''
    str += `Ores: ${beautify(Game.state.ores)}`
    if (Game.state.oresPerSecond > 0) {
      str += ` (${beautify(Game.state.oresPerSecond)}/s)`
    }
    if (Game.state.stats.timesRefined > 0) {
      str += `<br/> Gems: ${Game.state.gems}`
    }

    s('.ores').innerHTML = str

    s('.generation').innerHTML = `Generation: ${Game.state.player.generation.lv}`
    s('.generation').onmouseover = () => Game.showTooltip({type: 'generation'}, event)
    s('.generation').onmouseout = () => Game.hideTooltip()

    Game.rebuildInventory = 0
    // s('.level').innerHTML = lvlStr
  }

  Game.unlockUpgrade = (upgradeName) => {
    let upgrade = ''
    for (let i in Game.upgrades) {
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
      for (let i=0; i<Game.buildings.length; i++) {
        if (Game.buildings[i].name == item.name) {
          if (Game.buildings[i+1]) {
            if (Game.buildings[i+1].hidden == 1 || Game.buildings[i+1].hidden == 3) {
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

    if (item.buyFunctions) {
      if (item.buyFunctions.unlockUpgrades) {
        for (let i in item.buyFunctions.unlockUpgrades) {
          if (item.owned == item.buyFunctions.unlockUpgrades[i].amountNeeded) {
            Game.unlockUpgrade(item.buyFunctions.unlockUpgrades[i].name)
          }
        }
      }
      if (item.buyFunctions.addTextScroller) {
        for (let i in item.buyFunctions.addTextScroller) {
          if (item.owned == item.buyFunctions.addTextScroller[i].amountNeeded) {
            Game.textScroller.push(item.buyFunctions.addTextScroller[i].text)
          }
        }
      }
      if (item.buyFunctions.increaseProduction) {
        Game.select(Game.buildings, item.buyFunctions.increaseProduction.building).production *= item.buyFunctions.increaseProduction.multi
      }
      if (item.buyFunctions.multipliers) {
        for (let i in item.buyFunctions.multipliers) {
          if (item.buyFunctions.multipliers[i].type == 'ops') Game.state.opsMulti += item.buyFunctions.multipliers[i].amount
          if (item.buyFunctions.multipliers[i].type == 'opc') Game.state.opcMulti += item.buyFunctions.multipliers[i].amount
        }
      }
      if (item.buyFunctions.achievements) {
        for (let i in item.buyFunctions.achievements) {
          if (item.owned >= item.buyFunctions.achievements[i].amountNeeded) {
            Game.winAchievement(item.buyFunctions.achievements[i].name)
          }
        }
      }
    }



    if (item.name == 'Magnifying Glass') {
      Game.repositionAllElements = 1
    }

    // UPGRADES
    if (item.name == 'Clean Magnifying Glass') {
      Game.state.weakHitMulti += 5
    }
    if (item.name == 'Polish Magnifying Glass') {
      Game.state.weakHitMulti += 5
    }

    Game.recalculateOpC = 1
    Game.recalculateOpS = 1
  }

  let soundPlayed1 = false
  let soundPlayed2 = false
  let soundPlayed3 = false
  let soundPlayed4 = false
  let soundPlayed5 = false
  let whichPic = Math.floor(Math.random() * 4) + 1
  Game.updatePercentage = (amount) => {
    let oreHpPercentage = (Game.state.oreCurrentHp/Game.state.oreHp) * 100
    if (Game.state.oreCurrentHp - amount > 0) {
      Game.state.oreCurrentHp -= amount
      if (oreHpPercentage > 80 ) {
        s('.ore').style.background = `url("./assets/images/ore${whichPic}-1.png")`
        s('.ore').style.backgroundSize = 'cover'
      }
      if (oreHpPercentage <= 80 && soundPlayed1 == false) {
        s('.ore').style.background = `url("assets/images/ore${whichPic}-2.png")`
        s('.ore').style.backgroundSize = 'cover'
        Game.playSound('explosion')
        soundPlayed1 = true
      }
      if (oreHpPercentage <= 60 && soundPlayed2 == false) {
        s('.ore').style.background = `url("assets/images/ore${whichPic}-3.png")`
        s('.ore').style.backgroundSize = 'cover'
        Game.playSound('explosion')
        soundPlayed2 = true
      }
      if (oreHpPercentage <= 40 && soundPlayed3 == false) {
        s('.ore').style.background = `url("assets/images/ore${whichPic}-4.png")`
        s('.ore').style.backgroundSize = 'cover'
        Game.playSound('explosion')
        soundPlayed3 = true
      }
      if (oreHpPercentage <= 20 && soundPlayed4 == false) {
        s('.ore').style.background = `url("assets/images/ore${whichPic}-5.png")`
        s('.ore').style.backgroundSize = 'cover'
        Game.playSound('explosion')
        soundPlayed4 = true
      }
    } else {
      Game.state.stats.rocksDestroyed++
      Game.checkDrop()
      // Game.gainXp(10)
      Game.playSound('explosion2')
      Game.state.oreHp = Math.pow(Game.state.oreHp, 1.09)
      Game.state.oreCurrentHp = Game.state.oreHp

      if (Game.state.stats.rocksDestroyed == 1) {Game.winAchievement('Newbie Miner'); Game.textScroller.push('[Breaking News] Rocks are breaking!')}
      if (Game.state.stats.rocksDestroyed == 10) {Game.winAchievement('Novice Miner'); Game.textScroller.push('What happens in Ore Town stays in Ore Town')}
      if (Game.state.stats.rocksDestroyed == 25) {Game.winAchievement('Intermediate Miner'); Game.textScroller.push('[Breaking News] The cries of baby rocks can be heard from miles away as their parents get obliterated by this new miner')}
      if (Game.state.stats.rocksDestroyed == 50) Game.winAchievement('Advanced Miner')

      soundPlayed1 = false
      soundPlayed2 = false
      soundPlayed3 = false
      soundPlayed4 = false
      soundPlayed5 = false
      whichPic = Math.floor(Math.random() * 4) + 1
      s('.ore').style.background = `url("./assets/images/ore${whichPic}-1.png")`
      s('.ore').style.backgroundSize = 'cover'
      s('.ore-hp').innerHTML = '100%'
    }
    s('.ore-hp').innerHTML = `${oreHpPercentage.toFixed(0)}%`
  }

  Game.showTooltip = (obj) => {
    let tooltip = s('.tooltip')

    let anchor = s('#main-separator').getBoundingClientRect()

    tooltip.classList.add('tooltip-container')
    tooltip.style.display = 'block'

    tooltip.style.left = anchor.left - tooltip.getBoundingClientRect().width + 'px'
    tooltip.style.top = event.clientY + 'px'


    if (obj.type == 'buildings' || obj.type == 'upgrades') {
      tooltip.style.textAlign = 'left'
      tooltip.style.width = '300px'

      let selectedItem = Game.select(Game[obj.type], obj.name)

      tooltip.innerHTML = `
        <div class="tooltip-top">
          <img src="./assets/images/${selectedItem.pic}" height='40px' alt="" />
          <h3 style='flex-grow: 1'>${selectedItem.name}</h3>
          <p>${beautify(selectedItem.price)} ores</p>
        </div>
        <div class="tooltip-bottom">
          <hr />
          <p>${selectedItem.desc}</p>
          `
          if (selectedItem.type == 'building') {
            if (selectedItem.owned > 0 && selectedItem.owned < 2) {
              tooltip.innerHTML += `
                <hr />
                <p>Each ${selectedItem.name} generates ${beautify(selectedItem.production)} OpS</p>
                <p><span class='bold'>${selectedItem.owned}</span> ${selectedItem.name} generating <span class='bold'>${beautify(selectedItem.production * selectedItem.owned)}</span> ores per second</p>
              `
            } else {
              tooltip.innerHTML += `
                <hr />
                <p>Each ${selectedItem.name} generates ${beautify(selectedItem.production)} OpS</p>
                <p><span class='bold'>${selectedItem.owned}</span> ${selectedItem.namePlural} generating <span class='bold'>${beautify(selectedItem.production * selectedItem.owned)}</span> ores per second</p>
              `
            }
          }
          tooltip.innerHTML += `
          <hr/>
          <p style='font-size: small; opacity: .6; float: right; padding-top: 5px;'><i>${selectedItem.fillerQuote}</i></p>

        </div>
      `
    }

    if (obj.type == 'generation') {
      tooltip.style.textAlign = 'center'
      tooltip.style.width = 'auto'
      tooltip.style.left = event.clientX - tooltip.getBoundingClientRect().width/2 + 'px'
      tooltip.style.top = event.clientY + 20 + 'px'
      tooltip.style.minWidth = '150px'
      tooltip.innerHTML = `
        <h3>You are currently on Generation ${Game.state.player.generation.lv}</h3>
        <hr/>
        <p style='opacity: .4; font-size: smaller'>Generation XP: ${beautify(Math.floor(Game.state.player.generation.currentXp))}/${beautify(Math.floor(Game.state.player.generation.xpNeeded))}</p>
        <hr/>
        <p>You will gain ${beautify(Game.calculateGenerationXp().xp)}xp on refine </p>
      `
    }

    if (obj.type == 'skill') {
      let selectedSkill = Game.select(Game.skills, obj.name)
      tooltip.style.textAlign = 'left'
      tooltip.style.width = 'auto'
      tooltip.style.maxWidth = '400px'

      if (!selectedSkill.locked) {
        tooltip.innerHTML = `
          <div style='display: flex; flex-flow: row nowrap;'>
            <div style='background: url("./assets/images/skill_${selectedSkill.img}"); min-height: 64px; height: 64px; min-width: 64px; width: 64px; margin-right: 5px;'></div>
            <hr style='width: 1px; flex-grow: 1; margin-right: 5px; opacity: 0.1'/>
            <div style='flex-grow: 1'>
              <h2 style='font-family: "Germania One"'>${selectedSkill.name}</h2>
              <hr />
              <p style='font-size: small'><i style='opacity: .5'>${selectedSkill.fillerTxt}</i></p>
              <hr />
              <p>Current Level: ${selectedSkill.lvl}/${selectedSkill.maxLvl}</p>
              <p>Skill Type: ${selectedSkill.type}</p>
              <hr />
              <p>${selectedSkill.desc}</p>
            </div>
          </div>
        `
      } else {
        let str = ''
        str += `
          <div style='display: flex; flex-flow: row nowrap;'>
            <div style='background: url("./assets/images/skill_${selectedSkill.img}"); min-height: 64px; height: 64px; min-width: 64px; width: 64px; margin-right: 5px; opacity: 0.2;'></div>
            <hr style='width: 1px; flex-grow: 1; margin-right: 5px; opacity: 0.1'/>
            <div style='flex-grow: 1'>
              <h2 style='font-family: "Germania One"'>${selectedSkill.name}</h2>
              <hr />
              <p>Requirements</p>
              <hr />
              `

              // Build out generation requirements
              if (Game.state.player.generation.lv >= selectedSkill.generationReq) {
                str += `<p>Generation Level: ${selectedSkill.generationReq}</p>`
              } else {
                str += `<p style='color: red'>Generation Level: ${selectedSkill.generationReq}</p>`
              }

              // Build out skill requirements
              for (let i in selectedSkill.requires) {
                let skillNeeded = Game.select(Game.skills, selectedSkill.requires[i][0])
                if (skillNeeded.lvl >= selectedSkill.requires[i][1]) {
                  str += `<p>${selectedSkill.requires[i][0]} lv. ${selectedSkill.requires[i][1]}</p>`
                } else {
                  str += `<p style='color: red;'>${selectedSkill.requires[i][0]} lv. ${selectedSkill.requires[i][1]}</p>`
                }
              }

              str += `
            </div>
          </div>
        `

        tooltip.innerHTML = str
      }



      tooltip.style.left = event.clientX + 30 + 'px'
      tooltip.style.top = event.clientY - tooltip.getBoundingClientRect().height/2 + 'px'
    }

    if (obj.type == 'quest') {
      tooltip.style.left = s('.quest-btn').getBoundingClientRect().right + 20 + 'px'
      tooltip.style.top = s('.quest-btn').getBoundingClientRect().top + 'px'

      if (Game.state.stats.timesRefined == 0) {
        tooltip.innerHTML = `<p>Quests unlocked at Generation 1</p>`
        tooltip.style.width = 'auto'
      } else {
        tooltip.innerHTML = `<p>Quests available</p>`
        tooltip.style.width = 'auto'
      }
    }

    if (obj.type == 'achievement') {
      let str;
      let selectedAchievement = Game.select(Game.achievements, obj.achievementName)

      tooltip.style.left = event.clientX + 20 + 'px'
      tooltip.style.top = event.clientY + 20 + 'px'
      tooltip.style.textAlign = 'left'

      if (obj.missing) {
        str = `
          <h2>${selectedAchievement.name}</h2>
          <hr/>
          <p>???</p>
        `
      } else {
        str = `
          <h2>${selectedAchievement.name}</h2>
          <hr/>
          <p>${selectedAchievement.desc}</p>
        `

        if (selectedAchievement.reward) {
          str += `<hr/><p style='color: lime'>Bonus: ${selectedAchievement.reward.txt}</p>`
        }
      }

      tooltip.innerHTML = str
    }

    tooltip.style.animation = 'tooltip .3s'
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
        <h1 style='font-family: "Germania One"; font-size: 4em; text-align: center;'>Settings</h1>
        <i class='fa fa-times fa-1x' onclick='Game.removeEl(document.querySelector(".wrapper"))'></i>
        <hr/>
        <h2 style='text-align: left;'>Sound</h2>
        <hr/>
        <div class="single-setting">
          <p style='padding-right: 10px;'>Volume: </p>
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
          <p style='padding-right: 20px;'>BGM: </p>
          <input type="radio" name='bgm' id='bgmOn' value='true' onchange='Game.state.prefs.bgm = 1; Game.toggleBgm();'/>
            <label for="bgmOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='bgm' id='bgmOff' value='false' onchange='Game.state.prefs.bgm = 0; Game.toggleBgm();'/>
            <label for="bgmOff" style='margin-right: 10px'>Off</label>
        </div>
        <br/>
        <hr/>
        <h2 style='text-align: left;'>Video</h2>
        <hr/>
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
        <br/>
        <hr/>
        <h2 style='text-align: left;'>Miscellaneous</h2>
        <hr/>
        <div class="single-setting">
          <p style='padding-right: 20px;'>Enable Scrolling Text:</p>
          <input type="radio" name='scrollingText' id='scrollingTextOn' value='true' onchange='Game.state.prefs.scrollingText = true'/>
            <label for="scrollingTextOn" style='margin-right: 10px'>On</label>
          <input type="radio" name='scrollingText' id='scrollingTextOff' value='false' onchange='Game.state.prefs.scrollingText = false' />
            <label for="scrollingTextOff">Off</label>
        </div>
        <br/>
        <p>Saves (work-in-progress)</p>
        <button class='saves-btn' onclick='Game.export()'>Export Save</button> <button onclick='Game.import()' class='saves-btn'>Import Save</button>
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

  Game.showStatistics = () => {
    let div = document.createElement('div')
    let str;
    let achievementsWon = 0
    let achievementsMissing = 0
    div.classList.add('wrapper')

    str += `
      <div class="statistics-container">
        <h1 style='font-family: "Germania One"; font-size: 4em;'>Statistics</h1>
        <i class='fa fa-times fa-1x' onclick='Game.removeEl(document.querySelector(".wrapper"))'></i>
        <hr/>
        <p><span style='opacity: .6'>Ores Earned:</span> <strong>${beautify(Math.round(Game.state.stats.currentOresEarned))}</strong></p>
        <p><span style='opacity: .6'>Ores Mined (By Clicks):</span> <strong>${beautify(Math.round(Game.state.stats.currentOresMined))}</strong></p>
        <p><span style='opacity: .6'>Current Ore Clicks:</span> <strong>${Game.state.stats.currentOreClicks}</strong></p>
        <p><span style='opacity: .6'>Current Weak Spot Hits:</span> <strong>${Game.state.stats.currentWeakSpotHits}</strong></p>
        <p><span style='opacity: .6'>Crit Hits:</span> <strong>${Game.state.stats.critHits}</strong></p>
        <p><span style='opacity: .6'>Mega Hits: (Crit & Weak Spot Hit):</span> <strong>${Game.state.stats.megaHits}</strong></p>
        <p><span style='opacity: .6'>Highest Weak Spot Combo:</span> <strong>${Game.state.stats.highestCombo}</strong></p>
        <p><span style='opacity: .6'>Ores Spent:</span> <strong>${beautify(Math.round(Game.state.stats.totalOresSpent))}</strong></p>
        <p><span style='opacity: .6'>Rocks Destroyed:</span> <strong>${Game.state.stats.rocksDestroyed}</strong></p>
        <p><span style='opacity: .6'>Items Picked Up:</span> <strong>${Game.state.stats.itemsPickedUp}</strong></p>
        <p><span style='opacity: .6'>Refine Amount:</span> <strong>${Game.state.stats.timesRefined}</strong></p>
        <p><span style='opacity: .6'>Time Played:</span> <strong>${beautifyTime(Game.state.stats.timePlayed)}</strong></p>
      </div>
    `

    div.innerHTML = str

    s('body').append(div)
  }

  Game.showAchievements = () => {
    let div = document.createElement('div')
    div.classList.add('wrapper')

    let str = `
      <div class="achievements-container">
        <h1>Achievements</h1>
        <i class='fa fa-times fa-1x' onclick='Game.removeEl(document.querySelector(".wrapper"))'></i>
        <p>Achievements Won:</p>
        <div class="won-achievements">
        `
        for (let i = 0; i < Game.achievements.length; i++) {
          if (Game.achievements[i].won == 1) {
            str += `<div onmouseover='Game.showTooltip({type: "achievement", achievementName: "${Game.achievements[i].name}"})' onmouseout='Game.hideTooltip()' class="single-achievement"></div>`
          }
        }

        str += `
        </div>
        <br/>
        <p>Achievements Missing:</p>
        <div class="missing-achievements">
        `
        for (let i = 0; i < Game.achievements.length; i++) {
          if (Game.achievements[i].won == 0) {
            str += `<div onmouseover='Game.showTooltip({type: "achievement", missing: 1, achievementName: "${Game.achievements[i].name}"})' onmouseout='Game.hideTooltip()' style='opacity: 0.3' class="single-achievement"></div>`
          }
        }

        str += `</div>
      </div>

    `

    div.innerHTML = str
    s('body').append(div)
  }

  Game.toggleInventory = () => {
    let anchor = s('#left-separator').getBoundingClientRect()
    Game.state.prefs.inventoryOpen = !Game.state.prefs.inventoryOpen
    if (Game.state.prefs.inventoryOpen) {
      // inventory open
      s('.inventory-container').style.left = anchor.right + 'px'
      s('.inventory-container__right').classList.add('inventory-container--open')
    } else {
      s('.inventory-container').style.left = anchor.right - s('.inventory-container').getBoundingClientRect().width + s('.inventory-container__right').getBoundingClientRect().width + 'px'
      s('.inventory-container__right').classList.remove('inventory-container--open')
    }
  }

  Game.randomBonus = (special) => {
    if (Math.random() <= .3) { // 30% chance of this happening
      console.log('bonus!')
      let randomID = Math.floor(Math.random() * 1000000) + 1
      let chance = Math.random()
      let bonus = document.createElement('div')
      bonus.id = `bonus-${randomID}`
      bonus.classList.add('bonus')
      // 60% chance of happening
      if (chance >= 0 && chance <= .6) {
        bonus.onclick = () => {Game.selectedBonus(1); bonus.parentNode.removeChild(bonus)}
      // 25% chance of happening
      } else if (chance > .6 && chance <= .85) {
        bonus.onclick = () => {Game.selectedBonus(2); bonus.parentNode.removeChild(bonus)}
      // 10% chance of happening
      } else if (chance > .85 && chance <= .95) {
        bonus.onclick = () => {Game.selectedBonus(3); bonus.parentNode.removeChild(bonus)}
      // 5% chance
      } else {
        bonus.onclick = () => {Game.selectedBonus(4); bonus.parentNode.removeChild(bonus)}
      }

      let randomX = Math.random() * window.innerWidth
      let randomY = Math.random() * window.innerHeight

      bonus.style.left = randomX + 'px'
      bonus.style.top = randomY + 'px'

      s('body').append(bonus)

      setTimeout(() => {
        let b = s(`#bonus-${randomID}`)
        if (b) {
          bonus.classList.add('fadeOut')
          setTimeout(() => {
            if (b) {
              b.parentNode.removeChild(b)
            }
          }, 2000)
        }
      }, 8 * 1000)
    }
  }

  Game.selectedBonus = (bonusNum) => {
    Game.playSound('ding')
    if (bonusNum == 1) {
      let amount = (Game.state.oresPerSecond * 13 + Game.state.oresPerClick * 13)
      Game.earn(amount)
      Game.risingNumber(amount, 'bonus', event)
    }

    if (bonusNum == 2 || bonusNum == 3 || bonusNum == 4) {
      let cover = document.createElement('div')
      cover.classList.add('gold-rush-cover')
      s('body').append(cover)
      let amount = (Game.state.oresPerSecond * 11 + Game.state.oresPerClick * 11)
      Game.risingNumber(amount, 'gold rush', event)
      Game.goldRush()
      setTimeout(() => {
        s('.gold-rush-cover').parentNode.removeChild(s('.gold-rush-cover'))
      }, 15 * 1000)
    }

    // if (bonusNum == 3) {
    //   let cover = document.createElement('div')
    //   conver.classList.add('fury-cover')
    //   s('body').append(cover)
    //   setTimeout(() => {
    //     s('.fury-cover').parentNode.removeChild(s('.fury-cover'))
    //   }, 7 * 1000)
    // }
  }

  let goldRushCounter = 0
  Game.goldRush = () => {

    setTimeout(() => {
      if (goldRushCounter < 20) {
        goldRushCounter++
        let bonus = document.createElement('div')
        let randomID = Math.floor(Math.random() * 100000000) + 1
        bonus.id = `bonus-${randomID}`
        bonus.classList.add('gold-rush-bonus')
        let randomX = Math.random() * window.innerWidth
        bonus.style.left = randomX + 'px'
        s('body').append(bonus)
        bonus.onclick = () => {Game.selectedBonus(1); Game.removeEl(bonus)}

        setTimeout(() => {
          if (s(`#bonus-${randomID}`)) {
            Game.removeEl(s(`#bonus-${randomID}`))
          }
        }, 5000) // TIME IT TAKES FOR ANIMATION TO FALL OFF SCREEN
        Game.goldRush()
      } else {
        goldRushCounter = 0
      }
    }, 500)
  }

  Game.removeEl = (el) => {
    try {
      el.parentNode.removeChild(el)
    } catch (err) {
      //
    }
  }

  Game.confirmRefine = () => {

    if (s('#refine-tut')) Game.removeEl(s('#refine-tut'))

    let div = document.createElement('div')

    let amountOfGems = 0
    if (Game.state.ores >= 1000000) amountOfGems += 1
    if (Game.state.ores >= 1000000000) amountOfGems += 1
    if (Game.state.ores >= 1000000000000) amountOfGems += 1
    if (Game.state.ores >= 1000000000000000) amountOfGems += 1
    if (Game.state.ores >= 1000000000000000000) amountOfGems += 1

    div.classList.add('wrapper')
    div.id = 'confirm-refine'
    let str = `
      <div class="confirm-refine">
        <h2 style='text-align: center; font-family: "Germania One"; letter-spacing: 1px'>Refine</h2>
        <i class='fa fa-times fa-1x' onclick='Game.removeEl(document.querySelector("#confirm-refine"))'></i>
        <hr/>
        <p style='text-align: left; color: lightgreen;'>+ You will gain <strong>${amountOfGems}</strong> gems (more ores = more gems)</p>
        <p style='text-align: left; color: lightgreen;'>+ You will gain <strong>${Game.calculateGenerationXp().xp}</strong> generation xp</p>
        <p style='text-align: left; color: #c36d6d;'>- You will lose all current ores</p>
        <p style='text-align: left; color: #c36d6d;'>- You will lose all owned buildings and upgrades</p>
        <p style='text-align: left; color: #c36d6d;'>- You will lose your current pickaxe</p>
        <hr/>
        <p style='text-align: center;'>Are you sure you want to refine?</p>
        <hr />
        <button onclick='Game.refine(${amountOfGems})'>yes</button>
        <button onclick='Game.removeEl(document.querySelector("#confirm-refine"))'>no</button>
      </div>
    `
    div.innerHTML = str

    s('body').append(div)
  }

  Game.refine = (amount) => {
    Game.playSound('smithsfx')
    Game.state.stats.timesRefined++
    let div = document.createElement('div')
    div.classList.add('refine')
    s('body').append(div)

    Game.state.gems += amount

    setTimeout(() => {
      Game.gainGenerationXp()
      Game.softReset()
      Game.rebuildInventory = 1
      Game.removeEl(s('.wrapper'))
      Game.unlockSkills()
    }, 1500)
    setTimeout(() => {
      Game.showSkillTree()
      let items = document.querySelectorAll('.item-container')
      if (items) {
        items.forEach((item) => {
          item.parentNode.removeChild(item)
        })
      }
    }, 2000)
    setTimeout(() => {
      Game.removeEl(s('.refine'))
      if (Game.state.stats.timesRefined > 0) Game.winAchievement('Blacksmiths Apprentice')
      Game.repositionAllElements = 1
    }, 3000)

    s('.ore-weak-spot').style.display = 'none'
  }

  Game.unlockSkills = () => {
    let lockedSkills = Game.skills.filter((skill) => skill.locked == 1)

    for (let i in lockedSkills) {
      let selectedSkill = (Game.select(Game.skills, lockedSkills[i].name))
      let selectedEl = document.querySelector(`.skill-${lockedSkills[i].className}`)
      if (lockedSkills[i].requires) {
        for (let j in lockedSkills[i].requires) {
          let req = {
            skill: Game.select(Game.skills, lockedSkills[i].requires[j][0]),
            lvl: lockedSkills[i].requires[j][1]
          }

          if (Game.state.player.generation.lv >= lockedSkills[i].generationReq) {
            if (req.skill) {
              if (req.skill.lvl >= req.lvl) {
                lockedSkills[i].locked = 0
                selectedEl.style.opacity = 1
                Game.drawLines()
              }
            }
          }
        }
      } else {
        if (Game.state.player.generation.lv >= lockedSkills[i].generationReq) {
          lockedSkills[i].locked = 0
          if (selectedEl != null) {
            selectedEl.style.opacity = 1
            Game.drawLines()
          }
        }
      }
    }
  }

  Game.buildSkillTree = () => {
    let str = ''

    for (let i = 0; i < Game.skills.length; i++) {

      let skillPadding = 64
      let skillSize = 64
      let middle = (window.innerWidth || document.body.clientWidth)/2 - skillSize/2 - 5

      let pos = {
        generation: Game.skills[i].position[0] * (skillSize + skillPadding + 32) - 100, // top
        column: middle + (Game.skills[i].position[1] * (skillSize + skillPadding))     // left
      }

      if (Game.skills[i].locked == 1) {
        str += `
          <div 
            onclick='Game.skills[${i}].levelUp()'
            onmouseover='Game.showTooltip({type: "skill", name: "${Game.skills[i].name}"})' 
            onmouseout='Game.hideTooltip()' 
            class='skill skill-${Game.skills[i].className}' 
            style='left: ${pos.column}px; top: ${pos.generation}px; background: url("./assets/images/skill_${Game.skills[i].img}"); opacity: .5'
          ></div>
        `
      } else {
        str += `
          <div 
            onclick='Game.skills[${i}].levelUp()'
            onmouseover='Game.showTooltip({type: "skill", name: "${Game.skills[i].name}"})' 
            onmouseout='Game.hideTooltip()' 
            class='skill skill-${Game.skills[i].className}' 
            style='left: ${pos.column}px; top: ${pos.generation}px; background: url("./assets/images/skill_${Game.skills[i].img}")'
          ></div>
        `
      }
    }
    
    return str
  }

  Game.showSkillTree = () => {
    let div = s('.skill-tree-container')
    div.style.display = 'flex' // change display none to display flex

    let str = `
      <canvas class="skill-lines"></canvas>
      <div class="skill-tree-container-top">
        <h1 style='font-size: 6rem; font-family: "Germania One"'>Generation: ${Game.state.player.generation.lv}</h1>
        <h4 class='available-sp'>Available Sp: ${Game.state.player.generation.availableSp}</h4>
        <button onclick='document.querySelector(".skill-tree-container").style.display="none"; window.pJSDom = []; Game.tutorialQuest(); Game.drawQuestBtn()'>Go back</button>
      </div>

      <div class="skill-tree-container-bottom">
    `
        
    str += Game.buildSkillTree()

    str += `</div>`

    div.innerHTML = str
    Game.drawLines()
  }

  Game.drawLines = () => {
    let canvas = s('.skill-lines')
    let canvasWidth = window.innerWidth
    let canvasHeight = window.innerHeight
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    let ctx = canvas.getContext('2d')
    ctx.lineWidth = 3

    // reset canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    for (let i in Game.skills) {
      let skill = Game.skills[i]

      if (skill.drawLines) {

        if (skill.locked) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        } else {
          ctx.strokeStyle = 'white'
        }

        if (skill.lvl == 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        }

        for (let j in skill.drawLines) {

          if (skill.drawLines[j].from == 'top') {
            let fromPos = {
              x: s(`.skill-${skill.className}`).getBoundingClientRect().x + 32,
              y: s(`.skill-${skill.className}`).getBoundingClientRect().y
            }

            let toSkill = Game.select(Game.skills, `${skill.drawLines[j].to}`)
            let toPos = {
              x: s(`.skill-${toSkill.className}`).getBoundingClientRect().x - 32,
              y: s(`.skill-${toSkill.className}`).getBoundingClientRect().y + 32
            }

            ctx.beginPath()
            ctx.moveTo(fromPos.x, fromPos.y)
            ctx.lineTo(toPos.x, toPos.y)
            ctx.lineTo(toPos.x + 32, toPos.y)
            ctx.stroke()
            ctx.closePath()
          }

          if (skill.drawLines[j].from == 'bottom') {
            let fromPos = {
              x: s(`.skill-${skill.className}`).getBoundingClientRect().x + 32,
              y: s(`.skill-${skill.className}`).getBoundingClientRect().bottom
            }
            let toSkill = Game.select(Game.skills, `${skill.drawLines[j].to}`)
            let toPos = {
              x: s(`.skill-${toSkill.className}`).getBoundingClientRect().x + 32,
              y: s(`.skill-${toSkill.className}`).getBoundingClientRect().y
            }
            ctx.beginPath()
            ctx.moveTo(fromPos.x, fromPos.y)
            // ctx.lineTo(toPos.x, toPos.y)
            // ctx.lineTo(toPos.x + 32, toPos.y)

            ctx.lineTo(fromPos.x, fromPos.y + 32)
            ctx.lineTo(toPos.x, fromPos.y + 96)
            ctx.lineTo(toPos.x, toPos.y)

            ctx.stroke()
            ctx.closePath()
          }

          if (skill.drawLines[j].from == 'right') {
            let fromPos = {
              x: s(`.skill-${skill.className}`).getBoundingClientRect().right,
              y: s(`.skill-${skill.className}`).getBoundingClientRect().y + 32
            }
            let toSkill = Game.select(Game.skills, `${skill.drawLines[j].to}`)
            let toPos = {
              x: s(`.skill-${toSkill.className}`).getBoundingClientRect().left,
              y: s(`.skill-${toSkill.className}`).getBoundingClientRect().y + 32
            }

            ctx.beginPath()
            ctx.moveTo(fromPos.x, fromPos.y)
            ctx.lineTo(fromPos.x + 32, fromPos.y)
            ctx.lineTo(fromPos.x + 64, toPos.y)
            ctx.lineTo(toPos.x - 32, toPos.y)
            ctx.lineTo(toPos.x, toPos.y)
            ctx.stroke()
            ctx.closePath()
          }
        }
      }
    }

    s('.skill-tree-container-bottom').onscroll = () => Game.drawLines()
  }

  Game.softReset = () => {
    Game.state.ores = 0
    Game.state.oreHp = 50
    Game.state.oreCurrentHp = 50
    Game.state.oresPerSecond = 0
    Game.state.opsMultiplier = 0
    Game.state.opcMulti = 0
    Game.state.weakHitMultiplier = 5
    Game.state.player.pickaxe = {
      name: 'Beginners Wood Pickaxe',
      rarity: 'Common',
      iLv: 1,
      material: 'Wood',
      damage: 1,
    }

    Game.state.stats.rocksDestroyed = 0
    Game.state.stats.currentOreClicks = 0
    Game.state.stats.currentOresEarned = 0
    Game.state.stats.currentOresMined = 0
    Game.state.stats.currentWeakSpotHits = 0

    Game.rebuildStore = 1
    Game.recalculateOpC = 1
    Game.recalculateOpS = 1

    Game.resetItems()
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
            <i class='fa fa-times fa-1x' onclick='Game.removeEl(document.querySelector(".wrapper"))'></i>
            <h1 style='flex-grow: 1; text-align: center; font-family: "Germania One"'>Refined Store</h1>
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
      for (let i=0; i<Game.state.currentRefinedStoreItems.length; i++) {
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
    for (let i=0; i<Game.uniqueTrinkets.length; i++) {
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
          <button onclick='let wrappers = document.querySelectorAll(".wrapper"); wrappers[1].parentNode.removeChild(wrappers[1])'>No</button>
        </div>
      `

      s('body').append(div)
    }
  }

  Game.buyRefinedItem = (itemName) => {
    let selectedItem = ''
    for (let i=0; i<Game.uniqueTrinkets.length; i++) {
      if (Game.uniqueTrinkets[i].name == itemName) {
        selectedItem = Game.uniqueTrinkets[i]
      }
    }

    if (selectedItem) { // IF THERE IS A SELECTED ITEM
      if (Game.state.gems >= selectedItem.price) { // IF YOU HAVE ENOUGH MONEY
        Game.state.gems -= selectedItem.price
        risingNumber(0, 'spendGems', event)
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
          for (let i in Game.items) {
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
      Game.removeEl(s('.wrapper'))
      Game.generateRefinedStoreItems()
      Game.showRefinedStore()
    }
  }

  Game.closeCurrentWindow = () => {
    if (s('.wrapper')) {
      let wrappers = document.querySelectorAll('.wrapper')
      let newest = wrappers.length -1

      if (wrappers.length > 1) {
        Game.removeEl(wrappers[newest])
      } else {
        wrappers.forEach((wrapper) => Game.removeEl(wrapper))
      }
    }

    Game.hideTooltip()

    if (s('.specialization-wrapper')) Game.removeEl(s('.specialization-wrapper'))
    if (s('.specialization-skills-wrapper')) Game.removeEl(s('.specialization-skills-wrapper'))
    if (s('.specialization-confirmation-wrapper')) Game.removeEl(s('.specialization-confirmation-wrapper'))
  }

  Game.drawQuestBtn = () => {
    if (Game.state.stats.timesRefined > 0) {

      let div = s('.open-quests-container')

      div.innerHTML = `
        <div style='height: 30px;' class="open-quests-container-top">
          <div class="wood-stick"></div>
          <div class="wood-stick"></div>
        </div>
        <div class="open-quests-container-bottom" onclick='Game.showQuests()'>
          <h2 style='font-family: "Germania One"; letter-spacing: 2px;'>Quests</h2>
        </div>
      `

      let verticalAnchor = s('.inventory-section').getBoundingClientRect()
      let horizontalAnchor = s('#main-separator').getBoundingClientRect()

      div.style.top = verticalAnchor.bottom + 'px'
      div.style.left = horizontalAnchor.left - div.getBoundingClientRect().width - 30 + 'px'
    }
  }

  Game.showQuests = () => {
    if (Game.state.player.generation.lv >= 1) {

      if (s('#quest-tut')) Game.removeEl(s('#quest-tut'))


      let div = document.createElement('div')
      div.classList.add('wrapper')

      let str = `
        <div class="quests-container">
          <h1 style='font-size: 4rem; padding: 10px 0;'>Quest Board</h1>
          <p onclick='Game.closeCurrentWindow()' style='position: absolute; top: 5px; right: 5px; cursor: pointer'>X</p>
          <div class="available-quests-container">
          `
            for (let i=0; i<Game.quests.length; i++) {
              if (Game.quests[i].locked == 0) {
                str += `
                  <div class="available-quest unlocked" onclick="Game.showQuestInformation('${Game.quests[i].functionName}')">
                    <i style='padding-top: 5px; color: black; font-size: xx-small;' class='fa fa-circle fa-1x'></i>
                    <p class='quest-name'>${Game.quests[i].name}</p>
                    <p class='quest-time'><i class='fa fa-clock-o fa-1x'></i> ${Game.quests[i].completionTimeTxt}</p>
                  </div>
                `
              } else if (Game.quests[i].locked == 1) {
                str += `
                  <div style='opacity: .3' class="available-quest">
                    <p><i class='fa fa-lock fa-2x'></i></p>
                  </div>
                `
              } else {
                str += `
                  <div style='opacity: .2' class="available-quest hidden-quest">
                    <p><i class='fa fa-lock fa-2x'></i></p>
                  </div>
                `
              }
            }
          str += `
          <p style='opacity: .5'>More coming soon...</p>
          </div>
        </div>
      `

      div.innerHTML = str
      s('body').append(div)
    }
  }

  Game.showQuestInformation = (questName) => {
    let selectedQuest = {}
    for (let i=0; i<Game.quests.length; i++) {
      if (Game.quests[i].functionName == questName) {
        selectedQuest = Game.quests[i]
      }
    }

    let div = document.createElement('div')
    div.classList.add('wrapper')
    div.innerHTML = `
      <div class="quest-information">
        <h1>${selectedQuest.name}</h1>
        <p onclick='Game.closeCurrentWindow()' style='position: absolute; top: 5px; right: 5px; cursor: pointer'>X</p>
        <hr/>
        <img src="./assets/images/quest_${selectedQuest.pic}.png" class="quest-img"'>
        <hr/>
        <br/>
        <h3>${selectedQuest.desc}</h3>
        <p>Completion Time: ~${selectedQuest.completionTimeTxt}</p>
        <br/>
        <hr/>
        <div class="quest-information-bottom">
          <div style='width: 100%' class="quest-information-bottom-right">
            <button onclick='Game.startQuest("${selectedQuest.name}")'>Adventure <i class='fa fa-long-arrow-right fa-1x'></i></button>
          </div>
        </div>
      </div>
    `

    s('body').append(div)
  }

  Game.startQuest = (questName) => {
    let quest = Game.select(Game.quests, questName)

    document.querySelectorAll('.wrapper').forEach((wrapper) => Game.removeEl(wrapper))

    if (!Game.state.quest.active) {
      Game.state.quest.active = true
      Game.state.quest.currentQuest = quest.name
      Game.state.quest.questCompletionTime = quest.completionTime
      Game.state.quest.currentQuestProgress = 0
      Game.redrawQuestInfo = 1
    }
  }

  Game.canBoost = true
  Game.boostQuest = () => {
    if (Game.state.quest.currentQuestProgress != Game.state.quest.questCompletionTime) {
      if (Game.canBoost) {
        if (Game.state.quest.currentQuestProgress + 5000 < Game.state.quest.questCompletionTime) {
          Game.canBoost = false
          Game.risingNumber(null, 'quest-progress', event)
          Game.state.quest.currentQuestProgress += 5000

          let progress = 0
          let max = 5 * 1000
          s('.click-cooldown').style.height = progress

          let height = setInterval(() => {
            if (progress < max) {
              progress += 30
              s('.click-cooldown').style.height = (progress / max) * 100 + '%'
            }
          }, 30)

          setTimeout(() => {
            Game.canBoost = true
            clearInterval(height)
            s('.click-cooldown').style.height = "100%"
          }, 5000)
        } else {
          Game.risingNumber(null, 'quest-progress')
          s('.click-cooldown').style.height = "100%"
          Game.canBoost = true
          Game.state.quest.currentQuestProgress = Game.state.quest.questCompletionTime
        }
      }
    } else {
      Game.questCompleteModal()
    }
  }

  Game.drawQuestInfo = () => {
    let div = s('.bottom')
    if (Game.state.quest.active) {
      div.innerHTML = `
        <div onclick='Game.boostQuest()' class="bottom-quest-wrapper" style='cursor: pointer; width: 100%; height: 100%;'>
          <div class="click-cooldown-container">
            <div class="click-cooldown"></div>
          </div>
          <div class="bottom-active-quest-info">
            <h3>${Game.state.quest.currentQuest}</h3>
          </div>
          <div class="progress-container">
            <i class="fa fa-male fa-3x player-model moving" style='color: white;'></i>
          </div>
        </div>
      `
    } else {
      div.innerHTML = ``
    }

    Game.redrawQuestInfo = 0
  }

  Game.calculateRemainingQuest = () => {
    let playerModel = s('.player-model')
    let leftPos = (Game.state.quest.currentQuestProgress / Game.state.quest.questCompletionTime) * 100

    if (Game.state.quest.currentQuestProgress + 30 < Game.state.quest.questCompletionTime) {
      Game.state.quest.currentQuestProgress += 30
      playerModel.style.left = leftPos + "%"
    } else {
      Game.state.quest.currentQuestProgress = Game.state.quest.questCompletionTime
      playerModel.style.left = '100%'
      playerModel.classList.remove('moving')
      playerModel.classList.add('jumping')
    }
  }

  Game.questCompleteModal = () => {
    let div = document.createElement('div')
    div.classList.add('wrapper')
    div.id = 'quest-complete-modal'
    let completedQuest = Game.select(Game.quests, Game.state.quest.currentQuest)
    Game.playSound('quest-complete')

    let str = `
      <div class="quest-complete-modal">
        <p>Quest Complete</p>
        <hr />
        <h1 style='font-family: "Germania One"'>${Game.state.quest.currentQuest}</h1>
        <hr style='margin-bottom: 10px'/>
        <p class='quest-reward fadeUpIn' style='color: #f3e56c' >Generation XP: +${completedQuest.xpGain}</p>
        `
        if (completedQuest.timesCompleted == 0) {
            str += `<p class='quest-reward fadeUpIn' style='color: #00c0ff; animation-duration: .6s'>FIRST CLEAR BONUS: 1 <i class='fa fa-diamond fa-1x'></i></p>`
        }
        str += `
        <hr />
        <br />

        <button onclick='Game.gainQuestRewards()'>COLLECT REWARDS</button>
      </div>
    `

    div.innerHTML = str

    s('body').append(div)
  }

  Game.gainQuestRewards = () => {
    Game.removeEl(s('#quest-complete-modal'))
    let completedQuest = Game.select(Game.quests, Game.state.quest.currentQuest)
    completedQuest.timesCompleted++
    if (completedQuest.timesCompleted == 1) {
      Game.state.gems += completedQuest.firstClearGemGain
    }
    Game.state.player.generation.currentXp += completedQuest.xpGain

    Game.state.quest.active = false,
    Game.state.quest.currentQuest = null,
    Game.state.quest.currentQuestProgress = null,
    Game.state.quest.questCompletionTime = null,

    Game.drawQuestInfo()

    Game.rebuildInventory = 1
  }

  Game.winAchievement = (achievementName) => {
    let selectedAchievement;
    for (let i in Game.achievements) {
      if (Game.achievements[i].name == achievementName) {
        selectedAchievement = Game.achievements[i]
        break
      }
    }

    if (selectedAchievement.won == 0) {
      selectedAchievement.won = 1

      if (selectedAchievement.reward) {
        if (selectedAchievement.reward.increaseWeakHitMulti) {
          Game.state.permanentWeakHitMulti += selectedAchievement.reward.increaseWeakHitMulti
        }
        if (selectedAchievement.reward.building) {
          Game.select(Game.buildings, selectedAchievement.reward.building[0]).production *= selectedAchievement.reward.building[1]
          Game.recalculateOpC = 1
          Game.recalculateOpS = 1
          Game.rebuildInventory = 1
          Game.rebuildStore = 1
        }
      }

      let div = document.createElement('div')
      div.classList.add('achievement')

      let str = `
        <h3>Achievement Unlocked</h3>
        <h1>${selectedAchievement.name}</h1>
        <p>${selectedAchievement.desc}</p>
      `
      if (selectedAchievement.reward) {
        str += `
          <hr />
          <p style='color: lime'>REWARD: ${selectedAchievement.reward.txt}</p>
        `
      }

      div.innerHTML = str
      s('body').append(div)

      setTimeout(() => {
        Game.removeEl(div)
      }, 4000)
    }
  }

  Game.select = (arr, what) => {
    for (let i in arr) {
      if (arr[i].name == what)
        return arr[i]
    }
  }

  let counter = 0
  Game.logic = () => {

    if (!Game.blurred) {
      // HANDLE ORES N SHIT
      if (Game.recalculateOpC) Game.calculateOpC()
      if (Game.recalculateOpS) Game.calculateOpS()
      let ops = Game.state.oresPerSecond/Game.state.prefs.fps
      Game.earn(ops)

      // BUILD STORE & INVENTORY
      if (s('.skill-tree-container').style.display == 'none' || s('.skill-tree-container').style.display == '') {
        if (Game.rebuildStore) Game.buildStore()
        if (Game.rebuildInventory) Game.buildInventory()

        // REPOSITION SHIT
        if (Game.repositionAllElements) Game.positionAllElements()
        if (Game.repositionOreWeakSpot) Game.oreWeakSpot()
        if (Game.redrawQuestInfo) Game.drawQuestInfo()

        // run every 10s
        counter++
        if (counter % (30 * 30) == 0) {
          Game.randomBonus()
        }
      }

      if (Game.state.quest.active) Game.calculateRemainingQuest()
    }

    setTimeout(Game.logic, 1000/Game.state.prefs.fps)
  }

  setInterval(() => {
    if (!Game.blurred) {
      if (Game.state.oresPerSecond) Game.risingNumber(Game.state.oresPerSecond, 'buildings', event)
    }
  }, 1000)

  setInterval(() => {Game.save()}, 1000 * 60) // save every minute

  Game.resetItems = () => {
    console.log('resetItems', items)
    Game.buildings = []
    Game.upgrades = []
    items.forEach((item) => {
      new Item(item)
    })
    for (let i in Game.achievements) {
      if (Game.achievements[i].won) {
        if (Game.achievements[i].reward) {
          if (Game.achievements[i].reward.building) {
            Game.select(Game.buildings, Game.achievements[i].reward.building[0]).production *= Game.achievements[i].reward.building[1]
          }
        }
      }
    }
  }

  Game.textScroller = [
    'What is a rocks favorite fruit? ... Pom-a-granite',
    'Did you see that cleavage? Now that\'s some gneiss schist.',
    'All rock and no clay makes you a dull boy (or girl)',
    'Don\'t take life for granite',
    'What happens when you throw a blue rock in the red sea? ... It gets wet',
    "I'd do more work, but I'll mine my own business - /u/Maxposure",
    "As you can tell, these are pretty lame... Submit your own to /u/name_is_Syn"
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
        let random = Math.floor(Math.random() * Game.textScroller.length)

        s('.text-scroller').innerHTML = Game.textScroller[random]
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
  s('.ore-weak-spot').onclick = () => Game.handleClick('weak-spot')

  window.onresize = () => {
    Game.repositionAllElements = 1
    let skillTree = document.querySelector('.skill-tree-container')
    if (skillTree.style.display === 'none' || skillTree.style.display === undefined || skillTree.style.display === '') {
    } else {
      Game.showSkillTree()
    }
  }

  window.onblur = () => {
    Game.state.lastLogin = new Date().getTime()
    Game.blurred = true;
  }

  window.onfocus = () => {
    Game.earnOfflineGain()
    Game.blurred = false;
  }

  let pressed = []
  let secretCode = 'test'
  window.addEventListener('keyup', (e) => {
    pressed.push(e.key)
    pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length)
    if (pressed.join('').includes('test')) {
      Game.state.player.pickaxe.damage *= 10000000
      Game.recalculateOpC = 1
    }
  })

}



window.onload = () => {
  Game.launch()
}