let Skill = function(skill) {
  this.name = skill.name
  this.desc = skill.desc
  this.fillerTxt = skill.fillerTxt
  this.section = skill.section
  this.locked = skill.locked

  Game.skills.push(this)
}

let skills = [
  {
    name: 'The Start',
    fillerTxt: 'Where it all began...',
    section: 2,
    desc: 'Unlocks quests'
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

let prospectorSkills = [

]

let neutralSkills = [
  {
    name: 'The Start',
    fillerTxt: 'Where it all began...'
  }
]

let managerSkills = [

]

//intellectual - start with schools, i watch rick and morty
