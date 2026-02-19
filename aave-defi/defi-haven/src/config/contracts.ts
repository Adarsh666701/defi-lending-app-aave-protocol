// Aave V2 Mainnet addresses
// Reference: https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts

export const CHAIN_ID = 1; // Ethereum Mainnet
export const CHAIN_NAME = "Ethereum Mainnet";
export const BLOCK_EXPLORER = "https://etherscan.io";

export const CONTRACTS = {
  LENDING_POOL: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
  LENDING_POOL_DATA_PROVIDER: "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d",
  WETH_GATEWAY: "0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
};

export interface SupportedAsset {
  symbol: string;
  address: string;
  decimals: number;
  icon: string;
}

export const SUPPORTED_ASSETS: SupportedAsset[] = [
  {
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    icon: "Ξ",
  },
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    icon: "$",
  },
  {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    icon: "◈",
  },
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    icon: "₮",
  },
  {
    symbol: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    icon: "₿",
  },
];

// Minimal ABIs for interacting with contracts
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

export const WETH_ABI = [
  ...ERC20_ABI,
  "function deposit() payable",
  "function withdraw(uint256 amount)",
];

export const LENDING_POOL_ABI = [
  "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
  "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
  "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)",
  "function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) returns (uint256)",
  "function getUserAccountData(address user) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
  "function flashLoan(address receiverAddress, address[] calldata assets, uint256[] calldata amounts, uint256[] calldata modes, address onBehalfOf, bytes calldata params, uint16 referralCode)",
];

export const DATA_PROVIDER_ABI = [
  "function getReserveTokensAddresses(address asset) view returns (address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress)",
  "function getUserReserveData(address asset, address user) view returns (uint256 currentATokenBalance, uint256 currentStableDebt, uint256 currentVariableDebt, uint256 principalStableDebt, uint256 scaledVariableDebt, uint256 stableBorrowRate, uint256 liquidityRate, uint40 stableRateLastUpdated, bool usageAsCollateralEnabled)",
];

export const DEBT_TOKEN_ABI = [
  "function approveDelegation(address delegatee, uint256 amount)",
  "function borrowAllowance(address fromUser, address toUser) view returns (uint256)",
];
