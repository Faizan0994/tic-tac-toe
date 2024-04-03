function createGameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
      }
    }

    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;

    const mark = (player, row, column) => {
        board[row-1][column-1].addToken(player);
    };

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
    	const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    	console.log(boardWithCellValues);
    };

    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, mark, printBoard };
}

function Cell() {
    let value = 0;
  
    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
      value = player;
    };
  
    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
}

const createUser = function(name, char){
	return {name: name, char: char};
}

const user = createUser("user", "o");
const AI = createUser("AI", "x");

function gameController(playerOne, playerTwo){
	let players = [playerOne, playerTwo];
	const board = createGameboard();
	let activePlayer = players[1];
	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0]? players[1]: players[0];
	};
	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		board.printBoard();
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const takeTurn = (row, column) => {
		board.mark(getActivePlayer().char, row, column);
		//Next player's turn
		switchPlayerTurn();
    	printNewRound();//refresh the board
	}

	printNewRound(); //Start the game

	return {takeTurn, getActivePlayer};
}

const game = gameController(user, AI);