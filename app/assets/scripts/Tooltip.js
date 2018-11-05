let Tooltip = function() {

  this.show = ( e, obj ) => {

    TOOLTIP.style.display = 'flex'

    switch ( obj.type ) {
      case 'building':
        let building = select_from_arr( Buildings, obj.name ).item
        let tooltip_dimensions = TOOLTIP.getBoundingClientRect()
        TOOLTIP.style.left = ( MIDDLE_VERTICAL_SEPARATOR.getBoundingClientRect().left - tooltip_dimensions.width ) + 'px'
        TOOLTIP.style.top = e.target.getBoundingClientRect().top + 'px'

        let str = `
          <div class='top'>
            <img src='${ building.img }' alt='building image' />
            <h1>${ building.name }</h1>
            <p>${ beautify_number( building.price ) } Ores </p>
          </div>
          <div class='bottom'>
            <p>${ building.desc }</p>
            <ul>
              <li>Each ${ building.name } generates <strong>${ building.production }</strong> OpS</li>
              `
              if ( building.owned > 0 ) {
                str += `<li><strong>${ building.owned }</strong> ${ building.owned <= 1 ? building.name : building.name_plural } generating <strong>${ building.production * building.owned }</strong> OpS </li>`
              }
              str += `
            </ul>
          </div>
        `
        TOOLTIP.innerHTML = str
        break

      default:
        break

    }

    
  }

  this.hide = () => {
    TOOLTIP.style.display = 'none'
  }

}