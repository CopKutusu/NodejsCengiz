'use strict';

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../../var/log/sws_logs/activities.log' } },
    categories: { default: { appenders: ['cheese'], level: 'DEBUG' } }
});
const logger = log4js.getLogger('activities');



function printBox(kutu){
    for (var i = 0; i < kutu.length; i++) {
        logger.info('Latitude : ' + kutu[i].locationLatitude + ' ' +
            'Longitude : ', kutu[i].locationLongitude + ' ' +
            'Doluluk : ', kutu[i].solidityRatio + ' ' +
            'Sıcaklık : ', kutu[i].temperature + ' '+
            'Available : ', kutu[i].available);
    }
}

function printTruck(arac){
    for (var i = 0; i < arac.length; i++) {
        logger.info('Arac Latitude  : ', arac[i].locationLatitude + ' ' + 'Longitude :' + arac[i].locationLongitude + ' ' + 'City : ' + arac[i].city);
    }
}

exports.printBox = printBox;
exports.printTruck = printTruck;
