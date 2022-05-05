var users = {};


function allStorage(){

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    console.log('keys',keys);

    while ( i-- ) {
        var idTmp = keys[i];

        if( idTmp.includes('00')){
            console.log('keys',idTmp);
            users[idTmp]= JSON.parse(apiDB('GET',idTmp,{}));
            var htmlObj = createHtmlObject(idTmp);
            renderElement(htmlObj);
        } 
    }

}

function addUser(){

    var id = getNextId();
    createObject(id);
    var htmlObj = createHtmlObject(id);
    persistObjectDB(id);
    renderElement(htmlObj);
}

function getNextId(){

    var initialNextId = '001';
    var tmpId = apiDB('GET','NEXTID');

    console.log('GET ID',tmpId)

    if(tmpId === undefined || tmpId === null || tmpId === ''){
        apiDB('SET','NEXTID',initialNextId);
        return initialNextId;
    }else{
        var tmpNewId =  parseInt(tmpId) + 1;
        console.log('parseint',tmpNewId);
        apiDB('SET','NEXTID',tmpNewId);

        return '00'+tmpNewId;
    } 

}

function createObject(id){

    var defaultName = 'Usuario_' + id;
    var defaultMoney = 15000;


    users[id] = {
        id : id,
        color : 'White',
        name : defaultName,
        money : defaultMoney
    }

}



function createHtmlObject(idElement){

    console.log(idElement)
    console.log(users)

    var userUIelement = '<div class="userCls" id="'+users[idElement].id+'">'+
        '<div class="elementUserCls" id="actionUser"><a href="#" onclick=dropUser("'+idElement+'")>Borrar</a> - <a href="#" onclick=editUser("'+idElement+'")>Editar</a> </div>'+
        '<div class="elementUserCls" id="nameUser_'+users[idElement].id+'">'+users[idElement].name+'</div>'+
        '<div class="elementUserCls" id="moneyFree_'+users[idElement].id+'">$'+users[idElement].money+'</div>'+
        '<div class="elementUserCls" id="moneyTobet"><input id="txtValue_'+users[idElement].id+'" type="text" value="0" disabled /></div>'+
        '<div class="elementUserCls" id="colorBet"><div id="colorValue_'+users[idElement].id+'" class="elementColorBet"></div></div></div>';

    return userUIelement;

}

function persistObjectDB(idElement){
    apiDB('SET',idElement,JSON.stringify(users[idElement]));
    console.log('persistir objeto')

}

function renderElement(htmlObj){

    $('#contentUsers').append(htmlObj)
}

function buildBets(){

    console.log('buildbets');

    var indexCol = 0;
    var max=19, min=11; //porcentajes apuesta
    var lenUsers = Object.keys(users).length;
    var randomColor = createDistribution(array, weights, lenUsers);

    for( i in users ){

        var moneyUser = users[i].money;
        var porcBet = 1;

        if(moneyUser > 1000 ){
            porcBet = (Math.floor(Math.random() * (max - min + 1)) + min)/100;
        }

        var newVal = parseFloat(moneyUser * porcBet).toFixed(0);

        users[i].money = moneyUser - newVal;
        users[i].color = randomColor[indexCol];
        $('#txtValue_'+i).val(newVal);
        $('#moneyFree_'+i).html('$'+users[i].money);
        $('#colorValue_'+i).removeClass().addClass('elementColorBet'+randomColor[indexCol]);
        indexCol++;

    }

}


//type : REMOVE , GET , SET
//obj to save (used by SET type)
function apiDB(type,key,obj){

    if(type==='GET'){
        return localStorage.getItem(key);
        console.info('getItem localstorage');
    }else{
        if(type==='SET'){
            localStorage.setItem(key,obj);
            console.info('setItem localstorage');
        }else{
            if(type==='REMOVE'){
                localStorage.removeItem(key);
                console.info('removeItem localstorage');
            }  
        }
    }

}


function restartGame(){

    localStorage.clear();
    $('#contentUsers').empty();

}

function startGame(){

    $('#tableGame').removeClass().addClass('tableGameRoulette');
    setTimeout(function(){

        var randomColorRoulette = createDistribution(array, weights, 35)[35];//36 positions real roulette
        $('#tableGame').removeClass().addClass('tableGame'+randomColorRoulette);


        for(i in users){

            var profitVal = 0;
            var betUser = $('#txtValue_'+users[i].id).val()

            if(randomColorRoulette === users[i].color){

                profitVal = randomColorRoulette === 'Red' || randomColorRoulette === 'Black' ? betUser * 2 : betUser * 10;

                users[i].money += profitVal;
                $('#txtValue_'+i).val('0');
                $('#moneyFree_'+i).html('$'+users[i].money);
                //$('#colorValue_'+i).removeClass().addClass('elementColorBet');
                $('#txtValue_'+i).removeClass().addClass('winRoulette');

            }else{

                $('#txtValue_'+i).val('0');
                //$('#colorValue_'+i).removeClass().addClass('elementColorBet');
                $('#txtValue_'+i).addClass();
                $('#txtValue_'+i).removeClass().addClass('loseRoulette');

            }

            persistObjectDB(users[i].id);
        }

    }, 3000);

}

function dropUser(param){

    console.log(param)
    apiDB('REMOVE', param);
    $('#'+param).remove();
    delete users[param];

}

function editUser(param){

    var name = users[param].name;
    var money = users[param].money;

    var msg = '<div id="dialog" title="Editar usuario">'+
        '<div id="moneyTobet"><input id="nameVal_'+param+'" type="text" value="'+name+'"  /></div><br>'+
        '<div id="moneyTobet"><input id="moneyVal_'+param+'" type="text" value="'+money+'"  /></div>'+
        '</div>';

    $('body').append(msg);
    //$("#dialog").dialog();

    $( "#dialog" ).dialog({
        modal: true,
        close: function() {
           $('#dialog').remove();
        },
        buttons: {
            Guardar: function() {
                var newValName = $('#nameVal_'+param).val();
                var newValMoney = $('#moneyVal_'+param).val();
                
                users[param].name = newValName;
                users[param].money = newValMoney;
                persistObjectDB(param);
                
                $('#nameUser_'+param).html(newValName);
                $('#moneyFree_'+param).html('$'+newValMoney);
                
                $( this ).dialog( "close" );
                $('#dialog').remove();
            },

        }
    });

}




