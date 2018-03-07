'use strict';

/* =================
  HELPER FUNCTIONS
================= */
var s = function s(el) {
  return document.querySelector(el);
};

var beautify = function beautify(num) {

  if (num < 1) {
    return num.toFixed(1);
  }
  if (num < 1000000) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //found on https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  } else {
    if (num >= 1000000000000000000000000000000000) {
      return (num / 1000000000000000000000000000000000).toFixed(0) + ' F*cktonillion';
    }
    if (num >= 1000000000000000000000000000000) {
      return (num / 1000000000000000000000000000000).toFixed(1) + ' F*ckloadillion';
    }
    if (num >= 1000000000000000000000000000) {
      return (num / 1000000000000000000000000000).toFixed(1) + ' Waytoomanyillion';
    }
    if (num >= 1000000000000000000000000) {
      return (num / 1000000000000000000000000).toFixed(1) + ' Alotillion';
    }
    if (num >= 1000000000000000000000) {
      return (num / 1000000000000000000000).toFixed(1) + ' Sextillion';
    }
    if (num >= 1000000000000000000) {
      return (num / 1000000000000000000).toFixed(1) + ' Quintillion';
    }
    if (num >= 1000000000000000) {
      return (num / 1000000000000000).toFixed(1) + ' Quadrillion';
    }
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(1) + ' Trillion';
    }
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + ' Billion';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' Million';
    }
  }
};

var beautifyTime = function beautifyTime(num) {

  var hours = Math.floor(num / 3600);
  num %= 3600;
  var minutes = Math.floor(num / 60);
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  var seconds = num % 60;
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return hours + ":" + minutes + ":" + seconds;
};

//https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
var beautifyMs = function beautifyMs(ms) {
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
    return days + " days";
  }
};

//https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript-or-jquery
document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key == "Escape" || evt.key == "Esc";
  } else {
    isEscape = evt.keyCode == 27;
  }
  if (isEscape) {
    Game.closeCurrentWindow();
  }
};

//https://stackoverflow.com/questions/1484506/random-color-generator
var getRandomColor = function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/* ========================
  NOW FOR THE ACTUAL GAME
======================== */

var Game = {};

