let Quest = function( obj ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
  this.img = obj.img
  this.duration = obj.duration
  this.completed = obj.completed || 0

  this.reward = obj.reward

  this.locked = 1
  if ( obj.locked == 0 ) this.locked = 0

  Quests.push( this )
}

let hero_names = [ 'Synclair', 'Christine' ]

let Quests = []

let quests = [
  {
    name: 'Abandoned Mineshaft',
    img: 'https://via.placeholder.com/64',
    duration: 5 * SECOND,
    locked: 0,
    reward: {
      xp: 50,
      refined_ores: 1
    }
  }, {
    name: 'Quest 2',
    img: 'https://via.placeholder.com/64',
    duration: 1 * HOUR
  }
]

quests.forEach( quest => new Quest( quest ) )