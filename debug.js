var packages = [
   'nodee-total',
   'nodee-admin',
   'nodee-cms'
];

/*
 * Debug configs
 */

var childProcessDebuggerPort = 5859,
    watchDirectories = [ '/controllers', '/definitions', '/modules', '/resources', '/components', '/models', '/source' ],
    watchExtensions = ['.js', '.resource', '.html'],
    watchFiles = ['config', 'config-debug', 'config-release', 'versions'];

/*
 * DEBUG setup:
 */
var isDebugging = process.argv[process.argv.length - 1] === 'debugging';
var directory = process.cwd();
var path = require('path');
var fs = require('fs');

// download all packages and start app
if(!isDebugging) require('./packages.js').downloadPackages(packages, function(){
    require('total.js'); // init total.js
    run(); // run app in debug mode with file watchers
    console.warn('DOWNLOADING');
});
else {
    require('total.js'); // init total.js
    run(); // run app in debug mode with file watchers
}

function debug() {
    var options = {};
    var framework = require('total.js');
    var port = parseInt(process.argv[2]);
    if (options.https) return framework.https('debug', options);
    framework.http('debug', options);
}

function app() {
    var fork = require('child_process').fork;
    var directories = [];
    var files = {};
    var force = false;
    var changes = [];
    var app = null;
    var status = 0;
    var async = new utils.Async;
    var pid = '';
    var pidInterval = null;
    var prefix = '------------> ';
    var isLoaded = false;

    for(var i=0;i<watchDirectories.length;i++){
        directories.push( directory + watchDirectories[i] );
    }

    function onFilter(path, isDirectory) {
        return isDirectory || isWatchedFile(path);
    }

    function isWatchedFile(path){
        for(var i=0;i<watchExtensions.length;i++){
            if(path.indexOf(watchExtensions[i]) !== -1) return true;
        }
        return false;
    }

    function onComplete() {
        var self = this;
        fs.readdir(directory, function(err, arr) {
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                var name = arr[i];
                if (watchFiles.indexOf(name) !== -1 || isWatchedFile(name)) self.file.push(name)
            }
            length = self.file.length;
            for (var i = 0; i < length; i++) {
                var name = self.file[i];
                if (!files[name]) files[name] = isLoaded ? 0 : null
            }
            refresh()
        })
    }

    function refresh() {
        var filenames = Object.keys(files);
        var length = filenames.length;
        for (var i = 0; i < length; i++) {
            var filename = filenames[i];
            (function(filename) {
                async.await(function(next) {
                    fs.stat(filename, function(err, stat) {
                        if (!err) {
                            var ticks = stat.mtime.getTime();
                            if (files[filename] !== null && files[filename] !== ticks) {
                                changes.push(prefix + filename.replace(directory, "") + (files[filename] === 0 ? " (added)" : " (modified)"));
                                force = true
                            }
                            files[filename] = ticks
                        } else {
                            delete files[filename];
                            changes.push(prefix + filename.replace(directory, "") + " (removed)");
                            force = true
                        }
                        next()
                    })
                })
            })(filename)
        }
        async.complete(function() {
            isLoaded = true;
            setTimeout(refresh_directory, 2e3);
            if (status !== 1) return;
            if (!force) return;
            restart();
            var length = changes.length;
            for (var i = 0; i < length; i++) console.log(changes[i]);
            changes = [];
            force = false
        })
    }

    function refresh_directory() {
        utils.ls(directories, onComplete, onFilter)
    }

    function restart() {
        if(!app) return start();

        try {
            app.on('exit', start);
            process.kill(app.pid);
        }
        catch(err){}
    }
    function start(){
        var arr = process.argv;
        arr.pop();
        arr.push('debugging');
        if(childProcessDebuggerPort) app = fork(path.join(directory, 'debug.js'), arr, {execArgv: ['--debug='+childProcessDebuggerPort]});
        else app = fork(path.join(directory, 'debug.js'), arr);

        app.on('message', function(msg) {
            if (msg.substring(0, 5) === 'name:') {
                process.title = 'debug: ' + msg.substring(6);
                return;
            }
            if (msg === 'eaddrinuse') process.exit(1);
        });
        app.on('exit', function(){
            if (status !== 255) return;
            app = null;
        });
        if (status === 0) app.send('debugging');
        status = 1;
    }

    process.on('SIGTERM', end);
    process.on('SIGINT', end);
    process.on('exit', end);

    function end() {
        if (arguments.callee.isEnd) return;
        arguments.callee.isEnd = true;
        fs.unlink(pid, noop);
        if (app === null) {
            process.exit(0);
            return
        }
        process.kill(app.pid);
        app = null;
        process.exit(0)
    }

    function noop() {}
    if (process.pid > 0) {
        console.log(prefix + 'PID: ' + process.pid);
        pid = path.join(directory, 'debug.pid');
        fs.writeFileSync(pid, process.pid);
        pidInterval = setInterval(function() {
            fs.exists(pid, function(exist) {
                if (exist) return;
                fs.unlink(pid, noop);
                if (app !== null) process.kill(app.pid);
                process.exit(0);
            })
        }, 2e3);
    }
    restart();
    refresh_directory();
}

function run(){
    if(isDebugging) return debug();
    var filename = path.join(directory, 'debug.pid');
    if(!fs.existsSync(filename)) return app();
    fs.unlinkSync(filename);
    setTimeout(app, 3e3);
}