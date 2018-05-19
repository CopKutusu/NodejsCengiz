
'use strict';

var http = require('http');
var httpRequest = require('./requests/http/httpRequest');
var orchestration = require('./requests/Orchestration');
var googleMaps = require('./requests/googleMapsRequests/mapsRequests');
var mysql = require('mysql');
var async = require('async');
const log4js = require('log4js');
var sampleBoxes = require('./config/boxDatas');
var sampleCopAraclari = require('./config/copAraciData');

log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../../var/log/sws_logs/activities.log' } },
    categories: { default: { appenders: ['cheese'], level: 'DEBUG' } }
});

const logger = log4js.getLogger('activities');
var options = {};
var googleMapsPath = {};

/**************************Buradaki veriler kutu eklendikçe yenilenecek*************** */
var kutuNumber = 8;
var users = [
    {
        username: 'cengize',
        kutuInformation: ['kutu', 'kutu2']
    },
    {
        username: 'are1414',
        kutuInformation: ['kutu3', 'kutu4']
    },
    {
        username: 'sws',
        kutuInformation: ['kutu5', 'kutu6']
    },
    {
        username: 'cnbrk_22',
        kutuInformation: ['kutu7', 'kutu8']
    }
];
/****************************************************************************************/


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '123456',
    database: 'xtbadmin',
});

connection.connect(function (err) {
    if (err) {
        logger.info('MySQL connecting error : ' + err.stack);
        return;
    }
    logger.info('MySQL connected as id ' + connection.threadId);
});
var tmp = new Array();

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

// son kutuya gelindiğinde veritabanı işlemlerini yapmak için tanımlandı
var controlCounter = 0;

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
                                logger.error('Get Box ID request returned error  : ', err);
                                callback(err);
                                return;
                            }
                            if (res.length === 0) {
                                logger.info("Get Box ID - Response was returned empty, No data for add");
                                return;
                            }
                            else {
                                // feed_key = kutu'x'.asdasdad
                                tmp = res[0].feed_key.split('.');
                                for (var i = 0; i < kutuNumber; i++) {
                                    if (tmp[0] === kutuNames[i]) {
                                        kutuOzellikleri[i].kutuID = res[0].value;
                                        logger.info('kutu.ID :', kutuOzellikleri[i].kutuID);
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
                                logger.error('Get Location Latitude request returned error  : ', err);
                                callback(err);
                                return;
                            }
                            if (res.length === 0) {
                                logger.info("Get Location Latitude - Response was returned empty, No data for add");
                                return;
                            }
                            else {
                                tmp = res[0].feed_key.split('.');
                                for (var i = 0; i < kutuNumber; i++) {
                                    if (tmp[0] === kutuNames[i]) {
                                        kutuOzellikleri[i].kutuLocationLatitude = res[0].value;
                                        logger.info('kutu.LocationLatitude :', kutuOzellikleri[i].kutuLocationLatitude);
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
                                logger.error('Get Location Longitude request returned error  : ', err);
                                callback(err);
                                return;
                            }
                            if (res.length === 0) {
                                logger.info("Get Location Longitude - Response was returned empty, No data for add");
                                return;
                            }
                            else {
                                tmp = res[0].feed_key.split('.');
                                for (var i = 0; i < kutuNumber; i++) {
                                    if (tmp[0] === kutuNames[i]) {
                                        kutuOzellikleri[i].kutuLocationLongitude = res[0].value;
                                        logger.info('kutu.LocationLongitude :', kutuOzellikleri[i].kutuLocationLongitude);
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
                                logger.error('Get Solidity Ratio request returned error  : ', err);
                                callback(err);
                                return;
                            }
                            if (res.length === 0) {
                                logger.info("Get Solidity Ratio - Response was returned empty, No data for add");
                                return;
                            }
                            else {
                                tmp = res[0].feed_key.split('.');
                                for (var i = 0; i < kutuNumber; i++) {
                                    if (tmp[0] === kutuNames[i]) {
                                        kutuOzellikleri[i].solidityRatio = res[0].value;
                                        logger.info('kutu.solidityRatio :', kutuOzellikleri[i].solidityRatio);
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
                                logger.error('Get Temperature request returned error  : ', err);
                                callback(err);
                                return;
                            }
                            if (res.length === 0) {
                                logger.info("Get Temperature - Response was returned empty, No data for add");
                                return;
                            }
                            else {
                                tmp = res[0].feed_key.split('.');
                                for (var i = 0; i < kutuNumber; i++) {
                                    if (tmp[0] === kutuNames[i]) {
                                        kutuOzellikleri[i].temperature = res[0].value;
                                        logger.info('kutu.temperature :', kutuOzellikleri[i].temperature);
                                    }
                                }
                                //logger.info('Temperature data was successfully taken from the server');
                                callback();
                            }
                        });
                    });
                },
                function (callback) {

                    // console.log('Control Counter :', controlCounter);
                    controlCounter++;
                    // console.log('ControlCounter : ', controlCounter);
                    //console.log('KutuNumber  : ', kutuNumber);
                    // gerekli işlemleri sadece son adımda yapması için yazıldı.

                    if (controlCounter == (kutuNumber)) {
                        /*
                        for (var i =0; i<kutuNumber; i++){
                     //       console.log('Kutu Özellikleri :');
                            console.log(kutuOzellikleri[i]);
                        }
                        */

                        for (var i = 0; i < kutuNumber; i++) {
                            var query1 = " UPDATE kutular SET locationLatitude = '" + String(kutuOzellikleri[i].kutuLocationLatitude) +
                                "' , locationLongitude = '" + String(kutuOzellikleri[i].kutuLocationLongitude) +
                                "' , doluluk = '" + String(kutuOzellikleri[i].solidityRatio) +
                                "' , sicaklık = '" + String(kutuOzellikleri[i].temperature) +
                                "' WHERE kutuid = '" + kutuOzellikleri[i].kutuID + "';";
                            connection.query(query1, function (error) {
                                if (error) {
                                    logger.info('Query1 has an error : ', error);
                                }
                            });
                        }
                        //connection.end();
                    }
                }
            ]);
    });
});

