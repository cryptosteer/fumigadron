
module.exports = {

  networks: {
    develop: {
      port: 8545
    },
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    },
    alastria_testnet: {
      host: "127.0.0.1",
      port: 22001,
      network_id: "*",
      gas: 0x6cff0e28,
      gasPrice: 0x0,
      from: "0x74d4c56d8dcbc10a567341bfac6da0a8f04dc41d"
    },
    alastria: {
      host: "10.141.8.11",
      port: 8545,
      network_id: "*",
      gas: 0x29b68b6f,
      gasPrice: 0x0,
      from: "0xbc869c21d631e122d35789942a573241ec04d2e4"
     },
  },

  plugins: ["solidity-coverage"],

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.4.24",
    }
  }
}
