let Achievement = function( obj ) {

  this.name = obj.name
  this.code_name = obj.name.replace( / /g, '_').toLowerCase()
  this.img = obj.img || "http://via.placeholder.com/32"
  this.type = obj.type || ''
  this.desc = obj.desc
  this.reward = obj.reward || null
  this.won = obj.won || 0
  this.time_won = obj.time_won || null
  if ( obj.flavor_text ) this.flavor_text = obj.flavor_text

  this.win = () => {
    this.won = 1
    this.time_won = new Date().getTime()

    let r = this.reward
    if ( r ) {
      if ( r.increase_building_production ) {
        let building = select_from_arr( Buildings, r.increase_building_production.building_code_name )
        building.production *= r.increase_building_production.multiplier_amount
      }

      if ( r.increase_weak_hit_multi ) {
        S.weak_hit_multi += r.increase_weak_hit_multi
      }

      if ( r.increase_pickaxe_hardness ) S.pickaxe.permanent_bonuses.hardness += r.increase_pickaxe_hardness
      if ( r.increase_pickaxe_sharpness ) S.pickaxe.permanent_bonuses.sharpness += r.increase_pickaxe_sharpness
    }
  }

  Achievements.push( this )
}

let Achievements = []
let achievements = [

  // { name: 'Schoolboy', desc: 'Have 10 Schools' },

  // REFINE RELATED ACHIEVEMENTS
  { name: 'Babies First Refine', desc: 'Refine for your first time' },
  { name: 'Quick Refiner', desc: 'Refine within 10 minutes of your last refine' },
  { name: 'Swift Refiner', desc: 'Refine within 5 minutes of your last refine' },
  { name: 'Speedy Refiner', desc: 'Refine within 1 minutes of your last refine' },
  { name: 'Flash Refiner', desc: 'Refine within 10 seconds of your last refine' },

  // TRASH PICKAXE RELATED ACHIEVEMENTS
  { name: 'Trasher', desc: 'Trash 5 pickaxes', flavor_text: 'Screw the environment, amirite!?' },
  { name: 'Polluter', desc: 'Trash 10 pickaxes' },
  { name: 'Scrapper', desc: 'Trash 20 pickaxes' },
  { name: 'Scrap Master', desc: 'Trash 40 pickaxes' },

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
  { name: 'Novice Miner', desc: 'Break 10 rocks' },
  { name: 'Intermediate Miner', desc: 'Break 25 rocks', reward: { increase_pickaxe_hardness: 15, increase_pickaxe_sharpness: 15 } },
  { name: 'Advanced Miner', desc: 'Break 100 rocks', reward: { increase_pickaxe_hardness: 30, increase_pickaxe_sharpness: 30 } },

  // QUEST RELATED ACHEIVEMENTS
  { name: 'Novice Quester', desc: 'Complete the first quest', type: 'quest' },
  { name: 'Adventurer', desc: 'Complete the first 5 quests', type: 'quest' },

  // SECRET ACHIEVEMENTS
  { name: 'Who am I?', desc: 'Figure out the developers name', type: 'secret' },

]

achievements.forEach( achievement => {
  new Achievement( achievement )
})