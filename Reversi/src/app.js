//Zachary Kimelheim

const rev = require('./reversi.js');
const readlineSync = require('readline-sync');
fs = require('fs');


console.log('REVERSI?\n');

//check if config files exists, otherwise generate board manually
if(process.argv[2]){
	fs.readFile(process.argv[2],'utf8',function(err,data){
		if(err){
			console.log("this is bad. very bad.", err);
		}
		else{
			//initialize board
			const obj = JSON.parse(data);
			const board = [...obj.boardPreset.board];
			const player = obj.boardPreset.playerLetter;
			const computer = (player === "X") ? "O" : "X";
			const playerTurn = (player === "X") ? true : false;
			const width = Math.sqrt(board.length);
			const scriptedMovesPlayer = [...obj.scriptedMoves.player];
			const scriptedMovesComputer = [...obj.scriptedMoves.computer];
			playRecursive(board, width, player, computer, playerTurn,scriptedMovesPlayer, scriptedMovesComputer);
		}
	});
}
else{
	const begin = start();
	const game = play(begin.board, begin.width, begin.player, begin.computer, begin.playerTurn);
	getScore(game.b, game.p);
}

//1. Start with game set up, return updates values in an object for "Game" to use
function start(){
	let width;
	console.log("Look who's ready to RUUUUUMMMMBBBLLLEEEE!!\n");
	do{
		width = readlineSync.question("Set the width of your board: (Even number between 4 and 26!)");
	} while(width%2!==0 || isNaN(width) || width<4 || width>26);

	let player = '';
	let computer = '';
	do{
		player = readlineSync.question("Pick your poison: X (black) or O (white)\n> ");
		computer = (player ==='X') ? 'O' : 'X';
	} while (player !== 'X' && player !== 'O');

	//if player chose X, he goes first, otherwise computer goes first
	const pick = (player ==='X') ? true : false;
	console.log('Player is: ', player);

	//create board
	let board = rev.generateBoard(width,width," ");
	board = rev.setBoardCell(board, "X", width/2, width/2 - 1);
	board = rev.setBoardCell(board, "X", width/2 - 1, width/2);
	board = rev.setBoardCell(board, "O", width/2 - 1, width/2 - 1);
	board = rev.setBoardCell(board, "O", width/2, width/2);


	//print board and lets return our beginning entires to our play function
	console.log(rev.boardToString(board));
	return {board:board, width:width, player:player, computer:computer, playerTurn:pick};
}

//Plays the game to completion, returns an object to help evaluate the score
function play(board, width, player, computer, playerTurn){
	let skip = 0;
	while (!rev.isBoardFull(board) && skip < 2){
		//computers turn
		if (!playerTurn){
			const validMoves = rev.getValidMoves(board, computer);
			if (validMoves.length > 0){
				readlineSync.question("Press <ENTER> to show computer's move...");
				const index = Math.floor(Math.random() * (validMoves.length));
				const randomMove = validMoves[index];
				board = rev.setBoardCell(board, computer, randomMove[0], randomMove[1]);
				board = rev.flipCells(board, rev.getCellsToFlip(board, randomMove[0], randomMove[1]));
				skip = 0;
			}else{
				readlineSync.question("No valid moves. Computer passes. Press any key.\n ");
				skip++;
				if (skip === 2) {console.log("game over");} //if we increment to 2 then that means neither player can play
				playerTurn = !playerTurn;
				continue;
			}
		}else if (playerTurn){
			const validMoves = rev.getValidMoves(board, player);

			//base case--no moves left, increment skip
			if (validMoves.length === 0){
				readlineSync.question("No valid moves. Press any key.\n ");
				skip++;
				if (skip === 2) {console.log("game over");}
				playerTurn = !playerTurn;
				continue;
			}
			let move = '';
			do{
				move = readlineSync.question("What's your move? ");
				if (rev.algebraicToRowCol(move) === undefined || !rev.isValidMoveAlgebraicNotation(board, player, move)){
					console.log("Invalid Move\n");
				}
			} while (rev.algebraicToRowCol(move) === undefined || !rev.isValidMoveAlgebraicNotation(board, player, move));
				const row = rev.algebraicToRowCol(move).row;
				const col = rev.algebraicToRowCol(move).col;
				board = rev.setBoardCell(board, player, row, col);
				board = rev.flipCells(board, rev.getCellsToFlip(board, row, col));
				skip = 0; //reset skip
		}
		console.log(rev.boardToString(board));
		playerTurn = !playerTurn;
		rev.printScore(board);
	}return {b:board, p: player};
}

