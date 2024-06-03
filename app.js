const si= require('systeminformation');

const net= require('net');

const client = new net.Socket();

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

const reconnect = (msg) => {
    if (msg === 'REJECTED') {
        console.log('Connection rejected by the server.');
    } else {
        setTimeout(() => {
            console.log('Reconnecting...');
            console.log('.')
            client.removeAllListeners();
            connect();
        }, 5000);
    }
};

const connect = () => {

    console.log('Connecting...');

    let msg = null;

    client.connect(11111, '10.14.0.24', () => {

        //client.setKeepAlive(true, 10000);

        console.log('Connection established with the server.');

        getDataSystem()
            .then(res => {
                client.write(JSON.stringify(res), 'utf8', () => {
                    console.log('System static data sent.');
                });
            })
            .catch(error => console.error(error));
    });

    client.on('data', chunk => {
        msg = chunk.toString();
        console.log(chunk.toString());
    });

    client.on("close", () => {
        console.log("Connection closed");
        reconnect(msg);
    });

    client.on("error", (err) => {
        console.log(err);
    });
};

connect();
