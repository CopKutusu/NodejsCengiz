/*
console.log('ASD \nABC');


var math = require('mathjs');

var a = math.matrix([[7, 1], [-2, 3]]);
//console.log(a.size());

var x = a.size();
//console.log(x[1]);

a._data[[2][0]] =4;
a._data[[2][1]] =5;

console.log(a._data.join("\n"))
*/



var origins = [];
    origins.location = [];
    origins.available = [];

    origins.location.push(1);
    origins.available.push(true);

    origins.location.push(2);
    origins.available.push(false);


console.log(origins.location[0]);




function a(){
    for (var i=0;i <3; i++){
        console.log(i);
    }
}

a();