let Skill = function(skill) {
    this.name = skill.name
    this.fillerTxt = skill.fillerTxt
    this.desc = skill.desc
    this.currentLvl = skill.currentLvl || 0
    this.maxLvl = skill.maxLvl
    this.position = skill.position

    Game.skills.push(this)
}

let skills = [
    {
        name: 'The Start',
        fillerTxt: 'Where it all begins',
        desc: 'Increases total OpC and OpS by 50%',
        maxLvl: 1,
        position: [1, 0] // row 1, col 0
    }, {
        name: 'test',
        fillerTxt: 'test',
        desc: 'test',
        maxLvl: 1,
        position: [2, 0]
    }, {
        name: 'test3',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [3, -1]
    }, {
        name: 'test2',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [3, 1]
    }, {
        name: 'test2',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [5, 0]
    }, {
        name: 'test2',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [5, -2]
    }, {
        name: 'test2',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [5, 2]
    }, {
        name: 'test2',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [8, 2]
    }, {
        name: 'test2',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [8, 3]
    }, {
        name: 'test2',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [10, -1]
    }, {
        name: 'test2',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [10, 1]
    }
]
