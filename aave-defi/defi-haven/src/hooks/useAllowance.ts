import { useState, useEffect, useCallback } from "react";
import { Contract, formatUnits } from "ethers";
import { ERC20_ABI } from "@/config/contracts";
import { useWallet } from "./useWallet";

export function useAllowance(tokenAddress: string | null, spenderAddress: string | null) {
  const { provider, address, isConnected } = useWallet();
  const [allowance, setAllowance] = useState<string>("0");
  const [rawAllowance, setRawAllowance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);

  const fetchAllowance = useCallback(async () => {
    if (!provider || !address || !tokenAddress || !spenderAddress || !isConnected) {
      setAllowance("0");
      setRawAllowance(0n);
      return;
    }
    setLoading(true);
    try {
      const contract = new Contract(tokenAddress, ERC20_ABI, provider);
      const [allow, dec] = await Promise.all([
        contract.allowance(address, spenderAddress),
        contract.decimals(),
      ]);
      setRawAllowance(allow);
      setAllowance(formatUnits(allow, Number(dec)));
    } catch (err) {
      console.error("Error fetching allowance:", err);
    } finally {
      setLoading(false);
    }
  }, [provider, address, tokenAddress, spenderAddress, isConnected]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  return { allowance, rawAllowance, loading, refetch: fetchAllowance };
}
