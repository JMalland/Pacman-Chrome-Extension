class Element {
  element = null

  constructor(id, displayType)
  {
    this.element = document.getElementById(id)
    this.element.style.display = displayType
  }

  display(n)
  {
    this.element.style.display = n
  }

  getText()
  {
    return(String(this.element.innerHTML))
  }

  changeText(n)
  {
    this.element.innerHTML = n
  }

  isChecked()
  {
    return(this.element.checked)
  }

  setBackground(rgb)
  {
    this.element.style.backgroundColor = rgb
  }

  addListener(type, method)
  {
    this.element.addEventListener(type, method)
  }
}

// Main Document Stuff
const html = new Element("html", "table")
const body = new Element("body", "table-cell")

// Page Changing Buttons
const nextB = new Element("nextB", "none")
const prevB = new Element("previousB", "none")
const closeB = new Element("closeB", "none")

// Main Menu
const mainMenu = new Element("mainButtons", "block")
const playB = new Element("play", "block")
const statB = new Element("achievements", "block")
const optionB = new Element("settings", "block")

// Stats Menu
const statMenu = new Element("statsMenu", "none")
const statType = new Element("type", "block")
const statOne = new Element("descOne", "block")
const statTwo = new Element("descTwo", "block")
const statThree = new Element("descThree", "block")
const statFour = new Element("descFour", "block")

// Option Menu
const optionMenu = new Element("optionsMenu", "none")
const optionChangeMode = new Element("changeMode", "block")
const optionSwitch = new Element("switch", "none")
const optionMode = new Element("mode", "block")
const optionDesc = new Element("modeDesc", "block")
const optionLargeScale = new Element("scale", "block")
const optionScale = new Element("scaleSlider", "block")
const optionScaleSize = new Element("scalePer", "block")

// Stat Menu Values
var sValues = [ 
  ["Lifetime", totalGames, totalDots, totalFruit, totalGhosts],
  ["Default Mode", defaultHighscore, defaultHighLevel, empty, empty],
  ["Classic Mode", classicHighscore, classicHighLevel, empty, empty]]
var sText = [
  ["Games Played: ", "Dots Eaten: ", "Fruit Eaten: ", "Ghosts Eaten: "],
  ["Highest Score: ", "Highest Level: ", " ", " "],
  ["Highest Score: ", "Highest Level: ", " ", " "]]
// Option Menu Values
var oText = [
  ["Default Mode", "Simple gameplay where the speed stays constant."],
  ["Classic Mode", "Classic gameplay of the original 1980 Pac-Man."]]

// Screen Page Value
var page = 0
var screen = "Main"

// Page Switching Methods
function navButtons(on)
{
  nextB.display("none")
  prevB.display("none")
  closeB.display("none")
  if (on)
  {
    nextB.display("block")
    prevB.display("block")
    closeB.display("block")
  }
}

function statScreen()
{
  screen = "Stat"
  var pageNum = Math.abs((3+page)%3)
  statMenu.display("block")
  navButtons(true)
  statType.changeText(sValues[pageNum][0])
  statOne.changeText(sText[pageNum][0] + sValues[pageNum][1].getValue())
  statTwo.changeText(sText[pageNum][1] + sValues[pageNum][2].getValue())
  statThree.changeText(sText[pageNum][2] + sValues[pageNum][3].getValue())
  statFour.changeText(sText[pageNum][3] + sValues[pageNum][4].getValue())
}

function optionScreen()
{
  screen = "Option"
  var pageNum = Math.abs((2+page)%2)
  optionMenu.display("block")
  navButtons(true)

  if (pageNum === 0)
  {
    optionChangeMode.display("block")
    optionLargeScale.display("none")
  }
  else
  {
    optionChangeMode.display("none")
    optionLargeScale.display("block")
  }
  
  if (optionSwitch.isChecked())
  {
    optionMode.changeText(oText[1][0])
    optionDesc.changeText(oText[1][1])
    optionMode.setBackground("rgba(70, 128, 70, 0.85)")
    Map.gameMode = "Classic"
  }
  else
  {
    optionMode.changeText(oText[0][0])
    optionDesc.changeText(oText[0][1])
    optionMode.setBackground("rgba(225, 70, 70, 0.85)")
    Map.gameMode = "Default"
  }
}

function mainScreen()
{
  screen = "Main"
  mainMenu.display("block")
  navButtons(false)
  statMenu.display("none")
  optionMenu.display("none")
  page = 0
}

function gameScreen()
{
  screen = "Game"
  Map.startGame()
  mainScreen()
  mainMenu.display("none")
}

function updateScreen()
{
  switch(screen)
  {
    case("Stat"):
      statScreen()
      break
    case("Option"):
      optionScreen()
      break
    case("Main"):
      mainScreen()
      break
    case("Game"):
      gameScreen()
      break
  }
}

var scaleListener = null
function checkScale()
{
  if(this.value%25 === 0) 
  {
    if (scaleListener !== null)
    {
      scaleListener = this.removeEventListener("mouseup", function() 
      {
        adjustScreenSize(Math.ceil((this.value/100)*4)/4)
      })
      scaleListener = null
    }
	  optionScaleSize.changeText(""+this.value+"%")
    scaleListener = this.addEventListener("mouseup", () => {Map.setScale((this.value/100)*8)})
  }
}

// Nav Button Listeners
nextB.addListener("click", () => {page ++; updateScreen();})
prevB.addListener("click", () => {page --; updateScreen();})
closeB.addListener("click", mainScreen)

// Main Button Listeners
playB.addListener("click", gameScreen)
statB.addListener("click", statScreen)
optionB.addListener("click", optionScreen)

// Option Menu Listeners
optionSwitch.addListener("click", optionScreen)
optionScale.addListener("input", checkScale)
optionScale.addListener("change", checkScale)