class Map {
  static #body = document.getElementsByTagName("body")[0]
  static #html = document.getElementsByTagName("html")[0]
  static totalGames = 0
  static totalDots = 0
  static totalFruit = 0
  static totalGhosts = 0
  static defaultHScore = 0
  static defaultHLevel = 0
  static classicHScore = 0
  static classicHLevel = 0
  static normalMode = true
  static scatterMode = false
  static frightenedMode = false
  static gameReadyToPlay = true
  static completedLevel = false
  static correctSpeed = false
  static gameMode = "Default"
  static gameRunning = false
  static gameDifficulty = 0
  static tileSize = 0
  static scale = 0
  static animate = 1
  static animation = null
  static maxSpeed = 0
  static canvas = null
  static context = null
  static level = 1
  static map = 
  [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,3],
    [3,1,3,3,3,3,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,3],
    [3,2,3,3,3,3,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,2,3],
    [3,1,3,3,3,3,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,3],
    [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
    [3,1,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,3,1,3,3,1,3,3,3,3,1,3],
    [3,1,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,3,1,3,3,1,3,3,3,3,1,3],
    [3,1,1,1,1,1,1,3,3,1,1,1,1,3,3,1,1,1,1,3,3,1,1,1,1,1,1,3],
    [3,3,3,3,3,3,1,3,3,3,3,3,0,3,3,0,3,3,3,3,3,1,3,3,3,3,3,3],
    [3,3,3,3,3,3,1,3,3,3,3,3,0,3,3,0,3,3,3,3,3,1,3,3,3,3,3,3],
    [3,3,3,3,3,3,1,3,3,0,0,0,0,0,0,0,0,0,0,3,3,1,3,3,3,3,3,3],
    [3,3,3,3,3,3,1,3,3,0,3,3,3,4,4,3,3,3,0,3,3,1,3,3,3,3,3,3],
    [3,3,3,3,3,3,1,3,3,0,3,3,3,4,4,3,3,3,0,3,3,1,3,3,3,3,3,3],
   [-1,0,0,0,0,0,1,0,0,0,3,3,4,4,4,4,3,3,0,0,0,1,0,0,0,0,0,-1],
    [3,3,3,3,3,3,1,3,3,0,3,3,3,3,3,3,3,3,0,3,3,1,3,3,3,3,3,3],
    [3,3,3,3,3,3,1,3,3,0,3,3,3,3,3,3,3,3,0,3,3,1,3,3,3,3,3,3],
    [3,3,3,3,3,3,1,3,3,0,0,0,0,0,0,0,0,0,0,3,3,1,3,3,3,3,3,3],
    [3,3,3,3,3,3,1,3,3,0,3,3,3,3,3,3,3,3,0,3,3,1,3,3,3,3,3,3],
    [3,3,3,3,3,3,1,3,3,0,3,3,3,3,3,3,3,3,0,3,3,1,3,3,3,3,3,3],
    [3,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,3],
    [3,1,3,3,3,3,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,3],
    [3,1,3,3,3,3,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,3],
    [3,2,1,1,3,3,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,3,3,1,1,2,3],
    [3,3,3,1,3,3,1,3,3,1,3,3,3,3,3,3,3,3,1,3,3,1,3,3,1,3,3,3],
    [3,3,3,1,3,3,1,3,3,1,3,3,3,3,3,3,3,3,1,3,3,1,3,3,1,3,3,3],
    [3,1,1,1,1,1,1,3,3,1,1,1,1,3,3,1,1,1,1,3,3,1,1,1,1,1,1,3],
    [3,1,3,3,3,3,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,3,3,3,1,3],
    [3,1,3,3,3,3,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,3,3,3,1,3],
    [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  ]
  static xSpriteOffset = 0
  static ySpriteOffset = 0
  static xPowerupOffset = 0
  static yPowerupOffset = 0
  static graph = new AStarGraph(28, 31)

  static initialize()
  {
    Map.canvas = canvas
    Map.context = canvas.getContext("2d")
    Map.canvas.width = 224
    Map.canvas.height = 292
    
    // Set pathfinding info
    for (var y=0; y<Map.map.length; y++)
    {
      for (var x=0; x<Map.map[0].length; x++)
      {
        if (Map.map[y][x] === 3)
        {
          Map.graph.getCellAt(y, x).walkable = false;
        }
        else
        {
          Map.graph.getCellAt(y, x).walkable = true;
        }
      }
    }
  }

  static applySize(elem, width, height) 
  {
    elem.style.width = `${width}px`;
    elem.style.height = `${height}px`;
  }

  static applyWidth(elem, width) 
  {
    elem.style.width = `${width}px`;
  }

  static setScale(n) 
  {
    Map.scale = n
    document.getElementsByTagName("html")[0].style.display = "none"
    Map.applyWidth(document.getElementsByTagName("html")[0], 28*n)
    Map.applySize(document.getElementsByTagName("body")[0], 28*n, 36.5*n)
    Map.applySize(document.getElementById("canvas"), 28*n, 36.5*n)
    document.getElementsByTagName("html")[0].style.height = ""+(6.25*n)+"%"
    document.getElementsByTagName("html")[0].style.display = "block"
  }

  static getSolution(currentPos, targetPos)
  {
    return(Map.graph.solve(currentPos, targetPos, true))
  }

  static getCoordinates(solution)
  {
    if (solution.description !== AStarGraph.SOLVED || solution.path === null) return([])
      
    var movesToMake = []
    if (solution.description === AStarGraph.SOLVED)
    {
      for (var s=0; s<solution.path.length; s++)
      {
        movesToMake[solution.path.length - 1 - s] = {r: solution.path[s].x, c: solution.path[s].y}
      }
    }
    else
    {
      for (var s=0; s<solution.length; s++)
      {
        movesToMake[solution.length - 1 - s] = {r: solution[s].r, c: solution[s].c}
      }
    }
    return(movesToMake)
  }

  static getTile(r, c)
  {
    return(Map.map[r][c])
  }

  static normal()
  {
    Map.normalMode = true
    Map.scatterMode = false
    Map.frightenedMode = false
  }

  static frightened()
  {
    Map.normalMode = false
    Map.scatterMode = false
    Map.frightenedMode = true
  }

  static scatter()
  {
    Map.normalMode = false
    Map.scatterMode = true
    Map.frightenedMode = false
  }

  static startGame()
  {
    Map.gameRunning = true
    Map.totalGames = 1
  }

  static stopGame()
  {
    Map.gameRunning = false
    Map.level = 1
    Map.totalGames = 0
    Map.totalDots = 0
    Map.totalFruit = 0
    Map.totalGhosts = 0
    Map.defaultHScore = 0
    Map.defaultHLevel = 0
    Map.classicHScore = 0
    Map.classicHLevel = 0
  }

  static startAnimation()
  {
    Map.animation = setInterval(() => {Map.animate ++; if (Map.animate%2 === 0) { Map.animate = 0; }}, 150)
  }

  static stopAnimation()
  {
    Map.animation = clearInterval(Map.animation)
  }
}

const canvas = document.getElementById("canvas")

Map.initialize()
Map.setScale(8)
Map.tileSize = 8
Map.maxSpeed = 12
Map.normalMode = true
Map.scatterMode = false
Map.gameMode = "Default"
Map.gameDifficulty = 0
Map.xSpriteOffset = -0.5
Map.ySpriteOffset = 2.25
Map.xPowerupOffset =  0
Map.yPowerupOffset = 2.75
Map.gameRunning = false
setInterval(() => {Map.animate ++}, 150)

// 47+84+47+1006+151+145+314+567+49+221 + 213 = 2844 Lines