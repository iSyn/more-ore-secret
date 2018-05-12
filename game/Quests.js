let Quest = function(obj) {
  this.name = obj.name
  this.pic = obj.pic
  this.functionName = obj.name.replace(/ /g,'')
  this.timesCompleted = 0
  this.desc = obj.desc
  this.locked = obj.locked
  this.img = obj.img
  this.completionTime = obj.completionTime
  this.completionTimeTxt = obj.completionTimeTxt
  this.xpGain = obj.xpGain
  this.firstClearRewards = obj.firstClearRewards

  Game.quests.push(this)
}

let quests  = [
  {
    name: 'Abandoned Mineshaft',
    pic: 'nothing',
    locked: 0,
    desc: 'Traverse into an abandoned mineshaft for hopes of greater rewards',
    img: 'quest_abandoned-mineshaft',
    completionTime: 5 * 60 * 1000,
    completionTimeTxt: '5 minutes',
    xpGain: 40,
    firstClearRewards: {
      diamonds: 1,
    },
  }, {
    name: 'TEST QUEST',
    pic: 'nothing',
    locked: 0,
    desc: 'test desc',
    img: 'misc_wip.png',
    completionTime: 30 * 60 * 1000,
    completionTimeTxt: '30 minutes',
    xpGain: 100,
    firstClearRewards: {
      diamonds: 1,
    },
  },
]
