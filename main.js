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
var httpRequest = require("./requests/http/httpRequest");
var orchestration = require('./requests/Orchestration');

var kutuInformation = 'kutu';
var kutu = {
    kutuLocationLatitude: {},
    kutuLocationLongitude: {},
    kutuID: {},
    solidityRadio: {},
    temperature: {}
};
var options = {};

// TO DO : İleriki zamanlarda burada bir döngü yapılabilir.Kutu sayısı (kutuInformation = [kutu,kutu2 ...])'na göre otomatik işlem yapılabilir.

orchestration.locationlatitudeGetURL(kutuInformation, (opt) => {
    console.log(opt);
    options = opt;
    httpRequest.httpGetRequest(options, function (err, res) {
        if (err) {
            console.log("Got an error: ", err);
            return;
        }
        if (res.length === 0) {
            console.log("Response boş döndü.Eklenecek veri yok !!");
            return;
        }
        else {
            kutu.kutuLocationLatitude.id = res[0].id;
            kutu.kutuLocationLatitude.value = res[0].value;
            kutu.kutuLocationLatitude.feed_id = res[0].feed_id;
            kutu.kutuLocationLatitude.created_at = res[0].created_at;
            kutu.kutuLocationLatitude.feed_key = res[0].feed_key;
            console.log("Kutu Location Latitude Bilgisi :", kutu.kutuLocationLatitude);
            console.log("\n");
        }
    });
});

orchestration.locationlongitudeGetURL(kutuInformation, (opt) => {
    console.log(opt);
    options = opt;
    httpRequest.httpGetRequest(options, function (err, res) {
        if (err) {
            console.log("Got an error: ", err);
            return;
        }
        if (res.length === 0) {
            console.log("Response boş döndü.Eklenecek veri yok !!");
            return;
        }
        else {
            kutu.kutuLocationLongitude.id = res[0].id;
            kutu.kutuLocationLongitude.value = res[0].value;
            kutu.kutuLocationLongitude.feed_id = res[0].feed_id;
            kutu.kutuLocationLongitude.created_at = res[0].created_at;
            kutu.kutuLocationLongitude.feed_key = res[0].feed_key;
            console.log("Kutu Location Longitude Bilgisi :", kutu.kutuLocationLongitude);
            console.log("\n");
        }
    });
});

orchestration.boxID_URL(kutuInformation, (opt) => {
    console.log(opt);
    options = opt;
    httpRequest.httpGetRequest(options, function (err, res) {
        if (err) {
            console.log("Got an error: ", err);
            return;
        }
        if (res.length === 0) {
            console.log("Response boş döndü.Eklenecek veri yok !!");
            return;
        }
        else {
            kutu.kutuID.id = res[0].id;
            kutu.kutuID.value = res[0].value;
            kutu.kutuID.feed_id = res[0].feed_id;
            kutu.kutuID.created_at = res[0].created_at;
            kutu.kutuID.feed_key = res[0].feed_key;
            console.log("Kutu ID  Bilgisi :", kutu.kutuID);
            console.log("\n");
        }
    });
});

orchestration.solidityRadioGetURL(kutuInformation, (opt) => {
    console.log(opt);
    options = opt;
    httpRequest.httpGetRequest(options, function (err, res) {
        if (err) {
            console.log("Got an error: ", err);
            return;
        }
        if (res.length === 0) {
            console.log("Response boş döndü.Eklenecek veri yok !!");
            return;
        }
        else {
            // TO DO : Buradaki res[0] bize son response değerini veriyor , bazı durumlarda tüm response'ler gerekebilir.
            kutu.solidityRadio.id = res[0].id;
            kutu.solidityRadio.value = res[0].value;
            kutu.solidityRadio.feed_id = res[0].feed_id;
            kutu.solidityRadio.created_at = res[0].created_at;
            kutu.solidityRadio.feed_key = res[0].feed_key;
            console.log("Kutu Doluluk  Bilgisi :", kutu.solidityRadio);
            console.log("\n");
        }
    });
});

orchestration.temperatureGetURL(kutuInformation, (opt) => {
    console.log(opt);
    options = opt;
    httpRequest.httpGetRequest(options, function (err, res) {
        if (err) {
            console.log("Got an error: ", err);
            return;
        }
        if (res.length === 0) {
            console.log("Response boş döndü.Eklenecek veri yok !!");
            return;
        }
        else {
            // TO DO : Buradaki res[0] bize son response değerini veriyor , bazı durumlarda tüm response'ler gerekebilir.
            kutu.temperature.id = res[0].id;
            kutu.temperature.value = res[0].value;
            kutu.temperature.feed_id = res[0].feed_id;
            kutu.temperature.created_at = res[0].created_at;
            kutu.temperature.feed_key = res[0].feed_key;
            console.log("Kutu Sıcaklık  Bilgisi :", kutu.temperature);
            console.log("\n");
        }
    });
});





