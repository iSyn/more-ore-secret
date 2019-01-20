let Adventurer = function() {
    let adventurer = select_random_from_arr( adventurers )

    this.name = adventurer[ 0 ]
    this.gender = adventurer[ 1 ]
}

let adventurers = [
    ['Syn', 'male' ],
    ['Christine', 'female' ],
]