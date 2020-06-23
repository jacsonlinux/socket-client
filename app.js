const net = require('net');
const si = require('systeminformation');
const client = new net.Socket();
async function getDataSystem() {
    console.log('Getting static system data...');
    try {
        let data = await si.getStaticData();
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
        data.type = 'dynamic';
        return data;
    } catch (error) {
        return console.error(error);
    }
}
client.connect(1983, '192.168.1.217', () => {
    console.log('TCP connection established with the server.');
    getDataSystem().then(res => {
        console.log('OK');
        client.write(JSON.stringify(res));
    }).catch(error => console.error(error));
});
