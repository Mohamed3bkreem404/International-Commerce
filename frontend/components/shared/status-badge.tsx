import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  value: string;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  if (["PAID", "SUCCESS", "COMPLETED"].includes(value)) {
    return <Badge variant="success" className="font-semibold">{value}</Badge>;
  }

  if (["CANCELLED", "FAILED", "REFUNDED"].includes(value)) {
    return <Badge variant="destructive" className="font-semibold">{value}</Badge>;
  }

  return <Badge variant="warning" className="font-semibold">{value}</Badge>;
}
