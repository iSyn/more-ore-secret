let Achievement = function( obj ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_').toLowerCase()
  this.type = obj.type || 'achievement'
  this.desc = obj.desc
  this.flavor_text = obj.flavor_text
  this.unlock_function = obj.unlock_function || null
  this.won = 0

  this.win = () => {
    this.won = 1

    if ( this.unlock_function ) {
      if ( this.unlock_function.increase_building_production ) {
        let building = select_from_arr( Buildings, this.unlock_function.increase_building_production.building_code_name )
        building.production *= this.unlock_function.increase_building_production.multiplier_amount
      }
    }
  }

  Achievements.push( this )
}

let Achievements = []
let achievements = [
  { name: 'Combo Baby', desc: 'Reach a 5 hit combo', flavor_text: 'Carpel Tunnel Syndrome, here we come!' },

]

achievements.forEach( achievement => {
  new Achievement( achievement )
})