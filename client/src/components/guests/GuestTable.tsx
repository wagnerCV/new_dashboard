import { motion } from 'framer-motion';
import { Guest } from '@/types/dashboard';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Edit2, Trash2, Eye } from 'lucide-react';

interface GuestTableProps {
  guests: Guest[];
  isLoading?: boolean;
  onEdit?: (guest: Guest) => void;
  onDelete?: (guest: Guest) => void;
  onView?: (guest: Guest) => void;
}

export function GuestTable({
  guests,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: GuestTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      yes: { bg: 'bg-emerald/10', text: 'text-emerald', label: 'Confirmado' },
      no: { bg: 'bg-burgundy/10', text: 'text-burgundy', label: 'Recusado' },
      maybe: { bg: 'bg-amber/10', text: 'text-amber', label: 'Pendente' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.maybe;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-sand/20 overflow-hidden">
        <div className="p-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-sand/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-sand/20 p-12 text-center">
        <p className="text-soft-black/50 text-lg">Nenhum convidado encontrado</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-sand/20 overflow-hidden"
    >
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sand/20 bg-sand/5">
              <th className="px-6 py-4 text-left text-sm font-semibold text-soft-black">Nome</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-soft-black">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-soft-black">Telefone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-soft-black">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-soft-black">Pessoas</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-soft-black">Data</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-soft-black">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <motion.tr
                key={guest.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-sand/10 hover:bg-sand/5 transition-colors"
              >
                <td className="px-6 py-4 text-soft-black font-medium">{guest.name}</td>
                <td className="px-6 py-4 text-soft-black/70 text-sm">
                  {guest.email || '-'}
                </td>
                <td className="px-6 py-4 text-soft-black/70 text-sm">
                  {guest.phone || '-'}
                </td>
                <td className="px-6 py-4">{getStatusBadge(guest.status)}</td>
                <td className="px-6 py-4 text-soft-black font-medium">
                  {guest.party_size}
                </td>
                <td className="px-6 py-4 text-soft-black/70 text-sm">
                  {format(new Date(guest.created_at), 'dd MMM yyyy', {
                    locale: pt,
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(guest)}
                        className="p-2 hover:bg-terracotta/10 rounded-lg transition-colors text-terracotta"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(guest)}
                        className="p-2 hover:bg-amber/10 rounded-lg transition-colors text-amber"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(guest)}
                        className="p-2 hover:bg-burgundy/10 rounded-lg transition-colors text-burgundy"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {guests.map((guest) => (
          <motion.div
            key={guest.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-sand/5 rounded-lg border border-sand/20 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-soft-black">{guest.name}</p>
                <p className="text-xs text-soft-black/60 mt-1">{guest.email}</p>
              </div>
              {getStatusBadge(guest.status)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-soft-black/60">Telefone</p>
                <p className="font-medium text-soft-black">{guest.phone || '-'}</p>
              </div>
              <div>
                <p className="text-soft-black/60">Pessoas</p>
                <p className="font-medium text-soft-black">{guest.party_size}</p>
              </div>
            </div>

            <p className="text-xs text-soft-black/50">
              {format(new Date(guest.created_at), 'dd MMM yyyy HH:mm', {
                locale: pt,
              })}
            </p>

            {(onView || onEdit || onDelete) && (
              <div className="flex gap-2 pt-2 border-t border-sand/20">
                {onView && (
                  <button
                    onClick={() => onView(guest)}
                    className="flex-1 px-3 py-2 text-xs bg-terracotta/10 text-terracotta rounded hover:bg-terracotta/20 transition-colors font-medium"
                  >
                    Ver
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(guest)}
                    className="flex-1 px-3 py-2 text-xs bg-amber/10 text-amber rounded hover:bg-amber/20 transition-colors font-medium"
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(guest)}
                    className="flex-1 px-3 py-2 text-xs bg-burgundy/10 text-burgundy rounded hover:bg-burgundy/20 transition-colors font-medium"
                  >
                    Deletar
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default GuestTable;
