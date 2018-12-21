let Quest = function( obj, id ) {

  this.name = obj.name
  this.id = id
  this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
  this.desc = obj.desc
  this.flavor_text = obj.flavor_text
  this.img = obj.img
  this.duration = obj.duration
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
    img: 'https://via.placeholder.com/64',
    desc: 'The gloomy Dark Forest is a mysterious place devoid of life. The ones who are enter are forever lost wandering.',
    flavor_text: 'Note: Not the forest Logan Paul went to.',
    duration: 5 * MINUTE,
    locked: 0,
    rewards: {
      achievement: 'not_that_dark!',
      xp: 50,
      ores: 1 * THOUSAND,
      refined_ores: 1,
      gem: {
        chance: .4,
        level_range: [ 1, 1 ],
        gem_pool: 0
      }
    },
  }, {
    name: 'Forgotten Cemetary',
    img: 'https://via.placeholder.com/64',
    desc: 'The harrowing Forgotten Cemetary houses the decomposed corpses of nobodies. It is told on nights where the moon shines bright, soft moans can be heard echoing the wasteland.',
    flavor_text: 'You\'ll end up here one day too...',
    duration: 1 * HOUR,
    rewards: {
      achievement: 'spooky_scary_skeletons',
      xp: 450,
      ores: 9.5 * THOUSAND,
      refined_ores: 7,
      gem: {
        chance: .35,
        level_range: [ 1, 3 ],
        gem_pool: 1
      }
    }
  }, {
    name: 'Venal Corruption',
    img: 'https://via.placeholder.com/64',
    desc: 'The vile Venal Corruption has death and decay surrounding you. Don\'t be too loud or you might awaken the Eater of Worlds.',
    flavor_text: 'Terrarias great',
    duration: 4 * HOUR,
    rewards: {
      achievement: 'worm_scarf',
      xp: 1000,
      ores: 30 * THOUSAND,
      refined_ores: 20,
      gem: {
        chance: .3,
        level_range: [ 3, 7 ],
        gem_pool: 1
      }
    }
  }, {
    name: 'Crystal Mines',
    img: 'https://via.placeholder.com/64',
    desc: 'The lustrous Crystal Mines contains gems galore. Many ambitious miners are soon invelopped and overwhelmed, spending the rest of their lives mining.',
    flavor_text: 'Ooo shiny...',
    duration: 12 * HOUR,
    rewards: {
      achievement:
    }
  }
]

// quests.forEach( ( quest, index ) => new Quest( quest, index ) )

let load_quests = () => {
  
  return new Promise( resolve => {

    if ( localStorage.getItem( 'quests' ) ) {
      
      quests = JSON.parse( localStorage.getItem( 'quests' ) )

      quests.forEach( ( q, i ) => new Quest( q, i ) )

    }

    resolve()

  }) 

}