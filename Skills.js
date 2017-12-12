let Skill = function(skill) {
  this.name = skill.name
  this.className = skill.name.replace(/\s/g, '');
  this.desc = skill.desc
  this.fillerTxt = skill.fillerTxt
  this.type = skill.type
  this.generationReq = skill.generationReq
  skill.pic ? this.pic = skill.pic : this.pic = 'skill-container'
  // skill.generationNeeded > 0 ? this.generationNeeded = skill.generationNeeded - 1 : this.generationNeeded = skill.generationNeeded
  this.section = skill.section
  this.locked = skill.locked
  skill.lvl ? this.lvl = skill.lvl : this.lvl = 0
  skill.maxLvl ? this.maxLvl = skill.maxLvl : this.maxLvl = 100
  if (skill.drawLines) this.drawLines = skill.drawLines
  if (skill.requires) this.requires = skill.requires

  Game.skills.push(this)

  this.levelUp = () => {
    if (!this.locked) {
      if (this.lvl < this.maxLvl) {
        if (Game.state.player.generation.availableSp > 0) {
          Game.state.player.generation.availableSp--
          this.lvl++
          Game.risingNumber(null, 'skill up')
          Game.state.player.skills[`spSection${this.section}`]++
          Game.playSound('skill-lvl-up')
          document.querySelector('.available-sp').innerHTML = `Available Sp: ${Game.state.player.generation.availableSp}`

          Game.hideTooltip()

          // check for unlocks
          Game.unlockSkills()
        }
      }
    }
  }
}

let skills = [
  /* Section 1 Skills */
  {
    name: 'Pickaxe Mastery',
    pic: 'pickaxe-mastery',
    fillerTxt: 'Refine your knowledge with the ins and outs of everything pickaxe.',
    type: 'passive',
    generationReq: 2,
    section: 1,
    desc: 'Increase your total OpC by 10% for each level in Pickaxe Mastery',
    maxLvl: 5,
    locked: 1,
    drawLines: [
      {from: 'right', to: 'Heavy Strike'}
    ],
    requires: [
      ['The Start', 1]
    ]
  },
  {
    name: 'Heavy Strike',
    pic: 'heavy-smash',
    fillerTxt: 'I fear not the man who has practiced 10,000 pickaxe swings once, but I fear the man who has practiced one pickaxe swing 10,000 times. - Michael Scott',
    type: 'active',
    generationReq: 5,
    section: 1,
    desc: 'Deal a strong strike',
    maxLvl: 5,
    locked: 1,
    requires: [
      ['Pickaxe Mastery', 5]
    ],
    drawLines: [
      {from: 'right', to: 'Powerlifting'},
      {from: 'right', to: 'Conditioning'}
    ]
  },
  {
    name: 'Powerlifting',
    fillerTxt: 'I lift things up and put them down',
    type: 'passive',
    generationReq: 6,
    section: 1,
    desc: '+5 to base strength for each level in Powerlifting',
    maxLvl: 10,
    locked: 1,
    requires: [
      ['Heavy Strike', 1]
    ]
  },
  {
    name: 'Conditioning',
    fillerTxt: 'Crossfit is, like, totally awesome.',
    type: 'passive',
    generationReq: 6,
    section: 1,
    desc: '+5 to base dex for each level in Powerlifting',
    maxLvl: 10,
    locked: 1,
    requires: [
      ['Heavy Strike', 1]
    ],
  },

  /* Section 2 Skills */
  {
    name: 'The Start',
    pic: 'the-start',
    fillerTxt: 'In the beginning, there was nothing. Then... ORES',
    type: 'passive',
    generationReq: 1,
    section: 2,
    desc: 'Increases your total OpC and Ops by 50%',
    maxLvl: 1,
    locked: 0,
    drawLines: [
      {from: 'top', to: 'Pickaxe Mastery'},
      {from: 'bottom', to: 'Managerial Mastery'},
    ]
  },
  {
    name: 'Master of None',
    pic: '50-50',
    fillerTxt: 'Best of both worlds',
    type: 'passive',
    generationReq: 2,
    section: 2,
    desc: 'Increase your OpS and OpC by 5% for each point in Master of None',
    maxLvl: 10,
    locked: 1,
  },

  /* Section 3 skills */
  {
    name: 'Managerial Mastery',
    pic: 'manager-mastery',
    fillerTxt: 'Manager workshop - Become a better manager today!',
    type: 'passive',
    generationReq: 2,
    section: 3,
    desc: 'Increase your total OpS by 10% for each point in Managerial Mastery',
    maxLvl: 5,
    locked: 1,
    drawLines: [
      {from: 'right', to: 'Tax Break'}
    ],
    requires: [
      ['The Start', 1]
    ]
  },
  {
    name: 'Tax Break',
    pic: 'tax-break',
    fillerTxt: 'Donald Trump up in here',
    type: 'active',
    generationReq: 5,
    section: 3,
    desc: 'For 5 seconds, all your buildings has double production',
    maxLvl: 5,
    locked: 1,
    requires: [
      ['Managerial Mastery', 5]
    ]
  },
]

//intellectual - start with schools, i watch rick and morty
