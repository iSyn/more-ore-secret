let Building = function( obj ) {
    this.name = obj.name
    this.name_plural = obj.name_plural
    this.code_name = obj.name.replace(/ /g, '_').toLowerCase()
    this.img = obj.img
    this.desc = obj.desc
    this.flavor_text = obj.flavor_text
    this.production = obj.production
    this.base_price = obj.base_price
    this.current_price = obj.current_price || obj.base_price
    this.price_scale = obj.price_scale
    this.owned = obj.owned || 0
    this.hidden = obj.hidden

    this.buy = ( e ) => {
        if ( S.ores >= this.current_price ) {
            spend( this.current_price )
            RN.new( e, 'successful-buy')
            SFX.buy_sound.play()
            this.owned++
            this.current_price = this.base_price * Math.pow( this.price_scale, this.owned )
            calculate_ops()

            __update_hidden( this.code_name )

            build_store()
        }
    }

    let __update_hidden = ( code_name ) => {
        let buying = select_from_arr( Buildings, code_name )
    
        if ( Buildings[ buying.index + 1 ] ) {
            Buildings[ buying.index + 1 ].hidden = 0
        }
    
        if ( Buildings[ buying.index + 2 ] ) {
            Buildings[ buying.index + 2 ].hidden = 1
        }
    
        if ( Buildings[ buying.index + 3 ] ) {
            Buildings[ buying.index + 3 ].hidden = 1
        }
    }

    Buildings.push( this )
}

let Buildings = []
let buildings = [
    {
        name: 'School',
        name_plural: 'Schools',
        img: 'https://via.placeholder.com/64',
        desc: 'Teach students about the wonders of ore',
        flavor_text: '"Jesus christ Marie, they\'re minerals!"',
        production: .3,
        base_price: 6,
        price_scale: 1.15,
        hidden: 0
    }, {
        name: 'Farm',
        name_plural: 'Farms',
        img: 'https://via.placeholder.com/64',
        desc: 'Cultivate the lands for higher quality ores',
        flavor_text: 'This totally makes sense',
        production: 1,
        base_price: 210,
        price_scale: 1.15,
        hidden: 1
    }, {
        name: 'Quarry',
        name_plural: 'Quarries',
        img: 'https://via.placeholder.com/64',
        desc: 'Designated Mining Area',
        flavor_text: 'diggy diggy hole',
        production: 20,
        base_price: 2520,
        price_scale: 1.15,
        hidden: 1
    }, {
        name: 'Church',
        name_plural: 'Churches',
        img: 'https://via.placeholder.com/64',
        desc: 'Praise to the Ore Gods',
        flavor_text: 'In Ore name we pray, Amen',
        production: 320,
        base_price: 37800,
        price_scale: 1.15,
        hidden: 2
    }, {
        name: 'Factory',
        name_plural: 'Factories',
        img: 'https://via.placeholder.com/64',
        desc: 'Manufacture your ores',
        flavor_text: 'Assembly line this SH%* up!',
        production: 4480,
        base_price: 491400,
        price_scale: 1.15,
        hidden: 2
    }, {
        name: 'Crypt',
        name_plural: 'Crypts',
        img: 'https://via.placeholder.com/64',
        desc: 'Raise dead ores from the graves',
        flavor_text: 'Spooky ores',
        production: 67200,
        base_price: 7862400,
        price_scale: 1.15,
        hidden: 2
    }, {
        name: 'Hospital',
        name_plural: 'Hospitals',
        img: 'https://via.placeholder.com/64',
        desc: 'Heal your damaged ores',
        flavor_text: 'An apple a day keeps the ore cancer away',
        production: 1344000,
        base_price: 196560000,
        price_scale: 1.15,
        hidden: 2
    }, {
        name: 'Citadel', 
        name_plural: 'Citadels', 
        img: 'https://via.placeholder.com/64',
        desc: 'wip', 
        flavor_text: 'wip', 
        production: 14784000, 
        base_price: 2751840000, 
        price_scale: 1.15,
        hidden: 2,
    }, {
        name: 'Xeno Spaceship', 
        name_plural: 'Xeno Spaceships', 
        img: 'https://via.placeholder.com/64',
        desc: 'wip', 
        flavor_text: 'wip', 
        production: 192192000, 
        base_price: 49533120000, 
        price_scale: 1.15,
        hidden: 2,
    }, {
        name: 'Sky Castle', 
        name_plural: 'Sky Castles', 
        img: 'https://via.placeholder.com/64',
        desc: 'Use magic beans to reach an egg based source of ore', 
        flavor_text: 'wip', 
        production: 3843840000, 
        base_price: 1238328000000, 
        price_scale: 1.15,
        hidden: 2,
    }, {
        name: 'Eon Portal', 
        name_plural: 'Eon Portals', 
        img: 'https://via.placeholder.com/64',
        desc: 'Steal ore from your past and future self', 
        flavor_text: 'wip', 
        production: 45126080000, 
        base_price: 18574920000000, 
        price_scale: 1.15,
        hidden: 2,
    }, {
        name: 'Sacred Mine', 
        name_plural: 'Sacred Mines', 
        img: 'https://via.placeholder.com/64',
        desc: 'wip', 
        flavor_text: 'wip', 
        production: 691891200000, 
        base_price: 297198720000000, 
        price_scale: 1.15,
        hidden: 2,
    }, {
        name: 'O.A.R.D.I.S.', 
        name_plural: 'O.A.R.D.I.S.s', 
        img: 'https://via.placeholder.com/64',
        desc: 'wip', 
        flavor_text: 'wip', 
        production: 17289780000000, 
        base_price: 8915961600000000, 
        price_scale: 1.15,
        hidden: 2,
    }, {
        name: 'Final Destination', 
        name_plural: 'Final Destinations', 
        img: 'https://via.placeholder.com/64',
        desc: 'The Final Destination', 
        flavor_text: 'wip', 
        production: 999999999999999999, 
        base_price: 999999999999999999999999999999999, 
        price_scale: 1.15,
        hidden: 2,
    }
]

buildings.forEach( building => {
    new Building( building )
})

