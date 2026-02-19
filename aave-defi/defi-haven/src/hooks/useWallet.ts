import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { CHAIN_ID, CHAIN_NAME } from "@/config/contracts";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

interface WalletState {
  address: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    provider: null,
    signer: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  const hasMetaMask = typeof window !== "undefined" && !!window.ethereum?.isMetaMask;

  const updateWallet = useCallback(async (accounts?: string[]) => {
    if (!window.ethereum) return;
    try {
      const provider = new BrowserProvider(window.ethereum as any);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      if (!accounts || accounts.length === 0) {
        accounts = (await provider.send("eth_accounts", [])) as string[];
      }

      if (accounts.length === 0) {
        setState({
          address: null,
          isConnected: false,
          provider,
          signer: null,
          chainId,
          isConnecting: false,
          error: null,
        });
        localStorage.removeItem("wallet_connected");
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setState({
        address,
        isConnected: true,
        provider,
        signer,
        chainId,
        isConnecting: false,
        error: chainId !== CHAIN_ID ? `Please switch to ${CHAIN_NAME}` : null,
      });
      localStorage.setItem("wallet_connected", "true");
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err.message || "Failed to connect",
      }));
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((prev) => ({ ...prev, error: "MetaMask not detected. Please install MetaMask." }));
      return;
    }
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      await updateWallet(accounts);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err.code === 4001 ? "Connection rejected by user" : err.message,
      }));
    }
  }, [updateWallet]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
      chainId: null,
      isConnecting: false,
      error: null,
    });
    localStorage.removeItem("wallet_connected");
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
    } catch (err: any) {
      setState((prev) => ({ ...prev, error: err.message }));
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      updateWallet(accounts);
    };
    const handleChainChanged = () => {
      updateWallet();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Persist on refresh
    if (localStorage.getItem("wallet_connected") === "true") {
      updateWallet();
    }

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [updateWallet]);

  return {
    ...state,
    hasMetaMask,
    connect,
    disconnect,
    switchNetwork,
  };
}
