class Pacman extends Sprites {
  wantedDirection = null
  isDead = false
  ghostsEaten = 0
  lives = 3
  score = 0
  bonusScore = 0
  deathAnimate = 0
  static sprites = []
  timer = null

  constructor(name, x, y, width, height) {
    super(name, x, y, width, height)
    Pacman.sprites[Pacman.sprites.length] = this
  }

  move() 
  {
    var thisX = Math.floor((this.x - (Map.xSpriteOffset * Map.tileSize)) / Map.tileSize)
    var thisY = Math.floor((this.y - (Map.ySpriteOffset * Map.tileSize)) / Map.tileSize)
    if (this.isDead) {
      return
    }

    if ((thisX < 0 || thisX > 26) && thisY === 14) {
      this.tunnel = true
    }
    else {
      this.tunnel = false
    }

    if ((thisX === -2 || thisX === 28) && thisY === 14)
    {
      if (thisX=== -2)
      {
        this.x = 27*Map.tileSize
      }
      else
      {
        this.x = -1*Map.tileSize
      }
    }

    super.move(this)
  }

  getKilled() 
  {
    if (this.lives === 1 && !Map.completedLevel)
    {
      // Default Mode Scores
      if (Map.gameMode === "Default")
      {
        if (defaultHighscore.getValue() < this.score)
        {
          defaultHighscore.setValue(this.score)
        }
        if (defaultHighLevel.getValue() < Map.level)
        {
          defaultHighLevel.setValue(Map.level)
        }
      }
      // Classic Mode Scores
      else
      {
        if (classicHighscore.getValue() < this.score)
        {
          classicHighscore.setValue(this.score)
        }
        if (classicHighLevel.getValue() < Map.level)
        {
          classicHighLevel.setValue(Map.level)
        }
      }
      totalGames.changeValue(Map.totalGames)
      totalDots.changeValue(Map.totalDots)
      totalFruit.changeValue(Map.totalFruit)
      totalGhosts.changeValue(Map.totalGhosts)
      this.score = 0
      this.bonusScore = 0
    }
    if (this.timer === null)
    {
      Map.normal()
      this.isDead = true
      this.lives -= 1
      this.deathAnimate = 0
      this.timer = setInterval(() => { if (this.deathAnimate < 10) { this.deathAnimate ++; } else { this.timer = clearInterval(this.timer); this.timer = null; this.x = this.startX; this.y = this.startY; this.deathAnimate = 0; Map.normal(); this.direction = 0; } }, 150)
    }
  }

  runDeathAnimation()
  {
    if (this.deathAnimate < 10)
    {
      this.deathAnimate ++
    }
    else
    {
      this.timer = clearInterval(this.timer)
    }
  }

  ghostEaten() 
  {
    this.ghostsEaten ++
    this.score += Math.pow(2, this.ghostsEaten) * 100
    this.bonusScore += Math.pow(2, this.ghostsEaten) * 100
    Map.totalGhosts ++
    return(Math.pow(2, this.ghostsEaten) * 100)
  }

  getSpeed()
  {
    if (this.isDead || !Map.gameRunning)
    {
      return
    }
    else if (this.bonusScore >= 10000)
    {
      this.lives ++
      this.bonusScore -= 10000
    }

    if (Powerup.eatPowerups("Dot", this.x, this.y) === 10)
    {
      this.score += 10
      this.bonusScore += 10
      Map.totalDots ++
      if (Map.normalMode || Map.scatterMode)
      {
        return(this.dotsSpeed)
      }
      else
      {
        return(this.frightDotsSpeed)
      }
    }
    else if (Map.normalMode || Map.scatterMode)
    {
      return(this.speed)
    }
    else
    {
      return(this.frightSpeed)
    }
    return(1)
  }
}

const pacman = new Pacman("Pacman", 13.5, 23, 2, 2)