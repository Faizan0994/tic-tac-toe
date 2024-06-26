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
	let winningLine = null;
	var winType = "row";
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
    {winType = "row"; return true;}

    //Check columns
    if(checkColumnEquality(arr,0) || checkColumnEquality(arr,1) || checkColumnEquality(arr,2))
    {winType = "column"; return true;}

    //Check diagonals
    if((arr[0][0].getValue()!==0) && (arr[0][0].getValue() === arr[1][1].getValue()) && (arr[0][0].getValue() === arr[2][2].getValue()))
    {winType = "anti-diagonal"; return true;}

    if((arr[0][2].getValue()!==0) && (arr[0][2].getValue() === arr[1][1].getValue()) && (arr[0][2].getValue() === arr[2][0].getValue()))
    {winType = "diagonal"; return true;}

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
		if(cell.textContent === "X" || cell.textContent === "O") cell.classList.add('selected');
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
			let winnerColor;
			console.log('finished');
			if(getActivePlayer().name === "user") {
				header.textContent = "You Win!";
				header.style.color = "#2ec4b6";
				winnerColor = "#2ec4b6";
				userScore++;
				document.querySelector('.user-score').textContent = userScore;
			} else if(getActivePlayer().name === "AI") {
				header.textContent = "AI Wins!";
				header.style.color = "red";
				winnerColor = "red";
				AIScore++;
				document.querySelector('.ai-score').textContent = AIScore;
			}
			winningLine = findWinningLine(board.getBoard());
			drawWinningLine(winningLine, winnerColor);
			controls.appendChild(playAgainButton);
			return;
		}

		if(isBoardFull()){
			header.textContent = "Draw"
			controls.appendChild(playAgainButton);
		}
		//Next player's turn
		switchPlayerTurn();
		if(getActivePlayer().name === "AI"){
			if(!gameOver(board.getBoard())){
				const bestMove = getBestMove(board.getBoard());
				console.log(bestMove);
				board.mark(getActivePlayer().char, bestMove[0]+1, bestMove[1]+1);
				printNewRound();//refresh the board
				displayNewRound();
				if(gameOver(board.getBoard())){
					let winnerColor;
					console.log('finished');
					
					if(getActivePlayer().name === "AI") {
						header.textContent = "AI Wins!";
						header.style.color = "red";
						winnerColor = "red";
						AIScore++;
						document.querySelector('.ai-score').textContent = AIScore;
					}
					winningLine = findWinningLine(board.getBoard());
					drawWinningLine(winningLine, winnerColor);
					controls.appendChild(playAgainButton);
					return;
				}
			
				if(isBoardFull()){
					header.textContent = "Draw"
					controls.appendChild(playAgainButton);
				}
				//Next player's turn
				switchPlayerTurn();
			}

		}
  }}

  const findWinningLine = (boardState) => {
    // Check rows for a winning line
    for (let row = 0; row < 3; row++) {
        if (boardState[row][0].getValue() !== 0 &&
            boardState[row][0].getValue() === boardState[row][1].getValue() &&
            boardState[row][0].getValue() === boardState[row][2].getValue()) {
            return [row, 0, row, 2]; // Winning line found in this row
        }
    }

    // Check columns for a winning line
    for (let col = 0; col < 3; col++) {
        if (boardState[0][col].getValue() !== 0 &&
            boardState[0][col].getValue() === boardState[1][col].getValue() &&
            boardState[0][col].getValue() === boardState[2][col].getValue()) {
            return [0, col, 2, col]; // Winning line found in this column
        }
    }

    // Check diagonals for a winning line
    if (boardState[0][0].getValue() !== 0 &&
        boardState[0][0].getValue() === boardState[1][1].getValue() &&
        boardState[0][0].getValue() === boardState[2][2].getValue()) {
        return [0, 0, 2, 2]; // Winning line found in the main diagonal
    }

    if (boardState[0][2].getValue() !== 0 &&
        boardState[0][2].getValue() === boardState[1][1].getValue() &&
        boardState[0][2].getValue() === boardState[2][0].getValue()) {
        return [0, 2, 2, 0]; // Winning line found in the anti-diagonal
    }

    return null; // No winning line found
  };

  const drawWinningLine = (line, winnerColor) => {
    const [startRow, startColumn, endRow, endColumn] = line;
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const column = parseInt(cell.dataset.column);
        if (row-1 === startRow && column-1 === startColumn) {
			const strike = document.createElement('div');
			strike.style.backgroundColor = winnerColor;
            strike.style.setProperty('--start-row', startRow);
            strike.style.setProperty('--start-column', startColumn);
            strike.style.setProperty('--end-row', endRow);
            strike.style.setProperty('--end-column', endColumn);
			if(winType === "row") strike.classList.add('row-strike');
			else if(winType === "column") strike.classList.add('column-strike');
			else if(winType === "diagonal") strike.classList.add('diagonal-strike');
			else if(winType === "anti-diagonal") strike.classList.add('anti-diagonal-strike');
            cell.appendChild(strike);
        }
    });
  };

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
	cell1.setAttribute('data-row', '1');
	cell1.setAttribute('data-column', '1');
	row1.appendChild(cell1);
	const cell2 = document.createElement('div');
	cell2.classList.add('cell');
	cell2.setAttribute('id', '2');
	cell2.setAttribute('data-row', '1');
	cell2.setAttribute('data-column', '2');
	row1.appendChild(cell2);
	const cell3 = document.createElement('div');
	cell3.classList.add('cell');
	cell3.setAttribute('id', '3');
	cell3.setAttribute('data-row', '1');
	cell3.setAttribute('data-column', '3');
	row1.appendChild(cell3);
	gameBoard.appendChild(row1);

	const row2 = document.createElement('div');
	row2.classList.add('row');
	row2.setAttribute('id', 'R2');
	const cell4 = document.createElement('div');
	cell4.classList.add('cell');
	cell4.setAttribute('id', '4');
	cell4.setAttribute('data-row', '2');
	cell4.setAttribute('data-column', '1');
	row2.appendChild(cell4);
	const cell5 = document.createElement('div');
	cell5.classList.add('cell');
	cell5.setAttribute('id', '5');
	cell5.setAttribute('data-row', '2');
	cell5.setAttribute('data-column', '2');
	row2.appendChild(cell5);
	const cell6 = document.createElement('div');
	cell6.classList.add('cell');
	cell6.setAttribute('id', '6');
	cell6.setAttribute('data-row', '2');
	cell6.setAttribute('data-column', '3');
	row2.appendChild(cell6);
	gameBoard.appendChild(row2);

	const row3 = document.createElement('div');
	row3.classList.add('row');
	row3.setAttribute('id', 'R3');
	const cell7 = document.createElement('div');
	cell7.classList.add('cell');
	cell7.setAttribute('id', '7');
	cell7.setAttribute('data-row', '3');
	cell7.setAttribute('data-column', '1');
	row3.appendChild(cell7);
	const cell8 = document.createElement('div');
	cell8.classList.add('cell');
	cell8.setAttribute('id', '8');
	cell8.setAttribute('data-row', '3');
	cell8.setAttribute('data-column', '2');
	row3.appendChild(cell8);
	const cell9 = document.createElement('div');
	cell9.classList.add('cell');
	cell9.setAttribute('id', '9');
	cell9.setAttribute('data-row', '3');
	cell9.setAttribute('data-column', '3');
	row3.appendChild(cell9);
	gameBoard.appendChild(row3);

	mainSection.appendChild(gameBoard);
}

