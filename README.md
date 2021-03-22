# FumigaDron 

Trabajo final para optar por el titulo [Experto Universitario en Desarrollo de Aplicaciones Blockchain](https://www.unir.net/ingenieria/curso-blockchain-technology/) realizado por la Universidad internacional de la Rioja en colaboración con el consorcio Alastria.

Para un mejor entendimiento del proyecto se sugiere leer el documento [Memoria.pdf](https://github.com/jsteerv/fumigadron/blob/master/Memoria.pdf) 

## Pre-requisitos

Este proyecto utiliza Node para su ejecución. 

Adicionalmente se emplea [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation).

## Instalación y ejecución

Para ejecutar este proyecto se debe abrir una consola de comandos y moverse a la carpeta source en la raíz del proyecto, allí se debe ejecutar los siguientes comandos:

```bash
npm install
truffle develop
migrate --reset
```
Luego abrir una nueva consola de comandos y moverse a la carpeta source/app en la raíz del proyecto, allí se debe ejecutar:

```bash
npm install
npm run dev
```
