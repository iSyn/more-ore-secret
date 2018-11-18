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
    {
        name: 'Fragility Spectacles',
        img: 'https://via.placeholder.com/64',
        desc: 'Allows you to spot "weak spots" within the ore',
        flavor_text: 'I can see... I can FIGHT!',
        duration: 10,
        price: 1,
        unlock_functions: {
            unlock_fragility_spectacles: 1
        }
    }, {
        name: 'Sharpen Pickaxe I',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe sharpness by 10%',
        duration: 1,
        price: 10,
        unlock_functions: {
            increase_pickaxe_sharpness: 10,
            unlock_smith_upgrades: [ 'sharpen_pickaxe_ii', 'test_skill' ]
        }
    }, {
        name: 'Sharpen Pickaxe II', img: 'https://via.placeholder.com/64', desc: 'Increases your pickaxe sharpness by 10%',
        duration: 1,
        price: 10,
        locked: 1,
        requires: [ 'sharpen_pickaxe_i' ],
        unlock_functions: {
            increase_pickaxe_sharpness: 10,
            unlock_smith_upgrades: [ 'sharpen_pickaxe_iii' ]
        }
    }, {
        name: 'Sharpen Pickaxe III', img: 'https://via.placeholder.com/64', desc: 'Increases your pickaxe sharpness by 10%',
        duration: 1,
        price: 10,
        locked: 1,
        requires: [ 'sharpen_pickaxe_ii' ],
        unlock_functions: {
            increase_pickaxe_sharpness: 10,
            unlock_smith_upgrades: [ 'sharpen_pickaxe_iv' ]
        }
    }, {
        name: 'Sharpen Pickaxe IV', img: 'https://via.placeholder.com/64', desc: 'Increases your pickaxe sharpness by 10%',
        duration: 1,
        price: 10,
        locked: 1,
        requires: [ 'sharpen_pickaxe_iii' ],
        unlock_functions: {
            increase_pickaxe_sharpness: 10,
            unlock_smith_upgrades: [ 'sharpen_pickaxe_v' ]
        }
    }, {
        name: 'Sharpen Pickaxe V', img: 'https://via.placeholder.com/64', desc: 'Increases your pickaxe sharpness by 10%',
        duration: 1,
        price: 10,
        locked: 1,
        requires: [ 'sharpen_pickaxe_iv' ],
        unlock_functions: {
            increase_pickaxe_sharpness: 10
        }
    }, {
        name: 'Reinforce Pickaxe I',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 10%',
        duration: 5,
        price: 10,
        unlock_functions: {
            increase_pickaxe_hardness: 10,
            unlock_smith_upgrades: [ 'reinforce_pickaxe_ii', 'test_skill' ]
        }
    }, {
        name: 'Reinforce Pickaxe II',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 10%',
        duration: 5,
        price: 10,
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
        duration: 5,
        price: 10,
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
        duration: 5,
        price: 10,
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
        duration: 5,
        price: 10,
        locked: 1,
        requires: [ 'reinforce_pickaxe_iv' ],
        unlock_functions: {
            increase_pickaxe_hardness: 10
        }
    }, {
        name: 'TEST SKILL',
        img: 'https://via.placeholder.com/64',
        desc: 'TEST',
        duration: 5,
        price: 10,
        locked: 1,
        requires: [ 'reinforce_pickaxe_i', 'sharpen_pickaxe_i' ]
    }, {
        name: 'A U T O M A T E R',
        img: 'https://via.placeholder.com/64',
        desc: 'Unlocks the A U T O M A T E R',
        flavor_text: 'Check out my other game Automate the World!',
        duration: 1,
        // duration: 5 * 60,
        price: 1
    }
]

smith_upgrades.forEach( upgrade => new SmithUpgrade( upgrade ) )