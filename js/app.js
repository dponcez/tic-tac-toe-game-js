const initGame = () => {

  // Create all variables we need for the game
  const X_USER_OPTION = 'X';
  const O_USER_OPTION = 'O';
  const winnerCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let timeout;
  let spaces = [];
  let running = false;
  let currentPlayer = X_USER_OPTION;
  let boxIndicator = getComputedStyle(document.body).getPropertyValue('--box-indicator');

  // Create an object variable called (options)
  const options = {
    modalContainer: document.querySelector('[data-modal]'),
    startButton: document.querySelector('[data-start]'),
    resetButton: document.querySelector('[data-reset]'),
    closeModalButton: document.querySelector('[data-close-modal]'),
    infoContainer: document.querySelector('[data-info]'),
    boxes: document.querySelectorAll('[data-box]')
  }

  // Destructure the options variable
  const {
    startButton, 
    resetButton, 
    closeModalButton, 
    boxes, 
    modalContainer, 
    infoContainer,
  } = options;

  // Create start game function:
  // allow the user to start the current game.
  const startGame = () => {
    if(!running){
      resetButton.style.display = 'block';
      startButton.style.display = 'none'
    }
    
    // enable cells or boxes
    boxes.forEach(box => box.disabled = false)
  }

  // Create reset game function:
  // allow the user to restart or clean the game when done.
  const resetGame = () => {
    if(!running){
      startButton.style.display = 'block';
      resetButton.style.display = 'none'
    }

    spaces.fill(null)

    // clean and disable cells or boxes
    boxes.forEach(box => {
      box.innerText = '';
      box.disabled = true;
      box.style.backgroundColor = 'transparent'
    });

    // start with the current player
    currentPlayer = X_USER_OPTION
  }

  const closeModal = () => modalContainer.classList.remove('active')
  
  // Create handle box clicking function:
  // let the user click over the cells.
  const handleBoxClick = (e) => {
    const ids = e.target.id;

    if(!spaces[ids]){
      spaces[ids] = currentPlayer;
      e.target.innerText = currentPlayer;

      if(checkWinner() !== false){
        showMessage();
        
        // The code snippet below can be found
        // at the following link: https://www.youtube.com/watch?v=oZrp3Atkz18&t=1001s
        const winner = checkWinner();
        winner.map((box) => {
          boxes[box].style.backgroundColor = boxIndicator;
          boxes[box].style.color = "hsl(227 55% 12%)";
        });

        return;
      }

      currentPlayer = 
        (currentPlayer === X_USER_OPTION) ? 
          O_USER_OPTION : 
          X_USER_OPTION
    }
  }

  const showMessage = () => {
    if(currentPlayer && !running){
      modalContainer.classList.add('active');

      const inner = `
        <i class="icon fa-solid fa-thumbs-up"></i>
        <p class="info">${currentPlayer} <span class="win--lose">wins</span>!</p>
      `;
      infoContainer.innerHTML = inner;

      running = false
    }
  }

  // Create check winner function:
  // let the user know who wins the game.
  // The code snippet below can be found
  // at the following link: https://www.youtube.com/watch?v=oZrp3Atkz18&t=1001s
  const checkWinner = () => {
    for (const condition of winnerCombination) {
      const [a, b, c] = condition;
      if(spaces[a] && ( spaces[a] === spaces[b] && spaces[a] === spaces[c] )){
        return [a, b, c]
      }
    }

    return false
  }

  // Create event handler function
  const handleEvent = (element, event, callback) => {
    element.addEventListener(event, callback)
  }

  // iterate through each of the cells or boxes
  const iterateElements = (elements, event, callback) => {
    elements.forEach(element => element.addEventListener(event, callback))
  }

  // disable cells or boxes
  boxes.forEach(box => box.disabled = true);
  
  // Call our event handler function
  handleEvent(startButton, 'click', startGame);
  handleEvent(resetButton, 'click', resetGame);
  handleEvent(closeModalButton, 'click', closeModal);
  iterateElements(boxes, 'click', handleBoxClick)
}

document.addEventListener('DOMContentLoaded', initGame);