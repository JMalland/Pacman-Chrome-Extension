class TempImage {
  image = null
  x = null
  y = null
  w = Map.tileSize
  h = Map.tileSize
  constructor(image, x, y, w, h)
  {
    this.image = image
    this.x = Map.tileSize*(x - 0.5*(w-1))
    this.y = Map.tileSize*(y + 0.5*(h-1))
    this.w = w*Map.tileSize
    this.h = h*Map.tileSize
  }
}

function createImage(src)
{
  image = new Image()
  image.onload = () => {
    Map.loadedImageCount ++
  }
  image.src = src
  return(image)
}

function updateSpeed(object)
{
  var pSpeed = null
  var pDotsSpeed = null
  var pFrightSpeed = null
  var pFrightDotsSpeed = null
  var gSpeed = null
  var gFrightSpeed = null
  
  if (Map.gameMode === "Default")
  {
    pSpeed = (Map.maxSpeed*1.2)
    pDotsSpeed = (Map.maxSpeed*1.29)
    pFrightSpeed = (Map.maxSpeed*1.1)
    pFrightDotsSpeed = (Map.maxSpeed*1.21)
    gSpeed = (Map.maxSpeed*1.2)
    gFrightSpeed = (Map.maxSpeed*1.5)
  }
  if (Map.level === 1)
  {
    // 80% of Max
    pSpeed = (Map.maxSpeed*1.2)
    // 71% of Max
    pDotsSpeed = (Map.maxSpeed*1.29)
    // 90% of Max
    pFrightSpeed = (Map.maxSpeed*1.1)
    // 79% of Max
    pFrightDotsSpeed = (Map.maxSpeed*1.21)
    // 75% of Max
    gSpeed = (Map.maxSpeed*1.25)
    // 50% of Max
    gFrightSpeed = (Map.maxSpeed*1.5)
    // Set frightened mode conditions
    //Ghost.setBlueDuration(6)
    //Ghost.setBlueFlashes(6)
  }
  else if (Map.level>1 && Map.level<5)
  { 
    // 90% of Max
    pSpeed = (Map.maxSpeed*1.1)
    // 79% of Max
    pDotsSpeed = (Map.maxSpeed*1.21)
    // 95% of Max
    pFrightSpeed = (Map.maxSpeed*1.05)
    // 83% of Max
    pFrightDotsSpeed = (Map.maxSpeed*1.17)
    // 85% of Max
    gSpeed = (Map.maxSpeed*1.15)
    // 55% of Max
    gFrightSpeed = (Map.maxSpeed*1.45)
    /* Set frightened mode conditions
    if (Map.level === 2) Ghost.setBlueDuration(5)
    else if (Map.level === 3) Ghost.setBlueDuration(4)
    else if (Map.level === 4) Ghost.setBlueDuration(3)
    Ghost.setBlueFlashes(5)
    */
  }
  else if (Map.level>=5 && Map.level<21)
  { 
    // 100% of Max
    pSpeed = Map.maxSpeed
    // 87% of Max
    pDotsSpeed = (Map.maxSpeed*1.13)
    // 100% of Max
    pFrightSpeed = (Map.maxSpeed)
    // 87% of Max
    pFrightDotsSpeed = (Map.maxSpeed*1.13)
    // 95% of Max
    gSpeed = (Map.maxSpeed*1.05)
    // 60% of Max
    gFrightSpeed = (Map.maxSpeed*1.4)
    /* Set frightened mode conditions
    if (Map.level === 6) Ghost.setBlueDuration(5)
    else if (Map.level === 14) Ghost.setBlueDuration(3)
    else if (Map.level === 5 || Map.level === 7 || Map.level === 8 || Map.level === 11) Ghost.setBlueDuration(2)
    else if (Map.level === 9 || Map.level === 12 || Map.level === 13 || Map.level === 15 || Map.level === 16 || Map.level === 18) Ghost.setBlueDuration(1)
    */
    //if (Map.level>4 && Map.level<9 || Map.level === 10 || Map.level === 11 || Map.level === 14) //Ghost.setBlueFlashes(5)
    //else if (Map.level === 9 || Map.level === 12 || Map.level === 13 || Map.level === 15 || Map.level === 16 || Map.level === 18) //Ghost.setBlueFlashes(3)
    if (Map.level === 17)
    {
      pFrightSpeed = pSpeed
      pFrightDotsSpeed = pDotsSpeed
      gFrightSpeed = gSpeed
      //Ghost.setBlueDuration(0)
      //Ghost.setBlueFlashes(0)
    }
  }
  else if (Map.level>21)
  { // 90% of Max
    pSpeed = (Map.maxSpeed*0.9)
    // 79% of Max
    pDotsSpeed = (Map.maxSpeed*0.79)
    // 100% of Max
    pFrightSpeed = pSpeed
    // 87% of Max
    pFrightDotsSpeed = pDotsSpeed
    // 95% of Max
    gSpeed = (Map.maxSpeed*0.95)
    // 70% of Max
    gFrightSpeed = gSpeed
    // Set frightened mode conditions
    //Ghost.setBlueDuration(0)
    //Ghost.setBlueFlashes(0)
  }

  if (object instanceof Pacman)
  {
    object.speed = pSpeed
    object.dotsSpeed = pDotsSpeed
    object.frightSpeed = pFrightSpeed
    object.frightDotsSpeed = pFrightDotsSpeed
  }
  else if (object instanceof Ghost)
  {
    object.speed = gSpeed
    object.frightSpeed = gFrightSpeed
  }
}

