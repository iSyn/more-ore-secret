const ORE_SPRITE = s( '.ore-sprite' )
const HIDE_SHOP_BTN = s( '.hide-shop-btn' )
const RIGHT_CONTAINER = s( '.right-container' )
const INVENTORY_EL = s('.topbar-inventory')

let S = new State().state

let earn = ( event ) => {
  let opc = calculate_opc()
  S.ores += opc
}

let calculate_opc = () => {
  let opc = S.opc
  return opc
}

let init_game = () => {
  start_loop()
  ORE_SPRITE.addEventListener( 'click', earn )
}

let start_loop = () => {
  setInterval(() => {
    update_topbar_inventory()
    update_ore_sprite()
  }, 1000 / S.prefs.game_speed)
}

let update_ore_sprite = () => {

}

let update_topbar_inventory = () => {
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

  INVENTORY_EL.innerHTML = str
}

HIDE_SHOP_BTN.onclick = () => RIGHT_CONTAINER.classList.toggle( 'closed' )

window.onload = () => { init_game() }