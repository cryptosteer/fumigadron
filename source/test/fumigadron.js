const FumigaDron = artifacts.require("FumigaDron");
const Propietarios = artifacts.require("Propietarios");
const FumiCoin = artifacts.require("FumiCoin");

contract("FumigaDron", accounts => {

    let opEmpresa;
    let opPropietario_1;
    let opPropietario_2;
    let opPropietario_3;
    let insFumigadron;
    let insPropietarios;
    let insFumiCoin;
    var comp;


    // const accounts = await web3.eth.getAccounts()

    it("crear empresa", async () => {
        opEmpresa = {from: accounts[0], gas: 500000};
        opPropietario_1 = {from: accounts[1], gas: 500000};
        opPropietario_2 = {from: accounts[2], gas: 500000};
        opPropietario_3 = {from: accounts[3], gas: 500000};
        insFumigadron = await FumigaDron.deployed();
        insPropietarios = await Propietarios.deployed();
        insFumiCoin = await FumiCoin.deployed();

        let nombre = await insFumigadron.getNombreEmpresa(opEmpresa);
        assert.equal(nombre, comp, "Nombre inicial es correcto",);
        // SEND let result = await instance.sendCoin(accounts[1], 10, {from: accounts[0]})
        // cambiar nombre
        // crea un dron
    });

    it("crear propietario 1", async () => {
        // crea un propietario
        // cambiar nombre
        // valores iniciales
        // crea una parcela
    });

    it("crear propietario 2", async () => {
    });

    it("crear propietario 3", async () => {
    });

    it("realizar trabajo", async () => {
        // solicita trabajo
        // realiza trabajo
        // se queda sin saldo
        // obtiene saldo
        // solicita trabajo
    });

    it("eventos", async () => {
    });

    it("parametros enteros", async () => {
    });

    it("1", async () => {
    });

    it("1", async () => {
    });

    it("1", async () => {
    });

    it("1", async () => {
    });

    it("1", async () => {
    });

    it("1", async () => {
    });

    it("1", async () => {
    });

    it("1", async () => {
    });

    it("1", async () => {
    });

});


