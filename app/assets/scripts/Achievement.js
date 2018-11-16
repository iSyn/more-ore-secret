let Achievement = function( obj ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_').toLowerCase()
  this.img = obj.img || "http://via.placeholder.com/32"
  this.type = obj.type || ''
  this.desc = obj.desc
  this.reward = obj.reward || null
  this.won = 0

  this.win = () => {
    this.won = 1

    let r = this.reward
    if ( r ) {
      if ( r.increase_building_production ) {
        let building = select_from_arr( Buildings, r.increase_building_production.building_code_name )
        building.production *= r.increase_building_production.multiplier_amount
      }

      if ( r.increase_weak_hit_multi ) {
        S.weak_hit_multi += r.increase_weak_hit_multi
      }

      if ( r.increase_pickaxe_hardness ) S.pickaxe.hardness += r.increase_pickaxe_hardness
      if ( r.increase_pickaxe_sharpness ) S.pickaxe.sharpness += r.increase_pickaxe_sharpness
    }
  }

  Achievements.push( this )
}

let Achievements = []
let achievements = [
  // COMBO RELATED ACHIEVEMENTS
  { name: 'Combo Baby', desc: 'Reach a 5 hit combo', type: 'combo' },
  { name: 'Combo Pleb', desc: 'Reach a 20 hit combo', type: 'combo' },
  { name: 'Combo Squire', desc: 'Reach a 50 hit combo', type: 'combo', reward: { increase_weak_hit_multi: .5 } },
  { name: 'Combo Knight', desc: 'Reach a 100 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 1 } },
  { name: 'Combo King', desc: 'Reach a 200 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 1 } },
  { name: 'Combo Master', desc: 'Reach a 350 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 2 } },
  { name: 'Combo Devil', desc: 'Reach a 666 hit combo', type: 'combo', reward: { increase_weak_hit_mutli: 3 } },
  { name: 'Combo God', desc: 'Reach a 777 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 3 } },
  { name: 'Combo Saiyan', desc: 'Read a 1000 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 4 } },
  { name: 'Combo Saitama', desc: 'Reach a 10000 hit combo', type: 'combo', reward: { increase_weak_hit_multi: 5 } },

  // MINING RELATED ACHIEVEMENTS
  { name: 'Newbie Miner', desc: 'Break your first rock', reward: { increase_pickaxe_hardness: 5, increase_pickaxe_sharpness: 5 } },
  { name: 'Novice Miner', desc: 'Break 10 rocks', reward: { increase_pickaxe_hardness: 10, increase_pickaxe_sharpness: 10 } },
  { name: 'Intermediate Miner', desc: 'Break 25 rocks', reward: { increase_pickaxe_hardness: 10, increase_pickaxe_sharpness: 10} },
  { name: 'Advanced Miner', desc: 'Break 100 rocks', reward: { increase_pickaxe_hardness: 10, increase_pickaxe_sharpness: 10 } },

  // SECRET ACHIEVEMENTS
  { name: 'Who am I?', desc: 'Figure out the developers name', type: 'secret' }

]

achievements.forEach( achievement => {
  new Achievement( achievement )
})