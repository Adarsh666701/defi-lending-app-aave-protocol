import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, AlertTriangle } from "lucide-react";

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletButton() {
  const { address, isConnected, isConnecting, connect, disconnect, hasMetaMask, error } =
    useWallet();

  if (!hasMetaMask) {
    return (
      <Button variant="destructive" size="sm" onClick={() => window.open("https://metamask.io", "_blank")}>
        <AlertTriangle className="mr-2 h-4 w-4" />
        Install MetaMask
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-secondary px-3 py-1.5 font-mono text-sm text-secondary-foreground">
          {shortenAddress(address)}
        </div>
        <Button variant="ghost" size="icon" onClick={disconnect} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connect} disabled={isConnecting} className="gap-2">
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}
