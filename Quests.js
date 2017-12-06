let Quest = function(obj) {
  this.name = obj.name
  this.functionName = obj.name.replace(/ /g,'')
  this.timesCompleted = 0
  this.desc = obj.desc
  this.locked = obj.locked
  this.img = obj.img
  this.completionTime = obj.completionTime
  this.completionTimeTxt = obj.completionTimeTxt

  Game.quests.push(this)
}

let quests  = [
  {
    name: 'Abandoned Mineshaft',
    locked: 0,
    desc: 'Traverse into an abandoned mineshaft for hopes of greater rewards',
    img: 'wip.png',
    completionTime: 30,
    completionTimeTxt: '30 minutes'
  }, {
    name: 'Darkest Dungeon',
    locked: 1,
    desc: 'wip.png',
    img: 'wip.png'
  }
]