var startingPosition = 4;

const gameSetup = function(){
	while(mainSection.firstChild){//To remove all content
		mainSection.removeChild(mainSection.lastChild);
	}
	if(controls.contains(playAgainButton)) controls.removeChild(playAgainButton);

	buildGameboard();
	const game = gameController(user, AI);
	const board = game.board.getBoard();
	const cells = document.querySelectorAll('.cell');

	//Select position for first turn(1 of 4 corners)
	startingPosition = Math.floor(Math.random() * 4) + 1;
	if(startingPosition===1) game.takeTurn(1,1);
	else if(startingPosition===2) game.takeTurn(1,3);
	else if(startingPosition===3) game.takeTurn(3,1);
	else if(startingPosition===4) game.takeTurn(3,3);
	
	document.addEventListener('click', (e) => {//To take turn by clicking
		if(game.getActivePlayer().name === "user") {
			if(e.target.id==='1') game.takeTurn(1,1);
			else if(e.target.id==='2') game.takeTurn(1,2);
			else if(e.target.id==='3') game.takeTurn(1,3);
			else if(e.target.id==='4') game.takeTurn(2,1);
			else if(e.target.id==='5') game.takeTurn(2,2);
			else if(e.target.id==='6') game.takeTurn(2,3);
			else if(e.target.id==='7') game.takeTurn(3,1);
			else if(e.target.id==='8') game.takeTurn(3,2);
			else if(e.target.id==='9') game.takeTurn(3,3);
		}
	});
}

