'use strict';

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../../var/log/sws_logs/activities.log' } },
    categories: { default: { appenders: ['cheese'], level: 'DEBUG' } }
});
const logger = log4js.getLogger('activities');



function boxCreater (result, dolulukEsikDegeri, box){
        // Veritabanından gelen box sayisi kadar box nesnesi olusturulur.
    var index = 0;
    for (var i = 0; i < result.length; i++) {
      
    
    //    if (result[i].doluluk >= dolulukEsikDegeri && (String(result[i].available) == '1') {
      
    // TODO : Burada doluluk değeri kontrolü ile kutu sayısı beliliyorum fakat assignValue metoduna burada yaratılan kutuyu gönderdigimizde
    // eşik değerinden küçük olanlar içinde bir işlem gerekiyor bu durumdada index hatası vermesi muhtemel
    if (result[i].doluluk >= dolulukEsikDegeri) {
            box[index] = {};
            box[index].locationLatitude;
            box[index].locationLongitude;
            box[index].solidityRatio;
            box[index].temperature;
            box[index].destinations = [];
            box[index].distanceTextArray;
            box[index].distanceArray;
            box[index].available;
            box[index].availableNo;
            index++;
        }
        if (i == result.length-1){
            return box;
        }
    }
}

function assignValueBox(result, dolulukEsikDegeri, box){
    var index = 0;
    for (var i = 0; i < result.length; i++) {
        // Doluluk değeri eşik değerinden büyük olan kutuların bilgilerini veritabanından al
     
     
      //  if (result[i].doluluk >= dolulukEsikDegeri  && (String(result[i].available) == '1')) {

            if (result[i].doluluk >= dolulukEsikDegeri) {
            box[index].locationLatitude = result[i].locationLatitude;
            box[index].locationLongitude = result[i].locationLongitude;
            box[index].solidityRatio = result[i].doluluk;
            box[index].temperature = result[i].sicaklık;
            box[index].available = result[i].available;
            box[index].availableNo = result[i].availableNo;
            index++;
        } else if (result[i].doluluk < dolulukEsikDegeri && result[i].available == '0'){
            // TODO : Bu kontrol kodu karıştırabilir, eğer karışırsa kaldır.
            box[index].locationLatitude = result[i].locationLatitude;
            box[index].locationLongitude = result[i].locationLongitude;
            box[index].solidityRatio = result[i].doluluk;
            box[index].temperature = result[i].sicaklık;
            box[index].availableNo = result[i].availableNo;
            box[index].available = '1';
            index++;
        }
        if (i == result.length-1){
            for (var j=0;j< box.length; j++){
                console.log('Box index :' + i + '\n ' + box[j] );
            }

            return box;
        }
    }
}


function truckCreater (result, truck){
    // Veritabanından gelen arac sayisi kadar truck nesnesi olusturulur.
    var index = 0;
    for (var i = 0; i < result.length; i++) {
        truck[index] = {};
        truck[index].locationLatitude;
        truck[index].locationLongitude;
        truck[index].city;
        truck[index].available;
        truck[index].availableNo;
        index++;
    
        if (i == result.length-1){
            return truck;
        }
    }
}

function assignValueTruck (result, truck ){
    var index = 0;
    for (var i = 0; i < result.length; i++) {
        // Araç bilgileri veritabanından alınır.
        truck[index].locationLatitude = result[i].locationLatitude;
        truck[index].locationLongitude = result[i].locationLongitude;
        truck[index].city = result[i].city;
        truck[index].available = result[i].available;
        truck[index].availableNo = result[i].availableNo;
        index++;

        if (i == result.length-1){
            return truck;
        }
    }
}


// TODO  : burayada belki availableNo ozelligi eklenecek ve main.js içinde çağrıldıgı yerlerde guncellenecek
function dataCreater (data, kutu){
    for (var k = 0; k < kutu.length; k++) {
        data[k] = {};
        data[k].aracLocation = [];
        data[k].kutuLocation = [];
        data[k].distance = [];
        data[k].aracAvailable = [];
        data[k].kutuAvailable = [];
    
        if (k == kutu.length-1){
            return data;
        }
    }
}

function Create2DArray(rows) {
    var arr = [];

    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }
    return arr;
}


exports.boxCreater = boxCreater;
exports.assignValueBox = assignValueBox;
exports.truckCreater = truckCreater;
exports.assignValueTruck = assignValueTruck;
exports.dataCreater = dataCreater;
exports.Create2DArray = Create2DArray;