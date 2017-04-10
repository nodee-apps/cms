'use strict';

var http = require('http'),
    https = require('https'),
    nodeUrl = require('url'),
    fs = require('fs');

// clear packages folder
deleteFolderRecursiveSync('packages');

// create packages folder
fs.mkdirSync('packages');

module.exports.downloadPackages = downloadPackages;
module.exports.downloadFile = downloadFile;
module.exports.deleteFolderRecursiveSync = deleteFolderRecursiveSync;


function downloadPackages(packages, cb, i){
    i = i || 0;

    var baseUrl = 'https://packages.nodee.io/' +(packages.accessKey ? packages.accessKey+'/' : '')+ 'latest/';
    var fileStream = fs.createWriteStream('packages/' + packages[i] + '.package');
    var url = baseUrl + packages[i] + '.package';

    downloadFile(url, fileStream, function(err){
        if(err) throw err;

        var fileStream = fs.createWriteStream('packages/' + packages[i] + '.package.json');
        var url = baseUrl + packages[i] + '.package.json';
        downloadFile(url, fileStream, function(err){
            if(err) throw err;
            i++;
            if(i < packages.length) downloadPackages(packages, cb, i);
            else cb();
        });
    });
}

function downloadFile(url, fileStream, cb){ // cb(err)
    var agent = http;
    if(url.substring(0,5)==='https') agent = https;

    var requestOpts = nodeUrl.parse(url);

    // fake browser headers
    requestOpts.headers = {};

    agent.get(requestOpts, function(res){
        if([301,302].indexOf(res.statusCode) > -1 && res.headers.location){
            // follow redirect
            return downloadFile(res.headers.location, fileStream, cb);
        }

        res.pipe(fileStream);
        res.on('end', cb);
    });
}

function deleteFolderRecursiveSync(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursiveSync(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}