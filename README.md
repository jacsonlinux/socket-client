# SOCKET-CLIENT

## IFBA - Campus Porto Seguro

### Configuração para Windows

Observações para compatibilidade com o Windows 7:
- Node.js: 13.14.0
- Systeminformation: 5.12.13
- Node-windows: 1.0.0-beta.5

Para prosseguir, siga as instruções abaixo:

1. Faça login no Windows como administrador.
2. Faça o download do repositório [https://github.com/jacsonlinux/socket-client](https://github.com/jacsonlinux/socket-client).
3. Descompacte o arquivo `socket-client-master.zip`.
4. Abra o CMD na pasta descompactada (`socket-client-master`).
5. Execute o seguinte comando:
   ```
   node script.js
   ```

Em seguida, execute os comandos abaixo no CMD, navegando até o diretório `C:/socket-client`:

```
npm i -g
npm link node-windows
node service.js
```

No menu "INICIAR" do Windows, digite "services" e localize o serviço chamado "socket-client". Clique com o botão direito sobre ele e selecione "Propriedades".

Na janela que se abre, vá para a aba "Recuperação" e selecione a opção "Reiniciar o serviço" para as seguintes opções: "Primeira falha", "Segunda falha" e "Falhas posteriores".

###### Por J4c50nL1NUX