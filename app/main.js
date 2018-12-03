const VERSION = 0.01

const BODY = s( 'body' )
const CONTAINER = s( '.container' )
const GAME_CONTAINER = s( '.game-container' )
const ORE_SPRITE = s( '.ore-sprite' )
const RIGHT_CONTAINER = s( '.right-container' )
const TOPBAR_INVENTORY_CONTAINER = s( '.topbar-inventory-container' )
const TOPBAR_INVENTORY = s( '.topbar-inventory' )
const ORE_CONTAINER = s( '.ore-container' )
const ORE_WEAK_SPOT_CONTAINER = s( '.ore-weak-spot-container' )
const ORE_WEAK_SPOT = s( '.ore-weak-spot' )
const LEFT_VERTICAL_SEPARATOR = s( '.left-vertical-separator' )
const MIDDLE_VERTICAL_SEPARATOR = s( '.middle-vertical-separator' )
const RIGHT_VERTICAL_SEPARATOR = s( '.right-vertical-separator' )
const TORCH_LEFT = s( '.torch-left' )
const TORCH_RIGHT = s( '.torch-right' )
const TAB_CONTENT = s( '.tab-content' )
const TEXT_SCROLLER_CONTAINER = s( '.text-scroller-container' )
const TOOLTIP = s( '.tooltip' )
const SETTINGS_CONTAINER = s( '.settings-container' )
const TABS_CONTAINER = s( '.tabs-container' )
const AUTOMATER_WRAPPER = s( '.automater-wrapper' )
const AUTOMATER_CONTAINER = s( '.automater-container' )
const AUTOMATER_HEADER = s( '.automater-wrapper > header' )
const ACHIEVEMENT_NOTIFICATION_CONTAINER = s( '.achievement-notification-container' )
const FOOTER = s( 'footer' )
const BOTTOM_AREA_TABS = s( '.bottom-area-tabs' )
const COMBO_SIGN_CONTAINER = s( '.combo-sign-container' )

let S = new State().state
let RN = new RisingNumber()
let TS = new TextScroller()
let TT = new Tooltip()
let PE = new ParticleEngine()
let SMITH = new Smith()

let O = {
  rebuild_bottom_tabs: 1,
  rebuild_store: 1,
  reposition_elements: 1,
  recalculate_ops: 1,
  recalculate_opc: 1,

  current_tab: 'store',

  pickaxe_accordion_is_open: 0,
  
  window_blurred: false,
  counter: 0
}

let init_game = () => {
  if ( localStorage.getItem( 'state' ) ) load_game() 
  game_loop()
  S.tabs = Tabs
  build_tabs()
  build_store()

  if ( !S.locked.fragility_spectacles ) generate_weak_spot()

  handle_text_scroller()
  ORE_SPRITE.addEventListener( 'click', handle_click )
  ORE_WEAK_SPOT.addEventListener( 'click', ( e ) => { handle_click( e, 'weak-spot' ) })
  build_automater_visibility_toggle_btn()
  build_footer()
  earn_offline_resources()

  if ( S.stats.total_clicks == 0 ) tutorial_click_the_rock()
}

let save_game = () => {

  S.last_login = new Date().getTime()
  
  localStorage.setItem( 'state', JSON.stringify( S ) )
  localStorage.setItem( 'buildings', JSON.stringify( Buildings ) )
  localStorage.setItem( 'upgrades', JSON.stringify( Upgrades ) )
  localStorage.setItem( 'achievements', JSON.stringify( Achievements ) )
  localStorage.setItem( 'text_scroller', JSON.stringify( TS.texts ) )
  localStorage.setItem( 'smith_upgrades', JSON.stringify( Smith_Upgrades ) )
  localStorage.setItem( 'smith', JSON.stringify( SMITH ) )
  localStorage.setItem( 'bottom_tabs', JSON.stringify( Bottom_Tabs ) )

  notify( 'Saved Game' )
}

let load_game = () => {

  if ( localStorage.getItem( 'state' ) ) {

    S = new State( JSON.parse( localStorage.getItem( 'state' ) ) ).state

    Buildings = []
    JSON.parse( localStorage.getItem( 'buildings' ) ).forEach( building => new Building( building ) )

    // upgrades are loaded inside upgrades file

    Achievements = []
    JSON.parse( localStorage.getItem( 'achievements' ) ).forEach( achievement => new Achievement( achievement ) )

    
    let text_scroller = JSON.parse( localStorage.getItem( 'text_scroller' ) )
    TS = new TextScroller( text_scroller )

    Smith_Upgrades = []
    JSON.parse( localStorage.getItem( 'smith_upgrades' ) ).forEach( upgrade => new SmithUpgrade( upgrade ) )

    // SMITH = new Smith( JSON.parse( localStorage.getItem( 'smith' ) ) )
    if ( localStorage.getItem( 'smith' ) ) {
      SMITH = new Smith( JSON.parse( localStorage.getItem( 'smith' ) ) )
      if ( !is_empty( SMITH.upgrade_in_progress ) ) {
        SMITH._update_progress()
      }
    }

    Bottom_Tabs = []
    JSON.parse( localStorage.getItem( 'bottom_tabs' ) ).forEach( tab => new Bottom_Tab( tab ) )
  }
}

let notify = ( text, color = 'white' ) => {

  let div = document.createElement( 'div' )
  div.innerHTML = text
  div.style.position = 'absolute'
  div.style.padding = '10px 15px'
  div.style.zIndex = 2
  div.style.border = '5px ridge #3c3c3c'
  div.style.borderBottom = 'none'
  div.style.boxShadow = '0 0 10px #000 inset, 0 0 20px rgba( 255, 255, 255, 0.3)'
  div.style.textShadow = '0 0 10px'
  div.style.background = '#222'
  div.style.bottom = '0'
  div.style.right = '0'
  div.style.color = color
  div.style.animation = 'upDown 2s'
  div.addEventListener( 'animationend', () => { remove_el( div ) } )

  CONTAINER.append( div )

}

let wipe_save = () => {
  localStorage.clear()
  location.reload()
}

let build_footer = () => {
  FOOTER.innerHTML = `
    <p><strong>More Ore</strong> v.${ VERSION } created by <strong><a href='https://synclairwang.com'>Syn Studios</a></strong> | <span onclick='save_game()'>Save Game</span> | <span onclick='wipe_save()'>Wipe Save</span> | <a href='https://discord.gg/NU99mMQ' target='_blank'>Join the Discord!</a> </p>
  `
}

let on_blur = () => {
  O.window_blurred = true
  S.last_login = new Date().getTime()
}

let on_focus = () => {
  O.window_blurred = false
  earn_offline_resources( S.last_login )
}

