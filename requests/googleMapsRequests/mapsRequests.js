var httpRequest = require('../http/httpRequest');

var options = {
    host: 'maps.googleapis.com',
    URI: "/maps/api/directions/json?",
    headers: { 'Content-Type': 'application/json' }
};
// locationURL = optionURI + originURL + destinationURL + keyURL;
let locationURL;
let originURL ;
let destinationURL;
let keyURL;

let origin = {};
let destination = {};
let ApiKey = 'AIzaSyD2zhehMtRu-69wZ4fuoUO0Exn877gAnx8';

function distanceCalculate(recievedOrigin, recievedDestination, callback) {
    // başlangic konum bilgileri ve URL  tanimlama
    origin.latitude = recievedOrigin.latitude;
    origin.longitude = recievedOrigin.longitude;
    originURL = 'origin=' + origin.latitude + ',' + origin.longitude + '&';

    // hedef konum bilgileri ve URL  tanimlama
    destination.latitude = recievedDestination.latitude;
    destination.longitude = recievedDestination.longitude;
    destinationURL = 'destination=' + destination.latitude + ',' + destination.longitude + '&';
    
     // Google Maps API'nin verdigi key
    keyURL = 'key=' + ApiKey;

    // konum URL'ni tamamliyoruz.
    locationURL = options.URI + originURL + destinationURL + keyURL;

    options.path =  locationURL;

    httpRequest.httpGetRequest(options, function (err, res) {
        console.log(options);
        if (err) {
            console.log("Got an error: ", err);
            return;
        }
        if (res.length === 0) {
            console.log("Response boş döndü.Eklenecek veri yok !!");
            return;
        }
        else {

            //console.log("Harita Bilgisi:",res);
            console.log("\n");
        }
        //console.log("Harita Bilgisi :", res);
        callback(res);
        });
}

exports.distanceCalculate = distanceCalculate;