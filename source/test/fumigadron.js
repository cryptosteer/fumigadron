const FumigaDron = artifacts.require("FumigaDron");
const Propietarios = artifacts.require("Propietarios");
const FumiCoin = artifacts.require("FumiCoin");
const truffleAssert = require("truffle-assertions");

contract("FumigaDron", accounts => {

    it("Test 01: Debería asignar las variables y desplegar los contratos correctamente ", async () => {
        // JSON con las opciones de transaccion para cada usuario
        opEmpresa = {from: accounts[0], gas: 500000};
        opPropietario_1 = {from: accounts[1], gas: 500000};
        opPropietario_2 = {from: accounts[2], gas: 500000};
        opPropietario_3 = {from: accounts[3], gas: 500000};
        // Instancias de los contratos
        insFumigadron = await FumigaDron.deployed();
        insPropietarios = await Propietarios.deployed();
        insFumiCoin = await FumiCoin.deployed();

        // Comprueba nombre inicial de la empresa
        nombre = await insFumigadron.getNombreEmpresa(opEmpresa);
        assert.equal(nombre, "DronTech Corp");

        // Comprueba numero de Drones de la empresa
        numeroDrones = await insFumigadron.getNumeroTokens(opEmpresa);
        assert.equal(numeroDrones, 0);

        // Comprueba numero de parcelas para propietario 1
        numeroParcelas = await insFumigadron.getNumeroTokens(opPropietario_1);
        assert.equal(numeroParcelas, 0);

        // Comprueba balance inicial de FUMI para empresa
        balance = await insFumiCoin.getBalance(opEmpresa);
        assert.equal(balance, 0);
    });

    it("Test 02: Debería crear drones por empresa", async () => {
        await insFumigadron.crearDron("DRX-001", 80, 20, 10, "ABC", opEmpresa);
        // Comprueba codigo de dron 1
        dron1 = await insFumigadron.getDron(1, opEmpresa);
        assert.equal(dron1[0], "DRX-001");
        
        await insFumigadron.crearDron("DRX-002", 90, 10, 30, "CDE", opEmpresa);
        // Comprueba codigo de dron 2
        dron2 = await insFumigadron.getDron(2, opEmpresa);
        assert.equal(dron2[0], "DRX-002");
        
        await insFumigadron.crearDron("DRX-003", 100, 0, 50, "ACE", opEmpresa);
        // Comprueba codigo de dron 3
        dron3 = await insFumigadron.getDron(3, opEmpresa);
        assert.equal(dron3[0], "DRX-003");
        
        // Comprueba total de drones creados
        numeroTokens = await insFumigadron.getNumeroTokens(opEmpresa);
        assert.equal(numeroTokens.valueOf(), 3);
    });

    it("Test 03: Debería crear propietarios", async () => {
        // Comprueba que no existe propietario 1
        existePropietario = await insPropietarios.existePropietario(opPropietario_1);
        assert.equal(existePropietario, false);
        // Crea propietario 1
        propietario1 = await insPropietarios.crearPropietario(opPropietario_1);
        // Comprueba creacion de propietario 1
        nombrePropietario1 = await insPropietarios.getPropietarioNombre(opPropietario_1);
        assert.equal(nombrePropietario1, "[Actualice su nombre]");
        // Cambia nombre de propietario 1
        await insPropietarios.setPropietarioNombre("Sonia Payares", opPropietario_1);
        nombrePropietario1 = await insPropietarios.getPropietarioNombre(opPropietario_1);
        assert.equal(nombrePropietario1, "Sonia Payares");
        // Comprueba que existe propietario 1
        existePropietario = await insPropietarios.existePropietario(opPropietario_1);
        assert.equal(existePropietario, true);
        // Comprueba saldo inicial de FUMI
        saldo1 = await insFumiCoin.getBalance(opPropietario_1);
        assert.equal(saldo1.valueOf(), 100);

        // Comprueba que no existe propietario 2
        existePropietario = await insPropietarios.existePropietario(opPropietario_2);
        assert.equal(existePropietario, false);
        // Crea propietario 2
        propietario2 = await insPropietarios.crearPropietario(opPropietario_2);
        // Comprueba creacion de propietario 2
        nombrePropietario2 = await insPropietarios.getPropietarioNombre(opPropietario_2);
        assert.equal(nombrePropietario2, "[Actualice su nombre]");
        // Cambia nombre de propietario 2
        await insPropietarios.setPropietarioNombre("Luis Oviedo", opPropietario_2);
        nombrePropietario2 = await insPropietarios.getPropietarioNombre(opPropietario_2);
        assert.equal(nombrePropietario2, "Luis Oviedo");
        // Comprueba que existe propietario 2
        existePropietario = await insPropietarios.existePropietario(opPropietario_2);
        assert.equal(existePropietario, true);
        // Comprueba saldo inicial de FUMI
        saldo2 = await insFumiCoin.getBalance(opPropietario_2);
        assert.equal(saldo2.valueOf(), 100);

        // Comprueba que no existe propietario 3
        existePropietario = await insPropietarios.existePropietario(opPropietario_3);
        assert.equal(existePropietario, false);
        // Crea propietario 3
        propietario3 = await insPropietarios.crearPropietario(opPropietario_3);
        // Comprueba creacion de propietario 3
        nombrePropietario3 = await insPropietarios.getPropietarioNombre(opPropietario_3);
        assert.equal(nombrePropietario3, "[Actualice su nombre]");
        // Cambia nombre de propietario 3
        await insPropietarios.setPropietarioNombre("Stefany Vargas", opPropietario_3);
        nombrePropietario3 = await insPropietarios.getPropietarioNombre(opPropietario_3);
        assert.equal(nombrePropietario3, "Stefany Vargas");
        // Comprueba que existe propietario 3
        existePropietario = await insPropietarios.existePropietario(opPropietario_3);
        assert.equal(existePropietario, true);
       // Comprueba saldo inicial de FUMI
       saldo3 = await insFumiCoin.getBalance(opPropietario_3);
       assert.equal(saldo3.valueOf(), 100);
 
    });

    it("Test 04: Debería crear Parcelas", async () => {
        // Crear parcela 1 por propietario 1
        await insPropietarios.crearParcela("Finca las moras", 74, 25, "A", opPropietario_1);
        // Comprueba creacion de parcela 1
        parcela1 = await insPropietarios.getParcela(1, opPropietario_1);
        assert.equal(parcela1[0], "Finca las moras");
        // Crear parcela 2 por propietario 1
        await insPropietarios.crearParcela("Buenos aires", 68, 21, "B", opPropietario_1);
        // Comprueba creacion de parcela 2
        parcela2 = await insPropietarios.getParcela(2, opPropietario_1);
        assert.equal(parcela2[0], "Buenos aires");
        
        // Crear parcela 3 por propietario 2
        await insPropietarios.crearParcela("Jardines del edén", 84, 15, "C", opPropietario_2);
        // Comprueba creacion de parcela 3
        parcela3 = await insPropietarios.getParcela(3, opPropietario_2);
        assert.equal(parcela3[0], "Jardines del edén");
        // Crear parcela 4 por propietario 2
        await insPropietarios.crearParcela("Campos eliseos", 88, 11, "D", opPropietario_2);
        // Comprueba creacion de parcela 4
        parcela4 = await insPropietarios.getParcela(4, opPropietario_2);
        assert.equal(parcela4[0], "Campos eliseos");
        
        // Crear parcela 5 por propietario 3
        await insPropietarios.crearParcela("El nirvana", 93, 7, "E", opPropietario_3);
        // Comprueba creacion de parcela 5
        parcela5 = await insPropietarios.getParcela(5, opPropietario_3);
        assert.equal(parcela5[0], "El nirvana");
        // Crear parcela 6 por propietario 3
        await insPropietarios.crearParcela("Cartagena", 99, 5, "A", opPropietario_3);
        // Comprueba creacion de parcela 6
        parcela6 = await insPropietarios.getParcela(6, opPropietario_3);
        assert.equal(parcela6[0], "Cartagena");
    });

    it("Test 05: Debería solicitar trabajos", async () => {
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 0);
        
        // Solicitar trabajo dron 1 en parcela 1 por propietario 1
        respuesta = await insPropietarios.solicitarTrabajo(1, 1, opPropietario_1);
        // Confirmar evento TrabajoSolicitado
        truffleAssert.eventEmitted(respuesta, "TrabajoSolicitado", (evento) =>{
            return ((evento.idDron == 1)&&(evento.idParcela == 1));
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 1);
        
        // Solicitar trabajo dron 1 en parcela 2 por propietario 1
        respuesta = await insPropietarios.solicitarTrabajo(1, 2, opPropietario_1);
        // Confirmar evento TrabajoSolicitado
        truffleAssert.eventEmitted(respuesta, "TrabajoSolicitado", (evento) =>{
            return ((evento.idDron == 1)&&(evento.idParcela == 2));
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 2);
        
        // Solicitar trabajo dron 2 en parcela 3 por propietario 2
        respuesta = await insPropietarios.solicitarTrabajo(2, 3, opPropietario_2);
        // Confirmar evento TrabajoSolicitado
        truffleAssert.eventEmitted(respuesta, "TrabajoSolicitado", (evento) =>{
            return ((evento.idDron == 2)&&(evento.idParcela == 3));
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 3);
        
        // Solicitar trabajo dron 2 en parcela 4 por propietario 2
        respuesta = await insPropietarios.solicitarTrabajo(2, 4, opPropietario_2);
        // Confirmar evento TrabajoSolicitado
        truffleAssert.eventEmitted(respuesta, "TrabajoSolicitado", (evento) =>{
            return ((evento.idDron == 2)&&(evento.idParcela == 4));
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 4);
        
        // Solicitar trabajo dron 3 en parcela 5 por propietario 3
        respuesta = await insPropietarios.solicitarTrabajo(3, 5, opPropietario_3);
        // Confirmar evento TrabajoSolicitado
        truffleAssert.eventEmitted(respuesta, "TrabajoSolicitado", (evento) =>{
            return ((evento.idDron == 3)&&(evento.idParcela == 5));
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 5);
        
        // Solicitar trabajo dron 3 en parcela 6 por propietario 3
        respuesta = await insPropietarios.solicitarTrabajo(3, 6, opPropietario_3);
        // Confirmar evento TrabajoSolicitado
        truffleAssert.eventEmitted(respuesta, "TrabajoSolicitado", (evento) =>{
            return ((evento.idDron == 3)&&(evento.idParcela == 6));
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 6);

    });

    it("Test 06: Debería realizar trabajos", async () => {
        respuesta = await insFumigadron.realizarTrabajo(1, opEmpresa);
        // Confirmar evento TrabajoConfirmado
        truffleAssert.eventEmitted(respuesta, "TrabajoConfirmado", (evento) =>{
            return (evento.idParcela == 1);
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 5);

        respuesta = await insFumigadron.realizarTrabajo(2, opEmpresa);
        // Confirmar evento TrabajoConfirmado
        truffleAssert.eventEmitted(respuesta, "TrabajoConfirmado", (evento) =>{
            return (evento.idParcela == 2);
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 4);

        respuesta = await insFumigadron.realizarTrabajo(3, opEmpresa);
        // Confirmar evento TrabajoConfirmado
        truffleAssert.eventEmitted(respuesta, "TrabajoConfirmado", (evento) =>{
            return (evento.idParcela == 3);
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 3);

        respuesta = await insFumigadron.realizarTrabajo(4, opEmpresa);
        // Confirmar evento TrabajoConfirmado
        truffleAssert.eventEmitted(respuesta, "TrabajoConfirmado", (evento) =>{
            return (evento.idParcela == 4);
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 2);

        respuesta = await insFumigadron.realizarTrabajo(5, opEmpresa);
        // Confirmar evento TrabajoConfirmado
        truffleAssert.eventEmitted(respuesta, "TrabajoConfirmado", (evento) =>{
            return (evento.idParcela == 5);
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 1);

        respuesta = await insFumigadron.realizarTrabajo(6, opEmpresa);
        // Confirmar evento TrabajoConfirmado
        truffleAssert.eventEmitted(respuesta, "TrabajoConfirmado", (evento) =>{
            return (evento.idParcela == 6);
        });
        // Comprueba numero de solicitudes
        numeroSolicitudes = await insPropietarios.getNumeroSolicitudes();
        assert.equal(numeroSolicitudes.valueOf(), 0);
    });

});
