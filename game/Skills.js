let Skill = function(skill) {
    this.name = skill.name
    this.className = skill.name.replace(/\s/g, '').replace(/\./g,'')
    this.img = skill.img
    this.type = skill.type
    this.fillerTxt = skill.fillerTxt
    this.desc = skill.desc
    this.lvl = skill.lvl || 0
    this.maxLvl = skill.maxLvl
    this.position = skill.position
    this.onLvl = skill.onLvl
    this.locked = skill.locked
    this.requires = skill.requires

    this.drawLines = skill.drawLines

    Game.skills.push(this)

    this.levelUp = (event) => {
        if (!this.locked) {
            if (this.lvl < this.maxLvl) {
                if (Game.state.player.generation.availableSp > 0) {
                    Game.state.player.generation.availableSp--
                    this.lvl++
                    Game.lvlFunc(this.name)
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

// POSITION: GENERATION LVL , POSITION

let skills = [
    {
        name: 'The Start',
        img: 'the-start.png',
        type: 'Passive',
        fillerTxt: 'Where it all begins',
        locked: 0,
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
        locked: 1,
        fillerTxt: 'Glasses',
        type: 'Passive',
        desc: 'Start off with Magnifying Glasses',
        maxLvl: 1,
        position: [2, 0],
    }, {
        name: 'Managerial Proficiency',
        locked: 1,
        img: 'manager-mastery.png',
        type: 'Passive',
        fillerTxt: 'manager classes',
        desc: 'Increases total OpS by 10% per level',
        maxLvl: 10,
        position: [3, -1],
        requires: [
            ['The Start', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'School Management'},
            {from: 'bottom', to: 'Tax Break'}
        ],
        onLvl: {
            addPermaOpS: .1
        }
    }, {
        name: 'Prospector Proficiency',
        locked: 1,
        img: 'pickaxe-mastery.png',
        type: 'Passive',
        fillerTxt: 'bleh',
        desc: 'Increases total OpC by 10% per level',
        maxLvl: 10,
        position: [3, 1],
        requires: [
            ['The Start', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Heavy Strike'},
            {from: 'bottom', to: 'Metal Detector'}
        ],
        onLvl: {
            addPermaOpC: .1
        }
    }, {
        name: 'Metal Detector',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        desc: 'Beep when an gold nugget spawns',
        requires: [
            ['Prospector Proficiency', 1]
        ],
        maxLvl: 1,
        position: [5, 2],
        drawLines: [
            {from: 'bottom', to: 'Golden Shower'},
            {from: 'bottom', to: 'Stone Polisher'}
        ]
    }, {
        name: 'Golden Shower',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        desc: 'Increases duration of gold rush',
        maxLvl: 1,
        position: [8, 2]
    }, {
        name: 'Stone Polisher',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        desc: 'Increases gold nugget multiplier',
        maxLvl: 1,
        position: [8, 3]
    }, {
        name: 'Tax Break',
        locked: 1,
        type: 'Active',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [10, -1]
    }, {
        name: 'Heavy Strike',
        locked: 1,
        type: 'Active',
        fillerTxt: 'test2',
        desc: 'test2',
        maxLvl: 1,
        position: [10, 1]
    }
]


let buildingBonusSkills = [
    {
        name: 'School Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Managerial Proficiency', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Farm Management'},
        ],
        desc: 'Increase School OpS by 50% per level',
        maxLvl: 10,
        position: [5, -2]
    }, {
        name: 'Farm Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['School Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Quarry Management'}
        ],
        desc: 'Increase Farm OpS by 50% per level',
        maxLvl: 10,
        position: [6, -2]
    }, 
    
    {
        name: 'Quarry Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Farm Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Church Management'}
        ],
        desc: 'Increase Quarry OpS by 50% per level',
        maxLvl: 10,
        position: [7, -2]
    }, {
        name: 'Church Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Quarry Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Factory Management'}
        ],
        desc: 'Increase Church OpS by 50% per level',
        maxLvl: 10,
        position: [8, -2]
    }, {
        name: 'Factory Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Church Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Crypt Management'}
        ],
        desc: 'Increase Factory OpS by 50% per level',
        maxLvl: 10,
        position: [9, -2]
    }, {
        name: 'Crypt Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Factory Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Hospital Management'}
        ],
        desc: 'Increase Crypt OpS by 50% per level',
        maxLvl: 10,
        position: [10, -2]
    }, {
        name: 'Hospital Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Crypt Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Citadel Management'}
        ],
        desc: 'Increase Hospital OpS by 50% per level',
        maxLvl: 10,
        position: [11, -2]
    }, {
        name: 'Citadel Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Hospital Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Xeno Spaceship Management'}
        ],
        desc: 'Increase Citadel OpS by 50% per level',
        maxLvl: 10,
        position: [12, -2]
    }, {
        name: 'Xeno Spaceship Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Citadel Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Sky Castle Management'}
        ],
        desc: 'Increase Xeno Spaceship OpS by 50% per level',
        maxLvl: 10,
        position: [13, -2]
    }, {
        name: 'Sky Castle Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Xeno Spaceship Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Eon Portal Management'}
        ],
        desc: 'Increase Sky Castle OpS by 50% per level',
        maxLvl: 10,
        position: [14, -2]
    }, {
        name: 'Eon Portal Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Sky Castle Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'Sacred Mine Management'}
        ],
        desc: 'Increase Eon Portal OpS by 50% per level',
        maxLvl: 10,
        position: [15, -2]
    }, {
        name: 'Sacred Mine Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Eon Portal Management', 1]
        ],
        drawLines: [
            {from: 'bottom', to: 'O.A.R.D.I.S. Management'}
        ],
        desc: 'Increase Sacred Mine OpS by 50% per level',
        maxLvl: 10,
        position: [16, -2]
    }, {
        name: 'O.A.R.D.I.S. Management',
        locked: 1,
        type: 'Passive',
        fillerTxt: 'test2',
        requires: [
            ['Sacred Mine Management', 1]
        ],
        desc: 'Increase O.A.R.D.I.S. OpS by 50% per level',
        maxLvl: 10,
        position: [17, -2]
    }, {
        name: 'spacer',
        position: [20, 0]
    }
]

buildingBonusSkills.forEach(skill => skills.push(skill))