let earn_offline_resources = () => {

  let last_time = S.last_login
  let current_time = new Date().getTime()

  if ( last_time ) {
    let amount_of_time_passed_ms = current_time - last_time
    let amount_of_time_passed_seconds = amount_of_time_passed_ms / 1000
    let amount_to_gain_raw = amount_of_time_passed_seconds * S.ops
    let amount_to_gain = amount_to_gain_raw > S.max_ore_away_gain ? S.max_ore_away_gain : amount_to_gain_raw

    SMITH.current_progress += amount_of_time_passed_ms

    if ( amount_of_time_passed_seconds > 30 && amount_to_gain > 1 ) {

      if ( !s( '.offline-gain-popup' ) ) {
        let wrapper = document.createElement( 'div' )
        wrapper.classList.add( 'wrapper' )
        wrapper.innerHTML = `
          <div class='offline-gain-popup'>
            <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
            <h1>Ore Warehouse</h1>
            <hr />
            <small>- while away for <strong>${ beautify_ms( amount_of_time_passed_ms ) }</strong> -</small>
            <p>You earned <strong>${ beautify_number( amount_to_gain ) }</strong> ores!</p>
            <button onclick='remove_wrapper()'>ok</button>
          </div>
        `

        CONTAINER.append( wrapper )
      }
    }

    earn( amount_to_gain )
    handle_combo_shields( amount_of_time_passed_ms )

  }
}

let play_sound = ( name, file_type = 'wav', base_vol = 1 ) => {
  let sound = new Audio( `./app/assets/sounds/${ name }.${ file_type }` )
  sound.volume = S.prefs.sfx_volume * base_vol
  sound.play()
}

let earn = ( amount, alter_hp = true ) => {

  if ( alter_hp ) update_ore_hp( amount )

  S.stats.total_ores_earned += amount
  S.stats.current_ores_earned += amount
  S.ores += amount

  if ( S.locked.refine_btn && S.stats.total_ores_earned >= 1000000 ) unlock_refine_btn()

}

let earn_gems = ( amount ) => {
  S.gems += amount
  S.stats.total_gems_earned += amount
}

let spend = ( amount ) => {
  S.ores -= amount
  play_sound( 'buy_sound' )
}

let position_elements = () => {

  O.reposition_elements = 0

  let left_vertical_separator_dimensions = LEFT_VERTICAL_SEPARATOR.getBoundingClientRect()
  let middle_vertical_separator_dimensions = MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect()
  let torch_dimensions = TORCH_LEFT.getBoundingClientRect()
  let text_scroller_container_dimensions = TEXT_SCROLLER_CONTAINER.getBoundingClientRect()

  // Position torches to the separators
  TORCH_LEFT.style.left = left_vertical_separator_dimensions.right + 'px'
  TORCH_RIGHT.style.left = middle_vertical_separator_dimensions.left - torch_dimensions.width + 'px'

  // Position settings container
  if ( !S.locked.refine_btn  ) s( '.refine-btn' ).style.display = 'block'
  let settings_container_dimensions = SETTINGS_CONTAINER.getBoundingClientRect()
  SETTINGS_CONTAINER.style.top = text_scroller_container_dimensions.top - settings_container_dimensions.height + 'px'
  SETTINGS_CONTAINER.style.left = middle_vertical_separator_dimensions.left - settings_container_dimensions.width + 'px'

  // Position automater
  if ( !S.automater.automater_accordion_hidden ) {
    AUTOMATER_WRAPPER.style.display = 'flex'
    if ( AUTOMATER_WRAPPER.classList.contains( 'open' ) ) {
      let automater_wrapper_dimensions = AUTOMATER_WRAPPER.getBoundingClientRect()
      AUTOMATER_WRAPPER.style.left = middle_vertical_separator_dimensions.left - automater_wrapper_dimensions.width + 'px'
    } else {
      let automater_header_dimensions = AUTOMATER_HEADER.getBoundingClientRect()
      AUTOMATER_WRAPPER.style.left = middle_vertical_separator_dimensions.left - automater_header_dimensions.width + 'px'
    }
    AUTOMATER_WRAPPER.style.top = '30%'
  }

  // Position bottom area tab
  let bottom_area_tabs_dimensions = BOTTOM_AREA_TABS.getBoundingClientRect()
  BOTTOM_AREA_TABS.style.top = text_scroller_container_dimensions.top - bottom_area_tabs_dimensions.height + 'px'

  // Position combo sign
  if ( !S.locked.combo_sign )  {
    setTimeout(() => {
      let topbar_inventory_container_dimensions = TOPBAR_INVENTORY_CONTAINER.getBoundingClientRect()
      build_combo_sign()
      COMBO_SIGN_CONTAINER.style.top = topbar_inventory_container_dimensions.bottom + 'px'
      COMBO_SIGN_CONTAINER.style.left = topbar_inventory_container_dimensions.left + 'px'
      COMBO_SIGN_CONTAINER.style.animation = 'slide_down_in .5s forwards'
    }, 1000)
  }

}

let change_tab = ( code_name ) => {
  let t = select_from_arr( S.tabs, code_name )

  // if the clicked tab isn't currently selected
  if ( t.selected != 1 ) {
    // loop through all tabs
    S.tabs.forEach( tab => {
      // if the current looped tab is equal to the clicked tab
      if ( tab.code_name == t.code_name ) {
        // set that tab to selected
        tab.selected = 1
        O.current_tab = t.code_name
      } else {
        tab.selected = 0
      }
    })
    build_tabs()
  }
}

let build_tabs = () => {

  let str = ''

  S.tabs.forEach( tab => {
    if ( !tab.hidden ) {
      str += `
        <div 
          class='tab ${ tab.name }-tab ${ tab.selected && "selected" }'
          onclick='change_tab( "${ tab.code_name }" ); build_${ tab.code_name }()'
        >${ tab.name }</div>
      `
    }
  })

  TABS_CONTAINER.innerHTML = str
}

let build_store = () => {

  let str = ''
  str += build_upgrades()
  str += build_buy_amount()
  str += build_buildings()

  TAB_CONTENT.innerHTML = str
  TAB_CONTENT.classList.remove('smith')
  TAB_CONTENT.classList.add('store')

  O.rebuild_store = 0
}

let build_upgrades = () => {
  let str = '<div class="upgrades-container">'
  let index = 0
  Upgrades.forEach( upgrade => {
    if ( !upgrade.hidden && !upgrade.owned ) {
      str += `
        <div class='upgrade' onclick="Upgrades[ ${ index } ].buy( event )" onmouseover="play_sound( 'store_item_hover' ); TT.show( event, { name: '${ upgrade.code_name }', type: 'upgrade' } )" onmouseout="TT.hide()">

        </div>
      `
    }
    
    index++
  })

  str += '</div>'

  return str
}

let build_buy_amount = () => {
  let str = ''

  str += `
  
    <div class='buy-amount-container'>
      <p>Buy Amount:</p>
      <div>
        <p
          onclick='change_buy_amount(1)'
          ${ S.buy_amount == 1 && 'class="selected"' }>
          1
        </p>
        <p
          onclick='change_buy_amount(10)'
          ${ S.buy_amount == 10 && 'class="selected"' }>
          10
        </p>
        <p
          onclick='change_buy_amount(100)'
          ${ S.buy_amount == 100 && 'class="selected"' }>
          100
        </p>
      </div>
    </div>
  
  `

  return str
}

let change_buy_amount = ( amount ) => {

  O.rebuild_store = 1
  S.buy_amount = amount

}

