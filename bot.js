
// bot starts to dice
function botsTurn() {
    console.log('01011010100011101100101010!');
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
    //if($("#dizes img.down").length === $("#dizes img.countAble").length) {
        $("#dizes img.down.countAble").each(function(index){
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
       setTimeout(function(){write();},1500);
    } else if(!$('#rolling').hasClass('inactive')){
         botPlaying();
    } else {        
        setTimeout(function(){nextPlayer();},1500);
    }
    
}

