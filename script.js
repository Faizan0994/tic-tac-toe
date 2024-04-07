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

const user = createUser("user", "O");
const AI = createUser("AI", "X");

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

  const displayNewRound = function(){
	if(board.getBoard()[0][0].getValue()!==0) document.getElementById('1').textContent = board.getBoard()[0][0].getValue();
	if(board.getBoard()[0][1].getValue()!==0) document.getElementById('2').textContent = board.getBoard()[0][1].getValue();
	if(board.getBoard()[0][2].getValue()!==0) document.getElementById('3').textContent = board.getBoard()[0][2].getValue();
	if(board.getBoard()[1][0].getValue()!==0) document.getElementById('4').textContent = board.getBoard()[1][0].getValue();
	if(board.getBoard()[1][1].getValue()!==0) document.getElementById('5').textContent = board.getBoard()[1][1].getValue();
	if(board.getBoard()[1][2].getValue()!==0) document.getElementById('6').textContent = board.getBoard()[1][2].getValue();
	if(board.getBoard()[2][0].getValue()!==0) document.getElementById('7').textContent = board.getBoard()[2][0].getValue();
	if(board.getBoard()[2][1].getValue()!==0) document.getElementById('8').textContent = board.getBoard()[2][1].getValue();
	if(board.getBoard()[2][2].getValue()!==0) document.getElementById('9').textContent = board.getBoard()[2][2].getValue();

	document.querySelectorAll('.cell').forEach(cell => {
		cell.textContent === user.char ? cell.style.color = "#2ec4b6" : cell.style.color = "red";
	});
  };

  const isBoardFull = () => {//For checking draw conditions
    const boardState = board.getBoard();
    for (let i = 0; i < boardState.length; i++) {
        for (let j = 0; j < boardState[i].length; j++) {
            if (boardState[i][j].getValue() === 0) {
                return false; // If any cell has a value of 0, the board is not full
            }
        }
    }
    return true; // If no cell has a value of 0, the board is full
  };


	const takeTurn = (row, column) => {
	if(!gameOver(board.getBoard())){
    if(board.getBoard()[row-1][column-1].getValue() !== 0){
      console.log("invalid move");
      return;
    }

		board.mark(getActivePlayer().char, row, column);
		printNewRound();//refresh the board
		displayNewRound();
		if(gameOver(board.getBoard())){
			console.log('finished');
			if(getActivePlayer().name === "user") {
				header.textContent = "You Win!";
				header.style.color = "#2ec4b6";
				userScore++;
				document.querySelector('.user-score').textContent = userScore;
			} else if(getActivePlayer().name === "AI") {
				header.textContent = "AI Wins!";
				header.style.color = "red";
				AIScore++;
				document.querySelector('.ai-score').textContent = AIScore;
			}
			controls.appendChild(playAgainButton);
			return;
		}

		if(isBoardFull()){
			header.textContent = "Draw"
			controls.appendChild(playAgainButton);
		}
		//Next player's turn
		switchPlayerTurn();
  }}

	printNewRound(); //Start the game

	return {takeTurn, getActivePlayer, board};
}

var userScore = 0;
var AIScore = 0;

//const game = gameController(user, AI);

///////////////////////////////////////////////////////////
//Linking DOM to the game
///////////////////////////////////////////////////////////
const startGame = document.querySelector('.start-game');
const mainSection = document.querySelector('.main-section');
const controls = document.querySelector('.controls');
const header = document.querySelector('h1');
const playAgainButton = document.createElement('button');
playAgainButton.textContent = "Play Again";

const buildGameboard = function(){//Create gameboard on DOM
	header.textContent = "TIC TAC TOE";
	header.style.color = "white";
	const gameBoard = document.createElement('div');
	gameBoard.classList.add('gameboard');

	const row1 = document.createElement('div');
	row1.classList.add('row');
	row1.setAttribute('id', 'R1');
	const cell1 = document.createElement('div');
	cell1.classList.add('cell');
	cell1.setAttribute('id', '1');
	row1.appendChild(cell1);
	const cell2 = document.createElement('div');
	cell2.classList.add('cell');
	cell2.setAttribute('id', '2');
	row1.appendChild(cell2);
	const cell3 = document.createElement('div');
	cell3.classList.add('cell');
	cell3.setAttribute('id', '3');
	row1.appendChild(cell3);
	gameBoard.appendChild(row1);

	const row2 = document.createElement('div');
	row2.classList.add('row');
	row2.setAttribute('id', 'R2');
	const cell4 = document.createElement('div');
	cell4.classList.add('cell');
	cell4.setAttribute('id', '4');
	row2.appendChild(cell4);
	const cell5 = document.createElement('div');
	cell5.classList.add('cell');
	cell5.setAttribute('id', '5');
	row2.appendChild(cell5);
	const cell6 = document.createElement('div');
	cell6.classList.add('cell');
	cell6.setAttribute('id', '6');
	row2.appendChild(cell6);
	gameBoard.appendChild(row2);

	const row3 = document.createElement('div');
	row3.classList.add('row');
	row3.setAttribute('id', 'R3');
	const cell7 = document.createElement('div');
	cell7.classList.add('cell');
	cell7.setAttribute('id', '7');
	row3.appendChild(cell7);
	const cell8 = document.createElement('div');
	cell8.classList.add('cell');
	cell8.setAttribute('id', '8');
	row3.appendChild(cell8);
	const cell9 = document.createElement('div');
	cell9.classList.add('cell');
	cell9.setAttribute('id', '9');
	row3.appendChild(cell9);
	gameBoard.appendChild(row3);

	mainSection.appendChild(gameBoard);
}

const gameSetup = function(){
	while(mainSection.firstChild){//To remove all content
		mainSection.removeChild(mainSection.lastChild);
	}
	if(controls.contains(playAgainButton)) controls.removeChild(playAgainButton);

	buildGameboard();
	const game = gameController(user, AI);
	const board = game.board.getBoard();
	const cells = document.querySelectorAll('.cell');
	
	document.addEventListener('click', (e) => {//To take turn by clicking
		if(e.target.id==='1') game.takeTurn(1,1);
		else if(e.target.id==='2') game.takeTurn(1,2);
		else if(e.target.id==='3') game.takeTurn(1,3);
		else if(e.target.id==='4') game.takeTurn(2,1);
		else if(e.target.id==='5') game.takeTurn(2,2);
		else if(e.target.id==='6') game.takeTurn(2,3);
		else if(e.target.id==='7') game.takeTurn(3,1);
		else if(e.target.id==='8') game.takeTurn(3,2);
		else if(e.target.id==='9') game.takeTurn(3,3);
	});
}

document.addEventListener('click', (e) => {
	if(e.target === startGame || e.target === playAgainButton) gameSetup();
});