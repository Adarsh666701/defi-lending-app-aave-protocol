import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/hooks/useWallet";
import { useAaveAccountData } from "@/hooks/useAaveAccountData";
import { HealthFactor } from "./HealthFactor";
import { TrendingUp, TrendingDown, Landmark, Shield } from "lucide-react";

export function AccountOverview() {
  const { isConnected } = useWallet();
  const data = useAaveAccountData();

  if (!isConnected) {
    return (
      <Card className="glass gradient-border col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <Landmark className="h-12 w-12 text-primary/40" />
          <p className="text-muted-foreground">Connect your wallet to view account data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass gradient-border col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Account Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> Collateral
            </div>
            <p className="font-mono text-lg font-bold">
              {parseFloat(data.totalCollateralETH).toFixed(4)}
              <span className="text-xs text-muted-foreground ml-1">ETH</span>
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingDown className="h-3.5 w-3.5" /> Debt
            </div>
            <p className="font-mono text-lg font-bold">
              {parseFloat(data.totalDebtETH).toFixed(4)}
              <span className="text-xs text-muted-foreground ml-1">ETH</span>
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Landmark className="h-3.5 w-3.5" /> Available
            </div>
            <p className="font-mono text-lg font-bold">
              {parseFloat(data.availableBorrowsETH).toFixed(4)}
              <span className="text-xs text-muted-foreground ml-1">ETH</span>
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" /> LTV / Liq.
            </div>
            <p className="font-mono text-lg font-bold">
              {data.ltv}%
              <span className="text-xs text-muted-foreground ml-1">/ {data.liquidationThreshold}%</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Health Factor</p>
            <HealthFactor healthFactor={data.healthFactor} size="lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
