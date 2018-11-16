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

        console.log( item )

        str += `
          <div>
            <h1>${ item.name }</h1>
            <p>${ item.desc }</p>
            <p>Duration: ${ item.duration } seconds</p>
            <p>Price: ${ item.price } gems</p>
          </div>
        `
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