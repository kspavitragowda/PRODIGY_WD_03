const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");

const restartBtn = document.getElementById("restart");
const resetBtn = document.getElementById("reset");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const drawScoreEl = document.getElementById("drawScore");

const label1 = document.getElementById("label1");
const label2 = document.getElementById("label2");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp";
let computerThinking = false;

const pvpScores = {
    x: 0,
    o: 0,
    draws: 0
};

const aiScores = {
    player: 0,
    computer: 0,
    draws: 0
};

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function updateScoreboard() {

    if (gameMode === "pvp") {

        label1.textContent = "X Wins";
        label2.textContent = "O Wins";

        xScoreEl.textContent = pvpScores.x;
        oScoreEl.textContent = pvpScores.o;
        drawScoreEl.textContent = pvpScores.draws;

    } else {

        label1.textContent = "Player Wins";
        label2.textContent = "Computer Wins";

        xScoreEl.textContent = aiScores.player;
        oScoreEl.textContent = aiScores.computer;
        drawScoreEl.textContent = aiScores.draws;
    }
}

function checkWinner() {

    for (let combo of winningCombinations) {

        const [a, b, c] = combo;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            if (gameMode === "pvp") {

                if (board[a] === "X") {
                    pvpScores.x++;
                } else {
                    pvpScores.o++;
                }

            } else {

                if (board[a] === "X") {
                    aiScores.player++;
                } else {
                    aiScores.computer++;
                }
            }

            updateScoreboard();

            statusText.textContent = `${board[a]} Wins!`;

            gameActive = false;
            return true;
        }
    }

    if (!board.includes("")) {

        if (gameMode === "pvp") {
            pvpScores.draws++;
        } else {
            aiScores.draws++;
        }

        updateScoreboard();

        statusText.textContent = "It's a Draw!";
        gameActive = false;

        return true;
    }

    return false;
}

function findBestMove(symbol) {

    for (let combo of winningCombinations) {

        const [a, b, c] = combo;

        const values = [board[a], board[b], board[c]];

        const symbolCount =
            values.filter(v => v === symbol).length;

        const emptyCount =
            values.filter(v => v === "").length;

        if (symbolCount === 2 && emptyCount === 1) {

            if (board[a] === "") return a;
            if (board[b] === "") return b;
            if (board[c] === "") return c;
        }
    }

    return -1;
}

function aiMove() {

    let move = -1;

    // Winning move
    move = findBestMove("O");

    // Block player
    if (move === -1) {
        move = findBestMove("X");
    }

    // Take center
    if (move === -1 && board[4] === "") {
        move = 4;
    }

    // Random move
    if (move === -1) {

        const emptyCells = board
            .map((value, index) =>
                value === "" ? index : null
            )
            .filter(index => index !== null);

        move =
            emptyCells[
                Math.floor(
                    Math.random() *
                    emptyCells.length
                )
            ];
    }

    board[move] = "O";

    cells[move].textContent = "O";
    cells[move].classList.add("o");

    computerThinking = false;

    if (checkWinner()) return;

    currentPlayer = "X";

    statusText.textContent =
        "Player X's Turn";
}

function handleCellClick(event) {

    const index = event.target.dataset.index;

    if (
        board[index] !== "" ||
        !gameActive ||
        computerThinking
    ) {
        return;
    }

    board[index] = currentPlayer;

    event.target.textContent = currentPlayer;

    if (currentPlayer === "X") {
        event.target.classList.add("x");
    } else {
        event.target.classList.add("o");
    }

    if (checkWinner()) return;

    if (gameMode === "pvp") {

        currentPlayer =
            currentPlayer === "X" ? "O" : "X";

        statusText.textContent =
            `Player ${currentPlayer}'s Turn`;

    } else {

        currentPlayer = "O";

        computerThinking = true;

        statusText.textContent =
            "Computer Thinking...";

        setTimeout(aiMove, 500);
    }
}

function restartRound() {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";
    gameActive = true;
    computerThinking = false;

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );
    });

    statusText.textContent =
        "Player X's Turn";
}

function resetGame() {

    pvpScores.x = 0;
    pvpScores.o = 0;
    pvpScores.draws = 0;

    aiScores.player = 0;
    aiScores.computer = 0;
    aiScores.draws = 0;

    updateScoreboard();
    restartRound();
}

pvpBtn.addEventListener("click", () => {

    gameMode = "pvp";

    pvpBtn.classList.add("active");
    aiBtn.classList.remove("active");

    restartRound();
    updateScoreboard();
});

aiBtn.addEventListener("click", () => {

    gameMode = "ai";

    aiBtn.classList.add("active");
    pvpBtn.classList.remove("active");

    restartRound();
    updateScoreboard();
});

cells.forEach(cell => {
    cell.addEventListener(
        "click",
        handleCellClick
    );
});

restartBtn.addEventListener(
    "click",
    restartRound
);

resetBtn.addEventListener(
    "click",
    resetGame
);

updateScoreboard();
