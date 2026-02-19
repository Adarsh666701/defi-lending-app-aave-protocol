import { useState, useCallback } from "react";
import { Contract } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionModal } from "./TransactionModal";
import { CONTRACTS, DATA_PROVIDER_ABI, DEBT_TOKEN_ABI, SUPPORTED_ASSETS } from "@/config/contracts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Users } from "lucide-react";

export function CreditDelegationPanel() {
  const { isConnected, provider, address } = useWallet();
  const { txState, resetTx, approveDelegation, borrow } = useTransactions();
  const [selectedAsset, setSelectedAsset] = useState(SUPPORTED_ASSETS[0].symbol);
  const [delegatee, setDelegatee] = useState("");
  const [delegateAmount, setDelegateAmount] = useState("");
  const [borrowerDelegator, setBorrowerDelegator] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [debtTokenAddress, setDebtTokenAddress] = useState("");
  const [delegationAllowance, setDelegationAllowance] = useState<string | null>(null);

  const asset = SUPPORTED_ASSETS.find((a) => a.symbol === selectedAsset)!;

  const fetchDebtToken = useCallback(async () => {
    if (!provider) return;
    try {
      const dp = new Contract(CONTRACTS.LENDING_POOL_DATA_PROVIDER, DATA_PROVIDER_ABI, provider);
      const result = await dp.getReserveTokensAddresses(asset.address);
      setDebtTokenAddress(result[2]); // variableDebtToken
    } catch (err) {
      console.error("Error fetching debt token:", err);
    }
  }, [provider, asset.address]);

  const checkAllowance = useCallback(async () => {
    if (!provider || !address || !debtTokenAddress || !delegatee) return;
    try {
      const contract = new Contract(debtTokenAddress, DEBT_TOKEN_ABI, provider);
      const allow = await contract.borrowAllowance(address, delegatee);
      setDelegationAllowance(allow.toString());
    } catch (err) {
      console.error(err);
    }
  }, [provider, address, debtTokenAddress, delegatee]);

  if (!isConnected) {
    return (
      <Card className="glass gradient-border">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Credit Delegation</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Connect wallet to use credit delegation</p></CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass gradient-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Credit Delegation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 text-xs text-warning">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <p>Credit delegation lets you authorize another address to borrow against your collateral. Use with extreme caution.</p>
            </div>
          </div>

          <Select value={selectedAsset} onValueChange={(v) => { setSelectedAsset(v); setDebtTokenAddress(""); }}>
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

          <Button variant="outline" size="sm" onClick={fetchDebtToken} className="w-full text-xs">
            Fetch Debt Token Address
          </Button>
          {debtTokenAddress && (
            <p className="text-xs font-mono text-muted-foreground truncate">Debt Token: {debtTokenAddress}</p>
          )}

          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs font-semibold text-muted-foreground">As Delegator (approve borrowing)</p>
            <Input
              placeholder="Delegatee address (0x…)"
              value={delegatee}
              onChange={(e) => setDelegatee(e.target.value)}
              className="font-mono text-xs bg-secondary/50"
            />
            <Input
              type="number"
              placeholder="Delegation amount"
              value={delegateAmount}
              onChange={(e) => setDelegateAmount(e.target.value)}
              className="font-mono bg-secondary/50"
            />
            <Button
              onClick={() => debtTokenAddress && approveDelegation(debtTokenAddress, delegatee, delegateAmount, asset.decimals)}
              disabled={!debtTokenAddress || !delegatee || !delegateAmount}
              className="w-full"
              size="sm"
            >
              Approve Delegation
            </Button>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs font-semibold text-muted-foreground">As Borrower (borrow using delegation)</p>
            <Input
              placeholder="Delegator address (0x…)"
              value={borrowerDelegator}
              onChange={(e) => setBorrowerDelegator(e.target.value)}
              className="font-mono text-xs bg-secondary/50"
            />
            <Input
              type="number"
              placeholder="Borrow amount"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className="font-mono bg-secondary/50"
            />
            <Button
              onClick={() => borrow(asset.address, borrowAmount, asset.decimals)}
              disabled={!borrowerDelegator || !borrowAmount}
              className="w-full"
              size="sm"
            >
              Borrow via Delegation
            </Button>
          </div>
        </CardContent>
      </Card>
      <TransactionModal txState={txState} onClose={resetTx} title="Credit Delegation" />
    </>
  );
}
