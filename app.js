const net = require('net');
const si = require('systeminformation');
const client = new net.Socket();

const dgram = require('dgram');
const message = new Buffer.alloc(1,'Server?', 'utf8');
const socketUDP = dgram.createSocket('udp4');

let server = null;

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

const reconnect = (reject) => {
    console.log('Reconnecting...');
    if (reject !== 'true') {
        setTimeout(() => {
            console.log('.')
            client.removeAllListeners();
            connect(server);
        }, 1000);
    }
};

socketUDP.on('listening', () => {
    console.log('listening');
    socketUDP.setBroadcast(true);
    socketUDP.send(message, 0, message.length, 22222, '255.255.255.255');
});

socketUDP.on('message', (message, remote) => {
    console.log(remote, `${message}`);
    server = remote;
    connect(server);
});

const connect = (server) => {
    console.log('Connecting...');
    let reject;
    client.connect(11111, `${server.address}`, () => {
        client.setKeepAlive(true, 5000);
        console.log('TCP connection established with the server.');
        getDataSystem().then(res => {
            console.log('OK');
            client.write(JSON.stringify(res));
        }).catch(error => console.error(error));
    });
    client.on('data', chunk => {
        reject = JSON.parse(`${chunk}`);
        console.log('Rejected');
    });
    client.on("close", () => {
        console.log("Connection closed");
        reconnect(reject);
    });
    client.on("error", (err) => {
        console.log(err);
    });
};

socketUDP.bind(33333);

/*socketUDP.on('listening', () => {
    console.log('listening');
    socketUDP.setBroadcast(true);
    socketUDP.send(message, 0, message.length, 22222, '255.255.255.255');
    setInterval(() => {
        console.log('.')
    }, 5000);
});

socketUDP.on('message', (message, remote) => {
    console.log(remote, `${message}`);
    server = remote;
    connect(server);
});

socketUDP.bind(33333);*/
