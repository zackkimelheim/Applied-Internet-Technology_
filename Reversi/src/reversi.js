//zachary kimelheim
//all functions stored in rev object below to be exported at end of script

const rev = {

  //repeats value n amount of times and stores it in an array to be returned
  repeat: function(value, n) {
    const array = [];
    for (let i = 0; i < n; i++) {
      array.push(value);
    }
    return array;
  },

  //a single dimensional Array containing the number of elements that would be in a
  //rows x columns board… with each cell containing the initial value, initialCellValue
  // ex: rev.generateBoard(4, 4); --> initialCellValue to be set to " " by default
  generateBoard: function(rows, columns, initialCellValue) {
    if (initialCellValue) {
      return rev.repeat(initialCellValue, rows * columns);
    } else {
      return rev.repeat(" ", rows * columns);
    }
  },

  //giving back the index of the square in the 1-D array
  rowColToIndex: function(board, rowNumber, columnNumber) {
    //lets say the board is 3 x 3
    /*
     0 1 2
  0  X X X
  1  X X X
  2  X X X
                                    r  c
    if we call rowColToIndex(board, 1, 1)
    */
    const size = Math.sqrt(board.length); //get size of board
    const index = (rowNumber * size) + columnNumber;
    return index;
  },

  //giving back the RowCol position of the square, given the index
  indexToRowCol: function(board, i) {

    const size = Math.sqrt(board.length);
    const arr = {};
    arr.row = Math.floor(i / size);
    arr.col = i % size;

    return arr;
  },
  /*
  const board = rev.generateBoard(3, 3, " ");
  const updatedBoard = rev.setBoardCell(board, "X", 1, 1);
  board is [" ", " ", " ", " ", " ", " ", " ", " ", " "]
  updatedBoard is [" ", " ", " ", " ", "X", " ", " ", " ", " "]
  */

  //a single dimensional Array representing the board where the cell at row and col
  //is set to the value of letter
  setBoardCell: function(board, letter, row, col) {

    const newBoard = [...board]; //creates copy of board
    const index = rev.rowColToIndex(board, row, col); //get index
    newBoard[index] = letter;

    return newBoard;

  },

  // rev.algebraicToRowCol("B3") // for a 4 x 4 board, {"row": 2, "col": 1}
  algebraicToRowCol: function(algebraicNotation) {

    let row = 0;
    let column = "";
    //1. Check the exceptional cases, return undefined for these
    /*
    a. input != 2
    b. first char not a letter
    c. second char not a number
    d. blank input
    5.
    */
    //1a. Make sure it is a 2-digit value
    if (algebraicNotation.length !== 2) {
      return undefined;
    }
    //1b. Make sure first char is a letter
    column = algebraicNotation.charCodeAt(0) - 65; //gets the ASCII value of the value
    if (column < 0 || column > 26) {
      return undefined;
    }
    //1c. Make sure second char is a number
    if (isNaN(algebraicNotation.charAt(1))) {
      return undefined;
    } else {
      row = algebraicNotation.charAt(1) - 1;
    }
    //if we are here then it is a successful call, add values to arr and return
    const arr = {};
    arr.row = row;
    arr.col = column;
    return arr;
  },


  //STOPped here
  placeLetters: function(board, letter, algebraicNotation) {
    let newBoard = [...board];
    //go through all arguments
    for (let i = 2; i < arguments.length; i++) { //will go through all the args from index 2 onward
      const call = rev.algebraicToRowCol(arguments[i]);
      newBoard = rev.setBoardCell(newBoard, letter, call.row, call.col);
    }
    return newBoard;
  },

  boardToString: function(board) {

    const size = Math.sqrt(board.length);
    let result = ""; //new board
    let top = "";
    let horizontalDividers = " ";
    let count = 1;

    //1. Make the top part of the board
    //Prints   A   B   C if 3
    for (let i = 0; i < size; i++) {
      top += "  " + String.fromCodePoint(65 + i) + " ";
    }

    result += " " + top + "\n"; //building the board //top is complete A B C


    //2. Create horizontal dividers +---+---+---+---+ ...
    for (let i = 0; i < size; i++) {
      horizontalDividers += "+---";
      if (i === size - 1) {
        horizontalDividers += "+";
      }
    }


    //3. Create number and vertical bars
    for (let i = 0; i < size; i++) {
      result += count + ""; //add row number
      for (let j = 0; j < size; j++) {
        result += "|  " + board[size * i + j]; //add spacing
        if (j === size - 1) {
          result += "|";
        }
      }
      result += "\n"; //start a new line
      //Use this for loop to add dividers in and combine it together
      result += horizontalDividers + "\n"; //add the horizontalDividers to the grid
      count++;
    }

    return result;

  },

  //Loop through the board, if there is an open square, it is not full, return false
  isBoardFull: function(board) {
    const size = board.length;
    for (let i = 0; i < size; i++) {
      if (board[i] === " ") {
        return false;
      }
    }
    return true;

  },

  //Using the board passed in, flip the piece at the specified row and col so
  //that it is the opposite color by changing X to O or O to X. If no letter is present,
  //do not change the contents of the cell.
  flip: function(board, row, col) {

    const newBoard = [...board];
    //get array index of row col passed in
    const index = rev.rowColToIndex(board, row, col);
    //if empty do nothing
    if (board[index] === 'X') {
      newBoard[index] = 'O';
    }
    if (board[index] === 'O') {
      newBoard[index] = 'X';
    }

    return newBoard;
  },

  //Using the board passed in, flip the pieces in the cells specified by cellsToFlip.
  //cellsToFlip is a 3 dimensional array:
  //the inner most Array has 2 elements, a row and a column
  //groups of rows and columns are wrapped in an Array (these groupings are meant to represent lines of consecutive tiles)
  //finally, these groups are also wrapped in an Array
  flipCells: function(board, cellsToFlip) {

    const size = Math.sqrt(board.length);
    const newBoard = [...board];

    for (let i = 0; i < cellsToFlip.length; i++) {
      const firstCell = cellsToFlip[i];
      for (let j = 0; j < firstCell.length; j++) {
        const secondCell = firstCell[j];
        const index = secondCell[0] * size + secondCell[1];
        if (board[index] === 'X') {
          newBoard[index] = 'O';
        } else if (board[index] === 'O') {
          newBoard[index] = 'X';
        } else {
          continue; //keep going
        }
      }
    }
    return newBoard;
  },

  //Helper function that will be doing all the checking depending on the direction, used below in the getCellsToFlip
  directionalFlipHelper: function(board, value, lastRow, lastCol, xDir, yDir) {
    // console.log(value, lastRow, lastCol, xDir, yDir);
    const size = Math.sqrt(board.length);
    const flip = [];

    let inBounds = true; //will keep track if we are in the bounds of the game or not. loop until we are out of bounds for example
    while (inBounds) {
      lastRow += yDir; //move our row +1 or -1 depending on call
      lastCol += xDir; //move our col +1 or -1 depending on call

      //if our row went off board left or off board right
      if (lastRow < 0 || lastRow === size) {
        inBounds = false;
        return [];
      }

      //if our col went off board top or off board bottom
      if (lastCol < 0 || lastCol === size) {
        inBounds = false;
        return [];
      }

      //not valid
      if (board[rev.rowColToIndex(board, lastRow, lastCol)] === " ") {
        return [];
      }
      //don't change if we land on the spot we meant to have
      if (board[rev.rowColToIndex(board, lastRow, lastCol)] === value) {
        break;
      }
      //if it passes all these conditions, then add it to the list
      flip.push([lastRow, lastCol]);
    }
    return flip;
  },

  //use our helper function above for each direction. each helper fucntion call will return an array
  //of values. If the values are filled it means that they are the correct values
  getCellsToFlip: function(board, lastRow, lastCol) {
    const result = [];
    const value = board[rev.rowColToIndex(board, lastRow, lastCol)];
    const directions = [];

    directions.push(rev.directionalFlipHelper(board, value, lastRow, lastCol, -1, 0)); //left
    directions.push(rev.directionalFlipHelper(board, value, lastRow, lastCol, +1, 0)); //right
    directions.push(rev.directionalFlipHelper(board, value, lastRow, lastCol, 0, -1)); //down
    directions.push(rev.directionalFlipHelper(board, value, lastRow, lastCol, 0, +1)); //up
    directions.push(rev.directionalFlipHelper(board, value, lastRow, lastCol, -1, -1)); //BL
    directions.push(rev.directionalFlipHelper(board, value, lastRow, lastCol, +1, +1)); //TR
    directions.push(rev.directionalFlipHelper(board, value, lastRow, lastCol, -1, +1)); //TL
    directions.push(rev.directionalFlipHelper(board, value, lastRow, lastCol, +1, -1)); //BR

    //loop through the array containing all the above calls.
    for (let i = 0; i < directions.length; i++) {
      //if an element in the array is filled, then add it to our final result
      if (directions[i].length > 0) {
        result.push(directions[i]);
      }
    }
    return result;
  },

  isValidMove: function(board, letter, row, col) {
    const size = Math.sqrt(board.length);

    //not a valid move
    if (row > size || col > size) {
      return false;
    }

    //cannot place on a filled square
    if (board[rev.rowColToIndex(board, row, col)] !== " ") {
      return false;
    }

    //if we got this far, it means that we are placing the piece in a spot on the board that is empty,
    //now lets see if it adheres to the third rule--that is must flip at least one of the players pieces

    //make a copy of the original board and test to see if it passes to see if it is a valid move
    const newBoard = [...board];
    newBoard[rev.rowColToIndex(board, row, col)] = letter; //put the piece on the board
    const arr = rev.getCellsToFlip(newBoard, row, col); //array that will return which pieces to flip,
    //if it is empty then it is not a valid move
    if (arr.length === 0) {
      return false;
    }
    if (arr.length > 0) {
      return true;
    }
  },


  //Using the board passed in, determines whether or not a move with letter to algebraicNotation is valid.
  //Use the functions you previously created, isValidMove and algebraicToRowCol to implement this function.
  isValidMoveAlgebraicNotation: function(board, letter, algebraicNotation) {
    return rev.isValidMove(board, letter, rev.algebraicToRowCol(algebraicNotation).row, rev.algebraicToRowCol(algebraicNotation).col);
  },

  //return score
  getLetterCounts: function(board) {
    let X = 0;
    let O = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "X") {
        X++;
      }
      if (board[i] === "O") {
        O++;
      }
    }
    return {
      "X": X,
      "O": O
    };
  },

  getValidMoves: function(board, letter) {
    const res = [];
    for (let i = 0; i < board.length; i++) {
      if (rev.isValidMove(board, letter, rev.indexToRowCol(board, i).row, rev.indexToRowCol(board, i).col)) {
        res.push([rev.indexToRowCol(board, i).row, rev.indexToRowCol(board, i).col]);
      }
    }
    return res;
  },

  printScore: function(board) {
    const score = rev.getLetterCounts(board);
    console.log("Score:\n\nX: ", score.X, "\nO: ", score.O, "\n");
  },

};
//let board = rev.generateBoard(3, 3, " ");
//console.log(rev.boardToString(board));
module.exports = rev;