let build_buildings = () => {
  let str = ''
  let index = 0
  Buildings.forEach( building => {
    if ( building.hidden == 0 ) {
      str += `
        <div 
          class="building" 
          onclick="Buildings[ ${ index } ].buy( event )" 
          onmouseover="play_sound( 'store_item_hover' ); TT.show( event, { name: '${ building.code_name }', type: 'building' } )" 
          onmouseout="TT.hide()"
          >
          <div class="left">
            <img src="${ building.img }" alt="building image"/>
          </div>
          <div class="middle">
            <h1>${ building.name } ${ S.buy_amount != 1 ? "x" + S.buy_amount : "" }</h1>
            <p>Cost: ${ beautify_number( get_geometric_sequence_price( building.base_price, building.price_scale, building.owned, building.current_price ).price ) } ores</p>
          </div>
          <div class="right">
            <h1>${ building.owned }</h1>
          </div>
        </div>
      `
    } else if ( building.hidden == 1 ) {
      str += `
        <div class="building hidden"">
          <div class="left">
            <img src="${ building.img }" alt="building image"/>
          </div>
          <div class="middle">
            <h1>???</h1>
            <p>Cost: ??? ores</p>
          </div>
        </div>
      `
    }

    index++
  })

  return str
}

let build_smith = () => {
  let str = ''

  str += build_pickaxe_accordion()

  str += '<div class="smith-progress-container" onclick="SMITH.progress_click()">'
  str += build_pickaxe_update()
  str += '</div>'
  str += "<div class='horizontal-separator thin dark'></div>"

  str += '<div class="smith-upgrades">'
  str += build_smith_upgrades()
  str += '</div>'

  TAB_CONTENT.innerHTML = str
  TAB_CONTENT.classList.add('smith')
  TAB_CONTENT.classList.remove('store')
}

let build_pickaxe_accordion = ( direct = false ) => {
  let str = ''

  str += `
    <div class='pickaxe-accordion ${ O.pickaxe_accordion_is_open && 'open' }'>
      <header onclick='toggle_pickaxe_accordion()'>
        <p>${ S.pickaxe.item.name }</p>
        <i class='fa fa-caret-down fa-1x'></i>
      </header>
      <div>
        <p>Damage: ${ beautify_number( S.pickaxe.item.damage ) }</p>
        <p
          onmouseover='TT.show( event, { name: null, type: "sharpness-info" } )'
          onmouseout='TT.hide()'
          >Sharpness: ${ S.pickaxe.item.sharpness } <span style='opacity: .5'>( ${ beautify_number( calculate_pickaxe_sharpness() ) } )</span> %</p>
        <p
          onmouseover='TT.show( event, { name: null, type: "hardness-info" } )'
          onmouseout='TT.hide()'
          >Hardness: ${ S.pickaxe.item.hardness } <span style='opacity: .5'>( ${ beautify_number( calculate_pickaxe_hardness() ) } )</span> %</p>
      </div>
    </div>
    <div class='horizontal-separator thin dark'></div>
  `

  if ( direct ) {
    s( '.pickaxe-accordion' ).innerHTML = str
    return
  }

  return str
}

let calculate_pickaxe_sharpness = () => {
  return S.pickaxe.item.sharpness + S.pickaxe.temporary_bonuses.sharpness + S.pickaxe.permanent_bonuses.sharpness
}

let calculate_pickaxe_hardness = () => {
  return S.pickaxe.item.hardness + S.pickaxe.temporary_bonuses.hardness + S.pickaxe.permanent_bonuses.hardness
}

let build_pickaxe_update = ( direct = false ) => {
  let str = ''

  is_empty( SMITH.upgrade_in_progress ) ? 
    str += '<p style="text-align: center; width: 100%; opacity: 0.5">No upgrade in progress</p>' :
      str += `
        <img src="${ SMITH.upgrade_in_progress.img }" alt="smith upgrade"/>
        <div>
          <p>${ SMITH.upgrade_in_progress.name }</p>
          <div class="progress-bar-container">
            <div class="progress-bar"></div>
          </div>
        </div>
      `

  if ( direct ) {
    if ( s( '.smith-progress-container' ) ) {
      s( '.smith-progress-container' ).innerHTML = str
    }
    return
  }

  return str
}

let build_smith_upgrades = ( direct = false ) => {

  let locked_upgrades = []
  let owned_upgrades = []

  let str = ''

  str += '<p class="available-upgrade-text">Available Upgrades</p>'

  Smith_Upgrades.sort( ( a, b ) => a.price - b.price )
    .forEach( upgrade => {
      upgrade.type = 'smith_upgrade'
      if ( !upgrade.owned && !upgrade.locked ) {
        str += `
          <div 
            class="smith-upgrade"
            style='background: url("${ upgrade.img }")'
            onmouseover='TT.show( event, { name: "${ upgrade.code_name }", type: "smith_upgrade" }); handle_smith_upgrade_hover( "${ upgrade.code_name }" )'
            onmouseout='TT.hide()'
            onclick='start_smith_upgrade( Smith_Upgrades, "${ upgrade.code_name }")'
            >
            `

            if ( upgrade.new ) str += '<div class="new">New!</div>'
            
            str += `</div>`
      } else {
        if ( upgrade.owned ) owned_upgrades.push( upgrade )
        if ( upgrade.locked ) locked_upgrades.push( upgrade )
      }
    })

  if ( locked_upgrades.length > 0 ) {
    str += '<p class="locked-upgrade-text">Locked Upgrades</p>'

    locked_upgrades.forEach( upgrade => {
      str += `
        <div 
          class="smith-upgrade locked"
          style='background: url("${ upgrade.img }");'
          onmouseover='TT.show( event, { name: "${ upgrade.code_name }", type: "smith_upgrade"})'
          onmouseout='TT.hide()'
          >
        </div>
      `
    })
  }

  if ( owned_upgrades.length > 0 ) {
    str += '<p>Owned Upgrades</p>'

    owned_upgrades.forEach( upgrade => {
      str += `
        <div 
          class="smith-upgrade"
          style='background: url("${ upgrade.img }"); opacity: 0.4'
          onmouseover='TT.show( event, { name: "${ upgrade.code_name }", type: "smith_upgrade" })'
          onmouseout='TT.hide()'
          >
        </div>
      `
    })
  }

  if ( direct ) {
    if ( s( '.smith-upgrades' ) ) {
      s( '.smith-upgrades' ).innerHTML = str
    }
    return
  }

  return str
}

let handle_smith_upgrade_hover = ( code_name ) => {

  let upgrade = select_from_arr( Smith_Upgrades, code_name )

  if ( upgrade.new ) {
    upgrade.new = false
    build_smith_upgrades( true )
  }

}

let toggle_pickaxe_accordion = () => {
  s( '.pickaxe-accordion' ).classList.toggle( 'open' )
  O.pickaxe_accordion_is_open = !O.pickaxe_accordion_is_open
}

let build_automaters = () => {
  let dd = s( '.automater.display' ).getBoundingClientRect()
  s('.automater .owned').innerHTML = S.automater.available

  Automaters.forEach( ( automater, i ) => {
    if ( !automater.active ) {
      let el = document.createElement( 'div' )
      el.classList.add( 'automater', 'real')
      el.style.top = dd.top + 'px'
      el.style.left = dd.left + 'px'
      el.style.position = 'absolute'
      el.id = `automater-${ i }`
      el.innerHTML = `
          <div class="top-bar">
            <i onclick='Automaters[${ i }].remove("${ el.id }")' class="fa fa-times"></i>
          </div>
          <div class="automater-target">
            <img src="./app/assets/images/misc-crosshair.png" alt="crosshair-img">
          </div>
      `

      GAME_CONTAINER.append( el )
    }
  })

  document.querySelectorAll('.automater.real').forEach( el => {
    dragNdrop({
      element: el,
      callback: () => {
        let id = parseInt( el.id.slice( -1 ) )
        el.classList.add( 'set' )
        Automaters[ id ].set( el )
      }
    })
  })
}

