import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemCategory } from '@/contexts/SystemDataContext';

interface FilteredProductGridProps {
  categories: SystemCategory[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  productCount?: { [key: string]: number };
}

const FilteredProductGrid: React.FC<FilteredProductGridProps> = ({ 
  categories, 
  activeFilters, 
  onFilterChange,
  productCount = {}
}) => {
  const toggleFilter = (categoryId: string) => {
    if (activeFilters.includes(categoryId)) {
      onFilterChange(activeFilters.filter(f => f !== categoryId));
    } else {
      onFilterChange([...activeFilters, categoryId]);
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
        <Package className="h-3 w-3 mr-1.5" />
        Todas as categorias
      </Badge>
      
      {categories
        .sort((a, b) => parseInt(a.ordem || '0') - parseInt(b.ordem || '0'))
        .map((category) => {
          const isActive = activeFilters.includes(category.id);
          const count = productCount[category.id] || 0;
          
          return (
            <Badge
              key={category.id}
              variant={isActive ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-[1.5s] px-4 py-2 text-sm",
                isActive 
                  ? "bg-accent text-accent-foreground shadow-glow" 
                  : "hover:bg-accent/10 hover:text-accent hover:border-accent"
              )}
              onClick={() => toggleFilter(category.id)}
            >
              <Package className="h-3 w-3 mr-1.5" />
              {category.nome}
              {count > 0 && (
                <span className="ml-1 text-xs opacity-70">
                  ({count})
                </span>
              )}
            </Badge>
          );
        })
      }
    </div>
  );
};

export default FilteredProductGrid;