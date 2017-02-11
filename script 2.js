/**
 * Created by Wladislav on 11.02.2017.
 */
console.clear();

// next we add Variables needed in the script,
// to make this script clearly readable, we first declare variables, that do not change:
// (notice how beautifully you can do that, also how "," and ";" are used.)

var
    totalStartbalance = $('#balance').text(),
    maxWait = 200,      // as we don't want any hickups with TCP response, "," for ending of the variable
    minWait = 1000,     // we don't want to wait too long either ;-), ";" to end the whole declaration
    stopBefore = 3;     // As the site refreshes 60 Minutes after getting "free btc", we stop the bot, when it's 3 Minutes left.
$lowButton = $('#double_your_btc_bet_lo_button'),
    $highButton = $('#double_your_btc_bet_hi_button'),
    saveBalancePercent = 2, // if profit reaches this percentage, the game will reset.
    stopToWithdrawAt = 0.00033000; // amount at which we stop to make a transaction to our btc wallet!!

// now we declare Variables we want to change:

var
    minProfit,          // if this value is set, the Bot will stop if it's profit is below this level
    stopAtMinProfit = false,
    stopAt = 5000,      // to make sure, we don't forget our script, it will stop at 5000.
    round,              // this variable will hold our round number, we will give it a new value when we start a game.
    gamesLost,
    gamesWon,
    highestBet = 0,
    startBalance,
    startTime,
    stopped,
//    maxBet= 0.00001024, //you can remove this one, it may or may not be obsolete...
    startBet = '0.00000001', //this is my preference
    currentBet,
    newBet,
    lastbutton,
    profit,
    currentBalance,
    currentTime,
    forceStopped = false,
    alreadyrun = false,
    runAsLoop = false,
    gameRunning = false,
    restarted = false,
    betOverProfit = false;


/**
 * TODO: remove events and let the script check itself, so no parralel processing is possible
 * TODO: add half to win, so that on a lose you will double and on win you don't reset, but put currentBet on 50%
 */






// Unbind if you used this code before
//
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

// this replaces the "advertise" Button with our "Start Bot" Button on the website
document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="startGame()" class="advertise_link">CONFIGURE BOT</a>';

//the following disables the auto start, to make sure you don't trigger some insane parallel processing stuff
document.getElementById("auto_betting_button").innerHTML = '<a href="#" onclick="stopGame()" style="visibility: hidden" class="auto_bet_element">DISABLED</a>';


function getRandomWait() {
    var wait = Math.floor(Math.random() * maxWait) + 100; //(Math.floor(Math.random() * 800) + 300)  ; // avant 100
    if (wait > minWait) wait = minWait;
    console.log('Waiting for ' + wait + 'ms before next bet.');
    return wait;
}
function forceStop(msg) {
    updateConsole(msg);
    document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="startGame()" class="advertise_link">RESTART BOT</a>';
    console.log('Game stopping!');
    if (!restarted) {
        console.log("not restarting!");
        stopped = true;
    }
    forceStopped = true;
}


function reset() {
    $('#double_your_btc_stake').val(startBet);
    currentBet = startBet;
    newBet = startBet;
}

function restart() {
    reset();
    restarted = true;
    forceStop("restarted!");
}


$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

bind();


function check() {
    updateConsole();
    if (currentBalance >= stopToWithdrawAt) {
        forceStop("Congratulations, you can now withdraw your money!!");
        return false;
    }
    if (profit >= startBalance * saveBalancePercent / 100) {
        restart();
        return false;
    }
    if (betOverProfit || newBet <= profit || round < 3) {
        if ((currentBet <= maxBet /** 2 */ || betOverProfit == true) && currentBet < currentBalance) { // || round < 2) {
            return true;
        } else {
            forceStop("Sorry, maximum Bet reached!");
            return false;
        }
    } else {
        forceStop("Sorry, Bet would be higher or equal to profit! 1");
        return false;
    }
}

//this function returns the value true, if the title says it's about to redirect in an amount of minutes smaller than we set earlier.
function stopBeforeRedirect() {
    var minutes = parseInt($('title').text());
    if (minutes < stopBefore) {
        console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
        stopGame();
        return true;
    }
    return false;
}


function roll() {
    updateConsole();
    if (round >= stopAt) {
        stopGame()
    }
    // checks if it should roll or not
    if (check()) {
        round++;
        if (!lastbutton) {
            $lowButton.trigger('click');
            lastbutton = "lo";
        } else {
            setTimeout(function () {
                if (lastbutton == "hi") {
                    $lowButton.trigger('click');
                    lastbutton = "lo";
                } else {
                    $highButton.trigger('click');
                    lastbutton = "hi";
                }
            }, getRandomWait());
        }
    }
    updateConsole();
    if (restarted) {
        startGame();
        return false;
    }
}

function stopGame() {
    updateConsole();
    document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="startGame()" class="advertise_link">RESTART BOT</a>';
    console.log('Game will stop soon! Let me finish.');
    stopped = true;
}