let build_automater_visibility_toggle_btn = () => {
  let el = document.querySelector( '.automater-toggle-visibility' )
  el.innerHTML = `
    <i class="fa fa-eye-slash fa-1x"></i>
    <label class="switch">
      <input onchange='toggle_automater_visibility()' type="checkbox">
      <span class="slider round"></span>
    </label>
  `
}

let toggle_automater_visibility = () => {
  S.automater.automater_visible = !S.automater.automater_visible
  document.querySelectorAll( '.automater.real' ).forEach( el => {
    console.log(' el', el)
    el.classList.toggle( 'hidden' )
  })
}

let toggle_automater_accordion = () => {
  console.log('togglng')
  let automater_header_dimensions = AUTOMATER_HEADER.getBoundingClientRect()
  let AUTOMATER_WRAPPER_dimensions = AUTOMATER_WRAPPER.getBoundingClientRect()
  let middle_vertical_separator_dimensions = MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect()
  if ( AUTOMATER_WRAPPER.classList.contains( 'open' ) ) {
    AUTOMATER_WRAPPER.classList.remove( 'open' )
    AUTOMATER_WRAPPER.style.left = middle_vertical_separator_dimensions.left - automater_header_dimensions.width + 'px'
  } else {
    AUTOMATER_WRAPPER.classList.add( 'open' )
    AUTOMATER_WRAPPER.style.left = middle_vertical_separator_dimensions.left - AUTOMATER_WRAPPER_dimensions.width + 'px'
  }
}

AUTOMATER_WRAPPER.addEventListener( 'transitionend', () => {
  if ( AUTOMATER_WRAPPER.classList.contains( 'open' ) ) {
    build_automaters()
  } else {
    document.querySelectorAll( '.automater.real' ).forEach( el => {
      if ( !el.classList.contains( 'set' ) ) {
        remove_el( el )
      }
    })
  }
})

let start_smith_upgrade = ( arr, code_name  ) => {
  let upgrade = select_from_arr( arr, code_name )

  if ( is_empty( SMITH.upgrade_in_progress ) ) {
    SMITH.start_upgrade( upgrade )
  }
}

let calculate_opc = ( type ) => {
  
  let opc = S.pickaxe.item.damage

  if ( type ) {
    if ( type == 'weak-spot' ) {
      opc *= S.weak_hit_multi
    } 
  }

  type ? opc *= calculate_pickaxe_sharpness() / 100 : opc *= calculate_pickaxe_hardness() / 100

  if ( select_from_arr( Upgrades, 'flashlight').owned ) {
    opc += S.ops * .03
  }

  O.recalculate_opc = 0
  S.opc = opc
  return opc
}

let calculate_ops = () => {

  O.recalculate_ops = 0

  let ops = 0

  Buildings.forEach( building => {
    ops += building.owned * building.production
  })

  S.ops = ops

  if ( S.ops > 100 ) unlock_upgrade( 'flashlight' )

}

let calculate_building_ops = ( building_owned, building_production ) => {
  let percentage = ( ( building_owned * building_production ) / S.ops ) * 100
  return beautify_number( percentage )
}

