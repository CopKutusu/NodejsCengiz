'use strict';

var dbConnect = require('../config/dbConnection');
const log4js = require('log4js');
var dbConnection = dbConnect.connection;
log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../../var/log/sws_logs/activities.log' } },
    categories: { default: { appenders: ['cheese'], level: 'DEBUG' } }
});

const logger = log4js.getLogger('activities');

dbConnection.connect(function (err) {
    if (err) {
        logger.info('dbConnection.connect - MySQL connecting error : ' + err.stack);
        return;
    }
    logger.info('dbConnection.connect - MySQL connected as id ' + dbConnection.threadId);
});

function checkFromDatabase(table, attribute, callback) {
    if (table == 'kutular') {
        // Sorguyu boyle yazınca doluluk ve sıcaklık değeri farklı geldiginde veritabanına ekleme yapmaya devam etti.
        // var checkFromDatabaseQuery = " Select count(*) as sayi from xtbadmin.kutular where locationLatitude= '" + (attribute.kutuLocationLatitude) +
        //     "' and  locationLongitude = '" + (attribute.kutuLocationLongitude) +
        //     "' and doluluk = '" + (attribute.solidityRatio) +
        //     "' and sicaklık = '" + (attribute.temperature) + "';";


        // TODO: Yazılan yeni sorgunun dogru calisip calismadigi kontrol edilecek.
        var checkFromDatabaseQuery = " Select count(*) as sayi from xtbadmin.kutular where locationLatitude= '" + (attribute.kutuLocationLatitude) +
            "' and  locationLongitude = '" + (attribute.kutuLocationLongitude) + "';";

        logger.info('checkFromDatabase - Kutular tablosu kontrol sorgusu : ', checkFromDatabaseQuery);



        // logger.info('KUTU OZELLIKLERI LATITUDE: ',kutuOzellikleri[i].kutuLocationLatitude);

        dbConnection.query(checkFromDatabaseQuery, function (error, result) {
            if (error)
                callback(error, null);
            else {
                logger.info('checkFromDatabase - Kutular tablosundaki eslesen veri sayisi :', result[0].sayi);
                callback(null, result[0].sayi, attribute);
            }
        });
    }
    else if (table == 'araclar') {

        var checkFromDatabaseQuery = " Select count(*) as sayi from xtbadmin.araclar where locationLatitude= '" + (attribute.lat) +
            "' and  locationLongitude = '" + (attribute.lng) +
            "' and city = '" + (attribute.city) + "';";

        logger.info('checkFromDatabase - Araclar tablosu kontrol sorgusu : ', checkFromDatabaseQuery);
        // logger.info('KUTU OZELLIKLERI LATITUDE: ',kutuOzellikleri[i].kutuLocationLatitude);

        dbConnection.query(checkFromDatabaseQuery, function (error, result) {
            if (error)
                callback(error, null);
            else {
                logger.info('checkFromDatabase - Araclar tablosundaki eslesen veri sayisi :', result[0].sayi);
                callback(null, result[0].sayi, attribute);
            }
        });
    }
}

function addToDatabase(table, attribute, callback) {
    if (table == 'kutular') {
        var addToDatabaseQuery = " INSERT INTO xtbadmin.kutular (locationLatitude, locationLongitude, doluluk, sicaklık) values ('" + String(attribute.kutuLocationLatitude) +
            "','" + String(attribute.kutuLocationLongitude) +
            "','" + String(attribute.solidityRatio) +
            "','" + String(attribute.temperature) + "');";
        dbConnection.query(addToDatabaseQuery, function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback();
        });
    }
    else if (table == 'araclar') {
        var addToDatabaseQuery = " INSERT INTO xtbadmin.araclar (locationLatitude, locationLongitude, city) values ('" + String(attribute.lat) +
            "','" + String(attribute.lng) +
            "','" + String(attribute.city) +
            "');";
        dbConnection.query(addToDatabaseQuery, function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback();
        });
    }
}

