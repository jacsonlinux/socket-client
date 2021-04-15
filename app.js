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

    client.connect(1953, '192.168.1.217', () => {
        console.log('TCP connection established with the server.');
        getDataSystem().then(res => {
            console.log('OK');
            client.write(JSON.stringify(res)+'-J4C50N-');
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

    client.on("error", console.error);

};

connect().then(() => {console.log('Connecting...')});
