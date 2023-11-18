const container = document.querySelector('.container')
const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')
const clouds = document.querySelector('.clouds')
const loose = document.querySelector('.loose')
const start = document.querySelector('.start')
const speedMultiplier = document.querySelector('.speed_multiplier')
const html_record = document.querySelector('.record')
const html_bestRecord = document.querySelector('.best_record')
const dashboard = document.querySelector('.dashboard')
const colisionBtn = document.querySelector('.colision')
const autoJumpBtn = document.querySelector('.autoJump')
const speedModeBtn = document.querySelector('.speedmode')
const modMenuBtn = document.querySelector('.modmenu')
const checkboxMod = document.querySelector('.handleModMenu')
const speedmenu = document.querySelector('.speedmenu')
const speedmenu2 = document.querySelector('.speedmenu2')

const enemies = [
  'bala.png',
  'fantasma.png',
  'gumb.gif',
  'king.png',
  'peixe.png',
  'pipe.png',
  'planta.png'
]
const multipliersText = ['0.5x', '1.0x', '1.5x', '2.0x', '2.5x', '3.0x', 'MAX']
const speedPipeOriginal = 1.3
const maxSpeedPipe = 0.65
const isFakeRecord = '#eb1717'

let speedPipe = speedPipeOriginal
let playerCurrentRecord = 0
let playerBestRecord = 0
let isJumping = false
let ignoreColision = false
let autoJump = false
let autoSpeed = false
let modMenu = true // Ativa o mod menu

const handleModMenu = () => {
  if (checkboxMod.checked) {
    modMenu = true
  } else {
    modMenu = false
  }
  if (modMenu) {
    modMenuBtn.style.display = 'flex'
  } else {
    modMenuBtn.style.display = 'none'
  }
}

const handleIgnoreColision = () => {
  ignoreColision = !ignoreColision
  if (!ignoreColision) {
    colisionBtn.style.background = ''
    colisionBtn.innerHTML = `Colision ON`
  } else {
    dashboard.style.color = isFakeRecord
    colisionBtn.style.background = 'green'
    colisionBtn.innerHTML = `Colision OFF`
  }
}

const handleAutoJump = () => {
  autoJump = !autoJump
  if (autoJump) {
    dashboard.style.color = isFakeRecord
    autoJumpBtn.style.background = 'green'
    autoJumpBtn.innerHTML = `Jumper ON`
  } else {
    autoJumpBtn.style.background = ''
    autoJumpBtn.innerHTML = `Jumper OFF`
  }
}

const handleSpeedMode = () => {
  autoSpeed = !autoSpeed
  if (autoSpeed) {
    pipe.style.animation = `pipe ${maxSpeedPipe}s linear infinite`
    speedModeBtn.style.background = 'green'
    speedModeBtn.innerHTML = 'Speed ON'
    speedMultiplier.innerHTML = `Vel.: MAX`
  } else {
    pipe.style.animation = `pipe ${speedPipe}s linear infinite`
    speedModeBtn.style.background = ''
    speedModeBtn.innerHTML = 'Speed OFF'
  }
}

const runGame = () => {
  start.style.display = 'none'
  pipe.style.animation = `pipe ${speedPipe}s linear infinite`
  const onAnimationIteration = () => {
    if (!autoSpeed) {
      playerCurrentRecord += 1
      html_record.innerHTML = `Atual: ${playerCurrentRecord}`

      let enemie = Math.floor(Math.random() * enemies.length)
      pipe.src = `./assets/enemies/${enemies[enemie]}`

      speedPipeOnScreen()
      if (speedPipe > maxSpeedPipe) {
        speedPipe -= 0.01
        pipe.style.animation = 'none'
        setTimeout(() => {
          pipe.style.animation = `pipe ${speedPipe}s linear infinite`
        }, 200)
      }
    }
  }

  pipe.addEventListener('animationiteration', onAnimationIteration)

  const loop = setInterval(() => {
    const pipeHeight = pipe.offsetHeight
    let pipePosition = pipe.offsetLeft
    let marioJumpHeight = +getComputedStyle(mario).bottom.replace('px', '')
    console.log(pipeHeight)

    // Game Over
    if (autoJump && pipePosition <= 145) {
      // Pula automaticamente
      jump({ type: 'automatic' })
    } else if (
      !ignoreColision &&
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

const speedPipeOnScreen = () => {
  speedmenu.innerHTML = speedPipe.toFixed(2)

  const multipliersIndex = Math.floor(playerCurrentRecord / 10)
  speedmenu2.innerHTML = `${multipliersIndex}`
  multipliersValue =
    multipliersText[multipliersIndex] ||
    multipliersText[multipliersText.length - 1]
  speedMultiplier.innerHTML = `Vel.: ${multipliersValue}`
}

const restart = () => {
  if (playerCurrentRecord > playerBestRecord) {
    playerBestRecord = playerCurrentRecord
    html_bestRecord.innerHTML = `Melhor: ${playerBestRecord}`
  }

  if (autoSpeed) {
    handleSpeedMode()
  }

  playerCurrentRecord = 0
  html_record.innerHTML = `Atual: ${playerCurrentRecord}`
  speedPipe = speedPipeOriginal
  pipe.style.animation = `pipe ${speedPipe} linear infinite`
  pipe.style.left = `auto`
  speedMultiplier.innerHTML = `Vel.: ${multipliersText[0]}`
  mario.style.bottom = `0px`
  mario.src = './assets/mario.gif'
  mario.style.marginLeft = '0'
  mario.style.width = '80px'
  loose.style.display = 'none'

  runGame()
}

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
