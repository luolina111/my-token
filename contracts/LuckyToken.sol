// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title LuckyToken
 * @dev 简单的ERC20代币合约
 */
contract LuckyToken is ERC20 {

    // 代币名称
    string public constant NAME = "LuckyERC20Token";

    // 代币简称
    string public constant SYMBOL = "LUCKY";

    // 发行数量
    uint256 public constant INITIAL_SUPPLY = 10000;
    

    constructor() ERC20(NAME, SYMBOL) {
       // 将初始发行量铸造给部署者的创建者
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    // 重写 ERC20 代币的小数位数设置
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}