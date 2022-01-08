class Sprites {
  type = null
  direction = 0
  wantedDirection = 0
  tunnel = false
  speed = 1
  dotsSpeed = 1
  frightSpeed = 1
  frightDotsSpeed = 1
  x = null
  y = null
  startX = null
  startY = null
  width = null
  height = null

  constructor(name, x, y, width, height)
  {
    this.type = name
    this.direction = 0
    this.x = (x + Map.xSpriteOffset) * Map.tileSize
    this.y = (y + Map.ySpriteOffset) * Map.tileSize
    this.startX = (x + Map.xSpriteOffset) * Map.tileSize
    this.startY = (y + Map.ySpriteOffset) * Map.tileSize
    this.width = width*Map.tileSize
    this.height = height*Map.tileSize
    
    if (name === "Dot" || name === "Energizer")
    {
      this.x = (Map.xDotOffset + x)*Map.tileSize
      this.y = (Map.yDotOffset + y)*Map.tileSize
    }
  }

  move()
  {
    if (this instanceof Ghost || this instanceof Pacman)
    {
      var x = this.x - (Map.xSpriteOffset*Map.tileSize)
      var y = this.y - (Map.ySpriteOffset*Map.tileSize)
    }
    else
    {
      return
    }

    if (this instanceof Ghost)
    {
      if (Math.floor(x/Map.tileSize) === 13 && Math.floor(y/Map.tileSize) === 13)
      {
        this.isInBox = true
        this.movePath = []
        this.loop = []
        this.targetPos = null
        return
      }
    }

    if (Number.isInteger(x/Map.tileSize) && Number.isInteger(y/Map.tileSize))
    {
      if (this.willHaveCollision(x, y, this.wantedDirection) === false)
      {
        this.direction = this.wantedDirection
      }
      else if (this.willHaveCollision(x, y, this.direction) === true)
      {
        return
      }
    }

    switch (this.direction)
    {
      case(1):
        this.y -= 1 * (Map.tileSize / 8)
        break;
      case(2):
        this.x += 1 * (Map.tileSize / 8)
        break;
      case(3):
        this.y += 1 * (Map.tileSize / 8)
        break;
      case(4):
        this.x -= 1 * (Map.tileSize / 8)
        break;
    }
  }

  willHaveCollision(x, y, direction)
  {
    if ((direction === null || direction === 0) || ((direction === 3 || direction === 1) && this.tunnel))
    {
      return(true)
    }

    if (Number.isInteger(( x / Map.tileSize)) && Number.isInteger(( y / Map.tileSize)))
    {
      let nextRow = 0
      let row = 0
      let nextColumn = 0
      let column = 0
      switch (direction)
      {
        case(1):
          row = (y - Map.tileSize) / Map.tileSize
          column =  x / Map.tileSize
          break
        case(2):
          column = (x + Map.tileSize) / Map.tileSize
          row =  y / Map.tileSize
          break  
        case(3):
          row = (y + Map.tileSize) / Map.tileSize
          column =  x / Map.tileSize
          break
        case(4):
          column = (x - Map.tileSize) / Map.tileSize
          row =  y / Map.tileSize
          break
        case(0):
          //console.log("stuck")
          row =  y / Map.tileSize
          column =  x / Map.tileSize
      }
      //console.log("Help")
      const tile = Map.map[row][column]

      if (this instanceof Ghost)
      {
        //console.log("Ghost")
      }

      if ((this instanceof Pacman) || (this instanceof Ghost && (!this.isInBox && !this.isEaten && !this.killedPacman)))
      {
        //console.log(this.type+" "+this.direction)
        return(tile >= 3)
      }
      else if (this instanceof Ghost && (this.isInBox || this.isEaten || this.killedPacman))
      {
        //console.log(this.type+" "+this.direction)
        return(tile === 3)
      }
    }
    return true
  }
}