import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { useEthBalance, useTokenBalance } from "@/hooks/useTokenBalance";
import { useAllowance } from "@/hooks/useAllowance";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionModal } from "./TransactionModal";
import { CONTRACTS, SUPPORTED_ASSETS } from "@/config/contracts";
import { ArrowDown, Check, Loader2 } from "lucide-react";

const WETH = SUPPORTED_ASSETS.find((a) => a.symbol === "WETH")!;

export function SupplyPanel() {
  const { isConnected } = useWallet();
  const { balance: ethBalance, refetch: refetchEth } = useEthBalance();
  const { balance: wethBalance, refetch: refetchWeth } = useTokenBalance(WETH.address);
  const { allowance, rawAllowance, refetch: refetchAllowance } = useAllowance(WETH.address, CONTRACTS.LENDING_POOL);
  const { txState, resetTx, wrapEth, approve, supply } = useTransactions();
  const [amount, setAmount] = useState("");

  const refetchAll = () => {
    refetchEth();
    refetchWeth();
    refetchAllowance();
  };

  const needsApproval = parseFloat(amount || "0") > 0 && parseFloat(allowance) < parseFloat(amount || "0");

  if (!isConnected) {
    return (
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg">Supply</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Connect wallet to supply assets</p></CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg">Supply</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-muted-foreground text-xs">ETH Balance</p>
              <p className="font-mono font-semibold">{parseFloat(ethBalance).toFixed(4)}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-muted-foreground text-xs">WETH Balance</p>
              <p className="font-mono font-semibold">{parseFloat(wethBalance).toFixed(4)}</p>
            </div>
          </div>

          <div className="rounded-lg bg-secondary/30 p-2 text-xs text-center">
            <span className="text-muted-foreground">Allowance: </span>
            <span className="font-mono text-foreground">
              {parseFloat(allowance) > 1e15 ? "Unlimited" : parseFloat(allowance).toFixed(4)}
            </span>
          </div>

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono bg-secondary/50"
          />

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => wrapEth(amount, refetchAll)}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(ethBalance)}
              className="w-full gap-2"
            >
              <ArrowDown className="h-4 w-4" /> Wrap ETH → WETH
            </Button>

            {needsApproval && (
              <Button
                variant="outline"
                onClick={() => approve(WETH.address, CONTRACTS.LENDING_POOL, refetchAllowance)}
                className="w-full gap-2"
              >
                <Check className="h-4 w-4" /> Approve WETH
              </Button>
            )}

            <Button
              onClick={() => supply(WETH.address, amount, WETH.decimals, refetchAll)}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(wethBalance) || needsApproval}
              className="w-full"
            >
              Supply WETH
            </Button>
          </div>
        </CardContent>
      </Card>
      <TransactionModal txState={txState} onClose={resetTx} title="Supply" />
    </>
  );
}
