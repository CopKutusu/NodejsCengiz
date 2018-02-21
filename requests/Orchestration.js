
var options = {
    host: 'io.adafruit.com',
    URI: "/api/v2/cengize/feeds/",
    headers: { 'Content-Type': 'application/json' }
};

let kutuURL;
function boxID_URL(kutuNumber, callback) {
    kutuURL = options.URI + kutuNumber;
    options.path =  kutuURL + ".boxid/data";
    callback(options);
}
function locationlatitudeGetURL(kutuNumber, callback) {
    kutuURL = options.URI + kutuNumber;
    options.path =  kutuURL + ".locationlatitude/data";
    callback(options);
}
function locationlongitudeGetURL(kutuNumber, callback) {
    kutuURL = options.URI + kutuNumber;
    options.path =  kutuURL + ".locationlongitude/data";
    callback(options);
}
function solidityRatioGetURL(kutuNumber, callback) {
    kutuURL = options.URI + kutuNumber;
    options.path =  kutuURL + ".solidityratio/data";
    callback(options);
}
function temperatureGetURL(kutuNumber, callback) {
    //console.log("in Function");
    kutuURL = options.URI + kutuNumber;
    options.path =  kutuURL + ".temperature/data";
    callback(options);
}

exports.locationlatitudeGetURL = locationlatitudeGetURL;
exports.locationlongitudeGetURL = locationlongitudeGetURL;
exports.boxID_URL = boxID_URL;
exports.solidityRatioGetURL = solidityRatioGetURL;
exports.temperatureGetURL = temperatureGetURL;