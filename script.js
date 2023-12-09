document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const cells = [];
    const emptyCell = { row: -1, col: -1 };
    let isGameOver = false;
  
    // Helper function to create and append a tile
    function createTile(value) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.classList.add(`tile-${value}`);
      tile.innerText = value;
      return tile;
    }
  
    // Function to start a new game
    function newGame() {
      isGameOver = false;
      cells.length = 0;
      gameContainer.innerHTML = '';
  
      // Initialize 4x4 grid with zeros
      for (let row = 0; row < 4; row++) {
        cells[row] = [];
        for (let col = 0; col < 4; col++) {
          cells[row][col] = 0;
        }
      }
  
      // Randomly add two initial tiles (2 or 4) to the grid
      addRandomTile();
      addRandomTile();
  
      updateGridDisplay();
    }
  
    // Helper function to add a random tile (2 or 4) to the grid
    function addRandomTile() {
      const availableCells = [];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (cells[row][col] === 0) {
            availableCells.push({ row, col });
          }
        }
      }
  
      if (availableCells.length > 0) {
        const { row, col } = availableCells[Math.floor(Math.random() * availableCells.length)];
        cells[row][col] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  
  
    // Helper function to update the display of the grid
    function updateGridDisplay() {
      gameContainer.innerHTML = '';
      cells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const tile = createTile(cell);
          gameContainer.appendChild(tile);
        });
      });
    }
  
    // Function to handle tile movement and merging
    function move(direction) {
      if (isGameOver) return;
      let isMoved = false;
  
      // Define the row and column increments for different directions
      const rowIncrement = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
      const colIncrement = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
  
      // Function to move a tile in a specific direction
      function moveTile(row, col) {
        if (cells[row][col] === 0) return;
  
        let newRow = row + rowIncrement;
        let newCol = col + colIncrement;
  
        while (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
          if (cells[newRow][newCol] === 0) {
            cells[newRow][newCol] = cells[row][col];
            cells[row][col] = 0;
            row = newRow;
            col = newCol;
            newRow += rowIncrement;
            newCol += colIncrement;
            isMoved = true;
          } else if (cells[newRow][newCol] === cells[row][col]) {
            cells[newRow][newCol] *= 2;
            cells[row][col] = 0;
            isMoved = true;
            break;
          } else {
            break;
          }
        }
      }
  
      // Iterate through the grid and move the tiles
      for (let row = direction === 'down' ? 3 : 0; direction === 'down' ? row >= 0 : row < 4; direction === 'down' ? row-- : row++) {
        for (let col = direction === 'right' ? 3 : 0; direction === 'right' ? col >= 0 : col < 4; direction === 'right' ? col-- : col++) {
          moveTile(row, col);
        }
      }
  
      if (isMoved) {
        addRandomTile();
        updateGridDisplay();
        checkGameOver();
      }
    }

    // Function to check if the game is over
  function checkGameOver() {
    // Check if there are any cells with a value of 0 (empty cells)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (cells[row][col] === 0) {
          return; // Game is not over as there is an empty cell
        }
      }
    }

    // Check if there are any adjacent cells with the same value
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentCell = cells[row][col];
        if (
          (row > 0 && cells[row - 1][col] === currentCell) ||
          (row < 3 && cells[row + 1][col] === currentCell) ||
          (col > 0 && cells[row][col - 1] === currentCell) ||
          (col < 3 && cells[row][col + 1] === currentCell)
        ) {
          return; // Game is not over as there are adjacent cells with the same value
        }
      }
    }

    // If no valid moves are found, the game is over
    isGameOver = true;
    alert('Game Over! Try again.');
  }

  
    // Function to check if the game is over
    function checkGameOver() {
      let isFull = true;
  
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (cells[row][col] === 0) {
            isFull = false;
          }
          if (cells[row][col] === 2048) {
            isGameOver = true;
            alert('Congratulations! You reached 2048!');
            return;
          }
        }
      }
  
      if (isFull) {
        isGameOver = true;
        alert('Game Over! Try again.');
      }
    }
  
    // Function to handle keyboard events
    function handleKeyPress(event) {
      const key = event.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        move('up');
      } else if (key === 'arrowdown' || key === 's') {
        move('down');
      } else if (key === 'arrowleft' || key === 'a') {
        move('left');
      } else if (key === 'arrowright' || key === 'd') {
        move('right');
      }
    }
  
    // Event listener for keyboard events
    document.addEventListener('keydown', handleKeyPress);
  
    // Start a new game when the page loads
    newGame();
  });
  
