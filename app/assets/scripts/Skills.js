let Skill = function( obj, index ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_').toLowerCase()
  this.id = obj.id
  this.img = obj.img
  this.desc = obj.desc
  this.skill_classes = obj.skill_classes || ''
  this.flavor_text = obj.flavor_text || ''
  this.generation_requirement = obj.generation_requirement || obj.position.col
  this.skill_requirement_names = obj.skill_requirement_names

  this.__get_skill_requirements = () => {

    console.log( 'get skill requirements firing' )

    let skill_requirements = []
    if ( this.skill_requirement_names ) {
      this.skill_requirement_names.forEach( skill_code_name => {
        
        let requirement = {}

        let target_skill = select_from_arr( Skills, skill_code_name )

        requirement.code_name = skill_code_name
        requirement.owned = target_skill.owned ? true : false

        skill_requirements.push( requirement )

      } )
    }

    return skill_requirements
  }

  this.skill_requirements = this.__get_skill_requirements() 

  this.position = obj.position
  this.unlock_function = obj.unlock_function
  this.locked = obj.locked == 0 ? 0 : 1
  this.owned = obj.owned == 1 ? 1 : 0

  Skills.push( this )

  this.level_up = ( e ) => {
    
    if ( this.locked == 0 ) {
      if ( S.generation.knowledge_points > 0 ) {
        if ( this.owned == 0 ) {
          if ( S.generation.level >= this.generation_requirement ) {
            
            S.generation.knowledge_points--
            this.owned = 1

            build_skills_header( true )
            play_sound( 'skill_level_up' )

            if ( this.unlock_function ) this.__handle_unlock_function( this.unlock_function )

          } else {
            notify( 'You do not meet the generation requirement', 'red', 'error' )
          }
        } else {
          notify( 'You already have this skill', 'red', 'error' )
        }
      } else {
        notify( 'Not enough knowledge points', 'red', 'error' )
      }
    } else {
      notify( 'This skill is locked', 'red', 'error' )
    }
  }

  this.__handle_unlock_function = ( fn ) => {
    
    if ( fn.unlock_skills ) {
      fn.unlock_skills.forEach( target_skill => {

        let skill_to_unlock = select_from_arr( Skills, target_skill[ 0 ])
        let unlocked = true

        skill_to_unlock.skill_requirements.forEach( req => {
          if ( this.code_name == req.code_name ) {
            req.owned = 1
          }
          if ( req.owned == 0 ) unlocked = false

          if ( unlocked ) {
            skill_to_unlock.locked = 0
            let skill_el = s( `#skill-${ skill_to_unlock.id }` )
            skill_el.classList.remove( 'locked' )

            draw_skill_lines()
          }
        } )

      })
    }

    if ( fn.increase_all_building_production ) S.bonus_building_production.all += fn.increase_all_building_production
    if ( fn.increase_opc ) S.opc_multiplier += S.opc_multiplier * fn.increase_opc

    O.recalculate_opc = 1
    O.recalculate_ops = 1

  }
}

let Skills = []
let skills = [
  {
    name: 'The Beginning',
    id: 1,
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production and ores per click by 50%',
    flavor_text: 'flavor test',
    position: { col: 1, row: 0 },
    locked: 0,
    unlock_function: {
      unlock_skills: [
        [ 'pickaxe_proficiency_i', 'right', 'left' ],
        [ 'managerial_proficiency_i', 'right', 'left' ]
      ],
      increase_all_building_production: .5,
      increase_opc: .5
    }
  }, {
    name: 'Pickaxe Proficiency I',
    id: 2,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all pickaxe sharpness + hardness by 5%',
    flavor_text: 'flavor text',
    position: { col: 2, row: -1 },
    skill_requirement_names: [ 'the_beginning' ],
    unlock_function: {
      unlock_skills: [
        [ 'pickaxe_proficiency_ii', 'right', 'left' ]
      ],
    }
  }, {
    name: 'Pickaxe Proficiency II',
    id: 3,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all pickaxe sharpness + hardness by 5%',
    flavor_text: 'flavor text',
    position: { col: 3, row: -1 },
    skill_requirement_names: [ 'pickaxe_proficiency_i' ],
    unlock_function: {
      unlock_skills: [
        [ 'pickaxe_proficiency_iii', 'right', 'left' ],
      ],
    }
  }, {
    name: 'Pickaxe Proficiency III',
    id: 4,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all pickaxe sharpness + hardness by 5%',
    flavor_text: 'flavor text',
    position: { col: 4, row: -1 },
    skill_requirement_names: [ 'pickaxe_proficiency_ii' ],
    unlock_function: {
      unlock_skills: [
        [ 'miners_knowledge', 'right', 'left']
      ],
    }
  }, {
    name: 'Miners Knowledge',
    id: 5,
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all pickaxe sharpness + hardness by 30%',
    flavor_text: 'flavor text',
    position: { col: 5, row: -1 },
    skill_requirement_names: [ 'pickaxe_proficiency_iii' ],
    unlock_function: {
      unlock_skills: [],
    }
  }, {
    name: 'Managerial Proficiency I',
    skill_classes: 'circle small',
    id: 6,
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 5%',
    flavor_text: 'flavor text',
    position: { col: 2, row: 1 }, 
    skill_requirement_names: [ 'the_beginning' ],
    unlock_function: {
      unlock_skills: [
        [ 'managerial_proficiency_ii', 'right', 'left' ]
      ],
      increase_all_building_production: .05,
    }
  }, {
    name: 'Managerial Proficiency II',
    id: 7,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 5%',
    flavor_text: 'flavor text',
    position: { col: 3, row: 1 }, 
    skill_requirement_names: [ 'managerial_proficiency_i' ],
    unlock_function: {
      unlock_skills: [
        [ 'managerial_proficiency_iii', 'right', 'left' ]
      ],
      increase_all_building_production: .05,
    }
  }, {
    name: 'Managerial Proficiency III',
    id: 8,
    skill_classes: 'circle small',
    img: 'https://via.placeholder.com/40',
    desc: 'Increase all building production by 5%',
    flavor_text: 'flavor text',
    position: { col: 4, row: 1 }, 
    skill_requirement_names: [ 'managerial_proficiency_ii' ],
    unlock_function: {
      unlock_skills: [],
    },
    increase_all_building_production: .05,
  }
]



skills.forEach( skill => new Skill( skill ) )
