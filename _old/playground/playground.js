window.onload = () => {

  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  canvas.width = document.querySelector('.container').getBoundingClientRect().width * 5
  canvas.height = document.querySelector('.container').getBoundingClientRect().height

  ctx.beginPath()
  ctx.moveTo(130, 400)
  ctx.lineTo(1000, 400)
  ctx.stroke()

  window.addEventListener('click', () => {
    console.log(event.clientX, event.clientY)
  })



}
