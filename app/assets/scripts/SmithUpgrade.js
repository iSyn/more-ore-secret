let SmithUpgrade = function( obj ) {

    this.name = obj.name
    this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
    this.img = obj.img
    this.desc = obj.desc
    if ( obj.flavor_text ) this.flavor_text = obj.flavor_text
    if ( obj.requires ) this.requires = obj.requires
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
            increase_pickaxe_sharpness: 10
        }
    }, {
        name: 'Reinforce Pickaxe I',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 10%',
        duration: 5,
        price: 10,
        unlock_functions: {
            increase_pickaxe_hardness: 10
        }
    }, {
        name: 'A U T O M A T E R',
        img: 'https://via.placeholder.com/64',
        desc: 'Unlocks the A U T O M A T E R',
        duration: 1,
        // duration: 5 * 60,
        price: 1
    }
]

smith_upgrades.forEach( upgrade => {
    new SmithUpgrade( upgrade )
})