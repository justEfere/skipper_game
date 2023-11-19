//! UI Components
const players = document.querySelector(".players");
const player = document.querySelector("#player");
const gameOverText = document.querySelector(".gameOver")
const playState = document.querySelector(".playState");
const scoreEl = document.querySelector(".score_count");
const highScore = document.querySelector(".score_value");
const reset = document.querySelector(".reset");


// console log info btn
const consoleBtn = document.querySelector(".log");

consoleBtn.addEventListener("click", function (e) {
    e.target.classList.toggle("active");
})



const playPauseRestart = document.querySelector(".pause-pause-restart");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

//! comps
const comp1 = document.querySelector("#comp_one")
const comp2 = document.querySelector("#comp_two");





//! reset high score
reset.addEventListener("click", function () {
    localStorage.setItem("Score", 0);
    highScore.innerHTML = localStorage.getItem("Score");
})

//! comp functions
// function for random comp-X-positions
function randLimit() {
    return Math.floor(Math.random() * 3);
}

// X-asix position fixer
function generateRand() {
    let X1 = randLimit();
    let X2 = randLimit();
    if (X1 === X2) {
        [X1, X2] = [1, 0];
    }
    return [X1, X2];
}




//! new generator
function generateCom(pos1, step) {
    return `M${pos1} ${step} h20 v20 h 30 v20 h-15 v20 h15 v20 h-30 v-20 h-20 v20 h-30 v-20 h15 v-20 h-15 v-20 h30 z`;
}


// collision
//! Didn't Work
function Collision(c1, c2, c3, c4, p1, interval) {
    if (((c1 === p1) || (c2 === p1)) && ((Number(c3) >= 231) || (Number(c4) >= 240))) {
        gameOverText.classList.add("showLoss");
        clearInterval(interval);
    }
}

let score = 0;
highScore.innerHTML = localStorage.getItem("Score") ?? "0000";
// updateScore(score);
// move with position
function moveComp() {
    let [x1, x2] = generateRand()
    let step = 0;
    const mover = setInterval(() => {

        const positions = [30, 110, 190];
        // add score and begin
        if (step == 400) {
            [x1, x2] = generateRand();
            step = 0;
            score += 10;
            updateScore(score);

            if (score > localStorage.getItem("Score")) {
                updateLocalStorage(score);
                highScore.innerHTML = score;
            }

        }

        // increase speed
        if (score > 20) {
            step += 15; // anything more than 15 did not work
        }
        step += 10;

        const [pos1, pos2] = [positions[x1], positions[x2]];

        const comp1_pos = generateCom(pos1, step);
        const comp2_pos = generateCom(pos2, step);

        const [c1, c2, c3, c4] = [comp1_pos.split(" ")[0], comp2_pos.split(" ")[0], Number(comp1_pos.split(" ")[1]), Number(comp2_pos.split(" ")[1])]

        // player Position
        const playerPos = player.getAttribute("d");
        const [p1, p2] = [playerPos.split(" ")[0], Number(playerPos.split(" ")[1])]

        // log
        if (consoleBtn.classList.contains("active")) {
            console.log(`c1-X: ${c1}, c2-X: ${c2}, c3-Y: ${c3}, c4-Y: ${c4}, p1-X: ${p1}, p2-Y: ${p2}`);
        }


        //! collision
        if (((c1 === p1) || (c2 === p1)) && ((Number(c3) >= 240) || (Number(c4) >= 240))) {
            gameOverText.classList.add("showLoss");
            playState.innerHTML = "restart_alt";
            score = 0;
            clearInterval(mover);
            [leftBtn, rightBtn].forEach((item) => {
                item.disabled = true;
            })
        }


        comp1.setAttribute("d", comp1_pos);
        comp2.setAttribute("d", comp2_pos);
    }, 100);

    return mover;

}
// moveComp();

function updateScore(value) {
    scoreEl.innerHTML = value;
}

function updateLocalStorage(newValue) {
    localStorage.setItem("Score", newValue);
}



function playType_two() {
    let [x1, x2] = generateRand()
    let step = 0;
    const mover2 = setInterval(() => {
        if (step == 400) {
            [x1, x2] = generateRand();
            step = 0;
        }
        const positions = [30, 110, 190];

        const [pos1, pos2] = [positions[x1], positions[x2]];

        const comp1_pos = generateCom(pos1, step);
        const comp2_pos = generateCom(pos2, step);

        comp1.setAttribute("d", comp1_pos);
        comp2.setAttribute("d", comp2_pos);

        step += 10;

    }, 100);
    return mover2;
}

