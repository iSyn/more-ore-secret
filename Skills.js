let Skill = function(skill) {
  this.name = skill.name
  this.desc = skill.desc
  this.locked = skill.locked

  Game.skills.push(this)
}

let skills = [
  {
    name: 'Pickaxe Efficiency',
    desc: 'wip',
    locked: 0
  }, {
    name: 'test',
    desc: 'test',
    locked: 0
  }
]
