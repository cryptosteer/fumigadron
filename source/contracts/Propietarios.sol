pragma solidity 0.4.24;

import "./Parcela.sol";
import "./FumiCoin.sol";

contract Propietarios is Parcela {

    uint256 public propietarioIdCount = 0;
    mapping(address => uint256) public propietarioId;
    mapping(uint256 => address) public propietarioAddress;
    mapping(uint256 => string) public propietarioNombre;
    SolicitudTrabajo[] public _solicitudesTrabajo;
    mapping(uint256 => uint256) public _idParcela_solicitudIndex;
    FumiCoin private _fumicoin;

    struct SolicitudTrabajo {
        uint256 idParcela;
        uint256 idDron;
    }

    constructor(address fumicoin_address) public {
        _fumicoin = FumiCoin(fumicoin_address);
    }

    function existePropietario() public view returns(bool) {
        if(propietarioId[msg.sender]!=0)
            return true;
        else
            return false;
    }

    function obtenerFumi() public {
        _fumicoin.mint(msg.sender, 100);
    }

    function crearPropietario() public {
        propietarioId[msg.sender] = propietarioIdCount + 1;
        propietarioAddress[propietarioIdCount + 1] = msg.sender;
        propietarioNombre[propietarioIdCount + 1] = "[Actualice su nombre]";
        propietarioIdCount = propietarioIdCount + 1;
        obtenerFumi();
    }

    function getPropietarioNombre() public view returns(string){
        uint256 id = propietarioId[msg.sender];
        return(propietarioNombre[id]);
    }

    function setPropietarioNombre(string nombre_) public {
        uint256 id = propietarioId[msg.sender];
        propietarioNombre[id] = nombre_;
    }

    function getPropietarioAddress(uint256 idParcela) public view onlyOwner returns(address) {
        address parcelaOwner = ownerOf(idParcela);
        return parcelaOwner;
    }

    function getParcela(uint256 id) public view returns(string, uint256, uint256, string, bool) {
        return (parcelaNombre[id], alt_max[id], alt_min[id], pesticida_aceptado[id], isParcelaEnSolicitud(id));
    }

    function isParcelaEnSolicitud(uint256 idParcela) public view returns (bool) {
        if (_idParcela_solicitudIndex[idParcela] != 0)
            return true;
        else 
            return false;
    }

    function getNumeroSolicitudes() public view returns(uint256) {
        return _solicitudesTrabajo.length;
    }

    function getSolicitudTrabajoIdByIndex(uint256 index) public view returns(uint256, uint256) {
        return (_solicitudesTrabajo[index].idParcela, _solicitudesTrabajo[index].idDron);
    }

    function getSolicitudTrabajo(uint256 idParcela) public view returns(string, string, string) {
        address parcelaOwner = ownerOf(idParcela);
        uint256 idProp = propietarioId[parcelaOwner];
        return (propietarioNombre[idProp], parcelaNombre[idParcela], pesticida_aceptado[idParcela]);
    }

    function solicitarTrabajo(uint256 idDron, uint256 idParcela) public {
        SolicitudTrabajo memory solicitud = SolicitudTrabajo(idParcela, idDron); 
        uint256 index = _solicitudesTrabajo.push(solicitud);
        _idParcela_solicitudIndex[idParcela] = index;
        emit TrabajoSolicitado(idDron, idParcela);
    }

    function eliminarSolicitudTrabajo(uint256 idParcela) public {
        delete _solicitudesTrabajo[_idParcela_solicitudIndex[idParcela]-1];
        delete _idParcela_solicitudIndex[idParcela];
        _solicitudesTrabajo.length = _solicitudesTrabajo.length-1;
    }

    event TrabajoSolicitado(
        uint256 idDron,
        uint256 indexed idParcela
    );

    /*
    modifier onlyPropietarioOwner(uint256 idPropietario) {
        require(isPropietarioOwner(idPropietario));
        _;
    }

    function isParcelaOwner(uint256 idParcela) internal view returns(bool) {
        return propietarioAddress[idPropietario] == msg.sender;
    }
    */
}
