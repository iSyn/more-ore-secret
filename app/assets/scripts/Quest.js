let Quest = function( obj ) {

  this.name = obj.name
  this.id = obj.id
  this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
  this.desc = obj.desc
  this.flavor_text = obj.flavor_text
  this.img = obj.img
  this.duration = obj.duration
  this.achievement_name = obj.achievement_name
  this.completed = obj.completed || 0
  this.times_completed = obj.times_completed || 0
  this.total_xp_gained = obj.total_xp_gained || 0

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
    desc: 'The Dark Forest is a mysterious place devoid of life. The ones who are enter are forever lost wandering.',
    flavor_text: 'Note: Not the forest Logan Paul went to.',
    duration: 5 * MINUTE,
    locked: 0,
    rewards: {
      xp: 50,
      ores: 1000,
      refined_ores: 1,
      gem: {
        chance: 60,
        level_range: [ 1, 3 ]
      }
    },
    achievement_name: 'not_that_dark!'

  }, {
    name: 'Quest 2',
    id: 1,
    img: 'https://via.placeholder.com/64',
    duration: 1 * HOUR
  }
]

quests.forEach( quest => new Quest( quest ) )