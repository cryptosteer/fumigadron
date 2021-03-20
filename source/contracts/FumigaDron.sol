pragma solidity 0.4.24;

import "./Dron.sol";
import "./Propietarios.sol";
import "./FumiCoin.sol";

contract FumigaDron is Dron {

    string nombreEmpresa;
    Propietarios private _propietarios;
    FumiCoin private _fumicoin;
 
    constructor(address propietarios_address, address fumicoin_address) public {
         nombreEmpresa = "DronTech Corp";
        _propietarios = Propietarios(propietarios_address);
        _fumicoin = FumiCoin(fumicoin_address);
    }

    function getNombreEmpresa() public view returns(string){
        return(nombreEmpresa);
    }

    function setNombreEmpresa(string nombreEmpresa_) public onlyOwner {
        nombreEmpresa = nombreEmpresa_;
    }

    function realizarTrabajo(uint256 idParcela) public {
        _propietarios.eliminarSolicitudTrabajo(idParcela);
        emit TrabajoConfirmado(idParcela);
    }

    event TrabajoConfirmado(
        uint256 indexed idParcela
    );
 }
