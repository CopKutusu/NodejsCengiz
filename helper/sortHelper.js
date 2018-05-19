'use strict';

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../../var/log/sws_logs/activities.log' } },
    categories: { default: { appenders: ['cheese'], level: 'DEBUG' } }
});
const logger = log4js.getLogger('activities');


function sort(array) {
    var tmp;
    for (var i = 0; i < array.aracLocation.length; i++) {
        for (var j = 0; j < i; j++) {
            if (array.distance[i] < array.distance[j]) {

                tmp = array.aracLocation[i];
                array.aracLocation[i] = array.aracLocation[j];
                array.aracLocation[j] = tmp;

                tmp = array.kutuLocation[i];
                array.kutuLocation[i] = array.kutuLocation[j];
                array.kutuLocation[j] = tmp;


                tmp = array.distance[i];
                array.distance[i] = array.distance[j];
                array.distance[j] = tmp;

                tmp = array.aracAvailable[i];
                array.aracAvailable[i] = array.aracAvailable[j];
                array.aracAvailable[j] = tmp;

                tmp = array.kutuAvailable[i];
                array.kutuAvailable[i] = array.kutuAvailable[j];
                array.kutuAvailable[j] = tmp;
            }
        }
    }
    return array;
}

exports.sort = sort;