import { Badge } from '@/components/ui/Badge';
import { ClientStatus, HealthGoal } from '@/lib/types';

export function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <Badge variant={status === 'active' ? 'green' : 'red'}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </Badge>
  );
}

export function GoalBadge({ goal }: { goal: HealthGoal }) {
  const map: Record<HealthGoal, { label: string; variant: 'emerald' | 'purple' | 'blue' | 'gray' }> = {
    weight_management: { label: 'Weight Mgmt', variant: 'emerald' },
    pcos: { label: 'PCOS', variant: 'purple' },
    sugar_control: { label: 'Sugar Control', variant: 'blue' },
    other: { label: 'Other', variant: 'gray' },
  };
  const { label, variant } = map[goal] || { label: goal, variant: 'gray' };
  return <Badge variant={variant}>{label}</Badge>;
}
