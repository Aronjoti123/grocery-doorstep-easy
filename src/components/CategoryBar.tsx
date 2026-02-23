import { Category, CATEGORY_LABELS } from '@/types/grocery';

interface CategoryBarProps {
  selected: Category | 'all';
  onSelect: (cat: Category | 'all') => void;
}

const CategoryBar = ({ selected, onSelect }: CategoryBarProps) => {
  const categories: (Category | 'all')[] = ['all', 'fruits', 'vegetables', 'dairy', 'snacks', 'staples'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === cat
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          {cat === 'all' ? '🛒 All' : CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
