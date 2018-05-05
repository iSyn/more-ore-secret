let Skill = function(skill) {
    this.name = skill.name
    this.className = skill.name.replace(/\s/g, '')
    this.img = skill.img
    this.type = skill.type
    this.fillerTxt = skill.fillerTxt
    this.desc = skill.desc
    this.lvl = skill.lvl || 0
    this.maxLvl = skill.maxLvl
    this.position = skill.position
    this.onLvl = skill.onLvl

    this.drawLines = skill.drawLines

    Game.skills.push(this)

    this.levelUp = (event) => {
        if (!this.locked) {
            if (this.lvl < this.maxLvl) {
                if (Game.state.player.generation.availableSp > 0) {
                    Game.state.player.generation.availableSp--
                    this.lvl++
                    Game.risingNumber(event, null, 'skill up')
                    Game.state.player.skills[`spSection${this.section}`]++
                    Game.playSound('skill-lvl-up')
                    document.querySelector('.available-sp').innerHTML = `Available Sp: ${Game.state.player.generation.availableSp}`
                    if (this.onLvl) {
                        if (this.onLvl.addPermaOpC) Game.state.permanent.opcMulti += this.onLvl.addPermaOpC
                        if (this.onLvl.addPermaOpS) Game.state.permanent.opsMulti += this.onLvl.addPermaOpS
                        Game.calculateOpS()
                        Game.calculateOpC()
                    }
                Game.hideTooltip()

                // check for unlocks
                Game.unlockSkills()
                Game.drawLines()
                }
            }
        }
    }
}

let skills = [
    {
        name: 'The Start',
        img: 'the-start.png',
        type: 'Passive',
        fillerTxt: 'Where it all begins',
        desc: 'Increases total OpC and OpS by 50%',
        maxLvl: 1,
        position: [1, 0], // row 1, col 0
        drawLines: [
            {from: 'bottom', to: 'Managerial Proficiency'},
            {from: 'bottom', to: 'Prospector Proficiency'}
        ],
        onLvl: {
            addPermaOpC: .5,
            addPermaOpS: .5
        }
    }, {
        name: 'Keen Eyes',
        fillerTxt: 'Glasses',
        type: 'Passive',
        desc: 'Start off with Magnifying Glasses',
        maxLvl: 1,
        position: [2, 0],
    }, {
        name: 'Managerial Proficiency',
        img: 'manager-mastery.png',
        type: 'Passive',
        fillerTxt: 'manager classes',
        desc: 'Increases total OpS by 10% per level',
        maxLvl: 10,
        position: [3, -1],
        drawLines: [
            {from: 'bottom', to: 'Property Management'},
            {from: 'bottom', to: 'Tax Break'}
        ],
        onLvl: {
            addPermaOpS: .1
        }
    }, {
        name: 'Prospector Proficiency',
        img: 'pickaxe-mastery.png',
        type: 'Passive',
        fillerTxt: 'bleh',
        desc: 'Increases total OpC by 10% per level',
        maxLvl: 10,
        position: [3, 1],
        drawLines: [
            {from: 'bottom', to: 'Heavy Strike'},
            {from: 'bottom', to: 'Metal Detector'}
        ],
        onLvl: {
            addPermaOpC: .1
        }
    }, {
        name: 'Back to Square One',
        type: 'Passive',
        fillerTxt: 'test',
        desc: 'Start with a random common pickaxe and at level 5',
        maxLvl: 1,
        position: [5, 0]
    }, {
        name: 'Property Management',
        type: 'Passive',
        fillerTxt: 'test2',
        desc: 'Increase specific building OpS by 50%',
        maxLvl: 1,
        position: [5, -2]
    }, {
        name: 'Metal Detector',
        type: 'Passive',
        fillerTxt: 'test2',
        desc: 'Beep when an gold nugget spawns',
        maxLvl: 1,
        position: [5, 2],
        drawLines: [
            {from: 'bottom', to: 'Golden Shower'},
            {from: 'bottom', to: 'Stone Polisher'}
        ]
    }, {
        name: 'Golden Shower',
        type: 'Passive',
        fillerTxt: 'test2',
        desc: 'Increases duration of gold rush',
        maxLvl: 1,
        position: [8, 2]
    }, {
        name: 'Stone Polisher',
        type: 'Passive',
        fillerTxt: 'test2',
        desc: 'Increases gold nugget multiplier',
        maxLvl: 1,
        position: [8, 3]
    }, {
        name: 'Tax Break',
        type: 'Active',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [10, -1]
    }, {
        name: 'Heavy Strike',
        type: 'Active',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [10, 1]
    }
]
