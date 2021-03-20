pragma solidity 0.4.24;

import "./OpenZeppelin/token/ERC721/ERC721Full.sol";
import "./OpenZeppelin/ownership/Ownable.sol";

contract BaseDronParcela is ERC721Full, Ownable {

    uint256 public idCount = 0;
    mapping(uint256 => uint256) public alt_max;
    mapping(uint256 => uint256) public alt_min;

    constructor() public {}

    function getNumeroTokens() public view returns(uint256) {
        return(balanceOf(msg.sender));
    }
    
    function getTokenIdByIndex(uint256 index) public view returns(uint256) {
        return(tokenOfOwnerByIndex(msg.sender, index));
    }

    function mint(address to) public returns(uint256) {
        _mint(to, idCount + 1);
        idCount = idCount + 1;
        return idCount;
    }
}
