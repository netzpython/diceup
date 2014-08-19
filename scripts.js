
// Players
var players = new Array('Pamela', 'Christian');

// index current Player
var playerId = 0;

// number of throws
var roundNr = 0;

// number of turns
var turnNr = 1;

// min score to beat
var minScore = 350;

// current score
var curScore = 0;

// current score
var roundScore = 0;

$(document).ready(function() {
    
    // bind dices click
    upDown();   
    
    // create players table
    playersTable();
});


/**
 * create the Player columns 
 */
function playersTable() {
    // columns
    $.each(players, function( index, value ) {
        $('#players').append('<div id="player_'+index+'" class="playerColumn"><h3>'+value+'</h3><div class="total">0</div><div data-player="'+index+'" class="scores"></div></div>');
    });
    
    // current Player
    $('#curPlayer span').html(players[0]);
}


function write(){  
            
    $('#player_'+playerId+' .scores').append(roundScore+'<br/>');
    
    var newScore = parseInt($('#player_'+playerId+' .total').html())+roundScore;
    $('#player_'+playerId+' .total').html(newScore);
    
    //  min score
    minScore = roundScore+50;
    
    // nextPlayer
    nextPlayer(1);
}

function nextPlayer(written) {
    if(!written){
        $('#player_'+playerId+' .scores').append('0<br/>');
        minScore = 350;
    }
    
    // next player
    playerId++;
    
    if(playerId==players.length){
        playerId = 0;
    }
    
    // show current Player
    $('#curPlayer span').html(players[playerId]);
    
    // reset temp scores
    roundScore = 0;
    
    // reset dices
    $("#dizes img.up").toggleClass('down').toggleClass('up');
    $("#dizes img").removeClass('counted countAble').removeAttr('data-value');
    roundNr = 0;
    turnNr++;
    
    // reset actions
    $('#rolling').show();
    $('#write').show();
    $('#nextPlayer').hide();    
    
    // show minimum
    $('#minScore span').html(minScore);
    $('#curScore span').html(0);
    
    checkWriteAndRoll();
}


function upDown(){   
    $("#dizes img").click(function(){ 
        if($(this).attr('data-value')>0 ){
            $(this).toggleClass('down').toggleClass('up');
            
            sumDice('.up');
            
            checkWriteAndRoll();
            
        } else {
            return false;
        }
        
    }); 
}

function checkWriteAndRoll() {
    
    // write
    if (
        roundScore>=minScore && 
        $('#dizes img.up[data-round="'+roundNr+'"]').length>0 && 
        $('#dizes img.up').length<6 &&
        $('#dizes img.down').length > $('#dizes img.down.countAble').length
       ) {
        $('#write').removeClass('inactive');
    } else {
        $('#write').addClass('inactive');
    }
    
    // roll
    if(($('#dizes img.up[data-round="'+roundNr+'"].counted').length>0 && $('#dizes img.up[data-round="'+roundNr+'"].counted').length===$('#dizes img.up[data-round="'+roundNr+'"]').length)|| roundNr===0) {
        $('#rolling').removeClass('inactive');
    } else {
        $('#rolling').addClass('inactive');
    }   
}

function toogleAnimation(){
    $('#rollTheDize').toggle();
    $('#dizes').toggle();
}


function letsRoll() {
    
    // score up
    curScore = roundScore;
    
    // update buttons
    $('#rolling').addClass('inactive');
    $('#write').addClass('inactive');
    
    // reset dices
    if($("#dizes img.up").length===6) {
        $("#dizes img").toggleClass('down').toggleClass('up');
    }
    
    // roll the dices
    roll();
    
    // check for countable dice
    setTimeout('checkNext()',1000);
}


function checkNext(){
    if(sumDice('')<50) {
        $('#rolling').hide();
        $('#write').hide();
        $('#nextPlayer').show();
    }    
}


function roll() {
    
    $('#dizes img').removeClass('countAble');
    
    roundNr++;
    
    // Animation
    toogleAnimation();
    setTimeout('toogleAnimation()',1000);
    
    // set round
    $('#dizes .down').attr('data-round', roundNr);
    
    $('#dizes .down').each(function() {
        
        var i = getRandomInt();
        
        $(this).attr('data-value', i);
        $(this).attr('src', 'images/'+i+'.png');
    });
    
}


