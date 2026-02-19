import { useState, useEffect, useCallback } from "react";
import { Contract, formatUnits } from "ethers";
import { ERC20_ABI } from "@/config/contracts";
import { useWallet } from "./useWallet";

export function useTokenBalance(tokenAddress: string | null) {
  const { provider, address, isConnected } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [rawBalance, setRawBalance] = useState<bigint>(0n);
  const [decimals, setDecimals] = useState<number>(18);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!provider || !address || !tokenAddress || !isConnected) {
      setBalance("0");
      setRawBalance(0n);
      return;
    }
    setLoading(true);
    try {
      const contract = new Contract(tokenAddress, ERC20_ABI, provider);
      const [bal, dec] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals(),
      ]);
      setRawBalance(bal);
      setDecimals(Number(dec));
      setBalance(formatUnits(bal, Number(dec)));
    } catch (err) {
      console.error("Error fetching balance:", err);
      setBalance("0");
    } finally {
      setLoading(false);
    }
  }, [provider, address, tokenAddress, isConnected]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, rawBalance, decimals, loading, refetch: fetchBalance };
}

export function useEthBalance() {
  const { provider, address, isConnected } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!provider || !address || !isConnected) {
      setBalance("0");
      return;
    }
    setLoading(true);
    try {
      const bal = await provider.getBalance(address);
      setBalance(formatUnits(bal, 18));
    } catch {
      setBalance("0");
    } finally {
      setLoading(false);
    }
  }, [provider, address, isConnected]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, refetch: fetchBalance };
}
