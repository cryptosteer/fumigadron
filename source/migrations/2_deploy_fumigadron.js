const FumiCoin = artifacts.require("FumiCoin");
const Propietarios = artifacts.require("Propietarios");
const FumigaDron = artifacts.require("FumigaDron");

module.exports = function(deployer) {
  deployer.deploy(FumiCoin).then(() => 
      deployer.deploy(Propietarios, FumiCoin.address).then(() => 
          deployer.deploy(FumigaDron, Propietarios.address, FumiCoin.address)
      )
  );
};
