const ORE_SPRITE = s( '.ore-sprite' )
const HIDE_SHOP_BTN = s( '.hide-shop-btn' )
const RIGHT_CONTAINER = s( '.right-container' )
const INVENTORY_EL = s( '.topbar-inventory' )
const ORE_WEAK_SPOT_CONTAINER = s( '.ore-weak-spot-container' )
const ORE_WEAK_SPOT = s( '.ore-weak-spot' )

let S = new State().state
let SFX = new SoundEngine()
let RN = new RisingNumber()

let earn = ( amount ) => {
  update_ore_hp( amount )

  S.stats.total_ores_earned += amount
  S.ores += amount
}

let calculate_opc = ( type ) => {
  let opc = S.opc

  if ( type ) {
    if ( type == 'weak-spot' ) {
      opc *= S.weak_hit_multi
    }
  }

  return opc
}

let init_game = () => {
  start_loop()
  generate_weak_spot()
  ORE_SPRITE.addEventListener( 'click', handle_click )
  ORE_WEAK_SPOT.addEventListener( 'click', ( e ) => {
    handle_click( e, 'weak-spot' )
    generate_weak_spot()
  })
}

let generate_weak_spot = () => {

  let ore_sprite_coords = ORE_SPRITE.getBoundingClientRect()

  // POSITION CONTAINER AROUND ORE SPRITE
  ORE_WEAK_SPOT_CONTAINER.style.position = 'absolute'
  ORE_WEAK_SPOT_CONTAINER.style.width = ore_sprite_coords.width + 'px'
  ORE_WEAK_SPOT_CONTAINER.style.height = ore_sprite_coords.height + 'px'
  ORE_WEAK_SPOT_CONTAINER.style.bottom = 0

  // PICK RANDOM COORDS FOR WEAK SPOT
  let ore_weak_spot_container_coords = ORE_WEAK_SPOT_CONTAINER.getBoundingClientRect()

  let x = get_random_num( 0, ( ore_weak_spot_container_coords.right - ore_weak_spot_container_coords.left ) )
  let y = get_random_num( 0, ( ore_weak_spot_container_coords.bottom - ore_weak_spot_container_coords.top ) )

  ORE_WEAK_SPOT.style.left = x + 'px'
  ORE_WEAK_SPOT.style.top = y + 'px'

}

let handle_click = ( e, type ) => {

  let opc = calculate_opc( type )

  if ( type ) {
    SFX.ore_weak_spot_hit_sfx.play()
    S.stats.total_weak_hit_clicks++
    RN.new( event, 'weak-hit-click', opc )
  } else {
    SFX.ore_hit_sfx.play()
    RN.new( event, 'click', opc )
  }

  S.stats.total_clicks++

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
    SFX.ore_destroyed_sfx.play()
    S.stats.current_rocks_destroyed += 1
    S.stats.total_rocks_destroyed += 1
    S.current_ore_max_hp *= 1.5
    S.current_ore_hp = S.current_ore_max_hp
    current_sprite = 0
  } else {
    S.current_ore_hp -= amount
  }
}

let current_sprite = 0
let update_ore_sprite = () => {
  let current_percentage = S.current_ore_hp / S.current_ore_max_hp * 100

  if ( current_percentage <= 100 && current_percentage > 80 && current_sprite != 1 ) {
    ORE_SPRITE.src = '/assets/images/ore1-1.png'
    current_sprite = 1
  } else if ( current_percentage <= 80 && current_percentage > 60 && current_sprite != 2 ) {
    SFX.ore_percentage_lost_sfx.play()
    ORE_SPRITE.src = '/assets/images/ore1-2.png'
    current_sprite = 2
  } else if ( current_percentage <= 60 && current_percentage > 40 && current_sprite != 3 ) {
    SFX.ore_percentage_lost_sfx.play()
    ORE_SPRITE.src = '/assets/images/ore1-3.png'
    current_sprite = 3
  } else if ( current_percentage <= 40 && current_percentage > 20 && current_sprite != 4 ) {
    SFX.ore_percentage_lost_sfx.play()
    ORE_SPRITE.src = '/assets/images/ore1-4.png'
    current_sprite = 4
  } else if ( current_percentage <= 20 && current_sprite != 5 ) {
    SFX.ore_percentage_lost_sfx.play()
    ORE_SPRITE.src = '/assets/images/ore1-5.png'
    current_sprite = 5
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