let Skill = function(skill) {
  this.name = skill.name
  this.desc = skill.desc
  this.fillerTxt = skill.fillerTxt
  this.type = skill.type
  this.section = skill.section
  this.locked = skill.locked
  skill.lvl ? this.lvl = skill.lvl : this.lvl = 0
  skill.maxLvl ? this.maxLvl = skill.maxLvl : this.maxLvl = 100

  Game.skills.push(this)
}

let skills = [
  {
    name: 'The Start',
    fillerTxt: 'In the beginning, there was nothing. Then... ORES',
    type: 'passive',
    section: 2,
    desc: 'Increases your total OpC and Ops by 10% for each level in The Start'
  }, {
    name: 'test',
    fillerTxt: 'test',
    section: 2,
    desc: 'test'
  }, {
    name: 'test2',
    fillerTxt: 'test2',
    section: 2,
    desc: 'test2'
  }
]

//intellectual - start with schools, i watch rick and morty
