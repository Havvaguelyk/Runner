// Variables
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

const backgroundImage = new Image()
const redCarImage = new Image()
const busImage = new Image()
const taxiImage = new Image()
const ufoImage = new Image()
const horseImage = new Image()

const ground = 430
const gravity = 4
let distance = 0
let highscore = 0
let username
let message = ''

let car = {
  width: 60,
  height: 60
}

let horse = {
  img: horseImage,
  width: 80,
  speed: 2.8
}

let ufo = {
  img: ufoImage,
  speed: 4.5
}

const bus = {
  img: busImage,
  speed: 3.3
}

const redCar = {
  img: redCarImage,
  speed: 3.8
}

const taxi = {
  img: taxiImage,
  speed: 3.5
}

let cars = []
cars[0] = {
  speed: bus.speed,
  image: bus.img,
  x: canvas.width,
  y: ground - car.height
}

let runner = {
  image: new Image(),
  width: 60,
  height: 60,
  coordinates: {
    x: 10,
    y: ground - 60
  }
}

let jump = {
  state: 'none',
  sound: new Audio()
}

const collision = {
  image: new Image(),
  sound: new Audio()

}

const ufo_flying = {
  image: new Image(),
  sound: new Audio()
}

// Image sources
backgroundImage.src = "images/background.png"
busImage.src = "images/bus.png"
redCarImage.src = "images/car.png"
taxiImage.src = "images/taxi.png"
ufoImage.src = "images/ufo.png"
horseImage.src = "images/horse.png"
runner.image.src = "images/runner_ani.gif"
collision.image.src = "images/collision.png"

// Sound sources
jump.sound.src = "sounds/jump_08.mp3"
collision.sound.src = "sounds/qubodup-crash.mp3"
ufo_flying.sound.src = "sounds/ufo_sound.mp3"

// Jump functionality
function jumpUp(){
  if (jump.state === 'none'){
    jump.state = 'up'
    jump.sound.play()
  }
}

canvas.addEventListener("click", jumpUp)

// Draw function
function draw(){
  context.drawImage(backgroundImage, 0, 0)

  // Cars
  for(let i = 0; i < cars.length; i++){

    // Move car
    cars[i].x = cars[i].x - cars[i].speed

    // Create new car
    if( cars[i].x < 180 && cars.length === 1){
      const ranCar = [bus, redCar, taxi, ufo, horse][Math.floor(Math.random() * 5)];
      if (ranCar === ufo) {
        ufo_flying.sound.play()
      }
      cars.push({
        speed: ranCar.speed,
        image: ranCar.img,
        x: canvas.width + (Math.random() * 60) + 160,
        y: ground - car.height
      })
    }

    // Delete car when it is out of the screen
    if(cars[i].x < -car.width){
      setTimeout( function() {
        cars.shift()
      }, 0);
    }
    context.drawImage(cars[i].image, cars[i].x, cars[i].y, car.width, car.height)

    // Collision
    if (runner.coordinates.x + runner.width/2 >= cars[i].x
      && runner.coordinates.x <= cars[i].x + car.width
      && runner.coordinates.y + runner.height > ground - car.height) {
        context.drawImage(collision.image, cars[i].x, cars[i].y, car.width, car.height)
        distance = 0
        collision.sound.play()
        message = ''
    }
    distance += 0.05
    if (distance > highscore) {
      highscore = Math.floor(distance)
      if (distance > 25) {
        message = 'You reached a new highscore!'
      }
    }
  }

  // Animate jump
  if (jump.state === 'up') {
    runner.coordinates.y -= gravity
  }
  if (jump.state === 'up' && runner.coordinates.y < 220) {
    jump.state = 'down'
  }
  if (jump.state === 'down'){
    runner.coordinates.y += gravity
  }
  if (jump.state === 'down' && runner.coordinates.y === ground - runner.height) {
    jump.state = 'none'
  }

  context.drawImage(runner.image, runner.coordinates.x, runner.coordinates.y, runner.width, runner.height)

  context.fillStyle = "#fff"
  context.font = "20px helvetica"
  context.fillText(`${username}: ${Math.floor(distance)}m`, 20, 40)
  context.fillText(`Highscore: ${highscore}`, 220, 40)
  context.fillText(`${message}`, 40, 160)


  requestAnimationFrame(draw)
}

function startGame() {
  event.preventDefault()
  username = document.getElementById("username").value
  document.getElementById("canvasContainer").style.display = "block"
  document.getElementById("formContainer").style.display = "none"
  draw()
}
