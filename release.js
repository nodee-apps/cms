'use strict';

var packages = [
   'nodee-total',
   'nodee-admin',
   'nodee-cms'
];

// download all packages and start app
require('./packages.js').downloadPackages(packages, function(){
    require('total.js').http('release'); // start app
});