function updateDatabase(table, available, attribute, callback) {
    // available sorgusunun çalışması için bir kontrol , ileride burası daha düzgün bir yapıya sahip olmalı
    if (table == 'kutular' && available == '0') {
        // NOT: Kutu id'lere gore guncelleme yapılamadi cunku id otomatik artıyordu.
        var updateDatabaseQuery = " UPDATE xtbadmin.kutular SET available = '" + String(available) + "', availableNo = '" + String(attribute.availableNo) +
            "' WHERE locationLatitude = '" + String(attribute.kutuLocationLatitude) + "' and locationLongitude = '" + String(attribute.kutuLocationLongitude) + "';";

        //   logger.info('Kutular tablosu guncelleme sorgusu : ',updateDatabaseQuery );
        dbConnection.query(updateDatabaseQuery, function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback();
        });
    }
    else if (table == 'kutular' && available == '1') {
        // NOT: Kutu id'lere gore guncelleme yapılamadi cunku id otomatik artıyordu.
        var updateDatabaseQuery = " UPDATE xtbadmin.kutular SET available = '" + String(available) + "', availableNo = '" + String(attribute.availableNo) +
            "' WHERE locationLatitude = '" + String(attribute.kutuLocationLatitude) + "' and locationLongitude = '" + String(attribute.kutuLocationLongitude) + "';";

        //   logger.info('Kutular tablosu guncelleme sorgusu : ',updateDatabaseQuery );
        dbConnection.query(updateDatabaseQuery, function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback();
        });
    }
    else if (table == 'kutular') {
        // NOT: Kutu id'lere gore guncelleme yapılamadi cunku id otomatik artıyordu.
        var updateDatabaseQuery = " UPDATE xtbadmin.kutular SET locationLatitude = '" + String(attribute.kutuLocationLatitude) +
            "' , locationLongitude = '" + String(attribute.kutuLocationLongitude) +
            "' , doluluk = '" + String(attribute.solidityRatio) +
            "' , sicaklık = '" + String(attribute.temperature) +
            "' WHERE locationLatitude = '" + String(attribute.kutuLocationLatitude) + "' and locationLongitude = '" + String(attribute.kutuLocationLongitude) + "';";

        //   logger.info('Kutular tablosu guncelleme sorgusu : ',updateDatabaseQuery );
        dbConnection.query(updateDatabaseQuery, function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback();
        });
    }
    else if (table == 'araclar' && available == '0') {
        // TODO : Araclar tablosundada aracID otomatik artıyor.Bir primary key belirlenmeli (orn: plaka)
        var updateDatabaseQuery = " UPDATE xtbadmin.araclar SET available = '" + String(available) + "', availableNo = '" + String(attribute.availableNo) +
            "' WHERE locationLatitude = '" + String(attribute.lat) + "' and locationLongitude = '" + String(attribute.lng) + "';";
        console.log('UPDATE SORGUSU :', updateDatabaseQuery);
        dbConnection.query(updateDatabaseQuery, function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback();
        });
    }
    else if (table == 'araclar' && available == '1') {
        // TODO : Araclar tablosundada aracID otomatik artıyor.Bir primary key belirlenmeli (orn: plaka)
        var updateDatabaseQuery = " UPDATE xtbadmin.araclar SET available = '" + String(available) + "', availableNo = '" + String(attribute.availableNo) +
            "' WHERE locationLatitude = '" + String(attribute.lat) + "' and locationLongitude = '" + String(attribute.lng) + "';";
        dbConnection.query(updateDatabaseQuery, function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback();
        });
    }
    else if (table == 'araclar') {
        // TODO : Araclar tablosundada aracID otomatik artıyor.Bir primary key belirlenmeli (orn: plaka)
        var updateDatabaseQuery = " UPDATE xtbadmin.araclar SET locationLatitude = '" + String(attribute.lat) +
            "' , locationLongitude = '" + String(attribute.lng) +
            "' , city = '" + String(attribute.city) +
            "'  WHERE aracID = '" + attribute.aracID + "';";
        dbConnection.query(updateDatabaseQuery, function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback();
        });
    }
}


function getDataFromDatabase(table, callback) {
    if (table == 'kutular') {
        var getDataFromDatabaseQuery = " Select locationLatitude,locationLongitude,doluluk,sicaklık,available,availableNo from xtbadmin.kutular;";
        logger.info('getDataFromDatabase - Kutular tablosundan verileri getirme sorgusu : ', getDataFromDatabaseQuery);
        dbConnection.query(getDataFromDatabaseQuery, function (error, result, fields) {
            if (error) {
                callback(error);
                return;
            }
            else {
                //   logger.info('Kutular tablosundaki veriler :', result);
                //   logger.info('Kutular tablosundaki veriler - 0 :', result[0]);
                //  logger.info('Kutular tablosundaki veriler - 1 :', result[1]);
                //  logger.info('Kutular tablosundaki veriler length :', result.length);

                // logger.info('Kutular Fields :', fields);
                callback(null, result);
            }
        });
    }
    else if (table == 'araclar') {
        var getDataFromDatabaseQuery = " Select locationLatitude,locationLongitude,city,available,availableNo from xtbadmin.araclar;";
        logger.info('getDataFromDatabase - Araclar tablosundaki verileri getirme sorgusu: ', getDataFromDatabaseQuery);
        dbConnection.query(getDataFromDatabaseQuery, function (error, result, fields) {
            if (error)
                callback(error);
            else {
                logger.info('getDataFromDatabase - Araclar tablosundaki veriler :', result);
                // logger.info('Araclar Fields :', fields);
                callback(null, result);
            }
        });
    }
}


