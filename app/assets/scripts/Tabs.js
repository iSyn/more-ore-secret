let Tab = function( tab ) {

    this.name = tab.name
    this.code_name = tab.name.replace(/ /g, '_').toLowerCase()
    this.hidden = tab.hidden || 0
    this.selected = tab.selected || 0

    Tabs.push( this )

}

let Tabs = []
let tabs = [
    {
      name: 'Store',
      selected: 1
    }, {
      name: 'Smith',
      selected: 0
    }
]

tabs.forEach( tab => {
    new Tab( tab )
})