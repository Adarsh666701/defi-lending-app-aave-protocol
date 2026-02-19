import { useState, useCallback } from "react";
import { Contract, parseUnits, MaxUint256 } from "ethers";
import { useWallet } from "./useWallet";
import { ERC20_ABI, WETH_ABI, LENDING_POOL_ABI, DATA_PROVIDER_ABI, DEBT_TOKEN_ABI, CONTRACTS } from "@/config/contracts";

export type TxStatus = "idle" | "signing" | "pending" | "confirmed" | "failed";

export interface TxState {
  status: TxStatus;
  hash: string | null;
  error: string | null;
}

export function useTransactions() {
  const { signer, address } = useWallet();
  const [txState, setTxState] = useState<TxState>({ status: "idle", hash: null, error: null });

  const resetTx = useCallback(() => {
    setTxState({ status: "idle", hash: null, error: null });
  }, []);

  const executeTx = useCallback(
    async (txPromise: () => Promise<any>, onSuccess?: () => void) => {
      setTxState({ status: "signing", hash: null, error: null });
      try {
        const tx = await txPromise();
        setTxState({ status: "pending", hash: tx.hash, error: null });
        await tx.wait();
        setTxState({ status: "confirmed", hash: tx.hash, error: null });
        onSuccess?.();
      } catch (err: any) {
        const message =
          err.code === "ACTION_REJECTED"
            ? "Transaction rejected by user"
            : err.reason || err.message || "Transaction failed";
        setTxState({ status: "failed", hash: null, error: message });
      }
    },
    []
  );

  const approve = useCallback(
    async (tokenAddress: string, spenderAddress: string, onSuccess?: () => void) => {
      if (!signer) return;
      const contract = new Contract(tokenAddress, ERC20_ABI, signer);
      await executeTx(() => contract.approve(spenderAddress, MaxUint256), onSuccess);
    },
    [signer, executeTx]
  );

  const wrapEth = useCallback(
    async (amount: string, onSuccess?: () => void) => {
      if (!signer) return;
      const contract = new Contract(CONTRACTS.WETH, WETH_ABI, signer);
      await executeTx(() => contract.deposit({ value: parseUnits(amount, 18) }), onSuccess);
    },
    [signer, executeTx]
  );

  const supply = useCallback(
    async (asset: string, amount: string, decimals: number, onSuccess?: () => void) => {
      if (!signer || !address) return;
      const contract = new Contract(CONTRACTS.LENDING_POOL, LENDING_POOL_ABI, signer);
      await executeTx(
        () => contract.deposit(asset, parseUnits(amount, decimals), address, 0),
        onSuccess
      );
    },
    [signer, address, executeTx]
  );

  const borrow = useCallback(
    async (asset: string, amount: string, decimals: number, onSuccess?: () => void) => {
      if (!signer || !address) return;
      const contract = new Contract(CONTRACTS.LENDING_POOL, LENDING_POOL_ABI, signer);
      await executeTx(
        () => contract.borrow(asset, parseUnits(amount, decimals), 2, 0, address),
        onSuccess
      );
    },
    [signer, address, executeTx]
  );

  const repay = useCallback(
    async (asset: string, amount: string, decimals: number, onSuccess?: () => void) => {
      if (!signer || !address) return;
      const contract = new Contract(CONTRACTS.LENDING_POOL, LENDING_POOL_ABI, signer);
      await executeTx(
        () => contract.repay(asset, parseUnits(amount, decimals), 2, address),
        onSuccess
      );
    },
    [signer, address, executeTx]
  );

  const withdraw = useCallback(
    async (asset: string, amount: string, decimals: number, onSuccess?: () => void) => {
      if (!signer || !address) return;
      const contract = new Contract(CONTRACTS.LENDING_POOL, LENDING_POOL_ABI, signer);
      await executeTx(
        () => contract.withdraw(asset, parseUnits(amount, decimals), address),
        onSuccess
      );
    },
    [signer, address, executeTx]
  );

  const flashLoan = useCallback(
    async (
      receiverAddress: string,
      assets: string[],
      amounts: string[],
      decimals: number[],
      modes: number[],
      params: string,
      onSuccess?: () => void
    ) => {
      if (!signer || !address) return;
      const contract = new Contract(CONTRACTS.LENDING_POOL, LENDING_POOL_ABI, signer);
      const parsedAmounts = amounts.map((a, i) => parseUnits(a, decimals[i]));
      const paramsBytes = params || "0x";
      await executeTx(
        () =>
          contract.flashLoan(receiverAddress, assets, parsedAmounts, modes, address, paramsBytes, 0),
        onSuccess
      );
    },
    [signer, address, executeTx]
  );

  const approveDelegation = useCallback(
    async (debtTokenAddress: string, delegatee: string, amount: string, decimals: number, onSuccess?: () => void) => {
      if (!signer) return;
      const contract = new Contract(debtTokenAddress, DEBT_TOKEN_ABI, signer);
      await executeTx(
        () => contract.approveDelegation(delegatee, parseUnits(amount, decimals)),
        onSuccess
      );
    },
    [signer, executeTx]
  );

  return {
    txState,
    resetTx,
    approve,
    wrapEth,
    supply,
    borrow,
    repay,
    withdraw,
    flashLoan,
    approveDelegation,
  };
}
