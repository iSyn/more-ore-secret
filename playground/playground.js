window.onload = () => {

  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  window.addEventListener('click', () => {
    drawParticles()
  })

  let Particle = function(x, y) {
    this.x = x
    this.y = y
    this.life ? this.life = this.life : this.life = 120

    this.draw = () => {
      console.log('drawing')
      ctx.fillRect(this.x, this.y, 3, 3)
    }

    this.update = () => {
      if (this.life > 0) {
        this.life--
        this.y++
      }

      this.draw()
    }

    this.draw()
  }

  let particles = []
  let drawParticles = () => {
    let mouse = {x: event.clientX, y: event.clientY}

    for (i = 0; i < 3; i++) {
      particles.push(new Particle(mouse.x, mouse.y))
    }
  }

  let animate = () => {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight) // clear whole screen
    for (i in particles) {
      if (particles[i].life > 0) {
        particles[i].update()
      } else {
        particles.splice(i, 1)
      }
    }
  }

  animate()



}
