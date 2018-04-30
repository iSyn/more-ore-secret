let Achievement = function(obj) {
  this.name = obj.name
  // this.funcName = obj.name.replace(/ /g,'')
  this.desc = obj.desc
  this.won = obj.won || 0
  if (obj.reward) this.reward = obj.reward

  Game.achievements.push(this)
}

let achievements = [

  // ------------------
  // SCHOOLS
  // -------------------

  {name: 'Elementary', desc: 'Have a total of 10 schools', reward: {
    txt: 'x2 Permanent School Production',
    building: ['School', 2]
  }},
  {name: 'Graduation', desc: 'Have a total of 50 schools', reward: {
    txt: 'x2 Permanent School Production',
    building: ['School', 2]
  }},
  {name: 'GED', desc: 'Have a total of 100 schools', reward: {
    txt: 'x2 Permanent School Production',
    building: ['School', 2]
  }},
  {name: 'Ivy League', desc: 'Have a total of 200 schools', reward: {
    txt: 'x2 Permanent School Production',
    building: ['School', 2]
  }},

  // ------------------
  // FARMS
  // -------------------

  {name: 'Rock Farmer', desc: 'Have a total of 10 farms', reward: {
    txt: 'x2 Permanent Farm Production',
    building: ['Farm', 2]
  }},
  {name: '25 Acres', desc: 'Have a total of 50 farms', reward: {
    txt: 'x2 Permanent Farm Production',
    building: ['Farm', 2]
  }},
  {name: '100 Acres', desc: 'Have a total of 100 farms', reward: {
    txt: 'x2 Permanent Farm Production',
    building: ['Farm', 2]
  }},
  {name: 'Slaughterhouse', desc: 'Have a total of 200 farms', reward: {
    txt: 'x2 Permanent Farm Production',
    building: ['Farm', 2]
  }},

  // ------------------
  // QUARRY
  // -------------------

  {name: 'Sifter', desc: 'Have a total of 10 quarries', reward: {
    txt: 'x2 Permanent Quarry Production',
    building: ['Quarry', 2]
  }},
  {name: 'Digger', desc: 'Have a total of 50 quarries', reward: {
    txt: 'x2 Permanent Quarry Production',
    building: ['Quarry', 2]
  }},
  {name: "They're not rocks, they're minerals!", desc: 'Have a total of 100 quarries', reward: {
    txt: 'x2 Permanent Quarry Production',
    building: ['Quarry', 2]
  }},
  {name: 'Prospector', desc: 'Have a total of 200 quarries', reward: {
    txt: 'x2 Permanent Quarry Production',
    building: ['Quarry', 2]
  }},

  // ------------------
  // CHURCH
  // -------------------

  {name: 'Communion', desc: 'Have a total of 10 churches', reward: {
    txt: 'x2 Permanent Church Production',
    building: ['Church', 2]
  }},
  {name: 'Sacrifice', desc: 'Have a total of 50 churches', reward: {
    txt: 'x2 Permanent Church Production',
    building: ['Church', 2]
  }},
  {name: 'Worshipper', desc: 'Have a total of 100 churches', reward: {
    txt: 'x2 Permanent Church Production',
    building: ['Church', 2]
  }},
  {name: 'Pope', desc: 'Have a total of 200 churches', reward: {
    txt: 'x2 Permanent Church Production',
    building: ['Church', 2]
  }},

  // ------------------
  // FACTORY
  // -------------------

  {name: 'Assembly Line', desc: 'Have a total of 10 factories', reward: {
    txt: 'x2 Permanent Factory Production',
    building: ['Factory', 2]
  }},
  {name: 'Mass Production', desc: 'Have a total of 50 factories', reward: {
    txt: 'x2 Permanent Factory Production',
    building: ['Factory', 2]
  }},
  {name: 'Outsourced Production', desc: 'Have a total of 100 factories', reward: {
    txt: 'x2 Permanent Factory Production',
    building: ['Factory', 2]
  }},
  {name: 'Automatated Production', desc: 'Have a total of 200 factories', reward: {
    txt: 'x2 Permanent Factory Production',
    building: ['Factory', 2]
  }},

  // ------------------
  // CRYPT
  // -------------------

  {name: 'Gravedigger', desc: 'Have a total of 10 crypts', reward: {
    txt: 'x2 Permanent Crypt Production',
    building: ['Crypt', 2]
  }},
  {name: 'Groundskeeper', desc: 'Have a total of 50 crypts', reward: {
    txt: 'x2 Permanent Crypt Production',
    building: ['Crypt', 2]
  }},
  {name: 'Graverobber', desc: 'Have a total of 100 crypts', reward: {
    txt: 'x2 Permanent Crypt Production',
    building: ['Crypt', 2]
  }},
  {name: 'Tomb Raider', desc: 'Have a total of 200 crypts', reward: {
    txt: 'x2 Permanent Crypt Production',
    building: ['Crypt', 2]
  }},

  // ------------------
  // HOSPITAL
  // -------------------

  {name: 'Herbal Supplements', desc: 'Have a total of 10 hospitals', reward: {
    txt: 'x2 Permanent Hospital Production',
    building: ['Hospital', 2]
  }},
  {name: 'Homeopathy Kit', desc: 'Have a total of 50 hospitals', reward: {
    txt: 'x2 Permanent Hospital Production',
    building: ['Hospital', 2]
  }},
  {name: 'Vitamins & Minerals', desc: 'Have a total of 100 hospitals', reward: {
    txt: 'x2 Permanent Hospital Production',
    building: ['Hospital', 2]
  }},
  {name: 'Rock Doctor', desc: 'Have a total of 200 hospitals', reward: {
    txt: 'x2 Permanent Hospital Production',
    building: ['Hospital', 2]
  }},

  // ------------------
  // CITADEL
  // -------------------

  {name: 'Citadel Achievement I', desc: 'Have a total of 10 Citadels', reward: {
    txt: 'x2 Permanent Citadel Production',
    building: ['Citadel', 2]
  }},
  {name: 'Citadel Achievement II', desc: 'Have a total of 20 Citadels', reward: {
    txt: 'x2 Permanent Citadel Production',
    building: ['Citadel', 2]
  }},
  {name: 'Citadel Achievement III', desc: 'Have a total of 50 Citadels', reward: {
    txt: 'x2 Permanent Citadel Production',
    building: ['Citadel', 2]
  }},
  {name: 'Citadel Achievement IV', desc: 'Have a total of 100 Citadels', reward: {
    txt: 'x2 Permanent Citadel Production',
    building: ['Citadel', 2]
  }},

  // ------------------
  // XENO SPACESHIP
  // -------------------

  {name: 'Xeno Spaceship Achievement I', desc: 'Have a total of 10 Xeno Spaceships', reward: {
    txt: 'x2 Permanent Xeno Spaceship Production',
    building: ['Xeno Spaceship', 2]
  }},
  {name: 'Xeno Spaceship Achievement II', desc: 'Have a total of 20 Xeno Spaceships', reward: {
    txt: 'x2 Permanent Xeno Spaceship Production',
    building: ['Xeno Spaceship', 2]
  }},
  {name: 'Xeno Spaceship Achievement III', desc: 'Have a total of 50 Xeno Spaceships', reward: {
    txt: 'x2 Permanent Xeno Spaceship Production',
    building: ['Xeno Spaceship', 2]
  }},
  {name: 'Xeno Spaceship Achievement IV', desc: 'Have a total of 100 Xeno Spaceships', reward: {
    txt: 'x2 Permanent Xeno Spaceship Production',
    building: ['Xeno Spaceship', 2]
  }},

  // ------------------
  // SKY CASTLE
  // -------------------

  {name: 'Sky Castle Achievement I', desc: 'Have a total of 10 Sky Castles', reward: {
    txt: 'x2 Permanent Sky Castle Production',
    building: ['Sky Castle', 2]
  }},
  {name: 'Sky Castle Achievement II', desc: 'Have a total of 20 Sky Castles', reward: {
    txt: 'x2 Permanent Sky Castle Production',
    building: ['Sky Castle', 2]
  }},
  {name: 'Sky Castle Achievement III', desc: 'Have a total of 50 Sky Castles', reward: {
    txt: 'x2 Permanent Sky Castle Production',
    building: ['Sky Castle', 2]
  }},
  {name: 'Sky Castle Achievement IV', desc: 'Have a total of 100 Sky Castles', reward: {
    txt: 'x2 Permanent Sky Castle Production',
    building: ['Sky Castle', 2]
  }},

  // ------------------
  // EON PORTAL
  // -------------------

  {name: 'Eon Portal Achievement I', desc: 'Have a total of 10 Eon Portals', reward: {
    txt: 'x2 Permanent Eon Portal Production',
    building: ['Eon Portal', 2]
  }},
  {name: 'Eon Portal Achievement II', desc: 'Have a total of 20 Eon Portals', reward: {
    txt: 'x2 Permanent Eon Portal Production',
    building: ['Eon Portal', 2]
  }},
  {name: 'Eon Portal Achievement III', desc: 'Have a total of 50 Eon Portals', reward: {
    txt: 'x2 Permanent Eon Portal Production',
    building: ['Eon Portal', 2]
  }},
  {name: 'Eon Portal Achievement IV', desc: 'Have a total of 100 Eon Portals', reward: {
    txt: 'x2 Permanent Eon Portal Production',
    building: ['Eon Portal', 2]
  }},

  // ------------------
  // SACRED MINE
  // -------------------
  {name: 'Sacred Mine Achievement I', desc: 'Have a total of 10 Sacred Mines', reward: {
    txt: 'x2 Permanent Sacred Mine Production',
    building: ['Sacred Mine', 2]
  }},
  {name: 'Sacred Mine Achievement II', desc: 'Have a total of 20 Sacred Mines', reward: {
    txt: 'x2 Permanent Sacred Mine Production',
    building: ['Sacred Mine', 2]
  }},
  {name: 'Sacred Mine Achievement III', desc: 'Have a total of 50 Sacred Mines', reward: {
    txt: 'x2 Permanent Sacred Mine Production',
    building: ['Sacred Mine', 2]
  }},
  {name: 'Sacred Mine Achievement IV', desc: 'Have a total of 100 Sacred Mines', reward: {
    txt: 'x2 Permanent Sacred Mine Production',
    building: ['Sacred Mine', 2]
  }},

  // ------------------
  // O.A.R.D.I.S.
  // -------------------

  {name: 'O.A.R.D.I.S. Achievement I', desc: 'Have a total of 10 O.A.R.D.I.S.s', reward: {
    txt: 'x2 Permanent O.A.R.D.I.S. Production',
    building: ['O.A.R.D.I.S.', 2]
  }},
  {name: 'O.A.R.D.I.S. Achievement II', desc: 'Have a total of 20 O.A.R.D.I.S.s', reward: {
    txt: 'x2 Permanent O.A.R.D.I.S. Production',
    building: ['O.A.R.D.I.S.', 2]
  }},
  {name: 'O.A.R.D.I.S. Achievement III', desc: 'Have a total of 50 O.A.R.D.I.S.s', reward: {
    txt: 'x2 Permanent O.A.R.D.I.S. Production',
    building: ['O.A.R.D.I.S.', 2]
  }},
  {name: 'O.A.R.D.I.S. Achievement IV', desc: 'Have a total of 100 O.A.R.D.I.S.s', reward: {
    txt: 'x2 Permanent O.A.R.D.I.S. Production',
    building: ['O.A.R.D.I.S.', 2]
  }},

  // MINING RELATED ACHIEVEMENTS
  {name: 'Newbie Miner', desc: 'Break your first rock'},
  {name: 'Novice Miner', desc: 'Break 10 rocks'},
  {name: 'Intermediate Miner', desc: 'Break 25 rocks'},
  {name: 'Advanced Miner', desc: 'Break 50 rocks'},

  // COMBO RELATED ACHIEVEMENTS
  {name: 'Combo Pleb', desc: 'Reach 5 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +1',
    increaseWeakHitMulti: 1
  }},
  {name: 'Combo Squire', desc: 'Reach 15 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +1',
    increaseWeakHitMulti: 1
  }},
  {name: 'Combo Knight', desc: 'Reach 40 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +1',
    increaseWeakHitMulti: 1
  }},
  {name: 'Combo King', desc: 'Reach 100 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +2',
    increaseWeakHitMulti: 2
  }},
  {name: 'Combo Master', desc: 'Reach 300 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +2',
    increaseWeakHitMulti: 2
  }},
  {name: 'Combo Devil', desc: 'Reach 666 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +3',
    increaseWeakHitMulti: 3
  }},
  {name: 'Combo God', desc: 'Reach 777 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +4',
    increaseWeakHitMulti: 4
  }},
  {name: 'Combo Saiyan', desc: 'Reach 1000 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +5',
    increaseWeakHitMulti: 5
  }},
  {name: 'Combo Saitama', desc: 'Reach 10000 hit combo', reward: {
    txt: 'Permanent weak-hit multiplier +5 (LAST ONE FOR NOW LOL)',
    increaseWeakHitMulti: 5
  }},

  // OPC ACHIEVEMENTS
  {name: 'Still a Baby', desc: 'Deal more than 1,000,000 in one hit'},
  {name: 'Getting There', desc: 'Deal more than 1,000,000,000 in one hit'},
  {name: 'Big Boy', desc: 'Deal more than 1,000,000,000,000 in one hit'},

  // OPS ACHIEVEMENTS
  {name: '401k', desc: 'Earn 401,000 ores per second'},
  {name: 'Retirement Plan', desc: 'Earn 5,000,000 OpS'},
  {name: 'Hedge Fund', desc: 'Earn 1,000,000,000 OpS'},

  // REFINE ACHIEVEMENTS
  {name: 'Blacksmiths Apprentice', desc: 'Refine for your first time'},

  // SKILL ACHIEVEMENTS
  {name: 'Hulk Smash', desc: 'Use the skill Heavy Smash for the first time'},
  {name: 'Roided Out', desc: 'Use the skill Roid Rage for the first time'},
  {name: 'Beep Boop', desc: 'Use the skill Auto-Miner 5000 for the first time'},
  {name: 'Roided Smash', desc: 'Use the skill Heavy Smash while Roid Rage is active'}
]
