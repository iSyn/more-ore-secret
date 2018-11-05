let Building = function( obj ) {
    this.name = obj.name
    this.name_plural = obj.name_plural
    this.code_name = obj.replace(/ /g, '_').toLowerCase()
    this.pic = obj.pic
    this.desc = obj.desc
    this.flavor_text = obj.flavor_test
    this.base_production = obj.base_production
    this.base_price = obj.base_price
    this.current_price = obj.current_price || obj.base_price
    this.price_scale = obj.price_scale
    this.owned = obj.owned || 0
    this.hidden = obj.hidden

    this.buy = () => {
        if ( S.ores >= this.current_price ) {
            spend( this.current_price )
            this.owned++
            this.current_price = this.base_price * Math.pow( this.price_scale, this.owned )
        }
    }
}

let buildings = [
    {
        name: 'School',
        name_plural: 'Schools',
        pic: 'https://via.placeholder.com/50',
        desc: 'Teach students about the wonders of ore',
        flavor_text: '"Jesus christ Marie, they\'re minerals!"',
        base_production: .3,
        base_price: 6,
        price_scale: 1.15,
        hidden: 0
    }, {
        name: 'Farm',
        name_plural: 'Farms',
        pic: 'https://via.placeholder.com/50',
        desc: 'Cultivate the lands for higher quality ores',
        flavor_text: 'This totally makes sense',
        base_production: 1,
        base_price: 210,
        price_scale: 1.15,
        hidden: 1
    }, {
        name: 'Quarry',
        name_plural: 'Quarries',
        pic: 'https://via.placeholder.com/50',
        desc: 'Designated Mining Area',
        flavor_text: 'diggy diggy hole',
        base_production: 20,
        base_price: 2520,
        hidden: 2
    }, {
        name: 'Church',
        name_plural: 'Churches',
        pic: 'https://via.placeholder.com/50',
        desc: 'Praise to the Ore Gods',
        flavor_text: 'In Ore name we pray, Amen',
        base_production: 320,
        base_price: 37800,
        hidden: 2
    }
]
