let State = function( s = {} ) {

  this.state = {
    ores: s.ores || 100,
    gems: s.ores || 100,
    generation: s.generation || 1,
    ops: s.ops || 0,
    opc: s.opc || 1,
    weak_hit_multi: s.weak_hit_multi || 5,
    current_combo: s.current_combo || 0,

    current_ore_hp: 50,
    current_ore_max_hp: 50,

    tabs: [],

    pickaxe: {
      sharpness: 100,
      hardness: 100,
      
      temporary_bonuses: {
        sharpness: 0,
        hardness: 0
      }
    },

    automater: {
      automater_accordion_hidden: true,
      automater_visible: true,
      owned: 0,
      available: 0
    },

    locked: {
      fragility_spectacles: 1
    },

    stats: {
      current_rocks_destroyed: 0,
      total_rocks_destroyed: 0,
      total_ores_earned: 0,
      total_gems_earned: 100, ///////////////////////
      total_clicks: 0,
      total_weak_hit_clicks: 0,
      highest_combo: 0,
      seconds_played: 0
    },

    prefs: {
      game_speed: 30,
      sfx_volume: 0,
      bgm_volume: 1,
      show_rising_numbers: true,
      show_ops_rising_numbers: true,
    }

  }
  
}