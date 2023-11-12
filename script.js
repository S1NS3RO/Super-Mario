const container = document.querySelector('.container')
const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')
const clouds = document.querySelector('.clouds')
const loose = document.querySelector('.loose')
const start = document.querySelector('.start')
const moreOne = document.querySelector('.moreOne')

let speedPipe = 1.2

const startGame = () => {
  pipe.addEventListener('animationiteration', () => {
    speedPipe -= 0.03
    moreOne.innerHTML = speedPipe.toFixed(3)

    pipe.style.animation = `pipe ${speedPipe}s linear infinite`
  })

  start.style.display = 'none'
  pipe.style.animation = `pipe ${speedPipe}s linear infinite`

  const loop = setInterval(() => {
    let pipePosition = pipe.offsetLeft
    let marioPosition = +getComputedStyle(mario).bottom.replace('px', '')

    /* Game Over
    if (pipePosition <= 80 && pipePosition > 0 && marioPosition <= 40) {
      pipe.style.animation = 'none'
      pipe.style.left = `${pipePosition}px`
      mario.style.bottom = `${marioPosition}px`
      mario.src = './assets/game-over.png'
      mario.style.width = '40px'
      mario.style.marginLeft = '40px'

      loose.style.display = 'flex'

      clearInterval(timerSpeed)
      clearInterval(loop)
    }*/
  }, 10)
}

const jump = () => {
  if (event.type === 'click' || event.key === ' ' || event.key === 'ArrowUp') {
    mario.classList.add('jump')
    setTimeout(() => {
      mario.classList.remove('jump')
    }, 500)
  }
}

const restart = () => {
  pipe.style.animation = 'pipe 1.2s linear infinite'
  pipe.style.left = `auto`

  mario.style.bottom = `0px`
  mario.src = './assets/mario.gif'
  mario.style.marginLeft = '0'
  mario.style.width = '80px'

  loose.style.display = 'none'
  speedPipe = 1.2
  moreOne.innerHTML = speedPipe.toFixed(3)
  startGame()
}

container.addEventListener('click', jump)
container.addEventListener('keydown', jump)