// playType_two();



//! play, pause and stop buttons
// let state = playState.innerHTML;
let stopInterval;
playPauseRestart.addEventListener("click", function () {
    const state = playState.innerHTML.trim();
    if ((state === "play_circle") || (state === "restart_alt")) {
        if (gameOverText.classList.contains("showLoss")) {
            gameOverText.classList.remove("showLoss");
        }
        stopInterval = moveComp();
        playState.innerHTML = "";
        playState.innerHTML = "pause_circle";
        [leftBtn, rightBtn].forEach((item) => {
            item.disabled = false;
        })
        // stopInterval = playType_two();
    } else if (playState.innerHTML.trim() === "pause_circle") {
        clearInterval(stopInterval);
        score = 0;
        playState.innerHTML = "";
        playState.innerHTML = "play_circle";
    }
})



//! Player Controller
let playerAttr = player.getAttribute("d");
let playerPos = Number(playerAttr.split(" ")[0].slice(1));

//! Move Player along X-axis
// buttons
leftBtn.addEventListener("click", (e) => {
    const [pos1, pos2] = player.getAttribute("d").split(" ");
    // console.log(pos1, Number(pos2));
    if (playerPos === 30) {
        return;
    } else {
        playerPos -= 80;
        player.setAttribute("d", "M" + playerPos + " 310 h20 v20 h 30 v20 h-15 v20 h15 v20 h-30 v-20 h-20 v20 h-30 v-20 h15 v-20 h-15 v-20 h30 z");
    }

})

rightBtn.addEventListener("click", () => {
    if (playerPos === 190) {
        return;
    } else {
        playerPos += 80;
        player.setAttribute("d", "M" + playerPos + " 310 h20 v20 h 30 v20 h-15 v20 h15 v20 h-30 v-20 h-20 v20 h-30 v-20 h15 v-20 h-15 v-20 h30 z");
        // console.log(player);
    }
})

// keyboard arrow keys
function keyPress() {
    document.addEventListener("keydown", (e) => {
        // console.log(e.code)

        if (gameOverText.classList.contains("showLoss")) {
            return;
        } else {
            if (e.key == "ArrowLeft") {
                if (playerPos === 30) {
                    return;
                } else {
                    playerPos -= 80;
                    player.setAttribute("d", "M" + playerPos + " 310 h20 v20 h 30 v20 h-15 v20 h15 v20 h-30 v-20 h-20 v20 h-30 v-20 h15 v-20 h-15 v-20 h30 z");
                    // console.log(player);
                }
            }
            if (e.key == "ArrowRight") {
                if (playerPos === 190) {
                    return;
                } else {
                    playerPos += 80;
                    player.setAttribute("d", "M" + playerPos + " 310 h20 v20 h 30 v20 h-15 v20 h15 v20 h-30 v-20 h-20 v20 h-30 v-20 h15 v-20 h-15 v-20 h30 z");
                    // console.log(player);
                }
            }
        }


        if (e.code == "Space") {
            if (playState.innerHTML.trim() == "play_circle" || playState.innerHTML.trim() == "restart_alt") {
                if (gameOverText.classList.contains("showLoss")) {
                    gameOverText.classList.remove("showLoss");
                }
                playState.innerHTML = "pause_circle";
                stopInterval = moveComp();
            } else if (playState.innerHTML === "pause_circle") {
                clearInterval(stopInterval);
                score = 0;
                playState.innerHTML = "play_circle";
            }
        }
    })
}



window.addEventListener("load", keyPress());
window.addEventListener("load", function () {
    playState.innerHTML = "play_circle";
});
// console.log(playState)






// //! dummy function
// //! generate random 6-alphanumeric IDs
function generateID() {
    const randAlp = ["a", "b", "c", "d", 'e', "f", 1, 2, 3, 4, 5];
    let id = [];
    for (var i = 0; i <= 6; i++) {
        id.push(randAlp[Math.floor(Math.random() * randAlp.length)]);
    }
    return id.join("");
}
function generatePlayer(x1, x2, step) {

    const positions = [30, 110, 190];

    const comp3_pos = `M${positions[x1]} ${step} h20 v20 h 30 v20 h-15 v20 h15 v20 h-30 v-20 h-20 v20 h-30 v-20 h15 v-20 h-15 v-20 h30 z`;
    const comp4_pos = `M${positions[x2]} ${step} h20 v20 h 30 v20 h-15 v20 h15 v20 h-30 v-20 h-20 v20 h-30 v-20 h15 v-20 h-15 v-20 h30 z`;
}