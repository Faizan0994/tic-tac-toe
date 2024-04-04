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

  const gameOver = (arr) => {
    function areSame(arr){//Analyzes rows
        let first = arr[0].getValue();
        for (let i=1; i<arr.length; i++)
           if (arr[i].getValue() != first)
              return false;
        return true;
    }

    function checkColumnEquality(matrix, columnIndex) {//Analyzes columns
      // Get the first element of the column
      const firstElement = matrix[0][columnIndex].getValue();
    
      // Iterate through the column starting from the second element
      for (let i = 1; i < matrix.length; i++) {
          // If any element is different from the first element, or is zero, return false
          if ((matrix[i][columnIndex].getValue() !== firstElement) || matrix[i][columnIndex].getValue() === 0) {
              return false;
          }
      }
    
      // If all elements are the same, return true
      return true;
    }


    //Check rows
    if((areSame(arr[0])&&(arr[0][0].getValue()!==0)) || (areSame(arr[1])&&(arr[1][0].getValue()!==0)) || (areSame(arr[2])&&(arr[2][0].getValue()!==0)))
    return true;

    //Check columns
    if(checkColumnEquality(arr,0) || checkColumnEquality(arr,1) || checkColumnEquality(arr,2))
    return true;

    //Check diagonals
    if((arr[0][0].getValue()!==0) && (arr[0][0].getValue() === arr[1][1].getValue()) && (arr[0][0].getValue() === arr[2][2].getValue()))
    return true;

    if((arr[0][2].getValue()!==0) && (arr[0][2].getValue() === arr[1][1].getValue()) && (arr[0][2].getValue() === arr[2][0].getValue()))
    return true;

    return false;
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