let generate_weak_spot = () => {

  if ( !S.locked.fragility_spectacles ) {
    ORE_WEAK_SPOT.style.display = 'block'
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
}

let handle_click = ( e, type ) => {

  let opc = calculate_opc( type )

  if ( type ) {
    play_sound( 'ore_weak_spot_hit' )
    S.stats.total_weak_hit_clicks++
    S.current_combo++

    if ( S.current_combo == 5 ) { win_achievement( 'combo_baby' ); unlock_smith_upgrade( 'combo_shield_i' ) }
    if ( S.current_combo == 20 ) win_achievement( 'combo_pleb' )
    if ( S.current_combo == 50 ) win_achievement( 'combo_squire' )
    if ( S.current_combo == 100 ) win_achievement( 'combo_knight' )
    if ( S.current_combo == 200 ) win_achievement( 'combo_king' )
    if ( S.current_combo == 350 ) win_achievement( 'combo_king' )
    if ( S.current_combo == 666 ) win_achievement( 'combo_devil' )
    if ( S.current_combo == 777 ) win_achievement( 'combo_god' )
    if ( S.current_combo == 1000 ) win_achievement( 'combo_saiyan' )
    if ( S.current_combo == 10000 ) win_achievement( 'combo_saitama' )

    if ( S.current_combo > S.stats.highest_combo ) S.stats.highest_combo = S.current_combo
    if ( S.current_combo % 5 == 0 ) RN.new( e, 'combo', S.current_combo )

    RN.new( event, 'weak-hit-click', opc )
    generate_weak_spot()

    if ( S.locked.combo_sign && S.current_combo >= 5 ) {
      S.locked.combo_sign = 0
      O.reposition_elements = 1
    }

  } else {

    if ( S.combo_shield.active && S.combo_shield.available > 0 ) {
      use_combo_shield()
      return
    } else {
      if ( S.current_combo >= 5 ) RN.new( event, 'combo-loss', S.current_combo )
      S.current_combo = 0
    }

    play_sound( 'ore_hit' )
    RN.new( event, 'click', opc )
    
  }

  S.stats.total_clicks++
  S.stats.total_ores_manually_mined += opc
  S.stats.current_ores_manually_mined += opc

  earn( opc )

  if ( !S.locked.combo_sign && s( '.combo-sign-number' ) ) update_combo_sign_number()
}

let handle_text_scroller = () => {

  let animation_speed = 20

  if ( !O.window_blurred ) {
    if ( Math.random() <= .40 || TS.queue.length > 0 ) {
      let text = TS.get()
      let text_scroller = document.createElement( 'div' )
      text_scroller.innerHTML = text
      text_scroller.style.transition = `transform ${ animation_speed }s linear`
      text_scroller.classList.add( 'text-scroller' )
  
      TEXT_SCROLLER_CONTAINER.append( text_scroller )
  
      let text_scroller_dimensions = text_scroller.getBoundingClientRect()
      let text_scroller_container_dimensions = TEXT_SCROLLER_CONTAINER.getBoundingClientRect()
  
      text_scroller.style.left = text_scroller_container_dimensions.right + 'px'
      text_scroller.style.transform = `translateX( -${ text_scroller_container_dimensions.width + text_scroller_dimensions.width + 100 }px )`
  
      text_scroller.addEventListener( 'transitionend', () => {  remove_el( text_scroller )  } )
    }
  }

  setTimeout( handle_text_scroller, 1000 * animation_speed )
}

// ==== TUTORIAL SHIT ====================================================================

let tutorial_click_the_rock = () => {

  let tutorial = document.createElement( 'div' )

  tutorial.classList.add( 'tutorial-container' )
  tutorial.id = 'tutorial-click-the-rock'
  tutorial.innerHTML = `
    <div class='arrow left'></div>
    <div class="tutorial-content">
      <p>Break the rock!</p>
    </div>
  `

  let ore_container_dimensions = ORE_CONTAINER.getBoundingClientRect()

  CONTAINER.append( tutorial )

  tutorial.style.left = ore_container_dimensions.right + 'px'
  tutorial.style.top = ( ore_container_dimensions.top + ore_container_dimensions.bottom ) / 2 + 'px'

}

let tutorial_pickaxe_description = () => {

  let tutorial = document.createElement( 'div' )

  tutorial.classList.add( 'tutorial-window-container' )
  tutorial.id = 'tutorial-pickaxe-description'
  tutorial.innerHTML = `
    <h1>Your First Pickaxe!</h1>
    <hr>
    <p class='desc'>For some reason... in this magical world, when you crack open an ore, a pickaxe comes out!</p>
    <ul>
      <li><strong>Sharpness</strong> affects how much damage you deal on <i>weak spot</i> hits</li>
      <li><strong>Hardness</strong> affects how much damage you deal on <i>regular</i> hits</li>
    </ul>
  `

  CONTAINER.append( tutorial )
    
  let target = document.querySelector( '.item-drop-popup' ).getBoundingClientRect()
  let tutorial_dimensions = tutorial.getBoundingClientRect()

  tutorial.style.left = target.left - tutorial_dimensions.width / 1.5 + 'px'
  tutorial.style.top = target.top + 50 + 'px'

}

// ==== COMBO SHIT =======================================================================

let build_combo_sign = () => {

  let str = `
    <div class='top'>
      <div class='vertical-separator thin'></div>
      <div class='vertical-separator thin'></div>
    </div>
    <div class='combo-sign'>
      <p>Current Combo</p>
      <h1 class='combo-sign-number'>${ S.current_combo }</h1>
      <div 
        onmouseover='TT.show( event, { type: "combo-shield-info" } )'
        onmouseout='TT.hide()'
        class='combo-shield-container'>
        <p>Combo Shield: </p>
        <div>
        `

        str += build_combo_shields()

        str += `
        </div>
      </div>
    </div>
  `

  COMBO_SIGN_CONTAINER.innerHTML = str

}

let build_combo_shields = () => {

  let str = ''

  if ( S.combo_shield.owned == 0 ) {
    str += `
      <i class='fa fa-shield fa-1x'></i>
      <i class='fa fa-shield fa-1x'></i>
      <i class='fa fa-shield fa-1x'></i>
    `
  } else {
    for ( let i = 0; i < 3; i++ ) {

      str += `<i class='fa fa-shield fa-1x ${ S.combo_shield.available > i && "active" }'></i>`
  
    }
  
  }

  return str

}

let update_combo_sign_number = () => {
  let combo_sign_number = s( '.combo-sign-number' )
   combo_sign_number.innerHTML = S.current_combo
}

let use_combo_shield = () => {

  S.combo_shield.available -= 1
  S.combo_shield.time_last_used = new Date().getTime()
  S.stats.total_combo_shields_used++
  S.stats.current_combo_shields_used++

  RN.new( event, 'combo-shield', null )

  build_combo_sign()
}

let handle_combo_shields = ( ms = 0 ) => {

  if ( S.combo_shield.available < S.combo_shield.owned ) {

    if ( !S.combo_shield.time_until_next ) S.combo_shield.time_until_next = S.combo_shield.time_needed

    if ( ms > S.combo_shield.time_until_next ) {

      ms -= S.combo_shield.time_until_next
      S.combo_shield.time_until_next = null
      S.combo_shield.available++
      handle_combo_shields( ms )
      build_combo_sign()

    } else {

      S.combo_shield.time_until_next -= ms

    }

  }

}

// ==== REFINE SHIT ======================================================================

let unlock_refine_btn = () => {

  S.locked.refine_btn = 0

  O.reposition_elements = 1

}

let confirm_refine = () => {

  let wrapper = document.createElement( 'div' )
  wrapper.classList.add( 'wrapper' )

  let rewards = calculate_refine_rewards()

  let str = `
    <div class='confirm-refine'>
      <header>
        <h1>Refine</h1>
        <img class='gem' src='./app/assets/images/gem-diamond.png' />
      </header>
      <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
      <p class='gain'>+ You will gain <strong>${ rewards.gems }</strong> gems</p>
      <p class='gain'>+ You will gain <strong>${ rewards.xp }</strong> generation XP</p>
      <p class='gain'>+ You will keep <strong>all</strong> blacksmith upgrades</p>
      <p class='gain'>+ You will keep your <strong>${ S.pickaxe.item.name }</strong> </p>
      <br />
      <p class='lose'>- You will lose <strong>all</strong> ores</p>
      <p class='lose'>- You will lose <strong>all</strong> owned buildings and upgrades</p>
      <br />
      <p class='confirmation-text'><span>Are you sure you want to refine?</span></p>
      <div class='button-container'>
        <button onclick='refine(); remove_wrapper()'>YES</button>
        <button onclick='remove_wrapper()'>NO</button>
      </div>

    </div>
  `

  wrapper.innerHTML = str

  CONTAINER.append( wrapper )

}

let calculate_refine_rewards = () => {

  let rewards = {}

  rewards.gems = Math.floor( Math.sqrt( S.stats.current_ores_earned / 1000000 ) )
  rewards.xp = 100

  return rewards

}

let refine = async () => {

  play_sound( 'refine' )
  S.stats.times_refined++

  let rewards = calculate_refine_rewards()
  earn_gems( rewards.gems )

  reset_state_and_buildings()

  await refine_animation()

  if ( S.stats.last_refine_time ) {
    let diff = get_time_difference_value( S.stats.last_refine_time, 'minutes' )
    if ( diff <= 10 ) win_achievement( 'quick_refiner' )
    if ( diff <= 5 ) win_achievement( 'swift_refiner')
    if ( diff <= 1 ) win_achievement( 'speedy_refiner' )
    if ( diff <= .166667 ) win_achievement( 'flash_refiner') 
  }

  S.stats.last_refine_time = new Date().getTime()

  if ( S.stats.times_refined == 1 ) {
    win_achievement( 'babies_first_refine' )
    unlock_smith_upgrade( 'quest_board' )
  }

  O.reposition_elements = 1

}

let refine_animation = () => {

  return new Promise( resolve => {

    let refine_animation = document.createElement( 'div' )
    refine_animation.classList.add( 'refine-animation' )
    refine_animation.innerHTML = `
      <div class='left'></div>
      <div class='right'></div>
    `

    s( 'body' ).append( refine_animation )

    refine_animation.children[ 0 ].addEventListener( 'animationend', () => {

      remove_el( refine_animation )

      resolve()

    } )

  } )
}

let reset_state_and_buildings = () => {

  S.ores = 0
  S.stats.current_rocks_destroyed = 0
  S.stats.current_ores_earned = 0
  S.stats.current_ores_mined = 0
  S.stats.current_combo_shields_used = 0

  Buildings = []
  buildings.forEach( building => new Building( building ) )

  O.recalculate_opc = 1
  O.recalculate_ops = 1
  O.rebuild_store = 1

  save_game()

}

// ==== ITEM DROP SHIT ===================================================================

let generate_item_drop = () => {
  
  let item_uuid = Math.round( Math.random() * 10000000 )

  let item = document.createElement( 'div' )
  item.classList.add( 'item-container' )

  item.innerHTML = `
    <img class='item-shine' src="./app/assets/images/misc-shine.png" alt="shine">
    <img class='item-shine' src="./app/assets/images/misc-shine.png" alt="shine">
    <div id='item_drop_${ item_uuid }' data-item_level="${ S.stats.current_rocks_destroyed }" class="item"></div>
  `

  item.style.pointerEvents = 'none'
  item.addEventListener( 'click', ( event ) => { 
    handle_item_drop_click( item_uuid ) 
    remove_el( event.target )
  } )

  item.addEventListener( 'transitionend', () => { item.style.pointerEvents = 'all' } )

  let ore_dimensions = ORE_CONTAINER.getBoundingClientRect()

  let origin = {
    x: ( ore_dimensions.left + ore_dimensions.right ) / 2,
    y: ( ore_dimensions.top + ore_dimensions.bottom ) / 2
  }

  let target = {
    x: get_random_num( ore_dimensions.left, ore_dimensions.right ) + get_random_num( -10, 10 ),
    y: ore_dimensions.bottom + get_random_num( -10, 10 )
  }

  item.style.left = origin.x + 'px'
  item.style.top = origin.y + 'px'

  CONTAINER.append( item )

  let transform_x = origin.x - target.x
  let transform_y = target.y - origin.y

  item.style.transition = 'all .4s ease-in'
  
  setTimeout(() => {
    item.style.transform = `translate( ${ transform_x }px, ${ transform_y }px )`
  }, 50)

}

let handle_item_drop_click = ( item_uuid ) => {

  S.stats.total_items_found++

  let item = s( `#item_drop_${ item_uuid }` )
  O.pickaxe = new Pickaxe( item.dataset.item_level )

  let wrapper = document.createElement( 'div' )
  wrapper.classList.add( 'wrapper' )

  let str = `<div class='item-drop-popup-container'>`
  str += build_new_pickaxe_popup()
  str += build_equipped_pickaxe_popup()
  str += '</div>'

  wrapper.innerHTML = str

  CONTAINER.append( wrapper )

  if ( S.stats.total_items_found == 1 ) tutorial_pickaxe_description()

}

let equip_pickaxe = () => {

  if ( s( '#tutorial-pickaxe-description' ) ) remove_el( s( '#tutorial-pickaxe-description' ) )

  let pickaxe = O.pickaxe

  S.pickaxe.item = pickaxe

  remove_wrapper()
}

let trash_pickaxe = () => {
  S.stats.total_pickaxes_trashed++

  if ( S.stats.total_pickaxes_trashed == 5 ) win_achievement( 'trasher' )
  if ( S.stats.total_pickaxes_trashed == 10 ) win_achievement( 'polluter' )
  if ( S.stats.total_pickaxes_trashed == 20 ) win_achievement( 'scrapper' )
  if ( S.stats.total_pickaxes_trashed == 40 ) win_achievement( 'scrap master' )

  if ( s( '#tutorial-pickaxe-description' ) ) remove_el( s( '#tutorial-pickaxe-description' ) )

}

let build_new_pickaxe_popup = () => {
  str = `
    <div class='item-drop-popup ${ O.pickaxe.rarity.name }'>
      <p style='font-size: 14px; letter-spacing: 0.5px; opacity: 0.6;'>- New Pickaxe -</p>
      <h1 class='${ O.pickaxe.rarity.name }'>${ O.pickaxe.name }</h1>
      <i onclick='remove_wrapper()' class="fa fa-times fa-1x"></i>
  `

  str += build_pickaxe_sprite( O.pickaxe )

  str += `
    <p style='padding-bottom: 7.5px; opacity: .7;' class='${ O.pickaxe.rarity.name }'>
      <strong>${ O.pickaxe.rarity.name }</strong>
    </p>
    <p><small><i>[ level: <strong>${ O.pickaxe.level }</strong> ]</i></small></p>
    <ul>
      <li>Damage: <strong>${ O.pickaxe.damage }</strong> ${ O.pickaxe.damage > S.pickaxe.item.damage ? '<i class="fa fa-angle-up fa-1x"></i>' : '<i class="fa fa-angle-down fa-1x"></i>' }</li>
      <li>Sharpness: <strong>${ beautify_number( O.pickaxe.sharpness ) }%</strong> ${ O.pickaxe.sharpness > S.pickaxe.item.sharpness ? '<i class="fa fa-angle-up fa-1x"></i>' : '<i class="fa fa-angle-down fa-1x"></i>' }</li>
      <li>Hardness: <strong>${ beautify_number( O.pickaxe.hardness ) }%</strong> ${ O.pickaxe.hardness > S.pickaxe.item.hardness ? '<i class="fa fa-angle-up fa-1x"></i>' : '<i class="fa fa-angle-down fa-1x"></i>' }</li>
    </ul>
    <button 
      class='equip-btn'
      onclick='equip_pickaxe()'
      >EQUIP <i class="fa fa-hand-paper-o fa-1x"></i>
    </button>
    <button 
      class='trash-btn'
      onclick='remove_wrapper();'
      >TRASH <i class="fa fa-trash-o fa-1x"></i>
    </button>
  `

  str += '</div>'

  return str
}

let build_equipped_pickaxe_popup = () => {

  let p = S.pickaxe.item

  str = `
    <div class='currently-equipped-popup ${ p.rarity.name }'>
      <p style='font-size: 14px; letter-spacing: 0.5px; opacity: 0.6'>- Currently Equipped -</p>
      <h1 class='${ p.rarity.name }'>${ p.name }</h1>
  `

  str += build_pickaxe_sprite( p )

  str += `
    <p style='padding-bottom: 7.5px; opacity: .7;' class='${ p.rarity.name }'>
      <strong>${ p.rarity.name }</strong>
    </p>
    <p><small><i>[ level: <strong>${ p.level }</strong> ]</i></small></p>
    <ul>
      <li>Damage: ${ beautify_number( p.damage ) }</li>
      <li>Sharpness: ${ beautify_number( p.sharpness ) }%</li>
      <li>Hardness: ${ beautify_number( p.hardness ) }%</li>
    </ul>
  `

  str += '</div>'

  return str

}

let build_pickaxe_sprite = ( pickaxe ) => {

  let str = `
    <div class="pickaxe-sprite-container">
      <img class='pickaxe-stick' src='./app/assets/images/pickaxe-bottom.png' />
      <img class='pickaxe-top' src='./app/assets/images/pickaxe-top-${ pickaxe.material.name.toLowerCase() }.png' />
    </div>
  `

  return str

}

// ==== BOTTOM TAB SHIT ==================================================================

let build_bottom_tabs = () => {

  let str = ''

  Bottom_Tabs.forEach( tab => {

    if ( tab.locked ) {
      str += `
        <div class="tab">???</div>
      `
    } else {
      str += `
        <div 
          onclick="handle_bottom_tab_click( '${ tab.code_name }' )" 
          id="bottom-tab-${ tab.code_name }"
          class="tab">
          ${ tab.name }
        </div>
      `
    }
  })

  BOTTOM_AREA_TABS.innerHTML = str

  O.rebuild_bottom_tabs = 0
  O.reposition_elements = 1
}

let handle_bottom_tab_click = ( code_name ) => {

  if ( S.bottom_area.selected_tab == code_name ) {
    
    if ( code_name == 'quest_board' ) open_quest_board()

  } else {
    // switch tab
    S.bottom_area.selected_tab = code_name
  }
}

// ==== QUEST SHIT =======================================================================

let open_quest_board = () => {
  
  let quest_board = document.createElement( 'div' )
  quest_board.classList.add( 'wrapper' )

  let str = `
    <div id='quest-board'>
      <header>
        <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
        <h1>Quest Board</h1>
      </header>
  `

  str += build_quests()

  str += `</div>`

  quest_board.innerHTML = str

  CONTAINER.append( quest_board )

}

let build_quests = () => {
  
  let str = ``

  str += `<div class='quest-board-quests'>`

  Quests.forEach( quest => {

    str += `
      <div 
        onclick='start_quest( "${ quest.code_name }" )'
        class='quest ${ quest.locked && "locked" }'
      >
        <div class='pin'></div>
        <h3 class='quest-name'>${ quest.name }</h3>
      </div>
    `

  } )

  str += `</div>`

  return str

}

let start_quest = ( code_name ) => {

  let quest = select_from_arr( Quests, code_name )
  console.log( 'starting quest:', quest )

}

// =======================================================================================

let game_loop = () => {

  O.counter++
  let tick_ms = 1000 / S.prefs.game_speed

  if ( !O.window_blurred ) {

    update_ore_sprite()

    build_topbar_inventory()
    if ( O.recalculate_ops ) calculate_ops()
    if ( O.recalculate_opc ) calculate_opc()
    if ( O.rebuild_store ) build_store()
    if ( O.reposition_elements ) position_elements()
    if ( O.rebuild_bottom_tabs ) build_bottom_tabs()

    if ( !is_empty( SMITH.upgrade_in_progress ) ) SMITH._update_progress()
  
    earn( S.ops / S.prefs.game_speed )

    if ( O.counter % S.prefs.game_speed == 0 ) {
      S.stats.seconds_played++
      if ( S.ops > 0 && S.prefs.show_ops_rising_numbers ) RN.new( null, 'buildings', S.ops )
    }

    // THIS RUNS EVERY --------------------------------- ↓ seconds
    if ( O.counter % ( S.prefs.game_speed * S.gold_nugget_spawn_rate ) == 0 ) {
      spawn_gold_nugget()
    }

    handle_combo_shields( 1000 / tick_ms )
  }

  setTimeout( game_loop, 1000 / tick_ms )
}

let update_ore_hp = ( amount ) => {
  if (S.current_ore_hp - amount <= 0 ) {
    play_sound( 'ore_destroyed' )

    if ( s( '#tutorial-click-the-rock' ) ) remove_el( s( '#tutorial-click-the-rock' ) )

    S.stats.current_rocks_destroyed += 1
    S.stats.total_rocks_destroyed += 1
    S.current_ore_max_hp = Math.pow( S.current_ore_max_hp, 1.09 )
    S.current_ore_hp = S.current_ore_max_hp

    S.misc.current_ore_sprite = get_random_num( 1, S.misc.ore_sprite_amount )

    if ( Math.random() <= .3 || S.stats.total_rocks_destroyed == 1 ) {
      generate_item_drop()
    }

    current_sprite = 0

    if ( S.stats.total_rocks_destroyed == 1 ) win_achievement( 'newbie_miner' )
    if ( S.stats.total_rocks_destroyed == 10 ) win_achievement( 'novice_miner' )
    if ( S.stats.total_rocks_destroyed == 25 ) win_achievement( 'intermediate_miner' )
    if ( S.stats.total_rocks_destroyed == 100 ) win_achievement( 'advanced_miner' )

  } else {
    S.current_ore_hp -= amount
  }
}

let current_sprite = 0
let update_ore_sprite = () => {
  let current_percentage = S.current_ore_hp / S.current_ore_max_hp * 100

  if ( current_percentage <= 100 && current_percentage > 80 && current_sprite != 1 ) {
    ORE_SPRITE.src = `./app/assets/images/ore${ S.misc.current_ore_sprite }-1.png`
    current_sprite = 1
  } else if ( current_percentage <= 80 && current_percentage > 60 && current_sprite != 2 ) {
    play_sound( 'ore_percentage_lost' )
    ORE_SPRITE.src = `./app/assets/images/ore${ S.misc.current_ore_sprite }-2.png`
    current_sprite = 2
  } else if ( current_percentage <= 60 && current_percentage > 40 && current_sprite != 3 ) {
    play_sound( 'ore_percentage_lost' )
    ORE_SPRITE.src = `./app/assets/images/ore${ S.misc.current_ore_sprite }-3.png`
    current_sprite = 3
  } else if ( current_percentage <= 40 && current_percentage > 20 && current_sprite != 4 ) {
    play_sound( 'ore_percentage_lost' )
    ORE_SPRITE.src = `./app/assets/images/ore${ S.misc.current_ore_sprite }-4.png`
    current_sprite = 4
  } else if ( current_percentage <= 20 && current_sprite != 5 ) {
    play_sound( 'ore_percentage_lost' )
    ORE_SPRITE.src = `./app/assets/images/ore${ S.misc.current_ore_sprite }-5.png`
    current_sprite = 5
  }

}

let build_topbar_inventory = () => {

  let str = `
    <div class='left'>
      <p>Ores: ${ beautify_number( S.ores ) }` 

      if ( S.ops > 0 ) str += ` (${ beautify_number( S.ops )}/s)`
      
      str += `</p>`

      if ( S.stats.total_gems_earned > 0 ) {
        str += `<p>Gems: ${ beautify_number( S.gems ) }</p>`
      }

      str += `
    </div>
    <div class='right'>
      <p>Generation: ${ S.generation }</p>
    </div>
  `

  TOPBAR_INVENTORY.innerHTML = str
}

let build_achievements = () => {
  let wrapper = document.createElement( 'div' )
  wrapper.classList.add( 'wrapper' )

  let str = `
    <div class='stats-container'>
      <h1>Achievements</h1>
      <hr/>
      <ul>
        <li><span>Highest Combo: ${ S.stats.highest_combo }</li>
        <li><span>Total Clicks:</span> ${ S.stats.total_clicks }</li>
        <li><span>Total Weak Spot Clicks:</span> ${ S.stats.total_weak_hit_clicks }</li>
        <li><span>Seconds Played:</span> ${ S.stats.seconds_played }</li>
        <li><span>Current Rocks Destroyed:</span> ${ S.stats.current_rocks_destroyed }</li>
        <li><span>Total Rocks Destroyed:</span> ${ S.stats.total_rocks_destroyed }</li>
        <li><span>Total Ores Earned:</span> ${ beautify_number( S.stats.total_ores_earned ) }</li>
        <li><span>Total Ores Mined:</span> ${ beautify_number( S.stats.total_ores_manually_mined ) }</li>
        <li><span>Total Gems Earned:</span> ${ S.stats.total_gems_earned }</li>
        <li><span>Total Gold Nuggets Spawned:</span> ${ S.stats.total_nuggets_spawned }</li>
        <li><span>Total Gold Nuggets Clicked:</span> ${ S.stats.total_nuggets_clicked } </li>
        <li><span>Total Gold Nuggets Missed:</span> ${ S.stats.total_nuggets_missed }</li>
      </ul>
      <hr/>
      <div class='achievement-container'>
        <h1>Won:</h1>
        `
        let locked_achievements = []
        Achievements.forEach( achievement => {
          if ( achievement.won == 1 ) {
            str += `
              <div 
                class="achievement-square"
                onmouseover="TT.show( event, { name: '${ achievement.code_name }', type: 'achievement-square' } )"
                onmouseout='TT.hide()'
                style='background-image: url( ${ achievement.img } )'
                >
              </div>
            `
          } else {
            locked_achievements.push( achievement )
          }
        })

        str += '<h1>Locked:</h1>'
        locked_achievements.forEach( achievement => {
          str += `
            <div 
              class="achievement-square locked"
              style='background-image: url( ${ achievement.img } )'
              >
            </div>
          `
        })
          
        str += `
      </div>
      <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
    </div>
  `

  wrapper.innerHTML = str
  CONTAINER.append( wrapper )
}

let build_settings = () => {
  let wrapper = document.createElement( 'div' )
  wrapper.classList.add( 'wrapper' )

  let str = `
    <div class='settings-container'>
      <h1>Settings</h1>
      <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
      <hr />
      <div>
        <p>Disable Rock Flying Numbers</p>
        <input type='checkbox'>
      </div>
      <div>
        <p>Disable Rock Particles</p>
        <input type='checkbox'>
      </div>
      
    </div>
  `

  wrapper.innerHTML = str
  CONTAINER.append( wrapper )
}

let win_achievement = ( achievement_code_name ) => {

  let achievement = select_from_arr( Achievements, achievement_code_name )

  if ( achievement.won == 0 ) {
    achievement.win()

    let achievement_el = document.createElement( 'div' )
    achievement_el.classList.add( 'achievement' )
    let str = `
      <header>
        <img src='${ achievement.img }' alt='achievement img' />
        <h1>${ achievement.name } <small>[ ${ achievement.type } achievement ]</small></h1>
      </header>
      <p>${ achievement.desc }</p>
    `

    let r = achievement.reward
    if ( r ) {
      if ( r.increase_weak_hit_multi ) {
        str += `<p class='achievement-reward'>+ Permanently increase <strong>weak-hit</strong> multiplier by <strong>${ achievement.reward.increase_weak_hit_multi }</strong></p>`
      }
      if ( r.increase_pickaxe_hardness ) {
        str += `<p class='achievement-reward'>+ Permanently increase <strong>pickaxe hardness</strong> by <strong>${ r.increase_pickaxe_hardness }%</strong></p>`
      }
      if ( r.increase_pickaxe_sharpness ) {
        str += `<p class='achievement-reward'>+ Permanently increase <strong>pickaxe sharpness</strong> by <strong>${ r.increase_pickaxe_sharpness }%</strong></p>`
      }
    }

    if ( achievement.flavor_text ) {
      str += `<small>${ achievement.flavor_text }</small>`
    }

    achievement_el.innerHTML = str

    ACHIEVEMENT_NOTIFICATION_CONTAINER.append( achievement_el )
    achievement_el.style.marginTop = '-' + achievement_el.offsetHeight + 'px'

    achievement_el.addEventListener( 'animationend', () => {
      remove_el( achievement_el )
    })
  }

  


}

// ==== GOLD NUGGET SHIT =================================================================

let spawn_gold_nugget = () => {
  if ( Math.random() <= ( S.gold_nugget_chance_to_spawn * .01 ) || S.stats.total_nuggets_clicked == 0 ) {
    S.stats.total_nuggets_spawned++
    let nugget = document.createElement( 'div' )
    nugget.onclick = handle_gold_nugget_click

    let pos = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }

    nugget.classList.add( 'gold-nugget' )
    nugget.style.left = pos.x + 'px'
    nugget.style.top = pos.y + 'px'
    nugget.style.animation = 'rotate 5s infinite linear, fade_in_out 10s linear forwards'

    nugget.addEventListener( 'animationend', () => { 
      remove_el( nugget )
      S.stats.total_nuggets_missed++
    } )

    BODY.append( nugget )
  }
}

