
// Players
var players = new Array();

// colors
var colors = new Array('#939','#3c3','#ff0','#06f','#f69','#f00','#f60');

// index current Player
var playerId = 0;

// number of throws
var roundNr = 0;

// number of turns
var turnNr = 0;

// min score to beat
var minScore = 350;

// current score
var curScore = 0;

// current score
var roundScore = 0;

// score where game ends
var endScore = 10000;

// last turn
var endTurn = 9999;

// timeout for switching bot to player
var nextTimeout;

$(document).ready(function() {
    
    //niceAlert('Wellcome');
    
    setTimeout(function(){startLayer();},1);
});

function playerType(type){
    // set value and button label
    $('#playerType').val(type);
    $('#createPlayer span').html(type);
    
    // human
    if(type==='human'){        
        $('#playerHead').removeClass('bot');
        $('#botPool option').removeProp('selected');
        $('#colors').show();
    }
    
    // bot
    if(type==='bot'){        
        $('#playerHead').addClass('bot');
        $('#playerName').val('');
        $('#colors').hide();
    }    
}

function startLayer() {
    
    // show start layer
    $('#start').fadeIn();
    
    // create bot select
    var botSelect = '<option>choose a bot</option>';
    $.each(botPool, function( index, value ) {
        botSelect+= '<option value="'+index+'">'+value['name']+'</option>';
    });
    $('#botPool').html(botSelect);
    
    // colors
    var colorsHtml = '<input id="color" type="hidden" />';
    $.each(colors, function( index, value ) {
        colorsHtml+= '<a data-color="'+value+'" style="background-color:'+value+'"></a>';
    });
    $('#colors').html(colorsHtml);
    
    $('a[data-color]').click(function(){
        $('a[data-color]').removeClass('active');
        $('#color').val($(this).attr('data-color'));
        $(this).addClass('active');
    });
    $('a[data-color]').first().click();
    
    // switch to game mode (mobile only)
    $('#chooseGameMode').click(function(){        
        $('#gameModeLayer').show();
        $('#playerLayer').hide();
    });
    
    // add human
    $('#playerName').keyup(function(){
        if($('#playerName').val()) {
            $('#createPlayer').show();  
            playerType('human');
        } else {
            $('#createPlayer').hide();
        }
    });
    
    // add bot
    $('#botPool').change(function(){
        if($('#botPool').val()) {
            $('#createPlayer').show();  
            playerType('bot');
        } else if(!$('#playerName').val()) {
            $('#createPlayer').hide();
        }
    });
    
    
    // create Player
    $('#createPlayer').click(function() {
        createPlayer() 
    });
    
    // start Game
    $('#startGame').click(function() {
        startGame();
    });    
}

function createPlayer() {
    playerObject();
    playerListRow();
    resetPlayerForm();      
    $('#gameModeLayer').show();    
}

function playerObject() {
    // create Player
    players[playerId] = new Object();
    players[playerId]["type"] = $('#playerType').val();          
    players[playerId]["total"] = 0;
    players[playerId]["highScore"] = 0;
    players[playerId]["toLow"] = 0;        

    // Human
    if($('#playerType').val()==='human'){
        players[playerId]["name"] = $('#playerName').val(); 
        players[playerId]["color"] = $('#color').val();
    // Bot
    } else {
        players[playerId]["name"] = botPool[$('#botPool').val()]['name']; 
        players[playerId]["color"] = botPool[$('#botPool').val()]['color']; 
        players[playerId]["botBrain"] = botPool[$('#botPool').val()];

        $('#botPool option[value='+$('#botPool').val()+']').remove();
    }    
   
}

function playerListRow() {
    // hide hint
    $('#noPlayersHint').hide();
    
    // new row in the playersList
    var row = '<div class="player_'+playerId+'" style="border-color:'+players[playerId]["color"]+';">'+players[playerId]["name"]+'</div>';
    $('#playerList').append(row);
    
}

function resetPlayerForm(){
    playerId++;
    $('#playerName').val('');
    $('#createPlayer').hide();
    playerType('human');      
    
    // reset color
    $('#colors').hide();
    var nth = playerId+2;
    $('a[data-color]:nth-child('+nth+')').click();     
}


function startGame() {
    
    playerId = -1;
    endScore = $('#gameMode').val();
    
    // show gaming layer
    $('#game').show();
    $('#start').hide();
    
    // create dice platform
    plattformInit();     
    
    // create players table
    playersTable();
    
    // bind actions
    $('#write').click(function(){
        if($(this).hasClass('inactive')) {
            alert('Jetzt net!');
        } else {
            write();
        }
    });
    
    $('#rolling').click(function(){
        if($(this).hasClass('inactive')) {
            alert('Später vielleicht!');
        } else {
            letsRoll();
        }
    });
    
    $('#nextPlayer').click(function(){
        if($(this).hasClass('inactive')) {
            alert('Geht net!');
        } else {
            clearTimeout(nextTimeout);
            nextPlayer();
        }
    });   
    
    // first turn
    playerId = -1;
    nextPlayer();
}

