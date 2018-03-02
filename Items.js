let Item = function(item) {
  this.name = item.name
  if (item.namePlural) this.namePlural = item.namePlural
  this.type = item.type
  this.pic = item.pic
  if (item.production) this.production = item.production
  this.desc = item.desc
  this.fillerQuote = item.fillerQuote
  item.price ? this.price = item.price : this.price = item.basePrice
  if (item.basePrice) this.basePrice = item.basePrice
  this.hidden = item.hidden
  this.owned = item.owned || 0
  if (item.buyFunctions) this.buyFunctions = item.buyFunctions

  this.buy = () => {

    let price = this.price
    if (this.type == 'building') {
      price = (this.basePrice * ((Math.pow(1.15, this.owned + Game.state.prefs.buyAmount) - Math.pow(1.15, this.owned)))/.15)
    }

    if (Game.state.ores >= price) {
      if (this.type == 'upgrade') {
        this.hidden = 2
      } else {
        Game.state.stats.buildingsOwned += Game.state.prefs.buyAmount
      }
      Game.spend(this.price)
      Game.playSound('buysound')
      Game.risingNumber(null, 'spendMoney')
      // this.owned
      this.type == 'building' ? this.owned += Game.state.prefs.buyAmount : this.owned++
      Game.buyFunction(this)
      this.price = this.basePrice * Math.pow(1.15, this.owned)
      Game.recalculateOpC = 1
      Game.recalculateOpS = 1
      Game.rebuildStore = 1
    }
  }
  this.type == 'building' ? Game.buildings.push(this) : Game.upgrades.push(this)
}

