let S = new State().state

let init_game = () => {
  start_loop()
}

let start_loop = () => {
  setInterval(() => {
    update_topbar_inventory()
  }, 1000 / S.prefs.game_speed)
}

let update_topbar_inventory = () => {
  let inventory_el = s('.topbar-inventory')
  let str = `
    <div class='left'>
      <p>Ores: ${ S.ores }</p>
      `
      if ( S.stats.total_gems_earned > 0 ) {
        str += `<p>Gems: ${ S.gems }</p>`
      }

      str += `
    </div>
    <div class='right'>
      <p>Generation: ${ S.generation }</p>
    </div>
  `

  inventory_el.innerHTML = str
}

let hide_shop_btn = s('.hide-shop-btn')
let right_container = s('.right-container')
hide_shop_btn.onclick = () => right_container.classList.toggle('closed')

window.onload = () => { init_game() }