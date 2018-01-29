// main.js file for client-side game

function main () {

  //create welcome div
  const text = document.createElement("div")
  text.className = "intro"
  text.appendChild(document.createTextNode("Welcome to Blackjack"))
  console.log(document.querySelector("body"))
  document.querySelector("body").insertBefore(text, document.getElementsByClassName('start')[0])

  const submitButton = document.querySelector('.playBtn')

  submitButton.addEventListener('click', function (event) {
    text.classList.toggle('hide')
    event.preventDefault()
    document.querySelector('.start').classList.toggle('hide')
    //
    let startingCards = document.getElementById('startValues').value
    const deck = generateDeck() // create our deck of cards
    shuffle(deck) // shuffle our deck

    // handle user input
    startingCards = inputParser(startingCards)
    putOnTopofDeck(startingCards, deck)

    // create user hand and computer hand
    const userHand = []
    const computerHand = []

    // deal first 4 cards to initiate game, alternating from comp to user
    computerHand.push(deck.pop())
    userHand.push(deck.pop())
    computerHand.push(deck.pop())
    userHand.push(deck.pop())

    // all our game will go inside this div
    const game = document.getElementsByClassName('game')

    // create our computer element
    const computerElement = deckElementCreator('computerElement', computerHand)
    game[0].appendChild(computerElement) // add our comp element to our game div

    // create our user element
    const userElement = deckElementCreator('userElement', userHand)
    game[0].appendChild(userElement) // add our user element to our game div

    // Create elements to represent computer and user score
    const computerTotal = getScoreElementCreator('computer', computerHand)
    const userTotal = getScoreElementCreator('user', userHand)

    // insert them in the dom above each player hand
    game[0].insertBefore(computerTotal, computerElement)
    game[0].insertBefore(userTotal, userElement)

    // create our user hit and stand buttons
    const hit = buttonElementCreator('HIT')
    const stay = buttonElementCreator('stay')

    // combine these two buttons in to a div element and add it to the game div
    const buttonField = getButtonField(hit, stay)
    game[0].appendChild(buttonField)

    // user HITS, deal a card, update total
    hit.addEventListener('click', function () {
      const dealt = deck.pop()
      userHand.push(dealt)
      userElement.appendChild(createCardElement(dealt))
      updateTotal(userTotal, userHand, 'user', game)
    })

    // If user stays, dealer will draw until they reach 17 minimum
    // Then the totals are calculated and the winner is determined
    stay.addEventListener('click', function () {
      // flip computer hidden card over
      console.log(document.getElementsByClassName('hiddencard')[0])
      document.getElementsByClassName('hiddencard')[0].style.backgroundImage = document.getElementsByClassName('hiddencard')[0].id
      // document.getElementsByClassName("hiddencard")[0].classList.toggle("cardDisplayHidden");
      document.getElementsByClassName('hiddencard')[0].classList.toggle('cardDisplay')
      // If the computer has less than 21 draw a card
      let compScore = calculateTotal(computerHand)

      // display total if computer has hand greater than 17 since we aren't hitting after this
      if (compScore >= 17) {
        updateTotal(computerTotal, computerHand, 'computer', game)
      }

      while (compScore <= 17) {
        // deal another card and add it to computers hand
        const dealt = deck.pop()
        computerHand.push(dealt)
        computerElement.appendChild(createCardElement(dealt))

        // update computers score
        updateTotal(computerTotal, computerHand, 'computer', game)
        compScore = calculateTotal(computerHand)
      }

      // Determine the final totals for user and computer and determine the winner and whether there was a tie
      const compScoreEndofGame = calculateTotal(computerHand)
      const userScoreEndOfGame = calculateTotal(userHand)

      // computer wins!
      if (compScoreEndofGame > userScoreEndOfGame && compScoreEndofGame <= 21) {
        const ele = document.createElement('div')
        ele.classList.toggle('total')
        ele.appendChild(document.createTextNode('Computer Won!!!'))
        const game = document.getElementsByClassName('game')
        game[0].appendChild(ele)
        // setTimeout(function() { alert("Sorry, you lose") }, 80);

      // user wins
      } else if (userScoreEndOfGame > compScoreEndofGame && compScoreEndofGame <= 21) {
        const ele = document.createElement('div')
        ele.classList.toggle('total')
        ele.appendChild(document.createTextNode('Player Won!!!'))
        const game = document.getElementsByClassName('game')
        game[0].appendChild(ele)
        // setTimeout(function() { alert("Congrats, you win!!") }, 80);

      // tie
      } else if (compScoreEndofGame === userScoreEndOfGame) {
        const ele = document.createElement('div')
        ele.classList.toggle('total')
        ele.appendChild(document.createTextNode('Tie!'))
        const game = document.getElementsByClassName('game')
        game[0].appendChild(ele)
        // setTimeout(function() { alert("Tie.") }, 80);
      }

      // hide the hit/stay buttons
      document.getElementsByClassName('button-bar')[0].classList.toggle('hide')
      resetDiv.classList.toggle('hide') // make resetDiv reappear
    })

    // reset game
    const resetDiv = document.createElement('div')
    resetDiv.className = 'button-bar'
    resetDiv.style.paddingLeft = '530px'

    resetDiv.id = 'resetDiv'
    const reset = buttonElementCreator('start over')
    reset.style.border = 'solid'
    reset.style.borderWidth = 'thin'
    reset.style.backgroundColor = 'yellow'

    resetDiv.appendChild(reset)
    game[0].appendChild(resetDiv)
    resetDiv.classList.toggle('hide')
    console.log(document.getElementsByClassName('start'))
    reset.addEventListener('click', function (event) {
      window.location.reload(true)
    })
  })
}