/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt () {
    max = 6;
    min = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * summs the current dices
 * 
 * @param {string} up '.up' to check selected dices
 */
function sumDice(up) {
    console.log('sumDice');
    var tempScores = new Array();
    var tempCount = new Array(new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array());
    var tempValue = 0;
    
    $('#dizes img'+up).removeClass('counted');
    
    $('#dizes img'+up+'[data-round="'+roundNr+'"]').each(function(){ 
        var i = parseInt($(this).attr('data-value'));
        tempScores.push(i);
        tempCount[i].push(1);
    });
    
    tempScores.sort();
    
    
    // street
    tempValue = check4street(tempScores,up);

    // sixpack
    if(!tempValue) {
        tempValue = check4six(tempScores,up);
    }
    
    
    // tripple
    if(!tempValue) {
        tempValue = check4tripple(tempCount,up);
    }
    
    // single 1 & 5
    tempValue = check4single(tempValue,up);

    // score of this turn
    if(up) {
        roundScore = curScore+tempValue;
        $('#curScore span').html(roundScore);
    } else {        
        return tempValue;        
    }

}

/**
 * check for a street
 * 
 * @param {array} tempScores selected dice values
 * @param {string} up selector up or down dices
 * @return {integer} value
 */
function check4street(tempScores,up) {
    
    var street = [1,2,3,4,5,6];
    
    if(street.toString()===tempScores.toString()){
        if(up){
            alert('Yeah, its a street Baby: 2500!');
            $('#dizes img.up[data-round="'+roundNr+'"]').addClass('counted');
        } else {
            $('#dizes img').addClass('countAble');
        }
        return 2500;
    } else {
        return 0;
    }    
}

/**
 * check for 6 same
 * 
 * @param {array} tempScores selected dice values
 * @param {string} up selector up or down dices
 * @return {integer} value
 */
function check4six(tempScores,up) {
    
    var nr1 = GetUnique(tempScores);
    var tempValue = 0
    
    if(nr1.length==1 && tempScores.length==6){        
        tempValue = nr1[0]*200;
        if(nr1[0]===1){
            tempValue = tempValue*10;
        }
        if(up){
            alert('Sixpack: '+tempValue+'!');
            $('#dizes img.up[data-round="'+roundNr+'"]').addClass('counted');
        } else {
            $('#dizes img').addClass('countAble');
        }        

    }    
    return tempValue;        
}


/**
 * check for tripple
 *  
 * @param {array} tempCount selected dice values grouped by value
 * @param {string} up selector up or down dices
 * @return {integer} value
 */
function check4tripple(tempCount,up) {
    
    var tempValue = 0;
    
    for(var i = 1; i<7; ++i){ 
        
        if(tempCount[i].length>2){                    
            if(i===1){
                tempValue+= 1000;
            } else {
                tempValue+= i*100;
            }
            
            if(up){
                $('#dizes img'+up+'[data-value="'+i+'"][data-round="'+roundNr+'"]:lt(3)').addClass('counted');
            } else {
                $('#dizes img[data-value="'+i+'"][data-round="'+roundNr+'"]:lt(3)').addClass('countAble');
            }                         
        } 
    }
    
    return tempValue;        
}


/**
 * check for single 1 & 5
 * 
 * @param {array} tempValue value before counting 1 & 5
 * @param {string} up selector up or down dices
 * @return {integer} tempValue total value of selected dices
 */
function check4single(tempValue,up) {
    
    $('#dizes img'+up+'[data-round="'+roundNr+'"]').not('.counted').each(function(){ 
        var i = parseInt($(this).attr('data-value'));
        if(i===1){
            tempValue+=100;
            
            if(up){
                $(this).addClass('counted');
            } else {
                $(this).addClass('countAble');
            }            
        } else if (i===5) {
            tempValue+=50;
            if(up){
                $(this).addClass('counted');
            } else {
                $(this).addClass('countAble');
            } 
        }
    });
    
    return tempValue;        
}


/**
 * unique an array
 * 
 * @param {array} inputArray
 * @return {array} outputArray
 */
function GetUnique(inputArray) {
    var outputArray = [];
    
    for (var i = 0; i < inputArray.length; i++) {
        if (($.inArray(inputArray[i], outputArray)) == -1) {
            outputArray.push(inputArray[i]);
        }
    }
   
    return outputArray;
}