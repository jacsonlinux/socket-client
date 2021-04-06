# SOCKET-CLIENT

**IFBA - Campus Porto Seguro**

###### Configuração para Windows
#

Faça login no Windows como administrador

Faça download do repositorio https://github.com/jacsonlinux/socket-client

Descompacte o arquivo socketclient.zip

Dentro da pasta descompactada, abra o arquivo app.js, localize “IP_SERVER” e “PORT” e substitua pelo pelo endereço e porta do servidor

Abra o CMD na pasta descompactada(socketclient-master)

Execute o comando abaixo:

node script.js

Ainda no CMD vá para o diretório C:/socketclient

Execute os comandos abaixo:

npm i -g
npm link node-windows
node service.js

No menu Iniciar do Windows digite:

services

Localize o serviço chamado socketclient, clique com botão direito e selecione propriedades.

Na janela que se abre localize a aba recuperação e selecione "reiniciar o serviço” para as opções:

Primeira falha, Segunda falhar e Falhas posteriores.