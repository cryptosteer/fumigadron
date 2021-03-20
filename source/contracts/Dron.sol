pragma solidity 0.4.24;

import "./BaseDronParcela.sol";

contract Dron is BaseDronParcela {

    mapping(uint256 => string) public codigo;
    mapping(uint256 => uint256) public coste;
    mapping(uint256 => string) public pesticidas_compatibles;

    constructor() ERC721Full("Dron Token", "DRONT") public {}

    function crearDron(string codigo_, uint256 alt_max_, uint256 alt_min_, uint256 coste_, string pesticidas_compatibles_) public onlyOwner {
        uint256 id = mint(msg.sender);
        codigo[id] = codigo_;
        alt_max[id] = alt_max_;
        alt_min[id] = alt_min_;
        coste[id] = coste_;
        pesticidas_compatibles[id] = pesticidas_compatibles_;
    }

    function getCounter() public view returns(uint256) {
        return idCount;
    }

    function getTokenIdByIndex(uint256 index) public view returns(uint256) {
        return(tokenOfOwnerByIndex(owner(), index));
    }

    function getDron(uint256 id) public view returns(string, uint256, uint256, uint256, string) {
        return (codigo[id], alt_max[id], alt_min[id], coste[id], pesticidas_compatibles[id]);
    }
}
