// ===================================================
// IMPORTANT: only for production
// total.js - web application framework for node.js
// http://www.totaljs.com
// ===================================================

var fs = require('fs');
var options = {};

// options.ip = '127.0.0.1';
// options.port = parseInt(process.argv[2]);
// options.config = { name: 'total.js' };
// options.https = { key: fs.readFileSync('keys/agent2-key.pem'), cert: fs.readFileSync('keys/agent2-cert.pem')};




/**
 * Release notes:
 */

var total = require('total.js');

total.http('release', options);
// require('total.js').https('release', options);


//var cluster = require('cluster');
//var os = require('os');
//
//if(cluster.isMaster){
//    require('nis-model'); // require cache sync message system
//    
//    var numCPUs = os.cpus().length;
//    for(var i=0;i<numCPUs;i++) {
//        // Run framework
//        var fork = cluster.fork();
//        //fork.on('message', onMessage);
//        // Send ID
//        //fork.send({ type: 'id', id: i });
//    }
//}
//else {
//    // This code will be executed according the number of CPU
//    // This code will be using: single process RAM * numCPUs
//    var framework = require('total.js');
//    // Set framework ID
//    //framework.on('message', function(message) {
//    //    if(message.type === 'id') framework.id = message.id;
//    //});
//    framework.http('release');
//}
//
//console.warn('fork');
//
////function onMessage(message) {
////    console.log('Message ->', message);
////}
