pragma solidity 0.4.24;

import "./OpenZeppelin/token/ERC20/ERC20.sol";
import "./OpenZeppelin/token/ERC20/ERC20Detailed.sol";
import "./OpenZeppelin/ownership/Ownable.sol";

contract FumiCoin is ERC20, ERC20Detailed, Ownable  {

    constructor() ERC20Detailed("FumiCoin", "FUMI", 0) public {}

    function mint(address to, uint256 amount) public { // onlyOwner
        _mint(to, amount);
    }

    function getBalance() public view returns(uint256) {
        return balanceOf(msg.sender);
    }
}
