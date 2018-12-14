let Quest = function( obj ) {

  this.name = obj.name
  this.id = obj.id
  this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
  this.img = obj.img
  this.duration = obj.duration
  this.completed = obj.completed || 0
  this.times_completed = obj.times_completed || 0

  this.rewards = obj.rewards

  this.locked = 1
  if ( obj.locked == 0 ) this.locked = 0

  Quests.push( this )
}

let Quests = []

let quests = [
  {
    name: 'Dark Forest',
    id: 0,
    img: 'https://via.placeholder.com/64',
    duration: 5 * SECOND,
    locked: 0,
    rewards: {
      xp: 50,
      refined_ores: 1,
      gem: {
        chance: 60,
        level_range: [ 1, 3 ]
      }
    },

  }, {
    name: 'Quest 2',
    id: 1,
    img: 'https://via.placeholder.com/64',
    duration: 1 * HOUR
  }
]

quests.forEach( quest => new Quest( quest ) )