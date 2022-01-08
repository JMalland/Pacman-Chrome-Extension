class Item {
  #id = null

  constructor(id, value)
  {
    this.#id = id
    if (this.getValue() === null)
    {
      localStorage.setItem(this.#id, value)
    }
  }

  getValue()
  {
    if (Number.isInteger(parseInt(localStorage.getItem(this.#id))))
    {
      return(parseInt(localStorage.getItem(this.#id)))
    }
    return(localStorage.getItem(this.#id))
  }

  changeValue(n)
  {
    if (Number.isInteger(n))
    {
      localStorage.setItem(this.#id, (parseInt(localStorage.getItem(this.#id))+n))
    }
    else
    {
      localStorage.setItem(this.#id, localStorage.getItem(this.#id)+n)
    }
    return(this.getValue())
  }

  setValue(n)
  {
    localStorage.setItem(this.#id, n)
  }
}

const totalGames = new Item('totalGames', 0)
const totalDots = new Item('totalDots', 0)
const totalFruit = new Item('totalFruit', 0)
const totalGhosts = new Item('totalGhosts', 0)
const defaultHighscore = new Item('defaultHighscore', 0)
const defaultHighLevel = new Item('defaultHighLevel', 0)
const classicHighscore = new Item('classicHighscore', 0)
const classicHighLevel = new Item('classicHighLevel', 0)
const empty = new Item('empty', " ")