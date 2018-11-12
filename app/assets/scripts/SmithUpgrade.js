let SmithUpgrade = function( obj ) {

    this.name = obj.name
    this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
    this.img = obj.img
    this.desc = obj.desc
    this.flavor_text = obj.flavor_text
    this.duration = obj.duration
    this.repeat = obj.repeat || 0
    if ( this.repeat ) this.level = obj.level || 0
    this.price = obj.price
    this.owned = obj.owned || 0
    this.hidden = obj.hidden || 0

    this.repeat ? 
        Repeatable_Smith_Upgrades.push( this ) : 
            Smith_Upgrades.push( this )
}

let Smith_Upgrades = []
let Repeatable_Smith_Upgrades = []

let smith_upgrades = [,
    {
        name: 'Sharpen Pickaxe',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe sharpness by 5%',
        flavor_text: 'Whetstone it 20 degrees each side',
        duration: 1,
        repeat: 1,
        price: 10,
        price_scale: 1.35,
    }, {
        name: 'Reinforce Pickaxe',
        img: 'https://via.placeholder.com/64',
        desc: 'Increases your pickaxe hardness by 5%',
        flavor_text: 'Diamond encrusted',
        duration: 5,
        repeat: 1,
        price: 10,
        price_scale: 1.35,
    }, {
        name: 'A U T O M A T E R',
        img: 'https://via.placeholder.com/75',
        desc: 'Unlocks the A U T O M A T E R',
        flavor_text: 'beep bop robot noise',
        duration: 5 * 60,
        price: 1
    }
]

smith_upgrades.forEach( upgrade => {
    new SmithUpgrade( upgrade )
})

console.log( Smith_Upgrades, Repeatable_Smith_Upgrades )