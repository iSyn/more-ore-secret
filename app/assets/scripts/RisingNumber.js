let RisingNumber = function() {

  this.new = ( e, type, amount = null ) => {

    let el = document.createElement( 'div' )

    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.color = 'white'
    el.style.fontSize = '20px'
    el.style.fontFamily = 'Germania One'
    el.style.textShadow = '0 0 1px rgba( 0, 0, 0, 0.5 )'

    if ( e ) {
      el.style.left = e.clientX + get_random_num( -20, 20 ) + 'px'
      el.style.top = e.clientY + get_random_num( -5, 5 ) + 'px'
    }
    el.style.animation = 'flyingNumber 2s forwards ease-out';

    el.innerHTML = `+${ beautify_number( amount ) }`

    // TYPES
    switch ( type ) {
      case 'weak-hit-click':
        el.style.fontSize = '28px'
        break;

      case 'successful-buy':
        el.innerHTML = '-$'
        el.style.color = 'red'
        el.style.fontSize = '30px'
        break;

      case 'combo':
        el.innerHTML = `${ amount } hit combo`
        el.style.color = get_random_color()
        el.style.fontSize = '35px'
        el.style.animationDuration = '3s'
        break;

      case 'buildings':
        let ore_sprite_dimensions = ORE_SPRITE.getBoundingClientRect()
        el.style.animation = 'buildingFlyingNumber 1.2s ease-out'
        el.style.left = ( ore_sprite_dimensions.left + ore_sprite_dimensions.right ) / 2  + 'px'
        el.style.top = ( ore_sprite_dimensions.top + ore_sprite_dimensions.bottom ) / 2 + 'px'
        break;

      default:
        break;
    }

    s( 'body' ).append( el )

    el.addEventListener( 'animationend', () => { remove_el( el ) } )

  }

}