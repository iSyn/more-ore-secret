let Skill = function( obj ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_').toLowerCase()
  this.img = obj.img
  this.desc = obj.desc
  this.skill_classes = obj.skill_classes || ''
  this.flavor_text = obj.flavor_text || ''
  this.generation_requirement = obj.generation_requirement
  this.skill_requirements = obj.skill_requirements
  this.position = {
    column: obj.column_position,
    row: obj.generation_requirement
  }
  this.unlock_function = obj.unlock_function
  this.locked = obj.locked == 1 ? 1 : 0
  this.owned = obj.owned == 1 ? 1 : 0

  Skills.push( this )

  this.level_up = ( e ) => {
    if ( this.locked == 0 ) {
      if ( this.owned == 0 ) {
        if ( S.generation.knowledge_points > 0 ) {
          
          S.generation.knowledge_points--

          this.owned = 1

          if ( this.unlock_function ) {

            let fn = this.unlock_function

            if ( fn.increase_opc ) S.opc_multiplier += fn.increase_opc
            if ( fn.increase_ops ) S.ops_multiplier += fn.increase_ops

            O.recalculate_opc = 1
            O.recalculate_ops = 1

          }

        } else {
          notify( 'Not enough knowledge points', 'red', 'error' )
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
    desc: 'In the beginning, there was nothing... Then there was ore. Increase Ores per Click and Ores per Second by 30%',
    skill_classes: 'main',
    flavor_text: 'And on the 8th day...',
    generation_requirement: 1,
    skill_requirements: [],
    column_position: 0,
    locked: 0,
    unlock_function: {
      increase_opc: .3,
      increase_ops: .3
    }
  }, {
    name: 'Test Skill 1',
    img: 'https://via.placeholder.com/40',
    desc: 'test desc 1',
    flavor_text: 'test flavor text 1',
    generation_requirement: 2,
    skill_requirements: [
      {
        code_name: 'the_beginning',
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    column_position: -1,
    locked: 1,
    unlock_function: {}
  }, {
    name: 'Test Skill 2',
    img: 'https://via.placeholder.com/40',
    desc: 'test desc 2',
    flavor_text: 'test flavor text 2',
    generation_requirement: 3,
    skill_requirements: [
      {
        code_name: 'the_beginning',
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    column_position: 1,
    locked: 1,
    unlock_function: {}
  }, {
    name: 'Test Skill 3',
    img: 'https://via.placeholder.com/40',
    desc: 'test desc 3',
    flavor_text: 'test flavor text 3',
    generation_requirement: 8,
    skill_requirements: [
      {
        code_name: 'test_skill_1',
        draw_lines: {
          from: 'top',
          to: 'bottom'
        }
      }
    ],
    column_position: -1,
    locked: 1,
    unlock_function: {}
  }
]

skills.forEach( skill => new Skill( skill ) )
