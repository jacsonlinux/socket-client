# SOCKET-CLIENT

**IFBA - Campus Porto Seguro**

# Configuração para Windows #

Obs:  lib systeminformation - última versão compatível com win7 é 5.12.13 

Faça login no Windows como administrador.

Faça download do repositorio https://github.com/jacsonlinux/socket-client.

Descompacte o arquivo socketclient.zip.

~~Dentro da pasta descompactada, abra o arquivo app.js, localize as constantes **IP_SERVER** e **PORT** substituindo-as pelo endereço e porta do servidor de distino.~~

Abra o **CMD** na pasta descompactada(socket-client-master).

Execute o comando abaixo:

<ul>
<li>node script.js</li>
</ul>

Ainda no CMD vá para o diretório **C:/socket-client**

Execute os comandos abaixo:

<ul>
<li>npm i -g</li>
<li>npm link node-windows</li>
<li>node service.js</li>
</ul>

No menu **INICIAR** do Windows digite:

**services**

Localize o serviço chamado socket-client, clique com botão direito e selecione propriedades.

Na janela que se abre localize a aba recuperação e selecione "reiniciar o serviço” para as opções:

**Primeira falha, Segunda falhar e Falhas posteriores.**

#
###### **By J4c50nL1NUX**
