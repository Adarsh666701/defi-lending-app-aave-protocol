// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Common interface for Aave V2 StableDebtToken and VariableDebtToken
interface IDebtToken {
    /// @notice Delegator approves a delegatee to borrow (mint debt) on delegator’s behalf
    function approveDelegation(address delegatee, uint256 amount) external;

    /// @notice View how much delegatee can still borrow on behalf of delegator
    function borrowAllowance(address fromUser, address toUser) external view returns (uint256);
}
