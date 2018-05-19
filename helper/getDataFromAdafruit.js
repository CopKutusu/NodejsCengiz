var http = require('http');
var async = require('async');
var httpRequest = require('../requests/http/httpRequest');
var orchestration = require('../requests/Orchestration');
var databaseOperations = require('./databaseOperations');
const log4js = require('log4js');

log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../../var/log/sws_logs/activities.log' } },
    categories: { default: { appenders: ['cheese'], level: 'DEBUG' } }
});

const logger = log4js.getLogger('activities');

function getData(users, kutuNumber, cb) {
    var options = {};
    var tmp = new Array();
    // son kutuya gelindi�inde veritaban� i�lemlerini yapmak i�in tan�mland�
    var controlCounter = 0;

    // Kutu nesnesini foreach disinda tanimlayinca asenkron problemi cikiyordu.Buna dikkat !!
    var kutuNames = [];
    users.forEach(user => {
        for (var i = 0; i < user.kutuInformation.length; i++) {
            kutuNames.push(user.kutuInformation[i]);
        }
    });

    var kutuOzellikleri = [];
    for (var i = 0; i < kutuNumber; i++) {
        kutuOzellikleri[i] = {};
        kutuOzellikleri[i].kutuID = [];
        kutuOzellikleri[i].kutuLocationLatitude = [];
        kutuOzellikleri[i].kutuLocationLongitude = [];
        kutuOzellikleri[i].solidityRatio = [];
        kutuOzellikleri[i].temperature = [];
    }
    var errorDetail ;
    users.forEach(user => {
        // console.log('Username :', user.username);
        user.kutuInformation.forEach(kutular => {
            // console.log('kutular :', kutular);
            async.waterfall(
                [
                    function (callback) {
                        orchestration.boxID_URL(user, kutular, (opt) => {
                            options = opt;
                            httpRequest.httpGetRequest(options, function (err, res) {
                                if (err) {
                                    errorDetail = 'orchestration.boxID_URL - Get Box ID request returned error  :';
                                   // logger.error('Get Box ID request returned error  : ', err);
                                    callback(err, errorDetail);
                                    return;
                                }
                                if (res.length === 0) {
                                    logger.info("orchestration.boxID_URL - Response was returned empty, No data for add");
                                    return;
                                }
                                else {
                                    // feed_key = kutu'x'.asdasdad
                                    tmp = res[0].feed_key.split('.');
                                    for (var i = 0; i < kutuNumber; i++) {
                                        if (tmp[0] === kutuNames[i]) {
                                            kutuOzellikleri[i].kutuID = res[0].value;
                                            logger.info('orchestration.boxID_URL - kutu.ID :', kutuOzellikleri[i].kutuID);
                                        }
                                    }
                                    //logger.info('Box ID data was successfully taken from the server');
                                    callback();
                                }
                            });
                        });
                    },
                    function (callback) {
                        orchestration.locationlatitudeGetURL(user, kutular, (opt) => {
                            options = opt;
                            httpRequest.httpGetRequest(options, function (err, res) {
                                if (err) {
                                     errorDetail ='orchestration.locationlatitudeGetURL - Get Location Latitude request returned error  : ';
                                    //logger.error('Get Location Latitude request returned error  : ', err);
                                    callback(err, errorDetail);
                                    return;
                                }
                                if (res.length === 0) {
                                    logger.info("orchestration.locationlatitudeGetURL - Get Location Latitude - Response was returned empty, No data for add");
                                    return;
                                }
                                else {
                                    tmp = res[0].feed_key.split('.');
                                    for (var i = 0; i < kutuNumber; i++) {
                                        if (tmp[0] === kutuNames[i]) {
                                            kutuOzellikleri[i].kutuLocationLatitude = res[0].value;
                                            logger.info('orchestration.locationlatitudeGetURL - Get Location Latitude - kutu.LocationLatitude :', kutuOzellikleri[i].kutuLocationLatitude);
                                        }
                                    }
                                    //logger.info('Location Latitude data was successfully taken from the server');
                                    callback();
                                }
                            });
                        });
                    },
                    function (callback) {
                        orchestration.locationlongitudeGetURL(user, kutular, (opt) => {
                            options = opt;
                            httpRequest.httpGetRequest(options, function (err, res) {
                                if (err) {
                                    errorDetail = 'orchestration.locationlongitudeGetURL - Get Location Longitude request returned error  : ';
                                   // logger.error('Get Location Longitude request returned error  : ', err);
                                    callback(err, errorDetail);
                                    return;
                                }
                                if (res.length === 0) {
                                    logger.info("orchestration.locationlongitudeGetURL - Get Location Longitude - Response was returned empty, No data for add");
                                    return;
                                }
                                else {
                                    tmp = res[0].feed_key.split('.');
                                    for (var i = 0; i < kutuNumber; i++) {
                                        if (tmp[0] === kutuNames[i]) {
                                            kutuOzellikleri[i].kutuLocationLongitude = res[0].value;
                                            logger.info('orchestration.locationlongitudeGetURL - kutu.LocationLongitude :', kutuOzellikleri[i].kutuLocationLongitude);
                                        }
                                    }
                                    //logger.info('Location Longitude data was successfully taken from the server');
                                    callback();
                                }
                            });
                        });
                    },
                    function (callback) {
                        orchestration.solidityRatioGetURL(user, kutular, (opt) => {
                            options = opt;
                            httpRequest.httpGetRequest(options, function (err, res) {
                                if (err) {
                                    errorDetail = 'orchestration.solidityRatioGetURL - Get Solidity Ratio request returned error  : ';
                                    //logger.error('Get Solidity Ratio request returned error  : ', err);
                                    callback(err, errorDetail);
                                    return;
                                }
                                if (res.length === 0) {
                                    logger.info("orchestration.solidityRatioGetURL - Get Solidity Ratio - Response was returned empty, No data for add");
                                    return;
                                }
                                else {
                                    tmp = res[0].feed_key.split('.');
                                    for (var i = 0; i < kutuNumber; i++) {
                                        if (tmp[0] === kutuNames[i]) {
                                            kutuOzellikleri[i].solidityRatio = res[0].value;
                                            logger.info('orchestration.solidityRatioGetURL - kutu.solidityRatio :', kutuOzellikleri[i].solidityRatio);
                                        }
                                    }
                                    //logger.info('Solidity Ratio data was successfully taken from the server');
                                    callback();
                                }
                            });
                        });
                    },
                    function (callback) {
                        orchestration.temperatureGetURL(user, kutular, (opt) => {
                            options = opt;
                            httpRequest.httpGetRequest(options, function (err, res) {
                                if (err) {
                                    errorDetail= 'orchestration.temperatureGetURL - Get Temperature request returned error  : ';
                                 // logger.error('Get Temperature request returned error  : ', err);
                                    callback(err, errorDetail);
                                    return;
                                }
                                if (res.length === 0) {
                                    logger.info("orchestration.temperatureGetURL - Get Temperature - Response was returned empty, No data for add");
                                    return;
                                }
                                else {
                                    tmp = res[0].feed_key.split('.');
                                    for (var i = 0; i < kutuNumber; i++) {
                                        if (tmp[0] === kutuNames[i]) {
                                            kutuOzellikleri[i].temperature = res[0].value;
                                            logger.info('orchestration.temperatureGetURL - kutu.temperature :', kutuOzellikleri[i].temperature);
                                        }
                                    }
                                    //logger.info('Temperature data was successfully taken from the server');
                                    callback(null, kutuOzellikleri);
                                }
                            });
                        });
                    },
                    function (kutuOzellikleri, callback) {
                        // console.log('Control Counter :', controlCounter);
                        controlCounter++;
                        // console.log('ControlCounter : ', controlCounter);
                        //console.log('KutuNumber  : ', kutuNumber);
                        // gerekli i�lemleri sadece son ad�mda yapmas� i�in yaz�ld�.

                        if (controlCounter == (kutuNumber)) {

                            //   for (var i =0; i<kutuNumber; i++){
                            //       console.log('Kutu �zellikleri :');
                            //       console.log(kutuOzellikleri[i]);
                            //   }

                            for (var i = 0; i < kutuNumber; i++) {
                                // oncelikle gelen kutu ozelliklerinin veritabaninda var olup olmadigi kontrol edilir.
                                databaseOperations.checkFromDatabase('kutular', kutuOzellikleri[i], function (error, checkData, kutu) {
                                    if (error) {
                                        errorDetail = 'databaseOperations.checkFromDatabase - Kutular - Veritabani kontrol fonksiyonu hata verdi : ';
                                       // logger.info('Veritabani kontrol fonksiyonu hata verdi : ', error);
                                        callback(error, errorDetail);
                                        return;
                                    }
                                    logger.info('databaseOperations.checkFromDatabase - Kutular - Check Data :', checkData);

                                    // Eger veritabaninda yoksa eklenir.
                                    if (checkData == 0) {
                                        logger.info('databaseOperations.checkFromDatabase - Kutular Check Data :  0 ');

                                        databaseOperations.addToDatabase('kutular', kutu, function (error) {
                                            if (error) {
                                                errorDetail = 'databaseOperations.addToDatabase - Kutular tablosuna veri ekleme sorgusu hata verdi : ';
                                               // logger.info('Kutular tablosuna veri ekleme sorgusu hata verdi : ', error);
                                                callback(error, errorDetail);
                                                return;
                                            }
                                            else {
                                                logger.info('databaseOperations.addToDatabase - Kutular tablosuna veriler basariyla eklendi');

                                                if (i == kutuNumber - 1) {
                                                    //logger.info('')
                                                    dbConnection.end();
                                                    callback();
                                                }
                                            }
                                        });
                                    }
                                    else { // Veritabaninda mevcutsa guncellenir.
                                        logger.info('databaseOperations.checkFromDatabase - Check Data değeri 0 dan farklı geldi');
                                        databaseOperations.updateDatabase('kutular',null,  kutu, function (error) {
                                            if (error) {
                                                errorDetail = 'databaseOperations.updateDatabase - Kutular tablosunu guncelleme sorgusu hata verdi : ';
                                            //  logger.info('Kutular tablosunu guncelleme sorgusu hata verdi : ', error);
                                                callback(error, errorDetail);
                                                return;
                                            }
                                            else {
                                                logger.info('databaseOperations.updateDatabase - Kutular tablosu basariyla guncellendi');
                                                if (i == kutuNumber - 1) {
                                                    dbConnection.end();
                                                    callback();
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                ],cb
            );
        });
    });
}

exports.getData = getData;
