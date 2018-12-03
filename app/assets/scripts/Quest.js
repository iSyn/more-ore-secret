let Quest = function( obj ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
  this.img = obj.img
  this.locked = 1
  if ( obj.locked == 0 ) this.locked = 0

  Quests.push( this )
}

let Quests = []

let quests = [
  {
    name: 'Abandoned Mineshaft',
    img: 'https://via.placeholder.com/64',
    duration: 5 * MINUTE,
    locked: 0
  }, {
    name: 'Quest 2',
    img: 'https://via.placeholder.com/64',
    duration: 10 * MINUTE
  }
]

quests.forEach( quest => new Quest( quest ) )