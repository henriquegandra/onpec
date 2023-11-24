# onPEC

### Hybrid Online/Offline App | Henrique Gandra
- https://github.com/henriquegandra/onpec


### Descrição

O software trabalha com banco de dados local, e faz comunicação com API de sua preferência.
A cada 5 segundos é verificado o status da conexão com a API.
O envio e recebimento de informações em relação as APIs é realizada 100% no formato JSON.
Consulte a pasta 'backend/model' para identificar os tipos de dados.
Consutle a pasta 'backend/controller' e 'backend/service' para identificar quais regras de negócio e quais objetos são enviados para as APIs.
A cada sincronização, é realizado automaticamente um backup da base de dados local.
A cada operação que altera o banco de dados, é realizado um backup linha a linha em CSV para consulta em softwares de uso de escritório (Excel, Notepad, etc.).


## Tecnologias

- ElectronJS
- SQLite
- Sequelize
- Axios
- dotENV
- OS
- Electron Forge
- Squirrel


## Desenvolvimento

Esta é uma versão prévia, com apenas o módulo de pesagem e ainda passará por revisões.


## Comandos

- Produção
```node
yarn start
```

- Teste
```node
yarn dev
```

- Compilar pacote para gerar pasta de instalação (Windows)
```node
yarn package
```

- Compilar pacote para gerar .exe (Windows)
```node
yarn make
```

* Para compilar, pode ser necessário executar o "Rebuild"
```node
yarn rebuild
```
