'use strict';
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
var httpRequest = require('./requests/http/httpRequest');
var orchestration = require('./requests/Orchestration');
var googleMaps = require('./requests/googleMapsRequests/mapsRequests');
var kutuInformation = ['kutu', 'kutu2'];

var options = {};
var googleMapsPath = {};


kutuInformation.forEach(element => {

    // Kutu nesnesini foreach disinda tanimlayinca asenkron problemi cikiyordu.Buna dikkat !!
    var kutu = {
        kutuLocationLatitude: {},
        kutuLocationLongitude: {},
        kutuID: {},
        solidityRatio: [],
        temperature: []
    };

    // requestIDS dizisine adafruitten cekilen her verinin id'si giriliyor.Cakismayi onlemek icin asagida kontrol yapiliyor.
    var requestIDS = [];
    orchestration.solidityRatioGetURL(element, (opt) => {
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

                for (var key in res) {
                    if (res.hasOwnProperty(key)) {
                        // Ilk adimda solidityratio nesnesi bos.Veri ekleniyor.
                        if (key === 0) {
                            requestIDS.push(res[key].id);
                            kutu.solidityRatio.push(
                                {
                                    id: res[key].id,
                                    value: res[key].value,
                                    feed_id: res[key].feed_id,
                                    created_at: res[key].created_at,
                                    feed_key: res[key].feed_key
                                }
                            );
                        }
                        // 0.adimdan sonraki adimlarda daha once donen response'lerin id'leri ayni olmayanlari aliniyor.
                        else if (requestIDS.indexOf(res[key].id) < 0) {
                            requestIDS.push(res[key].id);
                            kutu.solidityRatio.push(
                                {
                                    id: res[key].id,
                                    value: res[key].value,
                                    feed_id: res[key].feed_id,
                                    created_at: res[key].created_at,
                                    feed_key: res[key].feed_key
                                }
                            );
                        }

                    }
                }
                //console.log("Kutu Doluluk  Bilgisi :", kutu.solidityRatio[kutu.solidityRatio.length-1]);
                console.log("Kutu Doluluk  Bilgisi :", kutu.solidityRatio);
                console.log("\n");
            }
        });
    });

    orchestration.locationlatitudeGetURL(element, (opt) => {
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

    orchestration.locationlongitudeGetURL(element, (opt) => {
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

    orchestration.boxID_URL(element, (opt) => {
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

    orchestration.temperatureGetURL(element, (opt) => {
        // requesIDS dizisini sifirliyoruz.
        requestIDS = [];
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

                for (var key in res) {
                    if (res.hasOwnProperty(key)) {
                        if (key === 0) {
                            requestIDS.push(res[key].id);
                            kutu.temperature.push(
                                {
                                    id: res[key].id,
                                    value: res[key].value,
                                    feed_id: res[key].feed_id,
                                    created_at: res[key].created_at,
                                    feed_key: res[key].feed_key
                                }
                            );
                        }
                        // 0.adimdan sonraki adimlarda daha once donen response'lerin id'leri ayni olmayanlari aliniyor.
                        else if (requestIDS.indexOf(res[key].id) < 0) {
                            requestIDS.push(res[key].id);
                            kutu.temperature.push(
                                {
                                    id: res[key].id,
                                    value: res[key].value,
                                    feed_id: res[key].feed_id,
                                    created_at: res[key].created_at,
                                    feed_key: res[key].feed_key
                                }
                            );
                        }
                    }
                }
                console.log("Kutu Sıcaklık  Bilgisi :", kutu.temperature);
                console.log("\n");
            }
        });
    });
});

/*



// TO DO : Burada ornek olarak başlangic ve bitis konumlari tanimlanip yol hesaplanmiştir.Yapilmasi gereken Cop araciin degisken konumunun ogrenilmesi ve
// en dolu cop kutusu ve konumunu belirleyip bu iki degeri origin ve destination icerisine yazilacaktir.
let origin = {
    latitude : 40.770960,
    longitude : 29.891243
};

let destination = {
    latitude : 40.768091,
    longitude : 29.937862
}

googleMaps.distanceCalculate(origin, destination, (result)=>{
    googleMapsPath = result;
    //console.log('Sonuc : ', result.routes[0].legs);
});

*/
