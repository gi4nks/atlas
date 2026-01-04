import { AppCategory } from '@/types/app';

interface Props {
  category: AppCategory;
}

const colors: Record<AppCategory, string> = {
  personal: 'badge-neutral',
  work: 'badge-primary badge-outline',
  experiment: 'badge-secondary badge-outline',
  archived: 'badge-ghost badge-outline',
};

export default function CategoryBadge({ category }: Props) {
  return (
    <div className={`badge ${colors[category]} gap-2 capitalize`}>
      {category}
    </div>
  );
}
