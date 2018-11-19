let Upgrade = function( obj ) {

    this.name = obj.name
    this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
    this.img = obj.img
    this.desc = obj.desc
    this.flavor_text = obj.flavor_text || ''
    this.price = obj.price
    this.hidden = obj.hasOwnProperty( 'hidden' ) ? obj.hidden : 1
    this.owned = obj.owned || false
    this.buy_functions = obj.buy_functions

    this.buy = () => {
        if ( S.ores >= this.price ) {
            S.ores -= this.price
            play_sound( 'buy_sound' )
            this.owned = 1

            if ( this.buy_functions ) {
                if ( this.buy_functions.increase_building_production ) {
                    let building = select_from_arr( Buildings, this.buy_functions.increase_building_production.building )
                    building.production *= this.buy_functions.increase_building_production.multi
                }
            }

            O.rebuild_store = 1
            O.recalculate_opc = 1
            O.recalculate_ops = 1

        }
    }

    Upgrades.push( this )
}

let Upgrades = []
let upgrades = JSON.parse( localStorage.getItem( 'upgrades' ) ) || [
    // SCHOOL RELATED UPGRADES
    {
        name: 'Composition Notebooks',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'No. 2 Pencil',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Schools',
        flavor_text: 'Test ready!',
        price: 1000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 3 }
        }
    }, {
        name: '3 Ring Binder',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'Be the Lord of the Rings with our new 2.5\" binder!',
        price: 12000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Looseleaf',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Schools',
        flavor_text: '"Can I borrow a sheet?"',
        price: 450000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 3 }
        }
    }, {
        name: 'Schoolbag',
        img: 'https://via.placeholder.com/50',
        desc: 'Quintuples the production of Schools',
        flavor_text: 'Break your back carrying one of these stylish bags!',
        price: 5500000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 5 }
        }
    },
    //FARM RELATED UPGRADES
    {
        name: 'Manure Spreader',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Farms',
        flavor_text: 'The poop helps the ore mature',
        price: 950,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }
]


upgrades.forEach( upgrade => {
    new Upgrade( upgrade ) 
})

let unlock_upgrade = ( code_name ) => {
    let upgrade = select_from_arr( Upgrades, code_name )
    upgrade.hidden = false
    O.rebuild_store = 1
}