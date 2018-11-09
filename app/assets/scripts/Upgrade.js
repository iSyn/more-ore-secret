let Upgrade = function( obj ) {
    this.name = obj.name
    this.code_name = obj.name.replace( / /g, '_' ).toLowerCase()
    this.img = obj.img
    this.desc = obj.desc
    this.flavor_text = obj.flavor_text
    this.price = obj.price
    this.hidden = obj.hidden 
    this.owned = obj.owned || false

    this.buy = () => {

    }

    Upgrades.push( this )
}

let Upgrades = []
let upgrades = [
    {
        name: 'Composition Notebooks',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'Composition Notebooks',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'Composition Notebooks',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'Composition Notebooks',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'Composition Notebooks',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    }, {
        name: 'test test',
        img: 'https://via.placeholder.com/50',
        desc: 'Doubles the production of Schools',
        flavor_text: 'College Ruled!',
        price: 80,
        hidden: 0
    },
]

upgrades.forEach( upgrade => new Upgrade( upgrade ) )

let unlock_upgrade = ( code_name ) => {
    let upgrade = select_from_arr( Upgrades, code_name )
    console.log( 'unlock uopgrade firing', upgrade )
    upgrade.item.hidden = 0
    build_store()
}