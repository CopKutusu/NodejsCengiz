var http = require('http');

function httpGetRequest(options, callback) {
    var responseParse;
    http.get(options, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            responseParse = JSON.parse(body);
            callback(null, responseParse);
        });
    }).on('error', function (e) {
        callback(e);
        return;
    });
}

exports.httpGetRequest = httpGetRequest;