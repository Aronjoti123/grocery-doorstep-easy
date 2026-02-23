import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input
      placeholder="Search groceries..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="pl-10 bg-card border-border"
    />
  </div>
);

export default SearchBar;
