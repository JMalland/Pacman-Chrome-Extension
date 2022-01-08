AStarCell = function ()
{
    this.walkable = false;
    this.parent = null;
    this.g = 0;
    this.f = 0;
    this.x = 0;
    this.y = 0;
}

AStarGraph = function (width = 10, height = 10) 
{
    this.width = height;
    this.height = width;
    
    var x,y;
    
    AStarGraph.MAX_ITERATIONS = 1000;
    AStarGraph.SOLVED = "solved";
    AStarGraph.UNSOLVED = "unsolved";
    AStarGraph.INVALID_DESTINATION = "invalidDestination";
    AStarGraph.TOO_LONG = "tooLong";
    AStarGraph.NO_PATH = "noPath";
    
    this.mapArray = [];
    for (x = 0; x < this.width; x++) {
        this.mapArray[x] = [];
        for (y = 0; y < this.height; y++) {
        var cell = new AStarCell()
        cell.walkable = true;
        cell.parent = null;
        cell.g = 0;
        cell.f = 0;
        cell.x = x;
        cell.y = y; //use point instead??
        this.mapArray[x][y] = cell
        }
    }
    this.openSet = [];
    this.closedSet = [];
    
    
    this.sort = function (a, b) {
        if (a.f > b.f)
        return -1;
        if (a.f < b.f)
        return 1;
        return 0;
    }

    this.solve = function (origin, destination, orthogonal, ghost) {
      if (this.getCellAt(destination.x, destination.y).walkable === false)
      {
        var count = 0
        while (this.getCellAt(destination.x, destination.y).walkable === false && count < 250)
        {
          if (!(destination.x > 0))
            destination.x = 1
          else if (!(destination.x < this.height))
            destination.x = this.height-1
          if (destination.x > 14)
            destination.x --
            if (destination.y > 0)
              destination.y --
          else if (destination.x <= 14)
            destination.x ++
            if (destination.y < this.height-1)
              destination.y ++
          else if (destination.y > 13)
            destination.y --
            if (destination.x > 0)
              destination.x --
          else if (destination.y <= 13)
            destination.y --
            if (destination.x < this.width-1)
              destination.x ++
          if (!(destination.y > 0))
            destination.y = 1
          else if (!(destination.y < this.width))
            destination.y = this.width-1
          count ++
        }
        //console.log(destination.x+" "+destination.y)
      }
      
      fixCoordinates = function(coordinates)
      {
        if (coordinates.x < 0)
          for (x = 0; x < Math.abs(coordinates.x); x++) coordinates.x ++
        else if (coordinates.x >= this.width)
          for (x = 0; x < Math.abs(coordinates.x); x++) coordinates.x --
        if (coordinates.y < 0)
          for (y = 0; y < Math.abs(coordinates.y); y++) coordinates.y ++
        else if (coordinates.y >= this.height)
          for (y = 0; y < Math.abs(coordinates.y); y++) coordinates.y --
        if (coordinates.x < 0) coordinates.x = 0
        if (coordinates.y < 0) coordinates.y = 0
        if (coordinates.x >= this.width) coordinates.x = this.width-1
        if (coordinates.y >= this.height) coordinates.y = this.height-1
        return(coordinates)
      }
      
      destination = fixCoordinates(destination)
      origin = fixCoordinates(origin)

      if (destination.x < 0) destination.x = 0
      if (destination.y < 0) destination.y = 0
      if (destination.x >= this.width) destination.x = this.width-1
      if (destination.y >= this.height) destination.y = this.height-1
      
      this.originalDest = destination
      try {

        this.result={}
        this.origin = this.mapArray[origin.x][origin.y]
        this.destination = this.mapArray[destination.x][destination.y]
        this.orthogonal = orthogonal;
        this.fleeTarget = false

        if (!this.destination.walkable) {
        this.result.description = AStarGraph.INVALID_DESTINATION;
        return this.result;
        }
    
        if (this.destination.x == this.origin.x && this.destination.y == this.origin.y) {
        this.result.description = AStarGraph.INVALID_DESTINATION; // Changed from INVALID_DESTINATION
        return this.result;
        }
        this.current = this.origin;
        this.reset();
    
        var isSolved = false;
        var iter = 0;
    
        do {
        isSolved = this.stepPathfinder();
        if ((iter++ < AStarGraph.MAX_ITERATIONS && !this.fleeTarget) || (this.fleeTarget && iter++ < 500)) {
            isSolved = this.stepPathfinder();
        } else {
            isSolved = true;
            this.result.description = AStarGraph.TOO_LONG;
            return this.result;
        }
        } while (!isSolved)
    
        var solutionPath = []
    
        var cellPointer = this.closedSet[this.closedSet.length - 1];
        while(cellPointer != this.origin) {
        solutionPath.push(cellPointer);
        cellPointer = cellPointer.parent;
        }

        if(this.result.description != AStarGraph.SOLVED)
        return  this.result;

        this.result.description=AStarGraph.SOLVED
        this.result.path=solutionPath
        return this.result
    
      }
      catch(err)
      {
        console.log(err.message)
        console.log(this.origin)
        console.log(this.originalDest)
        console.log(this.originalDest)
      }
    }
    
    this.stepPathfinder = function () {
        if (this.current == this.destination) {
        this.result.description = AStarGraph.SOLVED;
        this.closedSet.push(this.destination);
        return true;
        }
    
        this.openSet.push(this.current);
        var adjacentCells = [];
        var neighbour
        var x = this.current.x;
        var y = this.current.y;
    
        if (!this.orthogonal) {
        for (x = -1; x <= 1; x++) {
            for (y = -1; y <= 1; y++) {
            if (!(x == 0 && y == 0)) {
                if (this.current.x + x >= 0 && this.current.y + y >= 0    && this.current.x + x < this.width && this.current.y +    y < this.height) {
                if (this.mapArray[this.current.x + x]   [this.current.y + y]) {
                    neighbour = this.mapArray[this.current.x + x]   [this.current.y + y];
                    if (neighbour.walkable &&     this.closedSet.indexOf(neighbour) == -1) {
                    adjacentCells.push(neighbour);
                    }
                }
                }
            }
            }
        }
        }
        else {//orthogonal
        if (x - 1 >= 0) {
            neighbour = this.mapArray[x - 1][y + 0];
            if (neighbour.walkable && this.closedSet.indexOf(neighbour) ==    -1) {
            adjacentCells.push(neighbour);
            }
        }
    
        if (y - 1 >= 0) {
            neighbour = this.mapArray[x + 0][y - 1];
            if (neighbour.walkable && this.closedSet.indexOf(neighbour) ==    -1) {
            adjacentCells.push(neighbour);
            }
        }
    
        if (x + 1 < this.width) {
            neighbour = this.mapArray[x + 1][y + 0];
            if (neighbour.walkable && this.closedSet.indexOf(neighbour) ==    -1) {
            adjacentCells.push(neighbour);
            }
        }
    
        if (y + 1 < this.height) {
            neighbour = this.mapArray[x + 0][y + 1];
            if (neighbour.walkable && this.closedSet.indexOf(neighbour) ==    -1) {
            adjacentCells.push(neighbour);
            }
        }
    
        }
        var g;
        var h;
        for (var i = 0; i < adjacentCells.length; i++) {
        g = this.current.g + 1;
        h = Math.abs(adjacentCells[i].x - this.destination.x) + Math.abs    (adjacentCells[i].y - this.destination.y);
        if (this.openSet.indexOf(adjacentCells[i]) == -1) {
            adjacentCells[i].f = g + h;
            adjacentCells[i].parent = this.current;
            adjacentCells[i].g = g;
            this.openSet.push(adjacentCells[i]);
    
        } else {
        
            if (adjacentCells[i].g < this.current.parent.g) {
            this.current.parent = adjacentCells[i];
            this.current.g = adjacentCells[i].g + 1;
            this.current.f = adjacentCells[i].g + h;
    
            }
        }
        }
    
        var currentIndex = this.openSet.indexOf(this.current);
        this.closedSet.push(this.current);
        this.openSet.splice(currentIndex, 1);
    
        if (this.openSet.length == 0) {
        this.result.description = AStarGraph.NO_PATH;
        return this.result;
        }
    
        this.openSet.sort(this.sort); //f desc
        this.current = this.openSet.pop();
    
        return false;
    }
    
    
    this.getCellAt = function (r, c) {

        if (r < 0)
          for (x = 0; x < Math.abs(x); x++) r ++
        else if (r > this.width-1)
          for (x = 0; x < Math.abs(r); x++) r --
        if (c < 0)
          for (y = 0; y < Math.abs(c); y++) c ++
        else if (c > this.height-1)
          for (y = 0; y < Math.abs(c); y++) c --

        if (r < 0) r = 0
        if (c < 0) c = 0
        if (r > this.width-1) r = this.width-1
        if (c > this.height-1) c = this.height-1

        var cell = this.mapArray[r][c];
        return cell
    }
    
    this.clear = function () {
        for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            var cell = this.mapArray[x][y];
            cell.walkable = true;
            cell.parent = null;
            cell.g = 0;
            cell.f = 0;
            cell.x = x;
            cell.y = y;
        }
        }
    }
    
    this.reset = function () {
        for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            var cell = this.mapArray[x][y]//AStarCell
            cell.parent = null;
            cell.g = 0;
            cell.f = 0;
        }
        }
        this.openSet = []
        this.closedSet = []
    }
}