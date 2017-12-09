let Skill = function(skill) {
  this.name = skill.name
  this.desc = skill.desc
  this.fillerTxt = skill.fillerTxt
  this.type = skill.type
  this.section = skill.section[0]
  this.row = skill.section[1]
  this.locked = skill.locked
  skill.lvl ? this.lvl = skill.lvl : this.lvl = 0
  skill.maxLvl ? this.maxLvl = skill.maxLvl : this.maxLvl = 100
  if (skill.unlockSkills) this.unlockSkills = skill.unlockSkills

  Game.skills.push(this)

  this.levelUp = () => {
    if (this.lvl < this.maxLvl) {
      if (Game.state.player.generation.availableSp > 0) {
        Game.state.player.generation.availableSp--
        this.lvl++

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

        // rebuild skill tree
        Game.showSkillTree()

      }
    }
  }
}

let skills = [
  {
    name: 'The Start',
    fillerTxt: 'In the beginning, there was nothing. Then... ORES',
    type: 'passive',
    section: [2, 1],
    desc: 'Increases your total OpC and Ops by 5% for each level in The Start',
    unlockSkills: ['Pickaxe Mastery', 'Managerial Mastery']
  }, {
    name: 'Pickaxe Mastery',
    fillerTxt: 'Refine your knowledge with the ins and outs of everything pickaxe.',
    type: 'passive',
    section: [1, 1],
    desc: 'Increase your total OpC by 10% for each level in Pickaxe Mastery',
    maxLvl: 5,
    locked: 1
  }, {
    name: 'Managerial Mastery',
    fillerTxt: 'Manager workshop - Become a better manager today!',
    type: 'passive',
    section: [3, 1],
    desc: 'Increase your total OpS by 10% for each level in Managerial Mastery',
    maxLvl: 5,
    locked: 1
  }, {
    name: 'Work In Progress',
    fillerTxt: 'wip',
    type: 'wip',
    section: [1, 2],
    desc: 'wip',
    locked: 1
  }, {
    name: 'Work In Progress 2',
    fillerTxt: 'wip',
    type: 'wip',
    section: [1, 2],
    desc: 'wip',
    locked: 1
  }, {
    name: 'Work In Progress 3',
    fillerTxt: 'wip',
    type: 'wip',
    section: [1, 2],
    desc: 'wip',
    locked: 1
  }, {
    name: 'Work In Progress 4',
    fillerTxt: 'wip',
    type: 'wip',
    section: [1, 3],
    desc: 'wip',
    locked: 1
  }, {
    name: 'Work In Progress 5',
    fillerTxt: 'wip',
    type: 'wip',
    section: [1, 3],
    desc: 'wip',
    locked: 1
  }
]

//intellectual - start with schools, i watch rick and morty
