const infoPanel = document.querySelector("#info-panel");
const p1Score = document.querySelector("#score-p1");
const p2Score = document.querySelector("#score-p2");
const resetButton =  document.querySelector("#new-game");
let playerTurn = 0;
let gameOn = true;


const playerFactory = (score) => {
    return {score};
};

const playerOne = playerFactory(0);
const playerTwo = playerFactory(0);


const gameBoard = (() => {
    const winningCombinations = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]]
    let board = [];
    let p1Fields = [];
    let p2Fields = [];

    const makeMove = (e) => {
        fieldNumber = e.target.id.substring(5);

        if (playerTurn === 0 && board[fieldNumber - 1].symbol === "" && gameOn === true) {
            board[fieldNumber - 1].symbol = "O";
            playerTurn = 1;
            p1Fields.push(+fieldNumber);
            renderer.render();
            checkWinningConditions();
        } else if (playerTurn === 1 && board[fieldNumber - 1].symbol === "" && gameOn === true) {
            board[fieldNumber - 1].symbol = "X";
            playerTurn = 0;
            p2Fields.push(+fieldNumber);
            renderer.render();
            checkWinningConditions();
        }
    };

    const createBoard = () => {
        for (let i = 0; i < 9; i++) {
            board.push(new Field());
        }
    };

    function Field() {
        this.symbol = "";
    }

    const restartBoard = () => {
     board.length = 0;
     p1Fields.length = 0;
     p2Fields.length = 0;
     createBoard();
     gameOn = true;
     renderer.render();
     infoPanel.textContent = "Game restarted!"
    }

    const checkWinningConditions = () => {
        p1Fields.sort();
        p2Fields.sort();
        winningCombinations.forEach(element => {
            if (arrayContainsArray(p1Fields, element)) {
                infoPanel.textContent = "Player one win!";
                gameOn = false;
                renderer.updateScore(1);
            } else if (arrayContainsArray(p2Fields, element)) {
                infoPanel.textContent = "Player two win!"
                gameOn = false;
                renderer.updateScore(2);
            } else if (board.every((element) => element.symbol != "") && gameOn === true) {
                infoPanel.textContent = "It's a tie!"
                gameOn = false;
            }
        })

    }

    const arrayContainsArray = (superset, subset) => {
        if (0 === subset.length) {
            return false;
        }
        return subset.every(function (value) {
            return (superset.indexOf(value) >= 0);
        });
    }

    return {
        board,
        createBoard,
        makeMove,
        restartBoard
    };


})();

const renderer = (() => {
    const render = function () {
        for (let i = 1; i <= 9; i++) {
            let fieldName = "#field" + i;
            document.querySelector(fieldName).textContent = gameBoard.board[i - 1].symbol;
        }
    };

    const addLiesteners = function () {
        for (let i = 1; i <= 9; i++) {
            let fieldName = "#field" + i;
            document.querySelector(fieldName).addEventListener("click", gameBoard.makeMove);
            resetButton.addEventListener("click",gameBoard.restartBoard);
        }
    };

    const updateScore = function (id) {
        if (id === 1) {
            playerOne.score++;
        } else if (id === 2) {
            playerTwo.score++;
        }
        p1Score.textContent = playerOne.score;
        p2Score.textContent = playerTwo.score;
    }

    return {
        render,
        addLiesteners,
        updateScore

    }


})();


gameBoard.createBoard();
renderer.addLiesteners();
renderer.render();