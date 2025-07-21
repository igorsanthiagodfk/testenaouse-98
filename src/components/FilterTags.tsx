import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, Store, Truck, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface FilterTagsProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  filterOptions?: FilterOption[];
}

const defaultFilterOptions = [
  { id: 'retail', label: 'Varejo', icon: Store, description: 'Lojas e comércios em geral' },
  { id: 'supermarket', label: 'Supermercados', icon: ShoppingCart, description: 'Mercados e hipermercados' },
  { id: 'distributor', label: 'Distribuidoras', icon: Truck, description: 'Atacados e distribuidoras' },
  { id: 'services', label: 'Serviços', icon: Building2, description: 'Empresas de serviços' }
];

const FilterTags: React.FC<FilterTagsProps> = ({ activeFilters, onFilterChange, filterOptions = defaultFilterOptions }) => {
  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(f => f !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      <Badge
        variant={activeFilters.length === 0 ? "default" : "outline"}
        className={cn(
          "cursor-pointer transition-all duration-[1.5s] px-4 py-2 text-sm",
          activeFilters.length === 0 
            ? "bg-accent text-accent-foreground shadow-glow" 
            : "hover:bg-accent/10 hover:text-accent hover:border-accent"
        )}
        onClick={clearAllFilters}
      >
        Todas as categorias
      </Badge>
      
      {filterOptions.map((option) => {
        const isActive = activeFilters.includes(option.id);
        const IconComponent = option.icon;
        
        return (
          <Badge
            key={option.id}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all duration-[1.5s] px-4 py-2 text-sm",
              isActive 
                ? "bg-accent text-accent-foreground shadow-glow" 
                : "hover:bg-accent/10 hover:text-accent hover:border-accent"
            )}
            onClick={() => toggleFilter(option.id)}
          >
            <IconComponent className="h-3 w-3 mr-1.5" />
            {option.label}
          </Badge>
        );
      })}
    </div>
  );
};

export default FilterTags;