class Canvas {
  // Animation Images
  static #pacman = 
    [
    [createImage("images/Pac-Man/Pacman.png"), createImage("images/Pac-Man/Pacman.png")],
    [createImage("images/Pac-Man/Pacman-Up-1.png"), createImage("images/Pac-Man/Pacman-Up-2.png")],
    [createImage("images/Pac-Man/Pacman-Right-1.png"), createImage("images/Pac-Man/Pacman-Right-2.png")],
    [createImage("images/Pac-Man/Pacman-Down-1.png"), createImage("images/Pac-Man/Pacman-Down-2.png")],
    [createImage("images/Pac-Man/Pacman-Left-1.png"), createImage("images/Pac-Man/Pacman-Left-2.png")]
    ]
  static #blinky = 
    [
    [createImage("images/Blinky/Blinky-Left-1.png"), createImage("images/Blinky/Blinky-Left-2.png")],
    [createImage("images/Blinky/Blinky-Up-1.png"), createImage("images/Blinky/Blinky-Up-2.png")],
    [createImage("images/Blinky/Blinky-Right-1.png"), createImage("images/Blinky/Blinky-Right-2.png")],
    [createImage("images/Blinky/Blinky-Down-1.png"), createImage("images/Blinky/Blinky-Down-2.png")],
    [createImage("images/Blinky/Blinky-Left-1.png"), createImage("images/Blinky/Blinky-Left-2.png")]
    ]
  static #pinky = 
    [
    [createImage("images/Pinky/Pinky-Left-1.png"), createImage("images/Pinky/Pinky-Left-2.png")],
    [createImage("images/Pinky/Pinky-Up-1.png"), createImage("images/Pinky/Pinky-Up-2.png")],
    [createImage("images/Pinky/Pinky-Right-1.png"), createImage("images/Pinky/Pinky-Right-2.png")],
    [createImage("images/Pinky/Pinky-Down-1.png"), createImage("images/Pinky/Pinky-Down-2.png")],
    [createImage("images/Pinky/Pinky-Left-1.png"), createImage("images/Pinky/Pinky-Left-2.png")]
    ]
  static #inky = 
    [
    [createImage("images/Inky/Inky-Left-1.png"), createImage("images/Inky/Inky-Left-2.png")],
    [createImage("images/Inky/Inky-Up-1.png"), createImage("images/Inky/Inky-Up-2.png")],
    [createImage("images/Inky/Inky-Right-1.png"), createImage("images/Inky/Inky-Right-2.png")],
    [createImage("images/Inky/Inky-Down-1.png"), createImage("images/Inky/Inky-Down-2.png")],
    [createImage("images/Inky/Inky-Left-1.png"), createImage("images/Inky/Inky-Left-2.png")]
    ]
  static #clyde = 
    [
    [createImage("images/Clyde/Clyde-Left-1.png"), createImage("images/Clyde/Clyde-Left-2.png")],
    [createImage("images/Clyde/Clyde-Up-1.png"), createImage("images/Clyde/Clyde-Up-2.png")],
    [createImage("images/Clyde/Clyde-Right-1.png"), createImage("images/Clyde/Clyde-Right-2.png")],
    [createImage("images/Clyde/Clyde-Down-1.png"), createImage("images/Clyde/Clyde-Down-2.png")],
    [createImage("images/Clyde/Clyde-Left-1.png"), createImage("images/Clyde/Clyde-Left-2.png")]
    ]
  static #frightened = 
    [
    createImage("images/Ghost-Death/Dead-Blue-1.png"), createImage("images/Ghost-Death/Dead-Blue-2.png")
    ]
  static #ghostScores = 
    [
    createImage("images/Scores/200.png"), createImage("images/Scores/400.png"),createImage("images/Scores/800.png"), createImage("images/Scores/1600.png")
    ]
  static #ghostWidth = 
    [
    2, 2, 2, 2
    ]
  static #ghostHeight = 
    [
    1, 1, 1, 1
    ]
  static #fruit = 
    [
    createImage("images/Fruits/Cherry.png"), createImage("images/Fruits/Strawberry.png"), createImage("images/Fruits/Peach.png"), createImage("images/Fruits/Apple.png"), createImage("images/Fruits/Melon.png"), createImage("images/Fruits/GalaxianStarship.png"), createImage("images/Fruits/Bell.png"), createImage("images/Fruits/Key.png")
    ]
  static #fruitScores = 
    [
    createImage("images/Scores/100.png"), createImage("images/Scores/300.png"), createImage("images/Scores/500.png"), createImage("images/Scores/700.png"), createImage("images/Scores/1000.png"), createImage("images/Scores/2000.png"), createImage("images/Scores/3000.png"), createImage("images/Scores/5000.png")
    ]
  static #fruitWidth = [1.875, 1.875, 1.875, 2.25, 2.25, 2.25, 2.25, 2.25]
  static #fruitHeight = [1, 1, 1, 1, 1, 1, 1, 1]
  static #death = 
    [
    createImage("images/Pacman-Death/Pacman-Death-3.png"), createImage("images/Pacman-Death/Pacman-Death-4.png"), createImage("images/Pacman-Death/Pacman-Death-5.png"), createImage("images/Pacman-Death/Pacman-Death-6.png"), createImage("images/Pacman-Death/Pacman-Death-7.png"), createImage("images/Pacman-Death/Pacman-Death-8.png"), createImage("images/Pacman-Death/Pacman-Death-9.png"), createImage("images/Pacman-Death/Pacman-Death-10.png"), createImage("images/Pacman-Death/Pacman-Death-11.png"), createImage("images/Pacman-Death/Pacman-Death-12.png"), createImage("images/Pacman-Death/Pacman-Death-13.png")
    ]
  static #eaten = 
  [
    createImage("images/Ghost-Death/Eyes-Left.png"), createImage("images/Ghost-Death/Eyes-Up.png"), createImage("images/Ghost-Death/Eyes-Right.png"), createImage("images/Ghost-Death/Eyes-Down.png"), createImage("images/Ghost-Death/Eyes-Left.png")
  ]

