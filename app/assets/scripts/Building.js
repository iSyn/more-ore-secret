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

    this.buy = () => {
        console.log('buying', this)
        if ( S.ores >= this.current_price ) {
            spend( this.current_price )
            this.owned++
            this.current_price = this.base_price * Math.pow( this.price_scale, this.owned )
            calculate_ops()
            build_store()
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
    }
]

buildings.forEach( building => {
    new Building( building )
})