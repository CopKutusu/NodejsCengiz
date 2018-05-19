'use strict';

var googleMaps = require('./requests/googleMapsRequests/mapsRequests');
const log4js = require('log4js');
var sampleBoxes = require('./config/boxDatas');
var sampleCopAraclari = require('./config/copAraciData');
var distance = require('google-distance-matrix');
var databaseOperations = require('./helper/databaseOperations');
var getDataFromAdafruit = require('./helper/getDataFromAdafruit');
var sampleDataAddDatabase = require('./helper/sampleDataAddDatabase');

var databaseOperations = require('./helper/databaseOperations');
var createHelper = require('./helper/createHelper');
var printHelper = require('./helper/printHelper');
var sortHelper = require('./helper/sortHelper');
var async = require('async');

log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../../var/log/sws_logs/activities.log' } },
    categories: { default: { appenders: ['cheese'], level: 'DEBUG' } }
});

const logger = log4js.getLogger('activities');
var userInfo = require('./config/users');

var kutuNumber = userInfo.kutuNumber;
var users = userInfo.users;


/*
getDataFromAdafruit.getData(users, kutuNumber, function(error, prefixError){
    logger.info(prefixError, error);
});


sampleDataAddDatabase.sampleBoxAddDatabase(function(error, prefixError){
    logger.info(prefixError, error);
});

sampleDataAddDatabase.sampleTruckAddDatabase(function(error, prefixError){
    logger.info(prefixError, error);
});
*/

// kodun ilerleyen kısımlarında doluluk eşik değerini aşan kutularda işlemler yapılır.
var dolulukEsikDegeri = 35;
var kutu = [];
var arac = [];

// Eğer kutu boşaltımışsa ve available değeri güncellenmemişse , available değerini güncellemeden önce ilgisi olan araç bulunur.
var degisecekAvailableArac;

distance.key('AIzaSyD2zhehMtRu-69wZ4fuoUO0Exn877gAnx8');
distance.units('metric');
distance.mode('driving');

