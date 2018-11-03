let RisingNumber = function() {

  this.new = ( e, type, amount ) => {

    let el = document.createElement( 'div' )

    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.color = 'white'
    el.style.fontSize = '20px'
    el.style.fontFamily = 'Germania One'
    el.style.left = e.clientX + get_random_num( -20, 20 ) + 'px'
    el.style.top = e.clientY + get_random_num( -5, 5 ) + 'px'
    el.style.animation = 'flyingNumber 2s forwards';

    el.innerHTML = `+${ amount }`

    // TYPES
    switch ( type ) {
      case 'weak-hit-click':
        el.style.fontSize = '28px'
        break;
      default:
        break;
    }

    s( 'body' ).append( el )

    el.addEventListener( 'animationend', () => { remove_el( el ) } )

  }

}