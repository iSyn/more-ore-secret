let State = function( s = {} ) {

  this.state = {
    ores: s.ores || 0,
    gems: s.ores || 0,
    generation: s.generation || 1,
    ops: s.ops || 0,
    opc: s.opc || 1,

    stats: {
      total_ores_earned: 0,
      total_gems_earned: 0
    },

    prefs: {
      game_speed: 30
    }
  }
  
}