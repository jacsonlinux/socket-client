const si= require('systeminformation');
const net= require('node:net');
const os= require('node:os');
const dgram= require('node:dgram');

// Criar instâncias dos clientes TCP e UDP
const clientTCP = new net.Socket();
const clientUDP = dgram.createSocket('udp4');

let refreshInterval = null;

// Função para calcular o endereço de broadcast
const calculateBroadcastAddress = (ipAddress, subnetMask) => {
    const ipParts = ipAddress.split('.');
    const maskParts = subnetMask.split('.');

    const broadcastAddressParts = ipParts.map((part, index) => {
        return (parseInt(part) & parseInt(maskParts[index])) + (~parseInt(maskParts[index]) & 255);
    });

    return broadcastAddressParts.join('.');
};

// Função para obter os endereços de broadcast disponíveis nas interfaces de rede
const getBroadcastAddresses = ()=> {
    const interfaces = os.networkInterfaces();
    const broadcastAddresses = [];

    for (const [, iface] of Object.entries(interfaces)) {
        for (const address of iface) {
            if (address.family === 'IPv4' && !address.internal) {
                const broadcast = calculateBroadcastAddress(address.address, address.netmask);
                broadcastAddresses.push(broadcast);
            }
        }
    }

    return broadcastAddresses;
};

// Função assíncrona para obter os dados estáticos do sistema
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

// Função assíncrona para obter os dados dinâmicos do sistema
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

// Função para reconectar
const reconnect = (reject) => {
    console.log('Reconnecting...');
    if (reject === null) {
        // Remover todos os ouvintes do cliente TCP
        clientTCP.removeAllListeners();
        // Configurar intervalo de atualização
        refreshInterval = setInterval(() => {
            // Enviar pacote de broadcast para cada endereço de broadcast disponível
            getBroadcastAddresses().forEach(res => {
                clientUDP.send(``, 0, 0, 22222, `${res}`);
            });
            console.log('.');
        }, 5000);
    }
};

// Função para estabelecer a conexão UDP
const connectUDP = () => {
    // Ouvinte para evento "listening"
    clientUDP.on('listening', () => {
        console.log('listening UDP...');
        // Habilitar o envio de pacotes de broadcast
        clientUDP.setBroadcast(true);
        // Configurar intervalo de atualização
        refreshInterval = setInterval(() => {
            // Enviar pacote de broadcast para cada endereço de broadcast disponível
            getBroadcastAddresses().forEach(res => {
                clientUDP.send(``, 0, 0, 22222, `${res}`, (err) => {
                    if (err) {
                        console.error('Error sending broadcast packet:', err);
                    }
                });
            });
            console.log('.');
        }, 5000);
    });

    // Ouvinte para evento "message"
    clientUDP.on('message', (msg, server) => {
        console.log(server);
        clearInterval(refreshInterval);
        setTimeout(() => {
            connectTCP(server);
        }, 5000);
    });

    // Associar o cliente UDP à porta 33333
    clientUDP.bind(33333);
};

// Função para estabelecer a conexão TCP
const connectTCP = (server) => {
    console.log('Connecting TCP...');
    let reject = null;

    // Conectar ao servidor TCP
    clientTCP.connect(11111, `${server.address}`, () => {
        // Habilitar o envio de pacotes keep-alive
        clientTCP.setKeepAlive(true, 5000);
        console.log('TCP connection established with the server.');

        // Obter dados estáticos do sistema e enviar ao servidor
        getDataSystem().then(res => {
            console.log('OK');
            clientTCP.write(JSON.stringify(res));
        }).catch(error => console.error(error));
    });

    // Ouvinte para evento "data"
    clientTCP.on('data', chunk => {
        reject = JSON.parse(`${chunk}`);
        console.log('Rejected');
    });

    // Ouvinte para evento "close"
    clientTCP.on("close", () => {
        console.log("Connection closed");
        reconnect(reject);
    });

    // Ouvinte para evento "error"
    clientTCP.on("error", (err) => {
        console.log(err);
    });
};

// Iniciar a conexão UDP
connectUDP();
