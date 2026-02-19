// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Minimal Aave V2 Flash Loan Receiver (single-asset)
 *
 * What it does:
 * - Can receive a flash loan from Aave V2 LendingPool
 * - Executes arbitrary logic hook (you can customize)
 * - Repays (amount + premium) within the same transaction
 * - Optionally sends any leftover profit to a chosen beneficiary
 *
 * IMPORTANT:
 * - Aave V2 core is 0.6.x, but interfaces work fine in 0.8.x for calling.
 * - You MUST deploy this contract, then your React app calls `requestFlashLoan`.
 */

// ---------- Minimal ERC20 ----------
interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

// ---------- Aave V2 LendingPool ----------
interface ILendingPoolV2 {
    function flashLoan(
        address receiverAddress,
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata modes,       // 0 = no debt (flash), 1 stable debt, 2 variable debt
        address onBehalfOf,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

// ---------- Aave V2 FlashLoanReceiver callback ----------
interface IFlashLoanReceiverV2 {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

contract FlashLoanReceiver is IFlashLoanReceiverV2 {
    address public owner;
    ILendingPoolV2 public immutable lendingPool;

    event FlashLoanRequested(address indexed asset, uint256 amount, uint256 mode);
    event FlashLoanExecuted(address indexed asset, uint256 amount, uint256 premium);
    event ProfitWithdrawn(address indexed token, address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address lendingPoolAddress) {
        require(lendingPoolAddress != address(0), "Bad pool");
        owner = msg.sender;
        lendingPool = ILendingPoolV2(lendingPoolAddress);
    }

    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Bad owner");
        owner = newOwner;
    }

    /**
     * Called by your wallet (or your UI) to start a flash loan.
     *
     * @param asset The token to borrow
     * @param amount Amount to borrow (raw units)
     * @param mode 0 = pure flash (must repay), 1/2 opens debt if not repaid (advanced)
     * @param params Arbitrary bytes passed into executeOperation (encode anything you want)
     */
    function requestFlashLoan(
        address asset,
        uint256 amount,
        uint256 mode,
        bytes calldata params
    ) external onlyOwner {
        address;
        asset = asset;

        uint256;
        amount = amount;

        uint256;
        mode[0] = mode;

        // onBehalfOf is only relevant if mode != 0; for mode=0 it can be any address.
        lendingPool.flashLoan(
            address(this),
            asset,
            amount,
            mode,
            address(this),
            params,
            0
        );

        emit FlashLoanRequested(asset, amount, mode);
    }

    /**
     * Aave calls this after sending funds.
     * You MUST repay (amount + premium) here for mode=0.
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(lendingPool), "Caller not LendingPool");
        require(initiator == address(this), "Bad initiator");
        // params is here if you want to decode strategy instructions
        // Example: (address beneficiary) = abi.decode(params, (address));

        address asset = assets[0];
        uint256 amount = amounts[0];
        uint256 premium = premiums[0];

        // -----------------------------
        // YOUR FLASH-LOAN LOGIC GOES HERE
        // -----------------------------
        // Examples (you will implement later):
        // - DEX arbitrage (swap A -> B -> A)
        // - liquidations
        // - collateral swap / refinancing
        //
        // For now: do nothing.
        // -----------------------------

        // Repay Aave: approve the LendingPool to pull amount + premium
        uint256 repayAmount = amount + premium;
        IERC20(asset).approve(address(lendingPool), repayAmount);

        emit FlashLoanExecuted(asset, amount, premium);
        return true;
    }

    /**
     * Withdraw any leftover tokens (profit) sitting in the receiver.
     * You can call this after successful flash loan if your strategy made profit.
     */
    function withdrawToken(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Bad to");
        IERC20(token).transfer(to, amount);
        emit ProfitWithdrawn(token, to, amount);
    }

    /**
     * Optional: view helper for UI
     */
    function tokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
