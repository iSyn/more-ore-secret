let ParticleEngine = function() {

  this.amount = 1

  this.generate_rock_particles = ( event, amount = this.amount ) => {

    for ( let i = 0; i < amount; i++ ) {

      let particle = document.createElement( 'div' )
      particle.classList.add( 'particle' )

      particle.style.left = event.clientX + 'px'
      particle.style.top = event.clientY + 'px'

      s( 'body' ).append( particle )

      particle.addEventListener('animationend', () => {
        remove_el( particle )
      })
    }


  }

}