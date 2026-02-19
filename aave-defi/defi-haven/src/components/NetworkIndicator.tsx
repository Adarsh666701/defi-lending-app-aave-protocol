import { useWallet } from "@/hooks/useWallet";
import { CHAIN_ID, CHAIN_NAME } from "@/config/contracts";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NetworkIndicator() {
  const { chainId, isConnected, switchNetwork } = useWallet();

  if (!isConnected) return null;

  const isCorrect = chainId === CHAIN_ID;

  if (isCorrect) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm">
        <div className="h-2 w-2 rounded-full bg-safe animate-pulse-glow" />
        <span className="text-secondary-foreground">{CHAIN_NAME}</span>
      </div>
    );
  }

  return (
    <Button variant="destructive" size="sm" onClick={switchNetwork} className="gap-1.5">
      <AlertTriangle className="h-3.5 w-3.5" />
      Wrong Network
    </Button>
  );
}
