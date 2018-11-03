const ORE_SPRITE = s( '.ore-sprite' )
const HIDE_SHOP_BTN = s( '.hide-shop-btn' )
const RIGHT_CONTAINER = s( '.right-container' )
const INVENTORY_EL = s('.topbar-inventory')

let S = new State().state

let earn = ( amount ) => {
  update_ore_hp( amount )

  S.stats.total_ores_earned += amount
  S.ores += amount
}

let calculate_opc = () => {
  let opc = S.opc
  return opc
}

let init_game = () => {
  start_loop()
  ORE_SPRITE.addEventListener( 'click', handle_click )
}

let handle_click = () => {
  let opc = calculate_opc()

  earn( opc )
}

let start_loop = () => {
  setInterval(() => {
    update_topbar_inventory()
    update_ore_sprite()
  }, 1000 / S.prefs.game_speed)
}

let update_ore_hp = ( amount ) => {
  if (S.current_ore_hp - amount <= 0 ) {
    S.stats.current_rocks_destroyed += 1
    S.stats.total_rocks_destroyed += 1
    S.current_ore_max_hp *= 1.5
    S.current_ore_hp = S.current_ore_max_hp
  } else {
    S.current_ore_hp -= amount
  }
}

let update_ore_sprite = () => {
  let current_percentage = S.current_ore_hp/S.current_ore_max_hp * 100

  if ( current_percentage < 20 ) {
    ORE_SPRITE.src = '/assets/images/ore1-5.png'
  } else if ( current_percentage < 40 ) {
    ORE_SPRITE.src = '/assets/images/ore1-4.png'
  } else if ( current_percentage < 60 ) {
    ORE_SPRITE.src = '/assets/images/ore1-3.png'
  } else if ( current_percentage < 80 ) {
    ORE_SPRITE.src = '/assets/images/ore1-2.png'
  } else {
    ORE_SPRITE.src = '/assets/images/ore1-1.png'
  }
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