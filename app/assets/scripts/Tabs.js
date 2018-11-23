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

// ---------------------------------------------------------------

let Bottom_Tab = function( tab ) {

  this.name = tab.name
  this.code_name = tab.name.replace( / /g, '_' ).toLowerCase()
  this.locked = tab.locked || 0
  this.selected = tab.selected || 0

  Bottom_Tabs.push( this )

}

let Bottom_Tabs = []
let bottom_tabs = [
  {
    name: 'Quest Board',
    selected: 1,
    locked: 1
  }, {
    name: 'Ore Garden',
    locked: 1,
    selected: 0
  }
]

bottom_tabs.forEach( tab => {
  new Bottom_Tab( tab )
})