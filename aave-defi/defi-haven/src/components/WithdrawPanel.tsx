import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { useAaveAccountData } from "@/hooks/useAaveAccountData";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionModal } from "./TransactionModal";
import { SUPPORTED_ASSETS } from "@/config/contracts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

export function WithdrawPanel() {
  const { isConnected } = useWallet();
  const accountData = useAaveAccountData();
  const { txState, resetTx, withdraw } = useTransactions();
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(SUPPORTED_ASSETS[0].symbol);

  const asset = SUPPORTED_ASSETS.find((a) => a.symbol === selectedAsset)!;
  const hf = accountData.healthFactor === "∞" ? Infinity : parseFloat(accountData.healthFactor);
  const isUnsafe = hf < 1.2 && parseFloat(accountData.totalDebtETH) > 0;

  if (!isConnected) {
    return (
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg">Withdraw</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Connect wallet to withdraw</p></CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg">Withdraw</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-3 text-sm">
            <p className="text-muted-foreground text-xs">Total Collateral</p>
            <p className="font-mono font-semibold">{parseFloat(accountData.totalCollateralETH).toFixed(4)} ETH</p>
          </div>

          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_ASSETS.map((a) => (
                <SelectItem key={a.symbol} value={a.symbol}>
                  {a.icon} {a.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono bg-secondary/50"
          />

          {isUnsafe && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Health Factor below 1.2 — withdrawal blocked
            </div>
          )}

          <Button
            onClick={() => withdraw(asset.address, amount, asset.decimals, accountData.refetch)}
            disabled={!amount || parseFloat(amount) <= 0 || isUnsafe}
            className="w-full"
          >
            Withdraw {selectedAsset}
          </Button>
        </CardContent>
      </Card>
      <TransactionModal txState={txState} onClose={resetTx} title="Withdraw" />
    </>
  );
}