// veritabanından kutular tablosundan veriler getirilir.
databaseOperations.getDataFromDatabase('kutular', function (error, result) {
    if (error){
        logger.info('databaseOperations.getDataFromDatabase- kutular - error : ', error);
        return;
    }
    degisecekAvailableArac = databaseOperations.updateIfTresholdKutu('kutular', dolulukEsikDegeri, result);
    //console.log('ARAC LISTESI :' ,degisecekAvailableArac);

    kutu = createHelper.boxCreater(result, dolulukEsikDegeri, kutu);

    var distanceArray = [];
    var distanceTextArray = [];

    async.waterfall([
        function (callback) {
            kutu = createHelper.assignValueBox(result, dolulukEsikDegeri, kutu);
            callback();
        },
        function (callback) {
        //  printHelper.printBox(kutu);
            callback();
        },
        function (callback) {
            // veritabanından araclar tablosundan veriler getirilir.
            databaseOperations.getDataFromDatabase('araclar', function (errorArac, resultArac) {
                if (errorArac){
                    logger.info('databaseOperations.getDataFromDatabase- araclar - error : ', errorArac);
                    return;
                }
                // bu değişti değeri çok önemli değil sadece fonksiyon bir sonuç döndürdüğü için koydum.
                var degisti ;
                degisti = databaseOperations.updateIfTresholdArac('araclar', degisecekAvailableArac, resultArac);

                arac = createHelper.truckCreater(resultArac, arac);
                arac = createHelper.assignValueTruck(resultArac, arac);
                callback();
            });
        },
        function (callback) {
          //  printHelper.printTruck(arac);

            // başlangıç noktasının location ve available bilgileri
            var origins = [];
            origins.location = [];
            origins.available = [];

            for (var k = 0; k < arac.length; k++) {
                var x = Number(arac[k].locationLatitude).toFixed(6) + ',' + Number(arac[k].locationLongitude).toFixed(6);
                origins.location.push(x);
                origins.available.push(arac[k].available);
            }

            for (var k = 0; k < kutu.length; k++) {
                var x = Number(kutu[k].locationLatitude).toFixed(6) + ',' + Number(kutu[k].locationLongitude).toFixed(6);
                kutu[k].destinations.push(x);
            }

            /*
            for (var k = 0; k < kutu.length; k++) {
                logger.info('Destination : ', kutu[k].destinations);
            }

            for (var k = 0; k < origins.length; k++) {
               logger.info('Arac Listesi : ', origins[k]);
            }
            */


            // sonuc[k].aracLocation  => sonuc[k].arac       => sonuc[k].arac.aracLocation

            var islem1 = [];
            islem1 = createHelper.dataCreater(islem1, kutu);

            var sonuc = [];
            sonuc = createHelper.dataCreater(sonuc, kutu);

            var sıralıSonuc = [];
            sıralıSonuc = createHelper.dataCreater(sıralıSonuc, kutu);


            // count degeri foreach'in son değerini bulabilmek için kullanıldı.
            var count = 0;
            var calculatedDistanceMatrix = createHelper.Create2DArray(kutu.length);
            kutu.forEach(kutular => {
                var count2 = 0;
                distance.matrix(origins.location, kutular.destinations, function (err, distances) {
                    logger.info('Kutu No : ' + count + '    ' + 'Kutu Location:' + kutular.destinations);
                    // logger.info('Origin Ava : ' + origins.available + '    ' + 'Origin Location:' +  origins.location);

                    if (err) {
                        return logger.info('distance.matrix - error : ', err);
                    }
                    if (!distances) {
                        return logger.info('no distances');
                    }

                    if (distances.status == 'OK') {

                        for (var i = 0; i < origins.location.length; i++) {

                            for (var j = 0; j < 1; j++) { // kutular.destinations kutular dizisinin bir elemanını temsil ettigi icin j<1 kullanıldı.
                                //var origin = distances.origin_addresses[i];
                                //  var destination = distances.destination_addresses[j];
                                if (distances.rows[0].elements[j].status == 'OK') {

                                    // distance.text -> 26000 metreyi 26 km olarak yazar.
                                    var distanceText = distances.rows[i].elements[j].distance.text;
                                    var distance = distances.rows[i].elements[j].distance.value;
                                    kutular.distanceArray = distance;
                                    kutular.distanceTextArray = distanceText;
                                    // logger.info('Arac : '+origins.location[i] + ' '+'Distace : ' + kutular.distanceArray + ' ' + 'Location : ' + kutular.destinations + ' ' + 'Distance Text : ' + kutular.distanceTextArray + ' ' + 'Doluluk : ' + kutular.solidityRatio);

                                    //logger.info('Distace  : ' + kutular.distanceArray + ' ' + 'Location : ' + kutular.destinations + ' ' + 'Distance Text : ' + kutular.distanceTextArray + ' ' + 'Doluluk : ' + kutular.solidityRatio);
                                    // var destination = distances.destination_addresses[j];                                                                  

                                    if (count != kutu.length) {
                                        calculatedDistanceMatrix[count][i] = kutular.distanceArray;
                                    }
                                    islem1[i].aracLocation.push(origins.location[i]);
                                    islem1[i].kutuLocation.push(kutular.destinations);
                                    islem1[i].distance.push(calculatedDistanceMatrix[count][i]);
                                    islem1[i].aracAvailable.push(origins.available[i]);
                                    islem1[i].kutuAvailable.push(kutular.available);


                                    //logger.info('Arac Location '+ i + ' : ' +origins.location[i] + ' ' + 'Kutu Location : ' + kutular.destinations + ' ' + 'Distance Text : ' + kutular.distanceTextArray + ' ' + 'Matris: ' +calculatedDistanceMatrix[count][i]);


                                    // Buradan itibaren araç ve kutu arasındaki mesafeye göre sıralama işlemi yapılır.
                                    if (count == kutu.length - 1 && count2 == arac.length - 1) {

                                        for (var m = 0; m < arac.length; m++) {

                                            for (var n = 0; n < islem1[0].kutuLocation.length; n++) {

                                                // console.log('Aracin Konumu :' + islem1[m].aracLocation[n] + ' ' + 'Kutunun Konumu :'+ islem1[m].kutuLocation[n] + ' ' + 'Aradaki Mesafe :' + islem1[m].distance[n] + '\n');
                                                sonuc[n].aracLocation.push(islem1[m].aracLocation[n]);
                                                sonuc[n].kutuLocation.push(islem1[m].kutuLocation[n]);
                                                sonuc[n].distance.push(islem1[m].distance[n]);
                                                sonuc[n].aracAvailable.push(islem1[m].aracAvailable[n]);
                                                sonuc[n].kutuAvailable.push(islem1[m].kutuAvailable[n]);


                                                if (m == arac.length - 1 && n == islem1[0].kutuLocation.length - 1) {
                                                    //    console.log(sonuc);
                                                    //   console.log('After : \n');
                                                    for (var k = 0; k < sonuc.length; k++) {
                                                        var tmpSonuc = sortHelper.sort(sonuc[k]);

                                                        sıralıSonuc[k].aracLocation.push(tmpSonuc.aracLocation);
                                                        sıralıSonuc[k].kutuLocation.push(tmpSonuc.kutuLocation);
                                                        sıralıSonuc[k].distance.push(tmpSonuc.distance);
                                                        sıralıSonuc[k].aracAvailable.push(tmpSonuc.aracAvailable);
                                                        sıralıSonuc[k].kutuAvailable.push(tmpSonuc.kutuAvailable);

                                                        //      console.log('Arac :' + tmpSonuc.aracLocation + ' \n' + 'Kutu :'+ tmpSonuc.kutuLocation + ' \n' + 'Yol: ' +tmpSonuc.distance + '\n' + 'Arac Musaitlik : ' + tmpSonuc.aracAvailable + '\n' + 'Kutu Musaitlik : ' + tmpSonuc.kutuAvailable);


                                                        if (k == sonuc.length - 1) {
                                                            console.log('Sıralanmış Veri : \n');


                                                            for (var x = 0; x < sıralıSonuc.length; x++) {
                                                                // console.log(sıralıSonuc[x]);


                                                                // Eğer kutuya herhangi bir rota girilmemişse
                                                                if (sıralıSonuc[x].kutuAvailable[0][x] == 1) {
                                                                    // Burada araclarla ilgili islemleri ilk (sıralıSonuc[0]) üzerinden yaptım.Çünkü 
                                                                    // diger turlu hepsinde araclar ayrı ayrı yaratıldığı için birinde dolu olan arac bir arac
                                                                    // farklı kutuda yine aynı arac boş gözüküyordu.

                                                                    for (var w = 0; w < sıralıSonuc[0].aracAvailable[0].length; w++) {
                                                                        // Kutuya herhangi bir rota girilmemiş ve arac musaitse 
                                                                        if (sıralıSonuc[0].aracAvailable[0][w] == 1 && sıralıSonuc[x].kutuAvailable[0][x] == 1) {
                                                                        //    console.log('W değeri : ', w);
                                                                        //    console.log('X değeri : ',x );
                                                                            // ilgili arac ve ilgili kutu musaitlik durumu false yapılır.

                                                                            console.log('Kutu : ' + sıralıSonuc[x].kutuLocation[0][x] + ' ' + 'Arac :' + sıralıSonuc[0].aracLocation[0][w] + ' ' + 'Mesafe : ' + sıralıSonuc[x].distance[0][x] );
                                                                            sıralıSonuc[0].aracAvailable[0][w] = 0;
                                                                            sıralıSonuc[x].kutuAvailable[0][x] = 0;

                                                                            // veritabanında sorgu için location hazırlama
                                                                            var tmp1 = String(sıralıSonuc[x].kutuLocation[0][x]);
                                                                            var tmpLocationKutu = tmp1.split(',');
                                                                        
                                                                            var tmpKutu = {
                                                                                kutuLocationLatitude: tmpLocationKutu[0],
                                                                                kutuLocationLongitude:   tmpLocationKutu[1],
                                                                                availableNo: x
                                                                            };

                                                                            var tmp2 = String(sıralıSonuc[0].aracLocation[0][w]);
                                                                            var tmpLocationArac = tmp2.split(',');


                                                                            // Bu kısımlarda bulunan availableNo değeri kod tekrar çalıştığı zaman veritabanına bakıldığında
                                                                            // hangi aracın hangi kutuya gittiğini göstermek ve aracın available değeri güncelleyebilmek için
                                                                            // kullanılmaktadır.
                                                                            var tmpArac = {
                                                                                lat: tmpLocationArac[0],
                                                                                lng: tmpLocationArac[1],
                                                                                availableNo: w
                                                                            }

                                                                            // Bu location bilgilerinde bulunan kutuların available değerleri 0 yapılır.
                                                                            databaseOperations.updateDatabase('kutular','0',  tmpKutu, function (error) {
                                                                                if (error) {
                                                                                    errorDetail = 'databaseOperations.updateDatabase - Kutular tablosunu available alanı guncelleme sorgusu hata verdi : ';
                                                                                //  logger.info('Kutular tablosunu guncelleme sorgusu hata verdi : ', error);
                                                                                    callback(error, errorDetail);
                                                                                    return;
                                                                                }
                                                                                else {
                                                                                    logger.info('databaseOperations.updateDatabase - Kutular tablosu available alanı basariyla guncellendi');
                                                                                }
                                                                            });


                                                                            databaseOperations.updateDatabase('araclar','0',  tmpArac, function (error) {
                                                                                if (error) {
                                                                                    errorDetail = 'databaseOperations.updateDatabase - Araclar tablosunu available alanı guncelleme sorgusu hata verdi : ';
                                                                                //  logger.info('Kutular tablosunu guncelleme sorgusu hata verdi : ', error);
                                                                                    callback(error, errorDetail);
                                                                                    return;
                                                                                }
                                                                                else {
                                                                                    logger.info('databaseOperations.updateDatabase - Araclar tablosu available alanı basariyla guncellendi');
                                                                                }
                                                                            });

                                                                        }
                                                                    }
                                                                }

                                                            }

                                                            for (var x = 0; x < sıralıSonuc.length; x++) {

                                                       //         console.log(sıralıSonuc[x]);

                                                                //console.log('Arac : ', sıralıSonuc[x].aracLocation[0][0]);
                                                                //console.log('Kutu : ', sıralıSonuc[x].kutuLocation[0][0]);
                                                                //console.log('Distance : ', sıralıSonuc[x].distance[0][0]);
                                                                //console.log('Arac Musaitlik : ', sıralıSonuc[x].aracAvailable[0][0]);
                                                                //console.log('Kutu Musaitlik : ', sıralıSonuc[x].kutuAvailable[0][0]);

                                                                //Burada çıkan  araç kutu ve mesafe bilgileri yeni bir tabloya yazılabilir.Bu arac ve kutuların
                                                                // available değerleri false(0) yapılacak.Fakat dikkat edilmesi gereken bir nokta var.Bir araç birden fazla
                                                                // çop kutusuna yakın olabilir.Bunun kontrolünü ve algoritmasını düşün.

                                                                //    console.log('Arac' +x+' :' + sıralıSonuc[x].aracLocation + ' \n' + 'Kutu :'+ sıralıSonuc[x].kutuLocation + ' \n' + 'Yol: ' +sıralıSonuc[x].distance + '\n' + 'Arac Musaitlik : ' + sıralıSonuc[x].aracAvailable + '\n' + 'Kutu Musaitlik : ' + sıralıSonuc[x].kutuAvailable);

                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    count2++;
                                } else {
                                    // console.log(destination + ' is not reachable by land from ' + origin);
                                }
                            }
                        }
                    }
                    count++;
                });
            });
            callback();
        }
    ]);
});
