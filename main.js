/*
const jsonParser = require("json-parser");
let express = require('express');

let app = express(); // the main app
let admin = express(); // the sub app

let host = "io.adafruit.com";
let URI = "/api/v2/cengize/feeds";

let kutuURL = URI + "kutu";
let locationlatitudeGetURL = kutuURL + ".locationlatitude/data";
console.log("URI :", URI);
console.log("KutuURL : ",kutuURL);
console.log("URL : ",locationlatitudeGetURL);

app.listen(host);

app.get(locationlatitudeGetURL, function (req, res) {

  console.log(res); // /admin
  //res.send('Admin Homepage');

});
*/
var http = require('http');

let URI = "/api/v2/cengize/feeds/";
let kutuURL = URI + "kutu";
let locationlatitudeGetURL = kutuURL + ".locationlatitude/data";

var options = {
    host: 'io.adafruit.com',
    path: locationlatitudeGetURL,
    headers: { 'Content-Type': 'application/json' }
};
var responseParse;
var kutuLocationLatitude = {};

// TO DO :  Metod içinden asenkron olarak şuan doğru cevap gelmiyor.Bununla ilgilen.

function httpGetRequest(options, callback) {
    http.get(options, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            responseParse = JSON.parse(body);
            console.log("Got a response: ", responseParse);
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
        callback(new Error('HTTP request got an error'), null);
        return;
    });
    callback(null, responseParse);
}

httpGetRequest(options, function(err, res){
    if (err){
        console.log("Hata var.");
        return;
    }
    kutuLocationLatitude = res;
    /*
    kutuLocationLatitude.id = res[0].id;
    kutuLocationLatitude.value = res[0].value;
    kutuLocationLatitude.feed_id = res[0].feed_id;
    kutuLocationLatitude.created_at = res[0].created_at;
    kutuLocationLatitude.feed_key = res[0].feed_key;
    */
    console.log("Kutu Location Latitude Bilgisi :", kutuLocationLatitude);

});



