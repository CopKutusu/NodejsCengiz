

var async = require('async');


function get (cb){

    async.waterfall(
        [
            function(callback){
                callback();
            },
            function(callback){
                error = undefined;
                if (error)
                {
                    callback(error, 'hata var');
                    return;
                }
                callback();
                //return;
            },
            function(callback){

                y = 'Error 2';
                if (y){
                    callback(y, 'Succ');
                    return;
                }
                callback();


            }
        ],cb);
}

get(function(err, where){
    console.log('Fonksiyon Cagrildi :',where, err);
});

