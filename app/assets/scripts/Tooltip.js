let Tooltip = function() {

  this.show = ( e, obj ) => {

    let str = ''
    let tooltip_dimensions;

    TOOLTIP.style.display = 'flex'

    switch ( obj.type ) {
      case 'upgrade':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        let upgrade = select_from_arr( Upgrades, obj.name ).item
        TOOLTIP.style.left = ( MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect().left - tooltip_dimensions.width ) + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().top + 'px'

        str += `
          <div class='top'>
            <img src='${ upgrade.img }' alt='upgrade image' />
            <h1>${ upgrade.name }</h1>
            <p>${ beautify_number( upgrade.price ) } ores</p>
          </div>
          <hr />
          <div class='bottom'>
            <p class='desc'>${ upgrade.desc }</p>
            <p class='flavor-text'>${ upgrade.flavor_text }</p>
          </div>
        `
        
        break;

      case 'building':
        tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        let building = select_from_arr( Buildings, obj.name ).item
        TOOLTIP.style.left = ( MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect().left - tooltip_dimensions.width ) + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().top + 'px'

        str = `
          <div class='top'>
            <img src='${ building.img }' alt='building image' />
            <h1>${ building.name }</h1>
            <p>${ beautify_number( building.current_price ) } Ores </p>
          </div>
          <hr />
          <div class='bottom'>
            <p class='desc'>${ building.desc }</p>
            <ul>
              <li>Each ${ building.name } generates <strong>${ beautify_number( building.production ) }</strong> OpS</li>
              `
              if ( building.owned > 0 ) {
                str += `<li><strong>${ building.owned }</strong> ${ building.owned <= 1 ? building.name : building.name_plural } generating <strong>${ beautify_number( building.production * building.owned ) }</strong> OpS </li>`
              }
              str += `
            </ul>
            <p class='flavor-text'>${ building.flavor_text }</p>
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