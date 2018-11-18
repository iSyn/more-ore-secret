let Tooltip = function() {

  this.show = ( e, obj ) => {

    let str = ''
    let item;
    let tooltip_dimensions;

    TOOLTIP.style.display = 'flex'

    switch ( obj.type ) {

      case 'smith_upgrade':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        item = select_from_arr( Smith_Upgrades, obj.name )
        TOOLTIP.style.left = ( MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect().left - tooltip_dimensions.width ) + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().top + 'px'

        if ( item.locked ) {

          str += `
            <div>
              <h1>???</h1>
              `

              item.requires.forEach( requirement => {
                str += requirement.owned ? `<p style='color: green'>Requires ${ requirement.name }</p>` : `<p style='color: red'>Requires ${ requirement.name }</p>`

              })

              str += `
            </div>
          `
        } else {
          str += `
            <div class="top" style='padding-bottom: 10px;'>
              <img src="${ item.img }" alt="smith upgrade image"/>
              <h1>${ item.name }</h1>
            </div>
            <div class="bottom" style='display: flex; flex-flow: row nowrap; justify-content: center;'>
              <div class="left" style='width: 20%; text-align: right; padding-right: 10px; border-right: 1px solid white; opacity: .5'>
                <p>${ item.price } &nbsp; <i class="fa fa-diamond fa-1x" style='color: #1bacc8'></i></p>
                <p>${ item.duration } &nbsp; <i class="fa fa-clock-o fa-1x"></i></p>
              </div>
              <div class="right" style='width: 80%; padding-left: 10px'>
                <p>${ item.desc }</p>
              </div>
            </div>
          `

          if ( item.flavor_text ) {
            str += `<p class='flavor-text'>${ item.flavor_text }</p>`
          }
        }
        
        break;
      
      case 'upgrade':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        item = select_from_arr( Upgrades, obj.name )
        TOOLTIP.style.left = ( MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect().left - tooltip_dimensions.width ) + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().top + 'px'

        str += `
          <div class='top'>
            <img src='${ item.img }' alt='upgrade image' />
            <h1>${ item.name }</h1>
            <p>${ beautify_number( item.price ) } ores</p>
          </div>
          <hr />
          <div class='bottom'>
            <p class='desc'>${ item.desc }</p>
            <p class='flavor-text'>${ item.flavor_text }</p>
          </div>
        `
        
        break;

      case 'building':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        item = select_from_arr( Buildings, obj.name )
        TOOLTIP.style.left = ( MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect().left - tooltip_dimensions.width ) + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().top + 'px'

        str = `
          <div class='top'>
            <img src='${ item.img }' alt='building image' />
            <h1>${ item.name }</h1>
            <p>${ beautify_number( item.current_price ) } Ores </p>
          </div>
          <hr />
          <div class='bottom'>
            <p class='desc'>${ item.desc }</p>
            <ul>
              <li>Each ${ item.name } generates <strong>${ beautify_number( item.production ) }</strong> OpS</li>
              `
              if ( item.owned > 0 ) {
                str += `<li><strong>${ item.owned }</strong> ${ item.owned <= 1 ? item.name : item.name_plural } generating <strong>${ beautify_number( item.production * item.owned ) }</strong> OpS </li>`
                str += `<li>Schools are currently generating <strong>${ calculate_building_ops( item.owned, item.production ) }%</strong> of your total OpS</li>`
              }
              str += `
            </ul>
            <p class='flavor-text'>${ item.flavor_text }</p>
          </div>
        `
        break

      default:
        break

    }

    TOOLTIP.innerHTML = str

    
  }

  this.hide = () => {
    TOOLTIP.style.display = 'none'
  }

}