function updateIfTresholdKutu(table, dolulukEsikDegeri, result) {

    // Temizlenen kutularda kalan availableNo değerleri bulunur.Bu numara araçlardada mevcuttur.Kutulardan sonra araçlarında availableNo değerleri -1 yapılacaktır.
    var aracListesi = [];
    var availableColumn = '1';
    var availableNoColumn = '-1';
    for (var i = 0; i < result.length; i++) {
        //  console.log('DOLULUK : ' + result[i].doluluk+  ' ' + 'AVAILABLE : ' + result[i].available);
        if (table == 'kutular' && result[i].available == '0' && result[i].doluluk < dolulukEsikDegeri) {
            aracListesi.push(result[i].availableNo);

            // NOT: Kutu id'lere gore guncelleme yapılamadi cunku id otomatik artıyordu.
            var updateDatabaseQuery = " UPDATE xtbadmin.kutular SET available = '" + String(availableColumn) + "', availableNo = '" + String(availableNoColumn) +
                "' WHERE locationLatitude = '" + String(result[i].locationLatitude) + "' and locationLongitude = '" + String(result[i].locationLongitude) + "';";
            logger.info('updateIfTresholdKutu - Kutular tablosundaki available sütununu güncelleme sorgusu : ', updateDatabaseQuery);

            dbConnection.query(updateDatabaseQuery, function (error) {
                if (error) {
                    logger.info('updateIfTresholdKutu - Kutular tablosundaki available sütununu güncelleme sorgusu  hata verdi: ', error);
                    return;
                }
            });
        }
        if (i == result.length - 1) {
            //  console.log('ARAC LISTESI :', aracListesi);
            return aracListesi;
        }
    }
}

function updateIfTresholdArac(table, aracListesi, result) {

    // Temizlenen kutularda kalan availableNo değerleri bulunur.Bu numara araçlardada mevcuttur.Kutulardan sonra araçlarında availableNo değerleri -1 yapılacaktır

    var availableColumn = '1';
    var availableNoColumn = '-1';
    for (var i = 0; i < result.length; i++) {
        //  console.log('DOLULUK : ' + result[i].doluluk+  ' ' + 'AVAILABLE : ' + result[i].available);
        if (table == 'araclar' && result[i].available == '0') {
            for (var j = 0; j < aracListesi.length; j++) {
                if (aracListesi[j] == result[i].availableNo) {
                    console.log('AVALILABLE DEGER: ', result[i].availableNo);
                    // NOT: Kutu id'lere gore guncelleme yapılamadi cunku id otomatik artıyordu.
                    var updateDatabaseQuery = " UPDATE xtbadmin.araclar SET available = '" + String(availableColumn) + "', availableNo = '" + String(availableNoColumn) +
                        "' WHERE locationLatitude = '" + String(result[i].locationLatitude) + "' and locationLongitude = '" + String(result[i].locationLongitude) + "';";

                    logger.info('updateIfTresholdArac - Araclar tablosundaki available sütununu güncelleme sorgusu : ', updateDatabaseQuery);
                    dbConnection.query(updateDatabaseQuery, function (error) {
                        if (error) {
                            logger.info('updateIfTresholdArac - Araclar tablosundaki available sütununu güncelleme sorgusu  hata verdi: ', error);
                            return error;
                        }
                    });
                }
            }
        }
        if (i == result.length - 1) {
            //  console.log('ARAC LISTESI :', aracListesi);
            return aracListesi;
        }
    }
}


exports.addToDatabase = addToDatabase;
exports.checkFromDatabase = checkFromDatabase;
exports.updateDatabase = updateDatabase;
exports.getDataFromDatabase = getDataFromDatabase;
exports.updateIfTresholdKutu = updateIfTresholdKutu;
exports.updateIfTresholdArac = updateIfTresholdArac;