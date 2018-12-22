let Upgrade = function( obj ) {

    this.build_upgrade_desc = () => {
    
        let str = ''
        
        let building = select_from_arr( Buildings, this.buy_functions.increase_building_production.building )
    
        switch( this.buy_functions.increase_building_production.multi ) {
    
            case 2:
                str += 'Doubles '
                break
    
            case 3:
                str += 'Triples '
                break
    
            case 4:
                str += 'Quadruples '
                break
    
            case 5:
                str += 'Quintuples '
                break
    
            default:
                str += 'not defined'
                break
    
        }
    
        str += `the production of ${ building.name_plural }`
    
        return str
    }

    this.name = obj.name
    this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
    this.img = obj.img || 'https://via.placeholder.com/50'
    this.flavor_text = obj.flavor_text || ''
    this.price = obj.price
    this.hidden = obj.hasOwnProperty( 'hidden' ) ? obj.hidden : 1
    this.owned = obj.owned || false
    this.buy_functions = obj.buy_functions

    this.desc = obj.desc || this.build_upgrade_desc()

    this.buy = () => {
        if ( S.ores >= this.price ) {
            S.ores -= this.price
            play_sound( 'buy_sound' )
            this.owned = 1

            if ( this.buy_functions ) {
                let fn = this.buy_functions
                if ( fn.increase_building_production ) {
                    let building = select_from_arr( Buildings, fn.increase_building_production.building )
                    building.base_production *= fn.increase_building_production.multi
                }
                if ( fn.gain_opc_from_ops ) S.opc_from_ops += fn.gain_opc_from_ops
                if ( fn.increase_ops_opc_multiplier ) {
                    S.ops_multiplier += fn.increase_ops_opc_multiplier
                    S.opc_multiplier += fn.increase_ops_opc_multiplier
                }
            }

            O.rebuild_store_tab = 1
            O.recalculate_opc = 1
            O.recalculate_ops = 1

        } else {
            notify( 'Not enough ores', 'red', 'error' )
        }
    }

    Upgrades.push( this )
}

