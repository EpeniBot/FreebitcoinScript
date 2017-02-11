// rebuilt by Wlacu.com
// Source link used: https://crd.ht/2N7QJYt

/**     PLEASE READ!!!      ****************************************************
 *
 * This script was really messy, I remade it completely, for people who
 * just want to learn Javascript and need a fun example.
 *
 *  Please support me by creating your account through this link:
 *  http://freebitco.in/?r=481926
 *
 *  You do not lose anything, I just get a little bonus, for having referred you :)
 *
 * ******************************************************************************
 */

/**     INSTRUCTIONS
 *
 * To run this bot, enter your Google Chrome Console by pressing "Ctrl+Shift+J"
 *
 * Let this Bot run for a while, once it catches on a "trend" it will keep earning
 *
 */


// Here we first clean up our console:
console.clear();

// next we add Variables needed in the script,
// to make this script clearly readable, we first declare variables, that do not change:
// (notice how beautifully you can do that, also how "," and ";" are used.)

var
    totalStartbalance = $('#balance').text(),
    maxWait = 100,      // as we don't want any hickups with TCP response, "," for ending of the variable
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
    betOverProfit = false;


// Unbind if you used this code before
//
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

// this replaces the "advertise" Button with our "Start Bot" Button on the website
document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="startGame()" class="advertise_link">CONFIGURE BOT</a>';

//the following disables the auto start, to make sure you don't trigger some insane parallel processing stuff
document.getElementById("auto_betting_button").innerHTML = '<a href="#" onclick="stopGame()" style="visibility: hidden" class="auto_bet_element">DISABLED</a>';

function reset() {
    $('#double_your_btc_stake').val(startBet);
    currentBet = startBet;
}

function check() {
    updateConsole();
    if (profit >= stopToWithdrawAt) {
        forceStop("Congratulations, you can now withdraw your money!!");
        return false;
    }
    if (newBet < profit || betOverProfit == true || profit < 0.00000004) {
        if (newBet <= maxBet || (newBet < profit /** 2 */ || profit < 0.00000004 && profit > 0.00000000) || betOverProfit == true) { // || round < 2) {
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


function updateValues() {
    if (currentBet > highestBet) {
        highestBet = currentBet;
    }
    currentBet = $('#double_your_btc_stake').val();
    currentBalance = $('#balance').text();
    profit = (Number(currentBalance) - Number(startBalance)).toFixed(8);
    if (profit < minProfit && stopAtMinProfit == true) {
        stopGame();
    }
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
    currentTime = Math.floor((new Date().getTime() - starttime ) / 1000);
    console.log("Options: changeBet(int) , stopGame()");
    console.log('Current Bet = ' + currentBet);
    console.log('New Bet = ' + newBet);
    if (msg) {
        console.log(msg);
    }
    if (stopped) {
        console.log("stopped!");
    }
}


$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

bind();

function startGame() {
    gameRunning = true;
    startBalance = $('#balance').text();
    if (startBalance < 0.00003000){
        prompt("You do not have enough BTC, this is too risky! please collect at least 0.00003000 BTC")
        return false;
    }
    if (startBalance == 0) {
        forceStop("no money left!");
        return;
    }
    // first we change our Button's text and tell it to stop our Bot, if it is clicked again:
    document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="stopGame()" class="advertise_link">STOP BOT</a>';
    stopped = false;
    forceStopped = false;
    // now let's get the time when this bot executed (could also be on top)
    starttime = (new Date()).getTime();
    highestBet = 0;
    // prompt is usefull to make enter our configs pre start
    if (!alreadyrun) {
        startBet = prompt("Number of satoshi you want to bet?", '0.00000001');
        stopAt = prompt("Enter the Number of Rounds you want to play.", '5000');
        maxBet = prompt("Enter the Maximum Bet", '0.00002048');
        betoverprofit = prompt("Bet over Profit? It ensures, you won't lose. Game will stop if bet would be higher than your profit. (true/false)", 'false');
        stopAtMinProfit = prompt("Should I stop when I go below the minimal Profit? (true/false)", "false");
        if (stopAtMinProfit == true) {
            minProfit = prompt("What should the minimal Profit be then?", '-0.00000005');
        }
    } else {
        if (!runAsLoop) {
            runAsLoop = prompt("Should this run as a loop and restart if it stops? (true/false)", 'false');
            reset();
        }
    }
    alreadyrun = true;
    // using JQuery we get our scope to the balance element of our html, then get it's text and then we save it as our startBalance as a reference

    // setting lastbet to our startBet, as we haven't played a round yet.
    lastbet = startBet;
    round = 0;
    gamesLost = 0;
    gamesWon = 0;
    console.log('Game started!');
    reset();
    roll();
}


function stopGame() {
    gameRunning = false;
    updateConsole();
    document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="startGame()" class="advertise_link">RESTART BOT</a>';
    console.log('Game will stop soon! Let me finish.');
    stopped = true;
}


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
    stopped = true;
    forceStopped = true;
}

function doubleBet() {
    currentBet = $('#double_your_btc_stake').val();
    newBet = (currentBet * 2).toFixed(8);

    $('#double_your_btc_stake').val(newBet);
    updateConsole();

}

function roll() {
    updateConsole();
    if (round >= stopAt) {
        stopGame()
    }
    // checks if it should roll or not
    if (!check()) {
        forceStop("check failed!");
        return false;// forceStop("stopped roll");
    }
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
    updateConsole();
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


var running = false;
function bind() {

//
    $('#double_your_btc_bet_lose').bind("DOMSubtreeModified", function (event) {
            if ($(event.currentTarget).is(':contains("lose")')) {
                if (!running && gameRunning) {
                    running = true;
                    gamesLost++;
                    console.log('You LOST! Doubling Bet...');
                    doubleBet();
                    if (forceStopped) {
                        forceStopped = false;
                        if (!runAsLoop) {
                            return false;
                        } else {
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

// Winner
    $('#double_your_btc_bet_win').bind("DOMSubtreeModified", function (event) {
            if ($(event.currentTarget).is(':contains("win")')) {
                if (!running && gameRunning) {
                    running = true;
                    gamesWon++;
                    console.log('You WON!');
                    if (stopBeforeRedirect()) {
                        return;
                    }
                    reset();
                    if (stopped) {
                        stopped = false;
                        return false;
                    }
                    if (forceStopped) {
                        forceStopped = false;
                        if (!runAsLoop) {
                            return false;
                        } else {
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