let handle_gold_nugget_click = ( event ) => {

  S.stats.total_nuggets_clicked++

  if ( S.stats.total_nuggets_clicked == 1 ) { unlock_smith_upgrade( 'gold_nuggies_frequency_i' ); unlock_smith_upgrade( 'gold_nuggies_chance_up_i') }
  if ( S.stats.total_nuggets_clicked == 10 ) { unlock_smith_upgrade( 'gold_nuggies_frequency_ii' ); unlock_smith_upgrade( 'gold_nuggies_chance_up_ii') }
  if ( S.stats.total_nuggets_clicked == 30 ) { unlock_smith_upgrade( 'gold_nuggies_frequency_iii' ); unlock_smith_upgrade( 'gold_nuggies_chance_up_iii') }

  play_sound( 'gold_nugget_click' )
  remove_el( event.target )

  let chance = Math.random()

  if ( chance < .5 ) {

    let amount = ( S.ops * 13 + S.opc * 13 )
    earn( amount, false )
    RN.new( event, 'gold-nugget-click', amount )

  } else {

    start_gold_rush()

  }

}

let start_gold_rush = () => {

  let duration = 30 * SECOND

  let gold_rush_container = document.createElement( 'div' )
  gold_rush_container.classList.add( 'gold-rush-container' )

  CONTAINER.append( gold_rush_container )

  let counter = 0
  let spawner = setInterval(() => {

    counter += 500

    if ( counter >= duration ) clearInterval( spawner )

    let nugget = document.createElement( 'div' )
    nugget.classList.add( 'gold-nugget' )

    s( '.gold-rush-container' ).append( nugget )

    let random_x = Math.random() * window.innerWidth

    nugget.style.left = random_x + 'px'

    setTimeout(() => {
      nugget.style.top = '100%'
    }, 50)

  }, 500 )

  setTimeout(() => { remove_el( gold_rush_container ) }, duration )
}

