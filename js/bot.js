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
// brain = players[playerId]["botBrain"]
botPool[0]["takeAll"] = true;
botPool[0]["try2win"] = false;
botPool[0]["minWrite"] = 0;
botPool[0]["take2"] = true;
botPool[0]["take5"] = true;
botPool[0]["riskDice"] = 6;

// Pamela Anders
botPool[1] = new Object();
botPool[1]["name"] = 'Pamela Anders';
botPool[1]["color"] = '#F6F';
botPool[1]["takeall"] = false;
botPool[1]["try2win"] = true;
botPool[1]["minWrite"] = 0;
botPool[1]["take2"] = false;
botPool[1]["take5"] = false;
botPool[1]["riskDice"] = 5;

// Risky Martin
botPool[2] = new Object();
botPool[2]["name"] = 'Risky Martin';
botPool[2]["color"] = '#960';
botPool[2]["takeall"] = false;
botPool[2]["try2win"] = true;
botPool[2]["minWrite"] = 450;
botPool[2]["take2"] = true;
botPool[2]["take5"] = false;
botPool[2]["riskDice"] = 3;

// Shizo Bot
botPool[3] = new Object();
botPool[3]["name"] = 'Shizo Bot';
botPool[3]["color"] = '#663';
botPool[3]["takeall"] = false;
botPool[3]["try2win"] = false;
botPool[3]["minWrite"] = 0;
botPool[3]["take2"] = false;
botPool[3]["take5"] = false;
botPool[3]["riskDice"] = 4;


/**
 * 
 * Bot functions
 */


// bot starts to dice
function botsTurn() {
    //$('body').addClass('noMouse');
    
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
    
    consoleLog('- bot summing -- ');
    
    var timer = 0;
    var timeInterval = 500;
    var brain = players[playerId]["botBrain"];
    var brainMinWrite = brain["minWrite"];
    var stopThinking = 0;
    
    // all up
    if($("#dices .dice.down").length === $("#dices .dice.countAble").length || brain["takeAll"]) {
        consoleLog('all up ');
        stopThinking = 1;
    }  
    
    // try to win
    if(!stopThinking && brain["try2win"] && endTurn === turnNr) {
        consoleLog('try2win');
        brainMinWrite = winScore - players[playerId]["total"];
    }
    
    // min write
    if(brainMinWrite<minScore) {
        consoleLog('minscore'+brainMinWrite+' < '+minScore);
        brainMinWrite = minScore;
    }
    
    var tempScore = parseInt(sumDice(''))+roundScore;
    consoleLog('tempScore: '+tempScore+' = sumDice '+parseInt(sumDice(''))+' + roundScore:'+roundScore);
    if(!stopThinking && tempScore > brainMinWrite) {
        consoleLog('stop thinking, min: '+tempScore+' > '+brainMinWrite);
        stopThinking = 1;
    }
    
    // tripple 2
    if(!stopThinking && !brain["take2"] && $("#dices .dice.down.countAble[data-value=2]").length >=3 && $("#dices .dice.down.countAble[data-value=2]").length < $("#dices .dice.countAble").length) {
        consoleLog('tribble 2');
        $("#dices .dice.down.countAble[data-value=2]").removeClass('countAble');
    }
    
    // single 5
    if(!stopThinking && !brain["take5"] && (                   
        // other countAble dices
        ($("#dices .dice.down.countAble[data-value=5]").length>0 && $("#dices .dice.down.countAble[data-value=5]").length < $("#dices .dice.countAble").length) ||
        // more than one 5  
        $("#dices .dice.down.countAble[data-value=5]").length > 1
       )) {
        
        consoleLog('check 5'); 
        
        // save tripple
        if($("#dices .dice.down.countAble[data-value=5]").length>3) {
            var lt = $("#dices .dice.down.countAble[data-value=5]").length-3;
            $('#dices .dice.down.countAble[data-value=5]:lt('+lt+')').removeClass('countAble');
            
        // save one dice    
        } else if($("#dices .dice.down.countAble[data-value=5]").length<3) {
            var lt = $("#dices .dice.down.countAble").length-1;
            $('#dices .dice.down.countAble[data-value=5]:lt('+lt+')').removeClass('countAble');
        }       
    }
    
    // countAble up
    $("#dices .dice.down.countAble").each(function(index){
        timer+= timeInterval;
        clickTimer.push($(this));
        setTimeout(function(){clickDelay();},timer);            
    });    
    
    setTimeout(function(){botThinking();},timer+100);
}

function botThinking() {
    
    consoleLog('- bot thinking -- ');
    
    var writing = false;
    var playing = false;
    var brain = players[playerId]["botBrain"];
    var brainMinWrite = brain["minWrite"];
    
    // write down?
    if(!$('#write').hasClass('inactive')) {        
        writing = true;
        consoleLog('can write');
        
        // try to win
        if(brain["try2win"] && endTurn === turnNr) {
            consoleLog('try 2 win');
            brainMinWrite = winScore - players[playerId]["total"];
        }

        // min write
        if(brainMinWrite > roundScore) {
            consoleLog('minWrite: '+brainMinWrite+' < '+roundScore);
            playing = true;
            writing = false;
        }   
        
        // risk some dice
        if($("#dices .dice.down").length >= brain["riskDice"]) {
            consoleLog('risk dice: '+$("#dices .dice.down").length+' >= '+brain["riskDice"]);
            playing = true;
            writing = false;            
        }
        
       
    // roll on?
    } else if(!$('#rolling').hasClass('inactive')){
        playing = true;          
        consoleLog('must roll');
        
    // nothing => next Player  
    } else {   
        consoleLog('next please');
        $('body').removeClass('noMouse');    
        nextTimeout = setTimeout(function(){nextPlayer();},3000);
    }
    
    // react
    if(writing) {
        consoleLog('writing');
        setTimeout(function(){write();},3000);
    } else if(playing) {
        consoleLog('playing '+roundScore+' (min: '+minScore+')');
        //alert('playing');
        botPlaying();
    }
    
}

