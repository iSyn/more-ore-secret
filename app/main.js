const CONTAINER = s( '.container' )
const GAME_CONTAINER = s( '.game-container' )
const ORE_SPRITE = s( '.ore-sprite' )
const RIGHT_CONTAINER = s( '.right-container' )
const INVENTORY_EL = s( '.topbar-inventory' )
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

let S = new State().state
let RN = new RisingNumber()
let TS = new TextScroller()
let TT = new Tooltip()
let PE = new ParticleEngine()
let SMITH = new Smith()

let play_sound = ( name, file_type = 'wav', base_vol = 1 ) => {
  let sound = new Audio( `./app/assets/sounds/${ name }.${ file_type }` )
  sound.volume = S.prefs.sfx_volume * base_vol
  sound.play()
}

let earn = ( amount ) => {
  update_ore_hp( amount )

  S.stats.total_ores_earned += amount
  S.ores += amount
}

let spend = ( amount ) => {
  S.ores -= amount
  play_sound( 'buy_sound' )
}

let reposition_elements = () => {
  let left_vertical_separator_dimensions = LEFT_VERTICAL_SEPARATOR.getBoundingClientRect()
  let middle_vertical_separator_dimensions = MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect()
  let torch_dimensions = TORCH_LEFT.getBoundingClientRect()
  let settings_container_dimensions = SETTINGS_CONTAINER.getBoundingClientRect()
  let text_scroller_container_dimensions = TEXT_SCROLLER_CONTAINER.getBoundingClientRect()

  // Position torches to the separators
  TORCH_LEFT.style.left = left_vertical_separator_dimensions.right + 'px'
  TORCH_RIGHT.style.left = middle_vertical_separator_dimensions.left - torch_dimensions.width + 'px'

  // Position settings container
  SETTINGS_CONTAINER.style.left = middle_vertical_separator_dimensions.left - settings_container_dimensions.width + 'px'
  SETTINGS_CONTAINER.style.top = text_scroller_container_dimensions.top - settings_container_dimensions.height + 'px'

  // Position automater
  if ( !S.automater.automater_accordion_hidden ) {
    AUTOMATER_WRAPPER.style.display = 'flex'
    let automater_header_dimensions = AUTOMATER_HEADER.getBoundingClientRect()
    AUTOMATER_WRAPPER.style.left = middle_vertical_separator_dimensions.left - automater_header_dimensions.width + 'px'
    AUTOMATER_WRAPPER.style.top = '30%'
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
  str += build_buildings()

  TAB_CONTENT.innerHTML = str
}

let build_upgrades = () => {
  let str = '<div class="upgrades-container">'
  let index = 0
  Upgrades.forEach( upgrade => {
    if ( upgrade.hidden == 0 && !upgrade.owned ) {
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

let build_buildings = () => {
  let str = ''
  let index = 0
  Buildings.forEach( building => {
    if ( building.hidden == 0 ) {
      str += `
        <div class="building" onclick="Buildings[ ${ index } ].buy( event )" onmouseover="play_sound( 'store_item_hover' ); TT.show( event, { name: '${ building.code_name }', type: 'building' } )" onmouseout="TT.hide()">
          <div class="left">
            <img src="${ building.img }" alt="building image"/>
          </div>
          <div class="middle">
            <h1>${ building.name }</h1>
            <p>Cost: ${ beautify_number( building.current_price ) } ores</p>
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
}

let build_pickaxe_accordion = () => {
  let str = ''

  str += `
    <div class='pickaxe-accordion'>
      <header onclick='toggle_pickaxe_accordion()'>
        <p>Pickaxe</p>
        <i class='fa fa-caret-down fa-1x'></i>
      </header>
      <div>
        <p>Sharpness: ${ S.pickaxe.sharpness }%</p>
        <p>Hardness: ${ S.pickaxe.hardness }%</p>
      </div>
    </div>
    <div class='horizontal-separator thin dark'></div>
  `

  return str
}

let build_pickaxe_update = ( direct = false ) => {
  let str = ''

  console.log('build pickaxe update firing')

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
  let str = ''

  Repeatable_Smith_Upgrades.forEach( upgrade => {
    str += `
      <div onclick='start_smith_upgrade( Repeatable_Smith_Upgrades, "${ upgrade.code_name }" )' class="smith-upgrade repeatable">
        <img src="${ upgrade.img }" alt="upgrade image"/>
        <div>
          <small>lv. ${ upgrade.level }</small>
          <h1>${ upgrade.name }</h1>
          <p>${ upgrade.duration }s</p>
        </div>
      </div>
    `
  } )

  Smith_Upgrades.forEach( upgrade => {
    str += `
    <div onclick='start_smith_upgrade( Smith_Upgrades, "${ upgrade.code_name }" )' class="smith-upgrade">
      <img src="${ upgrade.img }" alt="upgrade image"/>
    </div>
    `
  })

  if ( direct ) {
    if ( s( '.smith-upgrades' ) ) {
      s( '.smith-upgrades' ).innerHTML = str
    }
    return
  }

  return str
}

let toggle_pickaxe_accordion = () => {
  s( '.pickaxe-accordion' ).classList.toggle( 'open' )
}

let build_automaters = () => {
  console.log( 'build automaters firing' )
  let dd = s( '.automater.display' ).getBoundingClientRect()
  s('.automater .owned').innerHTML = S.automater.available
  console.log( Automaters )

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
          <i onclick='Automaters[${ i }].open_settings("${ el.id }")' class="fa fa-cog"></i>
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
  console.log('transitioning')
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
  let opc = S.opc

  if ( type ) {
    if ( type == 'weak-spot' ) {
      opc *= S.weak_hit_multi
    }
  }

  return opc
}

let calculate_ops = () => {
  let ops = 0

  Buildings.forEach( building => {
    ops += building.owned * building.production
  })

  S.ops = ops
}

let calculate_building_ops = ( building_owned, building_production ) => {
  let percentage = ( ( building_owned * building_production ) / S.ops ) * 100
  return beautify_number( percentage )
}

let init_game = () => {
  start_loop()
  generate_weak_spot()
  reposition_elements()
  S.tabs = Tabs
  build_tabs()
  build_store()
  handle_text_scroller()
  ORE_SPRITE.addEventListener( 'click', handle_click )
  ORE_WEAK_SPOT.addEventListener( 'click', ( e ) => { handle_click( e, 'weak-spot' ) })
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
    play_sound( 'ore_weak_spot_hit' )
    S.stats.total_weak_hit_clicks++
    S.current_combo++
    if ( S.current_combo > S.stats.highest_combo ) S.stats.highest_combo = S.current_combo
    if ( S.current_combo % 5 == 0 ) RN.new( e, 'combo', S.current_combo )
    RN.new( event, 'weak-hit-click', opc )
    generate_weak_spot()
  } else {
    play_sound( 'ore_hit' )
    S.current_combo = 0
    RN.new( event, 'click', opc )
  }

  S.stats.total_clicks++

  earn( opc )
}

let handle_text_scroller = () => {

  let animation_speed = 20

  setTimeout( () => {  handle_text_scroller()  }, 1000 * animation_speed )

  if ( Math.random() <= .40 || TS.queue.length > 0 && !S.prefs.window_blurred ) {
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

let start_loop = () => {

  setInterval(() => {
    update_topbar_inventory()
    update_ore_sprite()
    earn( S.ops / S.prefs.game_speed )
  }, 1000 / S.prefs.game_speed)

  setInterval(() => {
    if ( S.ops > 0 && S.prefs.show_ops_rising_numbers ) {
      RN.new( null, 'buildings', S.ops )
    }
  }, 1000)
}

let update_ore_hp = ( amount ) => {
  if (S.current_ore_hp - amount <= 0 ) {
    play_sound( 'ore_destroyed' )
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
    ORE_SPRITE.src = './app/assets/images/ore1-1.png'
    current_sprite = 1
  } else if ( current_percentage <= 80 && current_percentage > 60 && current_sprite != 2 ) {
    play_sound( 'ore_percentage_lost' )
    ORE_SPRITE.src = './app/assets/images/ore1-2.png'
    current_sprite = 2
  } else if ( current_percentage <= 60 && current_percentage > 40 && current_sprite != 3 ) {
    play_sound( 'ore_percentage_lost' )
    ORE_SPRITE.src = './app/assets/images/ore1-3.png'
    current_sprite = 3
  } else if ( current_percentage <= 40 && current_percentage > 20 && current_sprite != 4 ) {
    play_sound( 'ore_percentage_lost' )
    ORE_SPRITE.src = './app/assets/images/ore1-4.png'
    current_sprite = 4
  } else if ( current_percentage <= 20 && current_sprite != 5 ) {
    play_sound( 'ore_percentage_lost' )
    ORE_SPRITE.src = './app/assets/images/ore1-5.png'
    current_sprite = 5
  }

}

let update_topbar_inventory = () => {
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

  INVENTORY_EL.innerHTML = str
}

let build_achievements = () => {
  let wrapper = document.createElement( 'div' )
  wrapper.classList.add( 'wrapper' )

  let str = `
    <div class='stats-container'>
      <h1>Achievements</h1>
      <i onclick='remove_wrapper()' class='fa fa-times fa-1x'></i>
    </div>
  `

  wrapper.innerHTML = str
  GAME_CONTAINER.append( wrapper )
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

window.onload = () => { init_game() }
window.onresize = () => { reposition_elements() }
window.onblur = () => { S.prefs.window_blurred = true }
window.onfocus = () => { S.prefs.window_blurred = false }
document.onkeydown = ( e ) => {
  if ( e.code == 'Escape' || e.key == 'Escape' ) {
    remove_wrapper()
  }
};