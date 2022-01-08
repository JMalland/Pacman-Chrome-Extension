class Fruit extends Powerup {
  static isVisible = false
  static isEaten = false
  static isDone = false
  static #timer = null
  static value = [100, 300, 500, 700, 1000, 2000, 3000, 5000]
  static counter = [null, null, null, null, null, null, null]
  static placement = 7
  static count = 0

  constructor(name, x, y, index)
  {
    super(name, x-0.5, y-0.5, Fruit.value[index], 2, 2)
    Fruit.counter.shift()
    Fruit.counter[Fruit.counter.length] = Fruit.purchaseFruit(index) - 1
    Fruit.isEaten = false
    Fruit.isDone = false
    Fruit.isVisible = false
  }
  
  get timer() { return(Fruit.#timer) }

  static purchaseFruit(index)
  {
    var fruit = null
    index ++
    switch (index)
    {
      case(1):
        return(1)
        break
      case(2):
        return(2)
        break
      case(3):
      case(4):
        return(3)
        break
      case(5):
      case(6):
        return(4)
        break
      case(7):
      case(8):
        return(5)
        break
      case(9):
      case(10):
        return(6)
        break
      case(11):
      case(12):
        return(7)
        break
    }
    if (index >= 13)
    {
      return(8)
    }
  }

  static startTimer()
  {
    Fruit.#timer = clearTimeout(Fruit.#timer)
    Fruit.isVisible = true
    Fruit.#timer = setTimeout(() => { Fruit.isVisible = false; Fruit.isDone = true; Fruit.#timer = clearTimeout(Fruit.#timer); }, 10000)
  }

  static eatFruit(index)
  {
    Fruit.#timer = clearTimeout(Fruit.#timer)
    Fruit.isEaten = true
    Fruit.#timer = setTimeout(() => { Fruit.isVisible = false; Fruit.isDone = true; Fruit.#timer = clearTimeout(Fruit.#timer); }, 1000)
    test.drawScore(Fruit.value[index-1], 13.5+Map.xPowerupOffset, 17+Map.yPowerupOffset)
    return(Fruit.value[index-1])
  }

  static resetFruit()
  {
    //Fruit.counter = [null, null, null, null, null, null, null]
    new Fruit("Fruit", 13.5, 17, Map.level-1)
  }
}

Fruit.resetFruit()