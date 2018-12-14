let Quest = function( obj ) {

  this.name = obj.name
  this.id = obj.id
  this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
  this.img = obj.img
  this.duration = obj.duration
  this.completed = obj.completed || 0
  this.times_completed = obj.times_completed || 0

  this.reward = obj.reward

  this.locked = 1
  if ( obj.locked == 0 ) this.locked = 0

  this.complete = () => {
    this.completed = 1
    this.times_completed++

    let next_quest = Quests[ this.id - 1 ]
    if ( next_quest ) {
      if ( next_quest.locked == 1 ) next_quest.locked = 0
    }
  }

  Quests.push( this )
}

let hero_names = [ 'Synclair', 'Christine' ]

let Quests = []

let quests = [
  {
    name: 'Abandoned Mineshaft',
    id: 1,
    img: 'https://via.placeholder.com/64',
    duration: 5 * SECOND,
    locked: 0,
    reward: {
      xp: 50,
      refined_ores: 1
    },

  }, {
    name: 'Quest 2',
    id: 2,
    img: 'https://via.placeholder.com/64',
    duration: 1 * HOUR
  }
]

quests.forEach( quest => new Quest( quest ) )