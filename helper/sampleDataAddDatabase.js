
var sampleBoxes = require('../config/boxDatas');
var sampleCopAraclari = require('../config/copAraciData');
const log4js = require('log4js');
var databaseOperations = require('./databaseOperations');

log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../../var/log/sws_logs/activities.log' } },
    categories: { default: { appenders: ['cheese'], level: 'DEBUG' } }
});

const logger = log4js.getLogger('activities');

var errorDetail;
// config icindeki boxDatas ve copAraciData dosyalari icindeki verileri db ye yazma
function sampleBoxAddDatabase(cb){
    var boxCounter = 0;
    sampleBoxes.boxes.forEach(boxes => {
        logger.info('sampleBoxAddDatabase - boxCounter : ', boxCounter);
        boxCounter++;
        databaseOperations.checkFromDatabase('kutular', boxes, function (err, checkData, kutu) {
            logger.info('databaseOperations.checkFromDatabase - Kutular Check Data :', checkData);
    
            // Eger veritabaninda yoksa eklenir.
            if (checkData == 0) {
                logger.info('databaseOperations.checkFromDatabase - Kutular Check Data :  0 ');
                databaseOperations.addToDatabase('kutular', kutu, function (error) {
                    if (error) {
                        errorDetail = 'databaseOperations.addToDatabase - Kutular tablosuna belirledigimiz ornek verileri ekleme sorgusu hata verdi :';
                       // logger.info('Kutular tablosuna belirledigimiz ornek verileri ekleme sorgusu hata verdi :', error);
                        cb(error, errorDetail);
                        return;
                    }
                    else {
                        logger.info('databaseOperations.addToDatabase - Kutular tablosuna belirledigimiz ornek veriler eklendi');
                        if (boxCounter == boxes.length) {
                            dbConnection.end();
                            cb();
                        }
                    }
                });
            }
            else { // Veritabaninda mevcutsa guncellenir.
                logger.info('databaseOperations.checkFromDatabase - Kutular Check Data değeri 0 dan farklı geldi');
                databaseOperations.updateDatabase('kutular', null, kutu, function (error) {
                    if (error) {
                        errorDetail = 'databaseOperations.updateDatabase - Kutular tablosundaki ornek verileri guncelleme sorgusu hata verdi : ';
                       // logger.info('Kutular tablosundaki ornek verileri guncelleme sorgusu hata veri : ', error);
                        cb(error, errorDetail);
                        return;
                    }
                    else {
                        logger.info('databaseOperations.updateDatabase - Kutular tablosundaki ekledigimiz ornek veri guncellendi');
                        if (boxCounter == boxes.length) {
                            dbConnection.end();
                            cb();
                        }
                    }
                });
            }
        });
    });
}


function sampleTruckAddDatabase(cb){
    var aracCounter = 0;
    sampleCopAraclari.copAraclari.forEach(copAraclari => {
        logger.info('sampleTruckAddDatabase - aracCounter : ', aracCounter);
        aracCounter++;
        databaseOperations.checkFromDatabase('araclar', copAraclari, function (err, checkData, arac) {
            logger.info('databaseOperations.checkFromDatabase - Araclar Check Data :', checkData);
    
            // Eger veritabaninda yoksa eklenir.
            if (checkData == 0) {
                logger.info('databaseOperations.checkFromDatabase - Araclar Check Data :  0 ');
                databaseOperations.addToDatabase('araclar', arac, function (error) {
                    if (error) {
                        errorDetail = 'databaseOperations.addToDatabase - Araclar tablosuna veri ekleme sorgusu hata verdi : ';
                       // logger.info('Araclar tablosuna veri ekleme sorgusu hata verdi : ', error);
                        cb(error, errorDetail);
                        return;
                    }
                    else {
                        logger.info('databaseOperations.addToDatabase - Araclar tablosuna belirledigimiz veriler eklendi');
                        if (aracCounter == copAraclari.length) {
                            dbConnection.end();
                            cb();
                        }
                    }
                });
            }
            else { // Veritabaninda mevcutsa guncellenir.
                logger.info('databaseOperations.checkFromDatabase - Araclar Check Data değeri 0 dan farklı geldi');
                databaseOperations.updateDatabase('araclar', null, arac, function (error) {
                    if (error) {
                        errorDetail = 'databaseOperations.updateDatabase - Araclar tablosu veri guncelleme sorgusu hata verdi : ';
                       // logger.info('Araclar tablosu veri guncelleme sorgusu hata verdi : ', error);
                        cb(error, errorDetail);
                        return;
                    }
                    else {
                        logger.info('databaseOperations.updateDatabase - Araclar tablosundaki ekledigimiz arac bilgisi guncellendi');
                        if (aracCounter == copAraclari.length) {
                            dbConnection.end();
                            cb();
                        }
                    }
                });
            }
        });
    });
}


exports.sampleBoxAddDatabase = sampleBoxAddDatabase;
exports.sampleTruckAddDatabase= sampleTruckAddDatabase;