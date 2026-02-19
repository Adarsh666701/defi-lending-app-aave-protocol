import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { useAaveAccountData } from "@/hooks/useAaveAccountData";
import { useAllowance } from "@/hooks/useAllowance";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionModal } from "./TransactionModal";
import { CONTRACTS, SUPPORTED_ASSETS } from "@/config/contracts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";

export function RepayPanel() {
  const { isConnected } = useWallet();
  const accountData = useAaveAccountData();
  const { txState, resetTx, approve, repay } = useTransactions();
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(SUPPORTED_ASSETS[0].symbol);

  const asset = SUPPORTED_ASSETS.find((a) => a.symbol === selectedAsset)!;
  const { allowance, refetch: refetchAllowance } = useAllowance(asset.address, CONTRACTS.LENDING_POOL);
  const needsApproval = parseFloat(amount || "0") > 0 && parseFloat(allowance) < parseFloat(amount || "0");

  if (!isConnected) {
    return (
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg">Repay</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Connect wallet to repay</p></CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg">Repay</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-3 text-sm">
            <p className="text-muted-foreground text-xs">Total Debt</p>
            <p className="font-mono font-semibold">{parseFloat(accountData.totalDebtETH).toFixed(4)} ETH</p>
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

          <div className="flex flex-col gap-2">
            {needsApproval && (
              <Button
                variant="outline"
                onClick={() => approve(asset.address, CONTRACTS.LENDING_POOL, refetchAllowance)}
                className="w-full gap-2"
              >
                <Check className="h-4 w-4" /> Approve {selectedAsset}
              </Button>
            )}

            <Button
              onClick={() => repay(asset.address, amount, asset.decimals, accountData.refetch)}
              disabled={!amount || parseFloat(amount) <= 0 || needsApproval}
              className="w-full"
            >
              Repay {selectedAsset}
            </Button>
          </div>
        </CardContent>
      </Card>
      <TransactionModal txState={txState} onClose={resetTx} title="Repay" />
    </>
  );
}