Game.launch = function () {

  Game.state = {
    gems: 0,
    ores: 0,
    oreHp: 50,
    oreCurrentHp: 50,
    oresPerSecond: 0,
    oresPerClick: 0,
    opsMulti: 0,
    opcMulti: 0,
    permanentOpsMulti: 0,
    permanentOpcMulti: 0,
    critHitMulti: 2,
    weakHitMulti: 5,
    permanentWeakHitMulti: 0,
    lastLogin: null,
    canRefine: false,

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
      }
    },

    quest: {
      active: false,
      currentQuest: null,
      currentQuestProgress: null,
      questCompletionTime: null
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
      buildingsOwned: 0
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
  };

  Game.positionAllElements = function () {
    // POSITION TORCHES
    var torch1 = s('.torch1');
    var torch2 = s('.torch2');

    var torch1Anchor = s('#left-separator').getBoundingClientRect();
    torch1.style.left = torch1Anchor.right + 'px';
    torch1.style.top = '25%';

    var torch2Anchor = s('#main-separator').getBoundingClientRect();
    torch2.style.left = torch2Anchor.left - torch2.getBoundingClientRect().width + 'px';
    torch2.style.top = '25%';

    // POSITION SETTINGS CONTAINER
    var settingsContainer = s('.settings-container');

    var anchorHorizontal = s('#horizontal-separator').getBoundingClientRect();
    var anchorVertical = s('#main-separator').getBoundingClientRect();

    settingsContainer.style.position = 'absolute';
    settingsContainer.style.top = anchorHorizontal.top - settingsContainer.getBoundingClientRect().height + 'px';
    settingsContainer.style.left = anchorVertical.left - settingsContainer.getBoundingClientRect().width + 'px';

    // POSITION REFINE BTNS
    if (Game.state.stats.totalOresEarned > 1000000 || Game.state.stats.timesRefined > 0) {
      s('.refine-btn').style.display = 'block';
    } else {
      s('.refine-btn').style.display = 'none';
    }

    // POSITION QUEST BTN
    if (Game.state.stats.timesRefined > 0) {
      var verticalAnchor = s('.inventory-section').getBoundingClientRect();
      var horizontalAnchor = s('#main-separator').getBoundingClientRect();

      var btn = s('.open-quests-container');

      btn.style.top = verticalAnchor.bottom + 'px';
      btn.style.left = horizontalAnchor.left - btn.getBoundingClientRect().width - 30 + 'px';
    }

    var bottomLeftBtnsContainer = s('.bottom-left-btns-container');

    anchorHorizontal = s('#horizontal-separator').getBoundingClientRect();
    anchorVertical = s('#left-separator').getBoundingClientRect();

    bottomLeftBtnsContainer.style.position = 'absolute';
    bottomLeftBtnsContainer.style.top = anchorHorizontal.top - bottomLeftBtnsContainer.getBoundingClientRect().height + 'px';
    bottomLeftBtnsContainer.style.left = anchorVertical.right + 'px';

    // POSITION ORE WEAK SPOT
    var magnifyingGlass = Game.select(Game.upgrades, 'Magnifying Glass');
    if (magnifyingGlass.owned) {
      var randomNumber = function randomNumber() {
        return Math.floor(Math.random() * 80) + 1;
      };
      var orePos = s('.ore').getBoundingClientRect();
      var randomSign = Math.round(Math.random()) * 2 - 1;
      var centerX = (orePos.left + orePos.right) / 2;
      var centerY = (orePos.top + orePos.bottom) / 2;
      var randomX = centerX + randomNumber() * randomSign;
      var randomY = centerY + randomNumber() * randomSign;

      s('.ore-weak-spot').style.left = randomX + 'px';
      s('.ore-weak-spot').style.top = randomY + 'px';
      s('.ore-weak-spot').style.display = 'block';
    } else {
      s('.ore-weak-spot').style.display = 'none';
    }

    // POSITION INVENTORY SLIDE
    if (Game.state.stats.itemsPickedUp > 0) {
      var anchor = s('#left-separator').getBoundingClientRect();

      if (!Game.state.prefs.inventoryOpen) {
        s('.inventory-container').style.left = anchor.right - s('.inventory-container').getBoundingClientRect().width + s('.inventory-container__right').getBoundingClientRect().width + 'px';
        s('.inventory-container').style.top = s('.ore-container').getBoundingClientRect().height - s('.inventory-container').getBoundingClientRect().height + 'px';
        s('.inventory-container').style.visibility = 'visible';
      } else {
        s('.inventory-container').style.left = anchor.right + 'px';
        s('.inventory-container').style.top = s('.ore-container').getBoundingClientRect().height - s('.inventory-container').getBoundingClientRect().height + 'px';
        s('.inventory-container').style.visibility = 'visible';
      }
    }

    Game.repositionAllElements = 0;
  };

  Game.showChangelog = function (show) {
    var newestVersion = '0.6.8.1';

    if (Game.state.currentVersion != newestVersion || Game.state.ores == 0 || show == 1) {
      Game.state.currentVersion = newestVersion;
      var div = document.createElement('div');
      div.classList.add('wrapper');
      div.onclick = function () {
        return Game.removeEl(s('.wrapper'));
      };
      div.innerHTML = '\n        <div class="changelog-container">\n          <h1>Changelog</h1>\n          <p style=\'text-align: center\'>(Click anywhere to close)</p>\n          <hr style=\'border-color: black; margin-bottom: 10px;\'/>\n\n          <h3>v0.7 (10/25/2017)</h3>\n          <p>-Offline progression</p>\n          <p>-Autosave and autoload</p>\n          <p>-Upgrades are now sorted by price</p>\n          <p>-Added a bunch of new sprites. All buildings and current upgrades have a sprite</p>\n          <p>-Working refine mechanic with timer</p>\n\n          <p>-Took out leveling for generations</p>\n          <br/>\n\n          <h3>v0.6.8.1 (10/13/2017)</h3>\n          <p>-Trinket store is now working... most of em</p>\n          <br/>\n\n          <h3>v0.6.8 (10/12/2017)</h3>\n          <p>-Working on Gems store</p>\n          <p>-Working on Quests</p>\n          <p>-Countless bug fixes</p>\n          <br/>\n\n          <h3>v0.6.7 (10/1/2017)</h3>\n          <p>-Prospector class is 3/4 done...</p>\n          <p>-Changed up background image</p>\n          <p>-Changed store fonts</p>\n          <p>-Added a couple more upgrades</p>\n          <p>-Added some more sprites</p>\n          <p>-Added more achievements</p>\n          <p>-Added a text scrolling thingy doodad</p>\n          <p>-Fixed bug where other items disappear on click</p>\n          <p>-Fixed countless more bugs</p>\n          <br/>\n\n\n          <h3>v0.6.5 (9/27/2017)</h3>\n          <p>Prospector class is halfway done...</p>\n          <br/>\n\n          <h3>v0.6.4 (9/24/2017)</h3>\n          <p>-Almost done implementing classes... well, a single class</p>\n\n          <br/>\n\n          <h3>v0.6.3 (9/23/2017) THE SPRITES UPDATE</h3>\n          <p>-Sprites for every single store item(My index finger is sore)</p>\n\n          <br/>\n\n          <h3>v0.6.2 (9/22/2017)</h3>\n          <p>-BIG UPDATE IN THE WORKS... classes dont do anything yet but they will soon...</p>\n          <p>-Added a couple more sprites</p>\n          <p>-Lots of bug fixes</p>\n\n          <br/>\n\n          <h3>v0.6.1 (9/19/2017)</h3>\n          <p>-Added upgrades for every single store item</p>\n          <p>-Added a bunch more sprites</p>\n          <p>-Critical hits gives more XP</p>\n          <p>-Mousing over stats displays information</p>\n          <p>-Adjusted Strength values to prevent negative damage from happening</p>\n          <p>-Adjusted ore health</p>\n          <p>-Implement achievements</p>\n          <p>-Added 2 achievements</p>\n          <p>-Implemented patch notes (this thing!)</p>\n        </div>\n\n      ';
      s('body').append(div);
    }
  };

  Game.export = function () {
    alert('SAVE FILE COPIED');
    var save = btoa(JSON.stringify(Game.state));
    var textarea = document.createElement('textarea');

    textarea.style.opacity = '0';

    s('body').append(textarea);

    textarea.value = save;

    textarea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.log('unable to copy');
    }

    if (s('textarea')) {
      console.log('removing textarea');
      Game.removeEl(s('textarea'));
    }
  };

  Game.import = function () {
    var save = prompt('Enter save code');

    try {
      if (save.length > 1500) {
        var newState = JSON.parse(atob(save));
        Game.state = newState;
        Game.save();
        location.reload();
      } else {
        console.log('not a valid save');
      }
    } catch (err) {
      console.log('not a valid save');
    }
  };

  Game.save = function () {
    Game.state.lastLogin = new Date().getTime();
    localStorage.setItem('state', JSON.stringify(Game.state));
    console.log('SAVED STATE');
    localStorage.setItem('buildings', JSON.stringify(Game.buildings));
    console.log('SAVED BUILDINGS');
    localStorage.setItem('upgrades', JSON.stringify(Game.upgrades));
    console.log('SAVED UPGRADES');
    localStorage.setItem('skills', JSON.stringify(Game.skills));
    console.log('SAVED SKILLS');
    localStorage.setItem('quests', JSON.stringify(Game.quests));
    console.log('SAVED QUESTS');
    localStorage.setItem('achievements', JSON.stringify(Game.achievements));
    console.log('SAVED ACHIEVEMENTS');
    Game.notify('Game Saved');
  };

  Game.load = function () {
    Game.upgrades = [];
    Game.buildings = [];
    Game.skills = [];
    Game.achievements = [];
    Game.quests = [];

    if (localStorage.getItem('state') !== null) {
      console.log('SAVE FILE FOUND');
      // LOAD IN STATE
      console.log('LOADING STATE');
      Game.state = JSON.parse(localStorage.getItem('state'));

      // LOAD BUILDINGS AND UPGRADES
      console.log('LOADING BUILDINGS AND UPGRADES');
      var _items = [];
      JSON.parse(localStorage.getItem('buildings')).forEach(function (building) {
        return _items.push(building);
      });
      JSON.parse(localStorage.getItem('upgrades')).forEach(function (upgrade) {
        return _items.push(upgrade);
      });
      _items.forEach(function (item) {
        return new Item(item);
      });

      // LOAD SKILLS
      console.log('LOADING SKILLS');
      var _skills = [];
      JSON.parse(localStorage.getItem('skills')).forEach(function (skill) {
        return _skills.push(skill);
      });
      _skills.forEach(function (skill) {
        return new Skill(skill);
      });
      console.log('skills', Game.skills);

      // LOAD ACHIEVEMENTS
      console.log('LOADING ACHIEVEMENTS');
      var _achievements = [];
      JSON.parse(localStorage.getItem('achievements')).forEach(function (achievement) {
        return _achievements.push(achievement);
      });
      _achievements.forEach(function (achievement) {
        return new Achievement(achievement);
      });

      // LOAD QUESTS
      console.log('LOADING QUESTS');
      var _quests = [];
      JSON.parse(localStorage.getItem('quests')).forEach(function (quest) {
        return _quests.push(quest);
      });
      _quests.forEach(function (quest) {
        return new Quest(quest);
      });

      // GAIN AWAY INCOME
      if (Game.state.oresPerSecond > 0 && Game.state.lastLogin) Game.earnOfflineGain();

      console.log('LOADING SAVE COMPLETE');
    } else {
      console.log('NO SAVE FILE');

      // BUILD ITEMS
      items.forEach(function (item) {
        new Item(item);
      });

      // BUILD ALL SKILLS
      skills.forEach(function (skill) {
        new Skill(skill);
      });

      // BUILD ACHIEVEMENTS
      achievements.forEach(function (achievement) {
        new Achievement(achievement);
      });

      // BUILD QUESTS
      quests.forEach(function (quest) {
        new Quest(quest);
      });

      Game.tutorialOne();
      Game.tutOneActive = true;
    }

    // PRELOAD ORE IMAGES
    for (var i = 1; i <= 4; i++) {
      // ore 1, ore 2, ore 3, ore 4
      for (var j = 1; j <= 5; j++) {
        // 1-1, 1-2, 1-2, 1-4, 1-5 etc
        var preloadImage = new Image();
        preloadImage.src = './assets/ore' + i + '-' + j + '.png';
      }
    }
    var images = ['abandoned-mineshaft'];
    for (var _i in images) {
      var newImage = new Image();
      newImage.src = './assets/' + images[_i] + '.png';
    }

    // SHOW WELCOME TEXT
    var welcomeTxt = document.createElement('div');
    welcomeTxt.classList.add('wrapper');
    welcomeTxt.innerHTML = '\n      <div class="welcome-text" onClick=\'Game.removeEl(document.querySelector(".wrapper"));\'>\n        <h1>Welcome to More Ore Alpha v.0.9</h1>\n        <br />\n        <p>After a long hiatus from programming, I am finally excited to work on More Ore again</p>\n        <p>Since this game is in its early alpha stages, current features might be changed or scrapped in the final version.</p>\n        <p>If you have any interesting gameplay ideas, let me know! Post in the comments or email me!</p>\n        <p style=\'color: red;\'>Game is only compatible in Google Chrome as of now</p>\n        <br />\n        <p style=\'text-align: center;\'>[ Press ESC or click to close window ]</p>\n      </div>\n    ';

    s('body').append(welcomeTxt);

    // PREREQUISITES
    Game.updatePercentage(0);
    Game.state.prefs.inventoryOpen = false;
    // Game.playBgm()
    Game.showTextScroller();
    Game.repositionAllElements = 1;
    Game.rebuildStats = 1;
    Game.rebuildStore = 1;
    Game.rebuildInventory = 1;
    Game.recalculateOpC = 1;
    Game.recalculateOpS = 1;
    Game.redrawQuestInfo = 1;
    Game.drawQuestBtn();
    s('.loading').classList.add('finished');

    setTimeout(function () {
      Game.removeEl(s('.loading'));
    }, 1500);
  };

  Game.confirmWipe = function () {
    var div = document.createElement('div');
    div.classList.add('wrapper');
    div.innerHTML = '\n      <div class="offline-gain-popup-container">\n        <h2 style=\'font-family: "Germania One"; letter-spacing: 1px;\'>Confirm Wipe</h2>\n        <i class=\'fa fa-times fa-1x\' onclick=\'Game.removeEl(document.querySelector(".wrapper"))\'></i>\n        <hr />\n        <p style=\'color: red\'>Are you sure you want to wipe your save?</p>\n        <p style=\'color: red\'>You will lose all your progress and achievements</p>\n        <hr />\n        <button onclick=\'Game.wipe()\'>Yes</button>\n        <button onclick=\'Game.closeCurrentWindow()\'>No</button>\n      </div>\n    ';

    s('body').append(div);
  };

  Game.wipe = function () {
    localStorage.clear();
    location.reload();
  };

  Game.playSound = function (snd) {
    var sfx = new Audio('./assets/' + snd + '.wav');
    sfx.volume = Game.state.prefs.volume;
    sfx.play();
  };

  Game.playBgm = function () {
    var selected = Math.floor(Math.random() * 4) + 1;
    var bgm = s('#bgm');
    bgm.src = './assets/bgm' + selected + '.mp3';
    bgm.play();
    bgm.onended = function () {
      return Game.playBgm();
    };
  };

  Game.toggleBgm = function () {
    var selected = Math.floor(Math.random() * 4) + 1;
    var audio = s('audio');
    audio.src = './assets/bgm' + selected + '.mp3';
    audio.onended = function () {
      return Game.toggleBgm('on');
    };
    audio.volume = 0.1;
    bgm.onended = function () {
      return Game.playBgm();
    };
    if (Game.state.prefs.bgm) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  Game.earnOfflineGain = function () {
    var past = Game.state.lastLogin;
    var current = new Date().getTime();
    var amountOfTimePassed = (current - past) / 1000; // GETS THE DIFFERENCE IN SECONDS
    var currentOpS = Game.state.oresPerSecond;
    var amountToGain = amountOfTimePassed * currentOpS;
    if (amountToGain >= 1 && amountOfTimePassed >= 30) {
      if (!s('.offline-gain-popup-container')) {
        var div = document.createElement('div');
        div.classList.add('wrapper');
        div.innerHTML = '\n          <div class="offline-gain-popup-container">\n            <h2 style=\'font-family: "Germania One"; letter-spacing: 1px;\'>Welcome Back!</h2>\n            <hr />\n            <p>You were gone for ' + beautifyMs(amountOfTimePassed * 1000) + '</p>\n            <p>You earned ' + beautify(Math.round(amountToGain)) + ' ores!</p>\n            <hr />\n            <button onclick=\'Game.earn(' + amountToGain + '); Game.risingNumber(' + amountToGain + ',"passive", event); Game.removeEl(document.querySelector(".wrapper")); Game.save();\'>Ok</button>\n          </div>\n        ';

        s('body').append(div);
      }
    }
  };

  Game.notify = function (text) {
    var div = document.createElement('div');

    div.classList.add('notify');

    div.innerHTML = '\n      <p>' + text + '</p>\n    ';

    s('body').append(div);

    setTimeout(function () {
      Game.removeEl(div);
    }, 3000);
  };

  Game.earn = function (amount) {
    Game.state.ores += amount;
    Game.updatePercentage(amount);
    Game.rebuildInventory = 1;
    Game.state.stats.currentOresEarned += amount;
    Game.state.stats.totalOresEarned += amount;

    // UNLOCKS
    if (Game.state.stats.currentOresEarned >= 200) {
      Game.unlockUpgrade('Work Boots');
      Game.unlockUpgrade('Painkillers');
    }
    if (Game.state.stats.currentOresEarned >= 600) {
      Game.unlockUpgrade('Shiny Watch');
      Game.unlockUpgrade('Whetstone');
    }
    if (Game.state.stats.currentOresEarned >= 1000) Game.unlockUpgrade('Flashlight');
    if (Game.state.stats.currentOresEarned >= 8000) {
      Game.unlockUpgrade('Steroids');
      Game.unlockUpgrade('Safety Vest');
    }
    if (Game.state.stats.currentOresEarned >= 25000) Game.unlockUpgrade('Clipboard');

    if (Game.state.player.generation.lv == 0 && Game.state.canRefine == false) {
      if (Game.state.stats.currentOresEarned >= 1000000 || Game.state.ores >= 1000000) {
        Game.state.canRefine = true;
        Game.repositionAllElements = 1;
        setTimeout(function () {
          Game.tutorialRefine();
        }, 1000);
      }
    }
  };

  Game.spend = function (amount) {
    Game.state.ores -= amount;
    Game.state.stats.totalOresSpent += amount;
  };

  Game.tutorialOne = function () {
    var div = document.createElement('div');

    div.classList.add('tutorial-container');
    div.innerHTML = '\n      <div class="tutorial-text">\n        <p>Click Me!</p>\n      </div>\n      <div class="tutorial-arrow"></div>\n    ';

    var anchor = s('.ore').getBoundingClientRect();

    s('body').append(div);

    div.style.top = (anchor.top + anchor.bottom) / 2 + 'px';
    div.style.left = anchor.left - div.getBoundingClientRect().width + 'px';

    s('.ore').addEventListener("click", function () {
      Game.removeEl(div);
      setTimeout(function () {
        if (Game.state.stats.buildingsOwned == 0) {
          Game.tutorialTwo();
        }
      }, 2000);
    }, { once: true });
  };

  Game.tutorialTwo = function () {
    var div = document.createElement('div');

    div.classList.add('tutorial-container');
    div.innerHTML = '\n      <div class="tutorial-text">\n        <p>Don\'t forget to purchase buildings</p>\n        <p>to increase your Ores Per Second(OpS)</p>\n        <hr/>\n        <p style=\'font-size: x-small\'>(im looking at you Dylan)</p>\n      </div>\n      <div class="tutorial-arrow"></div>\n    ';

    var anchor = s('#main-separator').getBoundingClientRect();

    s('body').append(div);

    div.style.top = (anchor.top + anchor.bottom) / 5 + 'px';
    div.style.left = anchor.left - div.getBoundingClientRect().width + 'px';

    var check = setInterval(function () {
      if (Game.state.stats.buildingsOwned > 0) {
        Game.removeEl(div);
        clearInterval(check);
      }
    }, 500);
  };

  Game.showTutorialRefine = 0;
  Game.tutorialRefine = function () {
    if (Game.showTutorialRefine == 0 && Game.state.player.generation.lv == 0) {
      Game.showTutorialRefine = 1;
      var div = document.createElement('div');
      div.id = 'refine-tut';

      div.classList.add('tutorial-container');
      div.innerHTML = '\n        <div class="tutorial-arrow-left"></div>\n        <div class="tutorial-text">\n          <p>You can now refine!</p>\n          <p>It is highly recommended to refine ASAP for your first refine</p>\n        </div>\n      ';

      var anchor = s('.refine-btn').getBoundingClientRect();

      s('body').append(div);

      div.style.top = anchor.top - anchor.height / 2 + 'px';
      div.style.left = anchor.right + 'px';
    }
  };

  Game.tutorialQuest = function () {
    setTimeout(function () {
      if (Game.state.stats.timesRefined == 1) {
        var div = document.createElement('div');
        div.id = 'quest-tut';

        div.classList.add('tutorial-container');
        div.innerHTML = '\n          <div class="tutorial-text">\n            <p>Quests are now available!</p>\n            <p>Go on quests for Generation XP, Gems, and even <span style=\'color: #673AB7;text-shadow: 0 2px #e40b32;\'>Mythical Artifacts!</span></p>\n          </div>\n          <div class="tutorial-arrow"></div>\n        ';

        var anchor = s('.open-quests-container').getBoundingClientRect();

        s('body').append(div);

        div.style.top = anchor.top + anchor.height / 6 + 'px';
        div.style.left = anchor.left - div.getBoundingClientRect().width + 'px';
      }
    }, 1000);
  };

  Game.calculateOpC = function () {
    var opc = 0;

    opc += Game.state.player.pickaxe.damage;

    // IF PICKAXE HAS STRENGTH
    if (Game.state.player.pickaxe.prefixStat) {
      if (Game.state.player.pickaxe.prefixStat == 'Strength') {
        // pickaxeStr = Game.state.player.pickaxe.prefixStatVal
        opc += Math.pow(1.2, Game.state.player.pickaxe.prefixStatVal);
      }
    }

    var flashlight = Game.select(Game.upgrades, 'Flashlight');
    if (flashlight.owned > 0) opc += Game.state.oresPerSecond * .01;
    var clipboard = Game.select(Game.upgrades, 'Clipboard');
    if (clipboard.owned > 0) opc += Game.state.oresPerSecond * .02;

    // ADD OPC MULTIPLIER
    opc += opc * Game.state.opcMulti;

    // ADD PERMA OPC MULTI
    opc += opc * Game.state.permanentOpcMulti;

    // ADD GENERATION BONUS
    // opc += (opc * (Game.state.player.generation.lv * 1))

    Game.state.oresPerClick = opc;
    Game.recalculateOpC = 0;

    // OPC ACHIEVEMENTS
    if (Game.state.oresPerClick >= 1000000) Game.winAchievement('Still a Baby');
    if (Game.state.oresPerClick >= 1000000000) Game.winAchievement('Getting There');
    if (Game.state.oresPerClick >= 1000000000000) Game.winAchievement('Big Boy');
  };

  Game.calculateOpS = function () {
    var ops = 0;

    for (var i in Game.buildings) {
      if (Game.buildings[i].owned > 0) {
        ops += Game.buildings[i].production * Game.buildings[i].owned;
      }
    }

    // GENERATION BONUS
    // ops += (ops * (Game.state.player.generation.lv * 1))

    // OPS MULTIeeeeeeeeeeeeeeee
    ops += ops * Game.state.opsMulti;

    // ADD PERMA OPS MULTI
    ops += ops * Game.state.permanentOpsMulti;

    Game.state.oresPerSecond = ops;
    Game.recalculateOpS = 0;

    // OPS ACHIEVEMENTS
    if (Game.state.oresPerSecond >= 401000) Game.winAchievement('401k');
    if (Game.state.oresPerSecond >= 5000000) Game.winAchievement('Retirement Plan');
    if (Game.state.oresPerSecond >= 1000000000) Game.winAchievement('Hedge Fund');
  };

  Game.calculateGenerationXp = function () {
    var xp = Math.floor(Math.cbrt(Game.state.stats.currentOresEarned));
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

    var info = {
      xp: xp
      // lvs: lvs
    };
    return info;
  };

  Game.gainGenerationXp = function () {

    var gain = Game.calculateGenerationXp();

    var generation = Game.state.player.generation;

    while (gain.xp > 0) {
      if (generation.currentXp + gain.xp < generation.xpNeeded) {
        // if you dont level up
        generation.currentXp += gain.xp;
        gain.xp = 0;
      } else {
        // If you level up
        gain.xp -= generation.xpNeeded - generation.currentXp;
        Game.gainGenerationLv();
      }
    }
  };

  Game.gainGenerationLv = function () {
    Game.state.player.generation.lv++;
    Game.state.player.generation.availableSp += 1;
    Game.state.player.generation.xpNeeded = 100 * Math.pow(1.25, Game.state.player.generation.lv);
  };

  Game.getCombo = function (type) {
    if (type) {
      // IF WEAK SPOT HIT
      Game.state.stats.currentCombo++;
      if (Game.state.stats.currentCombo % 5 == 0) {
        Game.risingNumber(0, 'combo', event);
      }
      if (Game.state.stats.currentCombo > Game.state.stats.highestCombo) {
        Game.state.stats.highestCombo = Game.state.stats.currentCombo;
      }

      // UNLOCK ACHIEVEMENTS REGARDING COMBOS
      if (Game.state.stats.currentCombo == 5) Game.winAchievement('Combo Pleb');
      if (Game.state.stats.currentCombo == 15) Game.winAchievement('Combo Squire');
      if (Game.state.stats.currentCombo == 40) Game.winAchievement('Combo Knight');
      if (Game.state.stats.currentCombo == 100) Game.winAchievement('Combo King');
      if (Game.state.stats.currentCombo == 300) Game.winAchievement('Combo Master');
      if (Game.state.stats.currentCombo == 666) Game.winAchievement('Combo Devil');
      if (Game.state.stats.currentCombo == 777) Game.winAchievement('Combo God');
      if (Game.state.stats.currentCombo == 1000) Game.winAchievement('Combo Saiyan');
      if (Game.state.stats.currentCombo == 10000) Game.winAchievement('Combo Saitama');
    } else {
      // IF REGULAR HIT
      Game.state.stats.currentCombo = 0;
    }
  };

  Game.handleClick = function (type) {
    var amount = Game.state.oresPerClick;
    if (type) {
      if (type == 'weak-spot') {
        Game.getCombo('hit');
        amount *= Game.state.weakHitMulti + Game.state.permanentWeakHitMulti;
        Game.playSound('ore-crit-hit');
        Game.risingNumber(amount, 'weak-hit', event);
        Game.state.stats.currentWeakSpotHits++;
        Game.repositionAllElements = 1;
      }
    } else {
      Game.getCombo();
      Game.playSound('ore-hit');
      Game.risingNumber(amount);
      // Game.gainXp()
    }

    Game.earn(amount);
    Game.drawRockParticles();
    Game.state.stats.currentOreClicks++;
    Game.state.stats.currentOresMined += amount;
    Game.state.stats.totalOresMined += amount;

    // CHECK CLICK RELATED ACHIEVEMENTS

    Game.recentlyClicked = 0;

    // UNLOCK SHIT
    if (Game.state.stats.currentOreClicks == 3) Game.unlockUpgrade('Magnifying Glass');
    if (Game.state.stats.currentWeakSpotHits == 5) Game.unlockUpgrade('Clean Magnifying Glass');
    if (Game.state.stats.currentWeakSpotHits == 20) Game.unlockUpgrade('Polish Magnifying Glass');
  };

  Game.risingNumber = function (amount, type) {
    if (Game.state.prefs.risingNumbers == true) {
      var mouseX = (s('.ore').getBoundingClientRect().left + s('.ore').getBoundingClientRect().right) / 2;
      var mouseY = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom) / 2;
      // if (event) {
      //   mouseX = event.clientX;
      //   mouseY = event.clientY;
      // }
      var randomNumber = Math.floor(Math.random() * 20) + 1;
      var randomSign = Math.round(Math.random()) * 2 - 1;
      var randomMouseX = mouseX + randomNumber * randomSign;

      var allRisingNumbers = document.querySelectorAll('.rising-number');
      if (allRisingNumbers.length > 10) {
        var selectedEl = allRisingNumbers[0];
        Game.removeEl(selectedEl);
      }

      var _risingNumber = document.createElement('div');
      _risingNumber.classList.add('rising-number');
      if (amount) _risingNumber.innerHTML = '+' + beautify(amount);
      _risingNumber.style.left = randomMouseX + 'px';
      _risingNumber.style.top = mouseY + 'px';

      _risingNumber.style.position = 'absolute';
      _risingNumber.style.fontSize = '15px';
      _risingNumber.style.animation = 'risingNumber 2s ease-out';
      _risingNumber.style.animationFillMode = 'forwards';
      _risingNumber.style.pointerEvents = 'none';
      _risingNumber.style.color = 'white';

      if (type == 'weak-hit') {
        _risingNumber.style.fontSize = '30px';
      }

      if (type == 'crit-hit') {
        _risingNumber.style.fontSize = '25px';
      }

      if (type == 'level') {
        _risingNumber.style.fontSize = 'x-large';
        _risingNumber.innerHTML = 'LEVEL UP';
      }

      if (type == 'spendMoney') {
        _risingNumber.style.fontSize = 'xx-large';
        _risingNumber.style.color = 'red';
        _risingNumber.innerHTML = '-$';
      }

      if (type == 'spendGems') {
        _risingNumber.style.fontSize = 'xx-large';
        _risingNumber.style.color = 'red';
        _risingNumber.style.zIndex = 9999999;
        _risingNumber.innerHTML = '-<i style="color: red" class="fa fa-diamond fa-1x"></i>';
      }

      if (type == 'combo') {
        _risingNumber.style.fontSize = 'xx-large';
        _risingNumber.style.color = getRandomColor();
        _risingNumber.style.animationDuration = '3s';
        _risingNumber.innerHTML = Game.state.stats.currentCombo + ' hit combo';
      }

      if (type == 'mega-crit') {
        _risingNumber.style.fontSize = '60px';
        _risingNumber.style.color = 'lightcyan';
        _risingNumber.style.animationDuration = '3.5s';
      }

      if (type == 'heavy-smash') {
        _risingNumber.style.left = (s('.ore').getBoundingClientRect().left + s('.ore').getBoundingClientRect().right) / 2 + 'px';
        _risingNumber.style.top = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom) / 2 + 'px';
        _risingNumber.style.animationDuration = '3s';
        _risingNumber.style.fontSize = '50px';
        _risingNumber.style.color = 'crimson';
      }

      if (type == 'auto-miner') {
        _risingNumber.style.left = (s('.ore').getBoundingClientRect().left + s('.ore').getBoundingClientRect().right) / 2 + randomNumber * randomSign + 'px';
        _risingNumber.style.top = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom) / 2 + 'px';
      }

      if (type == 'buildings') {
        _risingNumber.style.left = (s('.ore').getBoundingClientRect().left + s('.ore').getBoundingClientRect().right) / 2 + randomNumber * randomSign + 'px';
        _risingNumber.style.top = (s('.ore').getBoundingClientRect().top + s('.ore').getBoundingClientRect().bottom) / 2 + 'px';
        _risingNumber.style.animation = 'risingNumberBuildings 2s ease-out';
        _risingNumber.style.opacity = '.4';
      }

      if (type == 'passive') {
        _risingNumber.innerHTML = '+' + beautify(amount);
        _risingNumber.style.fontSize = '35px';
      }

      if (type == 'bonus') {
        _risingNumber.innerHTML = '+' + beautify(amount);
        _risingNumber.style.color = 'gold';
        _risingNumber.style.fontSize = '40px';
        _risingNumber.style.animationDuration = '3s';
      }

      if (type == 'gold rush') {
        _risingNumber.innerHTML = 'GOLD RUSH <br/> +' + beautify(amount);
        _risingNumber.style.color = 'gold';
        _risingNumber.style.textAlign = 'center';
        _risingNumber.style.fontSize = '40px';
        _risingNumber.style.animationDuration = '3s';
      }

      if (type == 'skill up') {
        _risingNumber.innerHTML = '<i class=\'fa fa-level-up\'></i>';
        _risingNumber.style.color = 'green';
        _risingNumber.style.fontSize = '30px';
      }

      if (type == 'quest-progress') {
        _risingNumber.innerHTML = '<i class=\'fa fa-angle-double-right fa-2x\'></i>';
        _risingNumber.style.color = 'white';
        // risingNumber.style.left = mouseX + 'px'
        // risingNumber.style.top = mouseY + 'px'
      }

      s('.particles').append(_risingNumber);

      setTimeout(function () {
        Game.removeEl(_risingNumber);
      }, 2000);
    }
  };

  Game.drawRockParticles = function () {
    if (Game.state.prefs.rockParticles == true) {
      var allParticles = document.querySelectorAll('.particle');
      if (allParticles.length >= 10) {
        var selectedEl = allParticles[0];
        Game.removeEl(selectedEl);
      }
      var div = document.createElement('div');
      div.classList.add('particle');
      div.style.background = 'lightgrey';

      // var x = event.clientX;
      // var y = event.clientY;

      div.style.left = x + 'px';
      div.style.top = y + 'px';

      var particleY = y;
      var particleX = x;

      var randomNumber = Math.random();
      var randomSign = Math.round(Math.random()) * 2 - 1;

      var particleUp = setInterval(function () {
        particleX += randomNumber * randomSign;
        particleY -= 1;
        div.style.top = particleY + 'px';
        div.style.left = particleX + 'px';
      }, 10);

      setTimeout(function () {
        clearInterval(particleUp);

        var particleDown = setInterval(function () {
          particleX += randomNumber * randomSign / 2;
          particleY += 1.5;
          div.style.top = particleY + 'px';
          div.style.left = particleX + 'px';
        }, 10);

        setTimeout(function () {
          clearInterval(particleDown);
          if (div.parentNode) div.parentNode.removeChild(div);
        }, 1000);
      }, 100);

      s('body').append(div);
    }
  };

  Game.dropItem = function () {
    var randomSign = Math.round(Math.random()) * 2 - 1;
    var randomNumber = (Math.floor(Math.random() * 200) + 1) * randomSign;
    var randomY = Math.floor(Math.random() * 50) + 1;
    var thisItemClicked = false;
    var amountOfRocksDestroyed = Game.state.stats.rocksDestroyed;
    var iLvl = amountOfRocksDestroyed;

    // CALCULATES DROP CHANCE
    var itemDropChance = .3; // 30%
    if (Game.state.player.int > 0) {
      itemDropChance += Game.state.player.int / (Game.state.player.int + 30);
    }
    if (Game.state.player.luk > 0) {
      itemDropChance += Game.state.player.int / (Game.state.player.int + 20);
    }

    // IF ITEM DROPS CREATE A CONTAINER
    if (Math.random() < itemDropChance || amountOfRocksDestroyed <= 1) {
      var itemContainer = document.createElement('div');
      itemContainer.classList.add('item-container');
      itemContainer.id = 'item-' + amountOfRocksDestroyed;
      itemContainer.innerHTML = '\n        <div class="item-pouch-glow"></div>\n        <div class="item-pouch-glow2"></div>\n        <div class="item-pouch-glow3"></div>\n      ';

      // POSITION ITEM ON ORE
      var orePos = s('.ore').getBoundingClientRect();
      itemContainer.style.position = 'absolute';
      itemContainer.style.top = (orePos.top + orePos.bottom) / 1.5 + 'px';
      itemContainer.style.left = (orePos.left + orePos.right) / 2 + 'px';
      itemContainer.style.transition = 'all .5s';
      itemContainer.style.transitionTimingFunction = 'ease-out';

      // MAKE ITEM
      var item = document.createElement('div');
      item.classList.add('item-drop');
      item.style.position = 'relative';
      item.id = 'item-' + amountOfRocksDestroyed;

      itemContainer.append(item);

      s('body').append(itemContainer);

      // SMALL ANIMATION FOR ITEM MOVEMENT
      setTimeout(function () {
        itemContainer.style.top = orePos.bottom + randomY + 'px';
        itemContainer.style.left = (orePos.left + orePos.right) / 2 + randomNumber + 'px';
      }, 10);

      item.addEventListener('click', function () {
        var id = item.id;
        item.style.pointerEvents = 'none';
        s('#' + id).classList.add('item-pickup-animation');
        setTimeout(function () {
          var items = document.querySelectorAll('#' + id);
          items.forEach(function (item) {
            Game.removeEl(item);
          });
          Game.pickUpItem(iLvl);
        }, 800);
      });
    }
  };

  Game.generateRandomItem2 = function (iLv) {

    var rarity = void 0,
        material = void 0,
        prefix = void 0,
        suffix = void 0,
        totalMult = void 0,
        selectedStats = void 0,
        name = void 0;

    var rarities = [{
      name: 'Common',
      maxStat: 0,
      mult: 1
    }, {
      name: 'Uncommon',
      maxStat: 1,
      mult: 1.5
    }, {
      name: 'Unique',
      maxStat: 2,
      mult: 2
    }, {
      name: 'Rare',
      maxStat: 3,
      mult: 3
    }, {
      name: 'Legendary',
      maxStat: 4,
      mult: 5
    }];
    var prefixes = [{
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
    }, {
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
    }];
    var materials = [{
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
    }];
    var suffixes = [{
      name: 'of the Giant',
      stat: 'Strength',
      mult: 10
    }, {
      name: 'of the Leprechaun',
      stat: 'Luck',
      mult: 10
    }];
    var stats = [{ name: 'Strength', val: null }, { name: 'Dexterity', val: null }, { name: 'Intelligence', val: null }, { name: 'Luck', val: null }, { name: 'Charisma', val: null }];

    var chooseRarity = function chooseRarity() {
      var selectedRarity = void 0;
      var randomNum = Math.random();
      if (randomNum >= 0) {
        selectedRarity = rarities[0];
      }
      if (randomNum >= .5) {
        selectedRarity = rarities[1];
      }
      if (randomNum >= .7) {
        selectedRarity = rarities[2];
      }
      if (randomNum >= .9) {
        selectedRarity = rarities[3];
      }
      if (randomNum >= .95) {
        selectedRarity = rarities[4];
      }
      return selectedRarity;
    };
    var chooseMaterial = function chooseMaterial() {
      var selectedMaterial = void 0;
      var randomNum = Math.random();
      if (randomNum >= 0) {
        selectedMaterial = materials[0];
      }
      if (randomNum >= .4) {
        selectedMaterial = materials[1];
      }
      if (randomNum >= .7) {
        selectedMaterial = materials[2];
      }
      if (randomNum >= .9) {
        selectedMaterial = materials[3];
      }
      if (randomNum >= .95) {
        selectedMaterial = materials[4];
      }
      return selectedMaterial;
    };
    var choosePrefix = function choosePrefix() {
      return prefixes[Math.floor(Math.random() * prefixes.length)];
    };
    var chooseSuffix = function chooseSuffix() {
      return suffixes[Math.floor(Math.random() * suffixes.length)];
    };

    rarity = chooseRarity();
    material = chooseMaterial();
    if (Math.random() >= .6 && rarity.name != 'Common') prefix = choosePrefix();
    if (rarity.name == 'Rare' || rarity.name == 'Legendary') suffix = chooseSuffix();

    // CALCULATE MULT
    totalMult = 0;
    totalMult += rarity.mult;
    totalMult += material.mult;
    if (prefix) totalMult += prefix.mult;
    if (suffix) totalMult += suffix.mult;
    totalMult *= iLv * .5;

    // DETERMINE STATS
    selectedStats = [];
    var absolutePrefix = 0;
    var absoluteSuffix = 0;

    for (var i = 0; i < rarity.maxStat; i++) {
      console.log('AMOUNT OF STATS:', rarity.maxStat);
      if (prefix && absolutePrefix == 0) {
        absolutePrefix = 1;
        for (var j = 0; j < stats.length; j++) {
          if (prefix.stat == stats[j].name) {
            selectedStats.push(stats[j]);
          }
        }
      } else if (suffix && absoluteSuffix == 0) {
        absoluteSuffix = 1;
        for (var _j = 0; _j < stats.length; _j++) {
          if (suffix.stat == stats[_j].name) {
            selectedStats.push(stats[_j]);
          }
        }
      } else {
        selectedStats.push(stats[Math.floor(Math.random() * stats.length)]);
      }
    }

    // DETERMINE STAT VALUES
    for (var _i2 in selectedStats) {
      selectedStats[_i2].val = Math.floor(Math.random() * (totalMult - totalMult / 2 + 1) + totalMult / 2);
    }

    // DAMAGE
    var calculateDmg = iLv * totalMult;

    // BUILD IT OUT
    if (suffix) {
      if (prefix) {
        name = prefix.name + ' ' + material.name + ' Pickaxe ' + suffix.name;
      } else {
        name = material.name + ' Pickaxe ' + suffix.name;
      }
    } else {
      if (prefix) {
        name = prefix.name + ' ' + material.name + ' Pickaxe';
      } else {
        name = material.name + ' Pickaxe';
      }
    }

    var newItem = {
      name: name,
      rarity: rarity.name,
      material: material.name,
      stats: selectedStats,
      iLv: iLv,
      damage: calculateDmg
    };

    console.log(newItem);

    return newItem;
  };

  Game.generateRandomPickaxe = function (iLvl) {

    var selected = void 0;
    var totalMultiplier = 0;
    var pickaxeName = '';

    var allRarities = [
    // [name, [stat range], multiplier]
    ['Common', [0, 1], 1], ['Uncommon', [0, 2], 1.5], ['Rare', [1, 2], 2], ['Unique', [2, 3], 3.5], ['Legendary', [3, 4], 5], ['Mythical', [4, 5], 10]];
    var allMaterials = [
    // [[names], multiplier]
    [['Wood', 'Plastic', 'Cardboard', 'Glass', 'Tin'], .5], [['Stone', 'Bronze', 'Copper', 'Bone', 'Lead'], 1], [['Iron', 'Silver', 'Gold'], 3], [['Steel', 'Platinum'], 5], [['Diamond', 'Adamantite', 'Titanium', 'Alien'], 10]];
    var allPrefixes = [
    // common prefixes +1
    [['Pointy', 'Strong', 'Refined', 'Big', 'Durable', 'Hard'], ['Charming', 'Shiny'], ['Lucky']],
    // uncommon prefixes -1
    [['Small', 'Broken', 'Shoddy', 'Frail', 'Hollow'], ['Boring', 'Rusty', 'Rusted'], ['Unlucky', 'Poor']],
    // rare prefixes +2
    [['Sharp', 'Gigantic'], ['Elegant', 'Alluring'], ['Fortuitous']]];
    var allSuffixes = [['of the Giant', 'of the Beast'], ['of the Prince', 'of the Sun'], ['of the Beggar', 'of the Leprechaun']];

    // SELECT RARITY
    var randomNum = Math.random();
    var selectedRarity = void 0;
    if (randomNum >= 0) selected = allRarities[0]; // 45%  Common
    if (randomNum >= .45) selected = allRarities[1]; // 25%  Uncommon
    if (randomNum >= .70) selected = allRarities[2]; // 15%  Rare
    if (randomNum >= .85) selected = allRarities[3]; // 9%   Unique
    if (randomNum >= .94) selected = allRarities[4]; // 5%   Legendary
    if (randomNum >= .99) selected = allRarities[5]; // 1%   Mythical
    selectedRarity = {
      name: selected[0],
      stat_amount: Math.floor(Math.random() * (selected[1][1] - selected[1][0] + 1) + selected[1][0]),
      multiplier: selected[2]
    };
    totalMultiplier += selectedRarity.multiplier;

    // SELECT PREFIX
    randomNum = Math.random();
    var selectedPrefix = void 0;
    if (selectedRarity.stat_amount > 0) {
      if (randomNum <= .6) {
        // 60%
        var multiplier = void 0,
            stat = void 0,
            name = void 0;
        var selectedType = Math.floor(Math.random() * allPrefixes.length);
        var selectedStat = Math.floor(Math.random() * allPrefixes[selectedType].length);
        var selectedName = Math.floor(Math.random() * allPrefixes[selectedType][selectedStat].length);

        name = allPrefixes[selectedType][selectedStat][selectedName];
        pickaxeName += name;

        if (selectedType == 0) multiplier = 1;
        if (selectedType == 1) multiplier = -1;
        if (selectedType == 2) multiplier = 2;

        if (selectedStat == 0) stat = 'Strength';
        if (selectedStat == 1) stat = 'Charisma';
        if (selectedStat == 2) stat = 'Luck';

        selectedPrefix = { name: name, stat: stat, multiplier: multiplier };
        totalMultiplier += selectedPrefix.multiplier;
      }
    }

    // SELECT MATERIAL
    randomNum = Math.random();
    if (randomNum >= 0) selected = allMaterials[0]; // 35%
    if (randomNum >= .5) selected = allMaterials[1]; // 50%
    if (randomNum >= .7) selected = allMaterials[2]; // 9%
    if (randomNum >= .85) selected = allMaterials[3]; // 5%
    if (randomNum >= .95) selected = allMaterials[4]; // 1%
    var selectedMaterial = {
      name: selected[0][Math.floor(Math.random() * selected[0].length)],
      multiplier: selected[1]
    };
    pickaxeName += ' ' + selectedMaterial.name + ' Pickaxe';
    totalMultiplier += selectedMaterial.multiplier;

    // SELECT SUFFIX
    randomNum = Math.random();
    var selectedSuffix = void 0;
    if (selectedRarity.multiplier >= 3.5) {
      if (randomNum <= .5) {
        var _stat = void 0,
            _name = void 0;
        var _selectedStat = Math.floor(Math.random() * allSuffixes.length);
        var _selectedName = Math.floor(Math.random() * allSuffixes[_selectedStat].length);

        if (_selectedStat == 0) _stat = 'Strength';
        if (_selectedStat == 1) _stat = 'Charisma';
        if (_selectedStat == 2) _stat = 'Luck';

        _name = allSuffixes[_selectedStat][_selectedName];
        pickaxeName += ' ' + _name;

        selectedSuffix = { name: _name, stat: _stat };
        totalMultiplier += 10;
      }
    }

    totalMultiplier *= iLvl * .5;

    // DAMAGE
    var damage = iLvl * totalMultiplier;

    // SELECT AND BUILD BONUS STATS
    var pickaxeStats = {
      Strength: [],
      Charisma: [],
      Luck: []
    };

    var statAmount = selectedRarity.stat_amount;
    if (statAmount > 0) {
      if (selectedSuffix) {
        statAmount--;
        pickaxeStats[selectedSuffix.stat].push(Math.floor(Math.random() * (totalMultiplier - totalMultiplier / 2 + 1) + totalMultiplier / 2));
      }
      if (selectedPrefix) {
        statAmount--;
        pickaxeStats[selectedPrefix.stat].push(Math.floor(Math.random() * (totalMultiplier - totalMultiplier / 2 + 1) + totalMultiplier / 2));
      }
      if (statAmount > 0) {
        for (var i = 0; i < statAmount; i++) {
          var possibleStats = ['Strength', 'Charisma', 'Luck'];
          pickaxeStats[possibleStats[Math.floor(Math.random() * possibleStats.length)]].push(Math.floor(Math.random() * (totalMultiplier - totalMultiplier / 2 + 1) + totalMultiplier / 2));
        }
      }
    }

    var pickaxe = {
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
        suffix: selectedSuffix
      }
    };

    return pickaxe;
  };

  Game.pickUpItem = function (iLvl) {
    Game.state.stats.itemsPickedUp++;
    if (Game.state.stats.itemsPickedUp == 1) Game.repositionAllElements = 1;
    Game.newItem = Game.generateRandomPickaxe(iLvl);
    // Game.newItem = Game.generateRandomItem2(iLvl)
    var itemModal = document.createElement('div');
    itemModal.classList.add('item-modal-container');

    var str = '\n      <div class="item-modal">\n        <div class="item-modal__left">\n          <h1 style=\'font-family: "Germania One"; font-size: 60px;\'>New Pickaxe</h1>\n          <h2 class=\'' + Game.newItem.rarity + '\' style=\'font-size: xx-large\'>' + Game.newItem.name + '</h2>\n          <div class="item-modal-img">\n            <div class="pickaxe-top" style=\'background: url("./assets/pickaxe-top-' + Game.newItem.material.toLowerCase() + '.png"); background-size: 100% 100%;\'></div>\n            <div class="pickaxe-bottom"></div>\n            ';
    if (Game.newItem.rarity == 'Legendary' || Game.newItem.rarity == 'Mythical') {
      str += "<div class='pickaxe-bg'></div>";
    }

    str += '\n          </div>\n          <div class="item-stats">\n            <p style=\'font-style: italic; font-size: small\'>' + Game.newItem.rarity + '</p>\n            <br/>\n            <p>Item Level: ' + Game.newItem.iLv + '</p>\n            <p>Damage: ' + beautify(Game.newItem.damage) + '</p>\n            ';

    if (Game.newItem.stats.Strength.length > 0) {
      Game.newItem.stats.Strength.forEach(function (val) {
        str += '<p>Strength: ' + val + '</p>';
      });
    }

    if (Game.newItem.stats.Charisma.length > 0) {
      Game.newItem.stats.Charisma.forEach(function (val) {
        str += '<p>Charisma: ' + val + '</p>';
      });
    }

    if (Game.newItem.stats.Luck.length > 0) {
      Game.newItem.stats.Luck.forEach(function (val) {
        str += '<p>Luck: ' + val + '</p>';
      });
    }

    str += '\n            <br/>\n          </div>\n          <div class="item-modal-bottom">\n            <button onclick=Game.itemModalClick(\'equip\')>Equip</button>\n            <button onclick=Game.itemModalClick()>Discard</button>\n          </div>\n        </div>\n        <div class="item-modal__right">\n          <h1 style=\'font-family: "Germania One"; font-size: 30px;\'>Equipped</h1>\n          <h2 class=\'' + Game.state.player.pickaxe.rarity + '\' style=\'font-size: large\'>' + Game.state.player.pickaxe.name + '</h2>\n          <div class="item-modal-img-small">\n            <div class="pickaxe-top-small ' + Game.state.player.pickaxe.material + '" style=\'background: url("./assets/pickaxe-top-' + Game.state.player.pickaxe.material.toLowerCase() + '.png"); background-size: 100% 100%;\'></div>\n            <div class="pickaxe-bottom-small"></div>\n            ';
    if (Game.state.player.pickaxe.rarity == 'Legendary' || Game.state.player.pickaxe.rarity == 'Mythical') {
      str += '<div class="pickaxe-bg-small"></div>';
    }

    str += '\n          </div>\n          <div class="item-stats">\n              <p style=\'font-style: italic; font-size: small\'>' + Game.state.player.pickaxe.rarity + '</p>\n              <br/>\n              <p>Item Level: ' + Game.state.player.pickaxe.iLv + '</p>\n              <p>Damage: ' + beautify(Game.state.player.pickaxe.damage) + '</p>\n              ';

    if (Game.state.player.pickaxe.stats) {
      if (Game.state.player.pickaxe.stats.Strength.length > 0) {
        Game.state.player.pickaxe.stats.Strength.forEach(function (val) {
          str += '<p>Strength: ' + val + '</p>';
        });
      }

      if (Game.state.player.pickaxe.stats.Charisma.length > 0) {
        Game.state.player.pickaxe.stats.Charisma.forEach(function (val) {
          str += '<p>Charisma: ' + val + '</p>';
        });
      }

      if (Game.state.player.pickaxe.stats.Luck.length > 0) {
        Game.state.player.pickaxe.stats.Luck.forEach(function (val) {
          str += '<p>Luck: ' + val + '</p>';
        });
      }
    }

    str += '\n            </div>\n        </div>\n      </div>\n    ';

    itemModal.innerHTML = str;
    s('body').append(itemModal);
  };

  Game.itemModalClick = function (str) {

    if (str == 'equip') {
      Game.state.player.pickaxe = Game.newItem;
      Game.recalculateOpC = 1;
    }

    s('.item-modal').style.animation = 'itemFallOut .3s forwards';
    s('.item-modal').addEventListener('animationend', function () {
      return Game.removeEl(s('.item-modal-container'));
    });

    // Game.removeEl(s('.item-modal-container'))
  };

  Game.buildStore = function () {
    var str = '';
    str += '\n      <div class="upgrades-container">\n    ';
    var hasContent = 0;

    Game.sortedUpgrades = Game.upgrades.sort(function (a, b) {
      return a.price - b.price;
    });

    for (var i in Game.sortedUpgrades) {
      var item = Game.sortedUpgrades[i];
      if (item.hidden == 0) {
        hasContent = 1;
        str += '\n          <div class="upgrade-item-container" style=\'background-color: #b56535\'>\n            <div class="upgrade-item" id="' + item.name.replace(/\s/g, "-") + '" onclick=\'Game.sortedUpgrades[' + i + '].buy(); Game.hideTooltip();\' onmouseover="Game.showTooltip({name: \'' + item.name + '\', type: \'' + item.type + 's\'}, event); Game.playSound(\'itemhover\')" onmouseout="Game.hideTooltip()" style=\'background: url(./assets/' + item.pic + '); background-size: 100%;\'></div>\n          </div>\n        ';
      }
    }
    if (hasContent == 0) str += '<h3 style="text-align: center; width: 100%; opacity: .5; height: 50px; line-height: 50px;">no upgrades available</h3>';
    str += '</div><div class="horizontal-separator" style=\'height: 8px;\'></div>';

    if (Game.state.stats.timesRefined >= 1) {
      str += '\n        <div class=\'bulk-buy-container\'>\n          <p>BUY AMOUNT:</p>\n          <p onclick=\'Game.state.prefs.buyAmount = 1; Game.rebuildStore = 1\' id=\'buy-1\' class=\'bulk-buy-amt\'>1</p>\n          <p onclick=\'Game.state.prefs.buyAmount = 10; Game.rebuildStore = 1\' id=\'buy-10\' class=\'bulk-buy-amt\'>10</p>\n          <p onclick=\'Game.state.prefs.buyAmount = 100; Game.rebuildStore = 1\' id=\'buy-100\' class=\'bulk-buy-amt\'>100</p>\n          <p onclick=\'Game.state.prefs.buyAmount = "max"; Game.rebuildStore = 1\' id=\'buy-max\' class=\'bulk-buy-amt\'>MAX</p>\n        </div>\n        <div class="horizontal-separator" style=\'height: 8px;\'></div>\n      ';
    }

    for (var _i3 in Game.buildings) {
      var _item = Game.buildings[_i3];
      var price = Game.buildings[_i3].price;
      if (Game.state.prefs.buyAmount != 'max') price = _item.basePrice * (Math.pow(1.15, _item.owned + Game.state.prefs.buyAmount) - Math.pow(1.15, _item.owned)) / .15;
      if (_item.hidden == 0) {
        str += '\n          <div class="button" onclick="Game.buildings[' + _i3 + '].buy();" onmouseover="Game.showTooltip({name: \'' + _item.name + '\', type: \'' + _item.type + 's\'}, event); Game.playSound(\'itemhover\')" onmouseout="Game.hideTooltip()">\n            <div style=\'pointer-events: none\' class="button-top">\n              <div class="button-left">\n                <img src="./assets/' + _item.pic + '" style=\'filter: brightness(100%); image-rendering: pixelated; image-rendering: -moz-crisp-edges\'/>\n              </div>\n              <div style=\'pointer-events: none\' class="button-middle">\n                <h3 style=\'font-size: x-large\'>' + _item.name + '</h3>\n                <p>cost: ' + beautify(price) + ' ores</p>\n              </div>\n              <div style=\'pointer-events: none\' class="button-right">\n                <p style=\'font-size: xx-large\'>' + _item.owned + '</p>\n              </div>\n            </div>\n          </div>\n        ';
      }
      if (_item.hidden == 1) {
        str += '\n          <div class="button" style=\'cursor: not-allowed; box-shadow: 0 4px black; opacity: .7; filter: brightness(60%)\'>\n            <div class="button-top">\n              <div class="button-left">\n                <img src="./assets/' + _item.pic + '" style=\'filter: brightness(0%)\'/>\n              </div>\n              <div class="button-middle">\n                <h3 style=\'font-size: larger\'>???</h3>\n                <p>cost: ??? ores</p>\n              </div>\n              <div class="button-right">\n              </div>\n            </div>\n          </div>\n        ';
      }
      if (_item.hidden == 3) {
        str += '\n          <div class="button" style=\'cursor: not-allowed; box-shadow: 0 4px black; opacity: .7; filter: brightness(60%)\'>\n            <div class="button-top">\n              <div class="button-left">\n                <img src="./assets/' + _item.pic + '" style=\'filter: brightness(0%)\'/>\n              </div>\n              <div class="button-middle">\n                <h3 style=\'font-size: larger\'>???</h3>\n                <p>cost: ' + beautify(_item.price) + ' ores</p>\n              </div>\n              <div class="button-right">\n              </div>\n            </div>\n          </div>\n        ';
      }
    }
    Game.rebuildStore = 0;
    Game.loadAd();
    s('.tab-content').innerHTML = str;

    //BULK BUY SETTINGS
    if (Game.state.stats.timesRefined >= 1) {
      if (Game.state.prefs.buyAmount == 1) s('#buy-1').style.color = 'white';
      if (Game.state.prefs.buyAmount == 10) s('#buy-10').style.color = 'white';
      if (Game.state.prefs.buyAmount == 100) s('#buy-100').style.color = 'white';
      if (Game.state.prefs.buyAmount == "max") s('#buy-max').style.color = 'white';
    }
  };

  Game.adsLoaded = false;
  Game.loadAd = function () {
    if (Game.adsLoaded == false) {
      Game.adsLoaded = true;
      for (var i = 0; i < 3; i++) {
        var script = document.createElement('script');
        script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        var ins = document.createElement('ins');
        ins.classList.add('adsbygoogle');
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', 'ca-pub-4584563958870163');
        ins.setAttribute('data-ad-slot', '6565116738');

        var div = s('#ads-im-sorry-please-dont-hate-me');
        div.append(script);
        div.append(ins);

        if (s('ins').style.display == 'block') {
          ins.setAttribute('data-ad-format', 'rectangle, horizontal');
          (adsbygoogle = window.adsbygoogle || []).push({});
        }
        s('.tab-content-container').append(div);
      }
    }

    if (s('#ads-im-sorry-please-dont-hate-me').innerHTML.length < 1000) {
      var str = '\n        <p style=\'text-align: center; background: transparent; color: white; padding-bottom: 20px;\'>\n        Please consider disabling adblock! <br/>\n        I am just a broke college student and the cents generated from this game will be for food.\n        <br/>\n        Or consider supporting me on <a target=\'_blank\' href="https://www.patreon.com/user?u=8032477">patreon!</a> <br/>(Even a dollar helps!)\n        </p>\n      ';
      s('#ads-im-sorry-please-dont-hate-me').innerHTML = str;
    }
  };

  Game.buildInventory = function () {
    var str = '';
    str += 'Ores: ' + beautify(Game.state.ores);
    if (Game.state.oresPerSecond > 0) {
      str += ' (' + beautify(Game.state.oresPerSecond) + '/s)';
    }
    if (Game.state.stats.timesRefined > 0) {
      str += '<br/> Gems: ' + Game.state.gems;
    }

    s('.ores').innerHTML = str;

    s('.generation').innerHTML = 'Generation: ' + Game.state.player.generation.lv;
    s('.generation').onmouseover = function () {
      return Game.showTooltip({ type: 'generation' }, event);
    };
    s('.generation').onmouseout = function () {
      return Game.hideTooltip();
    };

    Game.rebuildInventory = 0;
    // s('.level').innerHTML = lvlStr
  };

  Game.unlockUpgrade = function (upgradeName) {
    var upgrade = '';
    for (var i in Game.upgrades) {
      if (upgradeName == Game.upgrades[i].name) upgrade = Game.upgrades[i];
    }

    if (upgrade) {
      if (upgrade.owned == 0 && upgrade.hidden == 1) {
        upgrade.hidden = 0;
        Game.rebuildStore = 1;
      }
    }
  };

  Game.buyFunction = function (item) {
    // UNLOCK NEXT BUILDING IF THERE IS ONE
    if (item.type == 'building') {
      for (var i = 0; i < Game.buildings.length; i++) {
        if (Game.buildings[i].name == item.name) {
          if (Game.buildings[i + 1]) {
            if (Game.buildings[i + 1].hidden == 1 || Game.buildings[i + 1].hidden == 3) {
              Game.buildings[i + 1].hidden = 0;
            }
          }
          if (Game.buildings[i + 2]) {
            if (Game.buildings[i + 2].hidden == 2) {
              Game.buildings[i + 2].hidden = 1;
            }
          }
          if (Game.buildings[i + 3]) {
            if (Game.buildings[i + 3].hidden == 2) {
              Game.buildings[i + 3].hidden = 1;
            }
          }
        }
      }
    }

    if (item.buyFunctions) {
      if (item.buyFunctions.unlockUpgrades) {
        for (var _i4 in item.buyFunctions.unlockUpgrades) {
          if (item.owned == item.buyFunctions.unlockUpgrades[_i4].amountNeeded) {
            Game.unlockUpgrade(item.buyFunctions.unlockUpgrades[_i4].name);
          }
        }
      }
      if (item.buyFunctions.addTextScroller) {
        for (var _i5 in item.buyFunctions.addTextScroller) {
          if (item.owned == item.buyFunctions.addTextScroller[_i5].amountNeeded) {
            Game.textScroller.push(item.buyFunctions.addTextScroller[_i5].text);
          }
        }
      }
      if (item.buyFunctions.increaseProduction) {
        Game.select(Game.buildings, item.buyFunctions.increaseProduction.building).production *= item.buyFunctions.increaseProduction.multi;
      }
      if (item.buyFunctions.multipliers) {
        for (var _i6 in item.buyFunctions.multipliers) {
          if (item.buyFunctions.multipliers[_i6].type == 'ops') Game.state.opsMulti += item.buyFunctions.multipliers[_i6].amount;
          if (item.buyFunctions.multipliers[_i6].type == 'opc') Game.state.opcMulti += item.buyFunctions.multipliers[_i6].amount;
        }
      }
      if (item.buyFunctions.achievements) {
        for (var _i7 in item.buyFunctions.achievements) {
          if (item.owned >= item.buyFunctions.achievements[_i7].amountNeeded) {
            Game.winAchievement(item.buyFunctions.achievements[_i7].name);
          }
        }
      }
    }

    if (item.name == 'Magnifying Glass') {
      Game.repositionAllElements = 1;
    }

    // UPGRADES
    if (item.name == 'Clean Magnifying Glass') {
      Game.state.weakHitMulti += 5;
    }
    if (item.name == 'Polish Magnifying Glass') {
      Game.state.weakHitMulti += 5;
    }

    Game.recalculateOpC = 1;
    Game.recalculateOpS = 1;
  };

  var soundPlayed1 = false;
  var soundPlayed2 = false;
  var soundPlayed3 = false;
  var soundPlayed4 = false;
  var soundPlayed5 = false;
  var whichPic = Math.floor(Math.random() * 4) + 1;
  Game.updatePercentage = function (amount) {
    var oreHpPercentage = Game.state.oreCurrentHp / Game.state.oreHp * 100;
    if (Game.state.oreCurrentHp - amount > 0) {
      Game.state.oreCurrentHp -= amount;
      if (oreHpPercentage > 80) {
        s('.ore').style.background = 'url("./assets/ore' + whichPic + '-1.png")';
        s('.ore').style.backgroundSize = 'cover';
      }
      if (oreHpPercentage <= 80 && soundPlayed1 == false) {
        s('.ore').style.background = 'url("assets/ore' + whichPic + '-2.png")';
        s('.ore').style.backgroundSize = 'cover';
        Game.playSound('explosion');
        soundPlayed1 = true;
      }
      if (oreHpPercentage <= 60 && soundPlayed2 == false) {
        s('.ore').style.background = 'url("assets/ore' + whichPic + '-3.png")';
        s('.ore').style.backgroundSize = 'cover';
        Game.playSound('explosion');
        soundPlayed2 = true;
      }
      if (oreHpPercentage <= 40 && soundPlayed3 == false) {
        s('.ore').style.background = 'url("assets/ore' + whichPic + '-4.png")';
        s('.ore').style.backgroundSize = 'cover';
        Game.playSound('explosion');
        soundPlayed3 = true;
      }
      if (oreHpPercentage <= 20 && soundPlayed4 == false) {
        s('.ore').style.background = 'url("assets/ore' + whichPic + '-5.png")';
        s('.ore').style.backgroundSize = 'cover';
        Game.playSound('explosion');
        soundPlayed4 = true;
      }
    } else {
      Game.state.stats.rocksDestroyed++;
      Game.dropItem();
      // Game.gainXp(10)
      Game.playSound('explosion2');
      Game.state.oreHp = Math.pow(Game.state.oreHp, 1.09);
      Game.state.oreCurrentHp = Game.state.oreHp;

      if (Game.state.stats.rocksDestroyed == 1) {
        Game.winAchievement('Newbie Miner');Game.textScroller.push('[Breaking News] Rocks are breaking!');
      }
      if (Game.state.stats.rocksDestroyed == 10) {
        Game.winAchievement('Novice Miner');Game.textScroller.push('What happens in Ore Town stays in Ore Town');
      }
      if (Game.state.stats.rocksDestroyed == 25) {
        Game.winAchievement('Intermediate Miner');Game.textScroller.push('[Breaking News] The cries of baby rocks can be heard from miles away as their parents get obliterated by this new miner');
      }
      if (Game.state.stats.rocksDestroyed == 50) Game.winAchievement('Advanced Miner');

      soundPlayed1 = false;
      soundPlayed2 = false;
      soundPlayed3 = false;
      soundPlayed4 = false;
      soundPlayed5 = false;
      whichPic = Math.floor(Math.random() * 4) + 1;
      s('.ore').style.background = 'url("./assets/ore' + whichPic + '-1.png")';
      s('.ore').style.backgroundSize = 'cover';
      s('.ore-hp').innerHTML = '100%';
    }
    s('.ore-hp').innerHTML = oreHpPercentage.toFixed(0) + '%';
  };

  Game.showTooltip = function (obj) {
    var tooltip = s('.tooltip');

    var anchor = s('#main-separator').getBoundingClientRect();

    tooltip.classList.add('tooltip-container');
    tooltip.style.display = 'block';

    tooltip.style.left = anchor.left - tooltip.getBoundingClientRect().width + 'px';
    tooltip.style.top = event.clientY + 'px';

    if (obj.type == 'buildings' || obj.type == 'upgrades') {
      tooltip.style.textAlign = 'left';
      tooltip.style.width = '300px';

      var selectedItem = Game.select(Game[obj.type], obj.name);
      tooltip.innerHTML = '\n        <div class="tooltip-top">\n          <img src="./assets/' + selectedItem.pic + '" height=\'40px\' alt="" />\n          <h3 style=\'flex-grow: 1\'>' + selectedItem.name + '</h3>\n          <p>' + beautify(selectedItem.price) + ' ores</p>\n        </div>\n        <div class="tooltip-bottom">\n          <hr />\n          <p>' + selectedItem.desc + '</p>\n          ';
      if (selectedItem.type == 'building') {
        if (selectedItem.owned > 0 && selectedItem.owned < 2) {
          tooltip.innerHTML += '\n                <hr />\n                <p>Each ' + selectedItem.name + ' generates ' + beautify(selectedItem.production) + ' OpS</p>\n                <p><span class=\'bold\'>' + selectedItem.owned + '</span> ' + selectedItem.name + ' generating <span class=\'bold\'>' + beautify(selectedItem.production * selectedItem.owned) + '</span> ores per second</p>\n              ';
        } else {
          tooltip.innerHTML += '\n                <hr />\n                <p>Each ' + selectedItem.name + ' generates ' + beautify(selectedItem.production) + ' OpS</p>\n                <p><span class=\'bold\'>' + selectedItem.owned + '</span> ' + selectedItem.namePlural + ' generating <span class=\'bold\'>' + beautify(selectedItem.production * selectedItem.owned) + '</span> ores per second</p>\n              ';
        }
      }
      tooltip.innerHTML += '\n          <hr/>\n          <p style=\'font-size: small; opacity: .6; float: right; padding-top: 5px;\'><i>' + selectedItem.fillerQuote + '</i></p>\n\n        </div>\n      ';
    }

    if (obj.type == 'generation') {
      tooltip.style.textAlign = 'center';
      tooltip.style.width = 'auto';
      tooltip.style.left = event.clientX - tooltip.getBoundingClientRect().width / 2 + 'px';
      tooltip.style.top = event.clientY + 20 + 'px';
      tooltip.style.minWidth = '150px';
      tooltip.innerHTML = '\n        <h3>You are currently on Generation ' + Game.state.player.generation.lv + '</h3>\n        <hr/>\n        <p style=\'opacity: .4; font-size: smaller\'>Generation XP: ' + beautify(Math.floor(Game.state.player.generation.currentXp)) + '/' + beautify(Math.floor(Game.state.player.generation.xpNeeded)) + '</p>\n        <hr/>\n        <p>You will gain ' + beautify(Game.calculateGenerationXp().xp) + 'xp on refine </p>\n      ';
    }

    if (obj.type == 'skill') {
      var selectedSkill = Game.select(Game.skills, obj.name);
      tooltip.style.textAlign = 'left';
      tooltip.style.width = 'auto';
      tooltip.style.maxWidth = '400px';

      if (!selectedSkill.locked) {
        tooltip.innerHTML = '\n          <div style=\'display: flex; flex-flow: row nowrap;\'>\n            <div style=\'background: url("./assets/' + selectedSkill.pic + '.png"); min-height: 64px; height: 64px; min-width: 64px; width: 64px; margin-right: 5px;\'></div>\n            <hr style=\'width: 1px; flex-grow: 1; margin-right: 5px; opacity: 0.1\'/>\n            <div style=\'flex-grow: 1\'>\n              <h2 style=\'font-family: "Germania One"\'>' + selectedSkill.name + '</h2>\n              <hr />\n              <p style=\'font-size: small\'><i style=\'opacity: .5\'>' + selectedSkill.fillerTxt + '</i></p>\n              <hr />\n              <p>Current Level: ' + selectedSkill.lvl + '/' + selectedSkill.maxLvl + '</p>\n              <p>Skill Type: ' + selectedSkill.type + '</p>\n              <hr />\n              <p>' + selectedSkill.desc + '</p>\n            </div>\n          </div>\n        ';
      } else {
        var str = '';
        str += '\n          <div style=\'display: flex; flex-flow: row nowrap;\'>\n            <div style=\'background: url("./assets/' + selectedSkill.pic + '.png"); min-height: 64px; height: 64px; min-width: 64px; width: 64px; margin-right: 5px; opacity: 0.2;\'></div>\n            <hr style=\'width: 1px; flex-grow: 1; margin-right: 5px; opacity: 0.1\'/>\n            <div style=\'flex-grow: 1\'>\n              <h2 style=\'font-family: "Germania One"\'>' + selectedSkill.name + '</h2>\n              <hr />\n              <p>Requirements</p>\n              <hr />\n              ';

        // Build out generation requirements
        if (Game.state.player.generation.lv >= selectedSkill.generationReq) {
          str += '<p>Generation Level: ' + selectedSkill.generationReq + '</p>';
        } else {
          str += '<p style=\'color: red\'>Generation Level: ' + selectedSkill.generationReq + '</p>';
        }

        // Build out skill requirements
        for (var i in selectedSkill.requires) {
          var skillNeeded = Game.select(Game.skills, selectedSkill.requires[i][0]);
          if (skillNeeded.lvl >= selectedSkill.requires[i][1]) {
            str += '<p>' + selectedSkill.requires[i][0] + ' lv. ' + selectedSkill.requires[i][1] + '</p>';
          } else {
            str += '<p style=\'color: red;\'>' + selectedSkill.requires[i][0] + ' lv. ' + selectedSkill.requires[i][1] + '</p>';
          }
        }

        str += '\n            </div>\n          </div>\n        ';

        tooltip.innerHTML = str;
      }

      tooltip.style.left = event.clientX + 30 + 'px';
      tooltip.style.top = event.clientY - tooltip.getBoundingClientRect().height / 2 + 'px';
    }

    if (obj.type == 'quest') {
      tooltip.style.left = s('.quest-btn').getBoundingClientRect().right + 20 + 'px';
      tooltip.style.top = s('.quest-btn').getBoundingClientRect().top + 'px';

      if (Game.state.stats.timesRefined == 0) {
        tooltip.innerHTML = '<p>Quests unlocked at Generation 1</p>';
        tooltip.style.width = 'auto';
      } else {
        tooltip.innerHTML = '<p>Quests available</p>';
        tooltip.style.width = 'auto';
      }
    }

    if (obj.type == 'achievement') {
      var _str = void 0;
      var selectedAchievement = Game.select(Game.achievements, obj.achievementName);

      tooltip.style.left = event.clientX + 20 + 'px';
      tooltip.style.top = event.clientY + 20 + 'px';
      tooltip.style.textAlign = 'left';

      if (obj.missing) {
        _str = '\n          <h2>' + selectedAchievement.name + '</h2>\n          <hr/>\n          <p>???</p>\n        ';
      } else {
        _str = '\n          <h2>' + selectedAchievement.name + '</h2>\n          <hr/>\n          <p>' + selectedAchievement.desc + '</p>\n        ';

        if (selectedAchievement.reward) {
          _str += '<hr/><p style=\'color: lime\'>Bonus: ' + selectedAchievement.reward.txt + '</p>';
        }
      }

      tooltip.innerHTML = _str;
    }

    tooltip.style.animation = 'tooltip .3s';
  };

  Game.hideTooltip = function () {
    s('.tooltip').style.display = 'none';
    //
  };

  Game.showSettings = function () {
    var div = document.createElement('div');
    var str = void 0;
    div.classList.add('wrapper');

    str += '\n      <div class="setting-container">\n        <h1 style=\'font-family: "Germania One"; font-size: 4em; text-align: center;\'>Settings</h1>\n        <i class=\'fa fa-times fa-1x\' onclick=\'Game.removeEl(document.querySelector(".wrapper"))\'></i>\n        <hr/>\n        <h2 style=\'text-align: left;\'>Sound</h2>\n        <hr/>\n        <div class="single-setting">\n          <p style=\'padding-right: 10px;\'>Volume: </p>\n          <input class=\'volume-slider\' type="range" min=0 max=1 step=0.1 list=\'tickmarks\' onchange=\'Game.state.prefs.volume = document.querySelector(".volume-slider").value\'/>\n          <datalist id="tickmarks">\n            <option value="0" label="0%">\n            <option value="0.1">\n            <option value="0.1">\n            <option value="0.2">\n            <option value="0.3">\n            <option value="0.4">\n            <option value="0.5" label="50%">\n            <option value="0.6">\n            <option value="0.7">\n            <option value="0.8">\n            <option value="0.9">\n            <option value=\'1.0\' label="100%">\n          </datalist>\n        </div>\n        <div class="single-setting">\n          <p style=\'padding-right: 20px;\'>BGM: </p>\n          <input type="radio" name=\'bgm\' id=\'bgmOn\' value=\'true\' onchange=\'Game.state.prefs.bgm = 1; Game.toggleBgm();\'/>\n            <label for="bgmOn" style=\'margin-right: 10px\'>On</label>\n          <input type="radio" name=\'bgm\' id=\'bgmOff\' value=\'false\' onchange=\'Game.state.prefs.bgm = 0; Game.toggleBgm();\'/>\n            <label for="bgmOff" style=\'margin-right: 10px\'>Off</label>\n        </div>\n        <br/>\n        <hr/>\n        <h2 style=\'text-align: left;\'>Video</h2>\n        <hr/>\n        <div class="single-setting">\n          <p style=\'padding-right: 20px;\'>Enable Rock Particles:</p>\n          <input type="radio" name=\'rockParticles\' id=\'rockParticlesOn\' value=\'true\' onchange=\'Game.state.prefs.rockParticles = true\'/>\n            <label for="rockParticlesOn" style=\'margin-right: 10px\'>On</label>\n          <input type="radio" name=\'rockParticles\' id=\'rockParticlesOff\' value=\'false\' onchange=\'Game.state.prefs.rockParticles = false\' />\n            <label for="rockParticlesOff">Off</label>\n        </div>\n        <div class="single-setting">\n          <p style=\'padding-right: 20px;\'>Enable Rising Numbers:</p>\n          <input type="radio" name=\'risingNumbers\' id=\'risingNumbersOn\' value=\'true\' onchange=\'Game.state.prefs.risingNumbers = true\'/>\n            <label for="risingNumbersOn" style=\'margin-right: 10px\'>On</label>\n          <input type="radio" name=\'risingNumbers\' id=\'risingNumbersOff\' value=\'false\' onchange=\'Game.state.prefs.risingNumbers = false\' />\n            <label for="risingNumbersOff">Off</label>\n        </div>\n        <br/>\n        <hr/>\n        <h2 style=\'text-align: left;\'>Miscellaneous</h2>\n        <hr/>\n        <div class="single-setting">\n          <p style=\'padding-right: 20px;\'>Enable Scrolling Text:</p>\n          <input type="radio" name=\'scrollingText\' id=\'scrollingTextOn\' value=\'true\' onchange=\'Game.state.prefs.scrollingText = true\'/>\n            <label for="scrollingTextOn" style=\'margin-right: 10px\'>On</label>\n          <input type="radio" name=\'scrollingText\' id=\'scrollingTextOff\' value=\'false\' onchange=\'Game.state.prefs.scrollingText = false\' />\n            <label for="scrollingTextOff">Off</label>\n        </div>\n        <br/>\n        <p>Saves (work-in-progress)</p>\n        <button class=\'saves-btn\' onclick=\'Game.export()\'>Export Save</button> <button onclick=\'Game.import()\' class=\'saves-btn\'>Import Save</button>\n      </div>\n\n    ';
    div.innerHTML = str;

    s('body').append(div);
    s('.volume-slider').value = Game.state.prefs.volume;

    Game.state.prefs.bgm == true ? s('#bgmOn').checked = true : s('#bgmOff').checked = true;
    Game.state.prefs.rockParticles == true ? s('#rockParticlesOn').checked = true : s('#rockParticlesOff').checked = true;
    Game.state.prefs.risingNumbers == true ? s('#risingNumbersOn').checked = true : s('#risingNumbersOff').checked = true;
    Game.state.prefs.scrollingText == true ? s('#scrollingTextOn').checked = true : s('#scrollingTextOff').checked = true;
  };

  Game.showStatistics = function () {
    var div = document.createElement('div');
    var str = void 0;
    var achievementsWon = 0;
    var achievementsMissing = 0;
    div.classList.add('wrapper');

    str += '\n      <div class="statistics-container">\n        <h1 style=\'font-family: "Germania One"; font-size: 4em;\'>Statistics</h1>\n        <i class=\'fa fa-times fa-1x\' onclick=\'Game.removeEl(document.querySelector(".wrapper"))\'></i>\n        <hr/>\n        <p><span style=\'opacity: .6\'>Ores Earned:</span> <strong>' + beautify(Math.round(Game.state.stats.currentOresEarned)) + '</strong></p>\n        <p><span style=\'opacity: .6\'>Ores Mined (By Clicks):</span> <strong>' + beautify(Math.round(Game.state.stats.currentOresMined)) + '</strong></p>\n        <p><span style=\'opacity: .6\'>Current Ore Clicks:</span> <strong>' + Game.state.stats.currentOreClicks + '</strong></p>\n        <p><span style=\'opacity: .6\'>Current Weak Spot Hits:</span> <strong>' + Game.state.stats.currentWeakSpotHits + '</strong></p>\n        <p><span style=\'opacity: .6\'>Crit Hits:</span> <strong>' + Game.state.stats.critHits + '</strong></p>\n        <p><span style=\'opacity: .6\'>Mega Hits: (Crit & Weak Spot Hit):</span> <strong>' + Game.state.stats.megaHits + '</strong></p>\n        <p><span style=\'opacity: .6\'>Highest Weak Spot Combo:</span> <strong>' + Game.state.stats.highestCombo + '</strong></p>\n        <p><span style=\'opacity: .6\'>Ores Spent:</span> <strong>' + beautify(Math.round(Game.state.stats.totalOresSpent)) + '</strong></p>\n        <p><span style=\'opacity: .6\'>Rocks Destroyed:</span> <strong>' + Game.state.stats.rocksDestroyed + '</strong></p>\n        <p><span style=\'opacity: .6\'>Items Picked Up:</span> <strong>' + Game.state.stats.itemsPickedUp + '</strong></p>\n        <p><span style=\'opacity: .6\'>Refine Amount:</span> <strong>' + Game.state.stats.timesRefined + '</strong></p>\n        <p><span style=\'opacity: .6\'>Time Played:</span> <strong>' + beautifyTime(Game.state.stats.timePlayed) + '</strong></p>\n      </div>\n    ';

    div.innerHTML = str;

    s('body').append(div);
  };

  Game.showAchievements = function () {
    var div = document.createElement('div');
    div.classList.add('wrapper');

    var str = '\n      <div class="achievements-container">\n        <h1>Achievements</h1>\n        <i class=\'fa fa-times fa-1x\' onclick=\'Game.removeEl(document.querySelector(".wrapper"))\'></i>\n        <p>Achievements Won:</p>\n        <div class="won-achievements">\n        ';
    for (var i = 0; i < Game.achievements.length; i++) {
      if (Game.achievements[i].won == 1) {
        str += '<div onmouseover=\'Game.showTooltip({type: "achievement", achievementName: "' + Game.achievements[i].name + '"})\' onmouseout=\'Game.hideTooltip()\' class="single-achievement"></div>';
      }
    }

    str += '\n        </div>\n        <br/>\n        <p>Achievements Missing:</p>\n        <div class="missing-achievements">\n        ';
    for (var _i8 = 0; _i8 < Game.achievements.length; _i8++) {
      if (Game.achievements[_i8].won == 0) {
        str += '<div onmouseover=\'Game.showTooltip({type: "achievement", missing: 1, achievementName: "' + Game.achievements[_i8].name + '"})\' onmouseout=\'Game.hideTooltip()\' style=\'opacity: 0.3\' class="single-achievement"></div>';
      }
    }

    str += '</div>\n      </div>\n\n    ';

    div.innerHTML = str;
    s('body').append(div);
  };

  Game.toggleInventory = function () {
    var anchor = s('#left-separator').getBoundingClientRect();
    Game.state.prefs.inventoryOpen = !Game.state.prefs.inventoryOpen;
    if (Game.state.prefs.inventoryOpen) {
      // inventory open
      s('.inventory-container').style.left = anchor.right + 'px';
      s('.inventory-container__right').classList.add('inventory-container--open');
    } else {
      s('.inventory-container').style.left = anchor.right - s('.inventory-container').getBoundingClientRect().width + s('.inventory-container__right').getBoundingClientRect().width + 'px';
      s('.inventory-container__right').classList.remove('inventory-container--open');
    }
  };

  Game.randomBonus = function (special) {
    if (Math.random() <= .3) {
      // 30% chance of this happening
      console.log('bonus!');
      var randomID = Math.floor(Math.random() * 1000000) + 1;
      var chance = Math.random();
      var bonus = document.createElement('div');
      bonus.id = 'bonus-' + randomID;
      bonus.classList.add('bonus');
      // 60% chance of happening
      if (chance >= 0 && chance <= .6) {
        bonus.onclick = function () {
          Game.selectedBonus(1);bonus.parentNode.removeChild(bonus);
        };
        // 25% chance of happening
      } else if (chance > .6 && chance <= .85) {
        bonus.onclick = function () {
          Game.selectedBonus(2);bonus.parentNode.removeChild(bonus);
        };
        // 10% chance of happening
      } else if (chance > .85 && chance <= .95) {
        bonus.onclick = function () {
          Game.selectedBonus(3);bonus.parentNode.removeChild(bonus);
        };
        // 5% chance
      } else {
        bonus.onclick = function () {
          Game.selectedBonus(4);bonus.parentNode.removeChild(bonus);
        };
      }

      var randomX = Math.random() * window.innerWidth;
      var randomY = Math.random() * window.innerHeight;

      bonus.style.left = randomX + 'px';
      bonus.style.top = randomY + 'px';

      s('body').append(bonus);

      setTimeout(function () {
        var b = s('#bonus-' + randomID);
        if (b) {
          bonus.classList.add('fadeOut');
          setTimeout(function () {
            if (b) {
              b.parentNode.removeChild(b);
            }
          }, 2000);
        }
      }, 8 * 1000);
    }
  };

  Game.selectedBonus = function (bonusNum) {
    Game.playSound('ding');
    if (bonusNum == 1) {
      var amount = Game.state.oresPerSecond * 13 + Game.state.oresPerClick * 13;
      Game.earn(amount);
      Game.risingNumber(amount, 'bonus', event);
    }

    if (bonusNum == 2 || bonusNum == 3 || bonusNum == 4) {
      var cover = document.createElement('div');
      cover.classList.add('gold-rush-cover');
      s('body').append(cover);
      var _amount = Game.state.oresPerSecond * 11 + Game.state.oresPerClick * 11;
      Game.risingNumber(_amount, 'gold rush', event);
      Game.goldRush();
      setTimeout(function () {
        s('.gold-rush-cover').parentNode.removeChild(s('.gold-rush-cover'));
      }, 15 * 1000);
    }

    // if (bonusNum == 3) {
    //   let cover = document.createElement('div')
    //   conver.classList.add('fury-cover')
    //   s('body').append(cover)
    //   setTimeout(() => {
    //     s('.fury-cover').parentNode.removeChild(s('.fury-cover'))
    //   }, 7 * 1000)
    // }
  };

  var goldRushCounter = 0;
  Game.goldRush = function () {

    setTimeout(function () {
      if (goldRushCounter < 20) {
        goldRushCounter++;
        var bonus = document.createElement('div');
        var randomID = Math.floor(Math.random() * 100000000) + 1;
        bonus.id = 'bonus-' + randomID;
        bonus.classList.add('gold-rush-bonus');
        var randomX = Math.random() * window.innerWidth;
        bonus.style.left = randomX + 'px';
        s('body').append(bonus);
        bonus.onclick = function () {
          Game.selectedBonus(1);Game.removeEl(bonus);
        };

        setTimeout(function () {
          if (s('#bonus-' + randomID)) {
            Game.removeEl(s('#bonus-' + randomID));
          }
        }, 5000); // TIME IT TAKES FOR ANIMATION TO FALL OFF SCREEN
        Game.goldRush();
      } else {
        goldRushCounter = 0;
      }
    }, 500);
  };

  Game.removeEl = function (el) {
    try {
      el.parentNode.removeChild(el);
    } catch (err) {
      //
    }
  };

  Game.confirmRefine = function () {

    if (s('#refine-tut')) Game.removeEl(s('#refine-tut'));

    var div = document.createElement('div');

    var amountOfGems = 0;
    if (Game.state.ores >= 1000000) amountOfGems += 1;
    if (Game.state.ores >= 1000000000) amountOfGems += 1;
    if (Game.state.ores >= 1000000000000) amountOfGems += 1;
    if (Game.state.ores >= 1000000000000000) amountOfGems += 1;
    if (Game.state.ores >= 1000000000000000000) amountOfGems += 1;

    div.classList.add('wrapper');
    div.id = 'confirm-refine';
    var str = '\n      <div class="confirm-refine">\n        <h2 style=\'text-align: center; font-family: "Germania One"; letter-spacing: 1px\'>Refine</h2>\n        <i class=\'fa fa-times fa-1x\' onclick=\'Game.removeEl(document.querySelector("#confirm-refine"))\'></i>\n        <hr/>\n        <p style=\'text-align: left; color: lightgreen;\'>+ You will gain <strong>' + amountOfGems + '</strong> gems (more ores = more gems)</p>\n        <p style=\'text-align: left; color: lightgreen;\'>+ You will gain <strong>' + Game.calculateGenerationXp().xp + '</strong> generation xp</p>\n        <p style=\'text-align: left; color: #c36d6d;\'>- You will lose all current ores</p>\n        <p style=\'text-align: left; color: #c36d6d;\'>- You will lose all owned buildings and upgrades</p>\n        <p style=\'text-align: left; color: #c36d6d;\'>- You will lose your current pickaxe</p>\n        <hr/>\n        <p style=\'text-align: center;\'>Are you sure you want to refine?</p>\n        <hr />\n        <button onclick=\'Game.refine(' + amountOfGems + ')\'>yes</button>\n        <button onclick=\'Game.removeEl(document.querySelector("#confirm-refine"))\'>no</button>\n      </div>\n    ';
    div.innerHTML = str;

    s('body').append(div);
  };

  Game.refine = function (amount) {
    Game.playSound('smithsfx');
    Game.state.stats.timesRefined++;
    var div = document.createElement('div');
    div.classList.add('refine');
    s('body').append(div);

    Game.state.gems += amount;

    setTimeout(function () {
      Game.gainGenerationXp();
      Game.softReset();
      Game.rebuildInventory = 1;
      Game.removeEl(s('.wrapper'));
      Game.unlockSkills();
    }, 1500);
    setTimeout(function () {
      Game.showSkillTree();
      var items = document.querySelectorAll('.item-container');
      if (items) {
        items.forEach(function (item) {
          item.parentNode.removeChild(item);
        });
      }
    }, 2000);
    setTimeout(function () {
      Game.removeEl(s('.refine'));
      if (Game.state.stats.timesRefined > 0) Game.winAchievement('Blacksmiths Apprentice');
      Game.repositionAllElements = 1;
    }, 3000);

    s('.ore-weak-spot').style.display = 'none';
  };

  Game.unlockSkills = function () {
    var lockedSkills = Game.skills.filter(function (skill) {
      return skill.locked == 1;
    });

    for (var i in lockedSkills) {
      var selectedSkill = Game.select(Game.skills, lockedSkills[i].name);
      var selectedEl = document.querySelector('.skill-' + lockedSkills[i].className);
      if (lockedSkills[i].requires) {
        for (var j in lockedSkills[i].requires) {
          var req = {
            skill: Game.select(Game.skills, lockedSkills[i].requires[j][0]),
            lvl: lockedSkills[i].requires[j][1]
          };

          if (Game.state.player.generation.lv >= lockedSkills[i].generationReq) {
            if (req.skill) {
              if (req.skill.lvl >= req.lvl) {
                lockedSkills[i].locked = 0;
                selectedEl.style.opacity = 1;
                Game.drawLines();
              }
            }
          }
        }
      } else {
        if (Game.state.player.generation.lv >= lockedSkills[i].generationReq) {
          lockedSkills[i].locked = 0;
          if (selectedEl != null) {
            selectedEl.style.opacity = 1;
            Game.drawLines();
          }
        }
      }
    }
  };

  Game.buildSkillTree = function (section) {

    var highestGen = Game.skills.reduce(function (prev, current) {
      return prev.generationReq > current.generationReq ? prev : current;
    }).generationReq;
    var spacerNeeded = true;

    var str = '\n      <div id=\'skill-tree-' + section + '\' class="skill-tree">\n    ';

    for (var i = 0; i <= highestGen; i++) {
      str += '<div class="column">';

      // check is a spacer is needed
      for (var j in Game.skills) {
        if (Game.skills[j].section == section) {
          if (Game.skills[j].generationReq == i) spacerNeeded = false;
        }
      }

      if (!spacerNeeded) {
        for (var k in Game.skills) {
          if (Game.skills[k].generationReq == i && Game.skills[k].section == section) {
            if (!Game.skills[k].locked) {
              str += '<div style=\'background: url("./assets/' + Game.skills[k].pic + '.png")\' class="skill skill-' + Game.skills[k].className + '" onclick="Game.skills[' + k + '].levelUp()" onmouseover=\'Game.showTooltip({type: "skill", name: "' + Game.skills[k].name + '"}, event)\' onmouseout=\'Game.hideTooltip()\'></div>';
            } else {
              str += '<div style="opacity: .2; background: url(\'./assets/' + Game.skills[k].pic + '.png\')" class="skill skill-' + Game.skills[k].className + '" onclick=\'Game.skills[' + k + '].levelUp()\' onmouseover=\'Game.showTooltip({type: "skill", name: "' + Game.skills[k].name + '"}, event)\' onmouseout=\'Game.hideTooltip()\'></div>';
            }
          }
        }
      } else {
        str += '<div class="skill-spacer"></div>';
      }

      spacerNeeded = true;

      str += '</div>'; // column closing div
    }

    // str += `<div class='skill-tree-${section}-bg skill-tree-bg' style='width: ${sectionBgWidth}px;'></div></div>` // skill tree closing div
    str += '</div>'; // skill tree closing div

    return str;
  };

  Game.showSkillTree = function () {
    var div = s('.skill-tree-container');
    div.style.display = 'flex';

    var str = '\n      <div id="particles-js"></div>\n      <canvas class="skill-lines"></canvas>\n      <div class="skill-tree-container-top">\n        <h1 style=\'font-size: 6rem; font-family: "Germania One"\'>Generation: ' + Game.state.player.generation.lv + '</h1>\n        <h4 class=\'available-sp\'>Available Sp: ' + Game.state.player.generation.availableSp + '</h4>\n        <button onclick=\'document.querySelector(".skill-tree-container").style.display="none"; window.pJSDom = []; Game.tutorialQuest(); Game.drawQuestBtn()\'>Go back</button>\n      </div>\n\n      <div class="skill-tree-container-bottom">\n        <div class="skill-trees">\n        ';
    str += Game.buildSkillTree(1);
    str += Game.buildSkillTree(2);
    str += Game.buildSkillTree(3);

    str += '\n        </div>\n      </div>\n    ';

    div.innerHTML = str;

    Game.drawLines();

    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 250,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 2,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 20,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "grab"
          },
          "onclick": {
            "enable": false,
            "mode": "push"
          },
          "resize": false
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  };

  Game.drawLines = function () {
    var canvas = s('.skill-lines');
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;

    // reset canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var i in Game.skills) {
      var skill = Game.skills[i];

      if (skill.drawLines) {

        if (skill.locked) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        } else {
          ctx.strokeStyle = 'white';
        }

        if (skill.lvl == 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        }

        for (var j in skill.drawLines) {

          if (skill.drawLines[j].from == 'top') {
            var fromPos = {
              x: s('.skill-' + skill.className).getBoundingClientRect().x + 32,
              y: s('.skill-' + skill.className).getBoundingClientRect().y
            };

            var toSkill = Game.select(Game.skills, '' + skill.drawLines[j].to);
            var toPos = {
              x: s('.skill-' + toSkill.className).getBoundingClientRect().x - 32,
              y: s('.skill-' + toSkill.className).getBoundingClientRect().y + 32
            };

            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(toPos.x, toPos.y);
            ctx.lineTo(toPos.x + 32, toPos.y);
            ctx.stroke();
            ctx.closePath();
          }

          if (skill.drawLines[j].from == 'bottom') {
            var _fromPos = {
              x: s('.skill-' + skill.className).getBoundingClientRect().x + 32,
              y: s('.skill-' + skill.className).getBoundingClientRect().bottom
            };
            var _toSkill = Game.select(Game.skills, '' + skill.drawLines[j].to);
            var _toPos = {
              x: s('.skill-' + _toSkill.className).getBoundingClientRect().x - 32,
              y: s('.skill-' + _toSkill.className).getBoundingClientRect().y + 32
            };
            ctx.beginPath();
            ctx.moveTo(_fromPos.x, _fromPos.y);
            ctx.lineTo(_toPos.x, _toPos.y);
            ctx.lineTo(_toPos.x + 32, _toPos.y);
            ctx.stroke();
            ctx.closePath();
          }

          if (skill.drawLines[j].from == 'right') {
            var _fromPos2 = {
              x: s('.skill-' + skill.className).getBoundingClientRect().right,
              y: s('.skill-' + skill.className).getBoundingClientRect().y + 32
            };
            var _toSkill2 = Game.select(Game.skills, '' + skill.drawLines[j].to);
            var _toPos2 = {
              x: s('.skill-' + _toSkill2.className).getBoundingClientRect().left,
              y: s('.skill-' + _toSkill2.className).getBoundingClientRect().y + 32
            };
            ctx.beginPath();
            ctx.moveTo(_fromPos2.x, _fromPos2.y);
            ctx.lineTo(_fromPos2.x + 32, _fromPos2.y);
            ctx.lineTo(_fromPos2.x + 64, _toPos2.y);
            // ctx.lineTo(toPos.x - 32, toPos.y)
            ctx.lineTo(_toPos2.x, _toPos2.y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }

    s('.skill-tree-container-bottom').onscroll = function () {
      return Game.drawLines();
    };
  };

  Game.softReset = function () {
    Game.state.ores = 0;
    Game.state.oreHp = 50;
    Game.state.oreCurrentHp = 50;
    Game.state.oresPerSecond = 0;
    Game.state.opsMultiplier = 0;
    Game.state.opcMulti = 0;
    Game.state.weakHitMultiplier = 5;
    Game.state.player.pickaxe = {
      name: 'Beginners Wood Pickaxe',
      rarity: 'Common',
      iLv: 1,
      material: 'Wood',
      damage: 1
    };

    Game.state.stats.rocksDestroyed = 0;
    Game.state.stats.currentOreClicks = 0;
    Game.state.stats.currentOresEarned = 0;
    Game.state.stats.currentOresMined = 0;
    Game.state.stats.currentWeakSpotHits = 0;

    Game.rebuildStore = 1;
    Game.recalculateOpC = 1;
    Game.recalculateOpS = 1;

    Game.resetItems();
  };

  Game.uniqueTrinkets = [{
    name: 'Tome of Higher Learning',
    desc: 'Doubles xp gain per click',
    rarity: 'Mythic',
    img: 'wip.png',
    price: 15,
    owned: 0
  }, {
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
  }];

  Game.generateRefinedStoreItems = function () {
    Game.state.currentRefinedStoreItems = [];
    // % of unique trinket
    var uniqueChance = .1;
    var suffixChance = .3;
    var prefixChance = .5;
    var cost = 1;
    var amountOfStats = 1;
    var iLvl = Math.floor(Math.random() * Game.state.stats.timesRefined) + 1;
    var multi = 0;
    var unique = true;

    // GENERATE 4 ITEMS
    while (Game.state.currentRefinedStoreItems.length < 4) {
      var randomUnique = Game.uniqueTrinkets[Math.floor(Math.random() * Game.uniqueTrinkets.length)];
      Game.state.currentRefinedStoreItems.push(randomUnique);
    }
  };

  Game.generateRefinedStoreItems();

  Game.selectedRefineTab = 'trinkets';
  Game.showRefinedStore = function () {
    var div = document.createElement('div');
    div.classList.add('wrapper');
    var str = '';

    var items = Game.state.currentRefinedStoreItems;

    str += '\n        <div class="refined-store-container">\n          <div class="refined-store-top">\n            <i class=\'fa fa-times fa-1x\' onclick=\'Game.removeEl(document.querySelector(".wrapper"))\'></i>\n            <h1 style=\'flex-grow: 1; text-align: center; font-family: "Germania One"\'>Refined Store</h1>\n            <h3 style=\'padding-right: 20px;\'><i style=\'color:#00c0ff\' class=\'fa fa-diamond fa-1x\'></i> ' + Game.state.gems + '</h3>\n          </div>\n          <hr/>\n          <div class="refined-store-middle">\n            <p onclick=\'Game.changeRefineTab("trinkets")\' id=\'trinkets-tab\' class=\'refine-tab selected\'>Trinkets</p>\n            <p onclick=\'Game.changeRefineTab("potions")\' id=\'potions-tab\' class=\'refine-tab\' >Potions</p>\n            <p onclick=\'Game.changeRefineTab("gems")\' id=\'gems-tab\' class=\'refine-tab\' >Gems</p>\n          </div>\n          <hr/>\n          <div class="refined-store-bottom"></div>\n          <div class="refined-store-refresh-btn"></div>\n        </div>\n    ';

    div.innerHTML = str;
    s('body').append(div);
    Game.changeRefineTab('trinkets');
  };

  Game.changeRefineTab = function (selectedTab) {
    var tabs = document.querySelectorAll('.refine-tab');
    tabs.forEach(function (tab) {
      return tab.classList.remove('selected');
    });

    s('#' + selectedTab + '-tab').classList.add('selected');

    var str = '';
    if (selectedTab == 'trinkets') {
      s('.refined-store-refresh-btn').innerHTML = '<button onclick="Game.refreshItems()">REFRESH <i class="fa fa-diamond fa-1x"></i> 1</button>';
      for (var i = 0; i < Game.state.currentRefinedStoreItems.length; i++) {
        var item = Game.state.currentRefinedStoreItems[i];
        str += '\n            <div class="refined-store-item ' + item.rarity + '" onclick=\'Game.confirmBuyRefinedItem("' + item.name + '")\'>\n              <div class="refined-store-item-top"></div>\n              <div class="refined-store-item-bottom" style=\'text-align: center\'>\n                <h2>' + item.name + '</h2>\n                <hr/>\n                <p style=\'color: white; padding: 5px;\'>' + item.desc + '</p>\n                <hr/>\n                <p style=\'color: white; margin-top: 20px;\'>Cost: <i class=\'fa fa-diamond fa-1x\' style="color:#00c0ff"></i> ' + item.price + '</p>\n              </div>\n            </div>\n        ';
      }
    } else {
      s('.refined-store-refresh-btn').innerHTML = '';
      str = '';
    }

    s('.refined-store-bottom').innerHTML = str;
  };

  Game.confirmBuyRefinedItem = function (itemName) {
    var selectedItem = '';
    for (var i = 0; i < Game.uniqueTrinkets.length; i++) {
      if (Game.uniqueTrinkets[i].name == itemName) {
        selectedItem = Game.uniqueTrinkets[i];
      }
    }

    if (selectedItem) {
      var div = document.createElement('div');
      div.classList.add('wrapper');

      div.innerHTML = '\n        <div class="confirm-buy-refined-item">\n          <h3>Confirm</h3>\n          <hr/>\n          <p>Are you sure you want to buy <strong>' + selectedItem.name + '</strong> for <strong><i class=\'fa fa-diamond fa-1x\'></i> ' + selectedItem.price + '</strong>?</p>\n          <hr/>\n          <button onclick=\'Game.buyRefinedItem("' + selectedItem.name + '")\'>Yes</button>\n          <button onclick=\'let wrappers = document.querySelectorAll(".wrapper"); wrappers[1].parentNode.removeChild(wrappers[1])\'>No</button>\n        </div>\n      ';

      s('body').append(div);
    }
  };

  Game.buyRefinedItem = function (itemName) {
    var selectedItem = '';
    for (var i = 0; i < Game.uniqueTrinkets.length; i++) {
      if (Game.uniqueTrinkets[i].name == itemName) {
        selectedItem = Game.uniqueTrinkets[i];
      }
    }

    if (selectedItem) {
      // IF THERE IS A SELECTED ITEM
      if (Game.state.gems >= selectedItem.price) {
        // IF YOU HAVE ENOUGH MONEY
        Game.state.gems -= selectedItem.price;
        risingNumber(0, 'spendGems', event);
        Game.closeCurrentWindow();
        if (selectedItem.type) {
          if (selectedItem.type.type == 'Building Multiplier') {
            Game.items[selectedItem.type.building].production *= selectedItem.type.amount;
          }
        }
        if (selectedItem.name == 'Tome of Higher Learning') {
          //
        }
        if (selectedItem.name == 'Discount Card') {
          for (var _i9 in Game.items) {
            if (Game.items[_i9].type == 'item') {
              Game.items[_i9].price -= Game.items[_i9].price * .1;
              buildStore();
            }
          }
        }
        if (selectedItem.name == 'Earrings of Alacrity') {
          //
        }
      }
    }
  };

  Game.refreshItems = function () {
    if (Game.state.gems >= 1) {
      Game.state.gems -= 1;
      Game.removeEl(s('.wrapper'));
      Game.generateRefinedStoreItems();
      Game.showRefinedStore();
    }
  };

  Game.closeCurrentWindow = function () {
    if (s('.wrapper')) {
      var wrappers = document.querySelectorAll('.wrapper');
      var newest = wrappers.length - 1;

      if (wrappers.length > 1) {
        Game.removeEl(wrappers[newest]);
      } else {
        wrappers.forEach(function (wrapper) {
          return Game.removeEl(wrapper);
        });
      }
    }

    Game.hideTooltip();

    if (s('.specialization-wrapper')) Game.removeEl(s('.specialization-wrapper'));
    if (s('.specialization-skills-wrapper')) Game.removeEl(s('.specialization-skills-wrapper'));
    if (s('.specialization-confirmation-wrapper')) Game.removeEl(s('.specialization-confirmation-wrapper'));
  };

  Game.drawQuestBtn = function () {
    if (Game.state.stats.timesRefined > 0) {

      var div = s('.open-quests-container');

      div.innerHTML = '\n        <div style=\'height: 30px;\' class="open-quests-container-top">\n          <div class="wood-stick"></div>\n          <div class="wood-stick"></div>\n        </div>\n        <div class="open-quests-container-bottom" onclick=\'Game.showQuests()\'>\n          <h2 style=\'font-family: "Germania One"; letter-spacing: 2px;\'>Quests</h2>\n        </div>\n      ';

      var verticalAnchor = s('.inventory-section').getBoundingClientRect();
      var horizontalAnchor = s('#main-separator').getBoundingClientRect();

      div.style.top = verticalAnchor.bottom + 'px';
      div.style.left = horizontalAnchor.left - div.getBoundingClientRect().width - 30 + 'px';
    }
  };

  Game.showQuests = function () {
    if (Game.state.player.generation.lv >= 1) {

      if (s('#quest-tut')) Game.removeEl(s('#quest-tut'));

      var div = document.createElement('div');
      div.classList.add('wrapper');

      var str = '\n        <div class="quests-container">\n          <h1 style=\'font-size: 3rem; padding: 10px 0;\'>Quests</h1>\n          <p onclick=\'Game.closeCurrentWindow()\' style=\'position: absolute; top: 5px; right: 5px; cursor: pointer\'>X</p>\n          <div class="active-quest-container">\n            <hr/>\n            ';

      if (Game.state.quest.active) {
        str += '\n                <h1>' + Game.state.quest.currentQuest + '</h1>\n              ';
      } else {
        str += '<p>No active quest</p>';
      }

      str += '\n            <hr/>\n          </div>\n          <div class="available-quests-container">\n          ';
      for (var i = 0; i < Game.quests.length; i++) {
        if (Game.quests[i].locked == 0) {
          str += '\n                  <div style=\'background: url("./assets/' + Game.quests[i].pic + '.png");\' class="available-quest unlocked" onclick="Game.showQuestInformation(\'' + Game.quests[i].functionName + '\')">\n                    <p style=\'font-family: "Germania One"; background: rgba(0, 0, 0, 0.3); width: 100%; padding: 10px\'>' + Game.quests[i].name + '</p>\n                  </div>\n                ';
        } else if (Game.quests[i].locked == 1) {
          str += '\n                  <div style=\'opacity: .7\' class="available-quest">\n                    <p>???</p>\n                  </div>\n                ';
        } else {
          str += '\n                  <div style=\'opacity: .2\' class="available-quest hidden-quest">\n                    <p>???</p>\n                  </div>\n                ';
        }
      }
      str += '\n          <p style=\'opacity: .5\'>More coming soon...</p>\n          </div>\n        </div>\n      ';

      div.innerHTML = str;
      s('body').append(div);
    }
  };

  Game.showQuestInformation = function (questName) {
    var selectedQuest = {};
    for (var i = 0; i < Game.quests.length; i++) {
      if (Game.quests[i].functionName == questName) {
        selectedQuest = Game.quests[i];
      }
    }

    var div = document.createElement('div');
    div.classList.add('wrapper');
    div.innerHTML = '\n      <div class="quest-information">\n        <h1 style=\'padding:10px 0\'>' + selectedQuest.name + '</h1>\n        <p onclick=\'Game.closeCurrentWindow()\' style=\'position: absolute; top: 5px; right: 5px; cursor: pointer\'>X</p>\n        <hr/>\n        <img src="./assets/' + selectedQuest.pic + '.png" class="quest-img"\'>\n        <hr/>\n        <br/>\n        <h3>' + selectedQuest.desc + '</h3>\n        <p>Completion Time: ~' + selectedQuest.completionTimeTxt + '</p>\n        <br/>\n        <hr/>\n        <div class="quest-information-bottom">\n          <div style=\'width: 100%\' class="quest-information-bottom-right">\n            <button onclick=\'Game.startQuest("' + selectedQuest.name + '")\'>Adventure <i class=\'fa fa-long-arrow-right fa-1x\'></i></button>\n          </div>\n        </div>\n      </div>\n    ';

    s('body').append(div);
  };

  Game.startQuest = function (questName) {
    var quest = Game.select(Game.quests, questName);

    document.querySelectorAll('.wrapper').forEach(function (wrapper) {
      return Game.removeEl(wrapper);
    });

    if (!Game.state.quest.active) {
      Game.state.quest.active = true;
      Game.state.quest.currentQuest = quest.name;
      Game.state.quest.questCompletionTime = quest.completionTime;
      Game.state.quest.currentQuestProgress = 0;
      Game.redrawQuestInfo = 1;
    }
  };

  Game.canBoost = true;
  Game.boostQuest = function () {
    if (Game.state.quest.currentQuestProgress != Game.state.quest.questCompletionTime) {
      if (Game.canBoost) {
        if (Game.state.quest.currentQuestProgress + 5000 < Game.state.quest.questCompletionTime) {
          Game.canBoost = false;
          Game.risingNumber(null, 'quest-progress', event);
          Game.state.quest.currentQuestProgress += 5000;

          var progress = 0;
          var max = 5 * 1000;
          s('.click-cooldown').style.height = progress;

          var height = setInterval(function () {
            if (progress < max) {
              progress += 30;
              s('.click-cooldown').style.height = progress / max * 100 + '%';
            }
          }, 30);

          setTimeout(function () {
            Game.canBoost = true;
            clearInterval(height);
            s('.click-cooldown').style.height = "100%";
          }, 5000);
        } else {
          Game.risingNumber(null, 'quest-progress');
          s('.click-cooldown').style.height = "100%";
          Game.canBoost = true;
          Game.state.quest.currentQuestProgress = Game.state.quest.questCompletionTime;
        }
      }
    } else {
      Game.questCompleteModal();
    }
  };

  Game.drawQuestInfo = function () {
    var div = s('.bottom');
    if (Game.state.quest.active) {
      div.innerHTML = '\n        <div onclick=\'Game.boostQuest()\' class="bottom-quest-wrapper" style=\'cursor: pointer; width: 100%; height: 100%;\'>\n          <div class="click-cooldown-container">\n            <div class="click-cooldown"></div>\n          </div>\n          <div class="bottom-active-quest-info">\n            <h3>' + Game.state.quest.currentQuest + '</h3>\n          </div>\n          <div class="progress-container">\n            <i class="fa fa-male fa-3x player-model moving" style=\'color: white;\'></i>\n          </div>\n        </div>\n      ';
    } else {
      div.innerHTML = '';
    }

    Game.redrawQuestInfo = 0;
  };

  Game.calculateRemainingQuest = function () {
    var playerModel = s('.player-model');
    var leftPos = Game.state.quest.currentQuestProgress / Game.state.quest.questCompletionTime * 100;

    if (Game.state.quest.currentQuestProgress + 30 < Game.state.quest.questCompletionTime) {
      Game.state.quest.currentQuestProgress += 30;
      playerModel.style.left = leftPos + "%";
    } else {
      Game.state.quest.currentQuestProgress = Game.state.quest.questCompletionTime;
      playerModel.style.left = '100%';
      playerModel.classList.remove('moving');
      playerModel.classList.add('jumping');
    }
  };

  Game.questCompleteModal = function () {
    var div = document.createElement('div');
    div.classList.add('wrapper');
    div.id = 'quest-complete-modal';
    var completedQuest = Game.select(Game.quests, Game.state.quest.currentQuest);
    Game.playSound('quest-complete');

    var str = '\n      <div class="quest-complete-modal">\n        <p>Quest Complete</p>\n        <hr />\n        <h1 style=\'font-family: "Germania One"\'>' + Game.state.quest.currentQuest + '</h1>\n        <hr style=\'margin-bottom: 10px\'/>\n        <p class=\'quest-reward fadeUpIn\' style=\'color: #f3e56c\' >Generation XP: +' + completedQuest.xpGain + '</p>\n        ';
    if (completedQuest.timesCompleted == 0) {
      str += '<p class=\'quest-reward fadeUpIn\' style=\'color: #00c0ff; animation-duration: .6s\'>FIRST CLEAR BONUS: 1 <i class=\'fa fa-diamond fa-1x\'></i></p>';
    }
    str += '\n        <hr />\n        <br />\n\n        <button onclick=\'Game.gainQuestRewards()\'>COLLECT REWARDS</button>\n      </div>\n    ';

    div.innerHTML = str;

    s('body').append(div);
  };

  Game.gainQuestRewards = function () {
    Game.removeEl(s('#quest-complete-modal'));
    var completedQuest = Game.select(Game.quests, Game.state.quest.currentQuest);
    completedQuest.timesCompleted++;
    if (completedQuest.timesCompleted == 1) {
      Game.state.gems += completedQuest.firstClearGemGain;
    }
    Game.state.player.generation.currentXp += completedQuest.xpGain;

    Game.state.quest.active = false, Game.state.quest.currentQuest = null, Game.state.quest.currentQuestProgress = null, Game.state.quest.questCompletionTime = null, Game.drawQuestInfo();

    Game.rebuildInventory = 1;
  };

  Game.winAchievement = function (achievementName) {
    var selectedAchievement = void 0;
    for (var i in Game.achievements) {
      if (Game.achievements[i].name == achievementName) {
        selectedAchievement = Game.achievements[i];
        break;
      }
    }

    if (selectedAchievement.won == 0) {
      selectedAchievement.won = 1;

      if (selectedAchievement.reward) {
        if (selectedAchievement.reward.increaseWeakHitMulti) {
          Game.state.permanentWeakHitMulti += selectedAchievement.reward.increaseWeakHitMulti;
        }
        if (selectedAchievement.reward.building) {
          Game.select(Game.buildings, selectedAchievement.reward.building[0]).production *= selectedAchievement.reward.building[1];
          Game.recalculateOpC = 1;
          Game.recalculateOpS = 1;
          Game.rebuildInventory = 1;
          Game.rebuildStore = 1;
        }
      }

      var div = document.createElement('div');
      div.classList.add('achievement');

      var str = '\n        <h3>Achievement Unlocked</h3>\n        <h1>' + selectedAchievement.name + '</h1>\n        <p>' + selectedAchievement.desc + '</p>\n      ';
      if (selectedAchievement.reward) {
        str += '\n          <hr />\n          <p style=\'color: lime\'>REWARD: ' + selectedAchievement.reward.txt + '</p>\n        ';
      }

      div.innerHTML = str;
      s('body').append(div);

      setTimeout(function () {
        Game.removeEl(div);
      }, 4000);
    }
  };

  Game.select = function (arr, what) {
    for (var i in arr) {
      if (arr[i].name == what) return arr[i];
    }
  };

  var counter = 0;
  Game.logic = function () {

    if (!Game.blurred) {
      // HANDLE ORES N SHIT
      if (Game.recalculateOpC) Game.calculateOpC();
      if (Game.recalculateOpS) Game.calculateOpS();
      var ops = Game.state.oresPerSecond / Game.state.prefs.fps;
      Game.earn(ops);

      // BUILD STORE & INVENTORY
      if (s('.skill-tree-container').style.display == 'none' || s('.skill-tree-container').style.display == '') {
        if (Game.rebuildStore) Game.buildStore();
        if (Game.rebuildInventory) Game.buildInventory();

        // REPOSITION SHIT
        if (Game.repositionAllElements) Game.positionAllElements();
        if (Game.repositionOreWeakSpot) Game.oreWeakSpot();
        if (Game.redrawQuestInfo) Game.drawQuestInfo();

        // run every 10s
        counter++;
        if (counter % (30 * 30) == 0) {
          Game.randomBonus();
        }
      }

      if (Game.state.quest.active) Game.calculateRemainingQuest();
    }

    setTimeout(Game.logic, 1000 / Game.state.prefs.fps);
  };

  setInterval(function () {
    if (!Game.blurred) {
      if (Game.state.oresPerSecond) Game.risingNumber(Game.state.oresPerSecond, 'buildings', event);
    }
  }, 1000);

  setInterval(function () {
    Game.save();
  }, 1000 * 60); // save every minute

  Game.resetItems = function () {
    console.log('resetItems', items);
    Game.buildings = [];
    Game.upgrades = [];
    items.forEach(function (item) {
      new Item(item);
    });
    for (var i in Game.achievements) {
      if (Game.achievements[i].won) {
        if (Game.achievements[i].reward) {
          if (Game.achievements[i].reward.building) {
            Game.select(Game.buildings, Game.achievements[i].reward.building[0]).production *= Game.achievements[i].reward.building[1];
          }
        }
      }
    }
  };

  Game.textScroller = ['What is a rocks favorite fruit? ... Pom-a-granite', 'Did you see that cleavage? Now that\'s some gneiss schist.', 'All rock and no clay makes you a dull boy (or girl)', 'Don\'t take life for granite', 'What happens when you throw a blue rock in the red sea? ... It gets wet', "I'd do more work, but I'll mine my own business - /u/Maxposure", "As you can tell, these are pretty lame... Submit your own to /u/name_is_Syn"];

  Game.showTextScroller = function (text) {

    var scrollTime = 20; // 20seconds

    if (Game.state.prefs.scrollingText == true) {
      s('.text-scroller').innerHTML = '';

      if (text) {
        s('.text-scroller').innerHTML = text;
        s('.text-scroller').style.right = -s('.text-scroller').clientWidth + 'px';

        var parentWidth = s('.text-scroller').parentElement.clientWidth;

        s('.text-scroller').style.transition = 'transform 15s linear';
        s('.text-scroller').style.transform = 'translateX(-' + (parentWidth + s('.text-scroller').clientWidth) + 'px)';
      } else {
        var random = Math.floor(Math.random() * Game.textScroller.length);

        s('.text-scroller').innerHTML = Game.textScroller[random];
        s('.text-scroller').style.right = -s('.text-scroller').clientWidth + 'px';

        var _parentWidth = s('.text-scroller').parentElement.clientWidth;

        s('.text-scroller').style.transition = 'transform ' + scrollTime + 's linear';
        s('.text-scroller').style.transform = 'translateX(-' + (_parentWidth + s('.text-scroller').clientWidth) + 'px)';
      }
      setTimeout(function () {
        s('.text-scroller').style.transition = 'none';
        s('.text-scroller').style.transform = 'translateX(0px)';
        Game.showTextScroller();
      }, scrollTime * 1000);
    }
  };

  Game.load();
  Game.logic();

  s('.ore').onclick = function () {
    return Game.handleClick();
  };
  s('.ore-weak-spot').onclick = function () {
    return Game.handleClick('weak-spot');
  };

  window.onresize = function () {
    return Game.repositionAllElements = 1;
  };

  window.onblur = function () {
    Game.state.lastLogin = new Date().getTime();
    Game.blurred = true;
  };

  window.onfocus = function () {
    Game.earnOfflineGain();
    Game.blurred = false;
  };

  var pressed = [];
  var secretCode = 'test';
  window.addEventListener('keyup', function (e) {
    pressed.push(e.key);
    pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length);
    if (pressed.join('').includes('test')) {
      Game.state.player.pickaxe.damage *= 10000000;
      Game.recalculateOpC = 1;
    }
  });
  s('.ore').addEventListener('click', (e) => {
    Game.handleClick(e);
  })
};

window.onload = function () {
  Game.launch();
};
