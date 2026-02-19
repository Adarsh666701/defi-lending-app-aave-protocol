import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionModal } from "./TransactionModal";
import { SUPPORTED_ASSETS } from "@/config/contracts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Zap } from "lucide-react";

export function FlashLoanPanel() {
  const { isConnected } = useWallet();
  const { txState, resetTx, flashLoan } = useTransactions();
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(SUPPORTED_ASSETS[0].symbol);
  const [mode, setMode] = useState("0");
  const [params, setParams] = useState("");

  const asset = SUPPORTED_ASSETS.find((a) => a.symbol === selectedAsset)!;

  if (!isConnected) {
    return (
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Flash Loan</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Connect wallet to use flash loans</p></CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass gradient-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Flash Loan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 text-xs text-warning">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Important</p>
                <p className="mt-1">Flash loans must target a deployed FlashLoanReceiver contract, not a wallet. The receiver must implement the IFlashLoanReceiver interface.</p>
              </div>
            </div>
          </div>

          <Input
            placeholder="Receiver Contract Address (0x…)"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            className="font-mono text-xs bg-secondary/50"
          />

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

          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Mode 0 — Flash (repay in same tx)</SelectItem>
              <SelectItem value="1">Mode 1 — Stable Debt</SelectItem>
              <SelectItem value="2">Mode 2 — Variable Debt</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Params (hex, optional)"
            value={params}
            onChange={(e) => setParams(e.target.value)}
            className="font-mono text-xs bg-secondary/50"
          />

          <Button
            onClick={() =>
              flashLoan(receiverAddress, [asset.address], [amount], [asset.decimals], [parseInt(mode)], params)
            }
            disabled={!amount || !receiverAddress || parseFloat(amount) <= 0}
            className="w-full gap-2"
          >
            <Zap className="h-4 w-4" /> Execute Flash Loan
          </Button>
        </CardContent>
      </Card>
      <TransactionModal txState={txState} onClose={resetTx} title="Flash Loan" />
    </>
  );
}
