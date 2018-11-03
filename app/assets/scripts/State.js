let State = function( s = {} ) {

  this.state = {
    ores: s.ores || 0,
    gems: s.ores || 0,
    generation: s.generation || 1,
    ops: s.ops || 0,
    opc: s.opc || 1,

    current_ore_hp: 100,
    current_ore_max_hp: 100,

    stats: {
      current_rocks_destroyed: 0,
      total_rocks_destroyed: 0,
      total_ores_earned: 0,
      total_gems_earned: 0
    },

    prefs: {
      game_speed: 30
    }
  }
  
}