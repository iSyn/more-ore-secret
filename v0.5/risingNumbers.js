let risingNumber = (amount, type) => {
  let mouseX = event.clientX
  let randomNumber = Math.floor(Math.random() * 20) + 1
  let randomSign = Math.round(Math.random()) * 2 - 1
  let randomMouseX = mouseX + (randomNumber * randomSign)
  let mouseY = event.clientY - 20

  let risingNumber = document.createElement('div')
  risingNumber.classList.add('rising-number')
  risingNumber.innerHTML = `+${amount}`
  risingNumber.style.left = randomMouseX + 'px'
  risingNumber.style.top = mouseY + 'px'

  risingNumber.style.position = 'absolute'
  risingNumber.style.fontSize = '15px'
  risingNumber.style.animation = 'risingNumber 2s ease-out'
  risingNumber.style.animationFillMode = 'forwards'
  risingNumber.style.pointerEvents = 'none'
  risingNumber.style.color = 'white'

  if (type == 'special') {
    risingNumber.style.fontSize = 'xx-large'
  }

  s('.particles').append(risingNumber)

  setTimeout(() => {
    risingNumber.remove()
  }, 2000)
}

let ore = document.querySelector('.ore')
let oreClickArea = document.querySelector('.ore-click-area')

ore.addEventListener('click', () => {
  risingNumber(Game.orePerClick)
})

oreClickArea.addEventListener('click', () => {
  risingNumber(Game.orePerClick * 5, 'special')
})

