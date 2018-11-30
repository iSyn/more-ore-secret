let State = function( s = {} ) {

  this.state = {
    ores: s.ores || 0,
    gems: s.gems || 0,
    generation: s.generation || 1,

    ops: s.ops || 0,
    ops_multiplier: 0,

    opc: s.opc || 0,
    opc_multiplier: 0,

    weak_hit_multi: s.weak_hit_multi || 5,
    current_combo: s.current_combo || 0,

    combo_shield: s.combo_shield || {
      owned: 1,
      available: 1
    },

    current_ore_hp: s.current_ore_hp || 50,
    current_ore_max_hp: s.current_ore_max_hp || 50,

    tabs: [],

    max_ore_away_gain: s.max_ore_away_gain || 1 * MILLION, 

    gold_nugget_spawn_rate: s.gold_nugget_spawn_rate || 60, // 
    gold_nugget_chance_to_spawn: s.gold_nugget_chance_to_spawn || 30, // 30% chance to spawn

    pickaxe: s.pickaxe || {
      level: 1,
      damage: 1,
      hardness: 100,
      sharpness: 100,
      name: "Wooden Starter Pickaxe",
      material: { name: 'Wood' },
      rarity: { name: 'Common' },
      
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

    locked: s.locked || {
      fragility_spectacles: 1,
      quest_board: 1,
      refine_btn: 1,
      combo_sign: 1
    },

    last_login: null,

    stats: s.stats || {
      highest_combo: 0,
      total_clicks: 0,
      total_weak_hit_clicks: 0,
      times_refined: 0,
      last_refine_time: null,
      current_rocks_destroyed: 0,
      current_ores_earned: 0,
      current_ores_manually_mined: 0,
      total_rocks_destroyed: 0,
      total_ores_manually_mined: 0,
      total_ores_earned: 0,
      total_gems_earned: 0, ///////////////////////
      total_nuggets_spawned: 0,
      total_nuggets_missed: 0,
      total_nuggets_clicked: 0,
      total_pickaxes_trashed: 0,
      seconds_played: 0,
      first_day: new Date().getTime()
    },

    prefs: s.prefs || {
      game_speed: 30,
      sfx_volume: .1,
      bgm_volume: 1,
      show_rising_numbers: true,
      show_ops_rising_numbers: true,
    },

    misc: s.misc || {
      current_ore_sprite: 1,
      ore_sprite_amount: 2
    }
  }
}