function plattformInit(){
    
    // scale dices
    var fs = $('#dices').width()/160;
    $('#dices').css('font-size',fs+'px');
    
    // create dices
    for(var i=1; i<7; i++) {
        createDice(i);
    }
    
    // bind dices click
    upDown(); 
}

function createDice(i) {
    var diceHtml = '<div id="dice_'+i+'" class="dice down reset">'+
          '<div class="side front">'+
            '<div class="dot center"></div>'+
          '</div>'+
          '<div class="side front inner"></div>'+
          '<div class="side top">'+
            '<div class="dot dtop dleft"></div>'+
            '<div class="dot dbottom dright"></div>'+
          '</div>'+
          '<div class="side top inner"></div>'+
          '<div class="side right">'+
            '<div class="dot dtop dleft"></div>'+
            '<div class="dot center"></div>'+
            '<div class="dot dbottom dright"></div>'+
          '</div>'+
          '<div class="side right inner"></div>'+
          '<div class="side left">'+
            '<div class="dot dtop dleft"></div>'+
            '<div class="dot dtop dright"></div>'+
            '<div class="dot dbottom dleft"></div>'+
            '<div class="dot dbottom dright"></div>'+
          '</div>'+
          '<div class="side left inner"></div>'+
          '<div class="side bottom">'+
            '<div class="dot center"></div>'+
            '<div class="dot dtop dleft"></div>'+
            '<div class="dot dtop dright"></div>'+
            '<div class="dot dbottom dleft"></div>'+
            '<div class="dot dbottom dright"></div>'+
          '</div>'+
          '<div class="side bottom inner"></div>'+
          '<div class="side back">'+
            '<div class="dot dtop dleft"></div>'+
            '<div class="dot dtop dright"></div>'+
            '<div class="dot dbottom dleft"></div>'+
            '<div class="dot dbottom dright"></div>'+
            '<div class="dot center dleft"></div>'+
            '<div class="dot center dright"></div>'+
          '</div>'+
          '<div class="side back inner"></div>'+
          '<div class="side cover x"></div>'+
          '<div class="side cover y"></div>'+
          '<div class="side cover z"></div>'+
        '</div>';
    
    $('#platform').append(diceHtml);
}


/**
 * create the Player columns 
 */
function playersTable() {
    // columns
    var thRow = '<th>#</th>';
    var tdRow = '<td>&sum;</td>';
    $.each(players, function( index, value ) {
        thRow += '<th>'+value['name']+'</th>';
        tdRow += '<td id="player_'+index+'"><div class="total">0</div></td>';        
    });
    
    var playersTables = '<table><tr>'+thRow+'</tr><tr>'+tdRow+'</tr></table><table id="scoreTable"></table>';
    
    $('#players').html(playersTables);

}


function write(){  
            
    $('.scoreRow_'+turnNr+' td:nth-child('+(playerId+2)+')').html(roundScore);
    
    players[playerId]["total"]+=roundScore;
    $('#player_'+playerId+' .total').html(players[playerId]["total"]);
    fastAlert(players[playerId]['name']+' writes '+roundScore);
    
    if(players[playerId]["total"]>=endScore) {
        endTurn = turnNr;
        niceAlert(players[playerId]['name']+' reaches the end score!');
    }
    
    //  min score
    minScore = roundScore+50;
    
    // nextPlayer
    nextPlayer(1);
}

function nextPlayer(written) {
        
    // write score
    if(!written && turnNr>0){
        $('.scoreRow_'+turnNr+' td:nth-child('+(playerId+2)+')').html(0);
        fastAlert(players[playerId]['name']+' writes 0 null zero');
        minScore = 350;
    }    
    
    // next player
    playerId++;
    
    if(playerId==players.length){
        playerId = 0;        
    }      
    
    // show current Player
    curPlayer();
    
    
    // reset temp scores
    roundScore = 0;
    
    // reset dices
    $("#dices .dice").addClass('reset');
    $("#dices .dice").removeClass('counted countAble').attr('data-round',-1).removeAttr('data-value');
    $("#dices .dice.up").addClass('down').removeClass('up').appendTo('#platform');    
    roundNr = 0;    
    
    // new score row
    if(playerId === 0) {
        turnNr++;
        
        // end game
        if(turnNr>endTurn) {
            endGame();
        } 
        
        // new score row
        scoreRow = '<tr class="scoreRow_'+turnNr+'"><td>'+turnNr+'</td>';
        $.each(players, function( index, value ) {
            scoreRow+='<td>-</td>';
        });
        scoreRow+='</tr>';
        
        $('#scoreTable').prepend(scoreRow);
    }         
    
    // reset actions
    $('#rolling').show();
    $('#write').show();
    $('#nextPlayer').hide();    
    
    // show minimum
    $('#minScore span').html(minScore);
    $('#curScore span').html(0);
    
    // check for bot
    if(players[playerId]['type']==='bot') {
        botsTurn();
    } else {
        $('body').removeClass('noMouse');
    }
    
    // check write and roll
    checkWriteAndRoll();
}