function generateDeck () {
  const deck = []
  // go through suits
  for (let i = 1; i <= 13; i++) {
    let number = ''
    if (i === 1) {
      number = 'A'
    } else if (i === 11) {
      number = 'J'
    } else if (i === 12) {
      number = 'Q'
    } else if (i === 13) {
      number = 'K'
    } else {
      number = i + '' // regular number convert to str
    }
    // push 4 of each number by suit variant
    deck.push({'number': number, 'suit': '\u2666'})
    deck.push({'number': number, 'suit': '\u2663'})
    deck.push({'number': number, 'suit': '\u2665'})
    deck.push({'number': number, 'suit': '\u2660'})
  }
  return deck
}

// fisher-yates shuffle taken from here as reference: https://www.frankmitchell.org/2015/01/fisher-yates/
// shuffles a deck in place as randomly as possible
function shuffle (deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
}

// parses the user entered values into an array
function inputParser (inputString) {
  if (inputString.length === 0) {
    return
  }
  return inputString.split(',')
}

// if user entered a starting set, then put these on top of the deck
function putOnTopofDeck (startingCards, deck) {
  if (startingCards === undefined) {
    return
  }
  // loop through all cards entered
  for (let i = 0; i < startingCards.length; i++) {
    // loop through deck to find match
    for (let j = 0; j < deck.length; j++) {
      // found the card, put it at front of deck
      if (deck[j].number === startingCards[i]) {
        // swap original front of deck with input
        const temp = deck[j]
        deck[j] = deck[deck.length - 1 - i]
        deck[deck.length - 1 - i] = temp
      }
    }
  }
}

// Creates an element that represents a user/computer's deck of cards
function deckElementCreator (className, array) {
  const ele = document.createElement('div')
  ele.className = className
  for (let i = 0; i < array.length; i++) {
    const child = document.createElement('p')

    // get card
    child.style.backgroundImage = "url('" + determineCardFace(array[i]) + "')"

    if (i === 0 && className === 'computerElement') {
      child.className = 'hiddencard'
      child.id = "url('" + determineCardFace(array[i]) + "')"
      child.style.backgroundImage = "url('http://www.murphysmagicsupplies.com/images_email/Mandolin_BACK.jpg')"
    }

    ele.appendChild(child)
    // let currentCard = array[i].number + "" + array[i].suit;
    // currentCard = document.createTextNode(currentCard);
    // child.appendChild(currentCard);
    // //change font to red if heart or diamond
    // if(array[i].suit==="\u2666" || array[i].suit==="\u2665"){
    //   child.style.color="red";
    // }
    if (className === 'computerElement' && i === 0) {
      child.classList.toggle('cardDisplayHidden')
      child.classList.toggle('hidden')
    } else {
      child.classList.toggle('cardDisplay')
    }
  }
  return ele
}