let handle_gold_rush_nugget_click = () => {

}

// =======================================================================================

window.onload = () => { init_game() }
window.onresize = () => { O.reposition_elements = 1 }
window.onblur = on_blur
window.onfocus = on_focus
document.onkeydown = ( e ) => {
  if ( e.code == 'Escape' || e.key == 'Escape' ) {
    remove_wrapper()
  }
};

let pressed = []
let secretCode = 'synclair'
window.addEventListener('keyup', (e) => {
  if ( e.key != 'Shift' ) {
    pressed.push(e.key.toLowerCase())
    pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length)
    if (pressed.join('').includes( secretCode ) ) {
      win_achievement( 'who_am_i?' )
    }
    if ( pressed.join( '' ).includes( 'test' ) ) {
      Smith_Upgrades.forEach( upgrade => { upgrade.duration = 1 * SECOND })
      S.pickaxe.item.damage = Math.pow( S.pickaxe.item.damage + 100, 3 )
      S.gems += 100
    }
    if ( pressed.join( '' ).includes( 'qwer' ) ) {
      s( '.ore-container' ).style.visibility = 'hidden'
      s( '.torch-left' ).style.visibility = 'hidden'
      s( '.torch-right' ).style.visibility = 'hidden'
      s( '.combo-sign-container' ).style.visibility = 'hidden'
      s( '.left' ).style.background = 'white'
      TOPBAR_INVENTORY_CONTAINER.style.visibility = 'hidden'

      s( '.smith-upgrades' ).style.visibility = 'hidden'
    }
  }
})

setInterval( save_game, 1000 * 60 * 5 )