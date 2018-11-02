let State = function( state_obj = {} ) {

  this.state = {
    ores: state_obj.ores || 0,
    gems: state_obj.ores || 0,
    generation: 1,

    stats: {
      total_ores_earned: 0,
      total_gems_earned: 0
    },

    prefs: {
      game_speed: 30
    }
  }
  
}