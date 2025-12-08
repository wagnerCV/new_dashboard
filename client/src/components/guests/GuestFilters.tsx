import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { GuestFilters as GuestFiltersType } from '@/types/dashboard';
import { Input } from '@/components/ui/input';

interface GuestFiltersProps {
  filters: GuestFiltersType;
  onFiltersChange: (filters: GuestFiltersType) => void;
}

export function GuestFilters({ filters, onFiltersChange }: GuestFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchTerm: value,
    });
  };

  const handleStatusChange = (status: 'all' | 'yes' | 'no' | 'maybe') => {
    onFiltersChange({
      ...filters,
      status,
    });
  };

  const handleSortChange = (sortBy: 'name' | 'created_at' | 'status') => {
    onFiltersChange({
      ...filters,
      sortBy,
    });
  };

  const handleSortOrderChange = (sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      ...filters,
      sortOrder,
    });
  };

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'yes', label: 'Confirmados' },
    { value: 'maybe', label: 'Pendentes' },
    { value: 'no', label: 'Recusados' },
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Data de Resposta' },
    { value: 'name', label: 'Nome' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-sand/20 p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-soft-black mb-2">
            Pesquisar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-black/40" />
            <Input
              type="text"
              placeholder="Nome ou email..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 border-sand/30 focus:border-terracotta"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-soft-black mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              handleStatusChange(
                e.target.value as 'all' | 'yes' | 'no' | 'maybe'
              )
            }
            className="w-full px-4 py-2 rounded-lg border border-sand/30 bg-white text-soft-black focus:border-terracotta focus:outline-none transition-colors"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-soft-black mb-2">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              handleSortChange(
                e.target.value as 'name' | 'created_at' | 'status'
              )
            }
            className="w-full px-4 py-2 rounded-lg border border-sand/30 bg-white text-soft-black focus:border-terracotta focus:outline-none transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-soft-black mb-2">
            Ordem
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) =>
              handleSortOrderChange(e.target.value as 'asc' | 'desc')
            }
            className="w-full px-4 py-2 rounded-lg border border-sand/30 bg-white text-soft-black focus:border-terracotta focus:outline-none transition-colors"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>

      {(filters.searchTerm || filters.status !== 'all') && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-sand/20">
          {filters.searchTerm && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm"
            >
              <span>Pesquisa: {filters.searchTerm}</span>
              <button
                onClick={() => handleSearchChange('')}
                className="hover:text-terracotta/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {filters.status !== 'all' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm"
            >
              <span>
                Status:{' '}
                {statusOptions.find((s) => s.value === filters.status)?.label}
              </span>
              <button
                onClick={() => handleStatusChange('all')}
                className="hover:text-terracotta/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default GuestFilters;
