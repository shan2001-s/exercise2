// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        require(value <= balanceOf[msg.sender], "ERC20: insufficient balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }
}

contract Token1 is SimpleToken {
    constructor() SimpleToken("SANDER", "SD", 10000000) {
    }
}

contract Token2 is SimpleToken {
    constructor() SimpleToken("Aye YerAady", "AYA", 5000000) {
    }
}

contract Token3 is SimpleToken {
    constructor() SimpleToken("Ten Kyat", "TK", 7500000) {
    }
}
