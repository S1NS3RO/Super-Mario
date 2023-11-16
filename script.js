const container = document.querySelector('.container')
const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')
const clouds = document.querySelector('.clouds')
const loose = document.querySelector('.loose')
const start = document.querySelector('.start')
const speedMultiplier = document.querySelector('.speed_multiplier')
const html_lastRecord = document.querySelector('.last_record')
const html_record = document.querySelector('.record')
const html_bestRecord = document.querySelector('.best_record')
const colisionBtn = document.querySelector('.colision')
const jumpModeBtn = document.querySelector('.jumpmode')
const speedModeBtn = document.querySelector('.speedmode')
const modMenuBtn = document.querySelector('.modmenu')

const enemies = [
  'pipe',
  'pipe',
  'pipe',
  'pipe',
  'bala',
  'balaboca',
  'fantasma',
  'gumb',
  'king',
  'peixe',
  'pixel',
  'planta'
]

const speedPipeOriginal = 1.3
let speedPipe = speedPipeOriginal
let playerLastRecord = 0
let playerCurrentRecord = 0
let playerBestRecord = 0

let modMenu = true
let colisionMode = false
let jumpMode = false

const handleModMenu = () => {
  if (modMenu) {
    modMenuBtn.style.display = 'flex'
  } else {
    modMenuBtn.style.display = 'none'
  }
}
handleModMenu()

const handleColisionMode = () => {
  colisionMode = !colisionMode
  if (!colisionMode) {
    colisionBtn.innerHTML = `Colision ON`
  } else {
    colisionBtn.innerHTML = `Colision OFF`
  }
}

const handleJumpMode = () => {
  jumpMode = !jumpMode
  if (jumpMode) {
    jumpModeBtn.innerHTML = `Jumper ON`
  } else {
    jumpModeBtn.innerHTML = `Jumper OFF`
  }
}

const handleSpeedMode = () => {
  if (speedPipe <= 0.7) {
    speedPipe = speedPipeOriginal
    speedModeBtn.innerHTML = 'Speed OFF'
  } else {
    speedPipe = 0.7
    speedModeBtn.innerHTML = 'Speed ON'
  }
}

const startGame = () => {
  const onAnimationIteration = () => {
    playerCurrentRecord++
    speedPipeOnScreen()

    html_record.innerHTML = `Atual: ${playerCurrentRecord}`
    let enemie = Math.floor(Math.random() * enemies.length)
    pipe.src = `./assets/enemies/${enemies[enemie]}.png`

    if (speedPipe >= 0.65) {
      speedPipe -= 0.01
      pipe.style.animation = 'none'
      setTimeout(() => {
        pipe.style.animation = `pipe ${speedPipe}s linear infinite`
      }, 200)
    }
  }

  const speedPipeOnScreen = () => {
    const multipliersText = [
      '0.5x',
      '1.0x',
      '1.5x',
      '2.0x',
      '2.5x',
      '3.0x',
      '3.5x'
    ]
    const multipliersIndex = Math.floor(playerCurrentRecord / 10)
    multipliersValue =
      multipliersText[multipliersIndex] ||
      multipliersText[multipliersText.length - 1]
    speedMultiplier.innerHTML = `Velocidade: ${multipliersValue}`
  }

  pipe.addEventListener('animationiteration', onAnimationIteration)

  start.style.display = 'none'
  pipe.style.animation = `pipe ${speedPipe}s linear infinite`

  const loop = setInterval(() => {
    const pipeHeight = pipe.offsetHeight
    let pipePosition = pipe.offsetLeft
    let marioJumpHeight = +getComputedStyle(mario).bottom.replace('px', '')
    console.log(pipeHeight)

    // Game Over
    if (jumpMode && pipePosition <= 145) {
      // Pula automaticamente
      jump({ type: 'automatic' })
    } else if (
      !colisionMode &&
      pipePosition <= 70 &&
      pipePosition > 0 &&
      marioJumpHeight <= pipeHeight - 3
    ) {
      pipe.style.animation = 'none'
      mario.classList.remove('jump')
      pipe.style.left = `${pipePosition}px`
      mario.style.bottom = `${marioJumpHeight}px`
      mario.src = './assets/mario-dead.png'
      mario.style.width = '40px'
      mario.style.marginLeft = '30px'

      loose.style.display = 'flex'

      pipe.removeEventListener('animationiteration', onAnimationIteration)

      clearInterval(loop)
    }
  }, 10)
}

const restart = () => {
  if (playerCurrentRecord > playerBestRecord) {
    playerBestRecord = playerCurrentRecord
    html_bestRecord.innerHTML = `Melhor: ${playerBestRecord}`
  }

  playerLastRecord = playerCurrentRecord
  html_lastRecord.innerHTML = `Anterior: ${playerLastRecord}`

  playerCurrentRecord = 0
  html_record.innerHTML = `Atual: ${playerCurrentRecord}`

  pipe.style.animation = `pipe ${speedPipeOriginal} linear infinite`
  pipe.style.left = `auto`

  mario.style.bottom = `0px`
  mario.src = './assets/mario.gif'
  mario.style.marginLeft = '0'
  mario.style.width = '80px'

  loose.style.display = 'none'

  speedPipe = speedPipeOriginal
  speedMultiplier.innerHTML = speedPipe.toFixed(2)
  startGame()
}

let isJumping = false
const jump = event => {
  if (
    !isJumping &&
    (event.type === 'click' ||
      event.key === ' ' ||
      event.key === 'ArrowUp' ||
      event.type === 'automatic')
  ) {
    isJumping = true
    mario.classList.add('jump')
    setTimeout(() => {
      mario.classList.remove('jump')
      isJumping = false
    }, 600)
  }
}

container.addEventListener('click', jump)
container.setAttribute('tabindex', '0')
container.addEventListener('keydown', jump)
