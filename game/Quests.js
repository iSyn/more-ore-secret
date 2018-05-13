let Quest = function(obj) {
  this.name = obj.name
  this.functionName = obj.name.replace(/ /g,'')
  this.timesCompleted = 0
  this.desc = obj.desc
  this.locked = obj.locked
  this.img = obj.img
  this.artifact = obj.artifact
  this.completionTime = obj.completionTime
  this.completionTimeTxt = obj.completionTimeTxt
  this.xpGain = obj.xpGain
  this.firstClearRewards = obj.firstClearRewards

  Game.quests.push(this)
}

let quests  = [
  {
    name: 'Abandoned Mineshaft',
    locked: 0,
    desc: 'Traverse into an abandoned mineshaft for hopes of greater rewards',
    img: 'quest_abandoned-mineshaft',
    completionTime: 30 * 1000,
    completionTimeTxt: '30 seconds',
    xpGain: 40,
    artifact: {
      name: 'Combo Stone',
      found: false,
      chance: .4
    },
    firstClearRewards: {
      diamonds: 1,
    },
  }, 
  // ============================================================================================================
  {
    name: 'TEST QUEST',
    locked: 1,
    desc: 'test desc',
    img: 'misc_wip',
    completionTime: 30 * 60 * 1000,
    completionTimeTxt: '30 minutes',
    xpGain: 100,
    artifact: {
      found: false,
      chance: .4
    },
    firstClearRewards: {
      diamonds: 1,
    },
  }, {
    name: 'TEST QUEST',
    locked: 1,
    desc: 'test desc',
    img: 'misc_wip',
    completionTime: 30 * 60 * 1000,
    completionTimeTxt: '30 minutes',
    xpGain: 100,
    artifact: {
      found: false,
      chance: .4
    },
    firstClearRewards: {
      diamonds: 1,
    },
  }, {
    name: 'TEST QUEST',
    locked: 1,
    desc: 'test desc',
    img: 'misc_wip',
    completionTime: 30 * 60 * 1000,
    completionTimeTxt: '30 minutes',
    xpGain: 100,
    artifact: {
      found: false,
      chance: .4
    },
    firstClearRewards: {
      diamonds: 1,
    },
  }, {
    name: 'TEST QUEST',
    locked: 1,
    desc: 'test desc',
    img: 'misc_wip',
    completionTime: 30 * 60 * 1000,
    completionTimeTxt: '30 minutes',
    xpGain: 100,
    artifact: {
      found: false,
      chance: .4
    },
    firstClearRewards: {
      diamonds: 1,
    },
  },
]
