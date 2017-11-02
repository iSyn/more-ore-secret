Game.quests = []

let Quest = function(obj) {
  this.name = obj.name
  this.functionName = obj.name.replace(/ /g,'')
  this.timesCompleted = 0
  this.desc = obj.desc
  this.locked = obj.locked
  this.img = obj.img
  this.completionTime = obj.completionTime
  this.completionTimeTxt = obj.completionTimeTxt

  Game.quests.push(this)
}

new Quest({
  name: 'Abandoned Mineshaft',
  locked: 0,
  desc: 'Traverse into an abandoned mineshaft for hopes of greater rewards',
  img: 'wip.png',
  completionTime: 30,
  completionTimeTxt: '30 minutes'
})
new Quest({name: 'Darkest Dungeon', locked: 1, desc: 'wip.png', img: 'wip.png'})
new Quest({name: 'Test name', locked: 2, desc: 'wip.png', img: 'wip.png'})
new Quest({name: 'Test name 2', locked: 2, desc: 'wip.png', img: 'wip.png'})
new Quest({name: 'Test name 3', locked: 2, desc: 'wip.png', img: 'wip.png'})

Game.showQuests = () => {
  if (Game.state.player.generation >= 1) {
    let div = document.createElement('div')
    div.classList.add('wrapper')

    let str = `
      <div class="quests-container">
        <h1 style='font-size: 3rem; padding: 10px 0;'>Quests</h1>
        <p onclick='Game.closeCurrentWindow()' style='position: absolute; top: 5px; right: 5px; cursor: pointer'>X</p>
        <div class="active-quest-container">
          <hr/>
          <p>No active quests :(</p>
          <hr/>
        </div>
        <div class="available-quests-container">
        `
          for (i=0; i<Game.quests.length; i++) {
            if (Game.quests[i].locked == 0) {
              str += `
                <div class="available-quest unlocked" onclick="Game.showQuestInformation('${Game.quests[i].functionName}')">
                  <p>${Game.quests[i].name}</p>
                  <p class='quest-est-time' style='font-size: small'>completetion time: ${Game.quests[i].completionTimeTxt}</p>
                </div>
              `
            } else if (Game.quests[i].locked == 1) {
              str += `
                <div style='opacity: .7' class="available-quest">
                  <p>???</p>
                </div>
              `
            } else {
              str += `
                <div style='opacity: .2' class="available-quest hidden-quest">
                  <p>???</p>
                </div>
              `
            }
          }
        `
        </div>
      </div>
    `

    div.innerHTML = str
    s('body').append(div)
  }
}

Game.showQuestInformation = (questName) => {
  let selectedQuest = {}
  for (i=0; i<Game.quests.length; i++) {
    if (Game.quests[i].functionName == questName) {
      selectedQuest = Game.quests[i]
    }
  }

  let div = document.createElement('div')
  div.classList.add('wrapper')
  div.innerHTML = `
    <div class="quest-information">
      <h1 style='padding:10px 0'>${selectedQuest.name}</h1>
      <p onclick='Game.closeCurrentWindow()' style='position: absolute; top: 5px; right: 5px; cursor: pointer'>X</p>
      <hr/>
      <img src="./assets/${selectedQuest.img}" class="quest-img"'>
      <hr/>
      <p>${selectedQuest.desc} <br/> Completion Time: ${selectedQuest.completionTimeTxt}</p>
      <hr/>
      <div class="quest-information-bottom">
        <div style='width: 40%' class="quest-information-bottom-left">
          <p>TIMES COMPLETED: 0</p>
          <p>QUEST REWARDS</p>
          <p>5 completions - ???</p>
          <p>10 completions - ???</p>
          <p>20 completions - ???</p>
        </div>
        <div style='width: 60%' class="quest-information-bottom-right">
          <button>Adventure <i class='fa fa-long-arrow-right fa-1x'></i></button>
        </div>
      </div>
    </div>
  `

  s('body').append(div)
}
