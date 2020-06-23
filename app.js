const net = require('net');
const si = require('systeminformation');
const client = new net.Socket();
async function getDataSystem() {
    console.log('Getting static system data...');
    try {
        let data = await si.getStaticData();
        // UUID = data.system.uuid;
        data.type = 'static';
        return data;
    } catch (error) {
        return console.error(error);
    }
}
async function getDataSystemDynamic() {
    console.log('Getting dynamic system data...');
    try {
        let data = await si.getDynamicData();
        // UUID = data.system.uuid;
        data.type = 'dynamic';
        return data;
    } catch (error) {
        return console.error(error);
    }
}
client.connect(1983, 'localhost', () => {
    console.log('TCP connection established with the server.');
    getDataSystem().then(res => {
        console.log('OK');
        client.write(JSON.stringify(res));
    }).catch(error => console.error(error));
});

/*// Include Nodejs' net module.
const net = require('net');

const si = require('systeminformation');

let UUID;

// Create a new TCP client.
const client = new net.Socket();

function getDataSystem() {
    console.log('Getting static system data...\u2592');
    return si.getStaticData()
        .then(data => {
            UUID = data.system.uuid;
            data.type = 'static';
            return data;
        } )
        .catch(error => console.error(error));
}
function getDataSystemDynamic() {
    console.log('Getting dynamic system data...');
    return si.getDynamicData()
        .then(data => {
            UUID = data.system.uuid;
            data.type = 'dynamic';
            return data;
        } )
        .catch(error => console.error(error));
}

// Send a connection request to the server.
client.connect(1983, 'localhost', () => {
    // If there is no error, the server has accepted the request and created a new socket dedicated to us.
    console.log('TCP connection established with the server.');
    // The client can now send data to the server by writing to its socket.
    getDataSystem().then(res => {
        console.log('OK');
        client.write(JSON.stringify(res));
        // client.end();
    }).catch(error => console.error(error));
});

// The client can also receive data from the server by reading from its socket.
/!*client.on('data', chunk => {
    console.log(`Data received from the server: ${chunk.toString()}.`);

    // Request an end to the connection after the data has been received.
    // client.end();
});*!/

//used when the server closed the connection
/!*client.on('end', () => {
    console.log('Requested an end to the TCP connection');
});*!/*/