let Upgrades = []
let upgrades = [

    // OPC FROM OPS RELATED UPGRADES
    {
        name: 'Flashlight',
        desc: 'Gain 1% of your OpS as OpC',
        flavor_text: 'Or a torch if you\'re so inclined.',
        price: 5 * THOUSAND,
        buy_functions: {
            gain_opc_from_ops: .01
        }
    }, {
        name: 'Double Polish',
        desc: 'Gain 2% of your OpS as OpC',
        flavor_text: 'Extra sharp',
        price: 70 * THOUSAND,
        buy_functions: {
            gain_opc_from_ops: .02
        }
    }, {
        name: 'Metal Grips',
        desc: 'Gain 3% of your OpS as OpC',
        flavor_text: 'Better grip for better smashin\'.',
        price: 500 * THOUSAND,
        buy_functions: {
            gain_opc_from_ops: .03
        }
    }, {
        name: 'Miner Battery',
        desc: 'Gain 2% of your Ops as OpC',
        flavor_text: 'Miners are battery powered right?',
        price: 3.5 * MILLION,
        buy_functions: {
            gain_opc_from_ops: .02
        }
    },

    // INCREASE OPS AND OPC MULTIPLIER
    {
        name: 'Baby Knowledge',
        desc: 'Increase overall OpS and OpC multiplier by 1%',
        flavor_text: 'Just a lil\' babby',
        price: 200,
        buy_functions: {
            increase_ops_opc_multiplier: .01
        }
    }, {
        name: 'Adolescent Knowledge',
        desc: 'Increase overall OpS and OpC multiplier by 2%',
        flavor_text: 'Puberty Incoming',
        price: 16.5 * THOUSAND,
        buy_functions: {
            increase_ops_opc_multiplier: .02
        }
    }, {
        name: 'Adult Knowledge',
        desc: 'Increase overall OpS and OpC multiplier by 3%',
        flavor_text: 'I still don\'t know anything',
        price: 1.35 * MILLION,
        buy_functions: {
            increase_ops_opc_multiplier: .03
        }
    }, {
        name: 'Elder Knowledge',
        desc: 'increase overall OpS and OpC multiplier by 3%',
        flavor_text: 'Wise ol\' man.',
        price: 521 * MILLION,
        buy_functions: {
            increase_ops_opc_multiplier: .03
        }
    }, {
        name: 'Eldritch Knowledge',
        desc: 'Increase overall OpS and OpC multiplier by 5%',
        flavor_text: 'We\'ve come so far.',
        price: 66.66666 * BILLION,
        buy_functions: {
            increase_ops_opc_multiplier: .05
        }
    },

    // -----------------------------------------------------------------------------------

    // SCHOOL RELATED UPGRADES
    {
        name: 'Composition Notebooks',
        img: 'https://via.placeholder.com/50',
        flavor_text: 'College Ruled!',
        price: 300,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'No. 2 Pencil',
        img: 'https://via.placeholder.com/50',
        flavor_text: 'Test ready!',
        price: 1000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: '3 Ring Binder',
        img: 'https://via.placeholder.com/50',
        flavor_text: 'Be the Lord of the Rings with our new 2.5\" binder!',
        price: 12000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Looseleaf',
        img: 'https://via.placeholder.com/50',
        flavor_text: '"Can I borrow a sheet?"',
        price: 450000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Schoolbag',
        img: 'https://via.placeholder.com/50',
        flavor_text: 'Break your back carrying one of these stylish bags!',
        price: 5500000,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 3 }
        }
    }, {
        name: 'Fresh Pink Eraser',
        flavor_text: 'Never use this. Keep it pristine.',
        price: 22.5 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Pack of Ballpoint Pens',
        flavor_text: 'In a week, they\'ll be all gone.',
        price: 620 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Gum',
        flavor_text: 'You\'ll be the most popular kid in the class',
        price: 3 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Hallpass',
        flavor_text: 'Wander the halls without a care in the world',
        price: 82 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    }, {
        name: 'Report Card',
        flavor_text: 'Decides your fate for the upcoming months',
        price: 200 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'school', multi: 2 }
        }
    },  

    // FARM RELATED UPGRADES
    {
        name: 'Manure Spreader',
        flavor_text: 'The poop helps the ore mature',
        price: 950,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Pitchfork',
        flavor_text: 'Torches not included',
        price: 12.5 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Tractor',
        flavor_text: 'im in me mums tractor',
        price: 265 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Rotary Cutter',
        flavor_text: 'Not even grass can stop us now',
        price: 3.45 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Hoe',
        flavor_text: 'Torches not included',
        price: 69 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Baler',
        flavor_text: '"How many people a year do you think get their arms cut off in a baler?"',
        price: 400 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Sprayer',
        flavor_text: 'Spray\'er?, I hardly know her.',
        price: 2.3 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Sickle',
        flavor_text: 'For easy sickle-ing of course.',
        price: 47.3 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Scythe',
        flavor_text: 'Looks like an upgraded sickle.',
        price: 700 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    }, {
        name: 'Milking Machine',
        flavor_text: 'Rich in vitamin O. O for Ore.',
        price: 1.8 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'farm', multi: 2 }
        }
    },
    // QUARRY RELATED UPGRADES
    {
        name: 'Floodlights',
        flavor_text: 'Staring into one of them is like staring into a billion suns',
        price: 1.9 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Twill Rope',
        flavor_text: 'Sturdy enuff',
        price: 11 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Wooden Compass',
        flavor_text: 'Responds to ore magnetism ',
        price: 510 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Ore Filter',
        flavor_text: 'Less sorting, more ore',
        price: 7 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Waterproof Tape',
        flavor_text: 'Poor mans Flex Tape®',
        price: 80 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Metallic Compass',
        flavor_text: 'Looks cooler, does the same thing.',
        price: 210.5 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Miners Mask',
        flavor_text: 'Asbestos be gone!',
        price: 5 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'Laser Drill',
        flavor_text: 'faster than mining!',
        price: 27 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'tbd quarry 1',
        flavor_text: 'tbd',
        price: 600 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    }, {
        name: 'tbd quarry 2',
        flavor_text: 'tbd',
        price: 6.3 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'quarry', multi: 2 }
        }
    },
    // CHURCH RELATED UPGRADES
    {
        name: 'Scripture Reading',
        flavor_text: 'Read the word of our l-ore-d and savior',
        price: 60 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'Communion',
        flavor_text: 'Note: Not communism',
        price: 740 * THOUSAND,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'Worship Session',
        flavor_text: 'More like W-ore-ship ha.. haa...',
        price: 2.8 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: '7th Day',
        flavor_text: 'You would think a day of worship is one less day of work but somehow it works out to more ore!',
        price: 62 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'Judgement Day',
        flavor_text: 'Read the word of our l-ore-d and savior',
        price: 777 * MILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'tbd church 1',
        flavor_text: 'tbd',
        price: 8.2 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'tbd church 2',
        flavor_text: 'tbd',
        price: 32 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'tbd church 3',
        flavor_text: 'tbd',
        price: 700 * BILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'tbd church 4',
        flavor_text: 'tbd',
        price: 2.45 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
        }
    }, {
        name: 'tbd church 5',
        flavor_text: 'tbd',
        price: 33 * TRILLION,
        buy_functions: {
            increase_building_production: { building: 'church', multi: 2 }
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

let unlock_upgrade = ( code_name ) => {
    let upgrade = select_from_arr( Upgrades, code_name )
    if ( upgrade.hidden ) {
        upgrade.hidden = false
        O.rebuild_store_tab = 1
    }
}

let load_upgrades = () => {

    return new Promise( resolve => {

        Upgrades = []
        let base_upgrades = upgrades

        if ( localStorage.getItem( 'upgrades' ) ) {
            base_upgrades = JSON.parse( localStorage.getItem( 'upgrades' ) )
        }

        base_upgrades.forEach( u => new Upgrade( u ))

        resolve()

    })

}