  // Single Images
  static #dot = createImage("images/Dot.png")
  static #energizer = createImage("images/PowerPellet.png")
  static #lives = createImage("images/Pac-Man/Pacman-Left-1.png")
  static #invisible = createImage("images/Invisible.png")
  static #map = createImage("images/Pacman-Map.png")

  // Canvas
  canvas = null
  context = null

  // Temporary Images
  temporaryImages = []

  constructor(canvas) // Creates the canvas to draw on
  {
    this.canvas = canvas
    this.context = canvas.getContext("2d")
  }

  drawImage(image, x, y, w, h)
  {
    this.context.drawImage(image, x, y, w, h)
  }

  drawScore(score, x, y)
  {
    var image = null
    var w = null
    var h = null
    switch(score)
    {
      case(200):
        image = Canvas.#ghostScores[0]
        w = Canvas.#ghostWidth[0]
        h = Canvas.#ghostHeight[0]
        break
      case(400):
        image = Canvas.#ghostScores[1]
        w = Canvas.#ghostWidth[1]
        h = Canvas.#ghostHeight[1]
        break
      case(800):
        image = Canvas.#ghostScores[2]
        w = Canvas.#ghostWidth[2]
        h = Canvas.#ghostHeight[2]
        break
      case(1600):
        image = Canvas.#ghostScores[3]
        w = Canvas.#ghostWidth[3]
        h = Canvas.#ghostHeight[3]
        break
      case(100):
        image = Canvas.#fruitScores[0]
        w = Canvas.#fruitWidth[0]
        h = Canvas.#fruitHeight[0]
        break
      case(300):
        image = Canvas.#fruitScores[1]
        w = Canvas.#fruitWidth[1]
        h = Canvas.#fruitHeight[1]
        break
      case(500):
        image = Canvas.#fruitScores[2]
        w = Canvas.#fruitWidth[2]
        h = Canvas.#fruitHeight[2]
        break
      case(700):
        image = Canvas.#fruitScores[3]
        w = Canvas.#fruitWidth[3]
        h = Canvas.#fruitHeight[3]
        break
      case(1000):
        image = Canvas.#fruitScores[4]
        w = Canvas.#fruitWidth[4]
        h = Canvas.#fruitHeight[4]
        break
      case(2000):
        image = Canvas.#fruitScores[5]
        w = Canvas.#fruitWidth[5]
        h = Canvas.#fruitHeight[5]
        break
      case(3000):
        image = Canvas.#fruitScores[6]
        w = Canvas.#fruitWidth[6]
        h = Canvas.#fruitHeight[6]
        break
      case(5000):
        image = Canvas.#fruitScores[7]
        w = Canvas.#fruitWidth[7]
        h = Canvas.#fruitHeight[7]
        break
    }
    if (image !== null)
    {
      var bonusPoints = new TempImage(image, x, y, w, h)
      this.temporaryImages.push(bonusPoints)
      setTimeout(() => {this.temporaryImages.splice(this.temporaryImages.indexOf(bonusPoints), 1);}, 1000)
    }
  }

