import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterBarProps {
  pdvFilter: string;
  onPdvFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ pdvFilter, onPdvFilterChange, onClearFilters }) => {
  console.log('[FilterBar] Renderizando com filtro:', pdvFilter);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 p-4 bg-muted/20 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <span className="text-sm font-medium text-foreground">Filtrar por:</span>
        
        <Select value={pdvFilter} onValueChange={onPdvFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Faixa de PDVs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os sistemas</SelectItem>
            <SelectItem value="1-3">Até 3 PDVs</SelectItem>
            <SelectItem value="4-5">4-5 PDVs</SelectItem>
            <SelectItem value="6-10">6-10 PDVs</SelectItem>
            <SelectItem value="unlimited">Ilimitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {pdvFilter !== 'all' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};

export default FilterBar;