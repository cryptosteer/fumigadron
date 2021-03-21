pragma solidity 0.4.24;

import "./BaseDronParcela.sol";

contract Parcela is BaseDronParcela {

    mapping(uint256 => string) public parcelaNombre;
    mapping(uint256 => string) public pesticida_aceptado;

    constructor() ERC721Full("Parcela Token", "PARCT") public {
        return;
    }

    function crearParcela(string parcelaNombre_, uint256 alt_max_, uint256 alt_min_, string pesticida_aceptado_) public { // onlyOwner
        require(alt_min_ <= alt_max_, "Altura maxima debe ser igual o mayor a altura minima");
        require(bytes(parcelaNombre_).length > 0, "Nombre de parcela no debe estar vacio");
        require(bytes(pesticida_aceptado_).length > 0, "Pesticida no debe estar vacio");
        uint256 id = mint(msg.sender);
        parcelaNombre[id] = parcelaNombre_;
        alt_max[id] = alt_max_;
        alt_min[id] = alt_min_;
        pesticida_aceptado[id] = pesticida_aceptado_;
    }

    function getParcela(uint256 id) public view returns(string, uint256, uint256, string) {
        return (parcelaNombre[id], alt_max[id], alt_min[id], pesticida_aceptado[id]);
    }
}
