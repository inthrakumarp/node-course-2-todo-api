var i1 = 4;
var i2 = 11;
var i3 = "cAda";
// var i4 = "AbrAcadAbRa";
var i4 = "AbrAcadAbRaTaacAAderTdAca";

var mWords = 0;
var cWord = "";
for(var i = 0; i < i4.length - i1; i++){
    cWord = i4.substr(i, i1);
    //console.log(cWord);
    //console.log(cWord.replace(/a/g,''));
    for(var j=0; j < cWord.length; j++){
        //console.log(i3.indexOf(cWord.substr(j, 1)));
        if(i3.indexOf(cWord.substr(j, 1)) == -1){
            break;
        } else if ( cWord.replace(cWord.substr(j,1),'').indexOf(cWord.substr(j, 1)) != -1) {
            //console.log(cWord.replace(cWord.substr(j,1),''));
            break;
        }
        if(j == i1-1){
            //console.log(cWord);
            mWords= mWords + 1;
        }
    }
}

console.log(mWords);