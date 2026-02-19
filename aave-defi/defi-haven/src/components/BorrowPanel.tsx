import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { useAaveAccountData } from "@/hooks/useAaveAccountData";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionModal } from "./TransactionModal";
import { HealthFactor } from "./HealthFactor";
import { SUPPORTED_ASSETS } from "@/config/contracts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

export function BorrowPanel() {
  const { isConnected } = useWallet();
  const accountData = useAaveAccountData();
  const { txState, resetTx, borrow } = useTransactions();
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(SUPPORTED_ASSETS[0].symbol);

  const asset = SUPPORTED_ASSETS.find((a) => a.symbol === selectedAsset)!;
  const maxBorrow = parseFloat(accountData.availableBorrowsETH) * 0.75;
  const isOverLimit = parseFloat(amount || "0") > maxBorrow;

  if (!isConnected) {
    return (
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg">Borrow</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Connect wallet to borrow</p></CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass gradient-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Borrow</CardTitle>
            <HealthFactor healthFactor={accountData.healthFactor} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-3 text-sm">
            <p className="text-muted-foreground text-xs">Available to Borrow (75% limit)</p>
            <p className="font-mono font-semibold">{maxBorrow.toFixed(4)} ETH equiv.</p>
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

          {isOverLimit && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Exceeds 75% safety limit
            </div>
          )}

          <Button
            onClick={() => borrow(asset.address, amount, asset.decimals, accountData.refetch)}
            disabled={!amount || parseFloat(amount) <= 0 || isOverLimit}
            className="w-full"
          >
            Borrow {selectedAsset}
          </Button>
        </CardContent>
      </Card>
      <TransactionModal txState={txState} onClose={resetTx} title="Borrow" />
    </>
  );
}
