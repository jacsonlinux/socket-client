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

const connect = () => {

    client.connect(1983, 'localhost', () => {
        console.log('TCP connection established with the server.');
        getDataSystem().then(res => {
            console.log('OK');
            client.write(JSON.stringify(res));
        }).catch(error => console.error(error));
    });

    client.on("close", () => {
        console.log("Connection closed");
        reconnect();
    });

    client.on("end", () => {
        console.log("Connection ended");
        reconnect();
    });

    client.on("error", console.error);

};

const reconnect = () => {
    setTimeout(() => {
        client.removeAllListeners();
        connect();
    }, 1000);
};

connect()