import Web3 from "web3";
import fumigaDronArtifact from "../../build/contracts/FumigaDron.json";
import propietariosArtifact from "../../build/contracts/Propietarios.json";
import fumiCoinArtifact from "../../build/contracts/FumiCoin.json";

const App = {
    web3: null,
    networkId: null,
    cuentaEmpresa: null,
    cuentaPropietario: {
        1: null,
        2: null,
        3: null,
    },
    propietarioActivo: null,
    contratoFumigaDron: null,
    contratoPropietarios: null,
    contratoFumiCoin: null,
    tblDrones:null,
    tblParcelas:null,

    initialize: function() {
        var radiosRed = document.getElementsByName('redConfig');
        var proveedor;
        for (var i = 0; i < radiosRed.length; i++) {
            radiosRed[i].addEventListener('change', function() {
                if (this.id == 'redConfig1') {
                    proveedor = 'HTTP://127.0.0.1:8545';
                } else if (this.id == 'redConfig2') {
                    proveedor = 'HTTP://127.0.0.1:7545';
                } else if (this.id == 'redConfig3') {
                    proveedor = 'HTTP://127.0.0.1:22001';
                } else if (this.id == 'redConfig4') {
                    proveedor = 'HTTP://10.141.8.11:8545';
                }
                $("#proveedorWeb3").val(proveedor);
            });
        }
        var internacionalizacion = {
            "info":           "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "paginate": {
                "first":      "Primero",
                "last":       "Ultimo",
                "next":       "Siguiente",
                "previous":   "Anterior"
            },
            "zeroRecords": "No hay registros en la tabla."
        };
        this.tblDrones = $('#tblDrones').DataTable({
            searching: false,
            lengthChange: false,
            pageLength: 5,
            columns: [
                { title: "Codigo" },
                { title: "Alt Max" },
                { title: "Alt Min" },
                { title: "Coste" },
                { title: "Pesticidas", orderable: false }],
            language: internacionalizacion,
        });
        this.tblParcelas = $('#tblParcelas').DataTable({
            searching: false,
            lengthChange: false,
            pageLength: 5,
            columns: [
                { title: "Nombre" },
                { title: "Alt Max" },
                { title: "Alt Min" },
                { title: "Pesticida", orderable: false },
                { orderable: false }],
            language: internacionalizacion,
        });
        this.tblTrabajos = $('#tblTrabajos').DataTable({
            searching: false,
            lengthChange: false,
            pageLength: 10,
            columns: [
                { title: "Propietario" },
                { title: "Parcela" },
                { title: "Dron" },
                { title: "Pesticida" },
                { title: "Coste" },
                { orderable: false }],
            language: internacionalizacion,
        });
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const red = urlParams.get('red');
        if (red){
            if(red=='ganache')
                $('#redConfig2').trigger('click');
            else if(red=='testnet')
                $('#redConfig3').trigger('click');
            else if(red=='alastria')
                $('#redConfig4').trigger('click');
            App.connect();
        }
    },

    connect: function() {
        let proveedorWeb3 = $("#proveedorWeb3").val();
        this.web3 = new Web3(new Web3.providers.HttpProvider(proveedorWeb3));
        this.start();
    },

    start: async function() {
        const { web3 } = this;
        try {
            this.spinnerShow();
            try {
                this.networkId = await web3.eth.net.getId();
            } catch(e) { throw "Error"; }
            const deployedNetwork = fumigaDronArtifact.networks[this.networkId];
            let cuentas;
            try {
                cuentas = await web3.eth.getAccounts();
            } catch(e) { throw "Error"; }
            if (cuentas.length > 0)
                this.cuentaEmpresa = cuentas[0];
            if (cuentas.length > 3) {
                this.cuentaPropietario[1] = cuentas[1];
                this.cuentaPropietario[2] = cuentas[2];
                this.cuentaPropietario[3] = cuentas[3];
            }
            this.contratoFumigaDron = new web3.eth.Contract(
                fumigaDronArtifact.abi,
                fumigaDronArtifact.networks[this.networkId].address,
                );
            this.contratoPropietarios = new web3.eth.Contract(
                propietariosArtifact.abi,
                propietariosArtifact.networks[this.networkId].address,
                );
            this.contratoFumiCoin = new web3.eth.Contract(
                fumiCoinArtifact.abi,
                fumiCoinArtifact.networks[this.networkId].address,
                );
            this.conectadoARed();
            this.cargarEmpresa();
        } catch (e) {
            this.addEventLog('No se pudo conectar a la red blockchain.', 'danger');
        }
        this.spinnerHide();
    },

    spinnerShow: function() {
      document.getElementById("spinner-back").classList.add("show");
      document.getElementById("spinner-front").classList.add("show");
    },

    spinnerHide: function() {
      document.getElementById("spinner-back").classList.remove("show");
      document.getElementById("spinner-front").classList.remove("show");
    },

    generarCodigo: async function() {
        const { getNumeroTokens } = this.contratoFumigaDron.methods;
        var options = {from: this.cuentaEmpresa, gas: 500000}
        var counter = parseInt(await getNumeroTokens().call()) + 1;
        var ceros = '';
        if (counter<10) ceros = '00';
        else if (counter<100) ceros = '0';
        return 'DRX-' + ceros + counter;
    },

    obtenerFumi: async function(cuenta) {
        const { obtenerFumi } = this.contratoPropietarios.methods;
        var options = {from: this.cuentaPropietario[this.propietarioActivo], gas: 500000}
        var txHash = await obtenerFumi().send(options);
        this.addEventLog('100 tokens FumiCoin han sido agregados a su cuenta.', 'success', txHash);
        this.cargarPropietario(this.propietarioActivo);
    },

    getEtherBalance: async function(cuenta) {
        let result = await this.web3.eth.getBalance(cuenta);
        result = parseFloat(this.web3.utils.fromWei(result, "ether"));
        result = (Math.round(result * 100) / 100).toFixed(2);
        return result;
    },

    conectadoARed: function() {
        var red;
        var redParam;
        var radiosRed = document.getElementsByName('redConfig');
        for (var i = 0, length = radiosRed.length; i < length; i++) {
            if (radiosRed[i].checked) {
                var idVal = radiosRed[i].id;
                red =  $("label[for='"+idVal+"']").text().trim();
                if (idVal=='redConfig1') redParam ='develop';
                else if (idVal=='redConfig2') redParam ='ganache';
                else if (idVal=='redConfig3') redParam ='testnet';
                else if (idVal=='redConfig4') redParam ='alastria';
                window.history.pushState("", "", '?red='+redParam);
                break;
            }
        }
        this.addEventLog('Conectado a la red blockchain: ' + red);
        $("#connect-interface").addClass('d-none');
        $("#main-interface").removeClass('d-none');
        $("#connect-interface").addClass('d-none');
        $("#main-interface").removeClass('d-none');
        $("#btnRedBlockchain").removeClass('btn-outline-danger');
        $("#btnRedBlockchain").addClass('btn-outline-success');
        $("#btnRedBlockchain span").text(red);
        $("#mdlRedConfig").modal('hide');
    },

    addEventLog: function(message, level = 'default', txHash = null) {
        if (txHash)
            message += '<br/> TX Hash: ' + txHash.transactionHash;
        var eventLog = $("#event-log");
        var logClass = 'list-group-item py-2'
        if (level == 'success') {
            logClass += ' list-group-item-success'
            toastr.success(message);
        } else if (level == 'danger') {
            logClass += ' list-group-item-danger'
            toastr.error(message);
        } else if (level == 'warning') {
            logClass += ' list-group-item-warning'
            toastr.warning(message);
        } else if (level == 'info') {
            logClass += ' list-group-item-info'
            toastr.info(message);
        }
        eventLog.append('<li class="' + logClass + '">' + message + '</li>');
        var objDiv = document.getElementById("card-event-log");
        objDiv.scrollTop = objDiv.scrollHeight;
    },

    setLoginUsuario: function(usuario) {
        $("#modalLoginTitulo span").text(usuario);
    },

    loginUsuario: function(usuario) {
        var cuentaUsuario = $("#inpCuenta").val();
        this.cuentaPropietario[this.propietarioActivo] = cuentaUsuario;
        var password = $("#inpPassword").val();
        if (password.trim() != "") {
            this.web3.eth.personal.unlockAccount(cuentaUsuario, password, 1800);
            this.addEventLog('Usuario desbloqueado por una hora.', 'success',);
        }
        this.cargarPropietario(this.propietarioActivo);
        $("#mdlLoginUsuario").modal('hide');
    },

    // Gestion de Empresa
    cargarEmpresa: async function() {
        if (this.cuentaEmpresa) {
            this.spinnerShow();
            const { getNombreEmpresa, getNumeroTokens, getTokenIdByIndex, getDron } = this.contratoFumigaDron.methods;
            const { getBalance } = this.contratoFumiCoin.methods;
            var options = {from: this.cuentaEmpresa, gas: 500000}
            const nombre = await getNombreEmpresa().call();
            $("#outEmpresaNombre").text(nombre);
            $("#inpEmpresaNombre").val(nombre);
            const balance = await getBalance().call(options);
            $("#outEmpresaFumiCoins").text(balance+ ' FUMI');
            // Llenar tabla de drones
            var numDrones = await getNumeroTokens().call();
            var dataSetDrones = [];
            for (var i=0; i<numDrones; i++) {
                var id = await getTokenIdByIndex(i).call(options);
                var dron = await getDron(id).call();
                var pesticidas = '';
                for (var j = 0; j < dron[4].length; j++) {
                    pesticidas += dron[4].charAt(i) + ' ';
                }

                dataSetDrones.push([dron[0], dron[1], dron[2], dron[3], pesticidas]);
            }
            this.tblDrones.clear();
            this.tblDrones.rows.add(dataSetDrones).draw();
            // Llenar tabla de Solicitudes de Trabajos
            const { getNumeroSolicitudes, getSolicitudTrabajo, getSolicitudTrabajoIdByIndex, log } = this.contratoPropietarios.methods;
            var numSolicitudes = await getNumeroSolicitudes().call();
            var dataSetSolicitudes = [];
            for(var i=0; i<numSolicitudes; i++) {
                var solicitudIds = await getSolicitudTrabajoIdByIndex(i).call(options);
                var idParcela = solicitudIds[0];
                var idDron = solicitudIds[1];
                var solicitud = await getSolicitudTrabajo(idParcela).call(options);
                var dron = await getDron(idDron).call(options);
                dataSetSolicitudes.push([solicitud[0], solicitud[1], dron[0], solicitud[2], dron[3], "<a class='float-right btn btn-sm btn-outline-primary' href='#' onclick='App.realizarTrabajo(" + idParcela + "," + idDron + ");'>Realizar</a>"]);
            }
            this.tblTrabajos.clear();
            this.tblTrabajos.rows.add(dataSetSolicitudes).draw();
            $("#seccionConectar").addClass('d-none');
            $("#seccionPrincipal").removeClass('d-none');
            this.spinnerHide();
        }
    },

    guardarInformacionEmpresa: async function() {
        this.spinnerShow();
        var nombre = $("#inpEmpresaNombre").val();
        const { setNombreEmpresa } = this.contratoFumigaDron.methods;
        var options = {from: this.cuentaEmpresa, gas: 500000}
        var txHash = await setNombreEmpresa(nombre).send(options);
        this.addEventLog('Información de empresa guardada.', 'success', txHash);
        this.cargarEmpresa();
        this.spinnerHide();
        $("#mdlInfoEmpresa").modal('hide');
    },

    nuevoDron: async function() {
        var codigo = await this.generarCodigo();
        $("#inpDronCodigo").val(codigo);
        $("#inpDronAltMax").val('');
        $("#inpDronAltMin").val('');
        $("#inpDronCoste").val('');
        $("[name='chkDronPesticidas']").prop('checked',false);
    },

    guardarInformacionDron: async function() {
        this.spinnerShow();
        const { crearDron } = this.contratoFumigaDron.methods;
        var options = {from: this.cuentaEmpresa, gas: 500000}
        var pesticidas='';
        $("[name='chkDronPesticidas']:checked" ).each((i, v) => {pesticidas += v.value;})
        var txHash = await crearDron(
            $("#inpDronCodigo").val(),
            $("#inpDronAltMax").val(),
            $("#inpDronAltMin").val(),
            $("#inpDronCoste").val(),
            pesticidas
        ).send(options);
        this.addEventLog('Información del dron guardada.', 'success', txHash);
        this.cargarEmpresa();
        this.spinnerHide();
        $("#mdlAgregarDron").modal('hide');
    },

    // Gestion de Propietarios
    loginPropietario: async function(propietarioNumero) {
        /*
        $('#inpCuenta').val('');
        if (this.cuentaPropietario[propietarioNumero]) {
            this.spinnerShow();
            const { existePropietario } = this.contratoFumigaDron.methods;
            var options = {from: this.cuentaPropietario[propietarioNumero]};
            const existe = await existePropietario().call(options);
            if (existe) {
                $("#seccionConectarPropietario").addClass('d-none');
                $("#seccionPrincipalPropietario").removeClass('d-none');
                this.cargarPropietario(propietarioNumero);
            } else {
                $('#inpCuenta').val(this.cuentaPropietario[propietarioNumero]);

            }
            this.spinnerHide();
        }
        */
    },

    cargarPropietario: async function(propietarioNumero) {
        this.propietarioActivo = propietarioNumero;
        if (this.cuentaPropietario[propietarioNumero]) {
            this.spinnerShow();
            try {
                var options = {from: this.cuentaPropietario[propietarioNumero], gas: 500000}
                const { existePropietario, crearPropietario, getPropietarioNombre, getNumeroTokens, getTokenIdByIndex, getParcela, getNumeroSolicitudes, log } = this.contratoPropietarios.methods;
                const { getBalance } = this.contratoFumiCoin.methods;
                const existe = await existePropietario().call({from: this.cuentaPropietario[propietarioNumero], gas: 500000});
                if (!existe) {
                    try {
                        var txHash = await crearPropietario().send(options);
                        this.addEventLog('Propietario ' + propietarioNumero + ' creado. <br/>Address: ' + this.cuentaPropietario[propietarioNumero], 'success', txHash);
                    } catch (e) {
                        throw "Error";
                    }
                }
                $("#seccionConectarPropietario").addClass('d-none');
                $("#seccionPrincipalPropietario").removeClass('d-none');
                const nombre = await getPropietarioNombre().call(options);
                $("#outPropietarioNombre").text(nombre);
                $("#inpPropietarioNombre").val(nombre);
                const balance = await getBalance().call(options);
                $("#outPropietarioFumiCoins").text(balance + ' FUMI');
                let balanceEther = await this.getEtherBalance(this.cuentaPropietario[propietarioNumero]);
                $("#outPropietarioEther").text(balanceEther + ' ETH');
                var numParcelas = await getNumeroTokens().call(options);
                var dataSetDrones = [];
                var numeroSolicitudes = await getNumeroSolicitudes().call(options);
                var parcela;
                for (var i=0; i<numParcelas; i++) {
                    var id = await getTokenIdByIndex(i).call(options);
                    try {
                        parcela = await getParcela(id).call(options);

                    } catch(e) {
                        console.error(e);
                    }
                    var controls = "";
                    if (!parcela[4])
                        controls += "<a data-widget='control-sidebar' data-slide='true' href='#' role='button' data-toggle='modal' data-target='#mdlDronesParaTrabajo' class='float-right mr-2 btn btn-sm btn-outline-primary' href='#' onclick='App.cargarDronesParaTrabajo(" + id + ");'>Solicitar</a>";
                    dataSetDrones.push([parcela[0], parcela[1], parcela[2], parcela[3], controls]);
                }
                this.tblParcelas.clear();
                this.tblParcelas.rows.add(dataSetDrones).draw();
            } catch (e) {
                this.addEventLog('Error al conectar usuario Propietario.' + propietarioNumero + '<br/>Cuenta: ' + this.cuentaPropietario[propietarioNumero], 'danger');
                $("#inpCuenta").val(this.cuentaPropietario[propietarioNumero]);
                $("#mdlLoginUsuario").modal('show');
            } finally {
                this.spinnerHide();
            }
        }
    },

    guardarInformacionPropietario: async function() {
        this.spinnerShow();
        var nombre = $("#inpPropietarioNombre").val();
        const { setPropietarioNombre } = this.contratoPropietarios.methods;
        var options = {from: this.cuentaPropietario[this.propietarioActivo], gas: 500000}
        var txHash = await setPropietarioNombre(nombre).send(options);
        this.addEventLog('Información de propietario guardada.', 'success', txHash);
        this.cargarPropietario(this.propietarioActivo);
        this.spinnerHide();
        $("#mdlInfoPropietario").modal('hide');
    },

    nuevaParcela: async function() {
        var codigo = await this.generarCodigo();
        $("#inpParcelaNombre").val('');
        $("#inpParcelaAltMax").val('');
        $("#inpParcelaAltMin").val('');
        $("#inpParcelaPesticidas").val('');
        $("#radPesticida1").prop('checked',true);
    },

    guardarInformacionParcela: async function() {
        this.spinnerShow();
        const { crearParcela } = this.contratoPropietarios.methods;
        var options = {from: this.cuentaPropietario[this.propietarioActivo], gas: 500000}
        var txHash = await crearParcela(
            $("#inpParcelaNombre").val(),
            $("#inpParcelaAltMax").val(),
            $("#inpParcelaAltMin").val(),
            $('input:radio[name=radPesticida]:checked').val()
        ).send(options);
        this.addEventLog('Información de la parcela guardada.', 'success', txHash);
        this.cargarPropietario(this.propietarioActivo);
        this.spinnerHide();
        $("#mdlAgregarParcela").modal('hide');
    },

    cargarDronesParaTrabajo: async function(idParcela) {
        const { getCounter, getTokenIdByIndex, getDron } = this.contratoFumigaDron.methods;
        const { getParcela } = this.contratoPropietarios.methods;
        var options = {from: this.cuentaPropietario[this.propietarioActivo], gas: 500000}
        var parcela = await getParcela(idParcela).call(options);
        var parcelaAltMax = parseInt(parcela[1]);
        var parcelaAltMin = parseInt(parcela[2]);
        var parcelaPesticida = parcela[3];
        var listaDrones = "";
        var numDrones = await getCounter().call();
        for (var i=0; i<numDrones; i++) {
            var idDron = await getTokenIdByIndex(i).call(options);
            var dron = await getDron(idDron).call();
            var dronAltMax = parseInt(dron[1]);
            var dronAltMin = parseInt(dron[2]);
            var dronPesticidas = dron[4];
            if ((dronAltMax>=parcelaAltMax) && (dronAltMin<=parcelaAltMin) && (dronPesticidas.includes(parcelaPesticida))) {
                listaDrones += '<button type="button" class="list-group-item list-group-item-action" onclick="App.solicitarTrabajo(' + idParcela + ', ' + idDron + ');">' + dron[0] + ' (' + dron[3] + ' FUMI)</button>';
            }
        }        
        $("#lstDronesParaTrabajo").html(listaDrones);
        $("#dronesParaTrabajo").removeClass("d-none");
        $("#noDronesParaTrabajo").addClass("d-none");
    },

    solicitarTrabajo: async function(idParcela, idDron) {
        $("#mdlDronesParaTrabajo").modal('hide');
        this.spinnerShow();
        const { solicitarTrabajo } = this.contratoPropietarios.methods;
        const { approve } = this.contratoFumiCoin.methods;
        const { getDron } = this.contratoFumigaDron.methods;
        var options = {from: this.cuentaPropietario[this.propietarioActivo], gas: 500000}
        var txHash = await solicitarTrabajo(idDron, idParcela).send(options);
        this.addEventLog('Trabajo solicidado.', 'success', txHash);
        var eventoTrabajoSolicitado = await this.contratoPropietarios.getPastEvents('TrabajoSolicitado', {filter:{idParcela:idParcela}});
        if (eventoTrabajoSolicitado.length > 0) {
            var resultado = eventoTrabajoSolicitado[0].returnValues;
            this.addEventLog('Evento: TrabajoSolicitado<br/>Parcela ID:' + resultado.idParcela + ' - Dron ID: ' + resultado.idDron, 'info');
            // TODO Cambiar a cuenta propietario y remover onlyowner
            var dron = await getDron(idDron).call(options);
            var costo = dron[3];
            await approve(this.cuentaEmpresa, costo).send(options);
        }
        this.cargarPropietario(this.propietarioActivo);
        this.spinnerHide();
    },

    realizarTrabajo: async function(idParcela, idDron) {
        this.spinnerShow();
        const { realizarTrabajo, getDron } = this.contratoFumigaDron.methods;
        const { getPropietarioAddress } = this.contratoPropietarios.methods;
        const { transferFrom } = this.contratoFumiCoin.methods;
        var options = {from: this.cuentaEmpresa, gas: 500000}
        try {
            var txHash = await realizarTrabajo(idParcela).send(options);
        } catch(e) { console.error(e); throw "Error"; }
        this.addEventLog('Trabajo realizado.', 'success', txHash);
        var eventoTrabajoConfirmado = await this.contratoFumigaDron.getPastEvents('TrabajoConfirmado', {filter:{idParcela:idParcela}});
        if (eventoTrabajoConfirmado.length > 0) {
            var resultado = eventoTrabajoConfirmado[0].returnValues;
            this.addEventLog('Evento: TrabajoConfirmado<br/>Parcela ID:' + resultado.idParcela, 'info');
            var dron = await getDron(idDron).call(options);
            var costo = dron[3];
            // TODO Cual propietario
            var cuentaPropietario = await getPropietarioAddress(idParcela).call(options);
            await transferFrom(cuentaPropietario, this.cuentaEmpresa, costo).send(options);
        }
        this.cargarEmpresa();
        this.spinnerHide();
    },

};

window.App = App;
window.addEventListener("load", App.initialize());