function getScore(board, player){
	const scores = rev.getLetterCounts(board);
	if (scores.X === scores.O){
		console.log("It's a tie!");
	}
	else if(scores.X > scores.O){
		if (player === 'X'){
			console.log("You win!");
		}else{
			console.log("Computer wins!");
		}
	}
	else if(scores.O > scores.X){
		if (player === 'O'){
			console.log("You win!");
		}else{
			console.log("Computer wins!");
		}
	}
}

//Recursively iterating through the scripted part of the game, if necessary--> then when script is over it will begin playing normally
function playRecursive(board, width, player, computer, playerTurn,scriptedP, scriptedC){
	console.log("\n\n", rev.boardToString(board));
	rev.printScore(board);

	console.log("scripted Moves left for Player: ", scriptedP);
	console.log("scripted Moves left for Computer: ", scriptedC);

	//base case -- play normally
	if (scriptedP.length === 0 && scriptedC.length === 0){ //scripts are done
		console.log("Script play over! Time to play for real now.\n\n" );
		play(board, width, player, computer, playerTurn);
	}
	else {
			//computers turn
			if (!playerTurn){
				computerSimulation(board, width, player, computer, playerTurn, scriptedP, scriptedC);
			}
			//players turn
			else{
				playerSimulation(board, width, player, computer, playerTurn, scriptedP, scriptedC);
			}
		}
	}


	function playerSimulation(board, width, player, computer, playerTurn, scriptedP, scriptedC){
		const compArr = [...scriptedP];
		const yes = [rev.algebraicToRowCol(compArr[0]).row,rev.algebraicToRowCol(compArr[0]).col];
		//const validMoves = rev.getValidMoves(board, player);

		//if it is a valid move do this:
		if(rev.isValidMoveAlgebraicNotation(board,player,compArr[0])){
			readlineSync.question("Press <ENTER> to show players's move...");
			board = rev.setBoardCell(board, player, yes[0],yes[1]);
			board = rev.flipCells(board, rev.getCellsToFlip(board, yes[0],yes[1]));
			scriptedP = scriptedP.splice(-1,1);
			playRecursive(board, width, player, computer, !playerTurn,scriptedP, scriptedC);
		}
		else if(!rev.isValidMoveAlgebraicNotation(board,player,compArr[0])){
			let move = '';
			do{
				// console.log(validMoves);
				move = readlineSync.question("What's your move? ");
				if (rev.algebraicToRowCol(move) === undefined || !rev.isValidMoveAlgebraicNotation(board, player, move)){
					console.log("Invalid Move\n");
				}
			}while (rev.algebraicToRowCol(move) === undefined || !rev.isValidMoveAlgebraicNotation(board, player, move));

				const row = rev.algebraicToRowCol(move).row;
				const col = rev.algebraicToRowCol(move).col;
				// console.log(row, col);
				board = rev.setBoardCell(board, player, row, col);
				board = rev.flipCells(board, rev.getCellsToFlip(board, row, col));
				scriptedP = scriptedP.splice(-1,1);
			playRecursive(board, width, player, computer, !playerTurn,scriptedP, scriptedC);
		}
	}
	function computerSimulation(board, width, player, computer, playerTurn, scriptedP, scriptedC){
		const compArr = [...scriptedC]; //copy array of Computer Scripted Moves

		//Yes contains the first element of the array 'A2' for example --> converted in to
		//row col form and put in array [0,3]
		const yes = [rev.algebraicToRowCol(compArr[0]).row,rev.algebraicToRowCol(compArr[0]).col];

		//list of all valid moves on the board for that player
		const validMoves = rev.getValidMoves(board, computer);

		//if it is a valid move do this:
		if(rev.isValidMoveAlgebraicNotation(board,computer,compArr[0])){
			readlineSync.question("Press <ENTER> to show computers's move...");
			board = rev.setBoardCell(board, computer, yes[0],yes[1]);
			board = rev.flipCells(board, rev.getCellsToFlip(board, yes[0],yes[1]));
			scriptedC = scriptedC.splice(-1,1);
			playRecursive(board, width, player, computer, !playerTurn,scriptedP, scriptedC);
		}
		//if it is not a valid move, generate the move from the pool of valid moves
		else if(!rev.isValidMoveAlgebraicNotation(board,computer,compArr[0])){
			readlineSync.question("Press <ENTER> to show computer's new move...");
			const index = Math.floor(Math.random() * (validMoves.length));
			const randomMove = validMoves[index];
			board = rev.setBoardCell(board, computer, randomMove[0], randomMove[1]);
			board = rev.flipCells(board, rev.getCellsToFlip(board, randomMove[0], randomMove[1]));
			scriptedC = scriptedC.splice(-1,1);
			playRecursive(board, width, player, computer, !playerTurn,scriptedP, scriptedC);
		}
	}
