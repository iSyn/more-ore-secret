let Skill = function( obj ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_').toLowerCase()
  this.img = obj.img
  this.desc = obj.desc
  this.skill_classes = obj.skill_classes || ''
  this.flavor_text = obj.flavor_text || ''
  this.generation_requirement = obj.generation_requirement || obj.position.row

  this.skill_requirements = obj.skill_requirements

  this.position = obj.position
  this.unlock_function = obj.unlock_function
  this.locked = obj.locked == 1 ? 1 : 0
  this.owned = obj.owned == 1 ? 1 : 0

  Skills.push( this )

  this.level_up = ( e ) => {
    if ( this.locked == 0 ) {
      if ( this.owned == 0 ) {
        if ( S.generation.level > this.generation_requirement ) {
          if ( S.generation.knowledge_points > 0 ) {
          
            S.generation.knowledge_points--
            build_skills_header( true )
  
            this.owned = 1
            play_sound( 'skill_level_up' )
  
            if ( this.unlock_function ) {
  
              let fn = this.unlock_function
  
              if ( fn.unlock_skills ) {
  
                fn.unlock_skills.forEach( skill_code_name => {
  
                  let skill_to_unlock = select_from_arr( Skills, skill_code_name )
  
                  let unlocked = true
  
                  skill_to_unlock.skill_requirements.forEach( requirement => {
                    if ( requirement.code_name == this.code_name ) {
                      requirement.owned = 1
                    }
  
                    if( requirement.owned == 0 ) unlocked = false
                  })
  
                  if ( unlocked ) {
                    skill_to_unlock.locked = 0
                    let skill_el = document.querySelector( `#skill-${ skill_code_name }`)
                    skill_el.classList.remove( 'locked' )
                  }
                  
                  draw_skill_lines()
                })
              }
  
              if ( fn.increase_opc ) S.opc_multiplier += fn.increase_opc
              if ( fn.increase_ops ) S.ops_multiplier += fn.increase_ops
  
              if ( fn.increase_pickaxe_sharpness ) S.pickaxe.permanent_bonuses.sharpness += fn.increase_pickaxe_sharpness
              if ( fn.increase_pickaxe_hardness ) S.pickaxe.permanent_bonuses.hardness += fn.increase_pickaxe_hardness
  
              O.recalculate_opc = 1
              O.recalculate_ops = 1
  
            }
  
          } else {
            notify( 'Not enough knowledge points', 'red', 'error' )
          }
        } else {
          notify ( `This skill requires Gen. ${ this.generation_requirement }`)
        }
      }
    } else {
      notify( 'This skill is locked', 'red', 'error' )
    }
  }
}

let Skills = []
let skills = [
  {
    name: 'The Beginning',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase Ores per Click and Ores per Second by 30%',
    skill_classes: 'main',
    flavor_text: 'In the beginning, there was nothing. God said, "Let there be ores!"',
    skill_requirements: [],
    position: {
      row: 1,
      column: 0
    },
    locked: 0,
    unlock_function: {
      increase_opc: .3,
      increase_ops: .3,
      unlock_skills: [ 'pickaxe_proficiency_i', 'managerial_proficiency_i' ]
    }
  }, {
    name: 'Pickaxe Proficiency I',
    img: 'https://via.placeholder.com/40',
    desc: 'Sharpness and Hardness up 5%',
    skill_classes: 'small',
    flavor_text: 'Increases your skills with handling pickaxes',
    position: {
      row: 2,
      column: -2
    },
    skill_requirements: [
      {
        code_name: 'the_beginning',
        owned: 0,
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      increase_pickaxe_sharpness: 5,
      increase_pickaxe_hardness: 5,
      unlock_skills: [ 'pickaxe_proficiency_ii' ]
    }
  }, {
    name: 'Pickaxe Proficiency II',
    img: 'https://via.placeholder.com/40',
    desc: 'Sharpness and Hardness up 5%',
    skill_classes: 'small',
    flavor_text: 'Increases your skills with handling pickaxes',
    position: {
      row: 3,
      column: -2
    },
    skill_requirements: [
      {
        code_name: 'pickaxe_proficiency_i',
        owned: 0,
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      increase_pickaxe_sharpness: 5,
      increase_pickaxe_hardness: 5,
      unlock_skills: [ 'pickaxe_proficiency_iii', 'one_for_all' ]
    }
  }, {
    name: 'Pickaxe Proficiency III',
    img: 'https://via.placeholder.com/40',
    desc: 'Sharpness and Hardness up 5%',
    skill_classes: 'small',
    flavor_text: 'Increases your skills with handling pickaxes',
    position: {
      row: 4,
      column: -2
    },
    skill_requirements: [
      {
        code_name: 'pickaxe_proficiency_ii',
        owned: 0,
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      increase_pickaxe_sharpness: 5,
      increase_pickaxe_hardness: 5,
      unlock_skills: [ 'pickaxe_handler' ]
    }
  }, {
    name: 'Pickaxe Handler',
    img: 'https://via.placeholder.com/40',
    desc: 'Sharpness and Hardness up 30%',
    skill_classes: 'main',
    flavor_text: 'test flavor text 2',
    position: {
      row: 5,
      column: -2
    },
    skill_requirements: [
      {
        code_name: 'pickaxe_proficiency_iii',
        owned: 0,
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      increase_pickaxe_sharpness: 30,
      increase_pickaxe_hardness: 30
    }
  }, {
    name: 'Managerial Proficiency I',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 2%',
    skill_classes: 'small',
    flavor_text: '',
    position: {
      row: 2,
      column: 2
    },
    skill_requirements: [
      {
        code_name: 'the_beginning',
        owned: 0,
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      unlock_skills: [ 'managerial_proficiency_ii' ],
      increase_ops: .02
    }
  }, {
    name: 'Managerial Proficiency II',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 2%',
    skill_classes: 'small',
    flavor_text: '',
    position: {
      row: 3,
      column: 2
    },
    skill_requirements: [
      {
        code_name: 'managerial_proficiency_i',
        owned: 0,
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      unlock_skills: [ 'managerial_proficiency_iii', 'one_for_all' ],
      increase_ops: .02
    }
  }, {
    name: 'Managerial Proficiency III',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 2%',
    skill_classes: 'small',
    flavor_text: '',
    position: {
      row: 4,
      column: 2
    },
    skill_requirements: [
      {
        code_name: 'managerial_proficiency_ii',
        owned: 0,
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      unlock_skills: [ 'assistant_to_the_regional_manager' ],
      increase_ops: .02
    }
  }, {
    name: 'Assistant to the Regional Manager',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 10%',
    skill_classes: 'main',
    flavor_text: '',
    position: {
      row: 5,
      column: 2
    },
    skill_requirements: [
      {
        code_name: 'managerial_proficiency_iii',
        owned: 0,
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      increase_ops: .1
    }
  }, {
    name: 'One for All',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production, pickaxe sharpness, and pickaxe hardness by 5%',
    skill_classes: 'main',
    flavor_text: '',
    position: {
      row: 3,
      column: 0
    },
    skill_requirements: [
      {
        code_name: 'pickaxe_proficiency_ii',
        owned: 0,
        draw_lines: {
          from: 'left',
          to: 'right'
        }
      }, {
        code_name: 'managerial_proficiency_ii',
        owned: 0,
        draw_lines: {
          from: 'right',
          to: 'left'
        }
      }
    ],
    locked: 1,
    unlock_function: {
      increase_ops: .05,
      increase_pickaxe_hardness: 5,
      increase_pickaxe_hardness: 5
    }
  }, 
]

skills.forEach( skill => new Skill( skill ) )
