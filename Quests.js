let Quest = function(obj) {
  this.name = obj.name
  this.pic = obj.pic
  this.functionName = obj.name.replace(/ /g,'')
  this.timesCompleted = 0
  this.desc = obj.desc
  this.locked = obj.locked
  this.img = obj.img
  this.completionTime = obj.completionTime * 60 * 1000
  this.completionTimeTxt = obj.completionTimeTxt

  Game.quests.push(this)
}

let quests  = [
  {
    name: 'Abandoned Mineshaft',
    pic: 'abandoned-mineshaft',
    locked: 0,
    desc: 'Traverse into an abandoned mineshaft for hopes of greater rewards',
    img: 'wip.png',
    completionTime: 30,
    completionTimeTxt: '30 minutes'
  }
]
