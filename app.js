const net = require('net');
const si = require('systeminformation');
const client = new net.Socket();

const getDataSystem = async () => {
    console.log('Getting static system data...');
    try {
        let data = await si.getStaticData();
        data.type = 'static';
        return data;
    } catch (error) {
        return console.error(error);
    }
};

const getDataSystemDynamic = async () => {
    console.log('Getting dynamic system data...');
    try {
        let data = await si.getDynamicData();
        data.type = 'dynamic';
        return data;
    } catch (error) {
        return console.error(error);
    }
};

const reconnect = async reject => {
    if (reject !== 'true') {
        setTimeout(() => {
            client.removeAllListeners();
            connect();
        }, 1000);
    }
};

const connect = async () => {

    let reject;

    client.connect(2222, '192.168.1.102', () => {
        console.log('TCP connection established with the server.');
        /*getDataSystem().then(res => {
            console.log('OK');
            client.write(JSON.stringify(res));
        }).catch(error => console.error(error));*/
    });

    client.on('data', chunk => {
        reject = JSON.parse(`${chunk}`);
        console.log('Rejected');
    });

    client.on("close", () => {
        console.log("Connection closed");
        reconnect(reject);
    });

    client.on("error", console.error);

};

connect().then(() => {console.log('Connecting...')});



/*// creating a custom socket client and connecting it....
const net = require('net');
var client  = new net.Socket();
client.connect({
    port:2222
});

client.on('connect',function(){
    console.log('Client: connection established with server');

    console.log('---------client details -----------------');
    var address = client.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Client is listening at port' + port);
    console.log('Client ip :' + ipaddr);
    console.log('Client is IP4/IP6 : ' + family);


    // writing data to server
    client.write('hello from client');

});

client.setEncoding('utf8');

client.on('data',function(data){
    console.log('Data from server:' + data);
});

setTimeout(function(){
    client.end('Bye bye server');
},5000);

//NOTE:--> all the events of the socket are applicable here..in client...


// -----------------creating client using net.connect instead of custom socket-------

// server creation using net.connect --->
// u can also => write the below code in seperate js file
// open new node instance => and run it...


const clients = net.connect({port: 2222}, () => {
    // 'connect' listener
    console.log('connected to server!');
    clients.write('world!\r\n');
});
clients.on('data', (data) => {
    console.log(data.toString());
    clients.end();
});
clients.on('end', () => {
    console.log('disconnected from server');
});*/
