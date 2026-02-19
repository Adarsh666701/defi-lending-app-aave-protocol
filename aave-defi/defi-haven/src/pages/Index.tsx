import { WalletButton } from "@/components/WalletButton";
import { NetworkIndicator } from "@/components/NetworkIndicator";
import { AccountOverview } from "@/components/AccountOverview";
import { SupplyPanel } from "@/components/SupplyPanel";
import { BorrowPanel } from "@/components/BorrowPanel";
import { RepayPanel } from "@/components/RepayPanel";
import { WithdrawPanel } from "@/components/WithdrawPanel";
import { FlashLoanPanel } from "@/components/FlashLoanPanel";
import { CreditDelegationPanel } from "@/components/CreditDelegationPanel";
import { Landmark } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Landmark className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">DeFi Lend</h1>
              <p className="text-[10px] text-muted-foreground">Aave V2 Interface</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NetworkIndicator />
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-8">
        <div className="grid gap-6">
          {/* Account Overview */}
          <AccountOverview />

          {/* Action Panels */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <SupplyPanel />
            <BorrowPanel />
            <RepayPanel />
            <WithdrawPanel />
          </div>

          {/* Advanced */}
          <div className="grid gap-6 md:grid-cols-2">
            <FlashLoanPanel />
            <CreditDelegationPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container text-center text-xs text-muted-foreground">
          Interacting with Aave V2 on Ethereum Mainnet. Use at your own risk.
        </div>
      </footer>
    </div>
  );
};

export default Index;
