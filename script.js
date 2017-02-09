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


/**
 * TODO: let this bot save when collecting 100 satoshi
 *
 *
 *
 */
// Here we first clean up our console:
console.clear();

// next we add Variables needed in the script,
// to make this script clearly readable, we first declare variables, that do not change:
// (notice how beautifully you can do that, also how "," and ";" are used.)

var
    maxWait = 100,      // as we don't want any hickups with TCP response, "," for ending of the variable
    minWait = 1000,     // we don't want to wait too long either ;-), ";" to end the whole declaration
    stopBefore = 3;     // As the site refreshes 60 Minutes after getting "free btc", we stop the bot, when it's 3 Minutes left.
$lowButton = $('#double_your_btc_bet_lo_button'),
    $highButton = $('#double_your_btc_bet_hi_button');


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
    betOverProfit = false;


// Unbind if you used this code before
//
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

// this replaces the "advertise" Button with our "Start Bot" Button on the website
document.getElementById("advertise_link_li").innerHTML = '<a href="#" onclick="startGame()" class="advertise_link">CONFIGURE BOT</a>';

function reset() {
    $('#double_your_btc_stake').val(startBet);
    currentBet = startBet;
}


function startGame() {
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
            minProfit = prompt("What should the minimal Profit be then?", "-0.00000005")
        }
    }
    alreadyrun = true;
    // using JQuery we get our scope to the balance element of our html, then get it's text and then we save it as our startBalance as a reference
    startBalance = $('#balance').text();

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
    forceStopped = true;
}

function doubleBet() {
    currentBet = $('#double_your_btc_stake').val();
    newBet = (currentBet * 2).toFixed(8);
    updateConsole();
    if (newBet < profit || betOverProfit == true || profit < 0.00000002) {
        if (newBet <= maxBet || betOverProfit == true) {
            $('#double_your_btc_stake').val(newBet);
            currentBet = newBet;
        } else {
            forceStop("Sorry, maximum Bet reached!");
        }
    } else {
        forceStop("Sorry, Bet would be higher or equal to profit! 1");
    }
}

function roll() {
    currentBet = $('#double_your_btc_stake').val();
    updateConsole();
    if (round >= stopAt) {
        stopGame()
    }
    if (forceStopped) {
        return false;
    }
    if (betOverProfit == false) {
        if (currentBet >= profit && profit > 0.00000004) {
            forceStop("Sorry, Bet would be higher or equal to profit! 2");
        }
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

function updateConsole(msg) {
    updateValues();

    console.clear();

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


//
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified", function (event) {
        if ($(event.currentTarget).is(':contains("lose")')) {
            if (forceStopped) {
                updateConsole();
                return false;
            }
            gamesLost++;
            console.log('You LOST! Doubling Bet...');
            doubleBet();
            if (forceStopped) {
                return false;
            }
            roll();
        }
    }
);

// Winner
$('#double_your_btc_bet_win').bind("DOMSubtreeModified", function (event) {
        if ($(event.currentTarget).is(':contains("win")')) {
            if (forceStopped) {
                updateConsole();
                return false;
            }
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
                return false;
            }
            roll();
        }

    }
);


console.clear();
console.log("thank you for using my script, yours Wladastic!");































