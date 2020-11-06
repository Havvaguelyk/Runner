// Variables
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

const backgroundImage = new Image()
const carImage = new Image()
const busImage new image ()

const ground = 430
const gravity = 4
let distance = 0
let username

let car = {
  image: new Image(),
  width: 60,
  height: 60,
  speed: 3
}

let cars = []
cars[0] = {
  x: canvas.width,
  y: ground - car.height
}

let bus = {
  image: new Image(),
  width: 70,
  height: 65,
  speed: 4
}
let buses []
bus[2] = {
x: canvas.width,
y: ground - bus.height
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

// Image sources
backgroundImage.src = "images/background.png"
car.image.src = "images/car.png"
runner.image.src = "images/runner_ani.gif"
collision.image.src = "images/collision.png"
bus.image.src = "images/bus.png"

// Sound sources
jump.sound.src = "sounds/jump_08.mp3"
collision.sound.src = "sounds/qubodup-crash.mp3"

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

  // buses
  for(let i= 0; i< bus.length; i++) {
    buses[i].x = buses[i].x - bus.speed
    if( buses[i].x < 180 && bus.length === 1){
      buses.push({
        x: canvas.width + (Math.random() * 100) + 80,
        y: ground - bus.height
      })
      if( buses[i].x < 180 && buses.length === 1){
        buses.push({
          x: canvas.width + (Math.random() * 100) + 80,
          y: ground - bus.height
          if(buses[i].x < bus.width){
            setTimeout( function() {
              buses.shift()
            }, 0);
          }
          context.drawImage(car.image, cars[i].x, cars[i].y, car.width, car.height)
        })
      }
    // Move car
    cars[i].x =  cars[i].x - car.speed

    // Create new car
    if( cars[i].x < 180 && cars.length === 1){
      cars.push({
        x: canvas.width + (Math.random() * 100) + 80,
        y: ground - car.height
      })
    }

    // Delete car when it is out of the screen
    if(cars[i].x < -car.width){
      setTimeout( function() {
        cars.shift()
      }, 0);
    }
    context.drawImage(car.image, cars[i].x, cars[i].y, car.width, car.height)

    // Collision
    if (runner.coordinates.x + runner.width/2 >= cars[i].x
      && runner.coordinates.x <= cars[i].x + car.width
      && runner.coordinates.y + runner.height > ground - car.height) {
        context.drawImage(collision.image, cars[i].x, cars[i].y, car.width, car.height)
        distance = 0
        collision.sound.play()
    }
    distance += 0.05
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

  requestAnimationFrame(draw)
}

function startGame() {
  event.preventDefault()
  username = document.getElementById("username").value
  document.getElementById("canvasContainer").style.display = "block"
  document.getElementById("formContainer").style.display = "none"
  draw()
}