document.addEventListener('click', (e) => {
	if(e.target === startGame || e.target === playAgainButton) gameSetup();
});

document.addEventListener('click', (e) => {
	if(e.target.classList.contains('cell')){
		e.target.classList.add('selected');
	}
});

const getBestMove = function(board) {
	let validMoves = 0;
	for(let i=1;i<=9;i++){
		if(document.getElementById(`${i}`).textContent === "") validMoves++;
	}
	console.log("Valid moves: " + validMoves);

	if(startingPosition === 3){
	if(validMoves === 7){
		if(board[1][1].getValue() !== 0) return [0, 2];
		else {
			if(board[1][0].getValue()===0 && board[0][0].getValue()===0) return [0,0];
			else return  [2,2];
		}
	} else if(validMoves === 5){
		if(board[1][1].getValue() === 'O' && board[0][2].getValue() === 'X') {
			if(board[0][0].getValue() === 'O') return[2,2];
		 	else if(board[2][2].getValue()==='O') return [0,0];
			else if(board[0][1].getValue() === 'O') return [2,1];
			else if(board[2][1].getValue() === 'O') return [0,1];
			else if(board[1][0].getValue() === 'O') return [1,2];
			else if(board[1][2].getValue() === 'O') return [1,0];
		} else {
			if(board[0][0].getValue() === 'X'){
				if(board[1][0].getValue() === 0) return [1,0];
				else return [1,1];
			} else if(board[2][2].getValue() === 'X'){
				if(board[2][1].getValue() === 0) return [2,1];
				else return [1,1];
			}
		}
	} else if(validMoves === 3){
		if(board[1][1].getValue() === 'O'){
			if(board[2][2].getValue() === 'X'){
				if(board[1][2].getValue() === 0) return [1,2];
				else if(board[2][1].getValue() === 0) return [2,1];
			} else if(board[0][0].getValue() === 'X'){
				if(board[0][1].getValue() === 0) return [0,1];
				else if(board[1][0].getValue() === 0) return [1,0];
			} else if(board[0][1].getValue() === 'X') {
				if(board[0][0].getValue() === 0) return [0,0];
				else return [2,2];
			} else if(board[2][1].getValue() === 'X') {
				if(board[2][2].getValue() === 0) return [2,2];
				else return [0,0];
			} else if(board[1][0].getValue() === 'X') {
				if(board[0][0].getValue() === 0) return [0,0];
				else return [2,2];
			} else if(board[1][2].getValue() === 'X') {
				if(board[2][2].getValue() === 0) return [2,2];
				else return [0,0];
			}
		} else if(board[0][0].getValue()===0) return [0,0];
		else if(board[0][2].getValue()===0) return [0,2];
		else if(board[2][2].getValue()===0) return [2,2];
		else {
			if(board[0][0].getValue()==='O' && board[0][2].getValue()==='O') return [0,1];
			else return [1,2];
		}
	} else if(validMoves === 1){
		for(let i=0;i<=2;i++){
			for(let j=0; j<=2;j++){
				if(board[i][j].getValue()===0) return [i,j];
			}
		}
	}

	return [0,0];
	} else if(startingPosition === 1){
		if(validMoves === 7){
			if(board[1][1].getValue() !== 0) return [2, 2];
			else {
				if(board[0][1].getValue()===0 && board[0][2].getValue()===0) return [0,2];
				else return  [2,0];
			}
		} else if(validMoves === 5){
			if(board[1][1].getValue() === 'O' && board[2][2].getValue() === 'X') {
				if(board[0][2].getValue() === 'O') return[2,0];
				else if(board[2][0].getValue() === 'O') return [0,2];
				else if(board[0][1].getValue() === 'O') return [2,1];
				else if(board[2][1].getValue() === 'O') return [0,1];
				else if(board[1][0].getValue() === 'O') return [1,2];
				else if(board[1][2].getValue() === 'O') return [1,0];
			} else {
				if(board[0][2].getValue() === 'X'){
					if(board[0][1].getValue() === 0) return [0,1];
					else return [1,1];
				} else if(board[2][0].getValue() === 'X'){
					if(board[1][0].getValue() === 0) return [1,0];
					else return [1,1];
				}//
			}
		} else if(validMoves === 3){
			if(board[1][1].getValue() === 'O'){
				if(board[0][2].getValue() === 'X'){
					if(board[0][1].getValue() === 0) return [0,1];
					else if(board[1][2].getValue() === 0) return [1,2];
				} else if(board[2][0].getValue() === 'X'){
					if(board[1][0].getValue() === 0) return [1,0];
					else if(board[2][1].getValue() === 0) return [2,1];
				} else if(board[0][1].getValue() === 'X') {
					if(board[0][2].getValue() === 0) return [0,2];
					else return [2,0];
				} else if(board[2][1].getValue() === 'X') {
					if(board[2][0].getValue() === 0) return [2,0];
					else return [0,2];
				} else if(board[1][0].getValue() === 'X') {
					if(board[2][0].getValue() === 0) return [2,0];
					else return [0,2];
				} else if(board[1][2].getValue() === 'X') {
					if(board[0][2].getValue() === 0) return [0,2];
					else return [2,0];
				}
			} else if(board[2][0].getValue()===0) return [2,0];
			else if(board[0][2].getValue()===0) return [0,2];
			else if(board[2][2].getValue()===0) return [2,2];
			else {
				if(board[0][2].getValue()==='O' && board[2][2].getValue()==='O') return [1,2];
				else return [2,1];
			}
		} else if(validMoves === 1){
			for(let i=0;i<=2;i++){
				for(let j=0; j<=2;j++){
					if(board[i][j].getValue()===0) return [i,j];
				}
			}
		}
	
		return [0,0];
	} else if(startingPosition === 2){
		if(validMoves === 7){
			if(board[1][1].getValue() !== 0) return [2,0];
			else {
				if(board[1][2].getValue()===0 && board[2][2].getValue()===0) return [2,2];
				else return  [0,0];
			}
		} else if(validMoves === 5){
			if(board[1][1].getValue() === 'O' && board[2][0].getValue() === 'X') {
				if(board[0][0].getValue() === 'O') return[2,2];
				else if(board[2][2].getValue() === 'O') return [0,0];
				else if(board[0][1].getValue() === 'O') return [2,1];
				else if(board[2][1].getValue() === 'O') return [0,1];
				else if(board[1][0].getValue() === 'O') return [1,2];
				else if(board[1][2].getValue() === 'O') return [1,0];
			} else {
				if(board[0][0].getValue() === 'X'){
					if(board[0][1].getValue() === 0) return [0,1];
					else return [1,1];
				} else if(board[2][2].getValue() === 'X'){
					if(board[1][2].getValue() === 0) return [1,2];
					else return [1,1];
				}//
			}
		} else if(validMoves === 3){
			if(board[1][1].getValue() === 'O'){
				if(board[0][0].getValue() === 'X'){
					if(board[0][1].getValue() === 0) return [0,1];
					else if(board[1][0].getValue() === 0) return [1,0];
				} else if(board[2][2].getValue() === 'X'){
					if(board[1][2].getValue() === 0) return [1,2];
					else if(board[2][1].getValue() === 0) return [2,1];
				} else if(board[0][1].getValue() === 'X') {
					if(board[0][0].getValue() === 0) return [0,0];
					else return [2,2];
				} else if(board[2][1].getValue() === 'X') {
					if(board[2][2].getValue() === 0) return [2,2];
					else return [0,0];
				} else if(board[1][0].getValue() === 'X') {
					if(board[0][0].getValue() === 0) return [0,0];
					else return [2,2];
				} else if(board[1][2].getValue() === 'X') {
					if(board[2][2].getValue() === 0) return [2,2];
					else return [0,0];
				}
			} else if(board[2][0].getValue()===0) return [2,0];
			else if(board[0][0].getValue()===0) return [0,0];
			else if(board[2][2].getValue()===0) return [2,2];
			else {
				if(board[2][2].getValue()==='O' && board[2][0].getValue()==='O') return [2,1];
				else return [1,0];
			}
		} else if(validMoves === 1){
			for(let i=0;i<=2;i++){
				for(let j=0; j<=2;j++){
					if(board[i][j].getValue()===0) return [i,j];
				}
			}
		}
	
		return [0,0];
	} else if(startingPosition === 4){
		if(validMoves === 7){
			if(board[1][1].getValue() !== 0) return [0,0];
			else {
				if(board[2][1].getValue()===0 && board[2][0].getValue()===0) return [2,0];
				else return  [0,2];
			}
		} else if(validMoves === 5){
			if(board[1][1].getValue() === 'O' && board[0][0].getValue() === 'X') {
				if(board[0][2].getValue() === 'O') return[2,0];
				else if(board[2][0].getValue() === 'O') return [0,2];
				else if(board[0][1].getValue() === 'O') return [2,1];
				else if(board[2][1].getValue() === 'O') return [0,1];
				else if(board[1][0].getValue() === 'O') return [1,2];
				else if(board[1][2].getValue() === 'O') return [1,0];
			} else {
				if(board[0][2].getValue() === 'X'){
					if(board[1][2].getValue() === 0) return [1,2];
					else return [1,1];
				} else if(board[2][0].getValue() === 'X'){
					if(board[2][1].getValue() === 0) return [2,1];
					else return [1,1];
				}//
			}
		} else if(validMoves === 3){
			if(board[1][1].getValue() === 'O'){
				if(board[0][2].getValue() === 'X'){
					if(board[1][2].getValue() === 0) return [1,2];
					else if(board[0][1].getValue() === 0) return [0,1];
				} else if(board[2][0].getValue() === 'X'){
					if(board[1][0].getValue() === 0) return [1,0];
					else if(board[2][1].getValue() === 0) return [2,1];
				} else if(board[0][1].getValue() === 'X') {
					if(board[0][2].getValue() === 0) return [0,2];
					else return [2,0];
				} else if(board[2][1].getValue() === 'X') {
					if(board[2][0].getValue() === 0) return [2,0];
					else return [0,2];
				} else if(board[1][0].getValue() === 'X') {
					if(board[2][0].getValue() === 0) return [2,0];
					else return [0,2];
				} else if(board[1][2].getValue() === 'X') {
					if(board[0][2].getValue() === 0) return [0,2];
					else return [2,0];
				}
			} else if(board[2][0].getValue()===0) return [2,0];
			else if(board[0][2].getValue()===0) return [0,2];
			else if(board[0][0].getValue()===0) return [0,0];
			else {
				if(board[0][2].getValue()==='O' && board[0][0].getValue()==='O') return [0,1];
				else return [1,0];
			}
		} else if(validMoves === 1){
			for(let i=0;i<=2;i++){
				for(let j=0; j<=2;j++){
					if(board[i][j].getValue()===0) return [i,j];
				}
			}
		}
	
		return [0,0];
	}
}