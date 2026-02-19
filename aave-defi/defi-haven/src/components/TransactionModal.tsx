import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TxState } from "@/hooks/useTransactions";
import { BLOCK_EXPLORER } from "@/config/contracts";
import { Loader2, CheckCircle, XCircle, Pen } from "lucide-react";

interface TransactionModalProps {
  txState: TxState;
  onClose: () => void;
  title?: string;
}

export function TransactionModal({ txState, onClose, title = "Transaction" }: TransactionModalProps) {
  const isOpen = txState.status !== "idle";

  return (
    <Dialog open={isOpen} onOpenChange={() => txState.status !== "pending" && txState.status !== "signing" && onClose()}>
      <DialogContent className="glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          {txState.status === "signing" && (
            <>
              <Pen className="h-12 w-12 text-primary animate-pulse" />
              <p className="text-sm text-muted-foreground">Waiting for wallet signature…</p>
            </>
          )}
          {txState.status === "pending" && (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Transaction pending…</p>
              {txState.hash && (
                <a
                  href={`${BLOCK_EXPLORER}/tx/${txState.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline font-mono"
                >
                  {txState.hash.slice(0, 10)}…{txState.hash.slice(-8)}
                </a>
              )}
            </>
          )}
          {txState.status === "confirmed" && (
            <>
              <CheckCircle className="h-12 w-12 text-safe" />
              <p className="text-sm text-safe">Transaction confirmed!</p>
              {txState.hash && (
                <a
                  href={`${BLOCK_EXPLORER}/tx/${txState.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline font-mono"
                >
                  View on Explorer
                </a>
              )}
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            </>
          )}
          {txState.status === "failed" && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-sm text-destructive">Transaction failed</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">{txState.error}</p>
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
