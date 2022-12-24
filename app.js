const si = require('systeminformation');
const net = require('node:net');
const dgram = require('node:dgram');

const clientTCP = new net.Socket();
const clientUDP = new dgram.createSocket('udp4');

let refreshInterval = null;

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
    if (reject === null) {
        clientTCP.removeAllListeners();
        refreshInterval = setInterval(() => {
            clientUDP.send(``, 0, 0, 22222, '255.255.255.255');
            console.log('.')
        }, 5000);
    }
};

const connectUDP = () => {
    clientUDP.on('listening', () => {
        console.log('listening UDP...');
        clientUDP.setBroadcast(true);
        refreshInterval = setInterval(() => {
            clientUDP.send(``, 0, 0, 22222, '255.255.255.255');
            console.log('.')
        }, 5000);
    });
    clientUDP.on('message', (msg, server) => {
        console.log(server);
        clearInterval(refreshInterval);
        setTimeout(() => {
            connectTCP(server);
        }, 5000)
    });
    clientUDP.bind(33333);
}

const connectTCP = (server) => {
    console.log('Connecting TCP...');
    let reject = null;
    clientTCP.connect(11111, `${server.address}`, () => {
        clientTCP.setKeepAlive(true, 5000);
        console.log('TCP connection established with the server.');
        getDataSystem().then(res => {
            console.log('OK');
            clientTCP.write(JSON.stringify(res));
        }).catch(error => console.error(error));
    });
    clientTCP.on('data', chunk => {
        reject = JSON.parse(`${chunk}`);
        console.log('Rejected');
    });
    clientTCP.on("close", () => {
        console.log("Connection closed");
        reconnect(reject);
    });
    clientTCP.on("error", (err) => {
        console.log(err);
    });
};

connectUDP();