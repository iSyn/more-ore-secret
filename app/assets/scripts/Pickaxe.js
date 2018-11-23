let Pickaxe = function() {

    this.level = _get_level()
    this.rarity = _get_rarity()
    this.material = _get_material()
    this.prefix = _get_prefix()

    this.multiplier = _get_multiplier( this )

    this.damage = _get_damage()
    this.sharpness = _get_sharpness( this )
    this.hardness = _get_hardness( this )

    this.name = _get_name( this )

    return this
}

_get_rarity = () => {

    let chance = Math.random()

    let rarities = [
        { name: 'Common',       multiplier: 0 },
        { name: 'Uncommon',     multiplier: .05 },
        { name: 'Rare',         multiplier: .3 },
        { name: 'Magic',        multiplier: .6 },
        { name: 'Unique',       multiplier: 1 },
        { name: 'Legendary',    multiplier: 2 },
        { name: 'Mythic',       multiplier: 4 },
    ]

    let rarity = rarities[ 0 ]

    if ( chance < .6 )  rarity = rarities[ 1 ]
    if ( chance < .4 )  rarity = rarities[ 2 ]
    if ( chance < .3 )  rarity = rarities[ 3 ]
    if ( chance < .1 )  rarity = rarities[ 4 ]
    if ( chance < .03 ) rarity = rarities[ 5 ]
    if ( chance < .01 ) rarity = rarities[ 6 ]

    return rarity
}

_get_level = () => {

    let level = S.generation + ( get_random_num( -S.generation, S.generation ))
    if ( level <= 0 ) level = 1

    return level

}

_get_material = () => {

    let chance = Math.random()

    let materials = [
        {
            names: [ 'Wood', 'Plastic', 'Cardboard', 'Glass', 'Tin' ],
            multiplier: 0
        }, {
            names: [ 'Stone', 'Bronze', 'Copper', 'Bone', 'Lead' ],
            multiplier: .05
        }, {
            names: [ 'Iron', 'Silver', 'Gold' ],
            multiplier: .1
        }, {
            names: [ 'Steel', 'Platinum' ],
            multiplier: .5
        }, {
            names: [ 'Diamond', 'Adamantite', 'Titanium', 'Alien' ],
            multiplier: 2
        }
    ]

    let material = materials[ 0 ]

    if ( chance < .5 ) material = materials[ 1 ]
    if ( chance < .2 ) material = materials[ 2 ]
    if ( chance < .1 ) material = materials[ 3 ]
    if ( chance < .05 ) material = materials[ 4 ]

    material.name = select_random_from_arr( material.names )

    return {
        name: material.name,
        multiplier: material.multiplier
    }

}

_get_prefix = () => {

    let prefixes = [

        // GOOD PREFIXES
        [
            {
                stat: 'sharpness',
                multiplier: .2,
                names: [ 'Pointy', 'Sharp', 'Razor', 'Acute', 'Fine' ]
            }, {
                stat: 'hardness',
                multiplier: .2,
                names: [ 'Durable', 'Hefty', 'Hard', 'Reliable', 'Strong' ]
            }, {
                stat: 'both',
                multiplier: .2,
                names: [ 'Refined', 'Gigantic', 'Polished' ]
            }
        ],

        // BAD PREFIXES
        [
            {
                stat: 'sharpness',
                multiplier: -.3,
                names: [ 'Dull', 'Blunt' ]
            }, {
                stat: 'hardness',
                multiplier: -.3,
                names: [ 'Soft', 'Squishy', 'Thin' ]
            }, {
                stat: 'both',
                multiplier: -.3,
                names: [ 'Tiny', 'Awkward', 'Shoddy', 'Broken', 'Busted', 'Cracked', 'Chipped', 'Damaged', 'Defective' ]
            }
        ]

    ]

    if ( Math.random() <= .5 ) {

        let prefix = {}

        let chance = Math.random()

        if ( chance < .7 ) {
            prefix = select_random_from_arr( prefixes[ 0 ] )
        } else {
            prefix = select_random_from_arr( prefixes[ 1 ] )
        }

        prefix.name = select_random_from_arr( prefix.names )

        return {
            name: prefix.name,
            multiplier: prefix.multiplier
        }

    }

}

_get_multiplier = ( p ) => {

    let multiplier = 0

    multiplier += p.rarity.multiplier
    multiplier += p.material.multiplier

    if ( p.prefix ) multiplier += p.prefix.multiplier

    return multiplier

}

_get_damage = () => {

    let damage = S.generation + ( get_random_num( -S.generation, S.generation ))

    if ( damage <= 0 ) damage = 1

    return damage

}

_get_sharpness = ( p ) => {

    let sharpness = get_random_num( 50, 100 )

    sharpness += p.multiplier * sharpness

    return sharpness
}   

_get_hardness = ( p ) => {

    let hardness = get_random_num( 50, 100 )

    hardness += p.multiplier * hardness

    return hardness
}

_get_name = ( p ) => {

    let name = ''

    if ( p.prefix ) {
        name += p.prefix.name + ' '
    }

    name += `${ p.material.name } Pickaxe`



    return name

}
