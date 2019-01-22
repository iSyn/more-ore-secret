let Quest = function( obj, id ) {

  this.name = obj.name
  this.id = id
  this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
  this.desc = obj.desc
  this.flavor_text = obj.flavor_text
  this.img = obj.img
  this.base_duration = obj.base_duration
  this.duration = obj.duration || this.base_duration - ( this.base_duration * S.quest_speed_bonus )
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
    base_duration: 4 * SECOND, // change back to 5
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
      },
    },
  }, {
    name: 'Forgotten Cemetary',
    img: 'https://via.placeholder.com/64',
    desc: 'The harrowing Forgotten Cemetary houses the decomposed corpses of nobodies. It is told on nights where the moon shines bright, soft moans can be heard echoing the wasteland.',
    flavor_text: 'You\'ll end up here one day too...',
    base_duration: 1 * HOUR,
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
    },
  }, {
    name: 'Venal Corruption',
    img: 'https://via.placeholder.com/64',
    desc: 'The vile Venal Corruption has death and decay surrounding you. Don\'t be too loud or you might awaken the Eater of Worlds.',
    flavor_text: 'Terrarias great',
    base_duration: 4 * HOUR,
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
    desc: 'The lustrous Crystal Mines contains gems galore. Many ambitious miners are soon enveloped and overwhelmed, spending the rest of their lives mining.',
    flavor_text: 'Ooo shiny...',
    base_duration: 12 * HOUR,
    rewards: {
      achievement: 'crystallization',
      xp: 2.8 * THOUSAND,
      ores: 115 * THOUSAND,
      refined_ores: 70,
      gem: {
        chance: .7,
        level_range: [ 0, 20 ],
        gem_pool: 2
      }
    }
  }
]

let global_quest_events = [
  {
    type: 'add time to quest',
    sentences: [
      'took a wrong turn.',
      'stubbed their toe.',
      'got lost.'
    ],
    amount: [ -30 * SECOND, -1 * MINUTE, -2 * MINUTE ]
  },
  {
    type: 'subtract time to quest',
    sentences: [
      'found a shortcut.',
      'started sprinting for no reason.',
    ],
    amount: [ 30 * SECOND, 1 * MINUTE, 2 * MINUTE ]
  }
]

let load_quests = () => {
  
  return new Promise( resolve => {

    if ( localStorage.getItem( 'quests' ) ) {
      
      quests = JSON.parse( localStorage.getItem( 'quests' ) )

    }

    quests.forEach( ( q, i ) => new Quest( q, i ) )

    resolve()

  }) 

}