function curPlayer(){
    $('#curPlayer').html('<div style="border-color: '+players[playerId]['color']+';">'+players[playerId]['name']+'</div>');
    $('.dot').css('background-color',players[playerId]['color']);
}

function upDown(){   
    $("#dices .dice").click(function(){ 
        if($(this).attr('data-round')==roundNr) {
            $(this).toggleClass('down').toggleClass('up');
            
            if($(this).hasClass('up')){
                $(this).appendTo('#platformUp');
            } else {
                $(this).appendTo('#platform');
            }
            
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
        $('#dices .dice.up[data-round="'+roundNr+'"]').length>0 && 
        $('#dices .dice.up').length<6 &&
        $('#dices .dice.down').length > $('#dices .dice.down.countAble').length
       ) {
        $('#write').removeClass('inactive');
    } else {
        $('#write').addClass('inactive');
    }
    
    // roll
    if(($('#dices .dice.up[data-round="'+roundNr+'"].counted').length>0 && $('#dices .dice.up[data-round="'+roundNr+'"].counted').length===$('#dices .dice.up[data-round="'+roundNr+'"]').length)|| roundNr===0) {
        $('#rolling').removeClass('inactive');
    } else {
        $('#rolling').addClass('inactive');
    }   
}

function toogleAnimation(){
    if($('#wrapper').hasClass('rolling')) {
        $('#wrapper').addClass('stop').removeClass('rolling');
    } else {
        $('#wrapper').addClass('rolling').removeClass('stop');
    }
}


function letsRoll() {
    
    // score up
    curScore = roundScore;
    
    // update buttons
    $('#rolling').addClass('inactive');
    $('#write').addClass('inactive');
    
    // reset dices
    $("#dices .dice.up.reset").addClass('down').removeClass('up').appendTo('#platform');
    if($("#dices .dice.up").length===6) {
        $("#dices .dice").addClass('down').removeClass('up').appendTo('#platform');
    }
    $("#dices .dice").removeClass('reset');
    
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
    
    $('#dices .dice').removeClass('countAble');
    
    roundNr++;
    
    // Animation
    toogleAnimation();
    setTimeout('toogleAnimation()',1000);
    
    // set round
    $('#dices .down').attr('data-round', roundNr);
    
    $('#dices .down').each(function() {
        
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
    
    $('#dices .dice'+up).removeClass('counted');
    
    $('#dices .dice'+up+'[data-round="'+roundNr+'"]').each(function(){ 
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
           niceAlert('Yeah, its a street Baby: 2500!');
            $('#dices .dice.up[data-round="'+roundNr+'"]').addClass('counted');
        } else {
            $('#dices .dice').addClass('countAble');
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
            niceAlert('Sixpack: '+tempValue+'!');
            $('#dices .dice.up[data-round="'+roundNr+'"]').addClass('counted');
        } else {
            $('#dices .dice').addClass('countAble');
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
                $('#dices .dice'+up+'[data-value="'+i+'"][data-round="'+roundNr+'"]:lt(3)').addClass('counted');
            } else {
                $('#dices .dice[data-value="'+i+'"][data-round="'+roundNr+'"]:lt(3)').addClass('countAble');
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
    
    $('#dices .dice'+up+'[data-round="'+roundNr+'"]').not('.counted').each(function(){ 
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

var alertNr = 0;
function niceAlert(text) {
    $('#niceAlerts').prepend('<div id="niceAlert_'+alertNr+'" class="niceAlert active">'+text+'</div>');
    $('#niceAlert_'+alertNr).fadeIn(300);
    setTimeout('hideAlert()',1000);
    alertNr++;
}

function hideAlert() {
     $('#niceAlerts > div.niceAlert.active').last().removeClass('active').fadeOut(1000);
}

function fastAlert(text) {
    $('#niceAlerts').prepend('<div id="niceAlert_'+alertNr+'" class="fastAlert active">'+text+'</div>');
    $('#niceAlert_'+alertNr).fadeIn(150);
    setTimeout('fastHideAlert()',600);
    alertNr++;
}

function fastHideAlert() {
    console.log('fastHide');
     $('#niceAlerts > div.fastAlert.active').last().removeClass('active').fadeOut(300);
}

function endGame() {
    
    var winScore = 0;
    var winner = '';
    
    $.each(players, function( index, value ) {
           if(this['total']>winScore){
               winScore = this['total'];
               winner = this['name'];
           }
        });
    
    alert('Game Over!');
    alert(winner+' wins with '+winScore+' points.');
    location.reload();
}