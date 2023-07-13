const Service = require('node-windows').Service;

const svc = new Service({
    name:'socket-client',
    description: 'socket-client.',
    script: 'C:/socket-client/app.js'
});

svc.on('install',function(){
    svc.start();
});

svc.install();