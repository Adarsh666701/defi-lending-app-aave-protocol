import { useState, useEffect, useCallback } from "react";
import { Contract, formatUnits } from "ethers";
import { CONTRACTS, LENDING_POOL_ABI } from "@/config/contracts";
import { useWallet } from "./useWallet";

export interface AccountData {
  totalCollateralETH: string;
  totalDebtETH: string;
  availableBorrowsETH: string;
  ltv: string;
  liquidationThreshold: string;
  healthFactor: string;
  rawHealthFactor: bigint;
}

const DEFAULT_DATA: AccountData = {
  totalCollateralETH: "0",
  totalDebtETH: "0",
  availableBorrowsETH: "0",
  ltv: "0",
  liquidationThreshold: "0",
  healthFactor: "0",
  rawHealthFactor: 0n,
};

export function useAaveAccountData() {
  const { provider, address, isConnected } = useWallet();
  const [data, setData] = useState<AccountData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!provider || !address || !isConnected) {
      setData(DEFAULT_DATA);
      return;
    }
    setLoading(true);
    try {
      const contract = new Contract(CONTRACTS.LENDING_POOL, LENDING_POOL_ABI, provider);
      const result = await contract.getUserAccountData(address);

      setData({
        totalCollateralETH: formatUnits(result[0], 18),
        totalDebtETH: formatUnits(result[1], 18),
        availableBorrowsETH: formatUnits(result[2], 18),
        ltv: (Number(result[4]) / 100).toFixed(2),
        liquidationThreshold: (Number(result[3]) / 100).toFixed(2),
        healthFactor: result[5] === BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
          ? "∞"
          : formatUnits(result[5], 18),
        rawHealthFactor: result[5],
      });
    } catch (err) {
      console.error("Error fetching account data:", err);
      setData(DEFAULT_DATA);
    } finally {
      setLoading(false);
    }
  }, [provider, address, isConnected]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, refetch: fetchData };
}