function startGame() {
    updateConsole();
    gameRunning = true;
    startBalance = $('#balance').text();
    if (startBalance == 0) {
        forceStop("no money left!");
        return;
    }
    // first we change our Button's text and tell it to stop our Bot, if it is clicked again:
    document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="stopGame()" class="advertise_link">STOP BOT</a>';
    stopped = false;
    forceStopped = false;
    // now let's get the time when this bot executed (could also be on top)
    startTime = (new Date()).getTime();
    highestBet = 0;
    // prompt is usefull to make enter our configs pre start
    if (!alreadyrun) {
        startBet = '0.00000001';
        stopAt = prompt("Enter the Number of Rounds you want to play.", '5000');
        maxBet = prompt("Enter the Maximum Bet", '0.00002048');
        betOverProfit = prompt("Bet over Profit? It ensures, you won't lose. Game will stop if bet would be higher than your profit. (true/false)", 'false');
        stopAtMinProfit = prompt("Should I stop when I go below the minimal Profit? (true/false)", "false");
        if (stopAtMinProfit == true) {
            minProfit = prompt("What should the minimal Profit be then?", '-0.00000005');
        }
    } else {
        if (!runAsLoop || !restarted) {
            if (running){
                prompt("something went wrong, close this window to avoid damage.");
            }
            runAsLoop = prompt("Should this run as a loop and restart if it stops? (true/false)", 'false');
            reset();
        }
    }
    restarted = false;
    alreadyrun = true;
    // using JQuery we get our scope to the balance element of our html, then get it's text and then we save it as our startBalance as a reference

    // setting lastbet to our startBet, as we haven't played a round yet.

    round = 0;
    gamesLost = 0;
    gamesWon = 0;
    console.log('Game started!');
    reset();
    roll();
}

function doubleBet() {
    currentBet = $('#double_your_btc_stake').val();
    newBet = (currentBet * 2).toFixed(8);

    $('#double_your_btc_stake').val(newBet);
    updateConsole();

}

function updateValues() {
    if (currentBet > highestBet) {
        highestBet = currentBet;
    }
    currentBet = $('#double_your_btc_stake').val();
    currentBalance = $('#balance').text();
    profit = (Number(currentBalance) - Number(startBalance)).toFixed(8);
}

function updateConsole(msg) {
    updateValues();

    console.clear();
    console.log("Total Startbalance: " + totalStartbalance);
    console.log("Current balance:" + currentBalance);
    console.log('Round #' + round + ' / ' + stopAt);
    console.log('Profit: ' + profit + ' Bitcoin');
    console.log('Highest bet: ' + highestBet);
    console.log('Won: ' + gamesWon + ' Lost: ' + gamesLost);
    currentTime = Math.floor((new Date().getTime() - startTime ) / 1000);
    console.log("Options: changeBet(int) , stopGame(), runAsLoop = true/false;");
    console.log('Current Bet = ' + currentBet);
    console.log('New Bet = ' + newBet);
    if (msg) {
        console.log(msg);
    }
    if (stopped) {
        console.log("stopped!");
    }
}


var running = false;
function bind() {

    $('#double_your_btc_bet_lose').bind("DOMSubtreeModified", function (event) {
            if ($(event.currentTarget).is(':contains("lose")')) {
                if (!running) {
                    running = true;
                    gamesLost++;
                    console.log('You LOST! Doubling Bet...');
                    doubleBet();
                    if (restarted) {
                        running = false;
                        startGame();
                        return false;
                    }
                    if (forceStopped) {
                        forceStopped = false;

                        if (!runAsLoop) {
                            console.log("not running as a loop, so I stop here");
                            running = false;
                            return false;
                        } else {
                            running = false;
                            startGame();
                            return false;
                        }
                    }
                    roll();
                    if (restarted) {
                        startGame();
                        return false;
                    }
                    if (forceStopped) {
                        forceStopped = false;

                        if (!runAsLoop) {
                            running = false;
                            return false;
                        } else {
                            running = false;
                            startGame();
                            return false;
                        }
                    }
                    running = false;
                } else {
                    console.log("Parallel process stopped at lose, to prevent chaos!");
                    return false;
                }
            }
        }
    );
    $('#double_your_btc_bet_win').bind("DOMSubtreeModified", function (event) {
            if ($(event.currentTarget).is(':contains("win")')) {
                if (!running || true) {
                    running = true;
                    gamesWon++;
                    console.log('You WON!');
                    //if (stopBeforeRedirect()) {
                     ////}
                    reset();
                    if (stopped && !restarted) {
                        stopped = false;
                        running = false;
                        return false;
                    }
                    if (forceStopped) {
                        forceStopped = false;
                        if (restarted) {
                            startGame();
                            running = false;
                            return false;
                        }
                        if (!runAsLoop) {
                            running = false;
                            return false;
                        } else {
                            running = false;
                            startGame();
                            return false;
                        }
                    }
                    roll();
                    running = false;
                } else {
                    console.log("Parallel process stopped");
                    return false;
                }
            }

        }
    );

}

console.clear();
console.log("thank you for using my script, yours Wladastic!");