// Creates an element that represents a user/computer's total
function getScoreElementCreator (player, array) {
  if (player === 'computer') {
    const ele = document.createElement('div')
    ele.classList.toggle('total')
    ele.appendChild(document.createTextNode('Computer Hand - Total: ?'))
    return ele
  } else {
    const ele = document.createElement('div')
    ele.classList.toggle('total')
    const total = calculateTotal(array)
    ele.appendChild(document.createTextNode('Player Hand - Total: ' + total))
    return ele
  }
}

// calculates the total of a players hand from the array of cards
function calculateTotal (array) {
  let tot = 0
  const aces = []

  // get sum without aces
  for (let i = 0; i < array.length; i++) {
    if (array[i].number === 'A') {
      aces.push(array[i])
    } else if (array[i].number === 'J' || array[i].number === 'Q' || array[i].number === 'K') {
      tot += 10
    } else {
      tot += parseInt(array[i].number)
    }
  }

  // now get sum including aces
  for (let i = 0; i < aces.length; i++) {
    if (tot + 11 <= 21) {
      tot += 11
    } else {
      tot += 1
    }
  }

  return tot
}

// Creates a button element with a given name
function buttonElementCreator (word) {
  const ele = document.createElement('BUTTON')
  const text = document.createTextNode(word)
  ele.className = word
  ele.appendChild(text)
  ele.classList.toggle('button')
  return ele
}

function getButtonField (hit, stand) {
  const ele = document.createElement('div')
  ele.className = 'button-bar'
  ele.appendChild(hit)
  ele.appendChild(stand)
  return ele
}

// updates a given element, which is created by the function above
function updateTotal (element, deck, player, game) {
  if (player === 'user') {
    const total = calculateTotal(deck)
    element.childNodes[0].nodeValue = 'Player Hand - Total: ' + total
    if (total > 21) {
      const ele = document.createElement('div')
      ele.classList.toggle('total')
      ele.appendChild(document.createTextNode('Player Lost: Bust!'))
      // game[0].insertBefore(ele,game[0].firstChild);
      game[0].appendChild(ele)

      // toggle reset div and button field
      // const reset = document.getElementById("resetDiv");
      // reset.classList.toggle("hide"); //make resetDiv reappear
      document.getElementsByClassName('button-bar')[0].classList.toggle('hide')
      document.getElementsByClassName('button-bar')[1].classList.toggle('hide')
    }
  } else {
    const total = calculateTotal(deck)
    element.childNodes[0].nodeValue = 'Computer Hand - Total: ' + total
    if (total > 21) {
      const ele = document.createElement('div')
      ele.classList.toggle('total')
      ele.appendChild(document.createTextNode('Computer Lost: Bust!'))
      ele.appendChild(document.createTextNode('You win!'))

      // game[0].insertBefore(ele,game[0].firstChild);
      game[0].appendChild(ele)
    }
  }
}

function createCardElement (card) {
  const ele = document.createElement('p')
  ele.style.backgroundImage = "url('" + determineCardFace(card) + "')"

  // if(card.suit==="\u2666" || card.suit==="\u2665"){
  //   ele.style.color="red";
  // }
  // const currentCard = document.createTextNode(card.number+""+card.suit);
  // ele.appendChild(currentCard);
  ele.classList.toggle('cardDisplay')
  return ele
}

