/**
 * 
 * Pool of diffrent Bots
 */

// Bots
var botPool = new Array();

// stupid machine
botPool[0] = new Object();
botPool[0]["name"] = 'Stupid Machine';
botPool[0]["color"] = '#630';

// Pamela Anders
botPool[1] = new Object();
botPool[1]["name"] = 'Pamela Anders';
botPool[1]["color"] = '#F6F';

// Risky Martin
botPool[2] = new Object();
botPool[2]["name"] = 'Risky Martin';
botPool[2]["color"] = '#960';

// Shizo Bot
botPool[3] = new Object();
botPool[3]["name"] = 'Shizo Bot';
botPool[3]["color"] = '#663';


/**
 * 
 * Bot functions
 */


// bot starts to dice
function botsTurn() {
    $('body').addClass('noMouse');
    
    botPlaying();
}

function botPlaying() {
    
    setTimeout('letsRoll()',1500);
    setTimeout('botSumming()',2600);   
}

var clickTimer = new Array();
var clickTimerIndex = 0;

function clickDelay(){
    clickTimer[clickTimerIndex].click();
    clickTimerIndex++;
}

function botSumming() {
    
    var timer = 0;
    var timeInterval = 500;
    
    // all up
    //if($("#dices .dice.down").length === $("#dices .dice.countAble").length) {
        $("#dices .dice.down.countAble").each(function(index){
            timer+= timeInterval;
            clickTimer.push($(this));
            setTimeout(function(){clickDelay();},timer);            
        });
    //}  
    
    setTimeout(function(){botThinking();},timer+100);
}

function botThinking() {
    
    // write
    if(!$('#write').hasClass('inactive')) {
       setTimeout(function(){write();},3000);
    } else if(!$('#rolling').hasClass('inactive')){
        botPlaying();
    } else {    
        $('body').removeClass('noMouse');    
        nextTimeout = setTimeout(function(){nextPlayer();},3000);
    }
    
}

