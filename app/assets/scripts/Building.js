let Building = function( obj ) {
    this.name = obj.name
    this.code_name = obj.replace(/ /g, '_').toLowerCase()
}

let buildings = [
    {
        name: 'School',
    }
]
