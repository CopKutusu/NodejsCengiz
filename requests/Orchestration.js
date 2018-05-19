'use strict';


var options = [
{
    host: 'io.adafruit.com',
    URI: "/api/v2/cengize/feeds/",
    headers: { 'Content-Type': 'application/json' }
},
{
    host: 'io.adafruit.com',
    URI: "/api/v2/are1414/feeds/",
    headers: { 'Content-Type': 'application/json' }
},
{
    host: 'io.adafruit.com',
    URI: "/api/v2/sws/feeds/",
    headers: { 'Content-Type': 'application/json' }
},
{
    host: 'io.adafruit.com',
    URI: "/api/v2/cnbrk_22/feeds/",
    headers: { 'Content-Type': 'application/json' }
}
];

let kutuURL;
function boxID_URL(user, kutuNumber, callback) {
    options.forEach(users =>{
            if (users.URI.indexOf(user.username) >=0 ){
                kutuURL = users.URI + kutuNumber;
                users.path = kutuURL + ".boxid/data";
             //   console.log('BoxID path :', users);
                callback(users);
            }
    });

}
function locationlatitudeGetURL(user, kutuNumber, callback) {
    options.forEach(users =>{
        if (users.URI.indexOf(user.username) >=0 ){
            kutuURL = users.URI + kutuNumber;
            users.path = kutuURL + ".locationlatitude/data";
        //    console.log('locationLatitude path :', users);
            callback(users);
         }
    });
}
function locationlongitudeGetURL(user, kutuNumber, callback) {
    options.forEach(users =>{
        if (users.URI.indexOf(user.username) >=0 ){
            kutuURL = users.URI + kutuNumber;
            users.path = kutuURL + ".locationlongitude/data";
        //    console.log('locationLongitude path :', users);
            callback(users);
        }
    });
}
function solidityRatioGetURL(user, kutuNumber, callback) {
    options.forEach(users =>{
        if (users.URI.indexOf(user.username) >=0 ){
            kutuURL = users.URI + kutuNumber;
            users.path = kutuURL + ".solidityratio/data";
      //      console.log('SolidityRatio path :', users);
            callback(users);
        }
    }); 
}
function temperatureGetURL(user, kutuNumber, callback) {
    options.forEach(users =>{
        if (users.URI.indexOf(user.username) >=0 ){
            kutuURL = users.URI + kutuNumber;
            users.path = kutuURL + ".temperature/data";
       //     console.log('Temperature path :', users);
            callback(users);
        }
    });
}

exports.locationlatitudeGetURL = locationlatitudeGetURL;
exports.locationlongitudeGetURL = locationlongitudeGetURL;
exports.boxID_URL = boxID_URL;
exports.solidityRatioGetURL = solidityRatioGetURL;
exports.temperatureGetURL = temperatureGetURL;