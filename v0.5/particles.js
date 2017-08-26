console.log('particles connected')

let risingNumber = (amount) => {
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

  // if (type == 'ores-special') {
  //   risingNumber.style.fontSize = 'xx-large'
  // }

  s('.particles').append(risingNumber)

  setTimeout(() => {
    risingNumber.remove()
  }, 2000)
}

let ore = document.querySelector('.ore')

ore.addEventListener('click', () => {
  risingNumber(Game.orePerClick)
})
