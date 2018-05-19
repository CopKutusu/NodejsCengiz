
/*
let boxes = [
    {
        kutuLocationLatitude:   '40.777698', 
        kutuLocationLongitude: '29.386010',
        solidityRatio: 25,
        temperature: 1
    }];


    console.log(boxes[0].kutuLocationLongitude);
    console.log(String(boxes[0].kutuLocationLongitude));



    var x =   Number(boxes[0].kutuLocationLatitude).toFixed(6) + ',' + Number(boxes[0].kutuLocationLongitude).toFixed(6);
    console.log(x);

    var a = [x];

    console.log(a);
    */


    /*
    var x = [];
    
    x[0]=  [ 40.757402,29.829452 ] ;

    x[0]
    var a = x[0].split(',');
    console.log('A : ', a);
    var lat = a[0];
    var lng = a[1];

    console.log('Lat :' +lat + ' ' + 'Long : '+ lng);

    var tmpKutu = {
        kutuLocationLatitude: a[0],
        kutuLocationLongitude:   a[1]
    };

    console.log(tmpKutu);


*/
var m=  [ '40.757402,29.829452' ];
console.log(m);
//String(m).replace(/[\[\]']+/g,'');


var k =String(m).split(',');


console.log(k[0]);

    var array = [2, 5, 9];
    console.log(array);


    x = ["a", "b", "c", "d", "e", "f", "g"];
y = x.splice(3);
console.log(x); // ["a", "b", "c"]
console.log(y); // ["d", "e", "f", "g"]