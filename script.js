var board;
const huPlayer = 'O';
const aiPlayer = 'X';
var won;
var human;

const winCombos = [
    [0, 4, 8], 
    [0, 1, 2],
    [0, 3, 6],
    [1, 4, 7],  
    [3, 4, 5],
    [2, 4, 6],
    [2, 5, 8],
    [6, 7, 8],
];

const cells = document.querySelectorAll('.box');

startGame();

function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    human = Math.floor(Math.random()*10)>4 ? false: true;
    won = false;
    document.querySelector(".endgame").style.display = "none";
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    if (!human)
        turn(bestSpot(), aiPlayer)
}

function turnClick(square) {
    if (!won && board[square.target.id] == '') {
        let winner;
        turn(square.target.id, huPlayer);

        winner = checkWin();
        if (winner.player != '')
            gameOver(winner);

        if (!won) {
            turn(bestSpot(), aiPlayer);
        }

        winner = checkWin();
        if (winner.player != '')
            gameOver(winner);

    }
}

function turn(id, player) {
    board[id] = player;
    document.getElementById(id).innerText = player;
}

function checkWin() {
    for (let i = 8; i >= 0; i -= 3)
        if (board[i] == board[i - 1] && board[i - 1] == board[i - 2])
            return { index: i-1, player: board[i] };
    for (let i = 0; i < 3; i++)
        if (board[i] == board[i + 3] && board[i + 3] == board[i + 6])
            return { index: i*i+2, player: board[i] };
    if (board[0] == board[4] && board[4] == board[8])
        return { index: 0, player: board[0] };
    if (board[2] == board[4] && board[4] == board[6])
        return { index: 5, player: board[2] };

    for (let i = 0; i < board.length; i++) {
        if (board[i] == '') {
            return { index: 9, player: '' };
        }
    }
    return { index: 9, player: 'T' };
}

function gameOver(gameWon) {
    won = true;
    for(let i=0; i<cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }

    if(gameWon.index != 9){
        for(let index of winCombos[gameWon.index]){
            document.getElementById(index).style.backgroundColor = 
                gameWon.player == huPlayer ? "green" : "red";
        }
    }
    else{
        for(let i=0;i<cells.length;i++){
            document.getElementById(i).style.backgroundColor = "gray";
        }
    }

    switch (gameWon.player) {
        case huPlayer:
            declareWinner("You Won!");
            break;
        case aiPlayer:
            declareWinner("You Lose!");
            break;
        case 'T':
            declareWinner("Game Tie!");
            for (let i = 0; i < cells.length; i++)
                cells[i].style.backgroundColor = "gray";
                break;
    }
}

function getMax(a, b) {
    if (a > b)
        return a;
    else
        return b
}

function getMin(a, b) {
    if (a > b)
        return b;
    else
        return a
}

function bestSpot() {
    let bestScore = -1000;
    let bestMove;
    for (let i = 0; i < board.length; i++) {
        if (board[i] == '') {
            board[i] = aiPlayer;
            let score = miniMax(board, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function miniMax(bord, isMaximizer) {
    let result = checkWin();
    if(result.player != ''){
        return charToVal(result.player);
    }

    if(isMaximizer){ 
        let bestScore = -1000;
        for(let i=0;i<board.length;i++){
            if(bord[i] == ''){
                bord[i] = aiPlayer;
                let score = miniMax(bord, false);
                bord[i] = '';
                bestScore = getMax(score, bestScore);
            }
        }
        return bestScore;
    }
    else{
        let bestScore = 1000;
        for(let i=0;i<board.length;i++){
            if(bord[i] == ''){
                bord[i] = huPlayer;
                let score = miniMax(bord, true);
                bord[i] = '';
                bestScore = getMin(score, bestScore);
            }
        }
        return bestScore;
    }
}

function charToVal(c) {
    switch (c) {
        case 'O':
            return -1;
        case 'X':
            return 1;
        case 'T':
            return 0;
        default:
            return 0;

    }
}

function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.text').innerText = who;
}
