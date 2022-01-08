class Powerup {
  type = null
  x = null
  y = null
  width = null
  height = null
  value = null
  static powerups = []

  constructor(type, x, y, value, width, height)
  {
    this.type = type
    this.x = (x + Map.xPowerupOffset) * Map.tileSize
    this.y = (y + Map.yPowerupOffset) * Map.tileSize
    this.width = width * Map.tileSize
    this.height = height * Map.tileSize
    this.value = value
    Powerup.powerups[Powerup.powerups.length] = this
  }

  static eatPowerups(type, x, y)
  {
    x -= (Map.xSpriteOffset*Map.tileSize)
    y -= (Map.ySpriteOffset*Map.tileSize)
    if (type === "Fruit")
    {
      x -= (0.5*Map.tileSize)
      y -= (0.5*Map.tileSize)
    }
    var value = 0
    for (var extra of Powerup.powerups)
    {
      if (extra.type === type)
      {
        var extraX = extra.x - (Map.xPowerupOffset*Map.tileSize)
        var extraY = extra.y - (Map.yPowerupOffset*Map.tileSize) 
        if (extraX === x && extraY === y)
        {
          value = extra.value
          Powerup.powerups.splice(Powerup.powerups.indexOf(extra), 1)
          return(value)
        }
      }
    }
    return(value)
  }
}