  currentImage(type) // Returns the current animation of 'object'
  {
    var object = null
    const animate = Map.animate
    for (var s of Ghost.ghosts)
    {
      if (s.type === type)
      {
        object = s
      }
    }
    for (var p of Pacman.sprites)
    {
      if (p.type === type)
      {
        object = p
      }
    }

    if (object instanceof Pacman) // If object is of type Pacman
    {
      if (!object.isDead && !Map.completedLevel || (object.x === object.startX && object.y === object.startY)) // If pacman is alive
      {
        return(Canvas.#pacman[object.direction][animate%2])
      }
      else // If pacman is dead
      {
        if (object.deathAnimate <= 10 && !Map.completedLevel) // If the death animation is on-going
        {
          return(Canvas.#death[object.deathAnimate])
        }
        else if ((object.x != object.startX && object.y != object.startY) || Map.completedLevel)// If the death animation ended
        {
          return(Canvas.#invisible)
        }
      }
    }
    else if (object instanceof Ghost && object.isEaten && !Map.completedLevel)
    {
      return(Canvas.#eaten[object.direction])
    }
    else if (object instanceof Ghost && (Map.normalMode || object.wasEaten)) // If mode is normal mode
    {
      switch (object.type) // Return the object image, assuming everything is nominal
      {
        case("Blinky"):
          return(Canvas.#blinky[object.direction][animate%2])
          break
        case("Pinky"):
          return(Canvas.#pinky[object.direction][animate%2])
          break
        case("Inky"):
          return(Canvas.#inky[object.direction][animate%2])
          break
        case("Clyde"):
          return(Canvas.#clyde[object.direction][animate%2])
          break
      }
    }
    else if (Map.frightenedMode && object instanceof Ghost) // If mode is scatter mode
    { 
      if (!object.isEaten && !object.wasEaten) // If ghost is alive 
      { 
        return(Canvas.#frightened[animate%2]) 
      }
      else // If ghost was eaten  
      { 
        return(Canvas.#eaten[object.direction]) 
      } 
    } 
  }

  drawObjects()
  {
    if (Map.loadedImageCount < 93)
    {
      return
    }
    
    var objects = [...Ghost.ghosts, ...Pacman.sprites, ...Powerup.powerups]
    this.drawImage(Canvas.#map, 0, 0, this.canvas.width, this.canvas.height)
    // If game/level has yet to start
    if (Map.gameReadyToPlay === true)
    {
      switch (Map.scale)
      {
        case(8):
          this.context.font = "15px Arial"
          break
        case(10):
          this.context.font = "15.75px Arial"
          break
        case(12):
          this.context.font = "16.5px Arial"
          break
        case(14):
          this.context.font = "17.25px Arial"
          break
        case(16):
          this.context.font = "18px Arial"
          break
      }
      this.context.fillStyle = "yellow"
      this.context.textAlign = "center"
      this.context.fillText("READY!", (14*Map.tileSize), (21*Map.tileSize))
    }
    // Filter through temporary image list
    for (var image of this.temporaryImages)
    {
      this.drawImage(image.image, image.x, image.y, image.w, image.h)
    }
    // Filter through object list
    for (var object of objects)
    {
      switch(object.type)
      {
        // Draw Ghosts
        case("Blinky"):
          this.drawImage(this.currentImage("Blinky"), object.x, object.y, object.width, object.height)
          break
        case("Pinky"):
          this.drawImage(this.currentImage("Pinky"), object.x, object.y, object.width, object.height)
          break
        case("Inky"):
          this.drawImage(this.currentImage("Inky"), object.x, object.y, object.width, object.height)
          break
        case("Clyde"):
          this.drawImage(this.currentImage("Clyde"), object.x, object.y, object.width, object.height)
          break
        // Draw Pacman
        case("Pacman"):
          this.drawImage(this.currentImage("Pacman"), object.x, object.y, object.width, object.height)
          var x = 2 // 4, 6, 8, 10 |
          var y = 34
          for (var i=0; i<object.lives; i++)
          {
            this.drawImage(Canvas.#pacman[4][0], x*Map.tileSize, y*Map.tileSize, object.width, object.height)
            x += 2
          }
          break
        // Draw Powerups (Dots, Energizers, & Fruit)
        case("Dot"):
          this.drawImage(Canvas.#dot, object.x, object.y, object.width, object.height)
          break
        case("Energizer"):
          this.drawImage(Canvas.#energizer, object.x, object.y, object.width, object.height)
          break
        case("Fruit"):
          var level = Map.level-1
          if (Map.level > 13) level = 12
          if (Fruit.isVisible && !Fruit.isEaten)
          {
            this.drawImage(Canvas.#fruit[level], object.x, object.y, object.width, object.height)
          }
          break
      }
    }
    // Draw Level Counter
    var x = 12 // 14, 16, 18, 20, 22, 24
    var y = 34.125
    for (var i=0; i<Fruit.counter.length; i++)
    {
      if (Fruit.counter[i] !== null)
      {
        this.drawImage(Canvas.#fruit[Fruit.counter[i]], x*Map.tileSize, y*Map.tileSize, 2*Map.tileSize, 2*Map.tileSize)
      }
      x += 2
    }
    // Draw Scores
    this.context.font = Map.tileSize*1.375+"px Arial";
    this.context.fillStyle = "white"
    this.context.textAlign = "start"
    this.context.fillText("1UP:  "+pacman.score, Map.tileSize*1, Map.tileSize*1.75);
    if (pacman.score > defaultHighscore.getValue() && pacman.score > classicHighscore.getValue())
    {
        this.context.fillText("HIGHSCORE:  "+pacman.score, Map.tileSize*12, Map.tileSize*1.75);
    }
    else
    {
      if (Map.gameMode === "Default")
      {
        this.context.fillText("HIGHSCORE:  "+defaultHighscore.getValue(), Map.tileSize*12, Map.tileSize*1.75);
      }
      else
      {
        this.context.fillText("HIGHSCORE:  "+classicHighscore.getValue(), Map.tileSize*12, Map.tileSize*1.75);
      }
    }
  }
}

var test = new Canvas(canvas)
var gMove = true
var pMove = true
function loop()
{
  test.drawObjects()
  if (!Map.correctSpeed)
  {
    updateSpeed(pacman)
    for (var ghost of Ghost.ghosts)
    {
      updateSpeed(ghost)
    }
    Map.correctSpeed = true
  }

  // The ghosts should move
  if (gMove)
  {
    Ghost.buffer(pacman.x, pacman.y, pacman.direction)
    Ghost.moveAll()
    gMove = false
    setTimeout(() => { gMove = true }, Ghost.getSpeed())
  }
  // If pacman should move
  if (pMove)
  {
    pacman.move()
    pMove = false
    setTimeout(() => { pMove = true }, pacman.getSpeed())
  }

  // If pacman is at its starting position
  if (pacman.x === pacman.startX && pacman.y === pacman.startY && Ghost.areInBox() && pacman.direction === 0)
  {
    Map.gameReadyToPlay = true
  }

  // If pacman eats an energizer
  if (Powerup.eatPowerups("Energizer", pacman.x, pacman.y) === 50)
  {
    pacman.score += Dot.eatEnergizer()
    Ghost.clearCache()
    Map.totalDots ++
  }

  // If the fruit should be made visible
  if (Powerup.powerups.length-1 < 122 && !Fruit.isDone && !Fruit.isVisible)
  {
    Fruit.startTimer()
  }
  // If pacman eats some fruit
  else if (Powerup.eatPowerups("Fruit", pacman.x, pacman.y) > 0 && !Fruit.isDone && Fruit.isVisible)
  {
    pacman.score += Fruit.eatFruit(Map.level)
    Map.totalFruit ++
  }
  
  // If the level was completed
  if (Map.completedLevel)
  {
    Ghost.levelUp(pacman)
  }
  // If pacman clears the map of all dots
  else if ((Powerup.powerups.length === 0 || (Powerup.powerups.length === 1 && Powerup.powerups[0].type === "Fruit")) && Map.completedLevel === false)
  {
    Map.level ++
    Map.completedLevel = true
    Map.correctSpeed = false
    Fruit.isVisible = false
    Fruit.isDone = true
    for (var ghost of Ghost.ghosts) ghost.exit = []
  }
  window.requestAnimationFrame(loop)
}

loop()
