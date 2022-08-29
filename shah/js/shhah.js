let dyska = '';
let pobeda;
let Xpobeda= 0;
let Opobeda =0;
let ravnaigra= 0;
let sega= "X";
let mas=[['','',''],['','',''],['','','']] 
 function tuk(id) {
    broyaj();
    if(kray()=='X' || kray()=='O' || kray()=='='){broyaj()}
    else{
    let thiss = document.getElementById(id)
    
    function name() {
    if (sega=="X") {
        sega="O"
    } else {
        sega= "X"
    }
    }
    let red=parseInt(id[0]);
    let kolona= parseInt(id[1]);
    
        if (thiss.innerHTML!="X" && thiss.innerHTML!="O"){
    thiss.innerHTML=sega;
    mas[red][kolona]=sega;
    name();
    let krayy= kray();
    if (krayy=='X') {
        Xpobeda++;
        broyaj()
        document.getElementById("bb").innerHTML=`победи${krayy}`;
    } else if (krayy=='O') {
       Opobeda++;
        broyaj()
        document.getElementById("bb").innerHTML=`победи${krayy}`;
        
    }else if (krayy=='=') {
            ravnaigra++;
            broyaj()
            document.getElementById("bb").innerHTML=`равна игра`;
            
    }else {
        document.getElementById("bb").innerHTML=`играе: ${sega}`;
        
    }
    
    }
}
 }
 function broyaj() {
    document.getElementById("Xpobedi").innerHTML=`X победи:${Xpobeda}`;
    document.getElementById("Opobedi").innerHTML=`O победи:${Opobeda}`;
    document.getElementById("ravni").innerHTML=`равни игри:${ravnaigra}`;
 }
 function kray() {
    function n(i) {
        if ('X'==mas[i][0] &&'X'==mas[i][1]&&'X'==mas[i][2]) {
            return `X`;
        }
        else if('O'==mas[i][0]&&'O'==mas[i][1]&&'O'==mas[i][2])
        {return'O'}
    }
    function a(i) {
        if ('X'==mas[0][i]&&'X'==mas[1][i]&&'X'==mas[2][i]) {
            return `X`;
        }
        else if('O'==mas[0][i]&&'O'==mas[1][i]&&'O'==mas[2][i])
        {return'O'}
    }
    for (let index = 0; index <=2; index++) {
        if (n(index)!=undefined){return n(index)};
        if (a(index)!=undefined){return a(index)};
    }
    if ('X'==mas[0][0]&&'X'==mas[1][1]&&'X'==mas[2][2]) {
        
        return'X';
    } else if ('O'==mas[0][0]&&'O'==mas[1][1]&&'O'==mas[2][2]) {
        return 'O';
    }
    if ('X'==mas[0][2]&&'X'==mas[1][1]&&'X'==mas[2][0]) {
        return'X';
    } else if ('O'==mas[0][2]&&'O'==mas[1][1]&&'O'==mas[2][0]) {
        return 'O';
    }
    for (const i in mas) {
        for (const item in mas) {
               if (mas[i][item]=='') {
                return false;
               }
        }
    }

   return '=';
 }
 function nova() {
    for (let i = 0; i < 3; i++) {
        for (let ii = 0; ii < 3; ii++) {
            let id= `${ii}${i}`;
            console.log(id);
            document.getElementById(id).innerHTML=''
        }
        
    }
    mas=[['','',''],['','',''],['','','']] 
 }
function syzdawane_na_dyska(masiv) {
    for (let i in masiv) {
        for (let ii in masiv[i]) {
            let id= `${ii}${i}`;
            dyska+= `|<button id="${id}" onclick=" tuk('${id}')"> </button >`;
            
        }
        dyska +="|<br>"
        document.getElementById('div0').innerHTML=dyska
    }
}