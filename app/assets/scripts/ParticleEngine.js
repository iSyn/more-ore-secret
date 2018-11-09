let ParticleEngine = function() {

  this.amount = 1

  this.generate_rock_particles = ( event, amount = this.amount ) => {

    for ( let i = 0; i < amount; i++ ) {

      let particle = document.createElement( 'div' )
      particle.classList.add( 'particle' )

      particle.style.position = 'absolute'
      particle.style.height = '1px'
      particle.style.width = '1px'

    }


  }

}