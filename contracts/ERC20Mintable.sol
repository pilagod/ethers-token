// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract ERC20Mintable {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    uint256 public totalSupply;

    string public name;
    string public symbol;
    uint8 public decimals;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function approve(address _spender, uint256 _amount) public returns (bool) {
        require(_spender != address(0), "ERC20: approve to the zero address");
        allowances[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    function balanceOf(address _account) public view returns (uint256) {
        return balances[_account];
    }

    function mint(uint256 _amount) public returns (bool) {
        totalSupply += _amount;
        balances[msg.sender] += _amount;
        emit Transfer(address(0), msg.sender, _amount);
        return true;
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        _transfer(msg.sender, _to, _amount);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        require(allowance(_from, msg.sender) >= _amount, "ERC20: insufficient allowance");
        allowances[_from][msg.sender] -= _amount;
        _transfer(_from, _to, _amount);
        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal {
        require(_from != address(0), "ERC20: transfer from the zero address");
        require(_to != address(0), "ERC20: transfer to the zero address");

        require(balances[_from] >= _amount, "ERC20: transfer amount exceeds balance");
        balances[_from] -= _amount;
        balances[_to] += _amount;

        emit Transfer(_from, _to, _amount);
    }
}
