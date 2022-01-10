class Dot extends Powerup {
  static #timer = null
  static #warning = null
  static #interval = null

  constructor(name, x, y, value, width, height)
  {
    super(name, x, y, value, width, height)
  }

  get timer() { return(Dot.#timer) }

  static eatEnergizer()
  {
    Dot.#timer = clearTimeout(Dot.#timer)
    Dot.#warning = clearTimeout(Dot.#warning)
    Dot.#interval = clearInterval(Dot.#interval)
    Map.frightened()
    Dot.#warning = setTimeout(() => { Dot.#interval = setInterval(() => { Ghost.flashWarning = !Ghost.flashWarning;}, 2000/(Ghost.totalFlashes*2)) }, 7990)
    Dot.#timer = setTimeout(() => { Dot.stopEnergizer(); }, 10000)
    return(50)
  }

  static stopEnergizer()
  {
    Map.normal()
    Ghost.clearGhostsEaten()
    Dot.#timer = clearTimeout(Dot.#timer)
    Dot.#interval = clearInterval(Dot.#interval)
    Dot.#warning = clearInterval(Dot.#warning)
    Ghost.flashWarning = false
  }

  static resetDots()
  {
    Powerup.powerups = []

    for (var row=0; row<Map.map.length; row++)
    {
      for (var col=0; col<Map.map[0].length; col++)
      {
        if (Map.getTile(row, col) === 1)
        {
          new Dot("Dot", col, row, 10, 1, 1)
        }
        else if (Map.getTile(row, col) === 2)
        {
          new Dot("Energizer", col, row, 50, 1, 1)
        }
      }
    }
  }
}

Dot.resetDots()
