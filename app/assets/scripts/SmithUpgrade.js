let SmithUpgrade = function( obj ) {

    this.name = obj.name
    this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
    this.img = obj.img
    this.desc = obj.desc

    if ( obj.flavor_text ) this.flavor_text = obj.flavor_text

    if ( obj.requires ) {
        this.requires = []
        obj.requires.forEach( requirement => {

            // if requirement HASNT been built before
            if ( !requirement.name ) {
                let required_skill = select_from_arr( Smith_Upgrades, requirement ) 
                this.requires.push( {
                    name: required_skill.name,
                    code_name: required_skill.code_name,
                    owned: required_skill.owned
                } )
            } else {
                this.requires.push( requirement )
            }
        })
    }

    this.duration = obj.duration
    this.price = obj.price
    this.owned = obj.owned || 0
    this.locked = obj.locked || 0
    this.unlock_functions = obj.unlock_functions


    Smith_Upgrades.push( this )

}

let Smith_Upgrades = []
let smith_upgrades = [
    // SPECIAL UPGRADES
    {
        name: 'Fragility Spectacles',
        img: 'https://via.placeholder.com/64',
        desc: 'Allows you to spot "weak spots" within the ore',
        flavor_text: 'I can see... I can FIGHT!',
        duration: 10 * SECOND,
        price: 0,
        unlock_functions: {
            unlock_fragility_spectacles: 1
        }
    }, {
        name: 'Quest Board',
        img:'https://via.placeholder.com/64',
        desc: 'Allows you to deploy Miners on quests for ancient artifacts!',
        flavor_text: 'Fetch quests are the greatest',
        duration: 30 * SECOND,
        price: 100,
        locked: 1,
        unlock_functions: {
            unlock_quest_board: 1
        }
    }, {
        name: 'A U T O M A T E R',
        img: 'https://via.placeholder.com/64',
        desc: 'Unlocks the A U T O M A T E R',
        flavor_text: 'Check out my other game Automate the World!',
        duration: 5 * MINUTE,
        price: 100,
        locked: 1,
        unlock_functions: {
            unlock_automater: 1
        }
    },

    // COMBO SHIELD UPGRADES
    {
        name: 'Combo Shield I',
        img: 'https://via.placeholder.com/64',
        desc: 'Unlocks a combo shield that protects your combo from a misclick',
        flavor_text: 'clink clink',
        duration: 30 * SECOND,
        price: 5,
        locked: 1,
        unlock_functions: {
            unlock_combo_shield: 1,
            unlock_smith_upgrades: [ 'combo_shield_ii', 'combo_shield_speed_up_i' ]
        }

    }, {
        name: 'Combo Shield II',
        img: 'https://via.placeholder.com/64',
        desc: 'Unlocks a combo shield that protects your combo from a misclick',
        duration: 30 * SECOND,
        price: 30,
        locked: 1,
        requires: [ 'combo_shield_i' ],
        unlock_functions: {
            unlock_combo_shield: 1,
            unlock_smith_upgrades: [ 'combo_shield_iii' ]
        }
    }, {
        name: 'Combo Shield III',
        img: 'https://via.placeholder.com/64',
        desc: 'Unlocks a combo shield that protects your combo from a misclick',
        duration: 30 * SECOND,
        price: 50,
        locked: 1,
        requires: [ 'combo_shield_ii'],
        unlock_functions: {
            unlock_combo_shield: 1
        }
    }, {
        name: 'Combo Shield Speed Up I',
        img: 'https://via.placeholder.com/64',
        desc: 'Decrease the time needed for another combo shield by 1 hour',
        duration: 30 * SECOND,
        price: 50,
        locked: 1,
        requires: [ 'combo_shield_i'],
        unlock_functions: {
            combo_shield_speed_up: 1 * HOUR,
            unlock_smith_upgrades: [ 'combo_shield_speed_up_ii']
        }
    }, {
        name: 'Combo Shield Speed Up II',
        img: 'https://via.placeholder.com/64',
        desc: 'Decrease the time needed for another combo shield by 1 hour',
        duration: 30 * SECOND,
        price: 100,
        locked: 1,
        requires: [ 'combo_shield_speed_up_i'],
        unlock_functions: {
            combo_shield_speed_up: 1 * HOUR,
            unlock_smith_upgrades: [ 'combo_shield_speed_up_iii']
        }
    }, {
        name: 'Combo Shield Speed Up III',
        img: 'https://via.placeholder.com/64',
        desc: 'Decrease the time needed for another combo shield by 1 hour',
        duration: 30 * SECOND,
        price: 150,
        locked: 1,
        requires: [ 'combo_shield_speed_up_ii'],
        unlock_functions: {
            combo_shield_speed_up: 1 * HOUR
        }
    },

    // SHARPEN PICKAXE UPGRADES
    {
        name: 'Sharpen Pickaxe I',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe sharpness by 10%',
        duration: 10 * SECOND,
        price: 5,
        unlock_functions: {
            increase_pickaxe_sharpness: 10,
            unlock_smith_upgrades: [ 'sharpen_pickaxe_ii' ]
        }
    }, {
        name: 'Sharpen Pickaxe II',
        img: 'https://via.placeholder.com/64', 
        desc: 'Increases your pickaxe sharpness by 10%',
        duration: 15 * SECOND,
        price: 10,
        locked: 1,
        requires: [ 'sharpen_pickaxe_i' ],
        unlock_functions: {
            increase_pickaxe_sharpness: 10,
            unlock_smith_upgrades: [ 'sharpen_pickaxe_iii' ]
        }
    }, {
        name: 'Sharpen Pickaxe III', img: 'https://via.placeholder.com/64', desc: 'Increases your pickaxe sharpness by 10%',
        duration: 1 * SECOND,
        price: 20,
        locked: 1,
        requires: [ 'sharpen_pickaxe_ii' ],
        unlock_functions: {
            increase_pickaxe_sharpness: 10,
            unlock_smith_upgrades: [ 'sharpen_pickaxe_iv' ]
        }
    }, {
        name: 'Sharpen Pickaxe IV', img: 'https://via.placeholder.com/64', desc: 'Increases your pickaxe sharpness by 10%',
        duration: 1 * SECOND,
        price: 25,
        locked: 1,
        requires: [ 'sharpen_pickaxe_iii' ],
        unlock_functions: {
            increase_pickaxe_sharpness: 10,
            unlock_smith_upgrades: [ 'sharpen_pickaxe_v' ]
        }
    }, {
        name: 'Sharpen Pickaxe V', img: 'https://via.placeholder.com/64', desc: 'Increases your pickaxe sharpness by 10%',
        duration: 1 * SECOND,
        price: 30,
        locked: 1,
        requires: [ 'sharpen_pickaxe_iv' ],
        unlock_functions: {
            increase_pickaxe_sharpness: 10
        }
    },

    // REINFORCE PICKAXE UPGRADES
    {
        name: 'Reinforce Pickaxe I',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 10%',
        duration: 10 * SECOND,
        price: 10,
        unlock_functions: {
            increase_pickaxe_hardness: 10,
            unlock_smith_upgrades: [ 'reinforce_pickaxe_ii', 'test_skill' ]
        }
    }, {
        name: 'Reinforce Pickaxe II',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 10%',
        duration: 5 * SECOND,
        price: 15,
        locked: 1,
        requires: [ 'reinforce_pickaxe_i' ],
        unlock_functions: {
            increase_pickaxe_hardness: 10,
            unlock_smith_upgrades: [ 'reinforce_pickaxe_iii' ]
        }
    }, {
        name: 'Reinforce Pickaxe III',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 10%',
        duration: 5 * SECOND,
        price: 20,
        locked: 1,
        requires: [ 'reinforce_pickaxe_ii' ],
        unlock_functions: {
            increase_pickaxe_hardness: 10,
            unlock_smith_upgrades: [ 'reinforce_pickaxe_iv' ]
        }
    }, {
        name: 'Reinforce Pickaxe IV',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 10%',
        duration: 5 * SECOND,
        price: 25,
        locked: 1,
        requires: [ 'reinforce_pickaxe_iii' ],
        unlock_functions: {
            increase_pickaxe_hardness: 10,
            unlock_smith_upgrades: [ 'reinforce_pickaxe_v' ]
        }
    }, {
        name: 'Reinforce Pickaxe V',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 10%',
        duration: 5 * SECOND,
        price: 30,
        locked: 1,
        requires: [ 'reinforce_pickaxe_iv' ],
        unlock_functions: {
            increase_pickaxe_hardness: 10
        }
    },

    // INCREASE MAXIMUM ORE GAINED WHILE AWAY UPGRADES
    {
        name: 'Ore Warehouse I',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases maximum ore gain when away by x10',
        duration: 10 * SECOND,
        price: 10,
        unlock_functions: {
            increase_maximum_ore_away_gain: 10,
            unlock_smith_upgrades: [ 'ore_warehouse_ii' ]
        }
    }, {
        name: 'Ore Warehouse II',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases maximum ore gain when away by x10',
        duration: 15 * SECOND,
        price: 20,
        locked: 1,
        requires: [ 'ore_warehouse_i' ],
        unlock_functions: {
            increase_maximum_ore_away_gain: 10,
            unlock_smith_upgrades: [ 'ore_warehouse_iii' ]
        }
    }, {
        name: 'Ore Warehouse III',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases maximum ore gain when away by x10',
        duration: 20 * SECOND,
        price: 30,
        locked: 1,
        requires: [ 'ore_warehouse_ii' ],
        unlock_functions: {
            increase_maximum_ore_away_gain: 10
        }
    },

    // INCREASE GOLD NUGGET FREQUENCY
    {
        name: 'Gold Nuggies Frequency I',
        img: 'https://via.placeholder.com/64',
        desc: 'Increase the spawn rate of gold nuggets',
        duration: 10 * SECOND,
        price: 15,
        locked: 1,
        unlock_functions: {
            increase_gold_nugget_spawn_rate: 10
        }
    }, {
        name: 'Gold Nuggies Frequency II',
        img: 'https://via.placeholder.com/64',
        desc: 'Increase the spawn rate of gold nuggets',
        duration: 10 * SECOND,
        price: 25,
        locked: 1,
        unlock_functions: {
            increase_gold_nugget_spawn_rate: 10
        }
    }, {
        name: 'Gold Nuggies Frequency III',
        img: 'https://via.placeholder.com/64',
        desc: 'Increase the spawn rate of gold nuggets',
        duration: 10 * SECOND,
        price: 35,
        locked: 1,
        unlock_functions: {
            increase_gold_nugget_spawn_rate: 10
        }
    },

    // INCREASE GOLD NUGGET SPAWN RATE
    {
        name: 'Gold Nuggies Chance Up I',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases the chance of a gold nugget spawning',
        duration: 10 * SECOND,
        price: 15,
        locked: 1,
        unlock_functions: {
            increase_gold_nugget_chance_of_spawn: 10
        }
    }, {
        name: 'Gold Nuggies Chance Up II',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases the chance of a gold nugget spawning',
        duration: 10 * SECOND,
        price: 25,
        locked: 1,
        unlock_functions: {
            increase_gold_nugget_chance_of_spawn: 10
        }
    }, {
        name: 'Gold Nuggies Chance Up III',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases the chance of a gold nugget spawning',
        duration: 10 * SECOND,
        price: 35,
        locked: 1,
        unlock_functions: {
            increase_gold_nugget_chance_of_spawn: 10
        }
    }, 
]

let unlock_smith_upgrade = ( code_name ) => {
    let upgrade = select_from_arr( Smith_Upgrades, code_name )
    upgrade.locked = 0

    build_smith_upgrades( true )
}

smith_upgrades.forEach( upgrade => new SmithUpgrade( upgrade ) )