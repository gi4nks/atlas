import { AppStatus } from '@/types/app';

interface Props {
  status: AppStatus;
}

const colors: Record<AppStatus, string> = {
  idea: 'badge-ghost',
  prototype: 'badge-info',
  mvp: 'badge-primary',
  beta: 'badge-secondary',
  production: 'badge-accent',
  paused: 'badge-warning',
  abandoned: 'badge-error',
};

export default function StatusBadge({ status }: Props) {
  return (
    <div className={`badge ${colors[status]} gap-2 capitalize`}>
      {status}
    </div>
  );
}
