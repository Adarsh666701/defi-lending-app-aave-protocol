interface HealthFactorProps {
  healthFactor: string;
  size?: "sm" | "lg";
}

export function HealthFactor({ healthFactor, size = "sm" }: HealthFactorProps) {
  const hf = healthFactor === "∞" ? Infinity : parseFloat(healthFactor);
  
  let colorClass = "text-safe";
  let label = "Safe";
  let glowClass = "glow-safe";
  
  if (hf < 1) {
    colorClass = "text-destructive";
    label = "Liquidatable";
    glowClass = "glow-danger";
  } else if (hf < 1.2) {
    colorClass = "text-destructive";
    label = "Danger";
    glowClass = "glow-danger";
  } else if (hf < 2) {
    colorClass = "text-warning";
    label = "Warning";
    glowClass = "glow-warning";
  }

  const isLarge = size === "lg";

  return (
    <div className={`flex items-center gap-2 ${isLarge ? "flex-col" : ""}`}>
      <div className={`rounded-lg bg-card border border-border px-3 py-1.5 ${glowClass}`}>
        <span className={`font-mono font-bold ${colorClass} ${isLarge ? "text-2xl" : "text-sm"}`}>
          {healthFactor === "∞" ? "∞" : parseFloat(healthFactor).toFixed(2)}
        </span>
      </div>
      <span className={`text-xs ${colorClass} font-medium`}>{label}</span>
    </div>
  );
}
