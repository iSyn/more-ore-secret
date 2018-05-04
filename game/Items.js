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

  this.buy = (event) => {

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
      Game.spend(price)
      Game.playSound('buysound')
      Game.risingNumber(event, null, 'spendMoney')
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
    name: 'School', namePlural: 'Schools', type: 'building', pic: 'building_school.png', production: .3, desc: 'Teach students about the wonders of ores', fillerQuote: 'Jesus Christ Marie, they\'re minerals!', basePrice: 6, hidden: 0,
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
        {text: '[Breaking News] The school district superintendent has announced new ore related classes to take', amountNeeded: 10},
        {text: 'Geology PHD becoming increasingly common among graduates.', amountNeeded: 20}
      ],
      achievements: [
        {name: 'Elementary', amountNeeded: 10},
        {name: 'Graduation', amountNeeded: 50},
        {name: 'GED', amountNeeded: 100},
        {name: 'Ivy League', amountNeeded: 200}
      ]
    }
  },
  {
    name: 'Farm', namePlural: 'Farms', type: 'building', pic: 'building_farm.png', production: 1, desc: 'Cultivate the lands for higher quality ores', fillerQuote: 'This totally makes sense.', basePrice: 210, hidden: 1,
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
        {name: 'Rock Farmer', amountNeeded: 10},
        {name: '25 Acres', amountNeeded: 50},
        {name: '100 Acres', amountNeeded: 100},
        {name: 'Slaughterhouse', amountNeeded: 200}
      ]
    }
  },
  {
    name: 'Quarry', namePlural: 'Quarries', type: 'building', pic: 'building_quarry.png', production: 20, desc: 'Designated mining area', fillerQuote: 'mine mine mine', basePrice: 2520, hidden: 1,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Headlights', amountNeeded: 1},
        {name: 'Twill Rope', amountNeeded: 10},
        {name: 'Wooden Compass', amountNeeded: 20},
        {name: 'Ore Filter', amountNeeded: 50},
        {name: 'Waterproof Tape', amountNeeded: 100}
      ],
      achievements: [
        {name: 'Sifter', amountNeeded: 10},
        {name: 'Digger', amountNeeded: 50},
        {name: "They're not rocks, they're minerals!", amountNeeded: 100},
        {name: 'Prospector', amountNeeded: 200}
      ]
    }
  },
  {
    name: 'Church', namePlural: 'Churches', type: 'building', pic: 'building_church.png', production: 320, desc: 'Praise to the Ore Gods', fillerQuote: 'In Ore name we pray, Amen.', basePrice: 37800, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Scripture Reading', amountNeeded: 1},
        {name: 'Communion', amountNeeded: 10},
        {name: 'Worship Session', amountNeeded: 20},
        {name: '7th Day', amountNeeded: 50},
        {name: 'Judgement Day', amountNeeded: 100},
      ],
      addTextScroller: [
        {text: '[Breaking News] Religious fanatics take miners hostage, do mining themselves', amountNeeded: 10}
      ],
      achievements: [
        {name: 'Communion', amountNeeded: 10},
        {name: 'Sacrifice', amountNeeded: 50},
        {name: 'Worshipper', amountNeeded: 100},
        {name: 'Pope', amountNeeded: 200}
      ]
    }
  },
  {
    name: 'Factory', namePlural: 'Factories', type: 'building', pic: 'building_factory.png', production: 4480, desc: 'Manufacture your ores', fillerQuote: 'Assembly line this sh&* up!', basePrice: 491400, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Rubber Conveyor Belt', amountNeeded: 1},
        {name: 'Floppy Squiggle Tubes', amountNeeded: 10},
        {name: 'Clicky Squish Buttons', amountNeeded: 20},
        {name: 'Metallic Magnetic Panels', amountNeeded: 50},
        {name: 'Hydroponic Screws', amountNeeded: 100},
      ],
      addTextScroller: [
        {text: 'How it\'s made: Ores airs tonight at 6. Take a look into the ore industries factories and watch it each step of the way.', amountNeeded: 5}
      ],
      achievements: [
        {name: 'Assembly Line', amountNeeded: 10},
        {name: 'Mass Production', amountNeeded: 50},
        {name: 'Outsourced Production', amountNeeded: 100},
        {name: 'Automated Production', amountNeeded: 200}
      ]
    }
  },
  {
    name: 'Crypt', namePlural: 'Crypts', type: 'building', pic: 'building_crypt.png', production: 67200, desc: 'Raise dead ores from the graves', fillerQuote: 'spooky ores', basePrice: 7862400, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Metal Sarcophagus', amountNeeded: 1},
        {name: 'Scarecrow', amountNeeded: 10},
        {name: 'Polished Shovel', amountNeeded: 20},
        {name: 'Fresh Bandages', amountNeeded: 50},
        {name: 'Oil Lanterns', amountNeeded: 100},
      ],
      achievements: [
        {name: 'Gravedigger', amountNeeded: 10},
        {name: 'Groundskeeper', amountNeeded: 50},
        {name: 'Graverobber', amountNeeded: 100},
        {name: 'Tomb Raider', amountNeeded: 200}
      ]
    }
  },
  {
    name: 'Hospital', namePlural: 'Hospitals', type: 'building', pic: 'building_hospital.png', production: 1344000, desc: 'Heal your damaged ores', fillerQuote: 'An apple a day keeps the ore cancer away', basePrice: 196560000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Immunization Shot', amountNeeded: 1},
        {name: 'Blood Test', amountNeeded: 10},
        {name: 'Blood Transfusion', amountNeeded: 20},
        {name: 'CAT Scan', amountNeeded: 50},
        {name: 'Enhancement Surgery', amountNeeded: 100},
      ],
      addTextScroller: [
        {text: '[Breaking News] Ore Pox cured! Billions saved!', amountNeeded: 10}
      ],
      achievements: [
        {name: 'Herbal Supplements', amountNeeded: 10},
        {name: 'Homeopathy Kit', amountNeeded: 50},
        {name: 'Vitamins & Minerals', amountNeeded: 100},
        {name: 'Rock Doctor', amountNeeded: 200}
      ]
    }
  },
  {
    name: 'Citadel', namePlural: 'Citadels', type: 'building', pic: 'building_citadel.png', production: 14784000, desc: 'wip', fillerQuote: 'wip', basePrice: 2751840000, hidden: 2,
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
    name: 'Xeno Spaceship', namePlural: 'Xeno Spaceships', type: 'building', pic: 'building_xeno-spaceship.png', production: 192192000, desc: 'Import ores from the ore filled galaxy', fillerQuote: 'A universe full of intelligent life, too intelligent to come here.', basePrice: 49533120000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Jet Fuel', amountNeeded: 1}
      ],
      addTextScroller: [
        {text: '[Breaking News] Alien Abductions startingly more common', amountNeeded: 2},
        {text: '[Breaking News] Man abducted by aliens and experimented on now Ore-Human hybrid', amountNeeded: 5 }
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
    name: 'Sky Castle', namePlural: 'Sky Castles', type: 'building', pic: 'building_skycastle.png', production: 3843840000, desc: 'Use magic beans to reach an egg based source of ore', fillerQuote: 'wip', basePrice: 1238328000000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Golden Eggs', amountNeeded: 1}
      ],
      addTextScroller: [
        {text: '[Breaking News] Magic beanstalk accident kills 7 today in what has been called the largest beanstalk related accident in history', amountNeeded: 5}
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
    name: 'Eon Portal', namePlural: 'Eon Portal', type: 'building', pic: 'building_eonportal.png', production: 45126080000, desc: 'Steal ore from your past and future self', fillerQuote: 'wip', basePrice: 18574920000000, hidden: 2,
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
    name: 'Sacred Mine', namePlural: 'Sacred Mines', type: 'building', pic: 'building_sacredmines.png', production: 691891200000, desc: 'wip', fillerQuote: 'wip', basePrice: 297198720000000, hidden: 2,
    buyFunctions: {
      unlockUpgrades: [
        {name: 'Unholy Mineshaft', amountNeeded: 1}
      ],
      achievements: [
        {name: 'Sacred Mine Achievement I', amountNeeded: 10},
        {name: 'Sacred Mine Achievement II', amountNeeded: 20},
        {name: 'Sacred Mine Achievement III', amountNeeded: 50},
        {name: 'Sacred Mine Achievement IV', amountNeeded: 100}
      ]
    }
  },
  {
    name: 'O.A.R.D.I.S.', namePlural: 'O.A.R.D.I.S.s', type: 'building', pic: 'building_oardis.png', production: 17289780000000, desc: 'wip', fillerQuote: 'wip', basePrice: 8915961600000000, hidden: 2,
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
    name: 'Final Destination', namePlural: 'Final Destination', type: 'building', pic: 'building_final-destination.png', production: 999999999999999999, desc: 'The final destination', fillerQuote: 'You Win', basePrice: 999999999999999999999999999999999, hidden: 3,
  },


   /* ----------------------------------------------------------------------------------------
      UPGRADES
  ---------------------------------------------------------------------------------------- */



  {name: 'Magnifying Glass', type: 'upgrade', pic: 'upgrade_magnifying-glass.png', desc: 'Allows you to spot weakpoints inside the rock', fillerQuote: 'These sure will help...', price: 5, hidden: 1},
  {name: 'Clean Magnifying Glass', type: 'upgrade', pic: 'upgrade_clean-magnifying-glass.png', desc: 'Increases weak hit multiplier by 5x', fillerQuote: 'Now with 50% less smudging!', price: 100, hidden: 1},
  {name: 'Polish Magnifying Glass', type: 'upgrade', pic: 'misc_wip.png', desc: 'Increases weak hit multiplier by 5x', fillerQuote: 'Polish, not Polish', price: 50000, hidden: 1},


  // School
  {
    name: 'Composition Notebooks', type: 'upgrade', pic: 'upgrade_compositionnotebook.png', desc: 'Doubles the production of Schools', fillerQuote: 'College Ruled!', price: 80, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 2}
    }
  },
  {
    name: 'No. 2 Pencil', type: 'upgrade', pic: 'upgrade_no2pencil.png', desc: 'Triples the production of Schools', fillerQuote: 'Test ready!', price: 1000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 3}
    }
  },
  {
    name: '3 Ring Binder', type: 'upgrade', pic: 'upgrade_3ringbinder.png', desc: 'Doubles the production of Schools', fillerQuote: 'Be the Lord of the Rings with our new 2.5\" binder!', price: 12000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 2}
    }
  },
  {
    name: 'Looseleaf', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Schools', fillerQuote: 'Can I borrow a sheet?', price: 450000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 3}
    }
  },
  {
    name: 'Schoolbag', type: 'upgrade', pic: 'misc_wip.png', desc: 'Quintuples the production of Schools', fillerQuote: 'Break your back carrying one of these stylish bags!', price: 5500000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'School', multi: 5}
    }
  },

  // Farm
  {
    name: 'Manure Spreader', type: 'upgrade', pic: 'upgrade_manure-spreader.png', desc: 'Doubles the production of Farms', fillerQuote: 'The poop helps the ore.', price: 950, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 2}
    }
  },
  {
    name: 'Pitchfork', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Farms', fillerQuote: 'Torches not included.', price: 12500, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 3}
    }
  },
  {
    name: 'Tractor', type: 'upgrade', pic: 'misc_wip.png', desc: 'Doubles the production of Farms', fillerQuote: 'Firmware crack preinstalled!', price: 265000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 2}
    }
  },
  {
    name: 'Rotary Cutter', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Farms', fillerQuote: 'Now not even grass can stop us.', price: 3450000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 3}
    }
  },
  {
    name: 'Hoe', type: 'upgrade', pic: 'misc_wip.png', desc: 'Quintuples the production of Farms', fillerQuote: ';)', price: 69000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Farm', multi: 5}
    }
  },

  // Quarry
  {
    name: 'Floodlights', type: 'upgrade', pic: 'upgrade_headlights.png', desc: 'Doubles the production of Quarrys', fillerQuote: 'Staring into one of them is like staring into a billion suns.', price: 1900, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 2}
    }
  },
  {
    name: 'Twill Rope', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Quarrys', fillerQuote: 'Sturdy enough.', price: 11000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 3}
    }
  },
  {
    name: 'Wooden Compass', type: 'upgrade', pic: 'misc_wip.png', desc: 'Doubles the production of Quarrys', fillerQuote: 'Never eat soggy waffles.', price: 510000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 2}
    }
  },
  {
    name: 'Ore Filter', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Quarrys', fillerQuote: 'Less sorting, more ore.', price:7000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 3}
    }
  },
  {
    name: 'Waterproof Tape', type: 'upgrade', pic: 'misc_wip.png', desc: 'Quintuples the production of Quarrys', fillerQuote: 'Works underwater!', price:80000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Quarry', multi: 5}
    }
  },

  // Church
  {
    name: 'Scripture Reading', type: 'upgrade', pic: 'upgrade_scripture-reading.png', desc: 'Doubles the production of Churches', fillerQuote: 'Read the word of our l-ore-d and savior.', price: 60000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 2}
    }
  },
  {
    name: 'Communion', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Churches', fillerQuote: 'Not communism.', price: 740000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 3}
    }
  },
  {
    name: 'Worship Session', type: 'upgrade', pic: 'misc_wip.png', desc: 'Double the production of Churches', fillerQuote: 'More like W-ore-ship haha', price: 2800000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 2}
    }
  },
  {
    name: '7th Day', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Churches', fillerQuote: 'You would think a day of worship is one less day of work but somehow it works out to more ore!', price: 62000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 3}
    }
  },
  {
    name: 'Judgement Day', type: 'upgrade', pic: 'misc_wip.png', desc: 'Quintuples the production of Churches', fillerQuote: 'And just as there was light, there was now only dark.', price: 777000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Church', multi: 5}
    }
  },

  // Factory
  {
    name: 'Rubber Conveyor Belt', type: 'upgrade', pic: 'upgrade_rubber-conveyor-belt.png', desc: 'Doubles the production of Factories', fillerQuote: 'These move the things to there, that\'s all I know.', price: 300000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 2}
    }
  },
  {
    name: 'Floppy Squiggle Tubes', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Factories', fillerQuote: 'If I could tell you what these were for you\'d buy twice as many.', price: 3000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 3}
    }
  },
  {
    name: 'Clicky Squish Buttons', type: 'upgrade', pic: 'misc_wip.png', desc: 'Doubles the production of Factories', fillerQuote: 'These go next to the squishy click buttons.', price: 44000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 2}
    }
  },
  {
    name: 'Metallic Magnetic Panels', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Factories', fillerQuote: 'These are actually for my fridge.', price: 800000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 3}
    }
  },
  {
    name: 'Hydroponic Screws', type: 'upgrade', pic: 'misc_wip.png', desc: 'Quintuples the production of Factories', fillerQuote: 'I don\'t know what these do but we need a lot of them.', price: 5300000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Factory', multi: 5}
    }
  },

  // Crypt
  {
    name: 'Metal Sarcophagus', type: 'upgrade', pic: 'upgrade_metal-sarcophagus.png', desc: 'Doubles the production of Crypts', fillerQuote: 'Sellers note: sarcophagus does not come with mummy preinstalled.', price: 5200000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Crypt', multi: 2}
    }
  },
  {
    name: 'Scarecrow', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Crypts', fillerQuote: 'Scare the ghosties away.', price: 72000000, hidden: 1,
    buyFunction: {
      increaseProduction: {building: 'Crypt', multi: 3}
    }
  },
  {
    name: 'Polished Shovel', type: 'upgrade', pic: 'misc_wip.png', desc: 'Doubles the production of Crypts', fillerQuote: 'Tool of choice for a knight or an archaeologist.', price: 150000000, hidden: 1,
    buyFunction: {
      increaseProduction: {building: 'Crypt', multi: 2}
    }
  },
  {
    name: 'Fresh Bandages', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Crypts', fillerQuote: 'Even though used were $20 cheaper...', price: 2500000000, hidden: 1,
    buyFunction: {
      increaseProduction: {building: 'Crypt', multi: 3}
    }
  },
  {
    name: 'Oil Lanterns', type: 'upgrade', pic: 'misc_wip.png', desc: 'Quintuples the production of Crypts', fillerQuote: 'Sets the mood.', price: 50000000000, hidden: 1,
    buyFunction: {
      increaseProduction: {building: 'Crypt', multi: 5}
    }
  },

  // Hospital
  {
    name: 'Immunization Shots', type: 'upgrade', pic: 'upgrade_immunization-shot.png', desc: 'Doubles the production of Hospitals', fillerQuote: 'The reason polio was eradicated for orekind', price: 10000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 2}
    }
  },
  {
    name: 'Blood Test', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Hospitals', fillerQuote: 'Find out the blood type of your ores to better understand them.', price: 300000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 3}
    }
  },
  {
    name: 'Blood Transfusion', type: 'upgrade', pic: 'misc_wip.png', desc: 'Doubles the production of Hospitals', fillerQuote: 'Give the ores what they want: blood.', price: 2900000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 2}
    }
  },
  {
    name: 'CAT Scan', type: 'upgrade', pic: 'misc_wip.png', desc: 'Triples the production of Hospitals', fillerQuote: 'Not to be confused with PET scan.', price: 82000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 3}
    }
  },
  {
    name: 'Enhancement Surgery', type: 'upgrade', pic: 'misc_wip.png', desc: 'Quintuples the production of Hospitals', fillerQuote: 'Give the ores a much needed facelift.', price: 900000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Hospital', multi: 5}
    }
  },


  // Citadel
  {
    name: 'Council of Rocks', type: 'upgrade', pic: 'upgrade_council-of-rocks.png', desc: 'Doubles the production of Citadel', fillerQuote: 'Hushed voices, stony faces.', price: 400000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Citadel', multi: 2}
    }
  },


  // Xeno Spaceship
  {
    name: 'Jet Fuel', type: 'upgrade', pic: 'upgrade_jet-fuel.png', desc: 'Doubles the production of Xeno Spaceships', fillerQuote: 'Steel beams nowhere in sight...', price: 5500000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Xeno Spaceship', multi: 2}
    }
  },

  // Sky Castle
  {
    name: 'Golden Eggs', type: 'upgrade', pic: 'upgrade_golden-egg.png', desc: 'Doubles the production of Sky Castles', fillerQuote: 'wip', price: 95000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Sky Castle', multi: 2}
    }
  },

  // Eon Portal
  {
    name: 'Green Goop', type: 'upgrade', pic: 'upgrade_green-goop.png', desc: 'Doubles the production of Eon Portals', fillerQuote: 'Goopy!', price: 150000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Eon Portal', multi: 2}
    }
  },

  // Sacred Mine
  {
    name: 'Unholy Mineshaft', type: 'upgrade', pic: 'upgrade_unholy-mineshaft.png', desc: 'Doubles the production of Sacred Mines', fillerQuote: 'Creepy.', price: 2200000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'Sacred Mine', multi: 2}
    }
  },

  // O.A.R.D.I.S.
  {
    name: 'OARDISupgrade', type: 'upgrade', pic: 'misc_wip.png', desc: 'Doubles the production of OARDIS ', fillerQuote: 'wip', price: 50000000000000, hidden: 1,
    buyFunctions: {
      increaseProduction: {building: 'O.A.R.D.I.S.', multi: 2}
    }
  },

  //OTHER UPGRADES
  {
    name: 'Work Boots', type: 'upgrade', pic: 'upgrade_workboots.png', desc: 'Increase all ore production by 1%', fillerQuote: 'wip', price: 500, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'ops', amount: .02},
        {type: 'opc', amount: .02}
      ]
    }
  },
  {
    name: 'Shiny Watch', type: 'upgrade', pic: 'upgrade_shinywatch.png', desc: 'Increase all ore production by 2%', fillerQuote: 'My grandfather gave it to me but I guess you can have it.', price: 7000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'ops', amount: .03},
        {type: 'opc', amount: .03}
      ]
    }
  },
  {
    name: 'Safety Vest', type: 'upgrade', pic: 'upgrade_safety-vest.png', desc: 'Increase all ore production by 2%', fillerQuote: 'Makes it easier for the ores to see you.', price: 85000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'ops', amount: .05},
        {type: 'opc', amount: .05}
      ]
    }
  },

  {
    name: 'Painkillers', type: 'upgrade', pic: 'upgrade_painkillers.png', desc: 'Double your OpC', fillerQuote: 'Pills here!', price: 15000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
  {
    name: 'Whetstone', type: 'upgrade', pic: 'upgrade_whetstone.png', desc: 'Double your OpC', fillerQuote: 'Steel thy pickaxe!', price:  400000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
  {
    name: 'Steroids', type: 'upgrade', pic: 'upgrade_steroids.png', desc: 'Double your OpC', fillerQuote: 'Lets you dual wield.', price: 1000000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
  {
    name: 'Flashlight', type: 'upgrade', pic: 'upgrade_flashlight.png', desc: 'Gain 1% of your OpS as OpC', fillerQuote: 'Or a torch if you\'re so inclined.', price: 55000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
  {
    name: 'Clipboard', type: 'upgrade', pic: 'upgrade_clipboard.png', desc: 'Gain 2% of your OpS as OpC', fillerQuote: 'Makes you look all official.', price: 200000, hidden: 1,
    buyFunctions: {
      multipliers: [
        {type: 'opc', amount: 2}
      ]
    }
  },
]
