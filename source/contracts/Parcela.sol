pragma solidity 0.4.24;

import "./BaseDronParcela.sol";

contract Parcela is BaseDronParcela {

    mapping(uint256 => string) public parcelaNombre;
    mapping(uint256 => string) public pesticida_aceptado;

    constructor() ERC721Full("Parcela Token", "PARCT")  public {}
    
    function crearParcela(string parcelaNombre_, uint256 alt_max_, uint256 alt_min_, string pesticida_aceptado_) public { // onlyOwner
        uint256 id = mint(msg.sender);
        parcelaNombre[id] = parcelaNombre_;
        alt_max[id] = alt_max_;
        alt_min[id] = alt_min_;
        pesticida_aceptado[id] = pesticida_aceptado_;
    }

    /*
    modifier onlyParcelaOwner(uint256 idParcela) {
        require(isParcelaOwner(idParcela));
        _;
    }

    function isParcelaOwner(uint256 idParcela) public view returns(bool) {
        return msg.sender == ownerOf(idParcela);
    }
    */
}
