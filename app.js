const si= require('systeminformation');
const net= require('net');

const clientTCP = new net.Socket();

const getDataSystem = async ()=> {
    console.log('Getting static system data...');
    try {
        let data = await si.getStaticData();
        data.type = 'static';
        return data;
    } catch (error) {
        console.error(error);
    }
};

const getDataSystemDynamic = async () => {
    console.log('Getting dynamic system data...');
    try {
        let data = await si.getDynamicData();
        data.type = 'dynamic';
        return data;
    } catch (error) {
        console.error(error);
    }
};

const reconnect = (reject) => {
    console.log('Reconnecting...');
    if (reject !== 'true') {
        setTimeout(() => {
            console.log('.')
            clientTCP.removeAllListeners();
            connectTCP();
        }, 5000);
    }
};

const connectTCP = () => {

    console.log('Connecting TCP...');

    let reject = null;

    clientTCP.connect(11111, '10.14.0.24', () => {

        //clientTCP.setKeepAlive(true, 5000);

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

connectTCP();
