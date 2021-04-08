// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is Ownable, ERC20 {
    using SafeMath for uint256;

    constructor(string memory name, string memory symbol, uint supply) public
        ERC20(name, symbol)
		Ownable()
    {
        _mint(msg.sender, supply);
    }
}