let items = [

  /* ----------------------------------------------------------------------------------------
      BUILDINGS
  ---------------------------------------------------------------------------------------- */

  {
    name: 'School', namePlural: 'Schools', type: 'building', pic: 'school.png', production: .3, desc: 'Teach students about the wonders of ores', fillerQuote: 'Jesus Christ Marie, they\'re minerals!', basePrice: 6, hidden: 0,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Composition Notebooks', amountNeeded: 1},
        {name: 'No. 2 Pencil', amountNeeded: 10},
        {name: '3 Ring Binder', amountNeeded: 20},
        {name: 'Schoolbag', amountNeeded: 50},
        {name: 'Looseleaf', amountNeeded: 100}
      ],
      addTextScroller: [
        {text: 'First day of class has started', amountNeeded: 1},
        {text: '[Breaking News] The school district superintendent has announced new ore related classes to take', amountNeeded: 10}
      ],
      achievements: [
        {name: 'Elementary', amountNeeded: 10},
        {name: 'Graduation', amountNeeded: 20},
        {name: 'GED', amountNeeded: 50},
        {name: 'Ivy League', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Farm', namePlural: 'Farms', type: 'building', pic: 'farm.png', production: 1, desc: 'Cultivate the lands for higher quality ores', fillerQuote: 'This totally makes sense.', basePrice: 75, hidden: 1,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Manure Spreader', amountNeeded: 1},
        {name: 'Pitchfork', amountNeeded: 10},
        {name: 'Tractor', amountNeeded: 20},
        {name: 'Rotary Cutter', amountNeeded: 50},
        {name: 'Hoe', amountNeeded: 100},
      ],
      addTextScroller: [
        {text: '[Breaking News] Farmers have now started farming for ores. How is this possible? More at 7pm'}
      ],
      achievements: [
        {name: 'Farm Achievement I', amountNeeded: 10},
        {name: 'Farm Achievement II', amountNeeded: 20},
        {name: 'Farm Achievement III', amountNeeded: 50},
        {name: 'Farm Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Quarry', namePlural: 'Quarries', type: 'building', pic: 'quarry.png', production: 20, desc: 'Designated mining area', fillerQuote: 'mine mine mine', basePrice: 1200, hidden: 1,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Headlights', amountNeeded: 1},
        {name: 'Twill Rope', amountNeeded: 10},
        {name: 'Wooden Compass', amountNeeded: 20},
        {name: 'Ore Filter', amountNeeded: 50},
        {name: 'Waterproof Tape', amountNeeded: 100}
      ],
      achievements: [
        {name: 'Quarry Achievement I', amountNeeded: 10},
        {name: 'Quarry Achievement II', amountNeeded: 20},
        {name: 'Quarry Achievement III', amountNeeded: 50},
        {name: 'Quarry Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Church', namePlural: 'Churches', type: 'building', pic: 'church.png', production: 300, desc: 'Praise to the Ore Gods', fillerQuote: 'In Ore name we pray, Amen.', basePrice: 6660, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Scripture Reading', amountNeeded: 1},
        {name: 'Communion', amountNeeded: 10},
        {name: 'Worship Session', amountNeeded: 20},
        {name: '7th Day', amountNeeded: 50},
        {name: 'Judgement Day', amountNeeded: 100},
      ],
      achievements: [
        {name: 'Church Achievement I', amountNeeded: 10},
        {name: 'Church Achievement II', amountNeeded: 20},
        {name: 'Church Achievement III', amountNeeded: 50},
        {name: 'Church Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Factory', namePlural: 'Factories', type: 'building', pic: 'factory.png', production: 5500, desc: 'Manufacture your ores', fillerQuote: 'Assembly line this sh&* up!', basePrice: 48000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Rubber Conveyor Belt', amountNeeded: 1},
        {name: 'Floppy Squiggle Tubes', amountNeeded: 10},
        {name: 'Clicky Squish Buttons', amountNeeded: 20},
        {name: 'Metallic Magnetic Panels', amountNeeded: 50},
        {name: 'Hydroponic Screws', amountNeeded: 100},
      ],
      achievements: [
        {name: 'Factory Achievement I', amountNeeded: 10},
        {name: 'Factory Achievement II', amountNeeded: 20},
        {name: 'Factory Achievement III', amountNeeded: 50},
        {name: 'Factory Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Crypt', namePlural: 'Crypts', type: 'building', pic: 'crypt.png', production: 30000, desc: 'Raise dead ores from the graves', fillerQuote: 'spooky ores', basePrice: 290000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Metal Sarcophagus', amountNeeded: 1},
        {name: 'Scarecrow', amountNeeded: 10},
        {name: 'Polished Shovel', amountNeeded: 20},
        {name: 'Fresh Bandages', amountNeeded: 50},
        {name: 'Oil Lanterns', amountNeeded: 100},
      ],
      achievements: [
        {name: 'Crypt Achievement I', amountNeeded: 10},
        {name: 'Crypt Achievement II', amountNeeded: 20},
        {name: 'Crypt Achievement III', amountNeeded: 50},
        {name: 'Crypt Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Hospital', namePlural: 'Hospitals', type: 'building', pic: 'hospital.png', production: 220000, desc: 'Heal your damaged ores', fillerQuote: 'An apple a day keeps the ore cancer away', basePrice: 20000000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Immunization Shot', amountNeeded: 1},
        {name: 'Blood Test', amountNeeded: 10},
        {name: 'Blood Transfusion', amountNeeded: 20},
        {name: 'CAT Scan', amountNeeded: 50},
        {name: 'Enhancement Surgery', amountNeeded: 100},
      ],
      achievements: [
        {name: 'Hospital Achievement I', amountNeeded: 10},
        {name: 'Hospital Achievement II', amountNeeded: 20},
        {name: 'Hospital Achievement III', amountNeeded: 50},
        {name: 'Hospital Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Citadel', namePlural: 'Citadels', type: 'building', pic: 'citadel.png', production: 1666666, desc: 'wip', fillerQuote: 'wip', basePrice: 6666666600, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Council of Rocks', amountNeeded: 1}
      ],
      achievements: [
        {name: 'Citadel Achievement I', amountNeeded: 10},
        {name: 'Citadel Achievement II', amountNeeded: 20},
        {name: 'Citadel Achievement III', amountNeeded: 50},
        {name: 'Citadel Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Xeno Spaceship', namePlural: 'Xeno Spaceships', type: 'building', pic: 'xeno-spaceship.png', production: 45678910, desc: 'wip', fillerQuote: 'wip', basePrice: 75849204700, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Jet Fuel', amountNeeded: 1}
      ],
      achievements: [
        {name: 'Xeno Spaceship Achievement I', amountNeeded: 10},
        {name: 'Xeno Spaceship Achievement II', amountNeeded: 20},
        {name: 'Xeno Spaceship Achievement III', amountNeeded: 50},
        {name: 'Xeno Spaceship Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Sky Castle', namePlural: 'Sky Castles', type: 'building', pic: 'skycastle.png', production: 777777777, desc: 'wip', fillerQuote: 'wip', basePrice: 550000000000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Golden Eggs', amountNeeded: 1}
      ],
      achievements: [
        {name: 'Sky Castle Achievement I', amountNeeded: 10},
        {name: 'Sky Castle Achievement II', amountNeeded: 20},
        {name: 'Sky Castle Achievement III', amountNeeded: 50},
        {name: 'Sky Castle Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Eon Portal', namePlural: 'Eon Portal', type: 'building', pic: 'eonportal.png', production: 8888800000, desc: 'wip', fillerQuote: 'wip', basePrice: 7943000000000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Green Goop', amountNeeded: 1}
      ],
      achievements: [
        {name: 'Eon Portal Achievement I', amountNeeded: 10},
        {name: 'Eon Portal Achievement II', amountNeeded: 20},
        {name: 'Eon Portal Achievement III', amountNeeded: 50},
        {name: 'Eon Portal Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Sacred Mine', namePlural: 'Sacred Mines', type: 'building', pic: 'sacredmines.png', production: 40501030500, desc: 'wip', fillerQuote: 'wip', basePrice: 30000000000000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Unholy Mineshaft', amountNeeded: 1}
      ],
      achievements: [
        {name: 'Sacred Mines Achievement I', amountNeeded: 10},
        {name: 'Sacred Mines Achievement II', amountNeeded: 20},
        {name: 'Sacred Mines Achievement III', amountNeeded: 50},
        {name: 'Sacred Mines Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'O.A.R.D.I.S.', namePlural: 'O.A.R.D.I.S.s', type: 'building', pic: 'oardis.png', production: 110100110110, desc: 'wip', fillerQuote: 'wip', basePrice: 600000000000000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'OARDISupgrade', amountNeeded: 1}
      ],
      achievements: [
        {name: 'O.A.R.D.I.S. Achievement I', amountNeeded: 10},
        {name: 'O.A.R.D.I.S. Achievement II', amountNeeded: 20},
        {name: 'O.A.R.D.I.S. Achievement III', amountNeeded: 50},
        {name: 'O.A.R.D.I.S. Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'Final Destination', namePlural: 'Final Destination', type: 'building', pic: 'final-destination.png', production: 9999999999999990, desc: 'The final destination', fillerQuote: 'You Win', basePrice: 999999999999999999999999999999999, hidden: 3,
  },


   /* ----------------------------------------------------------------------------------------
      UPGRADES
  ---------------------------------------------------------------------------------------- */



  {name: 'Magnifying Glass', type: 'upgrade', pic: 'magnifying-glass.png', desc: 'Allows you to spot weakpoints inside the rock', fillerQuote: 'These sure will help...', price: 5, hidden: 1},
  {name: 'Clean Magnifying Glass', type: 'upgrade', pic: 'clean-magnifying-glass.png', desc: 'Increases weak hit multiplier by 5x', fillerQuote: 'wip', price: 100, hidden: 1},
  {name: 'Polish Magnifying Glass', type: 'upgrade', pic: 'wip.png', desc: 'Increases weak hit multiplier by 5x', fillerQuote: 'wip', price: 50000, hidden: 1},


  // School
  {
    name: 'Composition Notebooks', type: 'upgrade', pic: 'compositionnotebook.png', desc: 'Doubles the production of Schools', fillerQuote: 'wip', price: 80, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 2}
    }
  },
  {
    name: 'No. 2 Pencil', type: 'upgrade', pic: 'no2pencil.png', desc: 'Triples the production of Schools', fillerQuote: 'wip', price: 1000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 3}
    }
  },
  {
    name: '3 Ring Binder', type: 'upgrade', pic: '3ringbinder.png', desc: 'Doubles the production of Schools', fillerQuote: 'wip', price: 12000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 2}
    }
  },
  {
    name: 'Looseleaf', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Schools', fillerQuote: 'wip', price: 450000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 3}
    }
  },
  {
    name: 'Schoolbag', type: 'upgrade', pic: 'wip.png', desc: 'Quintuples the production of Schools', fillerQuote: 'wip', price: 5500000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 5}
    }
  },

  // Farm
  {
    name: 'Manure Spreader', type: 'upgrade', pic: 'manure-spreader.png', desc: 'Doubles the production of Farms', fillerQuote: 'wip', price: 950, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 2}
    }
  },
  {
    name: 'Pitchfork', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Farms', fillerQuote: 'wip', price: 12500, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 3}
    }
  },
  {
    name: 'Tractor', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Farms', fillerQuote: 'wip', price: 265000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 2}
    }
  },
  {
    name: 'Rotary Cutter', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Farms', fillerQuote: 'wip', price: 3450000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 3}
    }
  },
  {
    name: 'Hoe', type: 'upgrade', pic: 'wip.png', desc: 'Quintuples the production of Farms', fillerQuote: ';)', price: 69000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 5}
    }
  },

  // Quarry
  {
    name: 'Headlights', type: 'upgrade', pic: 'headlights.png', desc: 'Doubles the production of Quarrys', fillerQuote: 'wip', price: 1900, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 2}
    }
  },
  {
    name: 'Twill Rope', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Quarrys', fillerQuote: 'wip', price: 11000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 3}
    }
  },
  {
    name: 'Wooden Compass', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Quarrys', fillerQuote: 'wip', price: 510000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 2}
    }
  },
  {
    name: 'Ore Filter', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Quarrys', fillerQuote: 'wip', price:7000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 3}
    }
  },
  {
    name: 'Waterproof Tape', type: 'upgrade', pic: 'wip.png', desc: 'Quintuples the production of Quarrys', fillerQuote: 'wip', price:80000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 5}
    }
  },

  // Church
  {
    name: 'Scripture Reading', type: 'upgrade', pic: 'scripture-reading.png', desc: 'Doubles the production of Churches', fillerQuote: 'wip', price: 60000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 2}
    }
  },
  {
    name: 'Communion', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Churches', fillerQuote: 'Not communism', price: 740000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 3}
    }
  },
  {
    name: 'Worship Session', type: 'upgrade', pic: 'wip.png', desc: 'Double the production of Churches', fillerQuote: 'wip', price: 2800000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 2}
    }
  },
  {
    name: '7th Day', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Churches', fillerQuote: 'wip', price: 62000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 3}
    }
  },
  {
    name: 'Judgement Day', type: 'upgrade', pic: 'wip.png', desc: 'Quintuples the production of Churches', fillerQuote: 'wip', price: 777000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 5}
    }
  },

  // Factory
  {
    name: 'Rubber Conveyor Belt', type: 'upgrade', pic: 'rubber-conveyor-belt.png', desc: 'Doubles the production of Factories', fillerQuote: 'wip', price: 300000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 2}
    }
  },
  {
    name: 'Floppy Squiggle Tubes', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Factories', fillerQuote: 'wip', price: 3000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 3}
    }
  },
  {
    name: 'Clicky Squish Buttons', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Factories', fillerQuote: 'wip', price: 44000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 2}
    }
  },
  {
    name: 'Metallic Magnetic Panels', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Factories', fillerQuote: 'wip', price: 800000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 3}
    }
  },
  {
    name: 'Hydroponic Screws', type: 'upgrade', pic: 'wip.png', desc: 'Quintuples the production of Factories', fillerQuote: 'wip', price: 5300000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 5}
    }
  },

  // Crypt
  {
    name: 'Metal Sarcophagus', type: 'upgrade', pic: 'metal-sarcophagus.png', desc: 'Doubles the production of Crypt', fillerQuote: 'wip', price: 5200000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Crypt', multi: 2}
    }
  },
  {
    name: 'Scarecrow', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of factories', fillerQuote: 'Scare the ghosties away', price: 72000000, hidden: 1,
    buyFunction: {
      increaseProduction: {building: 'Crypt', multi: 3}
    }
  },
  {
    name: 'Polished Shovel', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of factories', fillerQuote: 'wip', price: 150000000, hidden: 1,
    buyFunction: {
      increaseProduction: {building: 'Crypt', multi: 2}
    }
  },
  {
    name: 'Fresh Bandages', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of factories', fillerQuote: 'wip', price: 2500000000, hidden: 1,
    buyFunction: {
      increaseProduction: {building: 'Crypt', multi: 3}
    }
  },
  {
    name: 'Oil Lanterns', type: 'upgrade', pic: 'wip.png', desc: 'Quintuples the production of factories', fillerQuote: 'Sets the mood', price: 50000000000, hidden: 1,
    buyFunction: {
      increaseProduction: {building: 'Crypt', multi: 5}
    }
  },

  // Hospital
  {
    name: 'Immunization Shots', type: 'upgrade', pic: 'immunization-shot.png', desc: 'Doubles the production of Hospitals', fillerQuote: 'wip', price: 10000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 2}
    }
  },
  {
    name: 'Blood Test', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Hospitals', fillerQuote: 'wip', price: 300000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 3}
    }
  },
  {
    name: 'Blood Transfusion', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of Hospitals', fillerQuote: 'wip', price: 2900000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 2}
    }
  },
  {
    name: 'CAT Scan', type: 'upgrade', pic: 'wip.png', desc: 'Triples the production of Hospitals', fillerQuote: 'wip', price: 82000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 3}
    }
  },
  {
    name: 'Enhancement Surgery', type: 'upgrade', pic: 'wip.png', desc: 'Quintuples the production of Hospitals', fillerQuote: 'wip', price: 900000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 5}
    }
  },


  // Citadel
  {
    name: 'Council of Rocks', type: 'upgrade', pic: 'council-of-rocks.png', desc: 'Doubles the production of Citadel', fillerQuote: 'wip', price: 400000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Citadel', multi: 2}
    }
  },


  // Xeno Spaceship
  {
    name: 'Jet Fuel', type: 'upgrade', pic: 'jet-fuel.png', desc: 'Doubles the production of Xeno Spaceships', fillerQuote: 'wip', price: 5500000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Xeno Spaceship', multi: 2}
    }
  },

  // Sky Castle
  {
    name: 'Golden Eggs', type: 'upgrade', pic: 'golden-egg.png', desc: 'Doubles the production of Sky Castles', fillerQuote: 'wip', price: 95000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Sky Castle', multi: 2}
    }
  },

  // Eon Portal
  {
    name: 'Green Goop', type: 'upgrade', pic: 'green-goop.png', desc: 'Doubles the production of Eon Portals', fillerQuote: 'wip', price: 150000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Eon Portal', multi: 2}
    }
  },

  // Sacred Mine
  {
    name: 'Unholy Mineshaft', type: 'upgrade', pic: 'unholy-mineshaft.png', desc: 'Doubles the production of Sacred Mines', fillerQuote: 'wip', price: 2200000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Sacred Mine', multi: 2}
    }
  },

  // O.A.R.D.I.S.
  {
    name: 'OARDISupgrade', type: 'upgrade', pic: 'wip.png', desc: 'Doubles the production of OARDIS ', fillerQuote: 'wip', price: 50000000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'O.A.R.D.I.S.', multi: 2}
    }
  },

  //OTHER UPGRADES
  {
    name: 'Work Boots', type: 'upgrade', pic: 'workboots.png', desc: 'Increase all ore production by 1%', fillerQuote: 'wip', price: 500, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'ops', amount: .02},
        {type: 'opc', amount: .02}
      ]
    }
  },
  {
    name: 'Shiny Watch', type: 'upgrade', pic: 'shinywatch.png', desc: 'Increase all ore production by 2%', fillerQuote: 'wip', price: 7000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'ops', amount: .03},
        {type: 'opc', amount: .03}
      ]
    }
  },
  {
    name: 'Safety Vest', type: 'upgrade', pic: 'wip.png', desc: 'Increase all ore production by 2%', fillerQuote: 'wip', price: 85000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'ops', amount: .05},
        {type: 'opc', amount: .05}
      ]
    }
  },

  {
    name: 'Painkillers', type: 'upgrade', pic: 'painkillers.png', desc: 'Double your OpC', fillerQuote: 'wip', price: 15000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
  {
    name: 'Whetstone', type: 'upgrade', pic: 'whetstone.png', desc: 'Double your OpC', fillerQuote: 'wip', price:  400000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
  {
    name: 'Steroids', type: 'upgrade', pic: 'steroids.png', desc: 'Double your OpC', fillerQuote: 'wip', price: 1000000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
  {
    name: 'Flashlight', type: 'upgrade', pic: 'flashlight.png', desc: 'Gain 1% of your OpS as OpC', fillerQuote: 'wip', price: 50000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
  {
    name: 'Clipboard', type: 'upgrade', pic: 'clipboard.png', desc: 'Gain 2% of your OpS as OpC', fillerQuote: 'wip', price: 200000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
]







