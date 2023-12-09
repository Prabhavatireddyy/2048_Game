document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container');
  const cells = [];
  const emptyCell = { row: -1, col: -1 };
  let isGameOver = false;
  let has2048BeenReached = false;

  function createTile(value) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.classList.add(`tile-${value}`);
    tile.innerText = value;
    return tile;
  }

  function newGame() {
    isGameOver = false;
    has2048BeenReached = false;
    cells.length = 0;
    gameContainer.innerHTML = '';

    for (let row = 0; row < 4; row++) {
      cells[row] = [];
      for (let col = 0; col < 4; col++) {
        cells[row][col] = 0;
      }
    }

    addRandomTile();
    addRandomTile();

    updateGridDisplay();
  }

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

  function updateGridDisplay() {
    gameContainer.innerHTML = '';
    cells.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const tile = createTile(cell);
        gameContainer.appendChild(tile);
      });
    });
  }

  function move(direction) {
    if (isGameOver || has2048BeenReached) return;
    let isMoved = false;

    const rowIncrement = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
    const colIncrement = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;

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

    for (let row = direction === 'down' ? 3 : 0; direction === 'down' ? row >= 0 : row < 4; direction === 'down' ? row-- : row++) {
      for (let col = direction === 'right' ? 3 : 0; direction === 'right' ? col >= 0 : col < 4; direction === 'right' ? col-- : col++) {
        moveTile(row, col);
      }
    }

    if (isMoved) {
      addRandomTile();
      updateGridDisplay();
      checkGameOver();
      checkWin();
    }
  }

  function checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (cells[row][col] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentCell = cells[row][col];
        if (
          (row > 0 && cells[row - 1][col] === currentCell) ||
          (row < 3 && cells[row + 1][col] === currentCell) ||
          (col > 0 && cells[row][col - 1] === currentCell) ||
          (col < 3 && cells[row][col + 1] === currentCell)
        ) {
          return;
        }
      }
    }

    isGameOver = true;
    alert('Game Over! Try again.');
  }

  function checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (cells[row][col] === 2048) {
          has2048BeenReached = true;
          showWinMessage();
          return;
        }
      }
    }
  }

  function showWinMessage() {
    const winMessage = document.createElement('div');
    winMessage.classList.add('win-message');
    winMessage.innerText = 'You Won!';
    gameContainer.appendChild(winMessage);

    setTimeout(() => {
      winMessage.classList.add('animate');
    }, 0);
    alert('You Wonnnnnnnnnnnn ♥ ♥ ♥ congratulationssss')

  }

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

  document.addEventListener('keydown', handleKeyPress);

  function getTouchCoordinates(event) {
    if (event.touches && event.touches.length) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
    return null;
  }

  let startX = 0;
  let startY = 0;

  function handleTouchStart(event) {
    const touchCoordinates = getTouchCoordinates(event);
    if (touchCoordinates) {
      startX = touchCoordinates.x;
      startY = touchCoordinates.y;
    }
  }

  function handleTouchEnd(event) {
    const touchCoordinates = getTouchCoordinates(event);
    if (touchCoordinates) {
      const endX = touchCoordinates.x;
      const endY = touchCoordinates.y;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            move('right');
          } else {
            move('left');
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            move('down');
          } else {
            move('up');
          }
        }
      }
    }
  }

  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);

  newGame();
//   cells[0][0] = 1024;
//   cells[0][1] = 1024;

// // Update the display to reflect the change
//   updateGridDisplay();

// // Call checkWin to trigger the win animation
//   checkWin();
  
});