function determineCardFace (card) {
  // diamond
  if (card.suit === '\u2666') {
    if (card.number === 'A') {
      return 'images/ace_of_diamonds.png'
    } else if (card.number === 'J') {
      return 'images/jack_of_diamonds.png'
    } else if (card.number === 'Q') {
      return 'images/queen_of_diamonds.png'
    } else if (card.number === 'K') {
      return 'images/king_of_diamonds.png'
    } else if (card.number === '2') {
      return 'images/2_of_diamonds.png'
    } else if (card.number === '3') {
      return 'images/3_of_diamonds.png'
    } else if (card.number === '4') {
      return 'images/4_of_diamonds.png'
    } else if (card.number === '5') {
      return 'images/5_of_diamonds.png'
    } else if (card.number === '6') {
      return 'images/6_of_diamonds.png'
    } else if (card.number === '7') {
      return 'images/7_of_diamonds.png'
    } else if (card.number === '8') {
      return 'images/8_of_diamonds.png'
    } else if (card.number === '9') {
      return 'images/9_of_diamonds.png'
    } else if (card.number === '10') {
      return 'images/10_of_diamonds.png'
    }
  } else if (card.suit === '\u2660') { // spades
    if (card.number === 'A') {
      return 'images/ace_of_spades.png'
    } else if (card.number === 'J') {
      return 'images/jack_of_spades.png'
    } else if (card.number === 'Q') {
      return 'images/queen_of_spades.png'
    } else if (card.number === 'K') {
      return 'images/king_of_spades.png'
    } else if (card.number === '2') {
      return 'images/2_of_spades.png'
    } else if (card.number === '3') {
      return 'images/3_of_spades.png'
    } else if (card.number === '4') {
      return 'images/4_of_spades.png'
    } else if (card.number === '5') {
      return 'images/5_of_spades.png'
    } else if (card.number === '6') {
      return 'images/6_of_spades.png'
    } else if (card.number === '7') {
      return 'images/7_of_spades.png'
    } else if (card.number === '8') {
      return 'images/8_of_spades.png'
    } else if (card.number === '9') {
      return 'images/9_of_spades.png'
    } else if (card.number === '10') {
      return 'images/10_of_spades.png'
    }
  } else if (card.suit === '\u2663') { // clubs
    if (card.number === 'A') {
      return 'images/ace_of_clubs.png'
    } else if (card.number === 'J') {
      return 'images/jack_of_clubs.png'
    } else if (card.number === 'Q') {
      return 'images/queen_of_clubs.png'
    } else if (card.number === 'K') {
      return 'images/king_of_clubs.png'
    } else if (card.number === '2') {
      return 'images/2_of_clubs.png'
    } else if (card.number === '3') {
      return 'images/3_of_clubs.png'
    } else if (card.number === '4') {
      return 'images/4_of_clubs.png'
    } else if (card.number === '5') {
      return 'images/5_of_clubs.png'
    } else if (card.number === '6') {
      return 'images/6_of_clubs.png'
    } else if (card.number === '7') {
      return 'images/7_of_clubs.png'
    } else if (card.number === '8') {
      return 'images/8_of_clubs.png'
    } else if (card.number === '9') {
      return 'images/9_of_clubs.png'
    } else if (card.number === '10') {
      return 'images/10_of_clubs.png'
    }
  } else { // hearts
    if (card.number === 'A') {
      return 'images/ace_of_hearts.png'
    } else if (card.number === 'J') {
      return 'images/jack_of_hearts.png'
    } else if (card.number === 'Q') {
      return 'images/queen_of_hearts.png'
    } else if (card.number === 'K') {
      return 'images/king_of_hearts.png'
    } else if (card.number === '2') {
      return 'images/2_of_hearts.png'
    } else if (card.number === '3') {
      return 'images/3_of_hearts.png'
    } else if (card.number === '4') {
      return 'images/4_of_hearts.png'
    } else if (card.number === '5') {
      return 'images/5_of_hearts.png'
    } else if (card.number === '6') {
      return 'images/6_of_hearts.png'
    } else if (card.number === '7') {
      return 'images/7_of_hearts.png'
    } else if (card.number === '8') {
      return 'images/8_of_hearts.png'
    } else if (card.number === '9') {
      return 'images/9_of_hearts.png'
    } else if (card.number === '10') {
      return 'images/10_of_hearts.png'
    }
  }
}

document.addEventListener('DOMContentLoaded', main)
