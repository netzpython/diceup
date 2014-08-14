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
    upDown();   
    
    assignChange();
});

function assignChange(){
    $('.playerColumn input').unbind('change');
    
    $('.playerColumn input').change(function(){        
        $(this).parent().append('<input value="0"/><br/>');
        var colID = $(this).parent().attr('data-player');
        setTimeout('summColumn('+colID+')',100);
    });    
}

function summColumn(colID) {

    score = 0;
    $('#player_'+colID+' input').each(function() {
        score = score + parseInt($(this).val());
        console.log($(this).val());
    });
    
    $('#player_'+colID+' .total').html(score);
    assignChange();
}


function upDown(){   
    $("#dizes img").click(function(){ 
        if(roundNr>0){
            $(this).toggleClass('down').toggleClass('up');
            var tempScore = sumDice('.up');
        }
        checkWriteAndRoll();
    }); 
}

function checkWriteAndRoll() {
    
    // write
    if(roundScore>minScore && $('#dizes img.up[data-round="'+roundNr+'"]').length>0 && $('#dizes img.up').length<6) {
        $('#write').removeClass('inactive');
    } else {
        $('#write').addClass('inactive');
    }
    
    // roll
    if($('#dizes img.up[data-round="'+roundNr+'"].counted').length>0) {
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
    
    if(up){
        // street
        tempValue = check4street(tempScores);

        // sixpack
        if(!tempValue) {
            tempValue = check4six(tempScores);
        }
    }
    
    // tripple
    if(!tempValue) {
        tempValue = check4tripple(tempCount);
    }
    
    // single 1 & 5
    tempValue = check4single(tempValue,up);
    console.log('up'+up);
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
 * @return {integer} value
 */
function check4street(tempScores) {
    
    var street = [1,2,3,4,5,6];
    
    if(street.toString()===tempScores.toString()){
        alert('Yeah, its a street Baby: 2500!');
        $('#dizes img.up[data-round="'+roundNr+'"]').addClass('counted');
        return 2500;
    } else {
        return 0;
    }    
}

/**
 * check for 6 same
 * 
 * @param {array} tempScores selected dice values
 * @return {integer} value
 */
function check4six(tempScores) {
    
    var nr1 = GetUnique(tempScores);
    var tempValue = 0
    
    if(nr1.length==1 && tempScores.length==6){        
        tempValue = nr1[0]*200;
        if(nr1[0]===1){
            tempValue = tempValue*10;
        }
        alert('Sixpack: '+tempValue+'!');
        $('#dizes img.up[data-round="'+roundNr+'"]').addClass('counted');
    }    
    return tempValue;        
}


/**
 * check for tripple
 * 
 * @param {array} tempCount selected dice values grouped by value
 * @return {integer} value
 */
function check4tripple(tempCount) {
    
    var tempValue = 0;
    
    for(var i = 1; i<7; ++i){ 
        
        if(tempCount[i].length>2){                    
            if(i===1){
                tempValue+= 1000;
            } else {
                tempValue+= i*100;
            }
            
            $('#dizes img.up[data-round="'+roundNr+'"]:lt(3)').addClass('counted');
        } 
    }
    
    return tempValue;        
}


/**
 * check for single 1 & 5
 * 
 * @param {array} tempValue value before counting 1 & 5
 * @return {integer} tempValue total value of selected dices
 */
function check4single(tempValue,up) {
    
    $('#dizes img'+up+'[data-round="'+roundNr+'"]').not('counted').each(function(){ 
        var i = parseInt($(this).attr('data-value'));
        if(i===1){
            tempValue+=100;
            $(this).addClass('counted');
        } else if (i===5) {
            tempValue+=50;
            $(this).addClass('counted');
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