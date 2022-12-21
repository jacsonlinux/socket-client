const Service = require('node-windows').Service;

const svc = new Service({
    name:'socketclient',
    description: 'socketclient.',
    script: 'C:\\socketclient\\app.js'
});

svc.on('install',function(){
    svc.start();
});

svc.install();
