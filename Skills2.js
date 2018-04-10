let Skill = (skill) => {
    this.name = skill.name
    this.fillerTxt = skill.fillerTxt
    this.desc = skill.desc
    this.currentLvl = skill.currentLvl || 0
    this.maxLvl = skill.maxLvl
    this.position = skill.position
}

let skills = [
    {
        name: 'The Start',
        fillerTxt: 'Where it all begins',
        desc: 'Increases total OpC and OpS by 50%',
        maxLvl: 1,
        position: [1, 0] // row 1, col 0
    }
]
