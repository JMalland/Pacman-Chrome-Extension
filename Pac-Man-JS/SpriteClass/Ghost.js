class Ghost extends Sprites {
  loop = []
  loopPath = []
  exit = []
  exitPath = []
  movePath = []
  targetPos = null
  isEaten = false
  wasEaten = false
  isInBox = true
  frozen = true
  static flashWarning = false
  static totalFlashes = 0
  static #waitedForInky = false
  static #waitedForClyde = false
  static #waitedToExit = false
  static #killedPacman = false
  static #timer = null
  static #ghosts = []
  static #exitGhosts = []

  constructor(name, x, y, width, height, loopPath, exitPath)
  {
    super(name, x, y, width, height)
    this.loopPath = loopPath
    this.exitPath = exitPath
    Ghost.#ghosts[Ghost.#ghosts.length] = this
  }

  static get timer() { return(Ghost.#timer) }
  static get waitedForInky() { return(Ghost.#waitedForInky) }
  static get waitedForClyde() { return(Ghost.#waitedForClyde) }
  static get killedPacman() { return(Ghost.#killedPacman) }
  static get ghosts() { return(Ghost.#ghosts) }
  static get exitGhosts() { return(Ghost.#exitGhosts) }

  static set timer(n) { Ghost.#timer = n }
  static set waitedForInky(n) { Ghost.#waitedForInky = n }
  static set waitedForClyde(n) { Ghost.#waitedForClyde = n }
  static set killedPacman(n) { Ghost.#killedPacman = n }
  static set ghosts(n) { Ghost.#ghosts = n }
  static set exitGhosts(n) { Ghost.#exitGhosts = n }

  #determineDirection(x, y, direction, n)
  {
    var thisY = this.y - (Map.ySpriteOffset*Map.tileSize)
    var thisX = this.x - (Map.xSpriteOffset*Map.tileSize)

    if (!Ghost.#waitedToExit || (Math.floor(thisX/Map.tileSize) < 0 || Math.floor(thisX/Map.tileSize) > 27) || (Math.floor(thisX/Map.tileSize) > 27 || Math.floor(thisX/Map.tileSize) < 0))
    {
      return
    }

    var oldDirection = this.direction

    if (Math.floor(thisX/Map.tileSize) < 0 || Math.floor(thisX/Map.tileSize) > 27)
    {
      return
    }

    var targetPos = {x: 11, y: 9}

    var runLoopPath = function(obj)
    {
      if (obj.loop.length === 0)
      {
        obj.movePath = []
        obj.loop = obj.loopPath.slice()
      }
      else if (obj.loop.length > 0)
      {
        if (Math.floor(thisY/Map.tileSize) === obj.loop[0].x && Math.floor(thisX/Map.tileSize) === obj.loop[0].y)
        {
          obj.movePath = []
          targetPos = obj.loop.shift()
        }
        else
        {
          targetPos = obj.loop[0]
        }
      }
    }

    var shouldTakeTunnel = function(currentPos, targetPos)
    {
      if (Map.frightenedMode)
      {
        //If target near tunnel
        if (currentPos.x - targetPos.x < 5)
        {
          if (currentPos.y - targetPos.y > 12)
          {
            return({x: 14, y: 27})
          }
          else if (currentPos.y - targetPos.y < -12)
          {
            return({x: 14, y: 0})
          }
        }
      }
      else
      {
        if (targetPos.y >= 12 && targetPos.y <= 15 && targetPos.x >= 14)
        {
          return(targetPos)
        }
        else if (currentPos.x - targetPos.x < 20)
        {
          if (currentPos.y - targetPos.y > 7)
          {
            return({x: 14, y: 27})
          }
          else if (currentPos.y - targetPos.y < -7)
          {
            return({x: 14, y: 0})
          }
        }
      }
      return(targetPos)
    }
    
    if (Math.floor(thisX/Map.tileSize) < 0 || Math.floor(thisX/Map.tileSize) > 26) 
    {
      this.tunnel = true
    }
    else 
    {
      this.tunnel = false
      this.targetPos = null
      this.movePath = []
    }

    switch (this.type)
    {
      case("Blinky"):
        targetPos = {x: Math.floor(y/Map.tileSize), y: Math.floor(x/Map.tileSize)}
        break
      
      case("Clyde"):
        targetPos = {x: Math.floor(y/Map.tileSize), y: Math.floor(x/Map.tileSize)}
        if (((thisX > x - 4*Map.tileSize && thisY > y - 4*Map.tileSize) && (thisX < x + 4*Map.tileSize && thisY < y + 4*Map.tileSize)) || this.loop.length > 0)
        {
          runLoopPath(this)
        }
        break
      case("Pinky"):
        switch (direction)
        {
          case(1):
            targetPos = {x: Math.floor((y/Map.tileSize)-2), y: Math.floor((x/Map.tileSize)-2)}
            break
          case(2):
            var targetPos = {x: Math.floor((y/Map.tileSize)), y: Math.floor((x/Map.tileSize)+2)}
            break;
          case(3):
            var targetPos = {x: Math.floor((y/Map.tileSize)+2), y: Math.floor((x/Map.tileSize))}
            break;
          case(4):
            var targetPos = {x: Math.floor((y/Map.tileSize)), y: Math.floor((x/Map.tileSize)-2)}
            break;
        }
        break
      case("Inky"):
        var bX = Ghost.#ghosts[0].x - (Map.ySpriteOffset*Map.tileSize)
        var bY = Ghost.#ghosts[0].y - (Map.xSpriteOffset*Map.tileSize)
        switch (direction)
        {
          case(1):
            targetPos = {x: Math.floor((y - 2*Map.tileSize)/Map.tileSize), y: Math.floor((x - 2*Map.tileSize)/Map.tileSize)}
            break
          case(2):
            targetPos = {x: Math.floor(thisY/Map.tileSize), y: Math.floor((2*Math.sqrt(Math.pow((bX - (x + 2*Map.tileSize)), 2) + Math.pow((bY - y), 2)))/Map.tileSize)}
            break;
          case(3):
            targetPos = {x: Math.floor((2*Math.sqrt(Math.pow((bY - (y + 2*Map.tileSize)), 2) + Math.pow((bX - x), 2)))/Map.tileSize), y: Math.floor(thisX/Map.tileSize)}
            break;
          case(4):
            targetPos = {x: Math.floor(thisY/Map.tileSize), y: Math.floor((2*Math.sqrt(Math.pow((bX - (x - 2*Map.tileSize)), 2) + Math.pow((bY - y), 2)))/Map.tileSize)}
            break;
        }
        break
    }

    var solution = null
    var currentPos = {x: Math.floor(thisY/Map.tileSize), y: Math.floor(thisX/Map.tileSize)}

    // If ghost eaten 
    if (this.isEaten || Ghost.killedPacman || Map.frightenedMode)
    {
      // If in box
      if (Math.floor(thisX/Map.tileSize) === 14 && Math.floor(thisY/Map.tileSize) === 14)
      {
        if (this.type !== "Blinky" || (Map.completedLevel || pacman.isDead))
        {
          this.x = this.startX
          this.y = this.startY
        }
        else
        {
          this.x = (13.5+Map.xSpriteOffset)*Map.tileSize
          this.y = (14+Map.ySpriteOffset)*Map.tileSize
        }
        this.isEaten = false
        this.isInBox = true
        this.targetPos = null
        this.direction = 0
        this.movePath = []
        this.loop = []
        this.exit = []
        if (!pacman.isDead && !Map.completedLevel)
        {
          this.wasEaten = true
          if (this.type !== "Blinky")
          {
            this.exit = this.exitPath.slice()
          }
          else
          {
            this.exit = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  7, 7, 7, 7]
          }
          Ghost.startLeaving()
        }
        return
      }
      // If heading to box
      else if (this.isEaten || Ghost.killedPacman)
      {
        targetPos = {x: 14, y: 14}
        Map.graph.getCellAt(14, 14).walkable = true
        solution = Map.getSolution(currentPos, targetPos)
        this.movePath = Map.getCoordinates(solution)
        if (this.movePath.length > 0)
        {
          this.targetPos = this.movePath.shift()
        }
        Map.graph.getCellAt(14, 14).walkable = false
      }
      // If frightenedMode is active
      else if (Map.frightenedMode)
      {
        var pacX = Math.floor(x/Map.tileSize)
        var pacY = Math.floor(y/Map.tileSize)
        targetPos = null
        var pacQuadrant = 0
        var thisQuadrant = 0
        var targetQuadrant = 0
        
        if (pacX > 14)
        {
          if (pacY > 14)
          {
            pacQuadrant = 4
          }
          else
          {
            pacQuadrant = 2
          }
        }
        else
        {
          if (pacY > 14)
          {
            pacQuadrant = 3
          }
          else
          {
            pacQuadrant = 1
          }
        }

        if (thisX > 14)
        {
          if (thisY > 14)
          {
            thisQuadrant = 4
          }
          else
          {
            thisQuadrant = 2
          }
        }
        else
        {
          if (thisY > 14)
          {
            thisQuadrant = 3
          }
          else
          {
            thisQuadrant = 1
          }
        }

        switch(thisQuadrant)
        {
          case(1):
            if (pacQuadrant === 1)
            {
              switch (parseInt(Math.random()*2))
              {
                case(0):
                  targetQuadrant = 2
                  break
                case(1):
                  targetQuadrant = 3
                  break
                case(2):
                  targetPos = {x: 14, y: 0}
                  break
              }
            }
            else if (pacQuadrant === 2)
            {
              targetQuadrant = 3
            }
            else if (pacQuadrant === 3)
            {
              targetQuadrant = 2
            }
            else if (pacQuadrant === 4)
            {
              targetQuadrant = 1
            }
            break
          case(2):
            if (pacQuadrant === 1)
            {
              targetQuadrant = 4
            }
            else if (pacQuadrant === 2)
            {
              switch (parseInt(Math.random()*2))
              {
                case(0):
                  targetQuadrant = 2
                  break
                case(1):
                  targetQuadrant = 3
                  break
                case(2):
                  targetPos = {x: 14, y: 27}
                  break
              }
            }
            else if (pacQuadrant === 3)
            {
              targetQuadrant = 2
            }
            else if (pacQuadrant === 4)
            {
              targetQuadrant = 1
            }
            break
          case(3):
            if (pacQuadrant === 1)
            {
              targetQuadrant = 4
            }
            else if (pacQuadrant === 2)
            {
              targetQuadrant = 3
            }
            else if (pacQuadrant === 3)
            {
              switch (parseInt(Math.random()*2))
              {
                case(0):
                  targetQuadrant = 1
                  break
                case(1):
                  targetQuadrant = 4
                  break
                case(2):
                  targetPos = {x: 14, y: 0}
                  break
              }
            }
            else if (pacQuadrant === 4)
            {
              targetQuadrant = 1
            }
            break
          case(4):
            if (pacQuadrant === 1)
            {
              targetQuadrant = 4
            }
            else if (pacQuadrant === 2)
            {
              targetQuadrant = 3
            }
            else if (pacQuadrant === 3)
            {
              targetQuadrant = 2
            }
            else if (pacQuadrant === 4)
            {
              switch (parseInt(Math.random()*2))
              {
                case(0):
                  targetQuadrant = 3
                  break
                case(1):
                  targetQuadrant = 2
                  break
                case(2):
                  targetPos = {x: 14, y: 27}
                  break
              }
            }
            break
        }

        var xMinRange = ((targetQuadrant+1)%2)*14
        var xMaxRange = xMinRange+14
        var yMinRange = 0
        var yMaxRange = 14
        var i = 0
        
        switch(targetQuadrant)
        {
          case(0):
            return
            break
          case(1):
          case(2):
            yMinRange = 0
            yMaxRange = yMinRange+14
            break
          case(3):
          case(4):
            yMinRange = 15
            yMaxRange = yMinRange+14
            break
        }

        for (i=0; i<100; i++)
        {
          do
          {
            var row = parseInt(yMinRange + Math.random()*(yMaxRange-yMinRange))
            var column = parseInt(xMinRange + Math.random()*(xMaxRange-xMinRange))     
          } while(Map.graph.getCellAt(column, row).walkable === false || (Math.floor(thisX/Map.tileSize) === column && Math.floor(thisY/Map.tileSize) === row))
          targetPos = {x: row, y: column}
          targetPos = shouldTakeTunnel(currentPos, targetPos)
          solution = Map.getSolution(currentPos, targetPos)
          var movePath = Map.getCoordinates(solution)
          if (movePath.length > 0)
          {
            var fakeTargetPos = movePath.shift()
            this.#respondToMove(fakeTargetPos)
            if (!(this.direction-2 === oldDirection || this.direction+2 === oldDirection) || (targetPos.x === 14 && (targetPos.y === 0 || targetPos.y === 27)))
            {
              break
            }
          }
        }

        if (this.movePath.length === 0)
        {
          this.movePath = movePath
          this.targetPos = fakeTargetPos
        }
      }
    }
    
    if (Map.graph.getCellAt(targetPos.x, targetPos.y).walkable === false)
    {
      targetPos = {x: Math.floor(y/Map.tileSize), y: Math.floor(x/Map.tileSize)}
    }

    targetPos = shouldTakeTunnel(currentPos, targetPos)
    
    // If path empty    <= 'x' --> DIFFICULTY LEVEL
    if (this.movePath.length <= Map.gameDifficulty && !this.tunnel)
    {
      if (solution === null)
      {
        solution = Map.getSolution(currentPos, targetPos)
      }
      this.movePath = Map.getCoordinates(solution)

      if (this.movePath.length > 0)
      {
        this.targetPos = this.movePath.shift()
      }
      else
      {
        return
      }
    }
    // If available path
    else if (this.movePath.length > 0)
    {
      // Reached target
      if ((Math.floor(thisX/Map.tileSize) === this.targetPos.c && Math.floor(thisY/Map.tileSize) === this.targetPos.r) || (this.targetPos === null))
      {
        this.targetPos = this.movePath.shift()
      }
    }
    
    this.#respondToMove(this.targetPos)
    if (Math.abs(this.direction-oldDirection) === 2 && n < 100)
    {
      this.direction = oldDirection
      this.#determineDirection(x, y, direction, n+1)
    }
  }

  #respondToMove(thisTargetPos)
  {
    if (this.tunnel)
    {
      return
    }

    var x = this.x-(Map.xSpriteOffset*Map.tileSize)
    var y = this.y-(Map.ySpriteOffset*Map.tileSize)

    var targetX = thisTargetPos.c // 9
    var targetY = thisTargetPos.r // 12

    var actX = (x - (Map.tileSize*targetX))
    var actY = (y - (Map.tileSize*targetY))
    var relX = Math.abs(x - (Map.tileSize*targetX))
    var relY = Math.abs(y - (Map.tileSize*targetY))

    // Move LEFT / RIGHT
    if (relX > relY && !this.tunnel)
    {
      // Pacman to the LEFT
      if (actX > 0)
      {
        // Move LEFT
        if (!super.willHaveCollision(x, y, 4))
        {
          this.direction = 4
        }
        else
        {
          // Move DOWN
          if (actY < 0 && !super.willHaveCollision(x, y, 3))
          {
            this.direction = 3
          }
          // Move UP
          else if (actY > 0 && !super.willHaveCollision(x, y, 1))
          {
            this.direction = 1
          }
          // Move RIGHT
          else if (!super.willHaveCollision(x, y, 2))
          {
            this.direction = 2
          }
        }
      }
      // Pacman to the RIGHT
      else if (actX < 0)
      {
        // Move RIGHT
        if (!super.willHaveCollision(x, y, 2))
        {
          this.direction = 2
        }
        else
        {
          // Move UP
          if (actY > 0 && !super.willHaveCollision(x, y, 1))
          {
            this.direction = 1
          }
          // Move DOWN
          else if (actY < 0 && !super.willHaveCollision(x, y, 3))
          {
            this.direction = 3
          }
          // Move LEFT
          else if (!super.willHaveCollision(x, y, 4))
          {
            this.direction = 4
          }
        }
      }
    }
    // Move UP / DOWN
    else if (relY > relX && !this.tunnel)
    {
      // Pacman is ABOVE
      if (actY > 0)
      {
        // Move UP
        if (!super.willHaveCollision(x, y, 1))
        {
          this.direction = 1;
        }
        else
        {
          // Move RIGHT
          if (actX < 0 && !super.willHaveCollision(x, y, 2))
          {
            this.direction = 2;
          }
          // Move LEFT
          else if (actX > 0 && !super.willHaveCollision(x, y, 4))
          {
            this.direction = 4;
          }
          // Move DOWN
          else if (!super.willHaveCollision(x, y, 3))
          {
            this.direction = 3;
          }
        }
      }
      // Pacman is BELOW
      else if (actY < 0)
      {
        // Move DOWN
        if (!super.willHaveCollision(x, y, 3))
        {
          this.direction = 3;
        }
        else
        {
          // Move LEFT
          if (actX > 0 && !super.willHaveCollision(x, y, 4))
          {
            this.direction = 4;
          }
          // Move RIGHT
          else if (actX < 0 && !super.willHaveCollision(x, y, 2))
          {
            this.direction = 2;
          }
          // Move UP
          else if (!super.willHaveCollision(x, y, 1))
          {
            this.direction = 1;
          }
        }
      }
    }
  }

  #move()
  {
    if (!Ghost.#waitedToExit)
    {
      return
    }

    var thisX = this.x - (Map.xSpriteOffset*Map.tileSize)
    var thisY = this.y - (Map.ySpriteOffset*Map.tileSize)
    var pacX = Pacman.sprites[0].x - (Map.xSpriteOffset*Map.tileSize)
    var pacY = Pacman.sprites[0].y - (Map.ySpriteOffset*Map.tileSize)

    switch(Math.floor(thisX/Map.tileSize))
    {
      case(29):
        this.x = -1*Map.tileSize
        break
      case(-2):
        this.x = 27*Map.tileSize
        break 
    }

    for (var pacman of Pacman.sprites)
    {
      if ((thisX - 2*(Map.tileSize / 3) <  pacX && thisX + 2*(Map.tileSize / 3) > pacX) && (thisY - 2*(Map.tileSize / 3) < pacY && thisY + 2*(Map.tileSize / 3) > pacY))
      {
        if ((Map.normalMode || Map.scatterMode) || this.wasEaten)
        {
          if (!pacman.isDead)
          {
            pacman.getKilled()
            Ghost.killedPacman = true
            for (var ghost of Ghost.#ghosts) ghost.killedPacman = true
          }
        }
        else if (Map.frightenedMode && !this.isEaten && !this.wasEaten)
        {
          Ghost.consumeGhost(this.type)
          test.drawScore(pacman.ghostEaten(), Math.ceil(this.x/Map.tileSize), Math.ceil(this.y/Map.tileSize)-0.125)
        }
      }
    }

    if (!this.isInBox)
    {
      this.move()
    }
  }

  static consumeGhost(type)
  {
    for (var ghost of Ghost.#ghosts)
    {
      if (ghost.type === type && !ghost.isEaten && ghost.exit.length === 0)
      {
        ghost.isEaten = true
        ghost.movePath = []
        ghost.targetPos = null
      }
    }
  }

  static clearGhostsEaten()
  {
    for (var ghost of Ghost.#ghosts)
    {
      ghost.wasEaten = false
    }
    for (var pac of Pacman.sprites)
    {
      pac.ghostsEaten = 0
    }
  }

  static #exitHome()
  {
    var ghost = null
    
    if (Ghost.exitGhosts.length === 0)
    {
      Ghost.timer = clearInterval(Ghost.timer)
      return
    }

    if (Ghost.exitGhosts[0].exit.length > 0)
    {
      ghost = Ghost.exitGhosts[0] 
    }
    else
    {
      Ghost.exitGhosts.shift()
    }

    //if (ghost.type !== "Blinky" && ghost.type !== "Pinky" && ghost.type !== "Inky") return

    function move(object, direction)
    {
      switch (direction)
      {
        case(1):
          object.y -= 0.25 * (Map.tileSize);
          break;
        case(2):
          object.x += 0.25 * (Map.tileSize);
          break;
        case(3):
          object.y += 0.25 * (Map.tileSize);
          break;
        case(4):
          object.x -= 0.25 * (Map.tileSize);
          break;
        case(7):
          object.x -= 0.25 * (Map.tileSize / 2);
          break;
      }
    }
    if (ghost === null) return
    if (((ghost.type === "Blinky" || ghost.type === "Pinky") || ((ghost.type === "Inky" && Ghost.waitedForInky) || (ghost.type === "Clyde" && Ghost.waitedForClyde))) && (ghost.exit.length !== 0 && ghost.isInBox))
    {
      if (ghost.exit[0] !== 7) ghost.direction = ghost.exit[0]
      move(ghost, ghost.exit.shift())
      //ghost.exit = []
      if (ghost.exit.length === 0)
      {
        ghost.isInBox = false
        if (ghost.type === "Blinky")
        {
          if (Ghost.waitedForInky === false && Ghost.waitedForClyde === false)
          {
            setTimeout(function(){Ghost.waitedForInky = true}, 5000)
            setTimeout(function(){Ghost.waitedForClyde = true}, 15000)
          }
        }
        Ghost.exitGhosts.shift()
      }
    }
  }

  static startLeaving()
  {
    Ghost.#waitedToExit = true
    Ghost.exitGhosts = Ghost.#ghosts.slice()
    Ghost.timer = clearInterval(Ghost.timer)
    Ghost.timer = setInterval(Ghost.#exitHome, Ghost.getSpeed()*2)
  }

  static areInBox()
  {
    for(var ghost of Ghost.#ghosts)
    {
      if (!ghost.isInBox)
      {
        return(false)
      }
    }
    return(true)
  }

  static buffer(x, y, direction)
  {
    x -= Map.xSpriteOffset * Map.tileSize
    y -= Map.ySpriteOffset * Map.tileSize
    for (var ghost of Ghost.#ghosts)
    {
      if (!ghost.isInBox)
      {
        ghost.#determineDirection(x, y, direction, 0)
      }
    }
  }

  static moveAll()
  {
    if (Map.gameRunning && Ghost.areInBox() && pacman.lives === 0)
    {
      Map.stopGame()
      setTimeout(()=> {mainMenu.display("block")}, 1000)
      Dot.resetDots()
      Fruit.counter = [null, null, null, null, null, null, null]
      Fruit.resetFruit()
      pacman.lives = 3
      Ghost.waitedToExit = false
      for (var ghost of Ghost.#ghosts)
      {
        if (ghost.type === "Inky")
        {
          Ghost.waitedForInky = false
        }
        else if (ghost.type === "Clyde")
        {
          Ghost.waitedForClyde = false
        }
      }
      return
    }
    for (var ghost of Ghost.#ghosts)
    {
      // If dead, have ghosts navigate to the center
      if (pacman.isDead || Map.completedLevel)
      {
        if ((ghost.x === ghost.startX && ghost.y === ghost.startY) && ghost.isInBox && ghost.exit.length === 0)
        {
          ghost.isEaten = false
          ghost.wasEaten = false
        }
        else if (ghost.isInBox && ghost.exit.length !== 0)
        {
          ghost.x = ghost.startX
          ghost.y = ghost.startY
          ghost.exit = []
        }
        else if (!(ghost.x === ghost.startX && ghost.y === ghost.startY) && Map.completedLevel)
        {
          ghost.isInBox = false
          Ghost.consumeGhost(ghost.type)
        }
      }
      // If all ghosts are in the center, allow ghost & pacman to move again
      else if (!pacman.isDead && !Map.completedLevel && ghost.isInBox && ghost.exit.length === 0)
      {
        ghost.exit = ghost.exitPath.slice()
      }
      // Move the ghosts
      ghost.#move()
      // Move again if needed
      if (ghost.isEaten || pacman.isDead || Map.completedLevel && !ghost.isInBox) // Changed for Issue
      {
        ghost.#determineDirection(pacman.x, pacman.y, pacman.direction, 0)
        ghost.#move()
      }
    }
  }

  static levelUp(pac)
  {
    for (var ghost of Ghost.ghosts)
    {
      if (!ghost.isInBox)
      {
        return
      }
    }
    Map.normal()
    Ghost.waitedToExit = false
    Ghost.waitedForInky = false
    Ghost.waitedForClyde = false
    Map.completedLevel = false
    Dot.resetDots()
    Fruit.resetFruit()
    pac.x = pac.startX
    pac.y = pac.startY
    pac.direction = 0

  }

  static getSpeed()
  {
    if (Map.normalMode || Map.scatterMode)
    {
      return(Ghost.ghosts[0].speed)
    }
    else
    {
      return(Ghost.ghosts[0].frightSpeed)
    }
  }

  static clearCache()
  {
    for (var ghost of Ghost.ghosts)
    {
      if (!ghost.tunnel)
      {
        ghost.targetPos = null
      }
      ghost.movePath = []
      ghost.loop = []
    }
  }
}

function keyPressed(event)
{
  if (Map.gameRunning && pacman.direction === 0 && !Ghost.waitedToExit && (pacman.x === pacman.startX && pacman.y === pacman.startY) && Ghost.areInBox() && ((event.keyCode === 68 || event.keyCode === 39) || (event.keyCode === 65 || event.keyCode === 37)))
  {
    pacman.isDead = false
    Ghost.killedPacman = false
    for (var ghost of Ghost.ghosts) ghost.killedPacman = false
    Ghost.startLeaving()
    Map.gameReadyToPlay = false
  }
  else if (pacman.isDead || !Map.gameRunning)
  {
    return
  }

  // Right
  if (event.keyCode === 68 || event.keyCode === 39)
  {
    if (pacman.direction === 4 || pacman.direction === 0)
    {
      pacman.direction = 2;
    }
    pacman.wantedDirection = 2;
  }
  // Left
  else if (event.keyCode === 65 || event.keyCode === 37)
  {
    if (pacman.direction === 2 || pacman.direction === 0)
    {
      pacman.direction = 4;
    }
    pacman.wantedDirection = 4;
  }
  // Down
  else if (event.keyCode === 83 || event.keyCode === 40)
  {
    if (pacman.direction === 1)
    {
      pacman.direction = 3;
    }
    pacman.wantedDirection = 3;
  }
  // Up
  else if (event.keyCode === 87 || event.keyCode === 38)
  {
    if (pacman.direction === 3)
    {
      pacman.direction = 1;
    }
    pacman.wantedDirection = 1;
  }
}

var bLoop = [{x: 1, y: 21}, {x: 1, y: 26}, {x: 5, y: 22}]
var bExit = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7]

var pLoop = [{x: 1, y: 6}, {x: 1, y: 1}, {x: 5, y: 5}]
var pExit = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  7, 7, 7, 7]

var iLoop = [{x: 29, y: 26}, {x: 29, y: 15}, {x: 23, y: 20}]
var iExit = [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7]

var cLoop = [{x: 29, y: 1}, {x: 26, y: 12}, {x: 23, y: 9}, {x: 29, y: 1}]
var cExit = [4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 7, 7, 7, 7]

const b = new Ghost('Blinky', 13.5, 11, 2, 2, bLoop, bExit, 8) // Blinky
const p = new Ghost('Pinky', 13.5, 14, 2, 2, pLoop, pExit,  8) // Pinky
const i = new Ghost('Inky', 11.5, 14, 2, 2, iLoop, iExit, 8) // Inky
const c = new Ghost('Clyde', 15.5, 14, 2, 2, cLoop, cExit, 8) // Clyde

b.exit = b.exitPath.slice()
p.exit = p.exitPath.slice()
i.exit = i.exitPath.slice()
c.exit = c.exitPath.slice()

window.addEventListener("keydown", keyPressed)
