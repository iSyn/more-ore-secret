let Skill = function(skill) {
  this.name = skill.name
  this.className = skill.name.replace(/\s/g, '');
  this.desc = skill.desc
  this.fillerTxt = skill.fillerTxt
  this.type = skill.type
  this.generationNeeded = skill.generationNeeded
  // skill.generationNeeded > 0 ? this.generationNeeded = skill.generationNeeded - 1 : this.generationNeeded = skill.generationNeeded
  this.section = skill.section
  this.locked = skill.locked
  skill.lvl ? this.lvl = skill.lvl : this.lvl = 0
  skill.maxLvl ? this.maxLvl = skill.maxLvl : this.maxLvl = 100
  if (skill.unlockSkills) this.unlockSkills = skill.unlockSkills
  if (skill.drawLines) this.drawLines = skill.drawLines

  Game.skills.push(this)

  this.levelUp = () => {
    if (this.lvl < this.maxLvl) {
      if (Game.state.player.generation.availableSp > 0) {
        Game.state.player.generation.availableSp--
        this.lvl++
        Game.state.player.skills[`spSection${this.section}`]++

        if (this.unlockSkills) {
          for (i in this.unlockSkills) {
            let selected;
            for (j in Game.skills) {
              if (Game.skills[j].name == this.unlockSkills[i]) {
                selected = Game.skills[j]
              }
            }
            if (selected.locked) selected.locked = 0
          }
        }

        // unlock other shit
        for (i in Game.skills) {
          if (Game.skills[i].section == this.section) {
            if (Game.state.player.skills[`spSection${this.section}`] >= Game.skills[i].generationNeeded) {
              if (Game.skills[i].locked) {
                Game.skills[i].locked = 0
              }
            }
          }
        }


        // rebuild skill tree
        Game.showSkillTree()
      }
    }
  }
}

let skills = [
  /* Section 1 Skills */
  {
    name: 'Pickaxe Mastery',
    fillerTxt: 'Refine your knowledge with the ins and outs of everything pickaxe.',
    type: 'passive',
    generationNeeded: 1,
    section: 1,
    desc: 'Increase your total OpC by 10% for each level in Pickaxe Mastery',
    maxLvl: 5,
    locked: 1,
    // unlockSkills: ['Heavy Smash']
    drawLines: [
      {from: 'right', to: 'Heavy Strike'}
    ]
  },
  {
    name: 'Heavy Strike',
    fillerTxt: 'I fear not the man who has practiced 10,000 pickaxe swings once, but I fear the man who has practiced one pickaxe swing 10,000 times. - Michael Scott',
    type: 'active',
    generationNeeded: 5,
    section: 1,
    desc: 'Deal a strong strike',
    maxLvl: 5,
    locked: 1,
  },

  /* Section 2 Skills */
  {
    name: 'The Start',
    fillerTxt: 'In the beginning, there was nothing. Then... ORES',
    type: 'passive',
    generationNeeded: 1,
    section: 2,
    desc: 'Increases your total OpC and Ops by 50%',
    maxLvl: 10,
    unlockSkills: ['Pickaxe Mastery', 'Managerial Mastery'],
    locked: 0,
    drawLines: [
      {from: 'top', to: 'Pickaxe Mastery'},
      {from: 'bottom', to: 'Managerial Mastery'},
      {from: 'right', to: 'test2'}
    ]
  },
  {
    name: 'test2',
    fillerTxt: 'test',
    type: 'passive',
    generationNeeded: 3,
    section: 2,
    desc: 'test',
    maxLvl: 10,
    locked: 1
  },

  /* Section 3 skills */
  {
    name: 'Managerial Mastery',
    fillerTxt: 'Manager workshop - Become a better manager today!',
    type: 'passive',
    generationNeeded: 1,
    section: 3,
    desc: 'Increase your total OpS by 10% for each level in Managerial Mastery',
    maxLvl: 5,
    locked: 1,
    drawLines: [
      {from: 'right', to: 'test3'},
      {from: 'right', to: 'test4'}
    ]
  },
  {
    name: 'test3',
    fillerTxt: 'test',
    type: 'passive',
    generationNeeded: 4,
    section: 3,
    desc: 'test',
    maxLvl: 10,
    locked: 1
  },
  {
    name: 'test4',
    fillerTxt: 'test',
    type: 'passive',
    generationNeeded: 4,
    section: 3,
    desc: 'test',
    maxLvl: 10,
    locked: 1,
    drawLines: [
      {from: 'right', to: 'test5'}
    ]
  },
  {
    name: 'test5',
    fillerTxt: 'test',
    type: 'passive',
    generationNeeded: 7,
    section: 3,
    desc: 'test',
    maxLvl: 10,
    locked: 1
  }
]

//intellectual - start with schools, i watch rick and morty
