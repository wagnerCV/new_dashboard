import { motion } from 'framer-motion';
import { GuestStats as GuestStatsType } from '@/types/dashboard';
import { Users, CheckCircle, Clock, XCircle, Users2 } from 'lucide-react';

interface GuestStatsProps {
  stats: GuestStatsType | null;
  isLoading?: boolean;
}

export function GuestStats({ stats, isLoading }: GuestStatsProps) {
  const statCards = [
    {
      label: 'Total de Convidados',
      value: stats?.total_guests || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Confirmados',
      value: stats?.confirmed_guests || 0,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Pendentes',
      value: stats?.pending_guests || 0,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Recusados',
      value: stats?.declined_guests || 0,
      icon: XCircle,
      color: 'from-burgundy to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Pessoas Esperadas',
      value: stats?.total_expected_attendees || 0,
      icon: Users2,
      color: 'from-terracotta to-amber',
      bgColor: 'bg-sand/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`${card.bgColor} rounded-xl p-6 border border-sand/20 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <p className="text-sm text-soft-black/60 mb-2">{card.label}</p>

            {isLoading ? (
              <div className="h-8 bg-sand/20 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-serif font-bold text-soft-black">
                {card.value}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default GuestStats;