var boxCounter =0;
sampleBoxes.boxes.forEach(boxes => {
    logger.info('boxCounter : ', boxCounter);
    boxCounter++;
    async.waterfall(
        [
            function (callback) {
                var query2 = " SELECT COUNT(locationLatitude) AS sayi FROM xtbadmin.kutular WHERE  locationLatitude = '" + String(boxes.latitude) +
                    "' and  locationLongitude = '" + String(boxes.longitude) +
                    "' and doluluk = '" + String(boxes.solidityRatio) +
                    "' and sicaklık = '" + String(boxes.temperature) + "';";

                connection.query(query2, function (error, result) {
                    if (error) {
                        logger.info('Veritabaninda varlik kontrolü sorgusu hata verdi : ', error);
                    }
                    else {
                        callback(result);
                    }
                });
            },
            function (callback) {
                var query3 = " INSERT INTO xtbadmin.kutular (locationLatitude, locationLongitude, doluluk, sicaklık) values ('" + String(boxes.latitude) +
                    "','" + String(boxes.longitude) +
                    "','" + String(boxes.solidityRatio) +
                    "','" + String(boxes.temperature) + "');";
                 logger.info('Query3 : ', query3);

                if (result[0].sayi == 0) {
                    logger.info('Query3 : ', query3);
                    connection.query(query3, function (error) {
                        if (error) {
                            logger.info('Veritabanina ekleme sorgusu hata verdi : ', error);
                        }

                    });
                }
                if (boxCounter == boxes.length-1) {
                    connection.end();
                }
                callback();
            }

        ]);

});




    


/*
let copAraci = {
    latitude : 40.757390,
    longitude: 29.825421
}


 
 
 
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
 
googleMaps.distanceCalculate(copAraci, destination, (result)=>{
    googleMapsPath = result;
    console.log('Sonuc : ', result);
});
 

*/