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
    // FARM RELATED UPGRADES
    {
        name: 'Manure Spreader',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Farms',
        flavor_text: 'The poop helps the ore mature',
        price: 950,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Pitchfork',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Farms',
        flavor_text: 'Torches not included',
        price: 12500,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 3 }
        }
    }, {
        name: 'Tractor',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Farms',
        flavor_text: 'im in me mums tractor',
        price: 265000,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Rotary Cutter',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Farms',
        flavor_text: 'Not even grass can stop us now',
        price: 3450000,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 3 }
        }
    }, {
        name: 'Hoe',
        img: 'https://via.placeholder.com/50',
        desc: 'Quintuples the production of Farms',
        flavor_text: 'Torches not included',
        price: 69000000,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 5 }
        }
    },
    // QUARRY RELATED UPGRADES
    {
        name: 'Floodlights',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Quarries',
        flavor_text: 'Staring into one of them is like staring into a billion suns',
        price: 1900,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Twill Rope',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Quarries',
        flavor_text: 'Study enuff',
        price: 11000,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 3 }
        }
    }, {
        name: 'Wooden Compass',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Quarries',
        flavor_text: 'Staring into one of them is like staring into a billion suns',
        price: 510000,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Ore Filter',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Quarries',
        flavor_text: 'Less sorting, more ore',
        price: 7000000,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 3 }
        }
    }, {
        name: 'Waterproof Tape',
        img: 'https://via.placeholder.com/50',
        desc: 'Quintuples the production of Quarries',
        flavor_text: 'Poor mans Flex Tape®',
        price: 80000000,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 5 }
        }
    },
    // CHURCH RELATED UPGRADES
    {
        name: 'Scripture Reading',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Churches',
        flavor_text: 'Read the word of our l-ore-d and savior',
        price: 60000,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'Communion',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Churches',
        flavor_text: 'Note: Not communism',
        price: 740000,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 3 }
        }
    }, {
        name: 'Worship Session',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Churches',
        flavor_text: 'More like W-ore-ship ha.. haa...',
        price: 2800000,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: '7th Day',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Churches',
        flavor_text: 'You would think a day of worship is one less day of work but somehow it works out to more ore!',
        price: 62000000,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 3 }
        }
    }, {
        name: 'Judgement Day',
        img: 'https://via.placeholder.com/50',
        desc: 'Quintuples the production of Churches',
        flavor_text: 'Read the word of our l-ore-d and savior',
        price: 777000000,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 5 }
        }
    },
    // FACTORY RELATED UPGRADES
    {
        name: 'Rubber Conveyor Belt',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Factories',
        flavor_text: 'These moves the things to there, that\'s all I know',
        price: 300000,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'Floppy Squiggle Tubes',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Factories',
        flavor_text: 'If I could tell you what these were for you\'d buy twice as many.',
        price: 300000,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 3 }
        }
    }, {
        name: 'Clicky Squish Buttons',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Factories',
        flavor_text: 'These go next to the Squishy Click Buttons',
        price: 44000000,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 2 }
        }
    }, {
        name: 'Metallic Magnetic Panels',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Factories',
        flavor_text: 'These are actually for my fridge',
        price: 800000000,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 3 }
        }
    }, {
        name: 'Hydroponic Auxilleration',
        img: 'https://via.placeholder.com/50',
        desc: 'Quintuples the production of Factories',
        flavor_text: 'Aquaman is here to stay',
        price: 5300000000,
        buy_functions: {
            increase_building_production: { building: 'factory', multi: 5 }
        }
    },
    // CRYPT RELATED UPGRADES
    {
        name: 'Metal Sarcophagus',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Crypts',
        flavor_text: 'Sellers note: sarcophagus does not come with mummy preinstalled.',
        price: 5200000,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    }, {
        name: 'Scarecrow',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Crypts',
        flavor_text: 'Scare the dead miners away',
        price: 72000000,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 3 }
        }
    }, {
        name: 'Polished Shovel',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Crypts',
        flavor_text: 'Tool of choice for a Knight or an archaeologist.',
        price: 150000000,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 2 }
        }
    },  {
        name: 'Fresh Bandages',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Crypts',
        flavor_text: 'Even though used were $40 cheaper...',
        price: 2500000000,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 3 }
        }
    },  {
        name: 'Oil Lanterns',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Crypts',
        flavor_text: 'Sets the mood ;)',
        price: 50000000000,
        buy_functions: {
            increase_building_production: { building: 'crypt', multi: 5 }
        }
    },
    // HOSPITAL RELATED UPGRADES
    {
        name: 'Immunization Shot',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Hospitals',
        flavor_text: 'wip',
        price: 10000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 2 }
        }
    }, {
        name: 'Blood Test',
        img: 'https://via.placeholder.com/50',
        desc: 'Find out the blood type of your ores to better understand them.',
        flavor_text: 'wip',
        price: 300000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 3 }
        }
    }, {
        name: 'Blood Transfusion',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Hospitals',
        flavor_text: 'Give the ores what they want: blood.',
        price: 2900000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 2 }
        }
    }, {
        name: 'CAT Scan',
        img: 'https://via.placeholder.com/50',
        desc: 'Triples the production of Hospitals',
        flavor_text: 'Not to be confused with PET scan.',
        price: 82000000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 3 }
        }
    }, {
        name: 'Enhancement Surgery',
        img: 'https://via.placeholder.com/50',
        desc: 'Quintuples the production of Hospitals',
        flavor_text: 'wip',
        price: 900000000000,
        buy_functions: {
            increase_building_production: { building: 'hospital', multi: 5 }
        }
    },
    // CITADEL RELATED UPGRADES
    {
        name: 'Council of Rocks',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Citadels',
        flavor_text: 'Council of Rocks, not the Council of Ricks',
        price: 400000000,
        buy_functions: {
            increase_building_production: { building: 'citadel', multi: 2 }
        }
    },
    // XENO SPACESHIP RELATED UPGRADES
    {
        name: 'Jet Fuel',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Xeno Spaceships',
        flavor_text: 'Steel beams nowhere in sight',
        price: 5500000000,
        buy_functions: {
            increase_building_production: { building: 'xeno_spaceship', multi: 2 }
        }
    },
    // SKY CASTLE RELATED ACHIEVEMENTS
    {
        name: 'Golden Eggs',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Sky Castles',
        flavor_text: 'wip',
        price: 95000000000,
        buy_functions: {
            increase_building_production: { building: 'sky_castle', multi: 2 }
        }
    },
    // EON PORTAL RELATED ACHIEVEMENTS
    {
        name: 'Green Goop',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Eon Portals',
        flavor_text: 'Goopy!',
        price: 150000000000,
        buy_functions: {
            increase_building_production: { building: 'eon_portal', multi: 2 }
        }
    },
    // SACRED MINE RELATED ACHIEVEMENTS
    {
        name: 'Sacred Mine Upgrade I',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Sacred Mines',
        flavor_text: 'wip',
        price: 2200000000000,
        buy_functions: {
            increase_building_production: { building: 'sacred_mine', multi: 2 }
        }
    },
    // O.A.R.D.I.S. RELATED ACHIEVEMENTS
    {
        name: 'O.A.R.D.I.S. Upgrade I',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of O.A.R.D.I.S.',
        flavor_text: 'wip',
        price: 50000000000000,
        buy_functions: {
            increase_building_production: { building: 'o.a.r.d.i.s.', multi: 2 }
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