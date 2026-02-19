// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;

    function approve(address spender, uint256 amount) external returns (bool);

    function balanceOf(address) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount)
        external
        returns (bool);

    function decimals() external view returns (uint8);
}
