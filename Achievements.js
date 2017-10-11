Game.achievements = []

let Achievement = function(name, desc) {
  this.name = name
  // this.functionName = name.replace(/ /g, '')
  this.desc = desc
  this.won = 0

  Game.achievements.push(this)
}

Game.winAchievement = (achievementName) => {
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

        setTimeout(() => {
          div.remove()
        }, 3000)
      }
    }
  }
}

new Achievement('Newbie Miner', 'Break your first rock')
new Achievement('Novice Miner', 'Break 5 rocks')
new Achievement('Intermediate Miner', 'Break 10 rocks')

// COMBO ACHIEVEMENTS
new Achievement('Combaby', 'Reach 5 hit combo')
new Achievement('Combro', 'Reach 15 hit combo')
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

// SKILL ACHIEVEMENTS
new Achievement('Hulk Smash', 'Use the skill Heavy Smash for the first time')
new Achievement('RAOOARARRWR', 'Use the skill Roid Rage for the first time')
new Achievement('Beep Boop', 'Use the skill Auto-Miner 5000 for the first time')
new Achievement('Roided Smash', 'Use the skill Heavy Smash along while Roid Rage is active')
